import { describe, expect, it } from "vitest";
import { collectAttribution, contactSchema } from "./contact";
import { validContact } from "@/test/fixtures";

describe("contactSchema",()=>{
  it("accepts the simplified form without role, work style, or technologies",()=>expect(contactSchema.safeParse(validContact).success).toBe(true));
  it("rejects missing required fields",()=>expect(contactSchema.safeParse({...validContact,name:""}).success).toBe(false));
  it("rejects invalid email",()=>expect(contactSchema.safeParse({...validContact,email:"invalid"}).success).toBe(false));
  it("allows LINE without email but requires an address for email contact",()=>{
    expect(contactSchema.safeParse({...validContact,contactMethod:"line",email:""}).success).toBe(true);
    expect(contactSchema.safeParse({...validContact,contactMethod:"email",email:""}).success).toBe(false);
  });
  it("requires the single privacy consent",()=>expect(contactSchema.safeParse({...validContact,privacyConsent:false}).success).toBe(false));
  it("requires a prefecture and an age from 18 to 99",()=>{
    expect(contactSchema.safeParse({...validContact,prefecture:""}).success).toBe(false);
    expect(contactSchema.safeParse({...validContact,age:"17"}).success).toBe(false);
    expect(contactSchema.safeParse({...validContact,age:"100"}).success).toBe(false);
  });
  it("strips unsupported attribution keys",()=>{const value=contactSchema.parse({...validContact,attribution:{utm_source:"google",unexpected:"secret"}});expect(value.attribution).toEqual({utm_source:"google"});});
});

describe("collectAttribution",()=>{
  it("keeps the original landing page and only allowed keys",()=>expect(collectAttribution("?utm_source=google&unknown=value","https://site.test","https://google.com",{landing_page:"https://first.test",bad:"discard"})).toEqual({landing_page:"https://first.test",utm_source:"google",referrer:"https://google.com"}));
});
