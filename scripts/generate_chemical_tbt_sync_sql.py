import json,re,hashlib
from pathlib import Path

def q(s): return "'"+str(s).replace("'","''")+"'"
def norm(s):
 s=str(s or '').lower(); s=re.sub(r'[إأآا]','ا',s).replace('ى','ي').replace('ة','ه').replace('ؤ','و').replace('ئ','ي'); s=re.sub(r'[ًٌٍَُِّْـ]','',s); s=re.sub(r'[^\w\u0600-\u06ff]+',' ',s); return re.sub(r'\s+',' ',s).strip()
source=json.loads(Path('.tmp_chemical_tbt_index.json').read_text(encoding='utf-8'))
cur=json.loads(Path('.tmp_current_chemical_courses.json').read_text(encoding='utf-8'))
ids={x['id']:x for x in cur}
manual={
'الفيزياء العامة 1':'p101','الفيزياء العامة العملي 1':'plab101','الفيزياء العامة العملي 2':'physics_lab2','الفيزياء العامة 2':'p102','اللغة العربية 1':'applied_arabic','اللغة العربية 2':'applied_arabic','اللغة الإنجليزية 1':'english101','اللغة الإنجليزية 2':'english102','تربية وطنية':'national_studies','علوم عسكرية':'military_science','مشاغل هندسية':'engineering_workshop','مهارات الحاسوب 1':'m_comp_skills','مهارات الحاسوب 2':'chem_comp_skills_2','التفاضل والتكامل 1':'c6','التفاضل والتكامل 2':'c2','الكيمياء العامة 1':'chem101','الكيمياء العامة العملية 1':'chemlab101','المواد الإختيارية':'chem_electives','رسم هندسي':'engineering_drawing','التحليل العددي والتطبيقي':'numerical','استاتيكا':'chem_statics','مبادئ الهندسة الكيميائية':'m_principles_che','كيمياء فيزيائية':'chem_phys_thermo','مواد هندسية':'chem_materials','كيمياء عضوية':'chem_organic','كيمياء تحليلية وتحليل آلي':'chem_analytical','مختبر الكيمياء العضوية':'m_organic_lab','مختبر كيمياء تحليلية':'m_analytical_lab','الرياضيات التطبيقية للهندسة الكيميائية':'chem_applied_math','توازنات المادة والطاقة':'c7','ميكانيكا موائع للهندسة الكيميائية':'m_fluids_che','ديناميكا حرارية للهندسة الكيميائية 1':'m_thermo_che','عمليات موحدة 1':'m_unit_ops','عمليات موحدة 2':'chem_unit_ops_2','مختبر ميكانيكا موائع':'m_fluids_lab_che','انتقال الحرارة للعمليات':'m_heat_transfer','هندسة التفاعلات الكيميائية 1':'m_reaction_eng1','مختبر عمليات موحدة 1':'m_unit_ops_lab','مختبر انتقال حرارة':'m_heat_transfer_lab','انتقال المادة':'m_mass_transfer','مختبر ديناميكا حرارية':'m_thermo_lab_che','هندسة التفاعلات الكيميائية 2':'m_reaction_eng2','الصناعات الدوائية':'chem_pharmaceutical','هندسة التآكل':'m_corrosion','مختبر عمليات موحدة 2':'chem_unit_ops_lab_2','ديناميكا عمليات وتحكم':'m_process_control','هندسة العمليات الحيوية':'m_bioprocess','مختبر هندسة التفاعلات الكيميائية':'m_reaction_lab','هندسة البيئة':'chem_environment','مختبر هندسة البيئة':'chem_environment_lab','هندسة تكرير بترول':'m_petroleum','تصميم عمليات 1':'chem_process_design_1','مختبر ديناميكا عمليات وتحكم':'m_control_lab','تصميم عمليات 2':'chem_process_design_2','مختبر الحاسوب للهندسة الكيميائية':'chem_computer_lab','مواضيع خاصة في الهندسة الكيميائية':'chem_special_topics','معالجة المياه والمياه العادمة':'m_wastewater','الكتابة الفنية والتقارير':'chem_technical_writing','مشروع 1':'ce_project1','مشروع 2':'ce_project2','التدريب الميداني':'chem_training'
}
new_defs={
'physics_lab2':('مختبر الفيزياء العامة 2','Physics 2 Lab','PHYS 102L','Physics','lab'),'chem_comp_skills_2':('مهارات الحاسوب 2','Computer Skills II','CS 102','Computer Engineering','computing'),'chem_electives':('المواد الإختيارية','Chemical Engineering Electives','CHE ELEC','Chemical Engineering','support'),'chem_statics':('استاتيكا','Statics','ME 201','Mechanical Engineering','core'),'chem_materials':('مواد هندسية','Engineering Materials','ME 202','Chemical Engineering','core'),'chem_applied_math':('الرياضيات التطبيقية للهندسة الكيميائية','Applied Mathematics for Chemical Engineering','CHE 205','Chemical Engineering','math'),'chem_unit_ops_2':('عمليات موحدة 2','Unit Operations II','CHE 342','Chemical Engineering','physics'),'chem_unit_ops_lab_2':('مختبر عمليات موحدة 2','Unit Operations II Lab','CHE 342L','Chemical Engineering','lab'),'chem_environment':('هندسة البيئة','Environmental Engineering','CHE 451','Chemical Engineering','physics'),'chem_environment_lab':('مختبر هندسة البيئة','Environmental Engineering Lab','CHE 451L','Chemical Engineering','lab'),'chem_process_design_1':('تصميم عمليات 1','Process Design I','CHE 501','Chemical Engineering','physics'),'chem_process_design_2':('تصميم عمليات 2','Process Design II','CHE 502','Chemical Engineering','physics'),'chem_computer_lab':('مختبر الحاسوب للهندسة الكيميائية','Chemical Engineering Computer Lab','CHE 402L','Chemical Engineering','lab'),'chem_technical_writing':('الكتابة الفنية والتقارير','Technical Writing and Reports','CHE 202','Chemical Engineering','support'),'chem_training':('التدريب الميداني','Field Training','CHE 590','Chemical Engineering','support')}
# Some IDs already exist under a slightly different canonical name.
for cid in list(manual.values()):
 if cid not in ids and cid not in new_defs: raise SystemExit(f'Unresolved course id {cid}')
