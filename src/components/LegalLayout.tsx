import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
export function LegalLayout({title,updated="2026年9月4日",children}:{title:string;updated?:string;children:React.ReactNode}) { return <><SiteHeader compact/><main className="container section legal"><h1 className="title">{title}</h1><p className="muted">最終更新日：{updated}</p>{children}</main><SiteFooter/></>; }
