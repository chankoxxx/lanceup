"use client";

import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export function QuickCheckPanel() {
  return <aside className="quick-panel" aria-label="無料チェック入力フォーム">
    <Link href="/check" className="btn btn-primary quick-mobile-link">無料チェック <span aria-hidden="true">→</span></Link>
    <div className="quick-panel-head"><span>無料・約1分</span><strong>今の経験を無料チェック</strong><p>右側のフォームだけで送信まで完了できます</p></div>
    <ContactForm variant="sidebar" />
  </aside>;
}
