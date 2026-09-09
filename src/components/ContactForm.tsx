"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collectAttribution, contactSchema, type ContactInput } from "@/lib/contact";
import { track } from "@/lib/tracking";

type FormState = Omit<ContactInput, "startedAt" | "submissionId" | "privacyConsent" | "japaneseAvailable"> & {
  privacyConsent: boolean;
  japaneseAvailable: "yes" | "no";
};
type Errors = Record<string, string>;

const initial: FormState = { experienceYears:"",technologies:"",employmentStatus:"",considerationTiming:"",desiredCompensation:"",name:"",prefecture:"",age:"",contactMethod:"line",email:"",phone:"",japaneseAvailable:"yes",privacyConsent:false,attribution:{},website:"" };
const steps = [
  { title:"経験と現在の状況",description:"これまでの経験と、フリーランスを検討している時期を教えてください。",fields:["experienceYears","technologies","employmentStatus","considerationTiming","desiredCompensation"] },
  { title:"ご連絡先",description:"LINEまたはメールから、ご希望の連絡方法を選べます。",fields:["name","prefecture","age","contactMethod","email","phone","japaneseAvailable"] },
  { title:"確認・同意",description:"送信前に個人情報の取り扱いをご確認ください。",fields:["privacyConsent"] },
] as const;
const options = {
  experienceYears:["1年未満","1〜2年","3〜5年","6〜9年","10年以上"],
  employmentStatus:["正社員","契約・派遣社員","フリーランス","離職中","その他"],
  considerationTiming:["すぐに検討したい","半年以内","将来的に検討している","まだ分からない"],
};
const prefectures = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

