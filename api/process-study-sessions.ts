import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized' });
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing Supabase server configuration' });
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const now = new Date().toISOString();
  const { data: sessions, error } = await db.from('exam_study_sessions').select('id,user_id,session_type,course,starts_at,duration_minutes').eq('status', 'scheduled').eq('notification_sent', false).lte('starts_at', now).order('starts_at', { ascending: true }).limit(100);
  if (error) return res.status(500).json({ error: error.message });
  let notified = 0;
  for (const session of sessions || []) {
    const isBreak = session.session_type === 'break';
    const isReview = session.session_type === 'review';
    const titleAr = isBreak ? 'حان وقت الاستراحة' : isReview ? 'حان وقت المراجعة النهائية' : 'حان وقت الدراسة';
    const titleEn = isBreak ? 'Break time' : isReview ? 'Final review time' : 'Study time';
    const bodyAr = session.course ? `${session.course} — مدة الجلسة ${session.duration_minutes} دقيقة.` : `ابدأ جلستك الآن لمدة ${session.duration_minutes} دقيقة.`;
    const bodyEn = session.course ? `${session.course} — ${session.duration_minutes} minute session.` : `Start your ${session.duration_minutes} minute session now.`;
    const { error: notificationError } = await db.from('notifications').insert({ user_id: session.user_id, title_ar: titleAr, title_en: titleEn, body_ar: bodyAr, body_en: bodyEn, type: 'study_session', link: '/schedule-planner', payload: { session_id: session.id, session_type: session.session_type, course: session.course } });
    if (notificationError) continue;
    await db.from('exam_study_sessions').update({ notification_sent: true, status: 'started' }).eq('id', session.id);
    notified++;
  }
  return res.status(200).json({ ok: true, due: sessions?.length || 0, notified });
}
