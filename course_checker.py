import requests
import json
import ast
import os
import time
from datetime import datetime

API_URL = "http://appsrv2.fet.edu.jo:7777/courses/actions/rmiMethod"
HEADERS = {
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

DATA_FILE = "previous_data.json"

def send_request(method, params=None):
    if params is None:
        params = []
    
    param_str = f"method={method}&paramsCount={len(params)}"
    for i, p in enumerate(params):
        param_str += f"&param{i}={p}"
        
    try:
        response = requests.post(API_URL, headers=HEADERS, data=param_str, timeout=15)
        response.raise_for_status()
        
        text = response.text
        if not text:
            return None
            
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            try:
                # The API sometimes returns Python-like literals instead of strict JSON
                return ast.literal_eval(text)
            except Exception:
                return None
    except Exception as e:
        print(f"Error fetching {method}: {e}")
        return None

def fetch_all_bachelor_courses():
    print(f"[{datetime.now()}] Fetching current university data...")
    degree_id = "3"  # Bachelor
    college_id = "2" # Engineering Technology
    
    departments = send_request("getDepartments", [college_id])
    if not departments:
        print("Failed to fetch departments.")
        return []
        
    all_sections = []
    
    for dept in departments:
        dept_id = dept["id"]
        pages_info = send_request("getCoursesPagesCount", [degree_id, college_id, dept_id])
        
        total_pages = 1
        if pages_info and isinstance(pages_info, list) and len(pages_info) > 0:
            try:
                total_pages = int(pages_info[0])
            except ValueError:
                pass
                
        for page in range(1, total_pages + 1):
            courses = send_request("getCourses", [degree_id, college_id, dept_id, page])
            if courses:
                for c in courses:
                    # Add department info for context
                    c["department_name"] = dept["name"]
                    all_sections.append(c)
                    
            time.sleep(0.1) # Be nice to the server
            
    return all_sections

def compare_and_report(old_data, new_data):
    # Create dictionaries keyed by a unique identifier (course no + section no)
    old_dict = {f"{c['no']}_{c['sectionNo']}": c for c in old_data}
    new_dict = {f"{c['no']}_{c['sectionNo']}": c for c in new_data}
    
    added = []
    removed = []
    changed = []
    
    # Check for new or changed sections
    for key, new_course in new_dict.items():
        if key not in old_dict:
            added.append(new_course)
        else:
            old_course = old_dict[key]
            differences = {}
            # Check for changes in these specific fields
            for field in ["times", "rooms", "lecturers", "status", "remarks"]:
                if new_course.get(field) != old_course.get(field):
                    differences[field] = {"old": old_course.get(field), "new": new_course.get(field)}
            
            if differences:
                changed.append({"course": new_course, "changes": differences})
                
    # Check for removed sections
    for key, old_course in old_dict.items():
        if key not in new_dict:
            removed.append(old_course)
            
    # Print Report
    print("\n" + "="*60)
    print("📋 UNIVERSITY COURSES CHANGE REPORT")
    print("="*60)
    
    if not added and not removed and not changed:
        print("✅ No changes detected since last run. Everything is up to date.")
        return
        
    if added:
        print(f"\n🟢 NEW SECTIONS ADDED ({len(added)}):")
        for c in added:
            print(f"  - {c['name']} (No: {c['no']}, Section: {c['sectionNo']})")
            print(f"    Instructor: {c.get('lecturers', 'N/A')} | Time: {c.get('times', 'N/A')}")
            
    if removed:
        print(f"\n🔴 SECTIONS REMOVED ({len(removed)}):")
        for c in removed:
            print(f"  - {c['name']} (No: {c['no']}, Section: {c['sectionNo']})")
            
    if changed:
        print(f"\n🟡 SECTIONS MODIFIED ({len(changed)}):")
        for item in changed:
            c = item["course"]
            diffs = item["changes"]
            print(f"  - {c['name']} (No: {c['no']}, Section: {c['sectionNo']}):")
            for field, vals in diffs.items():
                print(f"      * {field}: '{vals['old']}'  =>  '{vals['new']}'")

def main():
    print("Starting University Course Monitor (Bachelor Degree)...")
    new_data = fetch_all_bachelor_courses()
    
    if not new_data:
        print("Failed to fetch data. Exiting.")
        return
        
    print(f"Successfully fetched {len(new_data)} total sections from the server.")
    
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            try:
                old_data = json.load(f)
                compare_and_report(old_data, new_data)
            except json.JSONDecodeError:
                print("Could not read previous data. Creating new baseline.")
    else:
        print("\n[INFO] No previous data found. Saving current data as the baseline reference.")
        
    # Save the new data to be the baseline for the next run
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
        
    print(f"\nData successfully saved to {DATA_FILE}")

if __name__ == "__main__":
    main()
