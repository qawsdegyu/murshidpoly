# متطلبات قنوات إشعارات Google

## Gmail API

توضح وثائق Google الرسمية أن إرسال الرسالة يتم عبر `users.messages.send` أو `drafts.send`، وأن محتوى الرسالة يجب أن يكون MIME وفق RFC 2822 ثم يُشفّر بصيغة base64URL داخل الحقل `raw`. يتطلب هذا حساب إرسال OAuth ونطاق Gmail مناسبًا، ولا تنتقل صلاحية موصل Gmail في جلسة Manus تلقائيًا إلى endpoint المنشور على Vercel.

المصدر: https://developers.google.com/workspace/gmail/api/guides/sending

## Firebase Cloud Messaging للويب

تتطلب إشعارات الويب HTTPS، وتهيئة Firebase JS SDK، ومفتاح VAPID عام لتسجيل المتصفح، وموافقة المستخدم على `Notification.requestPermission()`. كما يتطلب FCM ملف `firebase-messaging-sw.js` في جذر النطاق، ثم تسجيل هوية تثبيت Firebase وإرسالها إلى خادم التطبيق لاستهداف الجهاز. إرسال الرسائل من الخادم يحتاج إعداد Firebase Admin أو FCM HTTP v1 مع بيانات اعتماد سرية.

المصدر: https://firebase.google.com/docs/cloud-messaging/web/get-started

## قرار التنفيذ

سيتم حفظ تفضيلات القنوات ورموز/معرّفات تثبيت الأجهزة في Supabase، وإنشاء طابور إشعارات يمنع التكرار. لن تُحفظ مفاتيح Gmail أو Firebase داخل الواجهة أو GitHub، بل في متغيرات بيئة الخادم فقط.
