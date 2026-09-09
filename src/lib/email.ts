import nodemailer from "nodemailer";
import type { ContactInput } from "./contact";

const labels: Record<string, string> = { utm_source:"UTM source",utm_medium:"UTM medium",utm_campaign:"UTM campaign",utm_term:"UTM term",utm_content:"UTM content",gclid:"gclid",landing_page:"ランディングページ",referrer:"参照元" };
const clean = (value: string) => value.replace(/[\r\n]+/g, " ");

export function buildNotification(input: ContactInput, inquiryId: string, receivedAt = new Date()) {
  const fields = [
    ["問い合わせ番号", inquiryId],
    ["問い合わせ日時", receivedAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })],
    ["氏名", input.name], ["年齢", `${input.age}歳`], ["お住まい", input.prefecture], ["希望連絡方法", input.contactMethod === "line" ? "LINE" : "メール"], ["メールアドレス", input.email || "未入力（LINE希望）"], ["電話番号", input.phone || "未入力"],
    ["IT実務経験年数", input.experienceYears], ["使用技術", input.technologies || "未入力"],
    ["現在の雇用形態", input.employmentStatus], ["フリーランス検討時期", input.considerationTiming],
    ["希望単価・年収", input.desiredCompensation || "未入力"], ["日本語対応", "可能"],
    ...Object.entries(input.attribution).map(([key, value]) => [labels[key], value]),
  ];
  return { subject: `【無料チェック：${inquiryId}】${clean(input.name)}様からのお問い合わせ`, text: fields.map(([key, value]) => `${key}: ${clean(value ?? "")}`).join("\n") };
}

export async function sendNotification(input: ContactInput, inquiryId: string) {
  const required = ["SMTP_HOST","SMTP_PORT","SMTP_USER","SMTP_PASSWORD","CONTACT_NOTIFICATION_TO","CONTACT_FROM"] as const;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing mail configuration: ${missing.join(",")}`);
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port)) throw new Error("Invalid SMTP_PORT");
  const transport = nodemailer.createTransport({ host:process.env.SMTP_HOST,port,secure:port===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD} });
  await transport.sendMail({ from:process.env.CONTACT_FROM,to:process.env.CONTACT_NOTIFICATION_TO,...(input.email ? { replyTo:input.email } : {}),...buildNotification(input,inquiryId) });
}
