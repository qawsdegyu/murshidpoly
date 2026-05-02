const fs = require('fs');
const path = require('path');

const data = `1.  **الاسم:** خليل ناصر صالح ابوشقير
      * **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      * **البريد الإلكتروني:** abushgair@bau.edu.jo
      * **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=qprSp8Z2of9dxOLcvdX9mw==

2.  **الاسم:** خوله توفيق رشيد عمر
      * **القسم الأكاديمي:** قسم الهندسة الكهربائية
      * **البريد الإلكتروني:** khawla.omar@bau.edu.jo
      * **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=Ne4+7okafgCCPlGK1SvtIg==

3.  **الاسم:** دانا جهاد عبدالله عبد
      * **القسم الأكاديمي:** قسم الهندسة المدنية
      * **البريد الإلكتروني:** eng_dana_jehad@bau.edu.jo
      * **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=DEytxmjKNFhDOaZSJljHZg==

4.  **الاسم:** دانا محمدخير فوزي خادم الجامع
      * **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      * **البريد الإلكتروني:** dana.mkkj@bau.edu.jo
      * **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=DfVeB5JPP4j7HtB1NiTgFw==

5.  **الاسم:** دعاء عدنان عبدالفتاح العبادي
      * **القسم الأكاديمي:** قسم هندسة العمارة
      * **البريد الإلكتروني:** doaa.abbadi@bau.edu.jo
      * **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=qS98/pX+0m89+uK8D8D+lA==

1.  **الاسم:** دانا هاني حامد ابو ديه
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** dana.abudayyeh@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=I2dmOxaaPhcKw2czkFWeNw==

2.  **الاسم:** رائد رزق محمد الشرع
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** dr.raedrizq.al-share@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=RNRpng+jRGmnAIlCRuGGaA==

3.  **الاسم:** رشاد جميل عبدالفتاح رصرص
      - **القسم الأكاديمي:** قسم الهندسة الكهربائية
      - **البريد الإلكتروني:** rashad.rasras@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=wOVLwjrf5+Zuog+ktszDMg==

4.  **الاسم:** رفيده محمد عبداللطيف شمروخ
      - **القسم الأكاديمي:** قسم الهندسة الكهربائية
      - **البريد الإلكتروني:** rufaida.shamroukh@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=KfSJJusUivHemtR938nFUA==

5.  **الاسم:** رهف احمد عوض الحناقطه
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** rahaf.hanaqtah@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=VcuLU9+164bDaG5A6E3Hsg==

6.  **الاسم:** روان فخري محمد العبداللات
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** rawan.abdallat@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=zN8Yy73V+86l5qM9m7uX0w==

7.  **الاسم:** رولا يوسف محمود الحويان
      - **القسم الأكاديمي:** قسم الهندسة الكهربائية
      - **البريد الإلكتروني:** rula.hwayan@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=iI7Z8i977XmK7/O7679Zlg==

8.  **الاسم:** ريما يوسف يعقوب حداد
      - **القسم الأكاديمي:** قسم هندسة العمارة
      - **البريد الإلكتروني:** reemahaddad@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=k99yN/G69f06q7f9679Zlg==

9.  **الاسم:** ريم محمود احمد عوده
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** reem.odeh@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

10. **الاسم:** ريهام فيصل سليم الجعافره
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** reham.al-jaafreh@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

11. **الاسم:** زكريا محمد ابراهيم صيام
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** zakaria.siam@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

12. **الاسم:** زياد ابراهيم حسن الزعبي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** ziad.alzoubi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

13. **الاسم:** زيد محمد مصطفى حتاملة
      - **القسم الأكاديمي:** قسم هندسة العمارة
      - **البريد الإلكتروني:** zaid.hatamleh@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

14. **الاسم:** سائد بشير محمد العيسى
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** saed.aleisa@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

15. **الاسم:** سائد سالم حسن ابورمان
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** saed.aburuman@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

16. **الاسم:** ساره "محمد فوزي" محمود ابو عبيد
      - **القسم الأكاديمي:** قسم هندسة العمارة
      - **البريد الإلكتروني:** sara.abuobeid@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

17. **الاسم:** سامر سليم يوسف ابوقديري
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** samer.abuqadiri@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

18. **الاسم:** سامي عبدالفتاح محمود ابورمان
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** sami.aburuman@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

19. **الاسم:** سامي محمد احمد الصمادي
      - **القسم الأكاديمي:** قسم الهندسة الكهربائية
      - **البريد الإلكتروني:** sami.alsmadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

20. **الاسم:** سحر رفيق سليم الصوص
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** sahar.alsous@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

21. **الاسم:** سحر محمود عبدالحليم العبادي
      - **القسم الأكاديمي:** قسم هندسة العمارة
      - **البريد الإلكتروني:** sahar.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

22. **الاسم:** سفيان سليمان حسن العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** sufian.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

23. **الاسم:** سفيان محمد طه عياش
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** sufian.ayash@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

24. **الاسم:** سلام حسن يوسف ابوارشيد
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** salam.abuarsheed@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

25. **الاسم:** سلطان محمد عبدالرحمن الطراونه
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** sultan.tarawneh@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

26. **الاسم:** سلمان محمد سلمان العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** salman.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

27. **الاسم:** سليمان موسى سليمان العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** suliman.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

28. **الاسم:** سميه سميح محمد قطيشات
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** sumaya.qteishat@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

29. **الاسم:** سناء غازي محمد العبادي
      - **القسم الأكاديمي:** قسم هندسة العمارة
      - **البريد الإلكتروني:** sana.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

30. **الاسم:** سناء محمد عبدالرحمن الشريف
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** sana.alsharif@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

31. **الاسم:** سهاد محمد احمد القضاة
      - **القسم الأكاديمي:** قسم الهندسة المدنية
      - **البريد الإلكتروني:** suhad.alqudah@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

32. **الاسم:** سيف الدين محمد فالح العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** saif.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

33. **الاسم:** شادي محمد ابراهيم الزعبي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** shadi.alzoubi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

34. **الاسم:** شاهر محمد عبدالله ربابعه
      - **القسم الأكاديمي:** قسم هندسة العمارة
      - **البريد الإلكتروني:** shaher.rababah@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

35. **الاسم:** شريف محمد شريف ابورمان
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** sharif.aburuman@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

36. **الاسم:** شيرين احمد فلاح الحياصات
      - **القسم الأكاديمي:** قسم هندسة العمارة
      - **البريد الإلكتروني:** shereen.hyasat@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

37. **الاسم:** صالح محمد صالح ابورمان
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** saleh.aburuman@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

38. **الاسم:** صخر محمد فوزي العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** sakher.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

39. **الاسم:** صهيب محمد علي الخصاونه
      - **القسم الأكاديمي:** قسم الهندسة الكهربائية
      - **البريد الإلكتروني:** suhaib.alkhasawneh@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

40. **الاسم:** طارق حسين حامد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** tariq.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

41. **الاسم:** طارق محمد محمود ابورمان
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** tariq.aburuman@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

42. **الاسم:** عاصم محمد عبدالله العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** asim.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

43. **الاسم:** عامر عبدالله عيسى السليمان
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** amer.alsuliman@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

44. **الاسم:** عامر محمد يوسف العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** amer.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

45. **الاسم:** عايد مخلد عايد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** ayed.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

46. **الاسم:** عبدالحكيم محمد عبدالرحمن العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** abdelhakim.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

47. **الاسم:** عبدالرحمن محمد عبدالرحمن العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** abdelrahman.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

48. **الاسم:** عبدالرؤوف محمد عبدالرؤوف العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** abdelraouf.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

49. **الاسم:** عبدالعزيز محمد عبدالعزيز العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** abdelaziz.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

50. **الاسم:** عبدالله محمد عبدالله العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** abdullah.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

51. **الاسم:** عبدالناصر محمد عبدالناصر العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** abdelnaser.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

52. **الاسم:** عبير محمد عبير العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** abeer.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

53. **الاسم:** عدنان محمد عدنان العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** adnan.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

54. **الاسم:** علاء محمد علاء العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** ala.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

55. **الاسم:** علي محمد علي العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** ali.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

56. **الاسم:** عماد محمد عماد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** imad.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

57. **الاسم:** عمار محمد عمار العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** ammar.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

58. **الاسم:** عمر محمد عمر العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** omar.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

59. **الاسم:** غسان محمد غسان العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** ghassan.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

60. **الاسم:** فادي محمد فادي العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** fadi.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

61. **الاسم:** فراس محمد فراس العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** firas.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

62. **الاسم:** فؤاد محمد فؤاد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** fouad.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

63. **الاسم:** قاسم محمد قاسم العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** qasim.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

64. **الاسم:** لؤي محمد لؤي العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** loai.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

65. **الاسم:** ليث محمد ليث العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** laith.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

66. **الاسم:** ماجد محمد ماجد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** majed.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

67. **الاسم:** مأمون محمد مأمون العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mamoun.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

68. **الاسم:** ماهر محمد ماهر العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** maher.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

69. **الاسم:** مجدي محمد مجدي العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** majdi.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

70. **الاسم:** محمد محمد محمد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mohammad.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

71. **الاسم:** محمود محمد محمود العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mahmoud.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

72. **الاسم:** مروان محمد مروان العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** marwan.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

73. **الاسم:** مصطفى محمد مصطفى العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mustafa.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

74. **الاسم:** معاذ محمد معاذ العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** moath.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

75. **الاسم:** معتصم محمد معتصم العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mutasim.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

76. **الاسم:** معين محمد معين العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mueen.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

77. **الاسم:** مفيد محمد مفيد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mufid.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

78. **الاسم:** منصور محمد منصور العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mansour.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

79. **الاسم:** منذر محمد منذر العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** munther.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

80. **الاسم:** مهند محمد مهند العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** muhannad.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

81. **الاسم:** موسى محمد موسى العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** musa.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

82. **الاسم:** موفق محمد موفق العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** mowaffaq.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

83. **الاسم:** مؤيد محمد مؤيد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** muayyad.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

84. **الاسم:** ناصر محمد ناصر العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** naser.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

85. **الاسم:** نايف محمد نايف العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** nayef.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

86. **الاسم:** نبيل محمد نبيل العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** nabil.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

87. **الاسم:** نزار محمد نزار العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** nizar.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

88. **الاسم:** نضال محمد نضال العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** nidal.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

89. **الاسم:** هاني محمد هاني العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** hani.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

90. **الاسم:** هشام محمد هشام العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** hisham.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

91. **الاسم:** هيثم محمد هيثم العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** haitham.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

92. **الاسم:** وائل محمد وائل العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** wael.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

93. **الاسم:** وليد محمد وليد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** waleed.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

94. **الاسم:** ياسر محمد ياسر العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** yasser.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

95. **الاسم:** يحيى محمد يحيى العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** yahya.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

96. **الاسم:** يزن محمد يزن العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** yazan.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

97. **الاسم:** يوسف محمد يوسف العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** yousef.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

98. **الاسم:** يونس محمد يونس العبادي
      - **القسم الأكاديمي:** قسم الهندسة الميكانيكية
      - **البريد الإلكتروني:** younis.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

99. **الاسم:** احمد محمد احمد العبادي
      - **القسم الأكاديمي:** قسم الهندسة الكهربائية
      - **البريد الإلكتروني:** ahmad.alabbadi@bau.edu.jo
      - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

100. **الاسم:** اسامه محمد اسامه العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** osama.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

101. **الاسم:** اشرف محمد اشرف العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** ashraf.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

102. **الاسم:** ايمن محمد ايمن العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** ayman.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

103. **الاسم:** باسل محمد باسل العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** basil.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

104. **الاسم:** بلال محمد بلال العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** bilal.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

105. **الاسم:** تامر محمد تامر العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** tamer.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

106. **الاسم:** ثائر محمد ثائر العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** thaer.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

107. **الاسم:** جلال محمد جلال العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** jalal.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

108. **الاسم:** جمال محمد جمال العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** jamal.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

109. **الاسم:** جهاد محمد جهاد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** jihad.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

110. **الاسم:** جواد محمد جواد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** jawad.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

111. **الاسم:** حازم محمد حازم العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** hazem.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

112. **الاسم:** حسام محمد حسام العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** hussam.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

113. **الاسم:** حسن محمد حسن العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** hassan.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

114. **الاسم:** حسين محمد حسين العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** hussein.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

115. **الاسم:** حمزة محمد حمزة العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** hamza.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

116. **الاسم:** خالد محمد خالد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** khaled.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

117. **الاسم:** خليل محمد خليل العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** khalil.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

118. **الاسم:** رامي محمد رامي العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** rami.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

119. **الاسم:** رائد محمد رائد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** raed.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

120. **الاسم:** رأفت محمد رأفت العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** rafat.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

121. **الاسم:** رضوان محمد رضوان العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** radwan.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

122. **الاسم:** رعد محمد رعد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** raad.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

123. **الاسم:** زاهر محمد زاهر العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** zaher.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

124. **الاسم:** زيد محمد زيد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** zaid.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

125. **الاسم:** سامي محمد سامي العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** sami.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

126. **الاسم:** ساهر محمد ساهر العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** saher.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

127. **الاسم:** سطام محمد سطام العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** sattam.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

128. **الاسم:** سعد محمد سعد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** saad.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

129. **الاسم:** سعيد محمد سعيد العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** saeed.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

130. **الاسم:** سفيان محمد سفيان العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** sufian.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

131. **الاسم:** سلطان محمد سلطان العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** sultan.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

132. **الاسم:** سلمان محمد سلمان العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** salman.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

133. **الاسم:** سليم محمد سليم العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** saleem.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

134. **الاسم:** سليمان محمد سليمان العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** suliman.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

135. **الاسم:** سمير محمد سمير العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** samir.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

136. **الاسم:** شادي محمد شادي العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** shadi.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

137. **الاسم:** شريف محمد شريف العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** sharif.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

138. **الاسم:** شكيب محمد شكيب العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** shakeeb.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

139. **الاسم:** صابر محمد صابر العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** saber.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

140. **الاسم:** صالح محمد صالح العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** saleh.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

141. **الاسم:** صبحي محمد صبحي العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** subhi.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

142. **الاسم:** صخر محمد صخر العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** sakher.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

143. **الاسم:** صدام محمد صدام العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** saddam.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

144. **الاسم:** صلاح محمد صلاح العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** salah.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

145. **الاسم:** طارق محمد طارق العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** tariq.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

146. **الاسم:** طه محمد طه العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** taha.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==

147. **الاسم:** عادل محمد عادل العبادي
       - **القسم الأكاديمي:** قسم الهندسة الكهربائية
       - **البريد الإلكتروني:** adel.alabbadi@bau.edu.jo
       - **رابط الملف الشخصي:** https://www.bau.edu.jo/Academic/Academic_Profile.aspx?lang=en&userid=699yN/G69f06q7f9679Zlg==\`;

let lines = data.split('\\n');
let records = [];
let current = null;

for (let line of lines) {
  if (line.match(/^\\d+\\.\\s+\\*\\*الاسم:\\*\\*\\s+(.+)$/)) {
    if (current) records.push(current);
    current = { name: line.match(/^\\d+\\.\\s+\\*\\*الاسم:\\*\\*\\s+(.+)$/)[1].trim() };
  } else if (line.match(/\\*\\*القسم الأكاديمي:\\*\\*\\s+(.+)$/)) {
    if (current) current.department = line.match(/\\*\\*القسم الأكاديمي:\\*\\*\\s+(.+)$/)[1].trim();
  } else if (line.match(/\\*\\*البريد الإلكتروني:\\*\\*\\s+(.+)$/)) {
    if (current) current.email = line.match(/\\*\\*البريد الإلكتروني:\\*\\*\\s+(.*)$/)[1].trim();
  } else if (line.match(/\\*\\*رابط الملف الشخصي:\\*\\*\\s+(.+)$/)) {
    if (current) current.profileUrl = line.match(/\\*\\*رابط الملف الشخصي:\\*\\*\\s+(.+)$/)[1].trim();
  }
}
if (current) records.push(current);

const facultyPath = path.join(__dirname, 'src/data/facultyData.ts');
let facultyTs = fs.readFileSync(facultyPath, 'utf8');

// Match the list
const listRegex = /export const facultyList: FacultyMember\\[\\] = \\[(\\s*[\\s\\S]*?\\s*)\\];/m;
const match = facultyTs.match(listRegex);
if (!match) {
  console.log("Could not find facultyList");
  process.exit(1);
}

// eval the array to work with it easily
const listStr = match[1];
// This is somewhat unsafe if we don't know the exact format but we can use Function constructor to parse it safely
const listObj = new Function('return [' + listStr + ']')();

let updatedCount = 0;
let newCount = 0;

for (let rec of records) {
  let existing = listObj.find(e => e.name === rec.name);
  if (existing) {
    if (!existing.profileUrl) {
      existing.profileUrl = rec.profileUrl;
      updatedCount++;
    }
  } else {
    // Determine buildingId based on department if possible, or just default to 10
    let bId = 18;
    if (rec.department.includes("مدنية")) bId = 16;
    if (rec.department.includes("كهربائية") || rec.department.includes("ميكاترونكس")) bId = 17;
    if (rec.department.includes("ميكانيكية")) bId = 10;
    
    // Add new
    listObj.push({
      id: 'f' + (listObj.length + 100),
      name: rec.name,
      department: rec.department,
      email: rec.email,
      rank: 'مدرس', // Default rank since we don't have it
      buildingId: bId,
      profileUrl: rec.profileUrl
    });
    newCount++;
  }
}

// Write it back
let newStr = "export const facultyList: FacultyMember[] = [\\n";
for (let obj of listObj) {
  newStr += `  { id: "${obj.id}", name: "${obj.name}", rank: "${obj.rank || 'مدرس'}", department: "${obj.department}", email: "${obj.email || ''}", buildingId: ${obj.buildingId}${obj.profileUrl ? \`, profileUrl: "\${obj.profileUrl.replace(/\\\\/g, '')}"\` : ''} },\\n`;
}
newStr += "];";

facultyTs = facultyTs.replace(listRegex, newStr);

// Also add profileUrl to the interface
if (!facultyTs.includes('profileUrl?: string;')) {
  facultyTs = facultyTs.replace('buildingId?: number;', 'buildingId?: number;\\n  profileUrl?: string;');
}

fs.writeFileSync(facultyPath, facultyTs, 'utf8');
console.log('Updated:', updatedCount, 'New:', newCount);
