import json,hashlib
from pathlib import Path

def q(s): return "'"+str(s).replace("'","''")+"'"
source=json.loads(Path('.tmp_civil_team_posts.json').read_text(encoding='utf-8'))
source=[x for x in source if x.get('status')==200 and x.get('title') and x.get('title')!='Post | civil-team']
manual={'العلوم العسكرية':'military_science','تكنولوجيا خرسانة':'ce_concrete_technology','اللغة العربية 101':'applied_arabic','اللغة العربية 102':'applied_arabic','هندسة الاساسات':'ce_foundations','التفاضل و التكامل 1':'c6','التفاضل و التكامل 2':'c2','الكيمياء العامة':'chem101','مختبر الكيمياء العامة':'chemlab101','ديناميكا':'ce_dynamics','إحصاء تطبيقي':'stat101','ادارة المشاريع':'ce_project_mgmt','اللغة الإنجليزية 101':'english101','اللغة الإنجليزية 102':'english102','إنشاء مباني':'ce_buildings','الإقتصاد الهندسي':'ee201','الكتابة الفنية والتقرارير':'technical_writing','فلويد':'ce_fluids','مختبر جيولوجيا تطبيقية':'ce_geology_lab','حاسوب 1':'cs101','هندسة الجسور':'ce_bridges','مختبر مقاومة مواد':'ce_strength_lab','مختبر تصميم مسارات الطرق':'ce_pavement_routes_lab','مختبر ميكانيكا تربة':'ce_soil_lab','مختبر تكنولوجيا خرسانة':'ce_concrete_lab','مختبر مساحة':'ce_surveying_lab','الفيزياء العامة العملي 1':'plab101','الفيزياء العامة العملي 2':'plab102','الفيزياء العامة 1':'p101','الفيزياء العامة 2':'p102','مختبر رصفة الطرق والمسارات':'ce_pavement_lab','المائيات':'ce_hydraulics','masa7a':'ce_surveying','ميكانيكا مواد':'ce_strength','تصميم المنشات المعدينة':'ce_steel','هندسـة المرور':'ce_traffic','خرسانة مسبقة الإجهاد':'ce_prestressed','مشاغل هندسية':'engineering_workshop','هندسة المطارات':'ce_airports','هندسـة النقـل':'ce_transport','هندسـة النقـل العام':'ce_urban_transit','حساب الكميات والمواصفات والعقود':'ce_specs','الرسم الهندسي':'engineering_drawing','رسم انشائي':'ce_civil_drawing','استاتيك':'c4','تحليل إنشائي 1':'ce_structural1','تحليل إنشائي 2':'ce_structural2','تأهيل وصيانة الطرق':'ce_pavement_rehab','تأهيل المنشآت الخرسانية':'ce_rehab','تصميم الخرسانة المسلحة 1':'ce_concrete1','تقنيات عددية':'numerical','التربية الوطنية':'national_studies','هندسة الزلازل':'ce_earthquake','تصميم رصفة الطرق والمسارات':'ce_pavements'}
new_defs={'ce_concrete_technology':('تكنولوجيا الخرسانة','Concrete Technology','CE 314','Civil Engineering','physics'),'ce_strength_lab':('مختبر مقاومة مواد','Strength of Materials Lab','CE 213L','Civil Engineering','lab'),'ce_pavement_routes_lab':('مختبر تصميم مسارات الطرق','Road Alignment Design Lab','CE 424','Civil Engineering','lab'),'ce_soil_lab':('مختبر ميكانيكا تربة','Soil Mechanics Lab','CE 333','Civil Engineering','lab'),'ce_transport':('هندسة النقل','Transportation Engineering','CE 321','Civil Engineering','physics')}
cur=json.loads(Path('.tmp_current_civil_courses.json').read_text(encoding='utf-8')); ids={x['id'] for x in cur}
for cid in set(manual.values()):
 if cid not in ids and cid not in new_defs: raise SystemExit('unresolved '+cid)
sql=['begin;']
for cid,(a,b,c,d,cat) in new_defs.items():
 sql.append(f"insert into public.courses (id,name_ar,name_en,code,department,category,majors) values ({q(cid)},{q(a)},{q(b)},{q(c)},{q(d)},{q(cat)},ARRAY['civil']::text[]) on conflict (id) do update set name_ar=excluded.name_ar,name_en=excluded.name_en,code=excluded.code,department=excluded.department,category=excluded.category,majors=array(select distinct unnest(coalesce(public.courses.majors,ARRAY[]::text[]) || ARRAY['civil']::text[]));")
for s in source:
 name=s['title'].split(' | ')[0].strip(); cid=manual[name]
 sql.append(f"update public.courses set majors=array(select distinct unnest(coalesce(majors,ARRAY[]::text[]) || ARRAY['civil']::text[])) where id={q(cid)};")
for cid in ['ce_building_construction','ce_urban','ce_roads','ce_rehab_concrete','ce_advanced_struct','ce_seismic','ce_airports_railways']:
 sql.append(f"update public.courses set majors=array_remove(coalesce(majors,ARRAY[]::text[]),'civil') where id={q(cid)};")
for s in source:
 name=s['title'].split(' | ')[0].strip(); cid=manual[name]
 links=[]
 for u in s.get('links',[]):
  if any(k in u for k in ('facebook.com','twitter.com','wix.com/lpviral','civilteam.wixsite.com','civilteam.wixsite.com')): continue
  if u not in links: links.append(u)
 for u in links:
  rid='civil_team_'+hashlib.sha1((cid+'|'+u).encode()).hexdigest()[:20]
  typ='video' if 'youtube.com' in u or 'youtu.be' in u else ('book' if any(k in u.lower() for k in ('mediafire.','dropbox.','.pdf','.doc','.ppt','.zip','.rar','drive.google.com/file')) else 'summary')
  sql.append(f"insert into public.resources (id,course_id,title,type,uploader,size,url) select {q(rid)},{q(cid)},{q(name+' — Civil Team')},{q(typ)},{q('Civil Team')},null,{q(u)} where not exists (select 1 from public.resources where course_id={q(cid)} and url={q(u)});")
sql.append('commit;')
Path('.tmp_civil_team_sync.sql').write_text('\n'.join(sql)+'\n',encoding='utf-8')
Path('.tmp_civil_team_sync_mapping.json').write_text(json.dumps({'source_posts':len(source),'mapping':manual,'new_defs':new_defs},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'source_posts':len(source),'new_courses':len(new_defs),'external_links':sum(len([u for u in s.get('links',[]) if not any(k in u for k in ('facebook.com','twitter.com','wix.com/lpviral','civilteam.wixsite.com'))]) for s in source),'sql_lines':len(sql)},ensure_ascii=False))
