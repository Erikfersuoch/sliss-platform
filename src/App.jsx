import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SLISS PLATFORM v2.0 — Ecosistema Operativo per Micro-Business
// Architecture: Modular · Persistent Storage · Production-Ready
// ═══════════════════════════════════════════════════════════════════════════

// ── Design System ──────────────────────────────────────────────────────────
const T = {
  bg: "#080C14", bg2: "#0E1420", bg3: "#141C2B", bg4: "#1A2436",
  border: "#1C2840", borderH: "#2A3A56", borderA: "#3B7BF6",
  text: "#E8EDF5", textM: "#8B9DC3", textD: "#5A6F94", textMu: "#3D5178",
  blue: "#3B7BF6", blueH: "#2B66E0", blueS: "rgba(59,123,246,0.13)", blueG: "rgba(59,123,246,0.25)",
  green: "#0FBE7A", greenS: "rgba(15,190,122,0.13)",
  amber: "#E8A830", amberS: "rgba(232,168,48,0.13)",
  red: "#E84850", redS: "rgba(232,72,80,0.13)",
  purple: "#8B5CF6", purpleS: "rgba(139,92,246,0.13)",
  teal: "#14B8A6", tealS: "rgba(20,184,166,0.13)",
  orange: "#F07020", orangeS: "rgba(240,112,32,0.13)",
  pink: "#EC4899", pinkS: "rgba(236,72,153,0.13)",
  r: { s: "6px", m: "10px", l: "14px", xl: "20px", full: "9999px" },
};

const GlobalCSS = () => <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:${T.bg};color:${T.text};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
  input,textarea,select{font-family:inherit;background:${T.bg3};border:1px solid ${T.border};color:${T.text};border-radius:${T.r.m};padding:10px 14px;font-size:14px;outline:none;transition:all .2s;width:100%}
  input:focus,textarea:focus,select:focus{border-color:${T.blue};box-shadow:0 0 0 3px ${T.blueS}}
  textarea{resize:vertical;min-height:80px}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238B9DC3' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideR{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
