import ast
import json
import os
import sys
import time

import requests
from datetime import datetime, timezone
from urllib.parse import urlencode
try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv(path=None):
        return None

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL') or os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY') or os.getenv('SUPABASE_KEY')
UNIVERSITY_API_URL = 'http://appserver.fet.edu.jo:7778/courses/actions/rmiMethod'

if not SUPABASE_URL or not SUPABASE_KEY:
    print('[ERROR] Supabase URL or key is missing.', file=sys.stderr)
    sys.exit(1)

SUPABASE_HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
}
UPSERT_HEADERS = {**SUPABASE_HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal'}


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def clean(value):
    if value is None:
        return ''
    return ' '.join(str(value).replace('\xa0', ' ').split()).strip()


def normalize_status(value):
    raw = clean(value).lower()
    if raw in {'2', 'ملغاة', 'ملغى', 'cancelled', 'canceled'}:
        return '2'
    if raw in {'3', 'مغلقة', 'مغلق', 'closed'}:
        return '3'
    if raw in {'1', 'متاحة', 'متاح', 'open', 'available'}:
        return '1'
    return raw or '1'


def university_request(method, params=None):
    params = params or []
    body = urlencode({'method': method, 'paramsCount': len(params), **{f'param{i}': value for i, value in enumerate(params)}})
    try:
        response = requests.post(
            UNIVERSITY_API_URL,
            headers={'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache'},
            data=body,
            timeout=45,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise RuntimeError(f'{method} request failed: {exc}') from exc

    content = response.content
    try:
        text = content.decode('utf-8')
    except UnicodeDecodeError:
        text = content.decode('windows-1256', errors='replace')
    if not text.strip():
        return []
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            return ast.literal_eval(text)
        except (ValueError, SyntaxError) as exc:
            raise RuntimeError(f'{method} returned invalid data: {text[:160]}') from exc


def supabase_request(method, table, *, params=None, payload=None, headers=None):
    url = f'{SUPABASE_URL}/rest/v1/{table}'
    response = requests.request(
        method,
        url,
        headers=headers or SUPABASE_HEADERS,
        params=params,
        json=payload,
        timeout=45,
    )
    if response.status_code >= 300:
        raise RuntimeError(f'Supabase {method} {table} failed: {response.status_code} {response.text[:300]}')
    if not response.text.strip():
        return []
    return response.json()


def upsert(table, rows, on_conflict=None):
    if not rows:
        return
    headers = UPSERT_HEADERS.copy()
    if on_conflict:
        headers['Prefer'] += f',resolution=merge-duplicates'
        endpoint = f'{table}'
        supabase_request('POST', endpoint, params={'on_conflict': on_conflict}, payload=rows, headers=headers)
    else:
        supabase_request('POST', table, payload=rows, headers=headers)


def patch_row(row_id, patch):
    supabase_request('PATCH', 'university_courses', params={'id': f'eq.{row_id}'}, payload=patch, headers={**SUPABASE_HEADERS, 'Prefer': 'return=minimal'})


def fetch_existing_scope(degree_id, college_id, department_id):
    return supabase_request(
        'GET',
        'university_courses',
        params={
            'select': 'id,course_no,section_no,degree_id,college_id,department_id,status',
            'degree_id': f'eq.{degree_id}',
            'college_id': f'eq.{college_id}',
            'department_id': f'eq.{department_id}',
            'limit': '5000',
        },
    )


def parse_page_count(value):
    if isinstance(value, list) and value:
        try:
            return max(1, int(value[0]))
        except (TypeError, ValueError):
            return 1
    if isinstance(value, (int, float, str)):
        try:
            return max(1, int(value))
        except (TypeError, ValueError):
            return 1
    return 1


def sync():
    started = now_iso()
    print(f'[{started}] Starting official FET course sync.')
    degrees = university_request('getDegrees')
    colleges = university_request('getColleges')
    if not isinstance(degrees, list) or not isinstance(colleges, list) or not degrees or not colleges:
        raise RuntimeError('The official source returned no degrees or colleges; refusing to modify the database.')

    upsert('degrees', [{'id': str(x['id']), 'name': clean(x.get('name'))} for x in degrees], 'id')
    upsert('colleges', [{'id': str(x['id']), 'name': clean(x.get('name'))} for x in colleges], 'id')

    departments_by_college = {}
    for college in colleges:
        college_id = str(college['id'])
        departments = university_request('getDepartments', [college_id])
        if not isinstance(departments, list):
            raise RuntimeError(f'Invalid departments response for college {college_id}.')
        departments_by_college[college_id] = departments
        upsert('departments', [
            {'id': str(d['id']), 'name': clean(d.get('name')), 'college_id': college_id}
            for d in departments
        ], 'id')
        time.sleep(0.15)

    total_seen = 0
    total_cancelled = 0
    scope_count = 0
    for degree in degrees:
        degree_id = str(degree['id'])
        for college in colleges:
            college_id = str(college['id'])
            for department in departments_by_college.get(college_id, []):
                department_id = str(department['id'])
                scope_count += 1
                page_count = parse_page_count(university_request('getCoursesPagesCount', [degree_id, college_id, department_id]))
                rows = []
                for page in range(1, page_count + 1):
                    page_rows = university_request('getCourses', [degree_id, college_id, department_id, page])
                    if not isinstance(page_rows, list):
                        raise RuntimeError(f'Invalid courses response for {degree_id}/{college_id}/{department_id} page {page}.')
                    for item in page_rows:
                        status = normalize_status(item.get('status'))
                        row = {
                            'course_no': clean(item.get('no')),
                            'name': clean(item.get('name')),
                            'hours': clean(item.get('hours')),
                            'status': status,
                            'rooms': clean(item.get('rooms')),
                            'times': clean(item.get('times')),
                            'lecturers': clean(item.get('lecturers')),
                            'remarks': clean(item.get('remarks')),
                            'section_no': clean(item.get('sectionNo')) or '1',
                            'degree_id': degree_id,
                            'college_id': college_id,
                            'department_id': department_id,
                            'last_updated': now_iso(),
                        }
                        if not row['course_no']:
                            continue
                        rows.append(row)
                        total_seen += 1
                        total_cancelled += status == '2'
                    time.sleep(0.08)

                if not rows and page_count > 0:
                    # A valid empty scope is allowed; stale rows in that scope become cancelled.
                    pass
                unique_rows = {}
                for row in rows:
                    key = (row['course_no'], row['section_no'], row['degree_id'], row['college_id'], row['department_id'])
                    unique_rows[key] = row
                rows = list(unique_rows.values())
                upsert('university_courses', rows, 'course_no,section_no,degree_id,college_id,department_id')

                current_keys = {(r['course_no'], r['section_no']) for r in rows}
                existing = fetch_existing_scope(degree_id, college_id, department_id)
                for old in existing:
                    key = (clean(old.get('course_no')), clean(old.get('section_no')))
                    if key not in current_keys and old.get('status') != '2':
                        patch_row(old['id'], {'status': '2', 'last_updated': now_iso(), 'remarks': 'غير موجود في آخر جريدة رسمية'})
                time.sleep(0.1)

    print(f'[{now_iso()}] Sync completed: {total_seen} rows, {total_cancelled} cancelled, {scope_count} scopes.')
    return total_seen


if __name__ == '__main__':
    try:
        count = sync()
        if count <= 0:
            raise RuntimeError('No course rows were returned; refusing to report success.')
    except Exception as exc:
        print(f'[ERROR] {exc}', file=sys.stderr)
        sys.exit(1)
