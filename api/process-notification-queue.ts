import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createSign } from 'node:crypto';

const b64url = (value: string) => Buffer.from(value).toString('base64url');
const required = (value: string | undefined, name: string) => { if (!value) throw new Error(`Missing ${name}`); return value; };

async function gmailAccessToken() {
  const clientId = required(process.env.GMAIL_CLIENT_ID, 'GMAIL_CLIENT_ID');
  const clientSecret = required(process.env.GMAIL_CLIENT_SECRET, 'GMAIL_CLIENT_SECRET');
  const refreshToken = required(process.env.GMAIL_REFRESH_TOKEN, 'GMAIL_REFRESH_TOKEN');
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }) });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error(`Gmail token error: ${data.error || response.status}`);
  return data.access_token as string;
}

async function sendGmail(to: string, subject: string, body: string) {
  const token = await gmailAccessToken();
  const sender = required(process.env.GMAIL_SENDER, 'GMAIL_SENDER');
  const mime = [`From: ${sender}`, `To: ${to}`, `Subject: ${subject}`, 'Content-Type: text/plain; charset=UTF-8', 'MIME-Version: 1.0', '', body].join('\r\n');
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw: b64url(mime) }) });
  if (!response.ok) throw new Error(`Gmail send error: ${response.status} ${await response.text()}`);
}

async function fcmAccessToken() {
  const clientEmail = required(process.env.FCM_CLIENT_EMAIL, 'FCM_CLIENT_EMAIL');
  const privateKey = required(process.env.FCM_PRIVATE_KEY, 'FCM_PRIVATE_KEY').replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: clientEmail, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const input = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256'); signer.update(input); signer.end();
  const jwt = `${input}.${signer.sign(privateKey, 'base64url')}`;
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error(`FCM token error: ${data.error || response.status}`);
  return data.access_token as string;
}

async function sendFcm(token: string, title: string, body: string, url: string) {
  const projectId = required(process.env.FCM_PROJECT_ID, 'FCM_PROJECT_ID');
  const accessToken = await fcmAccessToken();
  const response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: { token, notification: { title, body }, data: { url } } }) });
  if (!response.ok) throw new Error(`FCM send error: ${response.status} ${await response.text()}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).end();
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized' });
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Missing Supabase server configuration' });
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: jobs, error } = await db.from('notification_delivery_queue').select('id,channel,destination,notification_id,notifications(title_ar,title_en,body_ar,body_en,link)').eq('status', 'pending').lt('attempts', 5).order('created_at', { ascending: true }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  let sent = 0, failed = 0;
  for (const job of jobs || []) {
    const notification: any = Array.isArray(job.notifications) ? job.notifications[0] : job.notifications;
    try {
      if (job.channel === 'email' && process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_SENDER) await sendGmail(job.destination, notification.title_ar, notification.body_ar);
      else if (job.channel === 'push' && process.env.FCM_PROJECT_ID && process.env.FCM_CLIENT_EMAIL && process.env.FCM_PRIVATE_KEY) await sendFcm(job.destination, notification.title_ar, notification.body_ar, notification.link || '/course-newspaper');
      else continue;
      await db.from('notification_delivery_queue').update({ status: 'sent', attempts: job.channel === 'email' ? 1 : 1, sent_at: new Date().toISOString(), last_error: null }).eq('id', job.id);
      sent++;
    } catch (err) {
      await db.from('notification_delivery_queue').update({ status: 'failed', attempts: 1, last_error: err instanceof Error ? err.message.slice(0, 500) : 'Delivery failed' }).eq('id', job.id);
      failed++;
    }
  }
  return res.status(200).json({ ok: true, processed: (jobs || []).length, sent, failed });
}
