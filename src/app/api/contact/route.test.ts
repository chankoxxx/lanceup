import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { cleanupExpiredRecords, createInquiryId, POST } from "./route";
import { sendNotification } from "@/lib/email";
import { validContact } from "@/test/fixtures";

vi.mock("@/lib/email",()=>({sendNotification:vi.fn()}));
const request=(body:unknown,ip:string)=>new NextRequest("http://localhost/api/contact",{method:"POST",headers:{"content-type":"application/json","x-forwarded-for":ip},body:JSON.stringify(body)});
const payload=()=>({...validContact,startedAt:Date.now()-3000,submissionId:crypto.randomUUID()});

describe("contact API",()=>{
  beforeEach(()=>{vi.mocked(sendNotification).mockReset();vi.mocked(sendNotification).mockResolvedValue(undefined);});
  it("sends a valid lead and returns a reference number",async()=>{const res=await POST(request(payload(),"10.0.1.1"));expect(res.status).toBe(200);expect((await res.json()).inquiryId).toMatch(/^LU-\d{8}-[A-F0-9]{8}$/);expect(sendNotification).toHaveBeenCalledOnce();});
  it("strips unsupported attribution before notification",async()=>{const res=await POST(request({...payload(),attribution:{utm_source:"google",private_key:"value"}},"10.0.1.2"));expect(res.status).toBe(200);expect(sendNotification).toHaveBeenCalledWith(expect.objectContaining({attribution:{utm_source:"google"}}),expect.stringMatching(/^LU-/));});
  it("rejects invalid input",async()=>{const res=await POST(request({...payload(),privacyConsent:false},"10.0.1.3"));expect(res.status).toBe(400);expect(sendNotification).not.toHaveBeenCalled();});
  it("returns a safe error when notification fails",async()=>{vi.spyOn(console,"error").mockImplementation(()=>undefined);vi.mocked(sendNotification).mockRejectedValueOnce(new Error("SMTP secret"));const res=await POST(request(payload(),"10.0.1.4"));expect(res.status).toBe(503);expect((await res.json()).error).not.toContain("SMTP");});
  it("blocks rapid duplicate submissions",async()=>{const ip="10.0.1.5";expect((await POST(request(payload(),ip))).status).toBe(200);expect((await POST(request(payload(),ip))).status).toBe(429);});
  it("removes expired rate and idempotency records",()=>{const records=new Map([["old",100],["fresh",950]]);cleanupExpiredRecords(1000,records,100);expect([...records.keys()]).toEqual(["fresh"]);});
  it("creates a readable inquiry ID",()=>{expect(createInquiryId(new Date("2026-09-09T00:00:00Z"),"550e8400-e29b-41d4-a716-446655440000")).toBe("LU-20260909-550E8400");});
});
