import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SLISS PLATFORM v3.0 — Ecosistema Operativo per Micro-Business
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  bg: "#070B12", bg2: "#0C1219", bg3: "#111820", bg4: "#172030",
  border: "#1A2535", borderH: "#263548", borderA: "#3B7BF6",
  text: "#E8EDF5", textM: "#8B9DC3", textD: "#4A5E80", textMu: "#2E3F5C",
  blue: "#3B7BF6", blueH: "#2B66E0", blueS: "rgba(59,123,246,0.10)", blueG: "rgba(59,123,246,0.20)",
  green: "#0FBE7A", greenS: "rgba(15,190,122,0.10)",
  amber: "#E8A830", amberS: "rgba(232,168,48,0.10)",
  red: "#E84850", redS: "rgba(232,72,80,0.10)",
  purple: "#8B5CF6", purpleS: "rgba(139,92,246,0.10)",
  teal: "#14B8A6", tealS: "rgba(20,184,166,0.10)",
  r: { s: "6px", m: "10px", l: "14px", xl: "20px", full: "9999px" },
};

const GlobalCSS = () => <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:${T.bg};color:${T.text};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px}
  input,textarea,select{font-family:inherit;background:${T.bg3};border:1px solid ${T.border};color:${T.text};border-radius:${T.r.m};padding:10px 14px;font-size:14px;outline:none;transition:all .2s;width:100%}
  input:focus,textarea:focus,select:focus{border-color:${T.blue};box-shadow:0 0 0 3px ${T.blueS}}
  textarea{resize:vertical;min-height:80px}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238B9DC3' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
  @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
