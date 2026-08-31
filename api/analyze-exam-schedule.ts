import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const keys = [process.env.OPENROUTER_API_KEY, process.env.VITE_OPENROUTER_API_KEY]
    .filter((value): value is string => Boolean(value?.trim()));
  if (!keys.length) return res.status(500).json({ error: 'AI vision is not configured on the server' });

  let body: Record<string, unknown>;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : ((req.body || {}) as Record<string, unknown>);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  const imageDataUrl = typeof body.imageDataUrl === 'string' ? body.imageDataUrl : '';
  if (!/^data:image\/(?:png|jpe?g|webp);base64,/i.test(imageDataUrl)) {
    return res.status(400).json({ error: 'Please provide a PNG, JPG, or WebP image' });
  }
  if (imageDataUrl.length > 12_000_000) return res.status(413).json({ error: 'Image is too large after compression' });

  let lastProviderMessage = '';
  for (const key of keys) {
    let response: Response;
    try {
      response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0,
          messages: [{ role: 'user', content: [
            { type: 'text', text: 'استخرج جميع البيانات من الصورة (التاريخ، أوقات البدء والانتهاء، القاعة، واسم المادة). أعد JSON فقط بهذا الشكل:\n{"exams":[{"course":"اسم المادة كاملة","date":"YYYY-MM-DD (يجب أن يكون التاريخ بهذا التنسيق حصراً، استنتج السنة الحالية إذا لم تكن موجودة)","start_time":"وقت البدء (مثال: 10:20)","end_time":"وقت الانتهاء (مثال: 11:00)","room":"رقم القاعة (مثال: 1726)","notes":"أي ملاحظات","title":"عنوان مختصر","chapters":6}]}\nتأكد من فصل أوقات البدء والانتهاء عن رقم القاعة. استخرج اسم المادة والتاريخ بدقة، ولا تترك التاريخ فارغاً إذا كان موجوداً في الصورة.' },
            { type: 'image_url', image_url: { url: imageDataUrl, detail: 'high' } },
          ] }],
        }),
      });
    } catch {
      lastProviderMessage = 'تعذر الاتصال بخدمة تحليل الصور';
      continue;
    }

    const payload = await response.json().catch(() => ({}));
    if (response.ok) return res.status(200).json({ choices: Array.isArray(payload?.choices) ? payload.choices : [] });

    lastProviderMessage = typeof payload?.error?.message === 'string' ? payload.error.message : '';
    const isAuthFailure = response.status === 401 || response.status === 403 || /user not found|invalid.*key|unauthorized/i.test(lastProviderMessage);
    if (!isAuthFailure) {
      return res.status(response.status === 429 ? 429 : 502).json({
        error: lastProviderMessage ? `خدمة تحليل الصور غير متاحة حاليًا: ${lastProviderMessage}` : 'خدمة تحليل الصور غير متاحة حاليًا. تحقق من إعداد مفتاح الذكاء الاصطناعي.',
      });
    }
  }

  return res.status(502).json({
    error: 'مفتاح خدمة تحليل الصور غير صالح أو مرفوض. حدّث OPENROUTER_API_KEY في إعدادات Vercel ثم أعد المحاولة.',
  });
}
