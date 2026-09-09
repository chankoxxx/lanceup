import { expect, it } from "vitest";
import { buildNotification } from "./email";
import { contactSchema } from "./contact";
import { validContact } from "@/test/fixtures";

it("includes the inquiry ID and contact method, uses natural placeholders, and omits removed fields",()=>{const input=contactSchema.parse({...validContact,name:"山田\r\nBcc:test"});const mail=buildNotification(input,"LU-20260101-1234ABCD",new Date("2026-01-01T00:00:00Z"));expect(mail.subject).not.toContain("\n");expect(mail.subject).toContain("LU-20260101-1234ABCD");expect(mail.text).toContain("希望連絡方法: メール");expect(mail.text).toContain("年齢: 32歳");expect(mail.text).toContain("お住まい: 東京都");expect(mail.text).toContain("使用技術: 未入力");expect(mail.text).not.toContain("職種:");expect(mail.text).not.toContain("希望する働き方:");});