export function ContactForm({variant="page"}:{variant?:"page"|"sidebar"}) {
  const [step,setStep] = useState(0);
  const [started,setStarted] = useState(false);
  const [form,setForm] = useState<FormState>(initial);
  const [errors,setErrors] = useState<Errors>({});
  const [sending,setSending] = useState(false);
  const [serverError,setServerError] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [submissionId] = useState(() => crypto.randomUUID());
  const router = useRouter();

  useEffect(() => {
    let stored = {};
    try { stored = JSON.parse(sessionStorage.getItem("lead_attribution") || "{}"); } catch {}
    const attribution = collectAttribution(location.search, location.href, document.referrer, stored);
    sessionStorage.setItem("lead_attribution", JSON.stringify(attribution));
    let prefill: Partial<FormState> = {};
    try { prefill = JSON.parse(sessionStorage.getItem("lead_prefill") || "{}"); sessionStorage.removeItem("lead_prefill"); } catch {}
    setForm((value) => ({ ...value, ...prefill, attribution }));
  }, []);

  const payload = useMemo(() => ({ ...form, startedAt, submissionId }), [form,startedAt,submissionId]);
  function update(name: keyof FormState, value: unknown) { setForm((old) => ({ ...old, [name]:value })); setErrors((old) => ({ ...old, [name]:"" })); }
  function validateCurrent() {
    const parsed = contactSchema.safeParse(payload);
    if (parsed.success) { setErrors({}); return true; }
    const all: Errors = {};
    for (const issue of parsed.error.issues) { const key=String(issue.path[0]); if (!all[key]) all[key]=issue.message; }
    const visible = new Set<string>(steps[step].fields);
    const current = Object.fromEntries(Object.entries(all).filter(([key]) => visible.has(key)));
    setErrors(current);
    return Object.keys(current).length === 0;
  }
  function startCheck() { track("check_start"); setStarted(true); }
  function next() { if (!validateCurrent()) return; track("check_step_complete",{step:step+1}); setStep((value)=>value+1); if (variant === "sidebar") document.querySelector<HTMLElement>(".quick-panel")?.scrollTo?.({top:0,behavior:"smooth"}); else window.scrollTo({top:0,behavior:"smooth"}); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateCurrent() || sending) return;
    setSending(true); setServerError(""); track("form_submit");
    try {
      const response = await fetch("/api/contact", { method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      sessionStorage.setItem("lead_completed", "true");
      sessionStorage.setItem("lead_confirmation", JSON.stringify({ inquiryId:body.inquiryId,contactMethod:form.contactMethod,name:form.name }));
      router.push("/thanks?submitted=1");
    } catch (error) { setServerError(error instanceof Error ? error.message : "送信できませんでした。時間をおいて再度お試しください。"); setSending(false); }
  }
  const select = (name:keyof typeof options,label:string) => <div className="field"><label htmlFor={name}>{label}<Badge required/></label><select id={name} className="input" value={String(form[name])} onChange={(e)=>update(name,e.target.value)} aria-invalid={!!errors[name]}><option value="">選択してください</option>{options[name].map((value)=><option key={value}>{value}</option>)}</select>{errors[name]&&<p className="error" role="alert">{errors[name]}</p>}</div>;

  const StepHeading = variant === "sidebar" ? "h2" : "h1";
  return <form className={`form-card card ${variant === "sidebar" ? "sidebar-form" : ""}`} onSubmit={submit} noValidate>
    {!started ? <div className="start-screen"><StepHeading>無料チェック</StepHeading><p className="muted">約1分で、今の経験とこれからの選択肢を整理できます。</p><div className="start-steps" aria-label="無料チェックの3ステップ"><div><b>01</b><span>経験・状況</span></div><i aria-hidden="true">→</i><div><b>02</b><span>ご連絡先</span></div><i aria-hidden="true">→</i><div><b>03</b><span>確認・同意</span></div></div><p className="start-note"><span aria-hidden="true">✓</span> 入力内容は途中の画面でも保持されます</p><div className="form-actions single"><button type="button" className="btn btn-primary" onClick={startCheck}>無料チェックを始める</button></div><div className="start-assurance"><span>相談無料</span><span>約1分</span><span>LINE・メール対応</span></div></div> : <>
    <div className="progress-label"><span>ステップ {step+1} / 3</span><span>{Math.round((step+1)/3*100)}%</span></div>
    <div className="progress" aria-label={`進捗 ${step+1}/3`}><span style={{width:`${(step+1)/3*100}%`}}/></div>
    <StepHeading>{steps[step].title}</StepHeading><p className="muted">{steps[step].description}</p>
    {step===0 && <>{select("experienceYears","IT実務経験年数")}<div className="field"><label htmlFor="technologies">主な使用技術<Badge/></label><textarea id="technologies" className="input" maxLength={500} placeholder="例：TypeScript、React、AWS（実務3年）" value={form.technologies} onChange={(e)=>update("technologies",e.target.value)}/></div>{select("employmentStatus","現在の雇用形態")}{select("considerationTiming","フリーランスへの関心・検討時期")}<TextField name="desiredCompensation" label="希望単価または希望年収" optional value={form.desiredCompensation} onChange={(value)=>update("desiredCompensation",value)} placeholder="例：月額70万円、年収800万円" maxLength={100}/></>}
    {step===1 && <><TextField name="name" label="氏名" value={form.name} error={errors.name} onChange={(value)=>update("name",value)} maxLength={80}/><div className="contact-row"><div className="field"><label htmlFor="prefecture">お住まいの都道府県<Badge required/></label><select id="prefecture" className="input" value={form.prefecture} onChange={(event)=>update("prefecture",event.target.value)} aria-invalid={!!errors.prefecture}><option value="">選択してください</option>{prefectures.map((value)=><option key={value}>{value}</option>)}</select>{errors.prefecture&&<p className="error" role="alert">{errors.prefecture}</p>}</div><TextField name="age" label="年齢" value={form.age} error={errors.age} onChange={(value)=>update("age",value)} type="number" inputMode="numeric" min={18} max={99} placeholder="例：32"/></div><fieldset className="field fieldset"><legend className="legend">希望する連絡方法<Badge required/></legend><div className="choices contact-methods"><label className="choice contact-method"><input type="radio" name="contactMethod" checked={form.contactMethod==="line"} onChange={()=>update("contactMethod","line")}/><span><strong>LINE</strong><small>問い合わせ番号で続ける</small></span></label><label className="choice contact-method"><input type="radio" name="contactMethod" checked={form.contactMethod==="email"} onChange={()=>update("contactMethod","email")}/><span><strong>メール</strong><small>入力したアドレスへご連絡</small></span></label></div>{errors.contactMethod&&<p className="error" role="alert">{errors.contactMethod}</p>}</fieldset><TextField name="email" label="メールアドレス" optional={form.contactMethod==="line"} value={form.email} error={errors.email} onChange={(value)=>update("email",value)} type="email" inputMode="email" placeholder={form.contactMethod==="line"?"任意：メールでも連絡を受け取る場合":"例：name@example.com"} maxLength={254}/><TextField name="phone" label="電話番号" optional value={form.phone} error={errors.phone} onChange={(value)=>update("phone",value)} type="tel" inputMode="tel" maxLength={30}/><fieldset className="field fieldset"><legend className="legend">日本語で業務・面談対応が可能ですか？<Badge required/></legend><div className="choices"><label className="choice"><input type="radio" name="japanese" checked={form.japaneseAvailable==="yes"} onChange={()=>update("japaneseAvailable","yes")}/>はい、対応可能です</label><label className="choice"><input type="radio" name="japanese" checked={form.japaneseAvailable==="no"} onChange={()=>update("japaneseAvailable","no")}/>いいえ</label></div>{errors.japaneseAvailable&&<p className="error" role="alert">{errors.japaneseAvailable}</p>}<p className="field-note">外国籍の方もご利用いただけますが、日本語での業務・面談対応が必要です。</p></fieldset></>}
    {step===2 && <><div className="consent-intro"><h2>個人情報の取り扱いについて</h2><p>ご入力いただいた情報は、お問い合わせ内容の確認とご連絡のために使用します。個人情報は適切に管理します。詳しくは<Link href="/privacy" target="_blank">プライバシーポリシー</Link>をご確認ください。</p></div><div><label className="consent"><input type="checkbox" checked={form.privacyConsent} onChange={(e)=>update("privacyConsent",e.target.checked)}/><span>個人情報の取り扱いに同意する<Badge required/></span></label>{errors.privacyConsent&&<p className="error" role="alert">{errors.privacyConsent}</p>}</div><input tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={(e)=>update("website",e.target.value)} className="honeypot"/>{serverError&&<div className="alert" role="alert">{serverError}</div>}</>}
    <div className="form-actions">{step>0&&<button type="button" className="btn btn-secondary" onClick={()=>setStep((value)=>value-1)} disabled={sending}>戻る</button>}{step<2?<button type="button" className="btn btn-primary" onClick={next}>次へ</button>:<button type="submit" className="btn btn-primary" disabled={sending}>{sending?"送信しています…":"同意して送信する"}</button>}</div></>}
  </form>;
}

function Badge({required=false}:{required?:boolean}) { return <span className={required?"required badge":"optional badge"}>{required?"必須":"任意"}</span>; }
function TextField({name,label,optional=false,value,error,onChange,...rest}:{name:string;label:string;optional?:boolean;value:string;error?:string;onChange:(value:string)=>void}&React.InputHTMLAttributes<HTMLInputElement>) { return <div className="field"><label htmlFor={name}>{label}<Badge required={!optional}/></label><input id={name} name={name} className="input" value={value} onChange={(e)=>onChange(e.target.value)} aria-invalid={!!error} {...rest}/>{error&&<p className="error" role="alert">{error}</p>}</div>; }