`}</style>;

// ── Storage Layer ──────────────────────────────────────────────────────────
const STORAGE_KEY = "sliss-data";

const defaultData = () => ({
  clients: [
    { id: "c1", name: "Marco Bianchi", phone: "3471234567", email: "marco.bianchi@gmail.com", channel: "WhatsApp", firstVisit: "2026-03-10", lastVisit: "2026-05-08", status: "active", notes: "Preferisce pomeriggio. Paga in contanti.", consent: true, sector: "Generico", created: "2026-03-10" },
    { id: "c2", name: "Giulia Romano", phone: "3389876543", email: "giulia.romano@libero.it", channel: "WhatsApp", firstVisit: "2026-01-22", lastVisit: "2026-04-05", status: "vip", notes: "Pelle sensibile. Preferisce sabato mattina.", consent: true, sector: "Generico", created: "2026-01-22" },
    { id: "c3", name: "Luca Ferretti", phone: "3201112233", email: "luca.f@gmail.com", channel: "WhatsApp", firstVisit: "2026-05-01", lastVisit: "2026-05-14", status: "new", notes: "Primo appuntamento. Molto soddisfatto.", consent: true, sector: "Generico", created: "2026-05-01" },
    { id: "c4", name: "Sofia Marchetti", phone: "3287654321", email: "sofia.m@outlook.it", channel: "Email", firstVisit: "2025-11-15", lastVisit: "2026-02-20", status: "to_reactivate", notes: "Non si vede da 3 mesi.", consent: true, sector: "Generico", created: "2025-11-15" },
    { id: "c5", name: "Andrea Colombo", phone: "3331234567", email: "andrea.c@yahoo.it", channel: "WhatsApp", firstVisit: "2026-04-10", lastVisit: "2026-05-12", status: "active", notes: "Cliente abituale, sempre lo stesso servizio.", consent: true, sector: "Barber", created: "2026-04-10" },
  ],
  appointments: [
    { id: "a1", clientId: "c1", date: "2026-05-08T15:30", serviceType: "Sessione standard", description: "Sessione completata.", amount: 80, followUpTriggered: true, postNotes: "Rientro tra 30gg." },
    { id: "a2", clientId: "c2", date: "2026-04-05T10:00", serviceType: "Ritocco", description: "Ritocco perfetto.", amount: 45, followUpTriggered: true, postNotes: "Candidata recensione." },
    { id: "a3", clientId: "c3", date: "2026-05-14T11:00", serviceType: "Prima consulenza", description: "Prima sessione OK.", amount: 60, followUpTriggered: true, postNotes: "Probabile regolare." },
    { id: "a4", clientId: "c5", date: "2026-05-12T16:00", serviceType: "Taglio", description: "Tutto regolare.", amount: 25, followUpTriggered: true, postNotes: "Prossimo tra 3 settimane." },
  ],
  followUps: [
    { id: "f1", appointmentId: "a1", clientId: "c1", phase: "thankyou", status: "sent", scheduledDate: "2026-05-08", sentDate: "2026-05-08", satisfaction: null, message: "Ciao Marco! Grazie per essere passato oggi 🙏 È stato un piacere. Se hai dubbi, scrivimi. A presto!" },
    { id: "f2", appointmentId: "a1", clientId: "c1", phase: "check", status: "pending", scheduledDate: "2026-05-15", sentDate: null, satisfaction: null, message: "Ciao Marco! Volevo solo sapere come stai andando dopo l'appuntamento di settimana scorsa. Tutto ok?" },
    { id: "f3", appointmentId: "a1", clientId: "c1", phase: "reactivation", status: "pending", scheduledDate: "2026-07-08", sentDate: null, satisfaction: null, message: "Ciao Marco! È un po' che non ci sentiamo 👋 Se hai voglia di prenotare, sono qui." },
    { id: "f4", appointmentId: "a2", clientId: "c2", phase: "thankyou", status: "sent", scheduledDate: "2026-04-05", sentDate: "2026-04-05", satisfaction: null, message: "Ciao Giulia! Grazie per essere passata oggi ✨ Spero ti sia piaciuto il trattamento." },
    { id: "f5", appointmentId: "a2", clientId: "c2", phase: "check", status: "replied", scheduledDate: "2026-04-12", sentDate: "2026-04-12", satisfaction: 5, message: "Ciao Giulia! Come procede tutto?" },
    { id: "f6", appointmentId: "a2", clientId: "c2", phase: "review", status: "pending", scheduledDate: "2026-04-20", sentDate: null, satisfaction: null, message: "Ciao Giulia! Sono contenta che ti sia trovata bene 🙏 Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo." },
    { id: "f7", appointmentId: "a2", clientId: "c2", phase: "reactivation", status: "pending", scheduledDate: "2026-06-05", sentDate: null, satisfaction: null, message: "Ciao Giulia! È un po' che non ci sentiamo 👋 Buona giornata!" },
    { id: "f8", appointmentId: "a3", clientId: "c3", phase: "thankyou", status: "pending", scheduledDate: "2026-05-14", sentDate: null, satisfaction: null, message: "Ciao Luca! Grazie per oggi 🖤 Per qualsiasi cosa, scrivimi." },
    { id: "f9", appointmentId: "a4", clientId: "c5", phase: "thankyou", status: "sent", scheduledDate: "2026-05-12", sentDate: "2026-05-12", satisfaction: null, message: "Ciao Andrea! Grazie del passaggio 💈 Spero ti piaccia il risultato." },
    { id: "f10", appointmentId: "a4", clientId: "c5", phase: "check", status: "pending", scheduledDate: "2026-05-22", sentDate: null, satisfaction: null, message: "Ciao Andrea! Tutto ok con il taglio? 💈" },
    { id: "f11", clientId: "c4", phase: "reactivation", status: "pending", scheduledDate: "2026-05-20", sentDate: null, satisfaction: null, message: "Ciao Sofia! È un po' che non ci sentiamo 👋 Se hai voglia di prenotare, sono qui." },
  ],
  templates: [
    { id: "t1", name: "Ringraziamento base", code: "R1", phase: "thankyou", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! Grazie per essere passato/a oggi 🙏 È stato un piacere. Se hai dubbi o domande nei prossimi giorni, scrivimi senza problemi. A presto!", active: true },
    { id: "t2", name: "Ringraziamento aftercare", code: "R2", phase: "thankyou", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! Grazie ancora per oggi 🙌 Ti lascio due cose da tenere a mente: [Istruzione 1] e [Istruzione 2]. Per qualsiasi dubbio scrivimi.", active: true },
    { id: "t3", name: "Ringraziamento Tatuaggi", code: "R3-TAT", phase: "thankyou", sector: "Tatuaggi", channel: "WhatsApp", text: "Ciao [Nome]! Grazie per oggi, è stata una bella sessione 🖤 Ricordati pellicola e sapone neutro. I primi 3 giorni sono importanti. Scrivimi per qualsiasi cosa.", active: true },
    { id: "t4", name: "Ringraziamento Barber", code: "R4-BAR", phase: "thankyou", sector: "Barber", channel: "WhatsApp", text: "Ciao [Nome]! Grazie del passaggio oggi 💈 Spero ti piaccia il risultato. Quando vuoi tornare, sai dove trovarmi!", active: true },
    { id: "t5", name: "Ringraziamento Estetica", code: "R5-EST", phase: "thankyou", sector: "Estetica", channel: "WhatsApp", text: "Ciao [Nome]! Grazie per essere passata oggi ✨ Spero ti sia piaciuto il trattamento. Per consigli, scrivimi. A presto!", active: true },
    { id: "t6", name: "Controllo base", code: "C1", phase: "check", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! Volevo solo sapere come stai andando dopo l'appuntamento di settimana scorsa. Tutto ok? Se qualcosa non ti convince al 100%, dimmelo — preferisco saperlo direttamente.", active: true },
    { id: "t7", name: "Controllo con feedback", code: "C2", phase: "check", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! Come procede tutto? Se hai 2 minuti, mi farebbe piacere sapere cosa ne pensi: [Link Feedback]. Anonimo e brevissimo, prometto 🙏", active: true },
    { id: "t8", name: "Controllo Tatuaggi", code: "C3-TAT", phase: "check", sector: "Tatuaggi", channel: "WhatsApp", text: "Ciao [Nome]! Come sta andando la cicatrizzazione? Dovrebbe desquamarsi — è normale. Se hai dubbi, mandami una foto.", active: true },
    { id: "t9", name: "Controllo Barber", code: "C4-BAR", phase: "check", sector: "Barber", channel: "WhatsApp", text: "Ciao [Nome]! Tutto ok con il taglio? Se serve una sistemata o vuoi prenotare il prossimo, sono qui 💈", active: true },
    { id: "t10", name: "Richiesta recensione", code: "RC1", phase: "review", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! Sono contento/a che ti sia trovato/a bene 🙏 Se hai un minuto, una recensione su [Piattaforma] mi aiuterebbe tantissimo. Grazie di cuore!", active: true },
    { id: "t11", name: "Recensione soft", code: "RC2", phase: "review", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! Mi ha fatto piacere sentirti contento/a 🙌 Se ti va di lasciarmi due righe su [Piattaforma], per me sarebbe un grande aiuto. Nessun problema se no, eh.", active: true },
    { id: "t12", name: "Riattivazione base", code: "RI1", phase: "reactivation", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! È un po' che non ci sentiamo 👋 Se hai voglia di prenotare o stai pensando a qualcosa, sono qui. Buona giornata!", active: true },
    { id: "t13", name: "Riattivazione stagionale", code: "RI2", phase: "reactivation", sector: "Generico", channel: "WhatsApp", text: "Ciao [Nome]! Con [Stagione/Evento] che si avvicina pensavo a te 🌿 Se vuoi prenotare in anticipo, scrivimi.", active: true },
    { id: "t14", name: "Riattivazione Barber", code: "RI3-BAR", phase: "reactivation", sector: "Barber", channel: "WhatsApp", text: "Ciao [Nome]! È un po' che non ti vedo 💈 Tutto bene? Se vuoi passare, sono qui!", active: true },
  ],
  feedbacks: [
    { id: "fb1", clientId: "c2", followUpId: "f5", rating: 5, comment: "Ottimo lavoro come sempre!", wouldRecommend: true, date: "2026-04-13" },
  ],
  settings: {
    businessName: "La Tua Attività",
    sector: "Generico",
    followUpTimings: { thankyou: 0, check: 7, review: 21, reactivation: 60 },
  },
});

const loadData = async () => {
  try {
    const result = await window.storage.get(STORAGE_KEY);
    return result ? JSON.parse(result.value) : defaultData();
  } catch { return defaultData(); }
};

const saveData = async (data) => {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error("Save failed:", e); }
};

// ── Context ────────────────────────────────────────────────────────────────
const Ctx = createContext(null);
const useSliss = () => useContext(Ctx);

// ── Config Maps ────────────────────────────────────────────────────────────
const PHASES = {
  thankyou: { label: "Ringraziamento", color: T.blue, icon: "🙏", bg: T.blueS },
  check: { label: "Controllo", color: T.amber, icon: "🔍", bg: T.amberS },
  review: { label: "Recensione", color: T.purple, icon: "⭐", bg: T.purpleS },
  reactivation: { label: "Riattivazione", color: T.green, icon: "🔄", bg: T.greenS },
};
const STATUSES = {
  pending: { label: "In attesa", color: T.amber, bg: T.amberS },
  sent: { label: "Inviato", color: T.blue, bg: T.blueS },
  replied: { label: "Risposto", color: T.green, bg: T.greenS },
  completed: { label: "Completato", color: T.textD, bg: "rgba(90,111,148,0.12)" },
  skipped: { label: "Saltato", color: T.textMu, bg: "rgba(61,81,120,0.1)" },
};
const CLIENT_ST = {
  new: { label: "Nuovo", color: T.blue, bg: T.blueS },
  active: { label: "Attivo", color: T.green, bg: T.greenS },
  vip: { label: "VIP", color: T.purple, bg: T.purpleS },
  to_reactivate: { label: "Da riattivare", color: T.amber, bg: T.amberS },
  inactive: { label: "Inattivo", color: T.textD, bg: "rgba(90,111,148,0.12)" },
};
const MODULES = [
  { id: "followup", name: "Follow-Up", icon: "💬", color: T.blue, desc: "Gestisci i follow-up con i clienti", status: "active" },
  { id: "onboarding", name: "Onboarding", icon: "📋", color: T.purple, desc: "Raccogli info prima dell'appuntamento", status: "planned" },
  { id: "inbound", name: "Richieste", icon: "📥", color: T.amber, desc: "Gestisci le richieste in entrata", status: "planned" },
  { id: "quotes", name: "Preventivi", icon: "💰", color: T.green, desc: "Crea e invia preventivi", status: "planned" },
  { id: "reminders", name: "Reminder", icon: "⏰", color: T.red, desc: "Conferme e promemoria", status: "planned" },
  { id: "faq", name: "FAQ & KB", icon: "📚", color: "#6366F1", desc: "Knowledge base e risposte auto", status: "future" },
  { id: "assistant", name: "AI Assistant", icon: "🤖", color: T.pink, desc: "Supporto AI operativo", status: "future" },
  { id: "dashboard", name: "Dashboard", icon: "📊", color: T.teal, desc: "Vista unificata business", status: "future" },
  { id: "social", name: "Social", icon: "📸", color: T.orange, desc: "Contenuti social assistiti", status: "future" },
  { id: "referral", name: "Referral", icon: "🤝", color: "#84CC16", desc: "Passaparola strutturato", status: "future" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = d => { if (!d) return "—"; return new Date(d).toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"}); };
const daysAgo = d => { if(!d) return null; const diff=Math.floor((Date.now()-new Date(d))/(864e5)); return diff===0?"Oggi":diff===1?"Ieri":`${diff}g fa`; };
const daysUntil = d => { if(!d) return null; const diff=Math.floor((new Date(d)-Date.now())/(864e5)); if(diff<0) return `${Math.abs(diff)}g fa`; if(diff===0) return "Oggi"; if(diff===1) return "Domani"; return `Tra ${diff}g`; };
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const today = () => new Date().toISOString().split("T")[0];

// ── UI Components ──────────────────────────────────────────────────────────
const Badge = ({label,color,bg,s}) => <span style={{display:"inline-flex",alignItems:"center",padding:s?"2px 8px":"3px 10px",borderRadius:T.r.full,fontSize:s?"11px":"12px",fontWeight:600,color,background:bg,letterSpacing:".02em",whiteSpace:"nowrap"}}>{label}</span>;

const Btn = ({children,v="primary",s="md",onClick,style,disabled}) => {
  const VS={primary:{bg:T.blue,c:"#fff",hb:T.blueH,bd:"none"},secondary:{bg:"transparent",c:T.textM,hb:T.bg4,bd:`1px solid ${T.border}`},success:{bg:T.green,c:"#fff",hb:"#09a066",bd:"none"},danger:{bg:"transparent",c:T.red,hb:T.redS,bd:`1px solid ${T.red}33`},ghost:{bg:"transparent",c:T.textM,hb:T.bg4,bd:"none"}};
  const SS={sm:{p:"6px 12px",f:"12px"},md:{p:"9px 18px",f:"13px"},lg:{p:"12px 24px",f:"14px"}};
  const vv=VS[v],ss=SS[s]; const [h,setH]=useState(false);
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-flex",alignItems:"center",gap:"6px",background:h&&!disabled?vv.hb:vv.bg,color:vv.c,border:vv.bd,borderRadius:T.r.m,fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all .15s",fontFamily:"inherit",opacity:disabled?.5:1,padding:ss.p,fontSize:ss.f,...style}}>{children}</button>;
};

const Card = ({children,style,onClick,hov:canHov}) => {
  const [h,setH]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:T.bg2,border:`1px solid ${h&&canHov?T.borderH:T.border}`,borderRadius:T.r.l,padding:"20px",transition:"all .2s",cursor:canHov?"pointer":"default",boxShadow:h&&canHov?"0 4px 16px rgba(0,0,0,.35)":"none",animation:"fadeIn .3s ease",...style}}>{children}</div>;
};

const Stat = ({label,value,icon,color,sub}) => <Card style={{display:"flex",flexDirection:"column",gap:"8px",minWidth:"155px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><span style={{fontSize:"13px",color:T.textM,fontWeight:500}}>{label}</span><span style={{fontSize:"20px"}}>{icon}</span></div><span style={{fontSize:"30px",fontWeight:700,color:color||T.text,letterSpacing:"-.02em",lineHeight:1}}>{value}</span>{sub&&<span style={{fontSize:"12px",color:T.textD}}>{sub}</span>}</Card>;

const Empty = ({icon,title,desc}) => <div style={{textAlign:"center",padding:"60px 20px",color:T.textD}}><div style={{fontSize:"48px",marginBottom:"16px",opacity:.5}}>{icon}</div><div style={{fontSize:"16px",fontWeight:600,color:T.textM,marginBottom:"8px"}}>{title}</div><div style={{fontSize:"14px",maxWidth:"360px",margin:"0 auto",lineHeight:1.6}}>{desc}</div></div>;

const Search = ({value,onChange,placeholder}) => <div style={{position:"relative"}}><span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"15px",opacity:.4}}>🔍</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Cerca..."} style={{paddingLeft:"36px",background:T.bg3}} /></div>;

const Tabs = ({tabs,active,onChange}) => <div style={{display:"flex",gap:"3px",background:T.bg,padding:"3px",borderRadius:T.r.m,border:`1px solid ${T.border}`}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:"7px 14px",borderRadius:T.r.s,border:"none",cursor:"pointer",background:active===t.id?T.bg3:"transparent",color:active===t.id?T.text:T.textD,fontWeight:active===t.id?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .15s",boxShadow:active===t.id?"0 1px 4px rgba(0,0,0,.25)":"none"}}>{t.label}{t.count!=null&&<span style={{marginLeft:"5px",fontSize:"11px",opacity:.6}}>({t.count})</span>}</button>)}</div>;

const Modal = ({open,onClose,title,children,w}) => {
  if(!open) return null;
  return <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}><div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(6px)"}} /><div onClick={e=>e.stopPropagation()} style={{position:"relative",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:T.r.xl,width:w||"540px",maxWidth:"94vw",maxHeight:"85vh",overflow:"auto",animation:"fadeIn .2s ease",boxShadow:"0 12px 40px rgba(0,0,0,.6)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:`1px solid ${T.border}`}}><h3 style={{fontSize:"16px",fontWeight:700}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",color:T.textD,fontSize:"18px",cursor:"pointer",padding:"4px"}}>✕</button></div><div style={{padding:"24px"}}>{children}</div></div></div>;
};

const CopyBtn = ({text}) => {
  const [ok,setOk]=useState(false);
  return <Btn v={ok?"success":"secondary"} s="sm" onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),2000)}}>{ok?"✓ Copiato":"📋 Copia"}</Btn>;
};

const FormField = ({label,children}) => <div style={{marginBottom:"16px"}}><label style={{display:"block",fontSize:"12px",color:T.textD,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:"6px"}}>{label}</label>{children}</div>;

// ── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({view,setView}) => {
  const nav = [
    {id:"home",icon:"🏠",label:"Home"},
    {id:"followup",icon:"💬",label:"Follow-Up"},
    {id:"clients",icon:"👥",label:"Clienti"},
    {id:"templates",icon:"📝",label:"Template"},
    {id:"feedback",icon:"⭐",label:"Feedback"},
    {id:"modules",icon:"🧩",label:"Moduli"},
    {id:"settings",icon:"⚙️",label:"Impostazioni"},
  ];
  return <div style={{width:"210px",minHeight:"100vh",background:T.bg,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:100}}>
    <div style={{padding:"22px 18px",borderBottom:`1px solid ${T.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{width:"34px",height:"34px",borderRadius:T.r.m,background:`linear-gradient(135deg,${T.blue},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px",fontWeight:800,color:"#fff",boxShadow:`0 0 18px ${T.blueG}`}}>S</div>
        <div><div style={{fontSize:"17px",fontWeight:700,letterSpacing:"-.03em"}}>Sliss</div><div style={{fontSize:"10px",color:T.textMu,fontWeight:500,letterSpacing:".04em",textTransform:"uppercase"}}>Ecosistema Operativo</div></div>
      </div>
    </div>
    <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:"2px"}}>
      {nav.map(n=>{const a=view===n.id; return <button key={n.id} onClick={()=>setView(n.id)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",borderRadius:T.r.m,border:"none",cursor:"pointer",background:a?T.blueS:"transparent",color:a?T.blue:T.textM,fontWeight:a?600:400,fontSize:"14px",fontFamily:"inherit",transition:"all .15s",textAlign:"left",width:"100%"}}><span style={{fontSize:"17px",width:"22px",textAlign:"center"}}>{n.icon}</span>{n.label}</button>})}
    </nav>
    <div style={{padding:"14px 18px",borderTop:`1px solid ${T.border}`}}>
      <div style={{fontSize:"11px",color:T.textMu}}>Sliss v2.0</div>
      <div style={{fontSize:"11px",color:T.textMu,marginTop:"2px"}}>Liscio come deve essere.</div>
    </div>
  </div>;
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════

// ── HOME ────────────────────────────────────────────────────────────────
const Home = () => {
  const {data}=useSliss(); const td=today();
  const pending=data.followUps.filter(f=>f.status==="pending"&&f.scheduledDate<=td);
  const awaiting=data.followUps.filter(f=>f.status==="sent"&&!f.satisfaction);
  const activeC=data.clients.filter(c=>c.status==="active"||c.status==="vip");
  const toReact=data.clients.filter(c=>c.status==="to_reactivate");
  const avgSat=data.feedbacks.length?(data.feedbacks.reduce((a,f)=>a+f.rating,0)/data.feedbacks.length).toFixed(1):"—";

  return <div style={{animation:"fadeIn .4s ease"}}>
    <div style={{marginBottom:"30px"}}><h1 style={{fontSize:"26px",fontWeight:700,letterSpacing:"-.03em",marginBottom:"6px"}}>Buongiorno ☀️</h1><p style={{color:T.textM,fontSize:"14px"}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"14px",marginBottom:"28px"}}>
      <Stat label="Da inviare" value={pending.length} icon="📤" color={pending.length?T.amber:T.green} sub={pending.length?"Azione richiesta":"Tutto liscio ✓"} />
      <Stat label="In attesa risposta" value={awaiting.length} icon="⏳" color={T.blue} sub="Follow-up inviati" />
      <Stat label="Clienti attivi" value={activeC.length} icon="👥" color={T.green} sub={`${toReact.length} da riattivare`} />
      <Stat label="Soddisfazione" value={avgSat} icon="⭐" color={T.purple} sub={`${data.feedbacks.length} feedback`} />
    </div>

    <Card style={{marginBottom:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
        <h2 style={{fontSize:"15px",fontWeight:700}}>📤 Follow-Up da inviare</h2>
        <Badge label={`${pending.length} in coda`} color={T.amber} bg={T.amberS} s />
      </div>
      {!pending.length?<div style={{padding:"20px",textAlign:"center",color:T.textD}}><span style={{fontSize:"22px"}}>✅</span><p style={{marginTop:"6px",fontSize:"13px"}}>Nessun follow-up da inviare oggi. Tutto liscio!</p></div>
      :<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        {pending.map(fu=>{const cl=data.clients.find(c=>c.id===fu.clientId); const ph=PHASES[fu.phase]; return <div key={fu.id} style={{display:"flex",alignItems:"center",gap:"14px",padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
          <span style={{fontSize:"22px"}}>{ph.icon}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px"}}><span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"—"}</span><Badge {...ph} s /></div>
            <div style={{fontSize:"12px",color:T.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fu.message?.slice(0,80)}...</div>
          </div>
          <div style={{display:"flex",gap:"6px",flexShrink:0}}><CopyBtn text={fu.message} /></div>
        </div>})}
      </div>}
    </Card>

    <Card>
      <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"16px"}}>🚦 Semaforo clienti</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:"10px"}}>
        {data.clients.map(cl=>{const st=CLIENT_ST[cl.status]; return <div key={cl.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
          <div style={{width:"9px",height:"9px",borderRadius:"50%",background:st.color,boxShadow:`0 0 8px ${st.color}50`,flexShrink:0}} />
          <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"13px"}}>{cl.name}</div><div style={{fontSize:"11px",color:T.textD}}>{daysAgo(cl.lastVisit)}</div></div>
          <Badge {...st} s />
        </div>})}
      </div>
    </Card>
  </div>;
};

// ── FOLLOW-UP ──────────────────────────────────────────────────────────
const FollowUp = () => {
  const {data,update}=useSliss(); const [filter,setFilter]=useState("all"); const [search,setSearch]=useState(""); const [sel,setSel]=useState(null);
  const td=today();
  const tabs=[
    {id:"all",label:"Tutti",count:data.followUps.length},
    {id:"today",label:"Oggi",count:data.followUps.filter(f=>f.status==="pending"&&f.scheduledDate<=td).length},
    {id:"awaiting",label:"Attesa",count:data.followUps.filter(f=>f.status==="sent").length},
    {id:"done",label:"Completati",count:data.followUps.filter(f=>f.status==="completed"||f.status==="replied").length},
  ];
  const filtered=data.followUps.filter(fu=>{
    const cl=data.clients.find(c=>c.id===fu.clientId);
    const ms=!search||cl?.name.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="all"||(filter==="today"&&fu.status==="pending"&&fu.scheduledDate<=td)||(filter==="awaiting"&&fu.status==="sent")||(filter==="done"&&(fu.status==="completed"||fu.status==="replied"));
    return ms&&mf;
  }).sort((a,b)=>new Date(a.scheduledDate)-new Date(b.scheduledDate));

  const markSent=(fu)=>update("followUps",fu.id,{status:"sent",sentDate:today()});

  return <div style={{animation:"fadeIn .4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}><h1 style={{fontSize:"22px",fontWeight:700}}>💬 Follow-Up</h1></div>
    <div style={{display:"flex",gap:"14px",marginBottom:"18px",flexWrap:"wrap"}}>
      <Tabs tabs={tabs} active={filter} onChange={setFilter} />
      <div style={{flex:1,minWidth:"190px"}}><Search value={search} onChange={setSearch} placeholder="Cerca cliente..." /></div>
    </div>
    {!filtered.length?<Empty icon="📭" title="Nessun follow-up" desc="Non ci sono follow-up per questo filtro." />
    :<div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
      {filtered.map((fu,i)=>{const cl=data.clients.find(c=>c.id===fu.clientId); const ph=PHASES[fu.phase]; const st=STATUSES[fu.status]; const timing=fu.status==="pending"?daysUntil(fu.scheduledDate):daysAgo(fu.sentDate);
        return <Card key={fu.id} hov onClick={()=>setSel(fu)} style={{padding:"14px 18px",animation:`fadeIn .3s ease ${i*.03}s both`}}>
          <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
            <span style={{fontSize:"20px",width:"28px",textAlign:"center"}}>{ph.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"3px",flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"—"}</span><Badge {...ph} s /><Badge {...st} s /></div>
              <div style={{fontSize:"12px",color:T.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fu.message?.slice(0,95)}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"5px",flexShrink:0}}>
              <span style={{fontSize:"12px",color:T.textD}}>{timing}</span>
              {fu.status==="pending"&&<div style={{display:"flex",gap:"5px"}}><CopyBtn text={fu.message} /><Btn v="success" s="sm" onClick={e=>{e.stopPropagation();markSent(fu)}}>✓ Inviato</Btn></div>}
              {fu.satisfaction&&<span style={{fontSize:"12px"}}>{"⭐".repeat(fu.satisfaction)}</span>}
            </div>
          </div>
        </Card>})}
    </div>}

    <Modal open={!!sel} onClose={()=>setSel(null)} title="Dettaglio Follow-Up" w="580px">
      {sel&&(()=>{const cl=data.clients.find(c=>c.id===sel.clientId); const ph=PHASES[sel.phase]; const st=STATUSES[sel.status]; return <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}><Badge {...ph} /><Badge {...st} /></div>
        <div><div style={{fontWeight:600,fontSize:"16px"}}>{cl?.name}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{cl?.phone} · {cl?.channel}</div></div>
        <div style={{padding:"14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"14px",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{sel.message}</div>
        <div style={{display:"flex",gap:"8px"}}><CopyBtn text={sel.message} />{sel.status==="pending"&&<Btn v="success" onClick={()=>{markSent(sel);setSel(null)}}>✓ Segna inviato</Btn>}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",paddingTop:"12px",borderTop:`1px solid ${T.border}`}}>
          <div><span style={{fontSize:"12px",color:T.textD}}>Programmato</span><div style={{fontSize:"13px",marginTop:"2px"}}>{fmtDate(sel.scheduledDate)}</div></div>
          <div><span style={{fontSize:"12px",color:T.textD}}>Inviato</span><div style={{fontSize:"13px",marginTop:"2px"}}>{fmtDate(sel.sentDate)}</div></div>
          <div><span style={{fontSize:"12px",color:T.textD}}>Soddisfazione</span><div style={{fontSize:"13px",marginTop:"2px"}}>{sel.satisfaction?"⭐".repeat(sel.satisfaction):"—"}</div></div>
        </div>
      </div>})()}
    </Modal>
  </div>;
};

// ── CLIENTS ────────────────────────────────────────────────────────────
const Clients = () => {
  const {data,addRecord,update}=useSliss(); const [search,setSearch]=useState(""); const [sf,setSf]=useState("all"); const [sel,setSel]=useState(null); const [showNew,setShowNew]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",email:"",channel:"WhatsApp",notes:"",sector:"Generico"});

  const tabs=[{id:"all",label:"Tutti",count:data.clients.length},{id:"active",label:"Attivi",count:data.clients.filter(c=>c.status==="active").length},{id:"vip",label:"VIP",count:data.clients.filter(c=>c.status==="vip").length},{id:"to_reactivate",label:"Da riattivare",count:data.clients.filter(c=>c.status==="to_reactivate").length}];
  const filtered=data.clients.filter(c=>{const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase()); const mf=sf==="all"||c.status===sf; return ms&&mf;});

  const handleAdd=()=>{
    if(!form.name.trim()) return;
    const td=today();
    addRecord("clients",{...form,id:uid(),status:"new",firstVisit:td,lastVisit:td,consent:true,created:td});
    setForm({name:"",phone:"",email:"",channel:"WhatsApp",notes:"",sector:"Generico"});
    setShowNew(false);
  };

  return <div style={{animation:"fadeIn .4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}><h1 style={{fontSize:"22px",fontWeight:700}}>👥 Clienti</h1><Btn onClick={()=>setShowNew(true)}>+ Nuovo cliente</Btn></div>
    <div style={{display:"flex",gap:"14px",marginBottom:"18px",flexWrap:"wrap"}}><Tabs tabs={tabs} active={sf} onChange={setSf} /><div style={{flex:1,minWidth:"190px"}}><Search value={search} onChange={setSearch} placeholder="Cerca nome o email..." /></div></div>

    <div style={{display:"grid",gap:"6px"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 100px",padding:"8px 18px",fontSize:"11px",fontWeight:600,color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}><span>Nome</span><span>Canale</span><span>Ultima visita</span><span>Stato</span><span></span></div>
      {filtered.map((cl,i)=>{const st=CLIENT_ST[cl.status]; const fuc=data.followUps.filter(f=>f.clientId===cl.id).length; return <Card key={cl.id} hov onClick={()=>setSel(cl)} style={{padding:"12px 18px",animation:`fadeIn .3s ease ${i*.03}s both`}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 100px",alignItems:"center"}}>
          <div><div style={{fontWeight:600,fontSize:"14px"}}>{cl.name}</div><div style={{fontSize:"12px",color:T.textD}}>{cl.email}</div></div>
          <span style={{fontSize:"13px",color:T.textM}}>{cl.channel}</span>
          <span style={{fontSize:"13px",color:T.textM}}>{fmtDate(cl.lastVisit)}</span>
          <Badge {...st} s />
          <div style={{textAlign:"right"}}><span style={{fontSize:"12px",color:T.textD}}>{fuc} FU</span></div>
        </div>
      </Card>})}
    </div>

    {/* New Client Modal */}
    <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo cliente">
      <FormField label="Nome completo"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Marco Rossi" /></FormField>
      <FormField label="Telefono"><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" /></FormField>
      <FormField label="Email"><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="marco@email.com" /></FormField>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
        <FormField label="Canale preferito"><select value={form.channel} onChange={e=>setForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
        <FormField label="Settore"><select value={form.sector} onChange={e=>setForm(p=>({...p,sector:e.target.value}))}><option>Generico</option><option>Tatuaggi</option><option>Barber</option><option>Estetica</option><option>Officina</option><option>Maker</option><option>Creativo</option></select></FormField>
      </div>
      <FormField label="Note"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Preferenze, info utili..." /></FormField>
      <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",marginTop:"8px"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.name.trim()}>Salva cliente</Btn></div>
    </Modal>

    {/* Client Detail Modal */}
    <Modal open={!!sel} onClose={()=>setSel(null)} title="Scheda Cliente" w="640px">
      {sel&&(()=>{const st=CLIENT_ST[sel.status]; const fus=data.followUps.filter(f=>f.clientId===sel.id).sort((a,b)=>new Date(b.scheduledDate)-new Date(a.scheduledDate)); return <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:"18px",fontWeight:700,marginBottom:"3px"}}>{sel.name}</div><div style={{fontSize:"13px",color:T.textD}}>{sel.phone} · {sel.email}</div></div><Badge {...st} /></div>
        {sel.notes&&<div style={{padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,fontSize:"13px",color:T.textM,lineHeight:1.6,border:`1px solid ${T.border}`}}>📝 {sel.notes}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}><div><span style={{fontSize:"12px",color:T.textD}}>Prima visita</span><div style={{fontSize:"13px",marginTop:"2px"}}>{fmtDate(sel.firstVisit)}</div></div><div><span style={{fontSize:"12px",color:T.textD}}>Ultima visita</span><div style={{fontSize:"13px",marginTop:"2px"}}>{fmtDate(sel.lastVisit)}</div></div><div><span style={{fontSize:"12px",color:T.textD}}>Settore</span><div style={{fontSize:"13px",marginTop:"2px"}}>{sel.sector||"Generico"}</div></div></div>
        <div><h4 style={{fontSize:"14px",fontWeight:600,marginBottom:"10px"}}>Storico Follow-Up</h4>
          {!fus.length?<div style={{fontSize:"13px",color:T.textD}}>Nessun follow-up.</div>
          :<div style={{display:"flex",flexDirection:"column",gap:"6px"}}>{fus.map(fu=>{const ph=PHASES[fu.phase]; const ss=STATUSES[fu.status]; return <div key={fu.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:T.bg3,borderRadius:T.r.s,border:`1px solid ${T.border}`}}><span style={{fontSize:"15px"}}>{ph.icon}</span><div style={{flex:1,display:"flex",gap:"5px"}}><Badge {...ph} s /><Badge {...ss} s /></div><span style={{fontSize:"12px",color:T.textD}}>{fmtDate(fu.scheduledDate)}</span></div>})}</div>}
        </div>
      </div>})()}
    </Modal>
  </div>;
};

// ── TEMPLATES ──────────────────────────────────────────────────────────
const Templates = () => {
  const {data}=useSliss(); const [filter,setFilter]=useState("all");
  const phases=[{id:"all",label:"Tutte"},{id:"thankyou",label:"Ringraziamento"},{id:"check",label:"Controllo"},{id:"review",label:"Recensione"},{id:"reactivation",label:"Riattivazione"}];
  const filtered=data.templates.filter(t=>filter==="all"||t.phase===filter);

  return <div style={{animation:"fadeIn .4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}><h1 style={{fontSize:"22px",fontWeight:700}}>📝 Template</h1></div>
    <div style={{marginBottom:"18px"}}><Tabs tabs={phases.map(p=>({...p,count:p.id==="all"?data.templates.length:data.templates.filter(t=>t.phase===p.id).length}))} active={filter} onChange={setFilter} /></div>
    <div style={{display:"grid",gap:"10px"}}>{filtered.map((tmpl,i)=>{const ph=PHASES[tmpl.phase]; return <Card key={tmpl.id} style={{animation:`fadeIn .3s ease ${i*.04}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"18px"}}>{ph.icon}</span><div><div style={{fontWeight:600,fontSize:"14px"}}>{tmpl.name}</div><div style={{fontSize:"12px",color:T.textD}}>{tmpl.code} · {tmpl.sector} · {tmpl.channel}</div></div></div>
        <div style={{display:"flex",gap:"5px"}}><Badge {...ph} s />{tmpl.active&&<Badge label="Attivo" color={T.green} bg={T.greenS} s />}</div>
      </div>
      <div style={{padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"13px",lineHeight:1.7,color:T.textM,whiteSpace:"pre-wrap"}}>{tmpl.text}</div>
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:"10px"}}><CopyBtn text={tmpl.text} /></div>
    </Card>})}</div>
  </div>;
};