`}</style>;

// ── Storage ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "sliss-data-v3";

const defaultData = () => ({
  clients: [
    { id: "c1", name: "Marco Bianchi", phone: "3471234567", email: "marco.bianchi@gmail.com", channel: "WhatsApp", firstVisit: "2026-03-10", lastVisit: "2026-05-08", status: "active", notes: "Preferisce pomeriggio. Paga in contanti.", consent: true, created: "2026-03-10" },
    { id: "c2", name: "Giulia Romano", phone: "3389876543", email: "giulia.romano@libero.it", channel: "WhatsApp", firstVisit: "2026-01-22", lastVisit: "2026-04-05", status: "vip", notes: "Pelle sensibile. Preferisce sabato mattina.", consent: true, created: "2026-01-22" },
    { id: "c3", name: "Luca Ferretti", phone: "3201112233", email: "luca.f@gmail.com", channel: "WhatsApp", firstVisit: "2026-05-01", lastVisit: "2026-05-14", status: "new", notes: "Primo appuntamento. Molto soddisfatto.", consent: true, created: "2026-05-01" },
    { id: "c4", name: "Sofia Marchetti", phone: "3287654321", email: "sofia.m@outlook.it", channel: "Email", firstVisit: "2025-11-15", lastVisit: "2026-02-20", status: "to_reactivate", notes: "Non si vede da 3 mesi.", consent: true, created: "2025-11-15" },
    { id: "c5", name: "Andrea Colombo", phone: "3331234567", email: "andrea.c@yahoo.it", channel: "WhatsApp", firstVisit: "2026-04-10", lastVisit: "2026-05-12", status: "active", notes: "Cliente abituale, sempre lo stesso servizio.", consent: true, created: "2026-04-10" },
  ],
  appointments: [
    { id: "a1", clientId: "c1", date: "2026-05-08T15:30", serviceType: "Sessione standard", amount: 80, followUpTriggered: true },
    { id: "a2", clientId: "c2", date: "2026-04-05T10:00", serviceType: "Ritocco", amount: 45, followUpTriggered: true },
    { id: "a3", clientId: "c3", date: "2026-05-14T11:00", serviceType: "Prima consulenza", amount: 60, followUpTriggered: true },
    { id: "a4", clientId: "c5", date: "2026-05-12T16:00", serviceType: "Taglio", amount: 25, followUpTriggered: true },
  ],
  followUps: [
    { id: "f1", appointmentId: "a1", clientId: "c1", phase: "thankyou", status: "sent", scheduledDate: "2026-05-08", sentDate: "2026-05-08", satisfaction: null, message: "Ciao Marco! Grazie per essere passato oggi 🙏 È stato un piacere. Se hai dubbi, scrivimi. A presto!" },
    { id: "f2", appointmentId: "a1", clientId: "c1", phase: "check", status: "pending", scheduledDate: "2026-05-15", sentDate: null, satisfaction: null, message: "Ciao Marco! Volevo solo sapere come stai andando dopo l'appuntamento di settimana scorsa. Tutto ok?" },
    { id: "f3", appointmentId: "a1", clientId: "c1", phase: "reactivation", status: "pending", scheduledDate: "2026-07-08", sentDate: null, satisfaction: null, message: "Ciao Marco! Pensavo a te — come sta andando?" },
    { id: "f4", appointmentId: "a2", clientId: "c2", phase: "thankyou", status: "sent", scheduledDate: "2026-04-05", sentDate: "2026-04-05", satisfaction: null, message: "Ciao Giulia! Grazie per essere passata oggi ✨ Spero ti sia piaciuto il trattamento." },
    { id: "f5", appointmentId: "a2", clientId: "c2", phase: "check", status: "replied", scheduledDate: "2026-04-12", sentDate: "2026-04-12", satisfaction: 5, message: "Ciao Giulia! Come procede tutto?" },
    { id: "f6", appointmentId: "a2", clientId: "c2", phase: "review", status: "pending", scheduledDate: "2026-04-20", sentDate: null, satisfaction: null, message: "Ciao Giulia! Sono contenta che ti sia trovata bene 🙏 Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo." },
    { id: "f7", appointmentId: "a2", clientId: "c2", phase: "reactivation", status: "pending", scheduledDate: "2026-06-05", sentDate: null, satisfaction: null, message: "Ciao Giulia! Pensavo a te — buona giornata!" },
    { id: "f8", appointmentId: "a3", clientId: "c3", phase: "thankyou", status: "pending", scheduledDate: "2026-05-14", sentDate: null, satisfaction: null, message: "Ciao Luca! Grazie per oggi 🖤 Per qualsiasi cosa, scrivimi." },
    { id: "f9", appointmentId: "a4", clientId: "c5", phase: "thankyou", status: "sent", scheduledDate: "2026-05-12", sentDate: "2026-05-12", satisfaction: null, message: "Ciao Andrea! Grazie del passaggio 💈 Spero ti piaccia il risultato." },
    { id: "f10", appointmentId: "a4", clientId: "c5", phase: "check", status: "pending", scheduledDate: "2026-05-22", sentDate: null, satisfaction: null, message: "Ciao Andrea! Tutto ok con il taglio? 💈" },
    { id: "f11", clientId: "c4", phase: "reactivation", status: "pending", scheduledDate: "2026-05-20", sentDate: null, satisfaction: null, message: "Ciao Sofia! Pensavo a te — come stai? Se vuoi prenotare, sono qui." },
  ],
  templates: [
    { id: "t1", name: "Ringraziamento base", code: "R1", phase: "thankyou", channel: "WhatsApp", text: "Ciao [Nome]! Grazie per essere passato/a oggi 🙏 È stato un piacere. Se hai dubbi o domande nei prossimi giorni, scrivimi senza problemi. A presto!", active: true },
    { id: "t2", name: "Ringraziamento aftercare", code: "R2", phase: "thankyou", channel: "WhatsApp", text: "Ciao [Nome]! Grazie ancora per oggi 🙌 Ti lascio due cose da tenere a mente: [Istruzione 1] e [Istruzione 2]. Per qualsiasi dubbio scrivimi.", active: true },
    { id: "t3", name: "Ringraziamento tatuaggi", code: "R3", phase: "thankyou", channel: "WhatsApp", text: "Ciao [Nome]! Grazie per oggi, è stata una bella sessione 🖤 Ricordati pellicola e sapone neutro. I primi 3 giorni sono importanti. Scrivimi per qualsiasi cosa.", active: true },
    { id: "t4", name: "Controllo base", code: "C1", phase: "check", channel: "WhatsApp", text: "Ciao [Nome]! Volevo solo sapere come stai andando dopo l'appuntamento di settimana scorsa. Tutto ok? Se qualcosa non ti convince al 100%, dimmelo — preferisco saperlo direttamente.", active: true },
    { id: "t5", name: "Controllo cicatrizzazione", code: "C2", phase: "check", channel: "WhatsApp", text: "Ciao [Nome]! Come sta andando la cicatrizzazione? Dovrebbe desquamarsi — è normale. Se hai dubbi, mandami una foto.", active: true },
    { id: "t6", name: "Richiesta recensione", code: "RC1", phase: "review", channel: "WhatsApp", text: "Ciao [Nome]! Sono contento/a che ti sia trovato/a bene 🙏 Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie di cuore!", active: true },
    { id: "t7", name: "Recensione soft", code: "RC2", phase: "review", channel: "WhatsApp", text: "Ciao [Nome]! Mi ha fatto piacere sentirti contento/a 🙌 Se ti va di lasciarmi due righe su Google, per me sarebbe un grande aiuto. Nessun problema se no, eh.", active: true },
    { id: "t8", name: "Riattivazione naturale", code: "RI1", phase: "reactivation", channel: "WhatsApp", text: "Ciao [Nome]! Pensavo a te — come stai? Se hai in mente qualcosa, sono qui. Buona giornata!", active: true },
    { id: "t9", name: "Riattivazione stagionale", code: "RI2", phase: "reactivation", channel: "WhatsApp", text: "Ciao [Nome]! Con [Stagione/Evento] che si avvicina pensavo a te 🌿 Se vuoi prenotare in anticipo, scrivimi.", active: true },
  ],
  feedbacks: [
    { id: "fb1", clientId: "c2", rating: 5, comment: "Ottimo lavoro come sempre!", wouldRecommend: true, date: "2026-04-13" },
  ],
  settings: {
    businessName: "Momo Ink",
    reviewLink: "",
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

// ── Config ─────────────────────────────────────────────────────────────────
const PHASES = {
  thankyou:    { label: "Ringraziamento", color: T.blue,   icon: "🙏", bg: T.blueS },
  check:       { label: "Controllo",      color: T.amber,  icon: "🔍", bg: T.amberS },
  review:      { label: "Recensione",     color: T.purple, icon: "⭐", bg: T.purpleS },
  reactivation:{ label: "Riattivazione",  color: T.green,  icon: "💬", bg: T.greenS },
};
const STATUSES = {
  pending:   { label: "In attesa",   color: T.amber,  bg: T.amberS },
  sent:      { label: "Inviato",     color: T.blue,   bg: T.blueS },
  replied:   { label: "Risposto",    color: T.green,  bg: T.greenS },
  completed: { label: "Completato",  color: T.textD,  bg: "rgba(90,111,148,0.10)" },
  skipped:   { label: "Saltato",     color: T.textMu, bg: "rgba(61,81,120,0.08)" },
};
const CLIENT_ST = {
  new:           { label: "Nuovo",         color: T.blue,   bg: T.blueS },
  active:        { label: "Attivo",        color: T.green,  bg: T.greenS },
  vip:           { label: "VIP",           color: T.purple, bg: T.purpleS },
  to_reactivate: { label: "Da riattivare", color: T.amber,  bg: T.amberS },
  inactive:      { label: "Inattivo",      color: T.textD,  bg: "rgba(90,111,148,0.10)" },
};
const MODULES = [
  { id: "followup",   name: "Follow-Up",    icon: "💬", color: T.blue,   desc: "Follow-up post-appuntamento", status: "active" },
  { id: "onboarding", name: "Onboarding",   icon: "📋", color: T.purple, desc: "Info pre-appuntamento",        status: "planned" },
  { id: "reminders",  name: "Reminder",     icon: "⏰", color: T.amber,  desc: "Riduci i no-show",             status: "planned" },
  { id: "inbound",    name: "Richieste",    icon: "📥", color: T.teal,   desc: "Gestisci i messaggi in entrata",status: "planned" },
  { id: "faq",        name: "FAQ",          icon: "📚", color: "#6366F1",desc: "Risposte automatiche",          status: "future" },
  { id: "referral",   name: "Referral",     icon: "🤝", color: T.green,  desc: "Passaparola strutturato",       status: "future" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = d => { if (!d) return "—"; return new Date(d).toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"}); };
const daysAgo = d => { if(!d) return null; const diff=Math.floor((Date.now()-new Date(d))/(864e5)); return diff===0?"Oggi":diff===1?"Ieri":`${diff}g fa`; };
const daysUntil = d => { if(!d) return null; const diff=Math.floor((new Date(d)-Date.now())/(864e5)); if(diff<0) return `${Math.abs(diff)}g fa`; if(diff===0) return "Oggi"; if(diff===1) return "Domani"; return `Tra ${diff}g`; };
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const today = () => new Date().toISOString().split("T")[0];
const greet = () => { const h=new Date().getHours(); if(h<12) return "Buongiorno"; if(h<18) return "Buonasera"; return "Buonasera"; };

// ── UI Components ──────────────────────────────────────────────────────────
const Badge = ({label,color,bg,s}) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:s?"2px 9px":"3px 11px",borderRadius:T.r.full,fontSize:s?"11px":"12px",fontWeight:600,color,background:bg,letterSpacing:".02em",whiteSpace:"nowrap"}}>{label}</span>
);

const Btn = ({children,v="primary",s="md",onClick,style,disabled}) => {
  const VS={
    primary:{bg:T.blue,c:"#fff",hb:T.blueH,bd:"none"},
    secondary:{bg:"transparent",c:T.textM,hb:T.bg4,bd:`1px solid ${T.border}`},
    success:{bg:T.green,c:"#fff",hb:"#09a066",bd:"none"},
    danger:{bg:"transparent",c:T.red,hb:T.redS,bd:`1px solid ${T.red}33`},
    ghost:{bg:"transparent",c:T.textD,hb:T.bg3,bd:"none"},
  };
  const SS={sm:{p:"5px 12px",f:"12px"},md:{p:"9px 18px",f:"13px"},lg:{p:"12px 24px",f:"14px"}};
  const vv=VS[v],ss=SS[s];
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:"inline-flex",alignItems:"center",gap:"6px",background:h&&!disabled?vv.hb:vv.bg,color:vv.c,border:vv.bd,borderRadius:T.r.m,fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all .15s",fontFamily:"inherit",opacity:disabled?.5:1,padding:ss.p,fontSize:ss.f,...style}}>
      {children}
    </button>
  );
};

const Card = ({children,style,onClick,hov}) => {
  const [h,setH]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:T.bg2,border:`1px solid ${h&&hov?T.borderH:T.border}`,borderRadius:T.r.l,padding:"18px 20px",transition:"border-color .2s",cursor:hov?"pointer":"default",animation:"fadeIn .3s ease",...style}}>
      {children}
    </div>
  );
};

const Empty = ({icon,title,desc}) => (
  <div style={{textAlign:"center",padding:"60px 20px",color:T.textD}}>
    <div style={{fontSize:"40px",marginBottom:"14px",opacity:.4}}>{icon}</div>
    <div style={{fontSize:"15px",fontWeight:600,color:T.textM,marginBottom:"6px"}}>{title}</div>
    <div style={{fontSize:"13px",maxWidth:"340px",margin:"0 auto",lineHeight:1.7}}>{desc}</div>
  </div>
);

const Search = ({value,onChange,placeholder}) => (
  <div style={{position:"relative"}}>
    <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"14px",opacity:.35}}>🔍</span>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Cerca..."} style={{paddingLeft:"34px",background:T.bg3}} />
  </div>
);

const Tabs = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:"2px",background:T.bg,padding:"3px",borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)}
        style={{padding:"7px 14px",borderRadius:T.r.s,border:"none",cursor:"pointer",background:active===t.id?T.bg3:"transparent",color:active===t.id?T.text:T.textD,fontWeight:active===t.id?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .15s"}}>
        {t.label}{t.count!=null&&<span style={{marginLeft:"5px",fontSize:"11px",opacity:.55}}>({t.count})</span>}
      </button>
    ))}
  </div>
);

const Modal = ({open,onClose,title,children,w}) => {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.80)",backdropFilter:"blur(8px)"}} />
      <div onClick={e=>e.stopPropagation()}
        style={{position:"relative",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:T.r.xl,width:w||"540px",maxWidth:"94vw",maxHeight:"88vh",overflow:"auto",animation:"fadeIn .2s ease",boxShadow:"0 20px 60px rgba(0,0,0,.7)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:`1px solid ${T.border}`}}>
          <h3 style={{fontSize:"15px",fontWeight:700}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.textD,fontSize:"18px",cursor:"pointer",lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:"24px"}}>{children}</div>
      </div>
    </div>
  );
};

const FormField = ({label,children,hint}) => (
  <div style={{marginBottom:"16px"}}>
    <label style={{display:"block",fontSize:"11px",color:T.textD,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:"6px"}}>{label}</label>
    {children}
    {hint&&<div style={{fontSize:"11px",color:T.textMu,marginTop:"5px"}}>{hint}</div>}
  </div>
);

// Bottoni canale invio — sostituisce dropdown
const SendButtons = ({message, clientPhone}) => {
  const [ok,setOk]=useState(false);
  const copy = () => { navigator.clipboard.writeText(message); setOk(true); setTimeout(()=>setOk(false),2000); };
  const waLink = `https://wa.me/39${clientPhone}?text=${encodeURIComponent(message)}`;
  return (
    <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
      <a href={waLink} target="_blank" rel="noreferrer"
        style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"6px 13px",background:"#1DA851",color:"#fff",borderRadius:T.r.m,fontSize:"12px",fontWeight:600,textDecoration:"none"}}>
        📱 WhatsApp
      </a>
      <button onClick={copy}
        style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"6px 13px",background:ok?T.green:T.bg4,color:ok?"#fff":T.textM,border:`1px solid ${T.border}`,borderRadius:T.r.m,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
        {ok?"✓ Copiato":"📋 Copia testo"}
      </button>
    </div>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({view,setView}) => {
  const nav = [
    {id:"home",         icon:"🏠", label:"Home"},
    {id:"appointments", icon:"📅", label:"Appuntamenti"},
    {id:"followup",     icon:"💬", label:"Follow-Up"},
    {id:"clients",      icon:"👥", label:"Clienti"},
    {id:"templates",    icon:"📝", label:"Template"},
    {id:"feedback",     icon:"⭐", label:"Feedback"},
    {id:"modules",      icon:"🧩", label:"Moduli"},
    {id:"settings",     icon:"⚙️", label:"Impostazioni"},
  ];
  return (
    <div style={{width:"200px",minHeight:"100vh",background:T.bg,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:100}}>
      <div style={{padding:"20px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{width:"32px",height:"32px",borderRadius:T.r.m,background:T.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:800,color:"#fff",flexShrink:0}}>S</div>
          <div>
            <div style={{fontSize:"16px",fontWeight:700,letterSpacing:"-.02em",lineHeight:1.1}}>Sliss</div>
            <div style={{fontSize:"9px",color:T.textMu,fontWeight:500,letterSpacing:".05em",textTransform:"uppercase",marginTop:"2px"}}>Ecosistema Operativo</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px 6px",display:"flex",flexDirection:"column",gap:"1px"}}>
        {nav.map(n=>{
          const a=view===n.id;
          return (
            <button key={n.id} onClick={()=>setView(n.id)}
              style={{display:"flex",alignItems:"center",gap:"9px",padding:"9px 11px",borderRadius:T.r.m,border:"none",cursor:"pointer",background:a?T.blueS:"transparent",color:a?T.blue:T.textD,fontWeight:a?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .12s",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:"16px",width:"20px",textAlign:"center",flexShrink:0}}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`}}>
        <div style={{fontSize:"10px",color:T.textMu,lineHeight:1.6}}>Sliss v3.0</div>
        <div style={{fontSize:"10px",color:T.textMu}}>liscio come deve essere.</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════

// ── HOME ───────────────────────────────────────────────────────────────────
const Home = () => {
  const {data} = useSliss();
  const td = today();
  const biz = data.settings?.businessName || "la tua attività";
  const pending = data.followUps.filter(f=>f.status==="pending"&&f.scheduledDate<=td);
  const awaiting = data.followUps.filter(f=>f.status==="sent"&&!f.satisfaction);
  const activeC = data.clients.filter(c=>c.status==="active"||c.status==="vip");
  const toReact = data.clients.filter(c=>c.status==="to_reactivate");

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      {/* Saluto */}
      <div style={{marginBottom:"28px"}}>
        <div style={{fontSize:"13px",color:T.textD,marginBottom:"4px",fontWeight:500}}>
          {new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}
        </div>
        <h1 style={{fontSize:"24px",fontWeight:700,letterSpacing:"-.02em",lineHeight:1.2}}>
          {greet()}, <span style={{color:T.blue}}>{biz}</span> 👋
        </h1>
      </div>

      {/* 3 metriche essenziali */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"24px"}}>
        {[
          {label:"Da inviare oggi",    value:pending.length,  color:pending.length?T.amber:T.green, sub:pending.length?"Richiede attenzione":"Tutto in ordine"},
          {label:"Attesa risposta",    value:awaiting.length, color:T.blue,   sub:"Follow-up inviati"},
          {label:"Clienti attivi",     value:activeC.length,  color:T.green,  sub:`${toReact.length} da riattivare`},
        ].map((s,i)=>(
          <Card key={i} style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            <span style={{fontSize:"12px",color:T.textD,fontWeight:500}}>{s.label}</span>
            <span style={{fontSize:"28px",fontWeight:700,color:s.color,letterSpacing:"-.02em",lineHeight:1}}>{s.value}</span>
            <span style={{fontSize:"11px",color:T.textMu}}>{s.sub}</span>
          </Card>
        ))}
      </div>

      {/* Da fare oggi */}
      <Card style={{marginBottom:"16px",padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <h2 style={{fontSize:"14px",fontWeight:700}}>Da fare oggi</h2>
          {pending.length>0&&<Badge label={`${pending.length} in coda`} color={T.amber} bg={T.amberS} s />}
        </div>
        {!pending.length
          ? <div style={{padding:"16px 0",textAlign:"center"}}>
              <div style={{fontSize:"22px",marginBottom:"6px"}}>✅</div>
              <div style={{fontSize:"13px",color:T.textD}}>Nessun follow-up da inviare oggi.</div>
            </div>
          : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {pending.map(fu=>{
                const cl=data.clients.find(c=>c.id===fu.clientId);
                const ph=PHASES[fu.phase];
                return (
                  <div key={fu.id} style={{display:"flex",alignItems:"flex-start",gap:"12px",padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
                    <span style={{fontSize:"18px",flexShrink:0,marginTop:"2px"}}>{ph.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"}}>
                        <span style={{fontWeight:600,fontSize:"13px"}}>{cl?.name||"—"}</span>
                        <Badge {...ph} s />
                      </div>
                      <div style={{fontSize:"12px",color:T.textD,lineHeight:1.5,marginBottom:"8px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fu.message}</div>
                      <SendButtons message={fu.message} clientPhone={cl?.phone||""} />
                    </div>
                  </div>
                );
              })}
            </div>
        }
      </Card>

      {/* Semaforo clienti */}
      <Card>
        <h2 style={{fontSize:"14px",fontWeight:700,marginBottom:"14px"}}>Semaforo clienti</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"8px"}}>
          {data.clients.map(cl=>{
            const st=CLIENT_ST[cl.status];
            return (
              <div key={cl.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
                <div style={{width:"8px",height:"8px",borderRadius:"50%",background:st.color,flexShrink:0}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl.name}</div>
                  <div style={{fontSize:"11px",color:T.textD}}>{daysAgo(cl.lastVisit)}</div>
                </div>
                <Badge {...st} s />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ── FOLLOW-UP ──────────────────────────────────────────────────────────────
const FollowUp = () => {
  const {data,update}=useSliss();
  const [filter,setFilter]=useState("today");
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const td=today();

  const tabs=[
    {id:"today",   label:"Da inviare", count:data.followUps.filter(f=>f.status==="pending"&&f.scheduledDate<=td).length},
    {id:"awaiting",label:"In attesa",  count:data.followUps.filter(f=>f.status==="sent").length},
    {id:"all",     label:"Tutti",      count:data.followUps.length},
    {id:"done",    label:"Completati", count:data.followUps.filter(f=>f.status==="completed"||f.status==="replied").length},
  ];

  const filtered=data.followUps.filter(fu=>{
    const cl=data.clients.find(c=>c.id===fu.clientId);
    const ms=!search||cl?.name.toLowerCase().includes(search.toLowerCase());
    const mf=
      filter==="all" ||
      (filter==="today"   && fu.status==="pending"&&fu.scheduledDate<=td) ||
      (filter==="awaiting"&& fu.status==="sent") ||
      (filter==="done"    &&(fu.status==="completed"||fu.status==="replied"));
    return ms&&mf;
  }).sort((a,b)=>new Date(a.scheduledDate)-new Date(b.scheduledDate));

  const markSent=(fu)=>{ update("followUps",fu.id,{status:"sent",sentDate:today()}); if(sel?.id===fu.id) setSel({...fu,status:"sent",sentDate:today()}); };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"22px"}}>Follow-Up</h1>
      <div style={{display:"flex",gap:"12px",marginBottom:"18px",flexWrap:"wrap"}}>
        <Tabs tabs={tabs} active={filter} onChange={setFilter} />
        <div style={{flex:1,minWidth:"180px"}}><Search value={search} onChange={setSearch} placeholder="Cerca cliente..." /></div>
      </div>

      {!filtered.length
        ? <Empty icon="📭" title="Nessun follow-up" desc="Non ci sono follow-up per questo filtro." />
        : <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            {filtered.map((fu,i)=>{
              const cl=data.clients.find(c=>c.id===fu.clientId);
              const ph=PHASES[fu.phase];
              const st=STATUSES[fu.status];
              const timing=fu.status==="pending"?daysUntil(fu.scheduledDate):daysAgo(fu.sentDate);
              return (
                <Card key={fu.id} hov onClick={()=>setSel(fu)} style={{padding:"13px 16px",animation:`fadeIn .3s ease ${i*.03}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <span style={{fontSize:"18px",width:"26px",textAlign:"center",flexShrink:0}}>{ph.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"3px",flexWrap:"wrap"}}>
                        <span style={{fontWeight:600,fontSize:"13px"}}>{cl?.name||"—"}</span>
                        <Badge {...ph} s />
                        <Badge {...st} s />
                      </div>
                      <div style={{fontSize:"12px",color:T.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fu.message}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"5px",flexShrink:0}}>
                      <span style={{fontSize:"11px",color:T.textMu}}>{timing}</span>
                      {fu.status==="pending"&&(
                        <Btn v="success" s="sm" onClick={e=>{e.stopPropagation();markSent(fu)}}>✓ Inviato</Btn>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
      }

      <Modal open={!!sel} onClose={()=>setSel(null)} title="Dettaglio Follow-Up" w="580px">
        {sel&&(()=>{
          const cl=data.clients.find(c=>c.id===sel.clientId);
          const ph=PHASES[sel.phase];
          const st=STATUSES[sel.status];
          return (
            <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
              <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
                <Badge {...ph} /><Badge {...st} />
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:"16px"}}>{cl?.name}</div>
                <div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{cl?.phone} · {cl?.channel}</div>
              </div>
              <div style={{padding:"14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"14px",lineHeight:1.7,whiteSpace:"pre-wrap",color:T.text}}>{sel.message}</div>
              <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
                <SendButtons message={sel.message} clientPhone={cl?.phone||""} />
                {sel.status==="pending"&&(
                  <Btn v="success" onClick={()=>{markSent(sel);setSel(null)}}>✓ Segna inviato</Btn>
                )}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",paddingTop:"14px",borderTop:`1px solid ${T.border}`}}>
                <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Programmato</span><div style={{fontSize:"13px",marginTop:"3px"}}>{fmtDate(sel.scheduledDate)}</div></div>
                <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Inviato</span><div style={{fontSize:"13px",marginTop:"3px"}}>{sel.sentDate?fmtDate(sel.sentDate):"—"}</div></div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ── CLIENTI ────────────────────────────────────────────────────────────────
const Clients = () => {
  const {data,addRecord,update,deleteRecord}=useSliss();
  const [search,setSearch]=useState("");
  const [sf,setSf]=useState("all");
  const [sel,setSel]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [editMode,setEditMode]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",email:"",channel:"WhatsApp",notes:""});
  const [editForm,setEditForm]=useState(null);

  const tabs=[
    {id:"all",           label:"Tutti",          count:data.clients.length},
    {id:"active",        label:"Attivi",          count:data.clients.filter(c=>c.status==="active").length},
    {id:"vip",           label:"VIP",             count:data.clients.filter(c=>c.status==="vip").length},
    {id:"to_reactivate", label:"Da riattivare",   count:data.clients.filter(c=>c.status==="to_reactivate").length},
  ];

  const filtered=data.clients.filter(c=>{
    const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase());
    const mf=sf==="all"||c.status===sf;
    return ms&&mf;
  });

  const handleAdd=()=>{
    if(!form.name.trim()) return;
    const td=today();
    addRecord("clients",{...form,id:uid(),status:"new",firstVisit:td,lastVisit:td,consent:true,created:td});
    setForm({name:"",phone:"",email:"",channel:"WhatsApp",notes:""});
    setShowNew(false);
  };

  const handleEdit=()=>{
    if(!editForm?.name?.trim()) return;
    update("clients",sel.id,editForm);
    setSel({...sel,...editForm});
    setEditMode(false);
  };

  const handleDelete=(id)=>{
    if(window.confirm("Sei sicuro di voler eliminare questo cliente? Tutti i suoi follow-up rimarranno nello storico.")) {
      deleteRecord("clients",id);
      setSel(null);
    }
  };

  const openClient=(cl)=>{ setSel(cl); setEditForm({name:cl.name,phone:cl.phone,email:cl.email,channel:cl.channel,notes:cl.notes,status:cl.status}); setEditMode(false); };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
        <h1 style={{fontSize:"22px",fontWeight:700}}>Clienti</h1>
        <Btn onClick={()=>setShowNew(true)}>+ Nuovo cliente</Btn>
      </div>
      <div style={{display:"flex",gap:"12px",marginBottom:"16px",flexWrap:"wrap"}}>
        <Tabs tabs={tabs} active={sf} onChange={setSf} />
        <div style={{flex:1,minWidth:"180px"}}><Search value={search} onChange={setSearch} placeholder="Cerca nome o email..." /></div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"7px 16px",fontSize:"11px",fontWeight:600,color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>
          <span>Nome</span><span>Canale</span><span>Ultima visita</span><span>Stato</span>
        </div>
        {filtered.map((cl,i)=>{
          const st=CLIENT_ST[cl.status];
          return (
            <Card key={cl.id} hov onClick={()=>openClient(cl)} style={{padding:"11px 16px",animation:`fadeIn .3s ease ${i*.03}s both`}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:"13px"}}>{cl.name}</div>
                  <div style={{fontSize:"11px",color:T.textD}}>{cl.email}</div>
                </div>
                <span style={{fontSize:"12px",color:T.textM}}>{cl.channel}</span>
                <span style={{fontSize:"12px",color:T.textM}}>{fmtDate(cl.lastVisit)}</span>
                <Badge {...st} s />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Nuovo cliente */}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo cliente">
        <FormField label="Nome completo"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Nome Cognome" /></FormField>
        <FormField label="Telefono"><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" /></FormField>
        <FormField label="Email"><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@esempio.com" /></FormField>
        <FormField label="Canale preferito">
          <select value={form.channel} onChange={e=>setForm(p=>({...p,channel:e.target.value}))}>
            <option>WhatsApp</option><option>SMS</option><option>Email</option>
          </select>
        </FormField>
        <FormField label="Note"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Preferenze, info utili..." /></FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
          <Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn>
          <Btn onClick={handleAdd} disabled={!form.name.trim()}>Salva cliente</Btn>
        </div>
      </Modal>

      {/* Scheda cliente */}
      <Modal open={!!sel} onClose={()=>{setSel(null);setEditMode(false);}} title="Scheda Cliente" w="620px">
        {sel&&editForm&&(()=>{
          const st=CLIENT_ST[sel.status];
          const fus=data.followUps.filter(f=>f.clientId===sel.id).sort((a,b)=>new Date(b.scheduledDate)-new Date(a.scheduledDate));
          return (
            <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
              {!editMode ? (
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:"17px",fontWeight:700,marginBottom:"3px"}}>{sel.name}</div>
                      <div style={{fontSize:"13px",color:T.textD}}>{sel.phone}{sel.email&&` · ${sel.email}`}</div>
                    </div>
                    <div style={{display:"flex",gap:"7px",alignItems:"center"}}>
                      <Badge {...st} />
                      <Btn v="secondary" s="sm" onClick={()=>setEditMode(true)}>✏️ Modifica</Btn>
                    </div>
                  </div>
                  {sel.notes&&<div style={{padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,fontSize:"13px",color:T.textM,lineHeight:1.6,border:`1px solid ${T.border}`}}>📝 {sel.notes}</div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
                    <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Prima visita</span><div style={{fontSize:"13px",marginTop:"3px"}}>{fmtDate(sel.firstVisit)}</div></div>
                    <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Ultima visita</span><div style={{fontSize:"13px",marginTop:"3px"}}>{fmtDate(sel.lastVisit)}</div></div>
                    <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Canale</span><div style={{fontSize:"13px",marginTop:"3px"}}>{sel.channel}</div></div>
                  </div>
                  <div>
                    <h4 style={{fontSize:"13px",fontWeight:600,marginBottom:"10px",color:T.textM}}>Storico Follow-Up</h4>
                    {!fus.length
                      ? <div style={{fontSize:"13px",color:T.textD}}>Nessun follow-up registrato.</div>
                      : <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                          {fus.map(fu=>{
                            const ph=PHASES[fu.phase];
                            const ss=STATUSES[fu.status];
                            return (
                              <div key={fu.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 10px",background:T.bg3,borderRadius:T.r.s,border:`1px solid ${T.border}`}}>
                                <span style={{fontSize:"14px"}}>{ph.icon}</span>
                                <div style={{flex:1,display:"flex",gap:"5px",flexWrap:"wrap"}}><Badge {...ph} s /><Badge {...ss} s /></div>
                                <span style={{fontSize:"11px",color:T.textD}}>{fmtDate(fu.scheduledDate)}</span>
                              </div>
                            );
                          })}
                        </div>
                    }
                  </div>
                  <div style={{paddingTop:"12px",borderTop:`1px solid ${T.border}`}}>
                    <Btn v="danger" s="sm" onClick={()=>handleDelete(sel.id)}>🗑️ Elimina cliente</Btn>
                  </div>
                </>
              ) : (
                <>
                  <FormField label="Nome completo"><input value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} /></FormField>
                  <FormField label="Telefono"><input value={editForm.phone} onChange={e=>setEditForm(p=>({...p,phone:e.target.value}))} /></FormField>
                  <FormField label="Email"><input value={editForm.email} onChange={e=>setEditForm(p=>({...p,email:e.target.value}))} /></FormField>
                  <FormField label="Canale preferito">
                    <select value={editForm.channel} onChange={e=>setEditForm(p=>({...p,channel:e.target.value}))}>
                      <option>WhatsApp</option><option>SMS</option><option>Email</option>
                    </select>
                  </FormField>
                  <FormField label="Stato">
                    <select value={editForm.status} onChange={e=>setEditForm(p=>({...p,status:e.target.value}))}>
                      <option value="new">Nuovo</option>
                      <option value="active">Attivo</option>
                      <option value="vip">VIP</option>
                      <option value="to_reactivate">Da riattivare</option>
                      <option value="inactive">Inattivo</option>
                    </select>
                  </FormField>
                  <FormField label="Note"><textarea value={editForm.notes} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} /></FormField>
                  <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
                    <Btn v="secondary" onClick={()=>setEditMode(false)}>Annulla</Btn>
                    <Btn onClick={handleEdit} disabled={!editForm.name?.trim()}>Salva modifiche</Btn>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ── TEMPLATE ───────────────────────────────────────────────────────────────
const Templates = () => {
  const {data,update,addRecord,deleteRecord}=useSliss();
  const [filter,setFilter]=useState("all");
  const [editingId,setEditingId]=useState(null);
  const [editText,setEditText]=useState("");
  const [editName,setEditName]=useState("");
  const [showNew,setShowNew]=useState(false);
  const [newForm,setNewForm]=useState({name:"",phase:"thankyou",channel:"WhatsApp",text:""});

  const phases=[
    {id:"all",label:"Tutti"},
    {id:"thankyou",label:"Ringraziamento"},
    {id:"check",label:"Controllo"},
    {id:"review",label:"Recensione"},
    {id:"reactivation",label:"Riattivazione"},
  ];

  const filtered=data.templates.filter(t=>filter==="all"||t.phase===filter);

  const startEdit=(t)=>{ setEditingId(t.id); setEditText(t.text); setEditName(t.name); };
  const saveEdit=(id)=>{ update("templates",id,{text:editText,name:editName}); setEditingId(null); };
  const handleAdd=()=>{
    if(!newForm.name.trim()||!newForm.text.trim()) return;
    addRecord("templates",{...newForm,id:uid(),code:`C${uid().slice(0,4).toUpperCase()}`,active:true});
    setNewForm({name:"",phase:"thankyou",channel:"WhatsApp",text:""});
    setShowNew(false);
  };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
        <h1 style={{fontSize:"22px",fontWeight:700}}>Template</h1>
        <Btn onClick={()=>setShowNew(true)}>+ Nuovo template</Btn>
      </div>
      <div style={{marginBottom:"18px"}}>
        <Tabs tabs={phases.map(p=>({...p,count:p.id==="all"?data.templates.length:data.templates.filter(t=>t.phase===p.id).length}))} active={filter} onChange={setFilter} />
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        {filtered.map((tmpl,i)=>{
          const ph=PHASES[tmpl.phase];
          const isEditing=editingId===tmpl.id;
          return (
            <Card key={tmpl.id} style={{animation:`fadeIn .3s ease ${i*.04}s both`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
                  <span style={{fontSize:"16px"}}>{ph.icon}</span>
                  {isEditing
                    ? <input value={editName} onChange={e=>setEditName(e.target.value)} style={{fontSize:"14px",fontWeight:600,padding:"4px 8px",width:"220px"}} />
                    : <div><div style={{fontWeight:600,fontSize:"14px"}}>{tmpl.name}</div><div style={{fontSize:"11px",color:T.textD,marginTop:"1px"}}>{tmpl.code} · {tmpl.channel}</div></div>
                  }
                </div>
                <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
                  <Badge {...ph} s />
                  {isEditing
                    ? <><Btn v="success" s="sm" onClick={()=>saveEdit(tmpl.id)}>✓ Salva</Btn><Btn v="ghost" s="sm" onClick={()=>setEditingId(null)}>✕</Btn></>
                    : <><Btn v="ghost" s="sm" onClick={()=>startEdit(tmpl)}>✏️</Btn><Btn v="danger" s="sm" onClick={()=>{ if(window.confirm("Eliminare questo template?")) deleteRecord("templates",tmpl.id); }}>🗑️</Btn></>
                  }
                </div>
              </div>
              {isEditing
                ? <textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{minHeight:"90px",fontSize:"13px",lineHeight:1.7}} />
                : <div style={{padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"13px",lineHeight:1.7,color:T.textM,whiteSpace:"pre-wrap"}}>{tmpl.text}</div>
              }
              {!isEditing&&(
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:"10px"}}>
                  <button onClick={()=>{navigator.clipboard.writeText(tmpl.text);}}
                    style={{background:"none",border:`1px solid ${T.border}`,color:T.textD,borderRadius:T.r.m,padding:"5px 12px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>
                    📋 Copia
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo template">
        <FormField label="Nome template"><input value={newForm.name} onChange={e=>setNewForm(p=>({...p,name:e.target.value}))} placeholder="Es. Ringraziamento personalizzato" /></FormField>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
          <FormField label="Fase">
            <select value={newForm.phase} onChange={e=>setNewForm(p=>({...p,phase:e.target.value}))}>
              <option value="thankyou">Ringraziamento</option>
              <option value="check">Controllo</option>
              <option value="review">Recensione</option>
              <option value="reactivation">Riattivazione</option>
            </select>
          </FormField>
          <FormField label="Canale">
            <select value={newForm.channel} onChange={e=>setNewForm(p=>({...p,channel:e.target.value}))}>
              <option>WhatsApp</option><option>SMS</option><option>Email</option>
            </select>
          </FormField>
        </div>
        <FormField label="Testo" hint="Usa [Nome] come segnaposto per il nome del cliente.">
          <textarea value={newForm.text} onChange={e=>setNewForm(p=>({...p,text:e.target.value}))} placeholder="Ciao [Nome]! ..." style={{minHeight:"100px"}} />
        </FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
          <Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn>
          <Btn onClick={handleAdd} disabled={!newForm.name.trim()||!newForm.text.trim()}>Salva template</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ── FEEDBACK ───────────────────────────────────────────────────────────────
const Feedback = () => {
  const {data}=useSliss();
  const reviewLink=data.settings?.reviewLink||"";

  // Clienti che non hanno ancora dato feedback
  const clientsWithFeedback=new Set(data.feedbacks.map(f=>f.clientId));
  const clientsWithoutFeedback=data.clients.filter(c=>!clientsWithFeedback.has(c.id)&&(c.status==="active"||c.status==="vip"||c.status==="new"));

  const avgR=data.feedbacks.length?(data.feedbacks.reduce((a,f)=>a+f.rating,0)/data.feedbacks.length).toFixed(1):"—";
  const rec=data.feedbacks.filter(f=>f.wouldRecommend).length;

  const reviewMsg=(name)=>`Ciao ${name}! Spero che tu sia rimasto/a soddisfatto/a 🙏 Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. ${reviewLink}`.trim();

  const sendToAll=()=>{
    if(!clientsWithoutFeedback.length) return;
    const names=clientsWithoutFeedback.map(c=>c.name).join(", ");
    alert(`Richiesta da inviare a: ${names}\n\nCopia il messaggio dal tasto "Copia" di ogni cliente.`);
  };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
        <h1 style={{fontSize:"22px",fontWeight:700}}>Feedback</h1>
      </div>

      {/* Metriche */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"24px"}}>
        {[
          {label:"Media voto",       value:avgR,              color:T.purple, sub:"su 5 stelle"},
          {label:"Feedback totali",  value:data.feedbacks.length, color:T.blue, sub:"ricevuti"},
          {label:"Consigliano",      value:rec,               color:T.green,  sub:`su ${data.feedbacks.length}`},
        ].map((s,i)=>(
          <Card key={i} style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            <span style={{fontSize:"12px",color:T.textD,fontWeight:500}}>{s.label}</span>
            <span style={{fontSize:"28px",fontWeight:700,color:s.color,letterSpacing:"-.02em",lineHeight:1}}>{s.value}</span>
            <span style={{fontSize:"11px",color:T.textMu}}>{s.sub}</span>
          </Card>
        ))}
      </div>

      {/* Richiedi recensione */}
      {clientsWithoutFeedback.length>0&&(
        <Card style={{marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <div>
              <h2 style={{fontSize:"14px",fontWeight:700}}>Richiedi recensione</h2>
              <div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{clientsWithoutFeedback.length} clienti non hanno ancora lasciato una recensione</div>
            </div>
            <Btn v="secondary" s="sm" onClick={sendToAll}>📤 Invia a tutti</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
            {clientsWithoutFeedback.map(cl=>(
              <div key={cl.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:"13px"}}>{cl.name}</div>
                  <div style={{fontSize:"11px",color:T.textD}}>{cl.channel} · ultima visita {daysAgo(cl.lastVisit)}</div>
                </div>
                <SendButtons message={reviewMsg(cl.name)} clientPhone={cl.phone} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Feedback ricevuti */}
      <h2 style={{fontSize:"14px",fontWeight:700,marginBottom:"12px",color:T.textM}}>Feedback ricevuti</h2>
      {!data.feedbacks.length
        ? <Empty icon="⭐" title="Nessun feedback" desc="I feedback appariranno qui quando i clienti risponderanno." />
        : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {data.feedbacks.map((fb,i)=>{
              const cl=data.clients.find(c=>c.id===fb.clientId);
              return (
                <Card key={fb.id} style={{animation:`fadeIn .3s ease ${i*.05}s both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:"14px",marginBottom:"5px"}}>{cl?.name||"—"}</div>
                      <div style={{fontSize:"16px",marginBottom:"7px"}}>{"⭐".repeat(fb.rating)}{"☆".repeat(5-fb.rating)}</div>
                      {fb.comment&&<div style={{fontSize:"13px",color:T.textM,lineHeight:1.6,fontStyle:"italic"}}>"{fb.comment}"</div>}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:"11px",color:T.textD,marginBottom:"5px"}}>{fmtDate(fb.date)}</div>
                      {fb.wouldRecommend&&<Badge label="Consiglierebbe" color={T.green} bg={T.greenS} s />}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
      }
    </div>
  );
};

// ── MODULI ─────────────────────────────────────────────────────────────────
const ModulesMap = () => {
  const stL={active:"Attivo",planned:"In arrivo",future:"Futuro"};
  const stS={active:{color:T.green,bg:T.greenS},planned:{color:T.amber,bg:T.amberS},future:{color:T.textD,bg:"rgba(90,111,148,0.08)"}};

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:"24px"}}>
        <h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"5px"}}>Moduli</h1>
        <p style={{color:T.textD,fontSize:"13px"}}>Ogni modulo si attiva quando c'è una richiesta reale dai clienti.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"10px"}}>
        {MODULES.map((mod,i)=>{
          const ss=stS[mod.status];
          const isActive=mod.status==="active";
          return (
            <div key={mod.id} style={{background:T.bg2,border:`1px solid ${isActive?`${mod.color}35`:T.border}`,borderRadius:T.r.l,padding:"16px",animation:`fadeIn .3s ease ${i*.04}s both`,transition:"border-color .2s"}}>
              <div style={{width:"36px",height:"36px",borderRadius:T.r.m,background:`${mod.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px",marginBottom:"10px"}}>{mod.icon}</div>
              <div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{mod.name}</div>
              <div style={{fontSize:"11px",color:T.textD,lineHeight:1.5,marginBottom:"10px"}}>{mod.desc}</div>
              <Badge label={stL[mod.status]} {...ss} s />
              {isActive&&<div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"8px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}} /><span style={{fontSize:"11px",color:T.green,fontWeight:600}}>Attivo</span></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── IMPOSTAZIONI ───────────────────────────────────────────────────────────
const Settings = () => {
  const {data,updateSettings,resetData}=useSliss();
  const s=data.settings||{};
  const [bName,setBName]=useState(s.businessName||"");
  const [reviewLink,setReviewLink]=useState(s.reviewLink||"");
  const [timings,setTimings]=useState(s.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60});
  const [saved,setSaved]=useState(false);

  const handleSave=()=>{
    updateSettings({businessName:bName,reviewLink,followUpTimings:timings});
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"22px"}}>Impostazioni</h1>

      <Card style={{maxWidth:"540px",marginBottom:"14px"}}>
        <h3 style={{fontSize:"14px",fontWeight:700,marginBottom:"16px"}}>Attività</h3>
        <FormField label="Nome attività" hint="Appare nel saluto della Home"><input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" /></FormField>
        <FormField label="Link recensione Google" hint="Viene aggiunto ai messaggi di richiesta recensione"><input value={reviewLink} onChange={e=>setReviewLink(e.target.value)} placeholder="https://g.page/r/..." /></FormField>
      </Card>

      <Card style={{maxWidth:"540px",marginBottom:"14px"}}>
        <h3 style={{fontSize:"14px",fontWeight:700,marginBottom:"4px"}}>Timing follow-up</h3>
        <p style={{fontSize:"12px",color:T.textD,marginBottom:"16px"}}>Giorni dopo l'appuntamento prima di inviare ogni fase.</p>
        {[
          {key:"thankyou",    label:"Ringraziamento", note:"Di solito giorno stesso"},
          {key:"check",       label:"Controllo",       note:"Di solito 7 giorni"},
          {key:"review",      label:"Recensione",      note:"Di solito 21 giorni"},
          {key:"reactivation",label:"Riattivazione",   note:"Di solito 60 giorni"},
        ].map(({key,label,note})=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"12px"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:"13px",fontWeight:500}}>{label}</div>
              <div style={{fontSize:"11px",color:T.textMu}}>{note}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <input type="number" min="0" max="365" value={timings[key]}
                onChange={e=>setTimings(p=>({...p,[key]:parseInt(e.target.value)||0}))}
                style={{width:"65px",textAlign:"center",padding:"7px 10px"}} />
              <span style={{fontSize:"12px",color:T.textD}}>giorni</span>
            </div>
          </div>
        ))}
      </Card>

      <Card style={{maxWidth:"540px",marginBottom:"20px"}}>
        <h3 style={{fontSize:"14px",fontWeight:700,marginBottom:"10px"}}>Dati e storage</h3>
        <p style={{fontSize:"12px",color:T.textD,lineHeight:1.7,marginBottom:"14px"}}>I dati sono salvati nel browser. In futuro sarà disponibile il salvataggio cloud con Supabase.</p>
        <Btn v="danger" s="sm" onClick={()=>{ if(window.confirm("Sei sicuro? Tutti i dati verranno ripristinati con i dati di esempio.")) resetData(); }}>🗑️ Reset dati di esempio</Btn>
      </Card>

      <div style={{maxWidth:"540px"}}>
        <Btn onClick={handleSave}>{saved?"✓ Salvato!":"Salva impostazioni"}</Btn>
      </div>
    </div>
  );
};

// ── APPUNTAMENTI ───────────────────────────────────────────────────────────
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const buildFollowUps = (appointmentId, clientId, clientName, appointmentDate, serviceType, timings, templates) => {
  const phases = ["thankyou","check","review","reactivation"];
  const timingMap = { thankyou: timings.thankyou||0, check: timings.check||7, review: timings.review||21, reactivation: timings.reactivation||60 };

  // Scegli template di default per fase
  const defaultMsg = {
    thankyou: serviceType==="Ritocco"
      ? `Ciao ${clientName}! Grazie per il ritocco di oggi 🙏 Spero che il risultato ti piaccia. Scrivimi per qualsiasi cosa.`
      : `Ciao ${clientName}! Grazie per oggi 🖤 È stato un piacere. Ricordati pellicola e sapone neutro per i primi giorni. Scrivimi se hai dubbi.`,
    check: `Ciao ${clientName}! Come sta andando la cicatrizzazione? È normale che desquami un po'. Se hai dubbi mandami una foto 🙏`,
    review: `Ciao ${clientName}! Sono passate un po' di settimane — spero che il tatuaggio stia guarendo bene ✨ Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo.`,
    reactivation: `Ciao ${clientName}! Pensavo a te — come stai? Se hai in mente qualcosa di nuovo, sono qui 🖤 Buona giornata!`,
  };

  return phases.map(phase => ({
    id: uid(),
    appointmentId,
    clientId,
    phase,
    status: "pending",
    scheduledDate: addDays(appointmentDate, timingMap[phase]),
    sentDate: null,
    satisfaction: null,
    message: defaultMsg[phase],
  }));
};

const Appointments = () => {
  const {data, addRecord, deleteRecord} = useSliss();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ clientId:"", date: today(), serviceType:"Sessione", notes:"" });
  const [done, setDone] = useState(false);

  const SERVICE_TYPES = ["Sessione","Ritocco","Prima consulenza","Sessione lunga","Consulenza gratuita"];

  const sorted = [...data.appointments].sort((a,b) => new Date(b.date) - new Date(a.date));

  const handleAdd = () => {
    if(!form.clientId || !form.date) return;
    const client = data.clients.find(c=>c.id===form.clientId);
    if(!client) return;

    const apptId = uid();
    const timings = data.settings?.followUpTimings || {thankyou:0,check:7,review:21,reactivation:60};

    // Crea appuntamento
    addRecord("appointments", {
      id: apptId,
      clientId: form.clientId,
      date: form.date,
      serviceType: form.serviceType,
      notes: form.notes,
      followUpTriggered: true,
      created: today(),
    });

    // Genera follow-up automaticamente
    const fus = buildFollowUps(apptId, form.clientId, client.name, form.date, form.serviceType, timings, data.templates);
    fus.forEach(fu => addRecord("followUps", fu));

    // Aggiorna lastVisit del cliente
    addRecord; // già nel context

    setDone(true);
    setTimeout(() => {
      setDone(false);
      setShowNew(false);
      setForm({clientId:"", date:today(), serviceType:"Sessione", notes:""});
    }, 1800);
  };

  const handleDelete = (appt) => {
    if(!window.confirm(`Eliminare l'appuntamento di ${data.clients.find(c=>c.id===appt.clientId)?.name||"questo cliente"}? Anche i follow-up collegati verranno rimossi.`)) return;
    deleteRecord("appointments", appt.id);
    // Rimuovi follow-up collegati
    data.followUps.filter(f=>f.appointmentId===appt.id).forEach(f=>deleteRecord("followUps",f.id));
  };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
        <div>
          <h1 style={{fontSize:"22px",fontWeight:700}}>Appuntamenti</h1>
          <p style={{fontSize:"13px",color:T.textD,marginTop:"3px"}}>Aggiungi un appuntamento → i 4 follow-up si generano automaticamente</p>
        </div>
        <Btn onClick={()=>setShowNew(true)}>+ Nuovo appuntamento</Btn>
      </div>

      {!sorted.length
        ? <Empty icon="📅" title="Nessun appuntamento" desc="Aggiungi il primo appuntamento per generare i follow-up automaticamente." />
        : <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 80px",padding:"7px 16px",fontSize:"11px",fontWeight:600,color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>
              <span>Cliente</span><span>Data</span><span>Servizio</span><span></span>
            </div>
            {sorted.map((appt,i) => {
              const cl = data.clients.find(c=>c.id===appt.clientId);
              const fus = data.followUps.filter(f=>f.appointmentId===appt.id);
              const pendingCount = fus.filter(f=>f.status==="pending").length;
              const doneCount = fus.filter(f=>f.status==="sent"||f.status==="replied"||f.status==="completed").length;
              return (
                <Card key={appt.id} style={{padding:"12px 16px",animation:`fadeIn .3s ease ${i*.03}s both`}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 80px",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:"13px"}}>{cl?.name||"—"}</div>
                      <div style={{fontSize:"11px",color:T.textD,marginTop:"2px",display:"flex",gap:"8px"}}>
                        <span>{pendingCount} in attesa</span>
                        <span>·</span>
                        <span>{doneCount} inviati</span>
                      </div>
                    </div>
                    <span style={{fontSize:"13px",color:T.textM}}>{fmtDate(appt.date)}</span>
                    <span style={{fontSize:"13px",color:T.textM}}>{appt.serviceType}</span>
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                      <Btn v="danger" s="sm" onClick={()=>handleDelete(appt)}>🗑️</Btn>
                    </div>
                  </div>
                  {/* Mini-timeline follow-up */}
                  {fus.length>0&&(
                    <div style={{display:"flex",gap:"6px",marginTop:"10px",paddingTop:"10px",borderTop:`1px solid ${T.border}`}}>
                      {["thankyou","check","review","reactivation"].map(phase=>{
                        const fu=fus.find(f=>f.phase===phase);
                        const ph=PHASES[phase];
                        const col=!fu?"rgba(90,111,148,0.15)":fu.status==="pending"?T.amberS:fu.status==="sent"||fu.status==="replied"?T.greenS:T.blueS;
                        const textCol=!fu?T.textMu:fu.status==="pending"?T.amber:fu.status==="sent"||fu.status==="replied"?T.green:T.blue;
                        return (
                          <div key={phase} style={{flex:1,padding:"5px 8px",background:col,borderRadius:T.r.s,textAlign:"center"}}>
                            <div style={{fontSize:"14px"}}>{ph.icon}</div>
                            <div style={{fontSize:"10px",color:textCol,fontWeight:600,marginTop:"2px"}}>{fu?daysUntil(fu.scheduledDate):"—"}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
      }

      <Modal open={showNew} onClose={()=>{setShowNew(false);setDone(false);}} title="Nuovo appuntamento" w="480px">
        {done
          ? <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:"36px",marginBottom:"12px"}}>✅</div>
              <div style={{fontWeight:700,fontSize:"16px",marginBottom:"6px"}}>Appuntamento salvato</div>
              <div style={{fontSize:"13px",color:T.textD}}>4 follow-up generati automaticamente</div>
            </div>
          : <>
              <FormField label="Cliente">
                <select value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))}>
                  <option value="">Seleziona cliente...</option>
                  {data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Data appuntamento" hint="I follow-up si calcolano a partire da questa data">
                <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} />
              </FormField>
              <FormField label="Tipo servizio">
                <select value={form.serviceType} onChange={e=>setForm(p=>({...p,serviceType:e.target.value}))}>
                  {SERVICE_TYPES.map(s=><option key={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Note (opzionale)">
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Zona del tatuaggio, dettagli utili..." style={{minHeight:"60px"}} />
              </FormField>
              {form.clientId&&form.date&&(
                <div style={{padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,marginBottom:"16px",fontSize:"12px",color:T.textD}}>
                  <div style={{fontWeight:600,color:T.textM,marginBottom:"5px"}}>Follow-up che verranno generati:</div>
                  {[
                    {label:"🙏 Ringraziamento", days: data.settings?.followUpTimings?.thankyou||0},
                    {label:"🔍 Controllo",       days: data.settings?.followUpTimings?.check||7},
                    {label:"⭐ Recensione",       days: data.settings?.followUpTimings?.review||21},
                    {label:"💬 Riattivazione",    days: data.settings?.followUpTimings?.reactivation||60},
                  ].map(({label,days})=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}>
                      <span>{label}</span>
                      <span style={{color:T.blue}}>{fmtDate(addDays(form.date,days))}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
                <Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn>
                <Btn onClick={handleAdd} disabled={!form.clientId||!form.date}>Salva e genera follow-up</Btn>
              </div>
            </>
        }
      </Modal>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function SlissPlatform() {
  const [view,setView]=useState("home");
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ loadData().then(d=>{setData(d);setLoading(false)}); },[]);
  useEffect(()=>{ if(data&&!loading) saveData(data); },[data,loading]);

  const update=useCallback((table,id,updates)=>{
    setData(prev=>{ if(!prev) return prev; return {...prev,[table]:prev[table].map(r=>r.id===id?{...r,...updates}:r)}; });
  },[]);
  const addRecord=useCallback((table,record)=>{
    setData(prev=>{ if(!prev) return prev; return {...prev,[table]:[...prev[table],record]}; });
  },[]);
  const deleteRecord=useCallback((table,id)=>{
    setData(prev=>{ if(!prev) return prev; return {...prev,[table]:prev[table].filter(r=>r.id!==id)}; });
  },[]);
  const updateSettings=useCallback((updates)=>{
    setData(prev=>{ if(!prev) return prev; return {...prev,settings:{...prev.settings,...updates}}; });
  },[]);
  const resetData=useCallback(()=>{ const d=defaultData(); setData(d); saveData(d); },[]);

  if(loading||!data) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:T.bg}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:"44px",height:"44px",borderRadius:T.r.l,background:T.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontWeight:800,color:"#fff",margin:"0 auto 14px",animation:"pulse 1.5s infinite"}}>S</div>
        <div style={{color:T.textD,fontSize:"13px"}}>Caricamento...</div>
      </div>
    </div>
  );

  const ctx={data,update,addRecord,deleteRecord,updateSettings,resetData};
  const views={home:Home,appointments:Appointments,followup:FollowUp,clients:Clients,templates:Templates,feedback:Feedback,modules:ModulesMap,settings:Settings};
  const V=views[view]||Home;

  return (
    <Ctx.Provider value={ctx}>
      <GlobalCSS />
      <div style={{display:"flex",minHeight:"100vh"}}>
        <Sidebar view={view} setView={setView} />
        <main style={{flex:1,marginLeft:"200px",padding:"28px 36px",maxWidth:"1040px"}}>
          <V />
        </main>
      </div>
    </Ctx.Provider>
  );
}
