import json,re
from pathlib import Path
from difflib import SequenceMatcher

def norm(s):
 s=str(s or '').lower(); s=re.sub(r'[إأآا]','ا',s).replace('ى','ي').replace('ة','ه').replace('ؤ','و').replace('ئ','ي'); s=re.sub(r'[ًٌٍَُِّْـ]','',s); s=re.sub(r'\([^)]*\)','',s); s=re.sub(r'[^\w\u0600-\u06ff]+',' ',s); return re.sub(r'\s+',' ',s).strip()
alias={
 'الفيزياء العامة العملي 1':'مختبر الفيزياء العامة','الفيزياء العامة العملي 2':'مختبر الفيزياء العامة 2',
 'اللغة العربية 1':'اللغة العربية التطبيقية','اللغة العربية 2':'اللغة العربية التطبيقية',
 'اللغة الإنجليزية 1':'إنجليزي تطبيقي 1','اللغة الإنجليزية 2':'إنجليزي تطبيقي 2',
 'تربية وطنية':'التربية الوطنية','مشاغل هندسية':'المشغل الهندسي','مهارات الحاسوب 1':'مهارات الحاسوب','مهارات الحاسوب 2':'مهارات الحاسوب',
 'التفاضل والتكامل 1':'تفاضل وتكامل 1','التفاضل والتكامل 2':'تفاضل وتكامل 2',
 'الكيمياء العامة العملية 1':'مختبر الكيمياء العامة','التحليل العددي والتطبيقي':'تقنيات عددية','مواد هندسية':'المواد الهندسية',
 'كيمياء تحليلية وتحليل آلي':'كيمياء تحليلية وتحليل آلي','مختبر كيمياء تحليلية':'مختبر كيمياء تحليلية',
 'الرياضيات التطبيقية للهندسة الكيميائية':'الرياضيات التطبيقية للهندسة الكيميائية','ميكانيكا موائع للهندسة الكيميائية':'ميكانيكا الموائع للهندسة الكيميائية',
 'ديناميكا حرارية للهندسة الكيميائية 1':'الديناميكا الحرارية للهندسة الكيميائية','انتقال الحرارة للعمليات':'انتقال الحرارة للعمليات',
 'هندسة التفاعلات الكيميائية 1':'هندسة التفاعلات الكيميائية 1','هندسة التفاعلات الكيميائية 2':'هندسة التفاعلات الكيميائية 2',
 'مختبر ميكانيكا موائع':'مختبر ميكانيكا الموائع','مختبر انتقال حرارة':'مختبر انتقال الحرارة','مختبر ديناميكا حرارية':'مختبر الديناميكا الحرارية للهندسة الكيميائية',
 'ديناميكا عمليات وتحكم':'ديناميكا العمليات والتحكم','مختبر هندسة التفاعلات الكيميائية':'مختبر هندسة التفاعلات الكيميائية',
 'مختبر ديناميكا عمليات وتحكم':'مختبر ديناميكا العمليات والتحكم','مختبر الحاسوب للهندسة الكيميائية':'مختبر الحاسوب للهندسة الكيميائية',
 'مواضيع خاصة في الهندسة الكيميائية':'مواضيع خاصة في الهندسة الكيميائية','الكتابة الفنية والتقارير':'الكتابة الفنية والتقارير',
 'مشروع 1':'مشروع تخرج 1','مشروع 2':'مشروع تخرج 2','التدريب الميداني':'تدريب ميداني',
}
src=json.loads(Path('.tmp_chemical_tbt_index.json').read_text(encoding='utf-8')); cur=json.loads(Path('.tmp_current_chemical_courses.json').read_text(encoding='utf-8'))
by={norm(x['name_ar']):[] for x in cur}
for x in cur: by.setdefault(norm(x['name_ar']),[]).append(x)
out=[]; used=set()
for s in src:
 target=alias.get(s['name'],s['name']); nk=norm(target); exact=by.get(nk,[])
 if exact:
  best=exact[0]; score=1.0; status='exact' if len(exact)==1 else 'duplicate_exact'
 else:
  scores=sorted(((SequenceMatcher(None,nk,norm(x['name_ar'])).ratio(),x) for x in cur),reverse=True,key=lambda z:z[0]); score,best=scores[0] if scores else (0,None); status='fuzzy' if score>=.72 else 'missing'
 if best: used.add(best['id'])
 out.append({'source_name':s['name'],'target_name':target,'page_url':s['page_url'],'links':s['links'],'status':status,'score':round(score,3),'course':best})
summary={'source_subjects':len(src),'current_chemical_courses':len(cur),'exact':sum(x['status']=='exact' for x in out),'duplicate_exact':sum(x['status']=='duplicate_exact' for x in out),'fuzzy':sum(x['status']=='fuzzy' for x in out),'missing':sum(x['status']=='missing' for x in out),'extra_current':sum(x['id'] not in used for x in cur)}
Path('.tmp_chemical_tbt_compare.json').write_text(json.dumps({'summary':summary,'matches':out,'extra_current':[x for x in cur if x['id'] not in used]},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False))
