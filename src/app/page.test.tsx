import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/navigation",()=>({useRouter:()=>({push:vi.fn()})}));

describe("LP content",()=>{
  it("keeps the main message and highlights direct access to decision makers",()=>{render(<Home/>);expect(screen.getByRole("heading",{level:1})).toHaveTextContent("今の経験で、フリーランスとして通用するか確認しませんか？");expect(screen.getAllByText(/代表・責任者クラスへ直接/).length).toBeGreaterThan(0);});
  it("uses the simplified one-minute user flow",()=>{render(<Home/>);expect(screen.getByText("約1分の入力から始められます")).toBeInTheDocument();expect(screen.getByText("経験や現在の状況を入力")).toBeInTheDocument();expect(screen.getByText("いただいた内容を確認")).toBeInTheDocument();expect(screen.getByText("確認後、メール等でご連絡")).toBeInTheDocument();});
  it("does not display the removed prominent disclaimer",()=>{render(<Home/>);expect(screen.queryByText(/案件の紹介・獲得や希望条件との一致を保証/)).not.toBeInTheDocument();});
  it("uses natural reassurance copy",()=>{render(<Home/>);expect(screen.getByText("会社員のまま相談OK")).toBeInTheDocument();expect(screen.getByText("独立するか未定でもOK")).toBeInTheDocument();expect(screen.queryByText("独立前でもOK")).not.toBeInTheDocument();});
  it("shows the expanded support, illustrated stories, navigation, and persistent form",()=>{render(<Home/>);expect(screen.getByRole("navigation",{name:"ページ内ナビゲーション"})).toBeInTheDocument();expect(screen.getAllByText(/しつこい勧誘/).length).toBeGreaterThan(0);expect(screen.getByText("無料チェック後も、次の一歩までサポート")).toBeInTheDocument();expect(screen.getByText(/スキルシートの作成・見直し/)).toBeInTheDocument();expect(screen.getByAltText("運営者のイラスト")).toBeInTheDocument();expect(screen.getByAltText("利用者のイラスト")).toBeInTheDocument();expect(screen.queryByText("体験談を読む")).not.toBeInTheDocument();expect(screen.getByText(/私は26歳で塾講師からIT業界へ転職/)).toBeInTheDocument();expect(screen.getByText(/案件を紹介されるだけの関係ではなく/)).toBeInTheDocument();expect(screen.getByText(/FPや税理士へ相談できる体制/)).toBeInTheDocument();expect(screen.getByRole("complementary",{name:"無料チェック入力フォーム"})).toBeInTheDocument();expect(screen.getByRole("button",{name:"無料チェックを始める"})).toBeInTheDocument();});
});
