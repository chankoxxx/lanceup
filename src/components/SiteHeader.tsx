import Link from "next/link";
import { siteConfig } from "@/content/site";

const navItems = [["特徴","/#features"],["サポート","/#support"],["体験談","/#stories"],["よくある質問","/#faq"]] as const;
export function SiteHeader({compact=false}:{compact?:boolean}) { return <header className="site-header"><div className="container header-inner"><div className="nav"><Link href="/" className="brand"><span className="brand-mark">LU</span><span className="brand-copy"><strong>{siteConfig.name}</strong><small>{siteConfig.tagline}</small></span>{siteConfig.isTemporaryName&&<small className="temporary-name">（仮称）</small>}</Link>{compact?null:<Link className="btn btn-primary header-cta" href="/check">無料でチェック</Link>}</div>{compact?null:<nav className="header-tabs" aria-label="ページ内ナビゲーション">{navItems.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</nav>}</div></header>; }
