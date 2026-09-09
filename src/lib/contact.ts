import { z } from "zod";

const required = (label: string) => z.string().trim().min(1, `${label}を入力してください`).max(120);

export const attributionKeys = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term",
  "utm_content", "gclid", "landing_page", "referrer",
] as const;

const attributionSchema = z.object(
  Object.fromEntries(attributionKeys.map((key) => [key, z.string().max(1000).optional()])) as Record<(typeof attributionKeys)[number], z.ZodOptional<z.ZodString>>,
);

export const contactSchema = z.object({
  experienceYears: required("IT実務経験年数"),
  technologies: z.string().trim().max(500).optional().default(""),
  employmentStatus: required("現在の雇用形態"),
  considerationTiming: required("検討時期"),
  desiredCompensation: z.string().trim().max(100).optional().default(""),
  name: z.string().trim().min(1, "氏名を入力してください").max(80),
  prefecture: required("お住まいの都道府県"),
  age: z.string().trim().regex(/^(1[8-9]|[2-9]\d)$/, "年齢は18〜99歳で入力してください"),
  contactMethod: z.enum(["line", "email"], { error: "希望する連絡方法を選択してください" }),
  email: z.union([z.literal(""), z.string().trim().email("正しいメールアドレスを入力してください").max(254)]),
  phone: z.string().trim().max(30).refine((v) => !v || /^[0-9+()\-\s]+$/.test(v), "電話番号の形式を確認してください").optional().default(""),
  japaneseAvailable: z.literal("yes", { error: "日本語での対応可否を確認してください" }),
  privacyConsent: z.literal(true, { error: "個人情報の取り扱いへの同意が必要です" }),
  attribution: attributionSchema.optional().default({}),
  website: z.string().max(0).optional().default(""),
  startedAt: z.number().int().positive(),
  submissionId: z.string().uuid(),
}).superRefine((value, context) => {
  if (value.contactMethod === "email" && !value.email) context.addIssue({ code:"custom",path:["email"],message:"メールアドレスを入力してください" });
});

export type ContactInput = z.infer<typeof contactSchema>;

export function collectAttribution(search: string, landingPage: string, referrer: string, stored: Record<string, string> = {}) {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  for (const key of attributionKeys) if (stored[key]) result[key] = stored[key].slice(0, 1000);
  for (const key of attributionKeys.slice(0, 6)) {
    const value = params.get(key);
    if (value) result[key] = value.slice(0, 1000);
  }
  if (!result.landing_page) result.landing_page = landingPage.slice(0, 1000);
  if (!result.referrer && referrer) result.referrer = referrer.slice(0, 1000);
  return result;
}
