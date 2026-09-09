import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThanksTracker } from "@/components/ThanksTracker";
import { ThanksContent } from "@/components/ThanksContent";
export const metadata:Metadata={title:"送信完了",robots:{index:false,follow:false}};
export default function Thanks(){return <><SiteHeader compact/><main className="container thanks"><ThanksTracker/><div className="success-mark">✓</div><h1 className="title">無料チェックを受け付けました</h1><ThanksContent/></main><SiteFooter/></>}