sql=['begin;']; mapping=[]; used=[]
for s in source:
 name=s['name']; cid=manual[name];
 if cid in new_defs:
  n_ar,n_en,code,dept,cat=new_defs[cid]
  sql.append(f"insert into public.courses (id,name_ar,name_en,code,department,category,majors) values ({q(cid)},{q(n_ar)},{q(n_en)},{q(code)},{q(dept)},{q(cat)},ARRAY['chemical']::text[]) on conflict (id) do update set name_ar=excluded.name_ar,name_en=excluded.name_en,code=excluded.code,department=excluded.department,category=excluded.category,majors=array( select distinct unnest(coalesce(public.courses.majors,ARRAY[]::text[]) || ARRAY['chemical']::text[]) );")
 else:
  sql.append(f"update public.courses set majors=array( select distinct unnest(coalesce(majors,ARRAY[]::text[]) || ARRAY['chemical']::text[]) ) where id={q(cid)};")
 mapping.append({'source_name':name,'course_id':cid,'page_url':s['page_url'],'links':s['links']}); used.append(cid)
for s in source:
 cid=manual[s['name']]
 for i,url in enumerate(s['links']):
  if any(x in url for x in ('facebook.com','twitter.com','weebly.com/signup','editmysite.com')): continue
  rid='chem_tbt_'+hashlib.sha1((cid+'|'+url).encode()).hexdigest()[:20]
  title=s['name']+' — Chemical TBT'
  typ='video' if 'youtube.com' in url else ('book' if any(x in url for x in ('mediafire.','dropbox.','.pdf','.doc','.ppt','.zip','.rar')) else 'summary')
  sql.append(f"insert into public.resources (id,course_id,title,type,uploader,size,url) select {q(rid)},{q(cid)},{q(title)},{q(typ)},{q('Chemical TBT')},null,{q(url)} where not exists (select 1 from public.resources where course_id={q(cid)} and url={q(url)});")
sql.append('commit;')
Path('.tmp_chemical_tbt_sync.sql').write_text('\n'.join(sql)+'\n',encoding='utf-8')
Path('.tmp_chemical_tbt_sync_mapping.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'source_subjects':len(source),'new_courses':len(new_defs),'sql_lines':len(sql),'source_links':sum(sum(1 for u in s['links'] if not any(x in u for x in ('facebook.com','twitter.com','weebly.com/signup','editmysite.com'))) for s in source)},ensure_ascii=False))
