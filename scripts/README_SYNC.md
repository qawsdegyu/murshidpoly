# FET University Data Sync Instructions

This script synchronizes course schedules from the FET University system to the `hadeed.shop` Supabase database.

## Prerequisites
- Python 3.7+
- `requests` library
- `python-dotenv` library

## Setup
1. **Apply SQL Migration**:
   Run the content of `sql/university_sync_tables.sql` in your Supabase SQL Editor. This will create the necessary tables and RLS policies.

2. **Install Dependencies**:
   ```bash
   pip install requests python-dotenv
   ```

3. **Configure Environment Variables**:
   Ensure you have a `.env.local` file in the project root with the following variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Run the Script**:
   ```bash
   python scripts/sync_university_data.py
   ```

## Automation (GitHub Actions)
You can automate this sync by creating a GitHub Action that runs this script daily.

Example Workflow (`.github/workflows/sync.yml`):
```yaml
name: University Sync
on:
  schedule:
    - cron: '0 0 * * *' # Run daily at midnight
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install requests python-dotenv
      - name: Run sync
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: python scripts/sync_university_data.py
```


## التشغيل الحالي

تستخدم المزامنة المصدر الرسمي `http://appserver.fet.edu.jo:7778/courses/actions/rmiMethod` كل ست ساعات عبر GitHub Actions. كما توجد وظيفة Supabase باسم `sync-university-courses` يستدعيها زر تحديث جريدة المواد في لوحة الإدارة للمشرفين. الحالة `2` (ملغاة) تُستبعد من العرض، والحالة `3` (مغلقة) تبقى محفوظة ومعروضة للذكاء الاصطناعي مع وسم الإغلاق. إذا أعاد المصدر استجابة فارغة أو غير صالحة، تفشل العملية دون اعتبارها نجاحًا ولا تُستبدل اللقطة الموثوقة.
