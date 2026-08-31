import json,hashlib
from pathlib import Path

def q(s): return "'"+str(s).replace("'","''")+"'"
source=json.loads(Path('.tmp_civil_team_posts.json').read_text(encoding='utf-8'))
source=[x for x in source if x.get('status')==200 and x.get('title') and x.get('title')!='Post | civil-team']
# Keep in sync with the main civil sync mapping.
manual={'العلوم العسكرية':'military_science','تكنولوجيا خرسانة':'ce_concrete_technology','اللغة العربية 101':'applied_arabic','اللغة العربية 102':'applied_arabic','هندسة الاساسات':'ce_foundations','التفاضل و التكامل 1':'c6','التفاضل و التكامل 2':'c2','الكيمياء العامة':'chem101','مختبر الكيمياء العامة':'chemlab101','ديناميكا':'ce_dynamics','إحصاء تطبيقي':'stat101','ادارة المشاريع':'ce_project_mgmt','اللغة الإنجليزية 101':'english101','اللغة الإنجليزية 102':'english102','إنشاء مباني':'ce_buildings','الإقتصاد الهندسي':'ee201','الكتابة الفنية والتقرارير':'technical_writing','فلويد':'ce_fluids','مختبر جيولوجيا تطبيقية':'ce_geology_lab','حاسوب 1':'cs101','هندسة الجسور':'ce_bridges','مختبر مقاومة مواد':'ce_strength_lab','مختبر تصميم مسارات الطرق':'ce_pavement_routes_lab','مختبر ميكانيكا تربة':'ce_soil_lab','مختبر تكنولوجيا خرسانة':'ce_concrete_lab','مختبر مساحة':'ce_surveying_lab','الفيزياء العامة العملي 1':'plab101','الفيزياء العامة العملي 2':'plab102','الفيزياء العامة 1':'p101','الفيزياء العامة 2':'p102','مختبر رصفة الطرق والمسارات':'ce_pavement_lab','المائيات':'ce_hydraulics','masa7a':'ce_surveying','ميكانيكا مواد':'ce_strength','تصميم المنشات المعدينة':'ce_steel','هندسـة المرور':'ce_traffic','خرسانة مسبقة الإجهاد':'ce_prestressed','مشاغل هندسية':'engineering_workshop','هندسة المطارات':'ce_airports','هندسـة النقـل':'ce_transport','هندسـة النقـل العام':'ce_urban_transit','حساب الكميات والمواصفات والعقود':'ce_specs','الرسم الهندسي':'engineering_drawing','رسم انشائي':'ce_civil_drawing','استاتيك':'c4','تحليل إنشائي 1':'ce_structural1','تحليل إنشائي 2':'ce_structural2','تأهيل وصيانة الطرق':'ce_pavement_rehab','تأهيل المنشآت الخرسانية':'ce_rehab','تصميم الخرسانة المسلحة 1':'ce_concrete1','تقنيات عددية':'numerical','التربية الوطنية':'national_studies','هندسة الزلازل':'ce_earthquake','تصميم رصفة الطرق والمسارات':'ce_pavements'}
folder='https://drive.google.com/drive/folders/1_80vEYqt3pn_VPRRCoDlso6A19SHYTVE'
seen=set(); lines=['begin;']
for s in source:
 cid=manual[s['title'].split(' | ')[0].strip()]
 if cid in seen: continue
 seen.add(cid); rid='civil_team_archive_'+hashlib.sha1(cid.encode()).hexdigest()[:20]
 title='أرشيف Civil Team — '+s['title'].split(' | ')[0].strip()
 lines.append(f"insert into public.resources (id,course_id,title,type,uploader,size,url) select {q(rid)},{q(cid)},{q(title)},{q('summary')},{q('Civil Team')},null,{q(folder)} where not exists (select 1 from public.resources where course_id={q(cid)} and url={q(folder)});")
lines.append('commit;'); Path('.tmp_civil_archive_resource.sql').write_text('\n'.join(lines)+'\n',encoding='utf-8'); print({'courses':len(seen),'sql_lines':len(lines)})
