import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildLineUrl, ThanksContent } from "./ThanksContent";

describe("ThanksContent",()=>{
  beforeEach(()=>{
    sessionStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_LINE_OA_ID","@lanceup");
  });
  it("creates an official-account chat URL with the reference",()=>{
    const url=buildLineUrl("@lanceup","LU-20260909-1234ABCD","山田 太郎");
    expect(url).toContain("https://line.me/R/oaMessage/%40lanceup/");
    expect(decodeURIComponent(url)).toContain("問い合わせ番号：LU-20260909-1234ABCD");
  });
  it("shows the selected email handoff without exposing a fake reference on direct access",()=>{
    render(<ThanksContent/>);
    expect(screen.getByText(/お問い合わせありがとうございます/)).toBeInTheDocument();
    expect(screen.queryByText("お問い合わせ番号")).not.toBeInTheDocument();
  });
  it("shows a LINE handoff for a completed lead",()=>{
    sessionStorage.setItem("lead_confirmation",JSON.stringify({inquiryId:"LU-20260909-1234ABCD",contactMethod:"line",name:"山田 太郎"}));
    render(<ThanksContent/>);
    expect(screen.getByText("LU-20260909-1234ABCD")).toBeInTheDocument();
    expect(screen.getByRole("heading",{name:"LINEを開いています"})).toBeInTheDocument();
    expect(screen.getByRole("link",{name:/自動で開かない場合はこちら/})).toHaveAttribute("href",expect.stringContaining("line.me/R/oaMessage"));
  });
});
