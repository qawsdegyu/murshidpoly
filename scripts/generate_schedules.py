import json
import requests
import os
from dotenv import load_dotenv
from datetime import time, timedelta
import random
import hashlib

# Load environment variables
load_dotenv()

# Configuration from environment variables
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")

SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Helper function to fetch courses from Supabase
def fetch_courses_from_supabase(degree_id, college_id, department_id):
    url = f"{SUPABASE_URL}/rest/v1/university_courses"
    params = {
        "degree_id": f"eq.{degree_id}",
        "college_id": f"eq.{college_id}",
        "department_id": f"eq.{department_id}",
        "select": "*"
    }
    response = requests.get(url, headers=SUPABASE_HEADERS, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"[ERROR] Failed to fetch courses from Supabase. Status: {response.status_code}, Response: {response.text}")
        return []

# --- Schedule Generation Logic ---

DAYS_MAP = {
    "ح": "Sunday",
    "ن": "Monday",
    "ث": "Tuesday",
    "ر": "Wednesday",
    "خ": "Thursday",
    "ج": "Friday",
    "س": "Saturday",
}

def parse_time_string(time_str):
    try:
        start_time_str, end_time_str = time_str.split(" ")
        start_h, start_m = map(int, start_time_str.split(":"))
        end_h, end_m = map(int, end_time_str.split(":"))
        return time(start_h, start_m), time(end_h, end_m)
    except Exception as e:
        return None, None

def parse_course_times(times_str):
    schedules = []
    if not times_str: return schedules
    time_blocks = times_str.split("<br><br>")
    for block in time_blocks:
        parts = block.strip().split(" ")
        if len(parts) < 3:
            continue
        
        days_raw = parts[0]
        time_range_str = f"{parts[-2]} {parts[-1]}"
        
        start_t, end_t = parse_time_string(time_range_str)
        if start_t and end_t:
            for day_char in days_raw:
                day_name = DAYS_MAP.get(day_char)
                if day_name:
                    schedules.append({"day": day_name, "start": start_t, "end": end_t})
    return schedules

def has_conflict(schedule1, schedule2):
    if schedule1["day"] != schedule2["day"]:
        return False
    
    s1_start_minutes = schedule1["start"].hour * 60 + schedule1["start"].minute
    s1_end_minutes = schedule1["end"].hour * 60 + schedule1["end"].minute
    s2_start_minutes = schedule2["start"].hour * 60 + schedule2["start"].minute
    s2_end_minutes = schedule2["end"].hour * 60 + schedule2["end"].minute

    if s1_start_minutes < s2_end_minutes and s2_start_minutes < s1_end_minutes:
        return True
    return False

def calculate_schedule_score(schedule, schedule_type):
    score = 0
    days_covered = set()
    total_hours = 0
    gaps = 0
    daily_load = {}
    earliest_start = time(23, 59)
    latest_end = time(0, 0)

    for course in schedule:
        total_hours += int(course.get("hours", 0))
        for slot in course["parsed_schedules"]:
            days_covered.add(slot["day"])
            day = slot["day"]
            start_minutes = slot["start"].hour * 60 + slot["start"].minute
            end_minutes = slot["end"].hour * 60 + slot["end"].minute
            
            if day not in daily_load:
                daily_load[day] = []
            daily_load[day].append((start_minutes, end_minutes))

            if slot["start"] < earliest_start: earliest_start = slot["start"]
            if slot["end"] > latest_end: latest_end = slot["end"]
    
    for day in daily_load:
        daily_load[day].sort()
        for i in range(1, len(daily_load[day])):
            gaps += daily_load[day][i][0] - daily_load[day][i-1][1]

    # Penalize schedules that are too long overall
    time_span = (latest_end.hour * 60 + latest_end.minute) - (earliest_start.hour * 60 + earliest_start.minute)
    if time_span > 12 * 60: # More than 12 hours spread
        score -= (time_span - 12 * 60) / 60 

    if schedule_type == "intensive":
        score += (7 - len(days_covered)) * 30 # High priority on fewer days
        score -= gaps / 20 # High penalty on gaps
        score += total_hours * 10
    elif schedule_type == "relaxed":
        score += len(days_covered) * 15 # High priority on spreading over days
        score += gaps / 10 # Reward gaps
        score -= total_hours * 5
    else: # balanced
        score += (len(days_covered) - 4) * -15 # Aim for 4 days
        score -= abs(gaps / 60 - total_hours / max(1, len(daily_load))) * 10
        score += total_hours * 8
    
    # Add a small random factor to the score to break ties and increase variety
    score += random.uniform(-5, 5)
    
    return score

def get_schedule_fingerprint(schedule):
    course_identifiers = []
    for course in schedule:
        course_identifiers.append(f"{course.get('course_no')}-{course.get('section_no')}")
    return hashlib.md5("-".join(sorted(course_identifiers)).encode()).hexdigest()

