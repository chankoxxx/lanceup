import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { AttributionCapture } from "@/components/AttributionCapture";
import { siteConfig } from "@/content/site";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lanceup.jp";
export const metadata: Metadata = {
  metadataBase:new URL(siteUrl),
  title:{default:`ITエンジニアのフリーランス相談・無料チェック | ${siteConfig.name}`,template:`%s | ${siteConfig.name}`},
  description:"ITエンジニア向けのフリーランス相談窓口。会社を辞める前に経験と希望を無料チェックし、経歴に応じて提携エージェントの代表・責任者クラスへ直接つなぎます。",
  keywords:["ITエンジニア フリーランス","フリーランス 相談","エンジニア 独立","フリーランス エージェント","スキルシート 相談"],
  category:"career",
  alternates:{canonical:"/"},
  openGraph:{title:"ITエンジニアのフリーランス相談・無料チェック",description:"会社を辞める前でも相談可能。経歴を確認し、提携エージェントの代表・責任者クラスへ直接つなぐ相談窓口です。",url:"/",siteName:siteConfig.name,locale:"ja_JP",type:"website"},
  twitter:{card:"summary_large_image",title:"ITエンジニアのフリーランス相談 | Lance Up",description:"今の経験でフリーランスとして通用するか、無料で確認できます。"},
  robots:{index:true,follow:true},
};
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#f7f9fc"};
export default function RootLayout({children}:{children:React.ReactNode}) { const id=process.env.NEXT_PUBLIC_GOOGLE_TAG_ID; return <html lang="ja"><body>{id&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive"/><Script id="google-tag" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}',{send_page_view:false});`}</Script></>}<Suspense fallback={null}><AttributionCapture/></Suspense>{children}</body></html>; }
