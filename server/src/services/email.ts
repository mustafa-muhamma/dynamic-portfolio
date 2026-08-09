import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 8000;
const DEDUPE_WINDOW_MS = 60_000;

const apiKey = env.EMAIL_API_KEY;
const from = env.EMAIL_FROM;

const lastSentAt = new Map<string, number>();

export function emailConfigured(): boolean {
  return Boolean(apiKey && from);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inquiryEmailHtml(input: { name: string; email: string; message: string }): string {
  const message = escapeHtml(input.message).replaceAll("\n", "<br>");
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f5; padding: 24px;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7;">
      <div style="padding: 24px; border-bottom: 1px solid #e4e4e7;">
        <h1 style="margin: 0; font-size: 18px; color: #18181b;">New portfolio inquiry</h1>
        <p style="margin: 4px 0 0; font-size: 14px; color: #71717a;">Someone reached out through the contact form.</p>
      </div>
      <div style="padding: 24px;">
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">${message}</p>
        <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 12px; background-color: #f4f4f5; color: #71717a; width: 40%; border-radius: 8px 0 0 8px;">Name</td>
            <td style="padding: 8px 12px; border: 1px solid #e4e4e7; border-left: none; border-radius: 0 8px 8px 0; color: #18181b;">${escapeHtml(input.name)}</td>
          </tr>
          <tr style="height: 8px;"></tr>
          <tr>
            <td style="padding: 8px 12px; background-color: #f4f4f5; color: #71717a; border-radius: 8px 0 0 8px;">Email</td>
            <td style="padding: 8px 12px; border: 1px solid #e4e4e7; border-left: none; border-radius: 0 8px 8px 0;">
              <a href="mailto:${escapeHtml(input.email)}" style="color: #18181b;">${escapeHtml(input.email)}</a>
            </td>
          </tr>
        </table>
        <a href="${env.CLIENT_URL}/admin/inquiries" style="display: inline-block; margin-top: 24px; padding: 10px 18px; border-radius: 8px; background-color: #18181b; color: #ffffff; font-size: 14px; text-decoration: none;">View in dashboard</a>
      </div>
    </div>
  </div>
  `.trim();
}

export async function sendInquiryNotification(input: {
  recipient: string | undefined;
  id: string;
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!apiKey || !from || !input.recipient) {
    logger.debug("Inquiry notification email skipped (EMAIL_API_KEY/EMAIL_FROM/recipient not set)");
    return;
  }

  const dedupeKey = `${input.email}:${input.message}`;
  const lastSent = lastSentAt.get(dedupeKey) ?? 0;
  if (Date.now() - lastSent < DEDUPE_WINDOW_MS) {
    logger.debug("Inquiry notification email skipped (duplicate within dedupe window)");
    return;
  }
  lastSentAt.set(dedupeKey, Date.now());

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(RESEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from,
          to: [input.recipient],
          reply_to: input.email,
          subject: `New portfolio inquiry from ${input.name}`,
          text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
          html: inquiryEmailHtml(input)
        }),
        signal: controller.signal
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Resend responded ${res.status}: ${body}`);
      }
    } finally {
      clearTimeout(timer);
    }
    logger.info({ inquiryId: input.id }, "Inquiry notification email sent");
  } catch (error) {
    logger.error({ inquiryId: input.id, err: error }, "Failed to send inquiry notification email");
  }
}
