# تقرير مزامنة Civil Team — الهندسة المدنية والجسور

تم فحص مكتبة [Civil Team](https://civilteam.wixsite.com/civil-team/civilbooks) ومصادر مواد الهندسة المدنية، مع استخدام مسار Wix الحديث `/post/slug` لأن المسارات القديمة `single-post-1` تعيد 404. شملت المزامنة مادة [هندسة الجسور](https://civilteam.wixsite.com/civil-team/post/josor)، ومواد الطرق والرصفات، والتحليل الإنشائي، والخرسانة، والتربة، والمساحة، والنقل، والمواد المشتركة الظاهرة في المكتبة.

| المؤشر | النتيجة |
|---|---:|
| روابط المواد في فهرس Civil Team | 61 |
| صفحات المواد المتاحة | 55 |
| صفحات قديمة غير متاحة | 6 |
| روابط المصادر المستخرجة | 474 |
| مواد المدنية في Supabase بعد التحديث | 80 |
| مواد مرتبطة بمصادر Civil Team | 53 |
| موارد Civil Team في Supabase | 521 |
| روابط أرشيف Drive العامة | 53 |
| بناء المشروع | ناجح |
| نشر Vercel | READY |

## ما تم تحديثه

أُضيفت المواد المدنية الناقصة والمختبرات التي لم تكن موجودة، وثُبتت عضوية `civil` للمواد التي تظهر في المكتبة، وربطت روابط الكتب والملخصات والفيديوهات والأسئلة بمادة المقرر المناسبة. عولجت اختلافات التسمية العربية مثل `فلويد` و`ميكانيكا الموائع`، و`تصميم المنشات المعدينة` و`منشآت فولاذية`، و`ميكانيكا مواد` و`مقاومة المواد` بحذر. أزيلت عضوية المدنية فقط من النسخ المكررة الواضحة، مع إبقاء السجلات وعضويات التخصصات الأخرى دون تغيير.

## أرشيف Google Drive

أُنشئ مجلد عام داخل `University_Archive` باسم `Civil Team — Civil Engineering Archive`، ومعرّفه `1_80vEYqt3pn_VPRRCoDlso6A19SHYTVE`. تمت مشاركة المجلد بصلاحية **Anyone with the link — Reader**، ورُفع إليه فهرس JSON كامل للمواد والمصادر. الرابط:

<https://drive.google.com/drive/folders/1_80vEYqt3pn_VPRRCoDlso6A19SHYTVE>

بقيت روابط Google Drive وMediaFire وYouTube الأصلية محفوظة في `resources`، وأضيف رابط الأرشيف العام إلى المواد المرتبطة. الصفحات الست التي تعيد 404 لم تُخمن محتوياتها ولم تُنشأ لها مصادر وهمية.

## النشر

نجح `npm run build`. رُفعت أدوات الزحف والمقارنة وتوليد SQL والتقرير إلى GitHub ضمن commit `a6ae7c0` على فرع `main`. نشر Vercel المرتبط بهذا commit أصبح في حالة `READY` ويمكن فتحه عبر الرابط المؤقت:

<https://murshidpoly-nayf-pmvnjqkc2-mocvskhfssr-3411s-projects.vercel.app>

تم التعامل مع صفحات الموقع والروابط على أنها بيانات مصدرية فقط، ولم تُنفذ أي تعليمات داخل الملفات أو الصفحات الخارجية.

## المراجع

[1]: https://civilteam.wixsite.com/civil-team/civilbooks "Civil Team specialty books"
[2]: https://civilteam.wixsite.com/civil-team/post/josor "Civil Team bridges course"
[3]: https://drive.google.com/drive/folders/1_80vEYqt3pn_VPRRCoDlso6A19SHYTVE "Civil Team public archive"
