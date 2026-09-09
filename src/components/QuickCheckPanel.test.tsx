import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuickCheckPanel } from "./QuickCheckPanel";

const push = vi.fn();
vi.mock("next/navigation",()=>({useRouter:()=>({push})}));

describe("QuickCheckPanel",()=>{
  beforeEach(()=>{sessionStorage.clear();push.mockClear();Object.defineProperty(HTMLElement.prototype,"scrollTo",{value:vi.fn(),configurable:true});});
  it("shows the start screen before asking questions",()=>{render(<QuickCheckPanel/>);expect(screen.getByRole("button",{name:"無料チェックを始める"})).toBeInTheDocument();expect(screen.queryByLabelText(/IT実務経験年数/)).not.toBeInTheDocument();});
  it("advances inside the sidebar without navigating",()=>{render(<QuickCheckPanel/>);fireEvent.click(screen.getByRole("button",{name:"無料チェックを始める"}));expect(screen.getByText("ステップ 1 / 3")).toBeInTheDocument();expect(screen.getByText("経験と現在の状況")).toBeInTheDocument();expect(screen.getByLabelText(/IT実務経験年数/)).toBeInTheDocument();expect(screen.getByLabelText(/現在の雇用形態/)).toBeInTheDocument();expect(push).not.toHaveBeenCalled();});
});
