
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env or .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env or .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RAW_DATA = [
  // MECHATRONICS
  { dept: 'mechatronics', code: 'ELE2483', name: 'أجهزة الحاكمات المنطقية المبرمجة وبرمجتها', section: 3, instructor: 'د. غازي القريوتي', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1721' },
  { dept: 'mechatronics', code: 'ELE2489', name: 'أجهزة الحماية والتحكم الكهربائية', section: 3, instructor: 'د. غازي القريوتي', time: 'ح ن ث ر 11:00–01:00', room: 'قاعة 1712' },
  { dept: 'mechatronics', code: 'ELE2592', name: 'الأنظمة الكهروميكانيكية المكروية', section: 3, instructor: 'د. محمد خريسات', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1721' },
  { dept: 'mechatronics', code: 'ELE2597', name: 'تصميم أنظمة الميكاترونكس', section: 3, instructor: 'د. محمد خريسات', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1721' },
  { dept: 'mechatronics', code: 'ELE2579', name: 'مختبر الأجهزة الصناعية والتحكم', section: 1, instructor: 'هرت', time: 'ح ث 02:30–05:30', room: 'مختبر التحكم بالعمليات/ميكاترونيكس' },
  { dept: 'mechatronics', code: 'ELE2362', name: 'مختبر الكترونيات القدرة', section: 1, instructor: 'هرت', time: 'ن ر 02:30–05:30', room: 'مختبر الكترونيات القدرة' },
  { dept: 'mechatronics', code: 'ELE2374', name: 'مختبر المجسات والمشغلات', section: 1, instructor: 'هرت', time: 'ن ث 02:30–11:30', room: 'مختبر النواقل والقياسات' },
  { dept: 'mechatronics', code: 'ELE0431', name: 'مختبر أنظمة التحكم', section: 1, instructor: 'هرت', time: 'ن ر 02:30–05:30', room: 'مختبر التحكم والحاكمات المنطقية' },
  { dept: 'mechatronics', code: 'ELE0431', name: 'مختبر أنظمة التحكم', section: 1, instructor: 'هرت', time: 'ح ث 11:30–02:30', room: 'مختبر التحكم والحاكمات المنطقية' },
  { dept: 'mechatronics', code: 'ELE0431', name: 'مختبر أنظمة التحكم', section: 1, instructor: 'هرت', time: 'ن ر 08:30–11:30', room: 'مختبر التحكم والحاكمات المنطقية' },
  
  // MECHANICAL
  { dept: 'mechanical', code: 'MHV459', name: 'إدارة وتخطيط ورش صيانة المركبات', section: 4, instructor: 'د. وليد المومني', time: 'ح ث 11:30–02:30', room: 'قاعة 1917' },
  { dept: 'mechanical', code: 'L61301141', name: 'أساسيات كهرباء الطيران', section: 3, instructor: 'د. وليد المومني', time: 'ح ن ث 11:00–01:00', room: 'قاعة 1713' },
  { dept: 'mechanical', code: 'MEE0411', name: 'التحكم الآلي', section: 3, instructor: 'د. فادي القدس', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1915' },
  { dept: 'mechanical', code: 'MEE0440', name: 'التدريب الميداني', section: 3, instructor: 'هرت', time: 'ح ن ث ر خ 08:30–03:30', room: 'ميدان تدريب/هندسة ميكانيكية' },
  { dept: 'mechanical', code: 'MEE0312', name: 'القياسات الهندسية', section: 3, instructor: 'د. عبدالسلام الصياغ', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1903' },
  { dept: 'mechanical', code: 'MHV262', name: 'الممارسة المهنية (1)', section: 3, instructor: 'هرت', time: 'ح ن ث ر خ 08:30–03:30', room: 'ميدان تدريب/هندسة ميكانيكية' },
  { dept: 'mechanical', code: 'MHV362', name: 'الممارسة المهنية (2)', section: 9, instructor: 'هرت', time: 'ح ن ث ر خ 08:30–05:30', room: 'ميدان تدريب/هندسة ميكانيكية' },
  { dept: 'mechanical', code: 'MEE0326', name: 'انتقال حرارة', section: 3, instructor: 'د. عبدالله عليمات', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1915' },
  { dept: 'mechanical', code: 'MEE2577', name: 'أنظمة التحكم بالتلوث في السيارات', section: 3, instructor: 'د. سليمان أبوعين', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1921' },
  { dept: 'mechanical', code: 'MEE1465', name: 'اهتزازات ميكانيكية', section: 3, instructor: 'د. عبدالسلام الصياغ', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1903' },
  { dept: 'mechanical', code: 'MHV452', name: 'تقنية وتكييف المركبات', section: 3, instructor: 'صقر الطهاوي', time: 'ح ن ث ر 10:00–11:00', room: 'قاعة 1916' },
  { dept: 'mechanical', code: 'MEE2571', name: 'تشخيص وصيانة واصلاح السيارات', section: 3, instructor: 'صقر الطهاوي', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1916' },
  { dept: 'mechanical', code: 'MEE0319', name: 'تصميم ميكانيكي 1', section: 3, instructor: 'أ.د خليل أبوشقير', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1901' },
  { dept: 'mechanical', code: 'MHV353', name: 'تصميم المركبات', section: 4, instructor: 'د. سعد الحاج مصطفى', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1921' },
  { dept: 'mechanical', code: 'MEE3452', name: 'تكنولوجيا تكييف الهواء', section: 3, instructor: 'د. عمر الفرعان', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1902' },
  { dept: 'mechanical', code: 'MEE0212', name: 'ديناميكا', section: 3, instructor: 'هرت', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1913' },
  { dept: 'mechanical', code: 'MEE0225', name: 'ديناميكا حرارية', section: 3, instructor: 'د. تيسير أبو رحمة', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1903' },
  { dept: 'mechanical', code: 'MEE1268', name: 'رسم ميكانيكي', section: 2, instructor: 'هرت', time: 'ن ر 02:30–05:30', room: 'مرسم 1910' },
  { dept: 'mechanical', code: 'BSE0205', name: 'رسم هندسي', section: 2, instructor: 'د. سعد الحاج مصطفى', time: 'ح ث 11:30–02:30 / ن ر 11:30–02:30', room: 'مختبر الرسم الميكانيكي 1923' },
  { dept: 'mechanical', code: 'MEE1563', name: 'طرائق العنصر المحدود', section: 3, instructor: 'د. فادي القدس', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1915' },
  { dept: 'mechanical', code: 'MEE0213', name: 'علم المواد', section: 3, instructor: 'أ.د غازي المراحلة', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1914' },
  { dept: 'mechanical', code: 'MEE1461', name: 'عمليات التصنيع', section: 3, instructor: 'أ.د خليل أبوشقير', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1901' },
  { dept: 'mechanical', code: 'MEE2451', name: 'محركات الاحتراق الداخلي', section: 3, instructor: 'د. عمر الفرعان', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1902' },
  { dept: 'mechanical', code: 'MEE3450', name: 'محطات توليد الطاقة', section: 3, instructor: 'د. تيسير أبو رحمة', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1903' },
  { dept: 'mechanical', code: 'MEE2460', name: 'مختبر أساسيات الأوتوترونيكس', section: 1, instructor: 'د. سليمان أبوعين', time: 'ح ث 11:30–02:30', room: 'مختبر أساسيات الأوتوترونيكس' },
  { dept: 'mechanical', code: 'MEE1466', name: 'مختبر التحكم والاهتزازات', section: 1, instructor: 'د. فادي القدس', time: 'ح ث 11:30–02:30', room: 'مختبر القياسات والتحكم' },
  { dept: 'mechanical', code: 'MEE0413', name: 'مختبر القياسات الهندسية', section: 1, instructor: 'هرت', time: 'ح ث 11:30–02:30 / ن ر 08:30–11:30', room: 'مختبر القياسات والتحكم' },
  { dept: 'mechanical', code: 'MEE0427', name: 'مختبر انتقال الحرارة', section: 1, instructor: 'هرت', time: 'ح ث 11:30–02:30 / ن ر 08:30–11:30', room: 'مختبر الهندسة الحرارية' },
  { dept: 'mechanical', code: 'MEE0226', name: 'مختبر ديناميكا حرارية', section: 1, instructor: 'هرت', time: 'ن ر 11:30–02:30 / ح ث 11:30–02:30', room: 'مختبر الهندسة الحرارية' },
  { dept: 'mechanical', code: 'MEE2565', name: 'مختبر كهرباء وإلكترونيات السيارات', section: 1, instructor: 'د. سليمان أبوعين', time: 'ن ر 11:30–02:30', room: 'مشغل تشخيص وصيانة السيارات' },
  { dept: 'mechanical', code: 'MEE0315', name: 'مختبر مقاومة المواد', section: 1, instructor: 'هرت', time: 'ح ث 11:30–02:30', room: 'مختبر مقاومة المواد' },
  { dept: 'mechanical', code: 'MEE0328', name: 'مختبر ميكانيكا الموائع', section: 1, instructor: 'هرت', time: 'ح ث 11:30–02:30 / ن ر 11:30–02:30', room: 'مختبر الموائع والآلات الهيدروليكية' },
  { dept: 'mechanical', code: 'MEE1364', name: 'مختبر نظرية الآلات', section: 1, instructor: 'د. عبدالسلام الصياغ', time: 'ح ث 02:30–05:30 / ن ر 02:30–05:30', room: 'مختبر نظرية الآلات' },
  { dept: 'mechanical', code: 'MEE2454', name: 'مختبر هندسة السيارات', section: 1, instructor: 'د. وليد المومني', time: 'ح ث 02:30–05:30', room: 'مشغل السيارات' },
  { dept: 'mechanical', code: 'MEE0214', name: 'مقاومة المواد', section: 3, instructor: 'أ.د محمد الحسن', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1901' },
  { dept: 'mechanical', code: 'MEE3550', name: 'مواضيع خاصة في هندسة الآلات الحرارية والهيدروليكية', section: 3, instructor: 'أ.د غازي المراحلة', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1914' },
  { dept: 'mechanical', code: 'MEE0327', name: 'ميكانيكا الموائع', section: 3, instructor: 'د. عمر الفرعان', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1902' },
  { dept: 'mechanical', code: 'MEE2453', name: 'هندسة السيارات 1', section: 3, instructor: 'د. وليد المومني', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1917' },
  { dept: 'mechanical', code: 'MHV457', name: 'هندسة المركبات الكهربائية', section: 3, instructor: 'هشام المجلث', time: 'ح ث 12:30–01:30', room: 'قاعة 1911' },
  { dept: 'mechanical', code: 'MEE0541', name: 'مشروع التخرج 1', section: 1, instructor: '—', time: '—', room: '—' },
  { dept: 'mechanical', code: 'MEE0542', name: 'مشروع التخرج 2', section: 3, instructor: '—', time: '—', room: '—' },
  { dept: 'mechanical', code: 'BSE0102', name: 'مشغل هندسي', section: 1, instructor: 'هرت', time: 'ح ث 08:30–11:30 / ن ر 11:30–02:30', room: 'مشاغل التأسيس' },

  // CIVIL
  { dept: 'civil', code: 'SGE0221', name: 'إستاتيكا', section: 3, instructor: 'د. فاروق مرقه', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1012' },
  { dept: 'civil', code: 'BSE0401', name: 'اقتصاد هندسي', section: 3, instructor: 'د. يزن الزعبي', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1015' },
  { dept: 'civil', code: 'IEC101', name: 'الابتكار والريادة والإبداع', section: 2, instructor: 'أنس الزيود', time: 'ح ن ث ر 04:30–05:30', room: 'online' },
  { dept: 'civil', code: '30146541', name: 'التدريب الميداني', section: 6, instructor: 'هرت', time: 'ح ن ث ر خ 08:30–03:30', room: 'ميدان تدريب/هندسة مدنية' },
  { dept: 'civil', code: 'BSE0203', name: 'الكتابة التقنية والأخلاقيات المهنية', section: 3, instructor: 'د. فاروق مرقه', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1023' },
  { dept: 'civil', code: 'SGE0213', name: 'المسالحة', section: 3, instructor: 'د. دانا أبو دية', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1021' },
  { dept: 'civil', code: 'CIE3431', name: 'إنشاء مباني', section: 2, instructor: 'أ.د محمد عواد', time: 'ح ن ث ر 01:00–02:00', room: 'قاعة 1025' },
  { dept: 'civil', code: 'CIE3551', name: 'أنظمة النقل الذكية', section: 3, instructor: 'د. دانا أبو دية', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1014' },
  { dept: 'civil', code: 'CIE1534', name: 'تحليل إنشائي متقدم', section: 3, instructor: 'أ.د احمد ياسين', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1014' },
  { dept: 'civil', code: 'CIE0331', name: 'تحليل إنشائي 1', section: 3, instructor: 'د. احمد ملكاوي', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1013' },
  { dept: 'civil', code: 'CIE0433', name: 'تصميم الخرسانة المسلحة (1)', section: 3, instructor: 'د. احمد ملكاوي', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1013' },
  { dept: 'civil', code: 'BSE0306', name: 'تقنيات عديدة', section: 3, instructor: 'د. فاروق مرقه', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1011' },
  { dept: 'civil', code: 'CIE0333', name: 'خواص الخرسانة', section: 3, instructor: 'أ.د محمد عواد', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1026' },
  { dept: 'civil', code: 'CIE0335', name: 'مختبر خواص الخرسانة', section: 1, instructor: 'أ.د محمد عواد', time: 'ن ر 02:30–05:30', room: 'مختبر تكنولوجيا الخرسانة' },
  { dept: 'civil', code: 'CIE0591', name: 'مشروع التخرج 1', section: 3, instructor: '—', time: '—', room: '—' },
  { dept: 'civil', code: 'CIE0592', name: 'مشروع التخرج 2', section: 3, instructor: '—', time: '—', room: '—' },
  { dept: 'civil', code: 'ART260', name: 'ممارسة مهنية (1)', section: 3, instructor: 'هرت', time: 'ح ن ث ر خ 08:30–03:30', room: 'ميدان تدريب/هندسة مدنية' },
  { dept: 'civil', code: 'CIE0563', name: 'هندسة الأساسات', section: 3, instructor: 'أ.د احمد ياسين', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1014' },
  { dept: 'civil', code: 'CIE3552', name: 'هندسة المرور', section: 2, instructor: 'د. دانا أبو دية', time: 'ح ن ث ر 10:00–11:00', room: 'قاعة 1021' },

  // ELECTRICAL
  { dept: 'electrical', code: 'ELE6572', name: 'التشفير وأمن أنظمة الشبكات', section: 3, instructor: 'د. علي محمد علي', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1731' },
  { dept: 'electrical', code: 'ELE5453', name: 'الذكاء الاصطناعي وتعلم الآلة', section: 3, instructor: 'د. محمد عتوم', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1734' },
  { dept: 'electrical', code: 'ELE6465', name: 'الشبكات اللاسلكية', section: 3, instructor: 'د. عاهد التوافعه', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1733' },
  { dept: 'electrical', code: 'ELE0216', name: 'الكترونيات (1)', section: 3, instructor: 'أ.د ماجد الدويري', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1712' },
  { dept: 'electrical', code: 'ELE6463', name: 'انترنت الأشياء', section: 3, instructor: 'د. اشرف الشرعه', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1733' },
  { dept: 'electrical', code: 'ELE6571', name: 'أنظمة التحقيقات والأدلة الرقمية', section: 3, instructor: 'د. لؤي السياتين', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1723' },
  { dept: 'electrical', code: 'ELE1480', name: 'أنظمة الطاقة المتجددة', section: 3, instructor: 'د. عماد عوادة', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1227' },
  { dept: 'electrical', code: 'ELE0228', name: 'أنظمة المعالجات الدقيقة', section: 3, instructor: 'د. طارق علاونه', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1734' },
  { dept: 'electrical', code: 'ELE5354', name: 'أنظمة قواعد البيانات', section: 3, instructor: 'د. جهاد عبدالجليل', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1725' },
  { dept: 'electrical', code: 'ELE0321', name: 'أنظمة واشارات', section: 3, instructor: 'د. فائق الربيع', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1714' },
  { dept: 'electrical', code: 'ELE6466', name: 'بروتوكولات الشبكات', section: 3, instructor: 'د. اشرف الشرعه', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1733' },
  { dept: 'electrical', code: 'ELE1473', name: 'تحليل أنظمة القوى الكهربائية (2)', section: 3, instructor: 'أ.د علي الدلابيح', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1711' },
  { dept: 'electrical', code: 'ELE5252', name: 'تراكيب البيانات والخوارزميات', section: 3, instructor: 'د. محمد عتوم', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1726' },
  { dept: 'electrical', code: 'ELE0213', name: 'تصميم المنطق الرقمي', section: 3, instructor: 'د. شرحبيل النابلسي', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1226' },
  { dept: 'electrical', code: 'ELE4567', name: 'دوائر الاتصالات', section: 3, instructor: 'د. فائق الربيع', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1714' },
  { dept: 'electrical', code: 'ELE0211', name: 'دوائر كهربائية (1)', section: 3, instructor: 'أ.د امجد هندي', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1711' },
  { dept: 'electrical', code: 'ELE0212', name: 'دوائر كهربائية (2)', section: 3, instructor: 'ياسمين الشبول', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1712' },
  { dept: 'electrical', code: 'ELE1311', name: 'قياسات كهربائية وإلكترونية', section: 3, instructor: 'د. عماد عوادة', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1011' },
  { dept: 'electrical', code: 'ELE4353', name: 'كهرومغناطيسية (2)', section: 3, instructor: 'ياسمين الشبول', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1713' },
  { dept: 'electrical', code: 'ELE1358', name: 'مختبر آلات كهربائية', section: 1, instructor: 'أ.د علي الدلابيح / أ.د أيمن الرواشده', time: 'ن ر 02:30–05:30 / ح ث 11:30–02:30', room: 'مختبر الآلات الكهربائية' },
  { dept: 'electrical', code: 'ELE5462', name: 'مختبر الأنظمة المضمنة', section: 1, instructor: 'د. محمد عتوم', time: 'ح ث 02:30–05:30', room: 'مختبر تصميم الأنظمة الرقمية' },
  { dept: 'electrical', code: 'ELE6576', name: 'مختبر التحقيقات والأدلة الرقمية', section: 1, instructor: 'أ.د عبدالرحمن الزبيدي', time: 'ح ث 02:30–05:30', room: 'مختبر أمن الحاسوب والشبكات والأنظمة الرقمية' },
  { dept: 'electrical', code: 'ELE0313', name: 'مختبر الكترونيات (1)', section: 1, instructor: 'د. جودت الكساسبه / د. فائق الربيع', time: 'متعددة', room: 'مختبر الإلكترونيات' },
  { dept: 'electrical', code: 'ELE6574', name: 'مختبر أمن أنظمة الشبكات', section: 1, instructor: 'د. علي محمد علي', time: 'ن ر 02:30–05:30', room: 'مختبر أمن الحاسوب والشبكات' },
  { dept: 'electrical', code: 'ELE0328', name: 'مختبر أنظمة المعالجات الدقيقة', section: 1, instructor: 'هرت', time: 'متعددة', room: 'مختبر أنظمة المعالجات' },
  { dept: 'electrical', code: 'ELE5455', name: 'مختبر أنظمة قواعد البيانات', section: 1, instructor: 'د. جهاد عبدالجليل', time: 'ن ر 11:30–02:30', room: 'مختبر أكاديمية A1' },
  { dept: 'electrical', code: 'ELE6565', name: 'مختبر بروتوكولات الشبكات', section: 1, instructor: 'د. جهاد عبدالجليل', time: 'ح ث 02:30–05:30', room: 'مختبر أمن الحاسوب والشبكات' },
  { dept: 'electrical', code: 'ELE5254', name: 'مختبر تراكيب البيانات والخوارزميات', section: 1, instructor: 'د. محمد عتوم', time: 'ن ر 02:30–05:30', room: 'مختبر أكاديمية A1' },
  { dept: 'electrical', code: 'ELE5216', name: 'مختبر تصميم المنطق الرقمي', section: 1, instructor: 'د. احمد أبو خضره / مازن حمدان', time: 'متعددة', room: 'مختبر تصميم الأنظمة الرقمية' },
  { dept: 'electrical', code: 'ELE1472', name: 'مختبر حماية أنظمة القوى الكهربائية', section: 1, instructor: 'أ.د علي الدلابيح', time: 'ح ث 02:30–05:30', room: 'مختبر الحماية والقوى الكهربائية' },
  { dept: 'electrical', code: 'ELE0214', name: 'مختبر دوائر كهربائية', section: 1, instructor: 'أ.د امجد هندي / أ.د ماجد الدويري', time: 'متعددة', room: 'مختبر الدوائر الكهربائية' },
  { dept: 'electrical', code: 'ELE6464', name: 'مختبر شبكات الحاسوب', section: 1, instructor: 'أ.د احمد شرايفة / د. عاهد التوافعه / د. لؤي السياتين', time: 'متعددة', room: 'مختبر الشبكات' },
  { dept: 'electrical', code: 'ELE5364', name: 'مختبر معمارية الحاسوب وتنظيمه', section: 1, instructor: 'هرت', time: 'ن ر 02:30–05:30', room: 'مختبر تصميم الأنظمة الرقمية' },
  { dept: 'electrical', code: 'ELE5361', name: 'معمارية الحاسوب وتنظيمه', section: 3, instructor: 'د. احمد أبو خضره', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1732' },
  { dept: 'electrical', code: 'ELE5467', name: 'معمارية الحواسيب المتقدمة', section: 3, instructor: 'د. شرحبيل النابلسي', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1722' },
  { dept: 'electrical', code: 'ECT143', name: 'ممارسة مهنية 1', section: 3, instructor: 'هرت', time: 'ح ن ث ر خ 08:30–03:30', room: 'ميدان تدريب/هندسة كهربائية' },
  { dept: 'electrical', code: 'ELE5565', name: 'موضوعات خاصة في هندسة الحاسوب', section: 3, instructor: 'د. جهاد عبدالجليل', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1725' },
  { dept: 'electrical', code: 'ELE6575', name: 'موضوعات خاصة في هندسة الشبكات وأمن الشبكات', section: 3, instructor: 'أ.د عبدالرحمن الزبيدي', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1732' },
  { dept: 'electrical', code: 'ELE5362', name: 'نظم التشغيل', section: 3, instructor: 'د. عاهد التوافعه', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1723' },
  { dept: 'electrical', code: 'ELE1571', name: 'هندسة الضغط العالي', section: 3, instructor: 'ياسمين الشبول', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1712' },
  { dept: 'electrical', code: 'ELE4455', name: 'اتصالات الأمواج الدقيقة', section: 3, instructor: 'د. مهدي نصيرات', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1714' },
  { dept: 'electrical', code: 'ELE4461', name: 'اتصالات رقمية', section: 3, instructor: 'د. مهدي نصيرات', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1714' },
  { dept: 'electrical', code: 'ELE0322', name: 'اتصالات وارسال البيانات', section: 3, instructor: 'أ.د امجد هندي', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1711' },
  { dept: 'electrical', code: 'ELE6472', name: 'أساسيات الأمن السيبراني', section: 3, instructor: 'د. علي محمد علي', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1731' },
  { dept: 'electrical', code: 'ELE6461', name: 'أساسيات شبكات الحاسوب', section: 3, instructor: 'أ.د احمد شرايفة', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1722' },
  { dept: 'electrical', code: 'ELE0335', name: 'آلات كهربائية (1)', section: 3, instructor: 'أ.د أيمن الرواشده', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1713' },
  { dept: 'electrical', code: 'ELE5461', name: 'الأنظمة المضمنة', section: 3, instructor: 'د. لؤي السياتين', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1724' },
  { dept: 'electrical', code: 'ELE5251', name: 'البرمجة بلغة الكيسنونة', section: 3, instructor: 'سماح مساعده', time: 'ن ر 11:30–02:30', room: 'مختبر أكاديمية A4' },
  { dept: 'electrical', code: 'BSE0201', name: 'البرمجة للمهندسين', section: 3, instructor: 'نوال الزين', time: 'ح ن ث ر 04:30–07:30 / online', room: 'online' },
  { dept: 'electrical', code: '35005099', name: 'مهارات الحاسوب الاستدراكي', section: 3, instructor: 'أنور الفلح', time: 'ح ن ث ر 06:00–07:30', room: 'online' },
  { dept: 'electrical', code: 'CS101', name: 'مهارات الحاسوب والتعلم الإلكتروني', section: 3, instructor: 'مازن حمدان', time: 'ن ر 04:30–05:30', room: 'online' },

  // CHEMICAL
  { dept: 'chemical', code: 'CHE0464', name: 'إدارة المصانع', section: 3, instructor: 'د. إبراهيم سليمان', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1811' },
  { dept: 'chemical', code: 'CHE0490', name: 'التدريب الميداني', section: 3, instructor: 'هرت', time: 'ح ن ث ر خ 08:30–05:30', room: 'ميدان تدريب/هندسة كيميائية' },
  { dept: 'chemical', code: 'CHE0461', name: 'المنتجة والمحاكاة في الهندسة الكيميائية', section: 3, instructor: 'أ.د أحمد شواقفه', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1803' },
  { dept: 'chemical', code: 'CHE1518', name: 'الهندسة الكهروكيميائية', section: 3, instructor: 'أ.د انشراح دعنا', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1812' },
  { dept: 'chemical', code: 'CHE0336', name: 'انتقال المادة', section: 3, instructor: 'أ.د انشراح دعنا', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1812' },
  { dept: 'chemical', code: 'CHE1424', name: 'تكرير البترول', section: 3, instructor: 'أ.د مازن أبوخضر', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1804' },
  { dept: 'chemical', code: 'CHE1523', name: 'تكنولوجيا الصناعات الكيميائية 2', section: 3, instructor: 'أ.د زكريا الفضاء', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1802' },
  { dept: 'chemical', code: 'CHE0112', name: 'مبادئ الهندسة الكيميائية', section: 3, instructor: 'أ.د مازن أبوخضر', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1804' },
  { dept: 'chemical', code: 'CHE1528', name: 'مختبر العمليات وتكنولوجيا الصناعات', section: 1, instructor: 'هرت', time: 'ح ث 02:30–05:30', room: 'مختبر الهندسة الكيميائية 4' },
  { dept: 'chemical', code: 'CHE0562', name: 'مختبر ديناميكا العمليات والتحكم', section: 1, instructor: 'هرت', time: 'ن ر 02:30–05:30', room: 'مختبر الهندسة الكيميائية 3' },
  { dept: 'chemical', code: 'CHE0441', name: 'مختبر هندسة التفاعلات الكيميائية', section: 1, instructor: 'هرت', time: 'ح ث 02:30–05:30', room: 'مختبر الهندسة الكيميائية 2' },
  { dept: 'chemical', code: 'CHE0591', name: 'مشروع التخرج 1', section: 1, instructor: '—', time: '—', room: '—' },
  { dept: 'chemical', code: 'CHE0592', name: 'مشروع التخرج 2', section: 3, instructor: '—', time: '—', room: '—' },
  { dept: 'chemical', code: 'CHE0483', name: 'هندسة العمليات الحيوية', section: 3, instructor: 'أ.د زكريا الفضاء', time: 'ح ن ث ر 01:00–02:30', room: 'قاعة 1802' },
  { dept: 'chemical', code: 'CHE0346', name: 'هندسة تفاعلات كيميائية 2', section: 3, instructor: 'د. إبراهيم سليمان', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1811' },

  // SCIENCE
  { dept: 'science', code: 'BSE0202', name: 'إحصاء واحتمالات للهندسة', section: 3, instructor: 'أ.د محمد ناصر', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1229' },
  { dept: 'science', code: '20202101', name: 'التفاضل والتكامل (1)', section: 3, instructor: 'د. مأمون الجرايزه', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1025' },
  { dept: 'science', code: '30202102', name: 'التفاضل والتكامل (2)', section: 3, instructor: 'كامل شليقل', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1226' },
  { dept: 'science', code: 'MEE1361', name: 'الرياضيات التطبيقية للمهندسين', section: 3, instructor: 'أ.د محمد ناصر', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1229' },
  { dept: 'science', code: '30201101', name: 'الفيزياء العامة (1)', section: 3, instructor: 'د. وسن ال غريه', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 1026' },
  { dept: 'science', code: '30201102', name: 'الفيزياء العامة (2)', section: 3, instructor: 'أ.د مقلح الحميدين', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 1012' },
  { dept: 'science', code: '30201111', name: 'الفيزياء العامة علمي (1)', section: 1, instructor: 'هرت', time: 'متعددة (8 شعب)', room: 'مختبر الفيزياء العامة 1 و 3' },
  { dept: 'science', code: '30206101', name: 'الكيمياء العامة (1)', section: 3, instructor: 'د. ريم دبابنة', time: 'ح ن ث ر 10:00–11:30', room: 'قاعة 516' },
  { dept: 'science', code: '30206111', name: 'الكيمياء العامة العملية 1', section: 1, instructor: 'هرت', time: 'ح ث 08:30–11:30 / ن ر 02:30–05:30', room: 'مختبر الكيمياء العامة 2' },
  { dept: 'science', code: '30202203', name: 'المعادلات التفاضلية العادية (1)', section: 3, instructor: 'أ.د غالب جمعة', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 1227' },
  { dept: 'science', code: 'ELE0205', name: 'جبر خطي', section: 3, instructor: 'عمار عيسى', time: 'ح ن ث ر 11:30–01:00', room: 'قاعة 522' },
  { dept: 'science', code: '30206217', name: 'كيمياء تحليلية وتحليل آلي', section: 3, instructor: 'د. ريم دبابنة', time: 'ح ن ث ر 08:30–10:00', room: 'قاعة 521' },
  { dept: 'science', code: '30206219', name: 'مختبر كيمياء تحليلية وتحليل آلي', section: 1, instructor: 'هرت', time: 'ن ر 02:30–05:30', room: 'مختبر الكيمياء العامة 3' },
  { dept: 'science', code: '30206239', name: 'مختبر كيمياء عضوية', section: 1, instructor: 'هرت', time: 'ح ث 02:30–05:30', room: 'مختبر الكيمياء العامة 2' },

  // HUMANITIES
  { dept: 'humanities', code: '36009109', name: 'الإسلام والحياة', section: 3, instructor: 'أ.د أحمد الربايعة', time: 'ح ن ث ر 03:00–04:30', room: 'online' },
  { dept: 'humanities', code: 'NE101', name: 'التربية الوطنية والسلوك الجامعي', section: 3, instructor: 'أ.د عبدالرحمن الفواز', time: 'ح ن ث ر 03:00–04:30', room: 'online' },
  { dept: 'humanities', code: '36005105', name: 'الثقافة الإسلامية', section: 3, instructor: 'أ.د أحمد الربايعة', time: 'ح ن ث ر 04:30–06:00', room: 'online' },
  { dept: 'humanities', code: '36012109', name: 'الخلفاء الراشدين', section: 3, instructor: 'د. محمد خطاب', time: 'ح ن ث ر 04:30–06:00', room: 'online' },
  { dept: 'humanities', code: '60000121', name: 'الريادة والإبتكار (باللغة الإنجليزية)', section: 2, instructor: 'هرت', time: 'ن ر 03:00–04:00 / ح ث 03:00–04:00', room: 'online' },
  { dept: 'humanities', code: 'TS 105', name: 'السلامة المرورية', section: 3, instructor: 'الرائد محمد الراشدان', time: 'ح ن ث ر 04:30–06:00', room: 'online' },
  { dept: 'humanities', code: '301501199', name: 'اللغة العربية 99', section: 3, instructor: 'د. أيمان القبيلات', time: 'ح ن ث ر 03:00–04:30', room: 'online' },
  { dept: 'humanities', code: '60000123', name: 'المهارات الحياتية والعمل (باللغة الإنجليزية)', section: 2, instructor: 'هرت', time: 'ح ث 05:00–06:00 / ن ر 05:00–06:00', room: 'online' },
  { dept: 'humanities', code: '35001101', name: 'علوم عسكرية', section: 3, instructor: 'النقيب دعاء حامد المواجده', time: 'ح ن ث ر 03:00–04:30', room: 'online' },
  { dept: 'humanities', code: 'AEL101', name: 'لغة إنجليزية تطبيقية 1', section: 3, instructor: 'نضال المساعيد', time: 'ح ن ث ر 06:00–07:30', room: 'online' },
  { dept: 'humanities', code: 'AEL102', name: 'لغة إنجليزية تطبيقية 2', section: 3, instructor: 'نضال المساعيد', time: 'ح ن ث ر 04:30–06:00', room: 'online' },
  { dept: 'humanities', code: 'AAL101', name: 'لغة عربية تطبيقية', section: 3, instructor: 'أ.د أحمد النعيمي', time: 'ح ن ث ر 03:00–04:30', room: 'online' },
];

// Helper to parse time
const parseTime = (timeStr) => {
  if (!timeStr || timeStr === '—' || timeStr === 'متعددة' || timeStr === 'online') {
    return { start: null, end: null };
  }
  
  // Clean string and extract HH:mm–HH:mm
  const match = timeStr.match(/(\d{2}:\d{2})–(\d{2}:\d{2})/);
  if (match) {
    return { start: match[1], end: match[2] };
  }
  return { start: null, end: null };
};

async function migrate() {
  console.log("🚀 Starting data migration to 'available_sections' table...");

  // 1. Clear existing data to avoid duplicates
  console.log("🧹 Clearing existing data...");
  const { error: deleteError } = await supabase
    .from('available_sections')
    .delete()
    .neq('course_code', ''); // Delete all rows where course_code is not empty (effectively all)

  if (deleteError) {
    console.error("❌ Failed to clear existing data:", deleteError);
    // Continue anyway or exit? Usually better to know why it failed.
  }

  // 2. Prepare data for insertion
  const dataToInsert = RAW_DATA.map(item => {
    const { start, end } = parseTime(item.time);
    // Extract everything before the first digit as days
    const daysMatch = item.time.match(/^[^\d]+/);
    const days = daysMatch ? daysMatch[0].trim() : null;

    return {
      course_code: item.code,
      course_name: item.name,
      section_number: item.section,
      days: days,
      time_start: start,
      time_end: end,
      instructor: item.instructor,
      room: item.room,
      department: item.dept
    };
  });

  // 3. Insert new data
  const { error: insertError } = await supabase
    .from('available_sections')
    .insert(dataToInsert);

  if (insertError) {
    console.error("❌ Migration failed:", insertError);
  } else {
    console.log(`✅ Successfully migrated ${dataToInsert.length} sections!`);
  }
}

migrate();