// ── FEEDBACK ──────────────────────────────────────────────────────────
const Feedback = () => {
  const {data,addRecord}=useSliss(); const [showNew,setShowNew]=useState(false);
  const [form,setForm]=useState({clientId:"",rating:5,comment:"",wouldRecommend:true});
  const avgR=data.feedbacks.length?(data.feedbacks.reduce((a,f)=>a+f.rating,0)/data.feedbacks.length).toFixed(1):"—";
  const rec=data.feedbacks.filter(f=>f.wouldRecommend).length;

  const handleAdd=()=>{
    if(!form.clientId) return;
    addRecord("feedbacks",{id:uid(),clientId:form.clientId,rating:form.rating,comment:form.comment,wouldRecommend:form.wouldRecommend,date:today()});
    setForm({clientId:"",rating:5,comment:"",wouldRecommend:true});
    setShowNew(false);
  };

  return <div style={{animation:"fadeIn .4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}><h1 style={{fontSize:"22px",fontWeight:700}}>⭐ Feedback</h1><Btn onClick={()=>setShowNew(true)}>+ Nuovo feedback</Btn></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"14px",marginBottom:"28px"}}>
      <Stat label="Media voto" value={avgR} icon="⭐" color={T.purple} sub="su 5 stelle" />
      <Stat label="Totali" value={data.feedbacks.length} icon="📊" color={T.blue} />
      <Stat label="Consiglierebbero" value={rec} icon="👍" color={T.green} sub={`su ${data.feedbacks.length}`} />
    </div>
    {!data.feedbacks.length?<Empty icon="⭐" title="Nessun feedback" desc="I feedback dei clienti appariranno qui." />
    :<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{data.feedbacks.map((fb,i)=>{const cl=data.clients.find(c=>c.id===fb.clientId); return <Card key={fb.id} style={{animation:`fadeIn .3s ease ${i*.05}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={{fontWeight:600,fontSize:"14px",marginBottom:"4px"}}>{cl?.name||"—"}</div><div style={{fontSize:"15px",marginBottom:"6px"}}>{"⭐".repeat(fb.rating)}{"☆".repeat(5-fb.rating)}</div>{fb.comment&&<div style={{fontSize:"13px",color:T.textM,lineHeight:1.6}}>"{fb.comment}"</div>}</div>
        <div style={{textAlign:"right"}}><div style={{fontSize:"12px",color:T.textD}}>{fmtDate(fb.date)}</div>{fb.wouldRecommend&&<Badge label="Consiglierebbe" color={T.green} bg={T.greenS} s />}</div>
      </div>
    </Card>})}</div>}

    <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo feedback">
      <FormField label="Cliente"><select value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))}><option value="">Seleziona cliente...</option>{data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
      <FormField label="Valutazione"><div style={{display:"flex",gap:"8px"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setForm(p=>({...p,rating:n}))} style={{fontSize:"24px",background:"none",border:"none",cursor:"pointer",opacity:n<=form.rating?1:.3}}>{n<=form.rating?"⭐":"☆"}</button>)}</div></FormField>
      <FormField label="Commento (opzionale)"><textarea value={form.comment} onChange={e=>setForm(p=>({...p,comment:e.target.value}))} placeholder="Cosa ha detto il cliente..." /></FormField>
      <FormField label="Consiglierebbe?"><div style={{display:"flex",gap:"10px"}}><Btn v={form.wouldRecommend?"primary":"secondary"} s="sm" onClick={()=>setForm(p=>({...p,wouldRecommend:true}))}>👍 Sì</Btn><Btn v={!form.wouldRecommend?"danger":"secondary"} s="sm" onClick={()=>setForm(p=>({...p,wouldRecommend:false}))}>👎 No</Btn></div></FormField>
      <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",marginTop:"8px"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.clientId}>Salva feedback</Btn></div>
    </Modal>
  </div>;
};

// ── MODULES MAP ────────────────────────────────────────────────────────
const ModulesMap = () => {
  const stL={active:"Attivo",planned:"Pianificato",future:"Futuro"};
  const stS={active:{color:T.green,bg:T.greenS},planned:{color:T.amber,bg:T.amberS},future:{color:T.textD,bg:"rgba(90,111,148,0.1)"}};
  return <div style={{animation:"fadeIn .4s ease"}}>
    <div style={{marginBottom:"28px"}}><h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"6px"}}>🧩 Ecosistema Sliss</h1><p style={{color:T.textM,fontSize:"14px",lineHeight:1.6}}>Ogni modulo risolve un problema specifico. Attivali uno alla volta.</p></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px"}}>{MODULES.map((mod,i)=>{const ss=stS[mod.status]; return <Card key={mod.id} hov style={{animation:`fadeIn .3s ease ${i*.04}s both`,borderColor:mod.status==="active"?`${mod.color}40`:T.border}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"}}>
        <div style={{width:"42px",height:"42px",borderRadius:T.r.m,background:`${mod.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"}}>{mod.icon}</div>
        <Badge label={stL[mod.status]} {...ss} s />
      </div>
      <div style={{fontWeight:700,fontSize:"15px",marginBottom:"4px"}}>{mod.name}</div>
      <div style={{fontSize:"13px",color:T.textM,lineHeight:1.6}}>{mod.desc}</div>
      {mod.status==="active"&&<div style={{marginTop:"12px",paddingTop:"12px",borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:"7px",height:"7px",borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}} /><span style={{fontSize:"12px",color:T.green,fontWeight:600}}>Modulo attivo</span></div>}
    </Card>})}</div>
  </div>;
};

// ── SETTINGS ──────────────────────────────────────────────────────────
const Settings = () => {
  const {data,updateSettings,resetData}=useSliss();
  const [bName,setBName]=useState(data.settings?.businessName||"");
  const [sector,setSector]=useState(data.settings?.sector||"Generico");
  const [saved,setSaved]=useState(false);

  const handleSave=()=>{
    updateSettings({businessName:bName,sector});
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  return <div style={{animation:"fadeIn .4s ease"}}>
    <h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"22px"}}>⚙️ Impostazioni</h1>
    <Card style={{maxWidth:"520px",marginBottom:"20px"}}>
      <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"16px"}}>Dati attività</h3>
      <FormField label="Nome attività"><input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Il nome della tua attività" /></FormField>
      <FormField label="Settore principale"><select value={sector} onChange={e=>setSector(e.target.value)}><option>Generico</option><option>Tatuaggi</option><option>Barber</option><option>Estetica</option><option>Officina</option><option>Maker</option><option>Creativo</option></select></FormField>
      <div style={{display:"flex",gap:"10px"}}><Btn onClick={handleSave}>{saved?"✓ Salvato!":"Salva impostazioni"}</Btn></div>
    </Card>
    <Card style={{maxWidth:"520px"}}>
      <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"10px"}}>Dati e Storage</h3>
      <p style={{fontSize:"13px",color:T.textM,lineHeight:1.6,marginBottom:"14px"}}>I dati sono salvati nel browser. Se cancelli la cache del browser, i dati verranno persi. In futuro sarà disponibile il salvataggio cloud.</p>
      <div style={{display:"flex",gap:"10px"}}>
        <Btn v="danger" onClick={()=>{if(confirm("Sei sicuro? Tutti i dati verranno cancellati e ripristinati con i dati di esempio.")){resetData()}}}>🗑️ Reset dati di esempio</Btn>
      </div>
    </Card>
  </div>;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function SlissPlatform() {
  const [view,setView]=useState("home");
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{loadData().then(d=>{setData(d);setLoading(false)});},[]);
  useEffect(()=>{if(data&&!loading) saveData(data);},[data,loading]);

  const update=useCallback((table,id,updates)=>{
    setData(prev=>{if(!prev) return prev; return {...prev,[table]:prev[table].map(r=>r.id===id?{...r,...updates}:r)};});
  },[]);

  const addRecord=useCallback((table,record)=>{
    setData(prev=>{if(!prev) return prev; return {...prev,[table]:[...prev[table],record]};});
  },[]);

  const deleteRecord=useCallback((table,id)=>{
    setData(prev=>{if(!prev) return prev; return {...prev,[table]:prev[table].filter(r=>r.id!==id)};});
  },[]);

  const updateSettings=useCallback((updates)=>{
    setData(prev=>{if(!prev) return prev; return {...prev,settings:{...prev.settings,...updates}};});
  },[]);

  const resetData=useCallback(()=>{
    const d=defaultData(); setData(d); saveData(d);
  },[]);

  if(loading||!data) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:T.bg}}>
    <div style={{textAlign:"center"}}>
      <div style={{width:"48px",height:"48px",borderRadius:T.r.l,background:`linear-gradient(135deg,${T.blue},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",fontWeight:800,color:"#fff",margin:"0 auto 16px",animation:"pulse 1.5s infinite"}}>S</div>
      <div style={{color:T.textM,fontSize:"14px"}}>Caricamento...</div>
    </div>
  </div>;

  const ctx={data,update,addRecord,deleteRecord,updateSettings,resetData};
  const views={home:Home,followup:FollowUp,clients:Clients,templates:Templates,feedback:Feedback,modules:ModulesMap,settings:Settings};
  const V=views[view]||Home;

  return <Ctx.Provider value={ctx}>
    <GlobalCSS />
    <div style={{display:"flex",minHeight:"100vh"}}>
      <Sidebar view={view} setView={setView} />
      <main style={{flex:1,marginLeft:"210px",padding:"28px 36px",maxWidth:"1060px"}}><V /></main>
    </div>
  </Ctx.Provider>;
}
