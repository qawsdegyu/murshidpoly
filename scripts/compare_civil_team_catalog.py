import json,re
from pathlib import Path
from difflib import SequenceMatcher

def norm(s):
 s=str(s or '').lower(); s=re.sub(r'[إأآا]','ا',s).replace('ى','ي').replace('ة','ه').replace('ؤ','و').replace('ئ','ي'); s=re.sub(r'[ًٌٍَُِّْـ]','',s); s=re.sub(r'[^\w\u0600-\u06ff]+',' ',s); return re.sub(r'\s+',' ',s).strip()
alias={'اللغة العربية 101':'اللغة العربية التطبيقية','اللغة العربية 102':'اللغة العربية التطبيقية','اللغة الإنجليزية 101':'إنجليزي تطبيقي 1','اللغة الإنجليزية 102':'إنجليزي تطبيقي 2','الكيمياء العامة':'الكيمياء العامة 1','مختبر الكيمياء العامة':'مختبر الكيمياء العامة','الفيزياء العامة العملي 1':'مختبر الفيزياء العامة','الفيزياء العامة العملي 2':'مختبر الفيزياء العامة 2','التفاضل و التكامل 1':'تفاضل وتكامل 1','التفاضل و التكامل 2':'تفاضل وتكامل 2','الإقتصاد الهندسي':'الاقتصاد الهندسي','ادارة المشاريع':'إدارة مشاريع','الكتابة الفنية والتقرارير':'الكتابة التقنية والأخلاقيات المهنية','حاسوب 1':'البرمجة للمهندسين','تقنيات عددية':'تقنيات عددية','هندسة الاساسات':'الهندسة الجيوتقنية','استاتيك':'استاتيكا','هندسة الجسور':'هندسة الجسور','فلويد':'ميكانيكا الموائع للهندسة المدنية','المائيات':'الهيدرولوجيا الهندسية','masa7a':'المساحة','مختبر تصميم مسارات الطرق':'مختبر تصميم مسارات الطرق','مختبر رصفة الطرق والمسارات':'مختبر الرصفات','تصميم رصفة الطرق والمسارات':'تصميم الرصفات','تأهيل وصيانة الطرق':'تأهيل الطرق والرصفات','تأهيل المنشآت الخرسانية':'تأهيل منشآت خرسانية','تصميم المنشات المعدينة':'منشآت معدنية','هندسـة المرور':'هندسة المرور','هندسـة النقـل':'هندسة النقل','هندسـة النقـل العام':'النقل الحضري','حساب الكميات والمواصفات والعقود':'المواصفات والعقود وحساب الكميات','رسم انشائي':'الرسم المدني','مختبر تكنولوجيا خرسانة':'مختبر تكنولوجيا الخرسانة','تكنولوجيا خرسانة':'تكنولوجيا الخرسانة','مختبر جيولوجيا تطبيقية':'مختبر الجيولوجيا الهندسية','ميكانيكا مواد':'ميكانيكا المواد','تحليل إنشائي 1':'تحليل إنشائي 1','تحليل إنشائي 2':'تحليل إنشائي 2','تصميم الخرسانة المسلحة 1':'تصميم الخرسانة المسلحة 1','خرسانة مسبقة الإجهاد':'خرسانة مسبقة الإجهاد','هندسة الزلازل':'هندسة الزلازل','مشاغل هندسية':'المشغل الهندسي'}
src=json.loads(Path('.tmp_civil_team_posts.json').read_text(encoding='utf-8')); cur=json.loads(Path('.tmp_current_civil_courses.json').read_text(encoding='utf-8'))
# Ignore 404 placeholders and generic page title.
src=[x for x in src if x.get('status')==200 and x.get('title') and x['title']!='Post | civil-team']
by={}
for x in cur: by.setdefault(norm(x['name_ar']),[]).append(x)
used=set(); matches=[]
for s in src:
 name=s['title'].split(' | ')[0].strip(); target=alias.get(name,name); cand=by.get(norm(target),[])
 if cand: best=cand[0]; score=1.0; status='exact' if len(cand)==1 else 'duplicate_exact'
 else:
  scores=sorted(((SequenceMatcher(None,norm(target),norm(x['name_ar'])).ratio(),x) for x in cur),reverse=True,key=lambda z:z[0]); score,best=scores[0] if scores else (0,None); status='fuzzy' if score>=.72 else 'missing'
 if best: used.add(best['id'])
 ext=[u for u in s.get('links',[]) if not any(k in u for k in ('facebook.com','twitter.com','wix.com/lpviral','civilteam.wixsite.com','youtube.com/channel'))]
 matches.append({'source_name':name,'target_name':target,'page_url':s['url'],'links':ext,'status':status,'score':round(score,3),'course':best})
summary={'source_posts':len(src),'current_civil_courses':len(cur),'exact':sum(x['status']=='exact' for x in matches),'duplicate_exact':sum(x['status']=='duplicate_exact' for x in matches),'fuzzy':sum(x['status']=='fuzzy' for x in matches),'missing':sum(x['status']=='missing' for x in matches),'extra_current':sum(x['id'] not in used for x in cur),'external_links':sum(len(x['links']) for x in matches)}
Path('.tmp_civil_team_compare.json').write_text(json.dumps({'summary':summary,'matches':matches,'extra_current':[x for x in cur if x['id'] not in used]},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False))