def solve_schedule_backtracking(all_courses_by_no, current_schedule, current_credits, 
                                  remaining_course_nos, schedule_type, max_credits, min_credits, 
                                  generated_schedules, num_schedules_to_generate, seen_fingerprints):
    
    if len(generated_schedules) >= num_schedules_to_generate:
        return True # Found enough schedules

    if not remaining_course_nos:
        # Base case: no more courses to add
        if min_credits <= current_credits <= max_credits:
            fingerprint = get_schedule_fingerprint(current_schedule)
            if fingerprint not in seen_fingerprints:
                generated_schedules.append({
                    "type": schedule_type,
                    "courses": list(current_schedule),
                    "total_credits": current_credits,
                })
                seen_fingerprints.add(fingerprint)
        return False # Continue searching for other combinations

    course_no_to_add = remaining_course_nos[0]
    next_remaining_course_nos = remaining_course_nos[1:]

    # Option 1: Don't include this course
    if solve_schedule_backtracking(all_courses_by_no, current_schedule, current_credits, 
                                   next_remaining_course_nos, schedule_type, max_credits, min_credits, 
                                   generated_schedules, num_schedules_to_generate, seen_fingerprints):
        return True

    # Option 2: Try to include this course with one of its sections
    possible_sections = list(all_courses_by_no[course_no_to_add]) # Make a copy to shuffle
    random.shuffle(possible_sections) # Introduce randomness for variety

    # Apply specific biases for section selection based on schedule_type
    if schedule_type == "intensive":
        possible_sections.sort(key=lambda c: (
            min(slot["start"].hour * 60 + slot["start"].minute for slot in c["parsed_schedules"]) if c["parsed_schedules"] else 24*60,
            max(slot["end"].hour * 60 + slot["end"].minute for slot in c["parsed_schedules"]) if c["parsed_schedules"] else 0
        ))
    elif schedule_type == "relaxed":
        possible_sections.sort(key=lambda c: (
            max(slot["start"].hour * 60 + slot["start"].minute for slot in c["parsed_schedules"]) if c["parsed_schedules"] else 0,
            len(set(slot["day"] for slot in c["parsed_schedules"])) * -1, # More days is better for relaxed
            random.random() # Random tie-breaker
        ), reverse=True)
    elif schedule_type == "balanced":
        possible_sections.sort(key=lambda c: (
            abs((min(slot["start"].hour for slot in c["parsed_schedules"]) if c["parsed_schedules"] else 0) - 9), # Aim for 9 AM start
            abs((max(slot["end"].hour for slot in c["parsed_schedules"]) if c["parsed_schedules"] else 0) - 17) # Aim for 5 PM end
        ))

    for section in possible_sections:
        section_credits = int(section.get("hours", 0))
        if current_credits + section_credits > max_credits:
            continue

        has_conflict_with_current = False
        for new_slot in section["parsed_schedules"]:
            for existing_course in current_schedule:
                for existing_slot in existing_course["parsed_schedules"]:
                    if has_conflict(new_slot, existing_slot):
                        has_conflict_with_current = True
                        break
                if has_conflict_with_current:
                    break
            if has_conflict_with_current:
                break

        if not has_conflict_with_current:
            current_schedule.append(section)
            if solve_schedule_backtracking(all_courses_by_no, current_schedule, current_credits + section_credits, 
                                           next_remaining_course_nos, schedule_type, max_credits, min_credits, 
                                           generated_schedules, num_schedules_to_generate, seen_fingerprints):
                return True
            current_schedule.pop() # Backtrack

    return False

def generate_schedules(available_courses, schedule_type="balanced", max_credits=21, min_credits=12, num_schedules_to_generate=3):
    random.seed(os.urandom(8)) # Initialize random seed with fresh entropy for each call

    valid_courses = []
    for course in available_courses:
        if course.get("times") and course.get("times") != "null":
            course["parsed_schedules"] = parse_course_times(course["times"])
            if course["parsed_schedules"]:
                valid_courses.append(course)

    if not valid_courses:
        return []

    courses_by_no = {}
    for course in valid_courses:
        course_no = course.get("course_no")
        if course_no not in courses_by_no:
            courses_by_no[course_no] = []
        courses_by_no[course_no].append(course)

    all_course_nos = list(courses_by_no.keys())
    random.shuffle(all_course_nos) # Shuffle initial order for more variety

    generated_schedules = []
    seen_fingerprints = set()

    # We will try to generate more schedules than requested to ensure diversity
    attempts_multiplier = 5 
    target_schedules_to_find = num_schedules_to_generate * attempts_multiplier

    for _ in range(target_schedules_to_find * 2):
        temp_generated_schedules = []
        temp_seen_fingerprints = set(seen_fingerprints) 
        shuffled_course_nos_for_attempt = list(all_course_nos)
        random.shuffle(shuffled_course_nos_for_attempt)

        solve_schedule_backtracking(courses_by_no, [], 0, 
                                   shuffled_course_nos_for_attempt, schedule_type, max_credits, min_credits, 
                                   temp_generated_schedules, 1, temp_seen_fingerprints)
        
        if temp_generated_schedules:
            for sched in temp_generated_schedules:
                sched["score"] = calculate_schedule_score(sched["courses"], schedule_type)
                fingerprint = get_schedule_fingerprint(sched["courses"])
                if fingerprint not in seen_fingerprints:
                    generated_schedules.append(sched)
                    seen_fingerprints.add(fingerprint)
        
        if len(generated_schedules) >= target_schedules_to_find:
            break

    return sorted(generated_schedules, key=lambda s: s["score"], reverse=True)[:num_schedules_to_generate]


if __name__ == "__main__":
    # Test execution
    example_degree_id = "3" 
    example_college_id = "2" 
    example_department_id = "1" 

    available_courses = fetch_courses_from_supabase(example_degree_id, example_college_id, example_department_id)
    
    if available_courses:
        for s_type in ["intensive", "balanced", "relaxed"]:
            print(f"\n--- Generating {s_type.upper()} Schedules ---")
            results = generate_schedules(available_courses, schedule_type=s_type, num_schedules_to_generate=3)
            if not results:
                print(f"  No {s_type} schedules could be generated.")
            for i, res in enumerate(results):
                print(f"  Option {i+1} (Credits: {res['total_credits']}, Score: {res['score']:.2f})")
                for c in res["courses"]:
                    print(f"    - {c['name']} (Sec: {c['section_no']}) - {c['times']}")
    else:
        print("No courses available.")
