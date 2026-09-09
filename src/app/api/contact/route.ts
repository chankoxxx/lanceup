import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact";
import { sendNotification } from "@/lib/email";

const recent = new Map<string, number>();
const ids = new Map<string, number>();
const RATE_WINDOW = 60_000;
const RECORD_TTL = 10 * 60_000;

export function cleanupExpiredRecords(now: number, records: Map<string, number>, ttl = RECORD_TTL) {
  for (const [key, timestamp] of records) if (timestamp <= now - ttl) records.delete(key);
}

export function createInquiryId(now = new Date(), uuid = crypto.randomUUID()) {
  const date = now.toISOString().slice(0,10).replaceAll("-","");
  return `LU-${date}-${uuid.slice(0,8).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  const declaredSize = Number(req.headers.get("content-length") || 0);
  if (declaredSize > 25_000) return NextResponse.json({ error: "送信内容が大きすぎます。" }, { status: 413 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  cleanupExpiredRecords(now, recent);
  cleanupExpiredRecords(now, ids);
  if ((recent.get(ip) || 0) > now - RATE_WINDOW) return NextResponse.json({ error: "しばらく待ってから再度お試しください。" }, { status: 429 });
  let raw: unknown;
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "送信内容を確認してください。" }, { status: 400 }); }
  const result = contactSchema.safeParse(raw);
  if (!result.success) return NextResponse.json({ error: "入力内容を確認してください。", fields:result.error.flatten().fieldErrors }, { status: 400 });
  if (result.data.website || now - result.data.startedAt < 1500) return NextResponse.json({ error: "送信を完了できませんでした。" }, { status: 400 });
  if (ids.has(result.data.submissionId)) return NextResponse.json({ error: "この内容は送信済みです。" }, { status: 409 });
  recent.set(ip, now); ids.set(result.data.submissionId, now);
  try {
    const inquiryId = createInquiryId();
    await sendNotification(result.data, inquiryId);
    return NextResponse.json({ ok: true, inquiryId });
  } catch (error) {
    recent.delete(ip); ids.delete(result.data.submissionId);
    console.error("Contact notification failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "送信できませんでした。時間をおいてもう一度お試しください。" }, { status: 503 });
  }
}
