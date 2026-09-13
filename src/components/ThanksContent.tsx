"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";

type Confirmation = { inquiryId:string;contactMethod:"line"|"email";name:string };

export function buildLineUrl(lineId:string, inquiryId:string, name:string) {
  const message = `無料チェック回答済みです。\n問い合わせ番号：${inquiryId}\n氏名：${name}`;
  return `https://line.me/R/oaMessage/${encodeURIComponent(lineId)}/?${encodeURIComponent(message)}`;
}

export function buildLineProfileUrl(lineId:string) {
  return `https://line.me/R/ti/p/${encodeURIComponent(lineId)}`;
}

export function isMobileUserAgent(userAgent:string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
}

export function ThanksContent() {
  const stored = useSyncExternalStore(() => () => {},() => sessionStorage.getItem("lead_confirmation"),() => null);
  const isMobile = useSyncExternalStore(() => () => {},() => isMobileUserAgent(navigator.userAgent),() => false);
  const confirmation = useMemo<Confirmation|null>(() => { try { return stored ? JSON.parse(stored) : null; } catch { return null; } },[stored]);

  const lineId = process.env.NEXT_PUBLIC_LINE_OA_ID || "";
  const lineAddFriendUrl = process.env.NEXT_PUBLIC_LINE_ADD_FRIEND_URL || "";
  const canPrefill = Boolean(lineId && isMobile);
  const lineUrl = lineId
    ? (canPrefill && confirmation?.inquiryId ? buildLineUrl(lineId,confirmation.inquiryId,confirmation.name) : buildLineProfileUrl(lineId))
    : lineAddFriendUrl;

  useEffect(() => {
    if (confirmation?.contactMethod !== "line" || !lineUrl || !isMobile) return;
    const timer = window.setTimeout(() => window.location.assign(lineUrl), 700);
    return () => window.clearTimeout(timer);
  }, [confirmation?.contactMethod, isMobile, lineUrl]);

  if (!confirmation) return <><p>お問い合わせありがとうございます。内容を確認後、担当者よりご連絡します。</p><div className="thanks-actions"><Link className="btn btn-secondary" href="/">トップページへ戻る</Link></div></>;
  return <>
    <p className="thanks-id-label">お問い合わせ番号</p><strong className="thanks-id">{confirmation.inquiryId}</strong>
    {confirmation.contactMethod === "line" ? <div className="contact-next line-next"><span className="contact-next-icon" aria-hidden="true">LINE</span><div><h2>{isMobile ? "LINEを開いています" : "LINEで問い合わせを続ける"}</h2><p>{canPrefill ? "問い合わせ番号とお名前を入力したLINE画面へ自動で移動します。内容を確認して送信してください。" : "ボタンを押すとブラウザに公式アカウントのQRコードが表示されます。スマートフォンのLINEで読み取ってください。アプリの追加インストールは不要です。"}</p>{lineUrl ? <a className="btn line-button" href={lineUrl}>{isMobile ? "自動で開かない場合はこちら" : "LINE公式アカウントを表示"} <span aria-hidden="true">→</span></a> : <p className="setup-notice">LINE公式アカウントとの接続先を準備中です。設定完了後、このボタンから続けられます。</p>}</div></div> : <div className="contact-next email-next"><span className="contact-next-icon" aria-hidden="true">✉</span><div><h2>メールでご連絡します</h2><p>ご入力いただいたメールアドレスへ、内容を確認後に担当者からご連絡します。</p></div></div>}
    <p className="thanks-reassurance">同じ内容をもう一度入力する必要はありません。しつこい勧誘や、決断を急かすこともありません。</p>
    <div className="thanks-actions"><Link className="btn btn-secondary" href="/">トップページへ戻る</Link></div>
  </>;
}
