import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SLISS PLATFORM v4.0 — Mobile-First · Bottom Nav · Onboarding
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  // Light mode — massima leggibilità al sole
  bg:  "#F8F9FA",  // sfondo pagina — grigio ghiaccio
  bg2: "#FFFFFF",  // card principale — bianco
  bg3: "#F1F3F5",  // card interna / input
  bg4: "#E9ECEF",  // hover stati
  border:  "#DEE2E6", borderH: "#ADB5BD",
  // Testi — alto contrasto
  text:  "#111318",  // primario quasi nero
  textM: "#495057",  // secondario grigio scuro
  textD: "#868E96",  // disabilitato grigio medio
  textMu:"#ADB5BD",  // molto attenuato
  // Accent principale — verde Sliss scuro su sfondo chiaro
  green:  "#16A34A", greenH: "#15803D",
  greenS: "rgba(22,163,74,0.10)", greenG: "rgba(22,163,74,0.18)",
  // Colori semantici — saturi per leggibilità su sfondo chiaro
  blue:   "#2563EB", blueH: "#1D4ED8", blueS: "rgba(37,99,235,0.10)",
  amber:  "#D97706", amberS: "rgba(217,119,6,0.10)",
  red:    "#DC2626", redS:   "rgba(220,38,38,0.10)",
  purple: "#7C3AED", purpleS:"rgba(124,58,237,0.10)",
  teal:   "#0D9488", tealS:  "rgba(13,148,136,0.10)",
  r: { s: "6px", m: "10px", l: "14px", xl: "20px", full: "9999px" },
};

// ── Logo SVG Sliss ──────────────────────────────────────────────────────────
const SlissLogo = ({size=28}) => {
  const h = size;
  const w = size * 3.4;
  return (
    <svg width={w} height={h} viewBox="0 0 170 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sliss-inner" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0FBE7A" floodOpacity="0.4"/>
        </filter>
      </defs>
      {/* Sfondo contorno verde arrotondato */}
      <rect x="2" y="2" width="166" height="46" rx="14" ry="14"
        fill="none" stroke="#22C55E" strokeWidth="4"/>
      {/* Testo Sliss — bianco dentro il contorno */}
      <text
        x="85" y="36"
        textAnchor="middle"
        fontFamily="'DM Sans',sans-serif"
        fontWeight="800"
        fontSize="34"
        letterSpacing="-1"
        fill="#111318"
      >Sliss</text>
    </svg>
  );
};

const GlobalCSS = () => <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *{font-family:'DM Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body,#root{background:#F8F9FA;color:#111318;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#DEE2E6;border-radius:3px}
  input,textarea,select{font-family:inherit;background:#FFFFFF;border:1.5px solid #DEE2E6;color:#111318;border-radius:10px;padding:12px 14px;font-size:15px;outline:none;transition:border-color .2s;width:100%}
  input:focus,textarea:focus,select:focus{border-color:#16A34A;box-shadow:0 0 0 3px rgba(22,163,74,0.12)}
  textarea{resize:vertical;min-height:80px;line-height:1.6}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23495057' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}
  button{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
  a{-webkit-tap-highlight-color:transparent}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @media(max-width:768px){
    .desktop-only{display:none!important}
  }
  @media(min-width:769px){
    .mobile-only{display:none!important}
  }
`}</style>;

// ── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "sliss-v4";
const ONBOARDING_KEY = "sliss-onboarded";

const emptyData = () => ({
  clients: [],
  appointments: [],
  followUps: [],
  templates: [
    { id: "t1", name: "Ringraziamento base", code: "R1", phase: "thankyou", channel: "WhatsApp", text: "Ciao [Nome]! Grazie per oggi 🙏 È stato un piacere. Se hai dubbi scrivimi. A presto!", active: true },
    { id: "t2", name: "Ringraziamento tatuaggio", code: "R2", phase: "thankyou", channel: "WhatsApp", text: "Ciao [Nome]! Grazie per la sessione di oggi 🖤 Ricordati pellicola e sapone neutro. Scrivimi per qualsiasi cosa.", active: true },
    { id: "t3", name: "Controllo guarigione", code: "C1", phase: "check", channel: "WhatsApp", text: "Ciao [Nome]! Come sta andando la cicatrizzazione? È normale che desquami un po'. Se hai dubbi mandami una foto 🙏", active: true },
    { id: "t4", name: "Richiesta recensione", code: "RC1", phase: "review", channel: "WhatsApp", text: "Ciao [Nome]! Sono passate un po' di settimane — spero stia guarendo bene ✨ Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo.", active: true },
    { id: "t5", name: "Riattivazione naturale", code: "RI1", phase: "reactivation", channel: "WhatsApp", text: "Ciao [Nome]! Pensavo a te — come stai? Se hai in mente qualcosa di nuovo, sono qui 🖤 Buona giornata!", active: true },
  ],
  feedbacks: [],
  orders: [],
  settings: {
    businessName: "",
    reviewLink: "",
    bizType: "",
    followUpTimings: { thankyou: 0, check: 7, review: 21, reactivation: 60 },
  },
});

const loadData = async () => {
  try { const r = await window.storage.get(STORAGE_KEY); return r ? JSON.parse(r.value) : emptyData(); }
  catch { return emptyData(); }
};
const saveData = async (data) => {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch(e) { console.error(e); }
};
const isOnboarded = async () => {
  try { const r = await window.storage.get(ONBOARDING_KEY); return !!r; } catch { return false; }
};
const setOnboarded = async () => {
  try { await window.storage.set(ONBOARDING_KEY, "1"); } catch(e) {}
};

// ── Context ──────────────────────────────────────────────────────────────────
const Ctx = createContext(null);
const useSliss = () => useContext(Ctx);

// ── Config ───────────────────────────────────────────────────────────────────
const PHASES = {
  thankyou:    { label: "Ringraziamento", color: T.blue,   icon: "🙏", bg: T.blueS },
  check:       { label: "Controllo",      color: T.amber,  icon: "🔍", bg: T.amberS },
  review:      { label: "Recensione",     color: T.purple, icon: "⭐", bg: T.purpleS },
  reactivation:{ label: "Riattivazione",  color: T.green,  icon: "💬", bg: T.greenS },
};
const PRODUCT_PHASES = {
  order_confirm: { label: "Conferma ordine", color: T.blue,   icon: "📋", bg: T.blueS },
  shipping:      { label: "In spedizione",   color: T.amber,  icon: "📦", bg: T.amberS },
  delivery_check:{ label: "Ricezione",       color: T.teal,   icon: "✅", bg: T.tealS },
  review:        { label: "Recensione",      color: T.purple, icon: "⭐", bg: T.purpleS },
  reorder:       { label: "Riordino",        color: T.green,  icon: "🔄", bg: T.greenS },
};

const STATUSES = {
  pending:   { label: "In attesa",  color: T.amber,  bg: T.amberS },
  sent:      { label: "Inviato",    color: T.blue,   bg: T.blueS },
  replied:   { label: "Risposto",   color: T.green,  bg: T.greenS },
  completed: { label: "Completato", color: T.textD,  bg: "rgba(90,111,148,0.10)" },
  skipped:   { label: "Saltato",    color: T.textMu, bg: "rgba(61,81,120,0.08)" },
};
const CLIENT_ST = {
  new:           { label: "Nuovo",         color: T.blue,   bg: T.blueS },
  active:        { label: "Attivo",        color: T.green,  bg: T.greenS },
  vip:           { label: "VIP",           color: T.purple, bg: T.purpleS },
  to_reactivate: { label: "Da riattivare", color: T.amber,  bg: T.amberS },
  inactive:      { label: "Inattivo",      color: T.textD,  bg: "rgba(90,111,148,0.10)" },
};
const CLUSTERS_SERVIZI = {
  tattoo:    { label: "Tatuaggi / PMU",        icon: "🖤", color: T.purple },
  barber:    { label: "Barber / Parrucchiere", icon: "💈", color: T.blue },
  beauty:    { label: "Estetiste / Beauty",    icon: "✨", color: T.teal },
  officine:  { label: "Officine",              icon: "🔧", color: T.green },
  artigiani: { label: "Artigiani / Edilizia",  icon: "🔨", color: T.amber },
  altro_s:   { label: "Altro",                 icon: "⚡", color: T.textM, custom: true },
};
const CLUSTERS_PRODOTTI = {
  stampa3d:  { label: "Stampa 3D",             icon: "🖨️", color: T.blue },
  negozio:   { label: "Proprietario negozio",  icon: "🏪", color: T.amber },
  altro_p:   { label: "Altro",                 icon: "⚡", color: T.textM, custom: true },
};
// Cluster unificato per compatibilità
const CLUSTERS = {...CLUSTERS_SERVIZI, ...CLUSTERS_PRODOTTI};

// Template per cluster
const CLUSTER_TEMPLATES = {
  tattoo: [
    { id:"t1", name:"Ringraziamento sessione", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per la sessione di oggi 🖤 Ricordati pellicola e sapone neutro per i primi giorni. Scrivimi per qualsiasi cosa.", active:true },
    { id:"t2", name:"Controllo cicatrizzazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Come sta andando la cicatrizzazione? È normale che desquami un po' — se hai dubbi mandami una foto 🙏", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero stia guarendo bene ✨ Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Pensavo a te — hai in mente qualcosa di nuovo? Sono qui 🖤 Buona giornata!", active:true },
  ],
  barber: [
    { id:"t1", name:"Ringraziamento taglio", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie del passaggio oggi 💈 Spero ti piaccia il risultato. Quando vuoi tornare, sai dove trovarmi!", active:true },
    { id:"t2", name:"Controllo soddisfazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Tutto ok con il taglio? Se vuoi una sistemata o vuoi prenotare il prossimo, sono qui 💈", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero ti stia piacendo il risultato 🙏 Se hai un minuto, una recensione su Google mi aiuterebbe tanto. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! È un po' che non ti vedo 💈 Tutto bene? Quando vuoi passare, sono qui!", active:true },
  ],
  beauty: [
    { id:"t1", name:"Ringraziamento trattamento", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per essere passata oggi ✨ Spero ti sia piaciuto il trattamento. Per consigli scrivimi. A presto!", active:true },
    { id:"t2", name:"Controllo risultato", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Come ti stai trovando dopo il trattamento? Tutto ok? Sono qui per qualsiasi domanda 🙏", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero stia ancora piacendoti il risultato ✨ Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Pensavo a te — è un po' che non ci sentiamo ✨ Se hai voglia di un nuovo trattamento, sono qui!", active:true },
  ],
  artigiani: [
    { id:"t1", name:"Ringraziamento lavoro", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per avermi scelto per questo lavoro 🙏 Spero che il risultato ti soddisfi. Per qualsiasi cosa scrivimi.", active:true },
    { id:"t2", name:"Controllo soddisfazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Volevo assicurarmi che tutto sia a posto dopo i lavori. C'è qualcosa che vorresti sistemare?", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero che il lavoro stia reggendo bene 🙏 Se sei soddisfatto, una recensione su Google mi aiuterebbe a trovare nuovi clienti. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Sono passati un po' di mesi — se hai altri lavori in programma, fammi sapere. Sono a disposizione!", active:true },
  ],
  officine: [
    { id:"t1", name:"Ringraziamento servizio", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per essere passato oggi 🔧 Speriamo che tutto proceda alla grande. Per qualsiasi problema siamo qui.", active:true },
    { id:"t2", name:"Controllo post-servizio", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Com'è andata dopo il servizio? Tutto ok con il veicolo? Scrivici per qualsiasi dubbio 🙏", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Speriamo che tutto stia andando bene 🔧 Se sei soddisfatto, una recensione su Google ci aiuterebbe molto. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! È un po' che non ci sentiamo — se hai bisogno di manutenzione o controllo, siamo qui 🔧", active:true },
  ],
  altro: [
    { id:"t1", name:"Ringraziamento base", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per oggi 🙏 È stato un piacere. Se hai dubbi scrivimi. A presto!", active:true },
    { id:"t2", name:"Controllo soddisfazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Volevo solo sapere come stai andando. Tutto ok? Se qualcosa non ti convince al 100%, dimmelo.", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero di averti soddisfatto 🙏 Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Pensavo a te — come stai? Se hai in mente qualcosa, sono qui. Buona giornata!", active:true },
  ],
};

const MODULES = [
  { id: "followup",   name: "Follow-Up",  icon: "💬", color: T.blue,   desc: "Follow-up post-appuntamento", status: "active" },
  { id: "onboarding", name: "Onboarding", icon: "📋", color: T.purple, desc: "Info pre-appuntamento",        status: "planned" },
  { id: "reminders",  name: "Reminder",   icon: "⏰", color: T.amber,  desc: "Riduci i no-show",             status: "planned" },
  { id: "inbound",    name: "Richieste",  icon: "📥", color: T.teal,   desc: "Messaggi in entrata",          status: "planned" },
  { id: "faq",        name: "FAQ",        icon: "📚", color: "#6366F1",desc: "Risposte automatiche",          status: "future" },
  { id: "referral",   name: "Referral",   icon: "🤝", color: T.green,  desc: "Passaparola strutturato",       status: "future" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = d => !d ? "—" : new Date(d).toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"});
const daysAgo = d => { if(!d) return null; const diff=Math.floor((Date.now()-new Date(d))/(864e5)); return diff===0?"Oggi":diff===1?"Ieri":`${diff}g fa`; };
const daysUntil = d => { if(!d) return null; const diff=Math.floor((new Date(d)-Date.now())/(864e5)); if(diff<0) return `${Math.abs(diff)}g fa`; if(diff===0) return "Oggi"; if(diff===1) return "Domani"; return `Tra ${diff}g`; };
const addDays = (dateStr, days) => { const d=new Date(dateStr); d.setDate(d.getDate()+days); return d.toISOString().split("T")[0]; };
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const today = () => new Date().toISOString().split("T")[0];
const greet = () => { const h=new Date().getHours(); return h<12?"Buongiorno":h<18?"Buonasera":"Buonasera"; };

// ── UI Primitives ─────────────────────────────────────────────────────────────
const Badge = ({label,color,bg,s}) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:s?"3px 10px":"4px 12px",borderRadius:T.r.full,fontSize:s?"11px":"12px",fontWeight:600,color,background:bg,whiteSpace:"nowrap"}}>{label}</span>
);

const Btn = ({children,v="primary",s="md",onClick,style,disabled}) => {
  const VS={primary:{bg:T.green,c:"#fff",hb:T.greenH,bd:"none"},secondary:{bg:"transparent",c:T.textM,hb:T.bg4,bd:`1px solid ${T.border}`},success:{bg:T.green,c:"#fff",hb:"#09a066",bd:"none"},danger:{bg:"transparent",c:T.red,hb:T.redS,bd:`1px solid ${T.red}44`},ghost:{bg:"transparent",c:T.textD,hb:T.bg3,bd:"none"}};
  const SS={sm:{p:"8px 14px",f:"13px"},md:{p:"11px 20px",f:"14px"},lg:{p:"14px 28px",f:"15px"}};
  const vv=VS[v],ss=SS[s];
  const [h,setH]=useState(false);
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-flex",alignItems:"center",gap:"6px",background:h&&!disabled?vv.hb:vv.bg,color:vv.c,border:vv.bd,borderRadius:T.r.m,fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all .15s",fontFamily:"inherit",opacity:disabled?.45:1,padding:ss.p,fontSize:ss.f,minHeight:"44px",...style}}>{children}</button>;
};

const Card = ({children,style,onClick,hov}) => {
  const [h,setH]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:T.bg2,border:`1px solid ${h&&hov?T.borderH:T.border}`,borderRadius:T.r.l,padding:"16px 18px",transition:"border-color .2s",cursor:hov?"pointer":"default",animation:"fadeIn .3s ease",...style}}>{children}</div>;
};

const Empty = ({icon,title,desc,action}) => (
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{fontSize:"44px",marginBottom:"14px",opacity:.35}}>{icon}</div>
    <div style={{fontSize:"16px",fontWeight:600,color:T.textM,marginBottom:"8px"}}>{title}</div>
    <div style={{fontSize:"14px",color:T.textD,maxWidth:"300px",margin:"0 auto 20px",lineHeight:1.7}}>{desc}</div>
    {action}
  </div>
);

const Search = ({value,onChange,placeholder}) => (
  <div style={{position:"relative"}}>
    <span style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",fontSize:"15px",opacity:.3}}>🔍</span>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Cerca..."} style={{paddingLeft:"40px",fontSize:"15px"}} />
  </div>
);

const Tabs = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:"2px",background:T.bg,padding:"3px",borderRadius:T.r.m,border:`1px solid ${T.border}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)} style={{padding:"8px 14px",borderRadius:T.r.s,border:"none",cursor:"pointer",background:active===t.id?T.bg3:"transparent",color:active===t.id?T.text:T.textD,fontWeight:active===t.id?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap",minHeight:"40px"}}>
        {t.label}{t.count!=null&&<span style={{marginLeft:"5px",fontSize:"11px",opacity:.55}}>({t.count})</span>}
      </button>
    ))}
  </div>
);

const Modal = ({open,onClose,title,children,w}) => {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.82)",backdropFilter:"blur(8px)"}} />
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#FFFFFF",border:"1px solid #DEE2E6",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:w||"580px",maxHeight:"92vh",overflow:"auto",animation:"slideUp .25s ease",boxShadow:"0 -8px 40px rgba(0,0,0,.6)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px 14px",borderBottom:`1px solid ${T.border}`}}>
          <h3 style={{fontSize:"16px",fontWeight:700}}>{title}</h3>
          <button onClick={onClose} style={{background:T.bg3,border:"none",color:T.textM,fontSize:"16px",cursor:"pointer",width:"32px",height:"32px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"20px 22px",paddingBottom:"calc(20px + env(safe-area-inset-bottom))"}}>{children}</div>
      </div>
    </div>
  );
};

const FormField = ({label,children,hint}) => (
  <div style={{marginBottom:"18px"}}>
    <label style={{display:"block",fontSize:"12px",color:T.textD,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:"7px"}}>{label}</label>
    {children}
    {hint&&<div style={{fontSize:"12px",color:T.textMu,marginTop:"6px",lineHeight:1.5}}>{hint}</div>}
  </div>
);

const SendButtons = ({message,clientPhone}) => {
  const [ok,setOk]=useState(false);
  const copy=()=>{navigator.clipboard.writeText(message);setOk(true);setTimeout(()=>setOk(false),2000);};
  const waLink=`https://wa.me/39${clientPhone}?text=${encodeURIComponent(message)}`;
  return (
    <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
      <a href={waLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:"#1DA851",color:"#fff",borderRadius:T.r.m,fontSize:"13px",fontWeight:600,textDecoration:"none",minHeight:"44px"}}>📱 WhatsApp</a>
      <button onClick={copy} style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:ok?T.green:T.bg4,color:ok?"#fff":T.textM,border:`1px solid ${T.border}`,borderRadius:T.r.m,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",minHeight:"44px"}}>{ok?"✓ Copiato":"📋 Copia"}</button>
    </div>
  );
};

// ── Onboarding ───────────────────────────────────────────────────────────────
const Onboarding = ({onComplete}) => {
  const {updateSettings, addRecord} = useSliss();
  const [step, setStep] = useState(0);
  const [bName, setBName] = useState("");
  const [bizType, setBizType] = useState("");
  const [cluster, setCluster] = useState("");
  const [customSector, setCustomSector] = useState("");

  const clustersForType = bizType === "prodotti" ? CLUSTERS_PRODOTTI : CLUSTERS_SERVIZI;
  const isCustomCluster = cluster === "altro_s" || cluster === "altro_p";

  const doComplete = () => {
    const updates = {businessName:bName.trim(),bizType,cluster,customSector:isCustomCluster?customSector:""};
    updateSettings(updates);
    if(bizType==="servizi"&&cluster&&CLUSTER_TEMPLATES[cluster]) {
      CLUSTER_TEMPLATES[cluster].forEach(t=>addRecord("templates",{...t,id:uid()}));
    }
    if(bizType==="prodotti") {
      [{name:"Conferma ordine",code:"PO1",phase:"order_confirm",text:"Ciao [Nome]! Ho ricevuto il tuo ordine, grazie mille! Lo sto preparando con cura. Ti avviso non appena è in partenza!"},
       {name:"In spedizione",code:"PO2",phase:"shipping",text:"Ciao [Nome]! Il tuo ordine è in partenza oggi. Arrivo stimato: [Data]. Per qualsiasi cosa sono qui!"},
       {name:"Feedback ricezione",code:"PO3",phase:"delivery_check",text:"Ciao [Nome]! È arrivato tutto bene? Spero che il prodotto ti piaccia. Se c'è qualcosa che non va, scrivimi subito."},
       {name:"Richiesta recensione",code:"PO4",phase:"review",text:"Ciao [Nome]! Spero che stia usando il prodotto con soddisfazione. Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!"},
       {name:"Riordino",code:"PO5",phase:"reorder",text:"Ciao [Nome]! Sono passati un po' di mesi — se hai bisogno di riordinare o vuoi scoprire qualcosa di nuovo, sono qui!"},
      ].forEach(t=>addRecord("templates",{...t,id:uid(),channel:"WhatsApp",active:true}));
    }
    setOnboarded();
    onComplete();
  };

  const renderStep = () => {
    switch(step) {
      case 0: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>👋</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Benvenuto in Sliss</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"24px"}}>Lo strumento operativo per professionisti che vogliono curare i propri clienti senza perdere tempo.</p>
        <Btn onClick={()=>setStep(1)} style={{width:"100%",justifyContent:"center"}}>Inizia →</Btn>
      </>;
      case 1: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>💼</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Come si chiama la tua attività?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Apparirà nel saluto della home. Potrai cambiarlo nelle impostazioni.</p>
        <input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" style={{fontSize:"18px",padding:"14px 16px",textAlign:"center",marginBottom:"20px"}} autoFocus />
        <Btn onClick={()=>setStep(2)} disabled={!bName.trim()} style={{width:"100%",justifyContent:"center"}}>Avanti →</Btn>
      </>;
      case 2: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>🎯</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Come lavori?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Sliss si adatta al tuo tipo di attività.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
          {[
            {key:"servizi", icon:"🗓️",label:"Offro servizi con appuntamento",desc:"Tatuaggi, barber, estetica, officine..."},
            {key:"prodotti",icon:"📦",label:"Vendo prodotti",desc:"Stampa 3D, negozio, prodotti artigianali..."},
          ].map(opt=>(
            <button key={opt.key} onClick={()=>{setBizType(opt.key);setCluster("");setCustomSector("");}}
              style={{display:"flex",alignItems:"center",gap:"14px",padding:"16px 18px",background:bizType===opt.key?T.greenS:T.bg2,border:`1.5px solid ${bizType===opt.key?T.green:T.border}`,borderRadius:T.r.l,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:"26px"}}>{opt.icon}</span>
              <div><div style={{fontSize:"15px",fontWeight:bizType===opt.key?600:500,color:bizType===opt.key?T.green:T.text}}>{opt.label}</div><div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{opt.desc}</div></div>
            </button>
          ))}
        </div>
        <Btn onClick={()=>setStep(3)} disabled={!bizType} style={{width:"100%",justifyContent:"center"}}>Avanti →</Btn>
      </>;
      case 3: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>🏷️</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>In quale settore lavori?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Sliss adatterà i template al tuo settore.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
          {Object.entries(clustersForType).map(([key,cl])=>(
            <button key={key} onClick={()=>{setCluster(key);setCustomSector("");}}
              style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 18px",background:cluster===key?T.greenS:T.bg2,border:`1.5px solid ${cluster===key?T.green:T.border}`,borderRadius:T.r.l,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:"22px"}}>{cl.icon}</span>
              <span style={{fontSize:"15px",fontWeight:cluster===key?600:400,color:cluster===key?T.green:T.text}}>{cl.label}</span>
            </button>
          ))}
        </div>
        {isCustomCluster&&<input value={customSector} onChange={e=>setCustomSector(e.target.value)} placeholder="Descrivi il tuo settore..." style={{fontSize:"15px",marginBottom:"20px"}} autoFocus />}
        <Btn onClick={()=>setStep(4)} disabled={!cluster||(isCustomCluster&&!customSector.trim())} style={{width:"100%",justifyContent:"center"}}>Avanti →</Btn>
      </>;
      case 4: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>🚀</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Sei pronto</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>{bizType==="prodotti"?"Inizia aggiungendo il tuo primo cliente, poi inserisci un ordine.":"Inizia aggiungendo il tuo primo cliente, poi inserisci un appuntamento."} Sliss genererà i follow-up automaticamente.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"24px"}}>
          {(bizType==="prodotti"?["Aggiungi un cliente","Inserisci un ordine","Sliss prepara i messaggi per te"]:["Aggiungi un cliente","Inserisci un appuntamento","Sliss prepara i messaggi per te"]).map((st,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",background:T.bg2,borderRadius:T.r.l,border:`1px solid ${T.border}`,textAlign:"left"}}>
              <div style={{width:"26px",height:"26px",borderRadius:"50%",background:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:"14px",color:T.textM}}>{st}</span>
            </div>
          ))}
        </div>
        <Btn onClick={doComplete} style={{width:"100%",justifyContent:"center"}}>Apri Sliss →</Btn>
      </>;
      default: return null;
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",background:T.bg,animation:"fadeIn .5s ease"}}>
      <div style={{width:"100%",maxWidth:"400px",textAlign:"center"}}>
        <div style={{marginBottom:"20px"}}><SlissLogo size={32} /></div>
        {renderStep()}
        <div style={{display:"flex",gap:"6px",justifyContent:"center",marginTop:"28px"}}>
          {[0,1,2,3,4].map(i=><div key={i} style={{width:i===step?20:6,height:"6px",borderRadius:"3px",background:i===step?T.green:T.border,transition:"all .3s"}} />)}
        </div>
      </div>
    </div>
  );
};

// ── Navigation ───────────────────────────────────────────────────────────────
const getNavMain = (bizType) => {
  const agendaItem = bizType==="prodotti"
    ? {id:"orders",       icon:"📦", label:"Ordini"}
    : {id:"appointments", icon:"📅", label:"Agenda"};
  return [
    {id:"home",    icon:"🏠", label:"Home"},
    {id:"clients", icon:"👥", label:"Clienti"},
    agendaItem,
    {id:"followup",icon:"💬", label:"Follow-Up"},
  ];
};
const NAV_MAIN = getNavMain("");

const BottomNav = ({view,setView,pendingCount}) => (
  <nav className="mobile-only" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"#FFFFFF",borderTop:"1px solid #DEE2E6",boxShadow:"0 -1px 0 rgba(0,0,0,0.06)",display:"flex",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)"}}>
    {(getNavMain(data?.settings?.bizType||"")).map(n=>{
      const a=view===n.id;
      const showBadge=n.id==="followup"&&pendingCount>0;
      return (
        <button key={n.id} onClick={()=>setView(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"10px 0",background:"none",border:"none",cursor:"pointer",color:a?T.green:T.textD,fontFamily:"inherit",transition:"color .15s",position:"relative",minHeight:"56px"}}>
          {showBadge&&<div style={{position:"absolute",top:"6px",right:"calc(50% - 14px)",width:"16px",height:"16px",borderRadius:"50%",background:T.amber,fontSize:"10px",fontWeight:700,color:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>{pendingCount>9?"9+":pendingCount}</div>}
          <span style={{fontSize:"22px",lineHeight:1}}>{n.icon}</span>
          <span style={{fontSize:"11px",fontWeight:a?600:400}}>{n.label}</span>
        </button>
      );
    })}
    <button onClick={()=>setView("more")} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"10px 0",background:"none",border:"none",cursor:"pointer",color:["templates","feedback","modules","settings"].includes(view)?T.blue:T.textD,fontFamily:"inherit",minHeight:"56px"}}>
      <span style={{fontSize:"22px",lineHeight:1}}>⋯</span>
      <span style={{fontSize:"11px",fontWeight:400}}>Altro</span>
    </button>
  </nav>
);

const MoreMenu = ({setView}) => {
  const items = [
    {id:"templates",icon:"📝",label:"Template",desc:"Gestisci i messaggi"},
    {id:"feedback", icon:"⭐",label:"Feedback", desc:"Recensioni clienti"},
    {id:"modules",  icon:"🧩",label:"Moduli",   desc:"Funzioni aggiuntive"},
    {id:"settings", icon:"⚙️",label:"Impostazioni",desc:"Personalizza Sliss"},
  ];
  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"22px"}}>Altro</h1>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {items.map(it=>(
          <Card key={it.id} hov onClick={()=>setView(it.id)} style={{display:"flex",alignItems:"center",gap:"14px",padding:"16px 18px"}}>
            <div style={{width:"44px",height:"44px",borderRadius:T.r.l,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>{it.icon}</div>
            <div><div style={{fontWeight:600,fontSize:"15px"}}>{it.label}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{it.desc}</div></div>
            <span style={{marginLeft:"auto",color:T.textMu,fontSize:"18px"}}>›</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

const DesktopSidebar = ({view,setView}) => {
  const {data:sData}=useSliss();
  const allNav = [
    ...getNavMain(sData?.settings?.bizType||""),
    {id:"templates",icon:"📝",label:"Template"},
    {id:"feedback", icon:"⭐",label:"Feedback"},
    {id:"modules",  icon:"🧩",label:"Moduli"},
    {id:"settings", icon:"⚙️",label:"Impostazioni"},
  ];
  return (
    <div className="desktop-only" style={{width:"210px",minHeight:"100vh",background:"#FFFFFF",borderRight:"1px solid #DEE2E6",display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:100}}>
      <div style={{padding:"22px 18px 18px",borderBottom:`1px solid ${T.border}`}}>
        <SlissLogo size={24} />
        <div style={{fontSize:"9px",color:T.textMu,fontWeight:500,letterSpacing:".05em",textTransform:"uppercase",marginTop:"4px"}}>Ecosistema Operativo</div>
      </div>
      <nav style={{flex:1,padding:"8px 6px",display:"flex",flexDirection:"column",gap:"1px"}}>
        {allNav.map(n=>{const a=view===n.id; return (
          <button key={n.id} onClick={()=>setView(n.id)} style={{display:"flex",alignItems:"center",gap:"9px",padding:"10px 12px",borderRadius:T.r.m,border:"none",cursor:"pointer",background:a?T.greenS:"transparent",color:a?T.green:T.textD,fontWeight:a?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .12s",textAlign:"left",width:"100%",minHeight:"44px"}}>
            <span style={{fontSize:"17px",width:"22px",textAlign:"center",flexShrink:0}}>{n.icon}</span>{n.label}
          </button>
        );})}
      </nav>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${T.border}`}}>
        <div style={{fontSize:"10px",color:T.textMu}}>Sliss v4.0 · liscio come deve essere.</div>
      </div>
    </div>
  );
};

// ── Page Header (mobile) ─────────────────────────────────────────────────────
const PageHeader = ({title,action}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
    <h1 style={{fontSize:"22px",fontWeight:700,letterSpacing:"-.02em"}}>{title}</h1>
    {action}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════

// ── HOME ─────────────────────────────────────────────────────────────────────
const Home = ({setView}) => {
  const {data}=useSliss();
  const td=today();
  const biz=data.settings?.businessName||"la tua attività";
  const pending=data.followUps.filter(f=>f.status==="pending"&&f.scheduledDate<=td);
  const awaiting=data.followUps.filter(f=>f.status==="sent"&&!f.satisfaction);
  const activeC=data.clients.filter(c=>c.status==="active"||c.status==="vip");
  const toReact=data.clients.filter(c=>c.status==="to_reactivate");

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:"24px"}}>
        <div style={{fontSize:"13px",color:T.textD,marginBottom:"3px"}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</div>
        <h1 style={{fontSize:"26px",fontWeight:700,letterSpacing:"-.03em",lineHeight:1.2}}>{greet()},<br/><span style={{color:T.green}}>{biz}</span> 👋</h1>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"20px"}}>
        {[
          {label:"Da inviare",value:pending.length,color:pending.length?T.amber:T.green,sub:pending.length?"oggi":"tutto ok"},
          {label:"In attesa",value:awaiting.length,color:T.blue,sub:"risposta"},
          {label:"Attivi",value:activeC.length,color:T.green,sub:`${toReact.length} da riatt.`},
        ].map((s,i)=>(
          <Card key={i} style={{padding:"14px 12px",display:"flex",flexDirection:"column",gap:"4px"}}>
            <span style={{fontSize:"11px",color:T.textD,fontWeight:500}}>{s.label}</span>
            <span style={{fontSize:"26px",fontWeight:700,color:s.color,letterSpacing:"-.02em",lineHeight:1}}>{s.value}</span>
            <span style={{fontSize:"11px",color:T.textMu}}>{s.sub}</span>
          </Card>
        ))}
      </div>

      <Card style={{marginBottom:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <h2 style={{fontSize:"15px",fontWeight:700}}>Da fare oggi</h2>
          {pending.length>0&&<Badge label={`${pending.length}`} color={T.amber} bg={T.amberS} s />}
        </div>
        {!pending.length
          ? <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:"24px",marginBottom:"6px"}}>✅</div>
              <div style={{fontSize:"13px",color:T.textD}}>Tutto fatto per oggi!</div>
            </div>
          : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {pending.slice(0,3).map(fu=>{
                const cl=data.clients.find(c=>c.id===fu.clientId);
                const ph=PHASES[fu.phase];
                return (
                  <div key={fu.id} style={{padding:"12px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                      <span style={{fontSize:"16px"}}>{ph.icon}</span>
                      <span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"—"}</span>
                      <Badge {...ph} s />
                    </div>
                    <div style={{fontSize:"13px",color:T.textD,lineHeight:1.5,marginBottom:"10px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{fu.message}</div>
                    <SendButtons message={fu.message} clientPhone={cl?.phone||""} />
                  </div>
                );
              })}
              {pending.length>3&&<button onClick={()=>setView("followup")} style={{width:"100%",padding:"10px",background:"none",border:`1px solid ${T.border}`,borderRadius:T.r.m,color:T.textM,fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>Vedi tutti i {pending.length} follow-up →</button>}
            </div>
        }
      </Card>

      <Card>
        <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>Clienti</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
          {data.clients.slice(0,5).map(cl=>{
            const st=CLIENT_ST[cl.status];
            return (
              <div key={cl.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:T.bg3,borderRadius:T.r.m}}>
                <div style={{width:"7px",height:"7px",borderRadius:"50%",background:st.color,flexShrink:0}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl.name}</div>
                  <div style={{fontSize:"11px",color:T.textD}}>{daysAgo(cl.lastVisit)}</div>
                </div>
                <Badge {...st} s />
              </div>
            );
          })}
          {data.clients.length===0&&<div style={{fontSize:"13px",color:T.textD,textAlign:"center",padding:"12px 0"}}>Nessun cliente ancora</div>}
        </div>
      </Card>
    </div>
  );
};

// ── FOLLOW-UP ────────────────────────────────────────────────────────────────
const FollowUp = () => {
  const {data,update}=useSliss();
  const [filter,setFilter]=useState("today");
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const td=today();

  const tabs=[
    {id:"today",   label:"Da inviare",count:data.followUps.filter(f=>f.status==="pending"&&f.scheduledDate<=td).length},
    {id:"awaiting",label:"In attesa", count:data.followUps.filter(f=>f.status==="sent").length},
    {id:"all",     label:"Tutti",     count:data.followUps.length},
  ];

  const filtered=data.followUps.filter(fu=>{
    const cl=data.clients.find(c=>c.id===fu.clientId);
    const ms=!search||cl?.name.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="all"||(filter==="today"&&fu.status==="pending"&&fu.scheduledDate<=td)||(filter==="awaiting"&&fu.status==="sent");
    return ms&&mf;
  }).sort((a,b)=>new Date(a.scheduledDate)-new Date(b.scheduledDate));

  const markSent=fu=>{update("followUps",fu.id,{status:"sent",sentDate:today()});if(sel?.id===fu.id)setSel({...fu,status:"sent",sentDate:today()});};
  const pendingToday=data.followUps.filter(f=>f.status==="pending"&&f.scheduledDate<=td);
  const markAllSent=()=>{if(!pendingToday.length)return;if(!window.confirm(`Segna tutti i ${pendingToday.length} follow-up come inviati?`))return;pendingToday.forEach(fu=>update("followUps",fu.id,{status:"sent",sentDate:today()}));};
  const allDone=filter==="today"&&pendingToday.length===0&&data.followUps.some(f=>f.sentDate===td);

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
        <h1 style={{fontSize:"22px",fontWeight:700}}>Follow-Up</h1>
        {pendingToday.length>0&&<Btn v="success" s="sm" onClick={markAllSent}>✓ Tutti ({pendingToday.length})</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"16px"}}>
        <Tabs tabs={tabs} active={filter} onChange={setFilter} />
        <Search value={search} onChange={setSearch} placeholder="Cerca cliente..." />
      </div>

      {allDone
        ? <div style={{textAlign:"center",padding:"60px 20px",animation:"fadeIn .4s ease"}}>
            <div style={{fontSize:"52px",marginBottom:"16px"}}>🎉</div>
            <div style={{fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Ottimo lavoro!</div>
            <div style={{fontSize:"14px",color:T.textM}}>Tutti i follow-up di oggi sono stati inviati.</div>
            <div style={{fontSize:"13px",color:T.textD,marginTop:"6px"}}>I tuoi clienti si sentiranno seguiti.</div>
          </div>
        : !filtered.length
        ? <Empty icon="📭" title="Nessun follow-up" desc="Non ci sono follow-up per questo filtro." />
        : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {filtered.map((fu,i)=>{
              const cl=data.clients.find(c=>c.id===fu.clientId);
              const ph=PHASES[fu.phase];
              const st=STATUSES[fu.status];
              const timing=fu.status==="pending"?daysUntil(fu.scheduledDate):daysAgo(fu.sentDate);
              return (
                <Card key={fu.id} hov onClick={()=>setSel(fu)} style={{animation:`fadeIn .3s ease ${i*.03}s both`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
                    <span style={{fontSize:"20px",marginTop:"2px",flexShrink:0}}>{ph.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px",flexWrap:"wrap"}}>
                        <span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"—"}</span>
                        <Badge {...ph} s /><Badge {...st} s />
                      </div>
                      <div style={{fontSize:"13px",color:T.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"8px"}}>{fu.message}</div>
                      {fu.status==="pending"&&<SendButtons message={fu.message} clientPhone={cl?.phone||""} />}
                    </div>
                    <div style={{flexShrink:0,textAlign:"right"}}>
                      <span style={{fontSize:"11px",color:T.textMu}}>{timing}</span>
                      {fu.status==="pending"&&<div style={{marginTop:"6px"}}><Btn v="success" s="sm" onClick={e=>{e.stopPropagation();markSent(fu);}}>✓</Btn></div>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
      }

      <Modal open={!!sel} onClose={()=>setSel(null)} title="Dettaglio Follow-Up">
        {sel&&(()=>{
          const cl=data.clients.find(c=>c.id===sel.clientId);
          const ph=PHASES[sel.phase];
          const st=STATUSES[sel.status];
          return (
            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}><Badge {...ph} /><Badge {...st} /></div>
              <div><div style={{fontWeight:700,fontSize:"17px"}}>{cl?.name}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{cl?.phone} · {cl?.channel}</div></div>
              <div style={{padding:"14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"14px",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{sel.message}</div>
              <SendButtons message={sel.message} clientPhone={cl?.phone||""} />
              {sel.status==="pending"&&<Btn v="success" onClick={()=>{markSent(sel);setSel(null);}}>✓ Segna inviato</Btn>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",paddingTop:"12px",borderTop:`1px solid ${T.border}`}}>
                <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Programmato</span><div style={{fontSize:"14px",marginTop:"3px"}}>{fmtDate(sel.scheduledDate)}</div></div>
                <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Inviato</span><div style={{fontSize:"14px",marginTop:"3px"}}>{sel.sentDate?fmtDate(sel.sentDate):"—"}</div></div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};


// ── ORDINI (Flusso Prodotti) ──────────────────────────────────────────────────
const buildProductFollowUps = (orderId, clientId, clientName, orderDate, estimatedDelivery, templates) => {
  // Conferma ordine — immediata dalla data ordine
  // Spedizione — trigger manuale (quando l'utente preme "Spedito")
  // Delivery check — +3 da data consegna stimata
  // Recensione — +14 da data consegna stimata
  // Riordino — +60 da data consegna stimata
  const deliveryDate = estimatedDelivery || addDays(orderDate, 7);
  return [
    {id:uid(),orderId,clientId,phase:"order_confirm", status:"pending",scheduledDate:orderDate,     sentDate:null,message:`Ciao ${clientName}! Ho ricevuto il tuo ordine, grazie mille 🙏 Lo sto preparando con cura. Ti avviso non appena è in partenza!`},
    {id:uid(),orderId,clientId,phase:"shipping",      status:"pending",scheduledDate:null,          sentDate:null,message:`Ciao ${clientName}! Il tuo ordine è in partenza oggi 📦 Arrivo stimato: ${fmtDate(deliveryDate)}. Per qualsiasi cosa sono qui!`,awaitShipping:true},
    {id:uid(),orderId,clientId,phase:"delivery_check",status:"pending",scheduledDate:addDays(deliveryDate,3),sentDate:null,message:`Ciao ${clientName}! È arrivato tutto bene? Spero che il prodotto ti piaccia 🙏 Se c'è qualcosa che non va, scrivimi subito.`},
    {id:uid(),orderId,clientId,phase:"review",        status:"pending",scheduledDate:addDays(deliveryDate,14),sentDate:null,message:`Ciao ${clientName}! Spero che stia usando il prodotto con soddisfazione ✨ Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!`},
    {id:uid(),orderId,clientId,phase:"reorder",       status:"pending",scheduledDate:addDays(deliveryDate,60),sentDate:null,message:`Ciao ${clientName}! Sono passati un po' di mesi — se hai bisogno di riordinare o vuoi scoprire qualcosa di nuovo, sono qui 🙏`},
  ];
};

const Orders = () => {
  const {data,addRecord,update,deleteRecord}=useSliss();
  const [showNew,setShowNew]=useState(false);
  const [done,setDone]=useState(false);
  const [form,setForm]=useState({clientId:"",product:"",orderDate:today(),deliveryDays:"7",notes:""});

  const sorted=[...(data.orders||[])].sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate));

  const handleAdd=()=>{
    if(!form.clientId||!form.product.trim()) return;
    const client=data.clients.find(c=>c.id===form.clientId);
    if(!client) return;
    const orderId=uid();
    const deliveryDate=addDays(form.orderDate,parseInt(form.deliveryDays)||7);
    addRecord("orders",{id:orderId,clientId:form.clientId,product:form.product,orderDate:form.orderDate,deliveryDate,notes:form.notes,status:"pending",created:today()});
    const fus=buildProductFollowUps(orderId,form.clientId,client.name,form.orderDate,deliveryDate);
    fus.forEach(fu=>addRecord("followUps",fu));
    setDone(true);
    setTimeout(()=>{setDone(false);setShowNew(false);setForm({clientId:"",product:"",orderDate:today(),deliveryDays:"7",notes:""});},1800);
  };

  const markShipped=(order)=>{
    const shippingDate=today();
    update("orders",order.id,{status:"shipped",shippedDate:shippingDate});
    // Attiva il follow-up spedizione
    const shippingFU=data.followUps.find(f=>f.orderId===order.id&&f.phase==="shipping"&&f.awaitShipping);
    if(shippingFU) update("followUps",shippingFU.id,{scheduledDate:shippingDate,status:"pending"});
  };

  const handleDelete=(order)=>{
    if(!window.confirm("Eliminare questo ordine?")) return;
    deleteRecord("orders",order.id);
    data.followUps.filter(f=>f.orderId===order.id).forEach(f=>deleteRecord("followUps",f.id));
  };

  const statusLabel={pending:"In preparazione",shipped:"Spedito",delivered:"Consegnato"};
  const statusColor={pending:T.amber,shipped:T.blue,delivered:T.green};

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Ordini" action={<Btn onClick={()=>setShowNew(true)}>+ Nuovo ordine</Btn>} />
      <p style={{fontSize:"13px",color:T.textD,marginBottom:"20px",marginTop:"-10px"}}>Aggiungi un ordine → i 5 follow-up si generano automaticamente</p>

      {!sorted.length
        ? <Empty icon="📦" title="Nessun ordine" desc="Aggiungi il primo ordine per generare i follow-up automaticamente." />
        : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {sorted.map((order,i)=>{
              const cl=data.clients.find(c=>c.id===order.clientId);
              const fus=data.followUps.filter(f=>f.orderId===order.id);
              const pendingFUs=fus.filter(f=>f.status==="pending"&&f.scheduledDate&&f.scheduledDate<=today()).length;
              return (
                <Card key={order.id} style={{animation:`fadeIn .3s ease ${i*.03}s both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:"15px"}}>{cl?.name||"—"}</div>
                      <div style={{fontSize:"13px",color:T.textM,marginTop:"2px"}}>{order.product}</div>
                      {order.notes&&<div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>📝 {order.notes}</div>}
                    </div>
                    <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                      <span style={{fontSize:"12px",fontWeight:600,color:statusColor[order.status]||T.amber,background:`${statusColor[order.status]}18`,padding:"3px 10px",borderRadius:T.r.full}}>{statusLabel[order.status]||"—"}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:"12px",fontSize:"12px",color:T.textD,marginBottom:"10px"}}>
                    <span>Ordine: {fmtDate(order.orderDate)}</span>
                    <span>Consegna stimata: {fmtDate(order.deliveryDate)}</span>
                  </div>
                  {/* Mini timeline follow-up */}
                  <div style={{display:"flex",gap:"5px",marginBottom:"10px"}}>
                    {["order_confirm","shipping","delivery_check","review","reorder"].map(phase=>{
                      const fu=fus.find(f=>f.phase===phase);
                      const ph=PRODUCT_PHASES[phase];
                      const col=!fu?"#E9ECEF":fu.status==="sent"||fu.status==="replied"?T.greenS:fu.awaitShipping&&order.status==="pending"?"#E9ECEF":T.amberS;
                      const textCol=!fu?T.textMu:fu.status==="sent"||fu.status==="replied"?T.green:fu.awaitShipping&&order.status==="pending"?T.textMu:T.amber;
                      return (
                        <div key={phase} style={{flex:1,padding:"5px 4px",background:col,borderRadius:T.r.s,textAlign:"center"}}>
                          <div style={{fontSize:"13px"}}>{ph.icon}</div>
                          <div style={{fontSize:"9px",color:textCol,fontWeight:600,marginTop:"1px",lineHeight:1.2}}>{fu&&fu.scheduledDate?daysUntil(fu.scheduledDate):fu?.awaitShipping?"⏳":"—"}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                    {order.status==="pending"&&<Btn v="primary" s="sm" onClick={()=>markShipped(order)}>📦 Segna spedito</Btn>}
                    {pendingFUs>0&&<span style={{fontSize:"12px",color:T.amber,fontWeight:600,padding:"8px 0"}}>{pendingFUs} follow-up da inviare</span>}
                    <Btn v="danger" s="sm" onClick={()=>handleDelete(order)}>🗑️</Btn>
                  </div>
                </Card>
              );
            })}
          </div>
      }

      <Modal open={showNew} onClose={()=>{setShowNew(false);setDone(false);}} title="Nuovo ordine">
        {done
          ? <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:"36px",marginBottom:"12px"}}>✅</div>
              <div style={{fontWeight:700,fontSize:"16px",marginBottom:"6px"}}>Ordine salvato</div>
              <div style={{fontSize:"13px",color:T.textD}}>5 follow-up generati automaticamente</div>
            </div>
          : <>
              <FormField label="Cliente">
                <select value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))}>
                  <option value="">Seleziona cliente...</option>
                  {data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Prodotto / Descrizione">
                <input value={form.product} onChange={e=>setForm(p=>({...p,product:e.target.value}))} placeholder="Es. Supporto stampa 3D personalizzato" />
              </FormField>
              <FormField label="Data ordine">
                <input type="date" value={form.orderDate} onChange={e=>setForm(p=>({...p,orderDate:e.target.value}))} />
              </FormField>
              <FormField label="Consegna stimata (giorni)" hint="Da oggi — usato per calcolare i follow-up post-consegna">
                <input type="number" min="1" max="365" value={form.deliveryDays} onChange={e=>setForm(p=>({...p,deliveryDays:e.target.value}))} />
              </FormField>
              <FormField label="Note (opzionale)">
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Dettagli prodotto, personalizzazioni..." style={{minHeight:"60px"}} />
              </FormField>
              {form.clientId&&form.product&&(
                <div style={{padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,marginBottom:"16px",fontSize:"12px",color:T.textD}}>
                  <div style={{fontWeight:600,color:T.textM,marginBottom:"6px"}}>Follow-up che verranno generati:</div>
                  {[
                    {icon:"📋",label:"Conferma ordine",timing:"Oggi"},
                    {icon:"📦",label:"In spedizione",timing:"Quando premi Spedito"},
                    {icon:"✅",label:"Feedback ricezione",timing:`+3gg da consegna (${fmtDate(addDays(today(),parseInt(form.deliveryDays||7)+3))})`},
                    {icon:"⭐",label:"Recensione",timing:`+14gg da consegna (${fmtDate(addDays(today(),parseInt(form.deliveryDays||7)+14))})`},
                    {icon:"🔄",label:"Riordino",timing:`+60gg da consegna`},
                  ].map(({icon,label,timing})=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",alignItems:"center"}}>
                      <span>{icon} {label}</span>
                      <span style={{color:T.green,fontSize:"11px"}}>{timing}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
                <Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn>
                <Btn onClick={handleAdd} disabled={!form.clientId||!form.product.trim()}>Salva e genera follow-up</Btn>
              </div>
            </>
        }
      </Modal>
    </div>
  );
};

// ── CLIENTI ──────────────────────────────────────────────────────────────────
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
    {id:"all",label:"Tutti",count:data.clients.length},
    {id:"active",label:"Attivi",count:data.clients.filter(c=>c.status==="active").length},
    {id:"vip",label:"VIP",count:data.clients.filter(c=>c.status==="vip").length},
    {id:"to_reactivate",label:"Da riatt.",count:data.clients.filter(c=>c.status==="to_reactivate").length},
  ];
  const filtered=data.clients.filter(c=>{
    const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase());
    return ms&&(sf==="all"||c.status===sf);
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
  const handleDelete=id=>{
    if(window.confirm("Eliminare questo cliente?")) {deleteRecord("clients",id);setSel(null);}
  };
  const openClient=cl=>{setSel(cl);setEditForm({name:cl.name,phone:cl.phone,email:cl.email,channel:cl.channel,notes:cl.notes||"",status:cl.status});setEditMode(false);};

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Clienti" action={<Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn>} />
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"16px"}}>
        <Tabs tabs={tabs} active={sf} onChange={setSf} />
        <Search value={search} onChange={setSearch} placeholder="Cerca nome o email..." />
      </div>

      {!filtered.length
        ? <Empty icon="👥" title="Nessun cliente" desc="Aggiungi il tuo primo cliente per iniziare." action={<Btn onClick={()=>setShowNew(true)}>+ Aggiungi cliente</Btn>} />
        : <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            {filtered.map((cl,i)=>{
              const st=CLIENT_ST[cl.status];
              const statusOrder=["new","active","vip","to_reactivate","inactive"];
              const nextStatus=cur=>{const idx=statusOrder.indexOf(cur);return statusOrder[(idx+1)%statusOrder.length];};
              return (
                <Card key={cl.id} hov onClick={()=>openClient(cl)} style={{padding:"13px 16px",animation:`fadeIn .3s ease ${i*.03}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <div style={{width:"40px",height:"40px",borderRadius:"50%",background:T.bg3,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:700,color:T.textM,flexShrink:0}}>{cl.name.charAt(0).toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:"15px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl.name}</div>
                      <div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{cl.channel} · {daysAgo(cl.lastVisit)}</div>
                    </div>
                    <div onClick={e=>{e.stopPropagation();update("clients",cl.id,{status:nextStatus(cl.status)});}} style={{cursor:"pointer",padding:"4px"}}><Badge {...st} s /></div>
                  </div>
                </Card>
              );
            })}
          </div>
      }

      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo cliente">
        <FormField label="Nome completo"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Nome Cognome" /></FormField>
        <FormField label="Telefono"><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" type="tel" /></FormField>
        <FormField label="Email"><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@esempio.com" type="email" /></FormField>
        <FormField label="Canale preferito"><select value={form.channel} onChange={e=>setForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
        <FormField label="Note (opzionale)"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Preferenze, info utili..." /></FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.name.trim()}>Salva</Btn></div>
      </Modal>

      <Modal open={!!sel} onClose={()=>{setSel(null);setEditMode(false);}} title="Scheda Cliente">
        {sel&&editForm&&(()=>{
          const st=CLIENT_ST[sel.status];
          const fus=data.followUps.filter(f=>f.clientId===sel.id).sort((a,b)=>new Date(b.scheduledDate)-new Date(a.scheduledDate));
          return !editMode ? (
            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:"18px",fontWeight:700}}>{sel.name}</div>
                  <div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{sel.phone}{sel.email&&` · ${sel.email}`}</div>
                </div>
                <div style={{display:"flex",gap:"7px",alignItems:"center"}}><Badge {...st} /><Btn v="secondary" s="sm" onClick={()=>setEditMode(true)}>✏️</Btn></div>
              </div>
              {sel.notes&&<div style={{padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,fontSize:"13px",color:T.textM,lineHeight:1.6,border:`1px solid ${T.border}`}}>📝 {sel.notes}</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Prima visita</span><div style={{fontSize:"14px",marginTop:"3px"}}>{fmtDate(sel.firstVisit)}</div></div>
                <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Ultima visita</span><div style={{fontSize:"14px",marginTop:"3px"}}>{fmtDate(sel.lastVisit)}</div></div>
              </div>
              {fus.length>0&&(
                <div>
                  <h4 style={{fontSize:"13px",fontWeight:600,marginBottom:"8px",color:T.textM}}>Follow-Up</h4>
                  <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                    {fus.map(fu=>{const ph=PHASES[fu.phase];const ss=STATUSES[fu.status];return(
                      <div key={fu.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 10px",background:T.bg3,borderRadius:T.r.s,border:`1px solid ${T.border}`}}>
                        <span style={{fontSize:"14px"}}>{ph.icon}</span>
                        <div style={{flex:1,display:"flex",gap:"5px",flexWrap:"wrap"}}><Badge {...ph} s /><Badge {...ss} s /></div>
                        <span style={{fontSize:"11px",color:T.textD}}>{fmtDate(fu.scheduledDate)}</span>
                      </div>
                    );})}
                  </div>
                </div>
              )}
              <div style={{paddingTop:"12px",borderTop:`1px solid ${T.border}`}}><Btn v="danger" s="sm" onClick={()=>handleDelete(sel.id)}>🗑️ Elimina</Btn></div>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:"0"}}>
              <FormField label="Nome"><input value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} /></FormField>
              <FormField label="Telefono"><input value={editForm.phone} onChange={e=>setEditForm(p=>({...p,phone:e.target.value}))} type="tel" /></FormField>
              <FormField label="Email"><input value={editForm.email} onChange={e=>setEditForm(p=>({...p,email:e.target.value}))} type="email" /></FormField>
              <FormField label="Canale"><select value={editForm.channel} onChange={e=>setEditForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
              <FormField label="Stato"><select value={editForm.status} onChange={e=>setEditForm(p=>({...p,status:e.target.value}))}><option value="new">Nuovo</option><option value="active">Attivo</option><option value="vip">VIP</option><option value="to_reactivate">Da riattivare</option><option value="inactive">Inattivo</option></select></FormField>
              <FormField label="Note"><textarea value={editForm.notes} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} /></FormField>
              <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setEditMode(false)}>Annulla</Btn><Btn onClick={handleEdit} disabled={!editForm.name?.trim()}>Salva</Btn></div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ── AGENDA (Appuntamenti + Ordini) ───────────────────────────────────────────
const buildFollowUps=(appointmentId,clientId,clientName,appointmentDate,serviceType,timings)=>{
  const timingMap={thankyou:timings.thankyou||0,check:timings.check||7,review:timings.review||21,reactivation:timings.reactivation||60};
  const msgs={
    thankyou:serviceType==="Ritocco"?`Ciao ${clientName}! Grazie per il ritocco di oggi 🙏 Scrivimi per qualsiasi cosa.`:`Ciao ${clientName}! Grazie per oggi 🖤 Ricordati pellicola e sapone neutro. Scrivimi se hai dubbi.`,
    check:`Ciao ${clientName}! Come sta andando la cicatrizzazione? È normale che desquami un po'. Se hai dubbi mandami una foto 🙏`,
    review:`Ciao ${clientName}! Sono passate un po' di settimane ✨ Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo.`,
    reactivation:`Ciao ${clientName}! Pensavo a te — come stai? Se hai in mente qualcosa di nuovo, sono qui 🖤`,
  };
  return ["thankyou","check","review","reactivation"].map(phase=>({id:uid(),appointmentId,clientId,phase,status:"pending",scheduledDate:addDays(appointmentDate,timingMap[phase]),sentDate:null,satisfaction:null,message:msgs[phase]}));
};

const Appointments = () => {
  const {data,addRecord,deleteRecord}=useSliss();
  const [showNew,setShowNew]=useState(false);
  const [form,setForm]=useState({clientId:"",date:today(),serviceType:"Sessione",notes:""});
  const [done,setDone]=useState(false);
  const SERVICE_TYPES=["Sessione","Ritocco","Prima consulenza","Sessione lunga","Consulenza gratuita"];
  const sorted=[...data.appointments].sort((a,b)=>new Date(b.date)-new Date(a.date));

  const handleAdd=()=>{
    if(!form.clientId||!form.date) return;
    const client=data.clients.find(c=>c.id===form.clientId);
    if(!client) return;
    const apptId=uid();
    const timings=data.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};
    addRecord("appointments",{id:apptId,clientId:form.clientId,date:form.date,serviceType:form.serviceType,notes:form.notes,followUpTriggered:true,created:today()});
    buildFollowUps(apptId,form.clientId,client.name,form.date,form.serviceType,timings).forEach(fu=>addRecord("followUps",fu));
    setDone(true);
    setTimeout(()=>{setDone(false);setShowNew(false);setForm({clientId:"",date:today(),serviceType:"Sessione",notes:""});},1800);
  };
  const handleDelete=appt=>{
    if(!window.confirm("Eliminare questo appuntamento e i suoi follow-up?")) return;
    deleteRecord("appointments",appt.id);
    data.followUps.filter(f=>f.appointmentId===appt.id).forEach(f=>deleteRecord("followUps",f.id));
  };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Agenda" action={<Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn>} />
      <div style={{marginBottom:"10px"}}><p style={{fontSize:"13px",color:T.textD}}>Aggiungi un appuntamento → i 4 follow-up si generano in automatico</p></div>

      {!sorted.length
        ? <Empty icon="📅" title="Nessun appuntamento" desc="Aggiungi il primo appuntamento per generare i follow-up automaticamente." action={<Btn onClick={()=>setShowNew(true)}>+ Aggiungi appuntamento</Btn>} />
        : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {sorted.map((appt,i)=>{
              const cl=data.clients.find(c=>c.id===appt.clientId);
              const fus=data.followUps.filter(f=>f.appointmentId===appt.id);
              const pendingCount=fus.filter(f=>f.status==="pending").length;
              const doneCount=fus.filter(f=>f.status==="sent"||f.status==="replied").length;
              return (
                <Card key={appt.id} style={{animation:`fadeIn .3s ease ${i*.03}s both`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:"12px",marginBottom:fus.length?"12px":"0"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:"15px"}}>{cl?.name||"—"}</div>
                      <div style={{fontSize:"13px",color:T.textM,marginTop:"2px"}}>{appt.serviceType} · {fmtDate(appt.date)}</div>
                      {appt.notes&&<div style={{fontSize:"12px",color:T.textMu,marginTop:"3px"}}>📝 {appt.notes}</div>}
                      <div style={{fontSize:"12px",color:T.textD,marginTop:"4px"}}>{pendingCount} in attesa · {doneCount} inviati</div>
                    </div>
                    <Btn v="danger" s="sm" onClick={()=>handleDelete(appt)}>🗑️</Btn>
                  </div>
                  {fus.length>0&&(
                    <div style={{display:"flex",gap:"6px"}}>
                      {["thankyou","check","review","reactivation"].map(phase=>{
                        const fu=fus.find(f=>f.phase===phase);
                        const ph=PHASES[phase];
                        const col=!fu?"rgba(90,111,148,0.12)":fu.status==="pending"?T.amberS:T.greenS;
                        const txtCol=!fu?T.textMu:fu.status==="pending"?T.amber:T.green;
                        return (
                          <div key={phase} style={{flex:1,padding:"6px 4px",background:col,borderRadius:T.r.s,textAlign:"center"}}>
                            <div style={{fontSize:"13px"}}>{ph.icon}</div>
                            <div style={{fontSize:"10px",color:txtCol,fontWeight:600,marginTop:"2px"}}>{fu?daysUntil(fu.scheduledDate):"—"}</div>
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

      <Modal open={showNew} onClose={()=>{setShowNew(false);setDone(false);}} title="Nuovo appuntamento">
        {done
          ? <div style={{textAlign:"center",padding:"24px 0"}}>
              <div style={{fontSize:"44px",marginBottom:"12px"}}>✅</div>
              <div style={{fontWeight:700,fontSize:"17px",marginBottom:"6px"}}>Appuntamento salvato</div>
              <div style={{fontSize:"14px",color:T.textD}}>4 follow-up generati automaticamente</div>
            </div>
          : <>
              <FormField label="Cliente"><select value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))}><option value="">Seleziona cliente...</option>{data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
              <FormField label="Data" hint="I follow-up si calcolano da questa data"><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></FormField>
              <FormField label="Tipo servizio"><select value={form.serviceType} onChange={e=>setForm(p=>({...p,serviceType:e.target.value}))}>{SERVICE_TYPES.map(s=><option key={s}>{s}</option>)}</select></FormField>
              <FormField label="Note (opzionale)"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Zona, dettagli utili..." style={{minHeight:"60px"}} /></FormField>
              {form.clientId&&form.date&&(
                <div style={{padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,marginBottom:"16px",fontSize:"13px",color:T.textD}}>
                  <div style={{fontWeight:600,color:T.textM,marginBottom:"6px"}}>Follow-up generati:</div>
                  {[{label:"🙏 Ringraziamento",days:data.settings?.followUpTimings?.thankyou||0},{label:"🔍 Controllo",days:data.settings?.followUpTimings?.check||7},{label:"⭐ Recensione",days:data.settings?.followUpTimings?.review||21},{label:"💬 Riattivazione",days:data.settings?.followUpTimings?.reactivation||60}].map(({label,days})=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}>
                      <span>{label}</span><span style={{color:T.blue}}>{fmtDate(addDays(form.date,days))}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.clientId||!form.date}>Salva e genera</Btn></div>
            </>
        }
      </Modal>
    </div>
  );
};

// ── TEMPLATE ─────────────────────────────────────────────────────────────────
const Templates = () => {
  const {data,update,addRecord,deleteRecord}=useSliss();
  const [filter,setFilter]=useState("all");
  const [editingId,setEditingId]=useState(null);
  const [editText,setEditText]=useState("");
  const [editName,setEditName]=useState("");
  const [showNew,setShowNew]=useState(false);
  const [newForm,setNewForm]=useState({name:"",phase:"thankyou",channel:"WhatsApp",text:""});
  const phases=[{id:"all",label:"Tutti"},{id:"thankyou",label:"Ringraziamento"},{id:"check",label:"Controllo"},{id:"review",label:"Recensione"},{id:"reactivation",label:"Riattivazione"}];
  const filtered=data.templates.filter(t=>filter==="all"||t.phase===filter);
  const startEdit=t=>{setEditingId(t.id);setEditText(t.text);setEditName(t.name);};
  const saveEdit=id=>{update("templates",id,{text:editText,name:editName});setEditingId(null);};
  const handleAdd=()=>{
    if(!newForm.name.trim()||!newForm.text.trim()) return;
    addRecord("templates",{...newForm,id:uid(),code:`T${uid().slice(0,4).toUpperCase()}`,active:true});
    setNewForm({name:"",phase:"thankyou",channel:"WhatsApp",text:""});
    setShowNew(false);
  };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Template" action={<Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn>} />
      <div style={{marginBottom:"16px"}}><Tabs tabs={phases.map(p=>({...p,count:p.id==="all"?data.templates.length:data.templates.filter(t=>t.phase===p.id).length}))} active={filter} onChange={setFilter} /></div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        {filtered.map((tmpl,i)=>{
          const ph=PHASES[tmpl.phase];
          const isEditing=editingId===tmpl.id;
          return (
            <Card key={tmpl.id} style={{animation:`fadeIn .3s ease ${i*.04}s both`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",flex:1,minWidth:0}}>
                  <span style={{fontSize:"16px",flexShrink:0}}>{ph.icon}</span>
                  {isEditing
                    ? <input value={editName} onChange={e=>setEditName(e.target.value)} style={{fontSize:"14px",fontWeight:600,padding:"6px 10px"}} />
                    : <div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tmpl.name}</div><div style={{fontSize:"11px",color:T.textD,marginTop:"1px"}}>{tmpl.channel}</div></div>
                  }
                </div>
                <div style={{display:"flex",gap:"6px",alignItems:"center",flexShrink:0,marginLeft:"8px"}}>
                  <Badge {...ph} s />
                  {isEditing
                    ? <><Btn v="success" s="sm" onClick={()=>saveEdit(tmpl.id)}>✓</Btn><Btn v="ghost" s="sm" onClick={()=>setEditingId(null)}>✕</Btn></>
                    : <><Btn v="ghost" s="sm" onClick={()=>startEdit(tmpl)}>✏️</Btn><Btn v="danger" s="sm" onClick={()=>{if(window.confirm("Eliminare?"))deleteRecord("templates",tmpl.id);}}>🗑️</Btn></>
                  }
                </div>
              </div>
              {isEditing
                ? <textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{minHeight:"90px",fontSize:"14px",lineHeight:1.7}} />
                : <div style={{padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"14px",lineHeight:1.7,color:T.textM,whiteSpace:"pre-wrap"}}>{tmpl.text}</div>
              }
              {!isEditing&&<div style={{display:"flex",justifyContent:"flex-end",marginTop:"10px"}}><button onClick={()=>navigator.clipboard.writeText(tmpl.text)} style={{background:"none",border:`1px solid ${T.border}`,color:T.textD,borderRadius:T.r.m,padding:"7px 14px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",minHeight:"40px"}}>📋 Copia</button></div>}
            </Card>
          );
        })}
      </div>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo template">
        <FormField label="Nome"><input value={newForm.name} onChange={e=>setNewForm(p=>({...p,name:e.target.value}))} placeholder="Es. Ringraziamento personalizzato" /></FormField>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
          <FormField label="Fase"><select value={newForm.phase} onChange={e=>setNewForm(p=>({...p,phase:e.target.value}))}><option value="thankyou">Ringraziamento</option><option value="check">Controllo</option><option value="review">Recensione</option><option value="reactivation">Riattivazione</option></select></FormField>
          <FormField label="Canale"><select value={newForm.channel} onChange={e=>setNewForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
        </div>
        <FormField label="Testo" hint="Usa [Nome] come segnaposto."><textarea value={newForm.text} onChange={e=>setNewForm(p=>({...p,text:e.target.value}))} placeholder="Ciao [Nome]! ..." style={{minHeight:"100px"}} /></FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!newForm.name.trim()||!newForm.text.trim()}>Salva</Btn></div>
      </Modal>
    </div>
  );
};

// ── FEEDBACK ─────────────────────────────────────────────────────────────────
const Feedback = () => {
  const {data}=useSliss();
  const reviewLink=data.settings?.reviewLink||"";
  const clientsWithFeedback=new Set(data.feedbacks.map(f=>f.clientId));
  const clientsWithout=data.clients.filter(c=>!clientsWithFeedback.has(c.id)&&(c.status==="active"||c.status==="vip"||c.status==="new"));
  const avgR=data.feedbacks.length?(data.feedbacks.reduce((a,f)=>a+f.rating,0)/data.feedbacks.length).toFixed(1):"—";
  const reviewMsg=name=>`Ciao ${name}! Spero tu sia rimasto/a soddisfatto/a 🙏 Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. ${reviewLink}`.trim();

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Feedback" />
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"20px"}}>
        {[{label:"Media",value:avgR,color:T.purple},{label:"Totali",value:data.feedbacks.length,color:T.blue},{label:"Consigliano",value:data.feedbacks.filter(f=>f.wouldRecommend).length,color:T.green}].map((s,i)=>(
          <Card key={i} style={{padding:"14px 12px",display:"flex",flexDirection:"column",gap:"4px"}}>
            <span style={{fontSize:"11px",color:T.textD,fontWeight:500}}>{s.label}</span>
            <span style={{fontSize:"24px",fontWeight:700,color:s.color,lineHeight:1}}>{s.value}</span>
          </Card>
        ))}
      </div>
      {clientsWithout.length>0&&(
        <Card style={{marginBottom:"16px"}}>
          <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>Richiedi recensione <span style={{fontSize:"12px",fontWeight:400,color:T.textD,marginLeft:"4px"}}>{clientsWithout.length} clienti</span></h2>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {clientsWithout.map(cl=>(
              <div key={cl.id} style={{padding:"12px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
                <div style={{fontWeight:600,fontSize:"14px",marginBottom:"3px"}}>{cl.name}</div>
                <div style={{fontSize:"12px",color:T.textD,marginBottom:"10px"}}>{cl.channel} · {daysAgo(cl.lastVisit)}</div>
                <SendButtons message={reviewMsg(cl.name)} clientPhone={cl.phone} />
              </div>
            ))}
          </div>
        </Card>
      )}
      <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px",color:T.textM}}>Ricevuti</h2>
      {!data.feedbacks.length
        ? <Empty icon="⭐" title="Nessun feedback" desc="Appariranno qui quando i clienti risponderanno." />
        : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {data.feedbacks.map((fb,i)=>{
              const cl=data.clients.find(c=>c.id===fb.clientId);
              return (
                <Card key={fb.id} style={{animation:`fadeIn .3s ease ${i*.05}s both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><div style={{fontWeight:600,fontSize:"14px",marginBottom:"5px"}}>{cl?.name||"—"}</div><div style={{fontSize:"17px",marginBottom:"7px"}}>{"⭐".repeat(fb.rating)}{"☆".repeat(5-fb.rating)}</div>{fb.comment&&<div style={{fontSize:"13px",color:T.textM,lineHeight:1.6,fontStyle:"italic"}}>"{fb.comment}"</div>}</div>
                    <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:"11px",color:T.textD,marginBottom:"5px"}}>{fmtDate(fb.date)}</div>{fb.wouldRecommend&&<Badge label="Consiglia" color={T.green} bg={T.greenS} s />}</div>
                  </div>
                </Card>
              );
            })}
          </div>
      }
    </div>
  );
};

// ── MODULI ───────────────────────────────────────────────────────────────────
const ModulesMap = () => {
  const stL={active:"Attivo",planned:"In arrivo",future:"Futuro"};
  const stS={active:{color:T.green,bg:T.greenS},planned:{color:T.amber,bg:T.amberS},future:{color:T.textD,bg:"rgba(90,111,148,0.08)"}};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Moduli" />
      <p style={{color:T.textD,fontSize:"13px",marginBottom:"20px"}}>Ogni modulo si attiva quando c'è una richiesta reale dai clienti.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"10px"}}>
        {MODULES.map((mod,i)=>{
          const ss=stS[mod.status];
          return (
            <div key={mod.id} style={{background:T.bg2,border:`1px solid ${mod.status==="active"?`${mod.color}40`:T.border}`,borderRadius:T.r.l,padding:"16px",animation:`fadeIn .3s ease ${i*.04}s both`}}>
              <div style={{width:"40px",height:"40px",borderRadius:T.r.m,background:`${mod.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",marginBottom:"10px"}}>{mod.icon}</div>
              <div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{mod.name}</div>
              <div style={{fontSize:"11px",color:T.textD,lineHeight:1.5,marginBottom:"10px"}}>{mod.desc}</div>
              <Badge label={stL[mod.status]} {...ss} s />
              {mod.status==="active"&&<div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"8px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}} /><span style={{fontSize:"11px",color:T.green,fontWeight:600}}>Attivo</span></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── IMPOSTAZIONI ─────────────────────────────────────────────────────────────
const Settings = () => {
  const {data,updateSettings,resetData}=useSliss();
  const s=data.settings||{};
  const [bName,setBName]=useState(s.businessName||"");
  const [currentCluster,setCurrentCluster]=useState(s.cluster||"altro");
  const [reviewLink,setReviewLink]=useState(s.reviewLink||"");
  const [timings,setTimings]=useState(s.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60});
  const [saved,setSaved]=useState(false);
  const handleSave=()=>{updateSettings({businessName:bName,reviewLink,cluster:currentCluster,followUpTimings:timings});setSaved(true);setTimeout(()=>setSaved(false),2000);};

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Impostazioni" />
      <Card style={{marginBottom:"14px"}}>
        <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"16px"}}>Attività</h3>
        <FormField label="Nome attività" hint="Appare nel saluto della Home"><input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" /></FormField>
        <FormField label="Settore" hint="Usato per adattare i template ai tuoi clienti">
          <select value={currentCluster} onChange={e=>setCurrentCluster(e.target.value)}>
            {Object.entries(CLUSTERS).map(([key,cl])=>(
              <option key={key} value={key}>{cl.icon} {cl.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Link Google Reviews" hint="Aggiunto ai messaggi di richiesta recensione"><input value={reviewLink} onChange={e=>setReviewLink(e.target.value)} placeholder="https://g.page/r/..." /></FormField>
      </Card>
      <Card style={{marginBottom:"14px"}}>
        <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"4px"}}>Timing follow-up</h3>
        <p style={{fontSize:"12px",color:T.textD,marginBottom:"16px"}}>Quando inviare ogni fase dopo l'appuntamento.</p>
        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}>
          <div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:500}}>Ringraziamento</div><div style={{fontSize:"12px",color:T.textMu}}>Ore dopo l'appuntamento</div></div>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}><input type="number" min="0" max="48" value={timings.thankyouHours||2} onChange={e=>setTimings(p=>({...p,thankyouHours:parseInt(e.target.value)||0}))} style={{width:"70px",textAlign:"center"}} /><span style={{fontSize:"13px",color:T.textD}}>ore</span></div>
        </div>
        {[{key:"check",label:"Controllo",note:"7 giorni"},{key:"review",label:"Recensione",note:"21 giorni"},{key:"reactivation",label:"Riattivazione",note:"60 giorni"}].map(({key,label,note})=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}>
            <div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:500}}>{label}</div><div style={{fontSize:"12px",color:T.textMu}}>Di solito {note}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}><input type="number" min="0" max="365" value={timings[key]} onChange={e=>setTimings(p=>({...p,[key]:parseInt(e.target.value)||0}))} style={{width:"70px",textAlign:"center"}} /><span style={{fontSize:"13px",color:T.textD}}>giorni</span></div>
          </div>
        ))}
      </Card>
      <Card style={{marginBottom:"20px"}}>
        <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"10px"}}>Dati</h3>
        <p style={{fontSize:"13px",color:T.textD,lineHeight:1.7,marginBottom:"14px"}}>I dati sono salvati nel browser. Usa sempre lo stesso dispositivo e browser.</p>
        <Btn v="danger" s="sm" onClick={()=>{if(window.confirm("Reset completo? Tutti i dati verranno eliminati."))resetData();}}>🗑️ Reset dati</Btn>
      </Card>
      <Btn onClick={handleSave} style={{width:"100%",justifyContent:"center"}}>{saved?"✓ Salvato!":"Salva impostazioni"}</Btn>
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
  const [showOnboarding,setShowOnboarding]=useState(false);

  useEffect(()=>{
    Promise.all([loadData(),isOnboarded()]).then(([d,ob])=>{
      setData(d);
      setShowOnboarding(!ob);
      setLoading(false);
    });
  },[]);

  useEffect(()=>{ if(data&&!loading) saveData(data); },[data,loading]);

  const update=useCallback((table,id,updates)=>setData(prev=>({...prev,[table]:(prev[table]||[]).map(r=>r.id===id?{...r,...updates}:r)})),[]);
  const addRecord=useCallback((table,record)=>setData(prev=>({...prev,[table]:[...(prev[table]||[]),record]})),[]);
  const deleteRecord=useCallback((table,id)=>setData(prev=>({...prev,[table]:(prev[table]||[]).filter(r=>r.id!==id)})),[]);
  const updateSettings=useCallback((updates)=>setData(prev=>({...prev,settings:{...prev.settings,...updates}})),[]);
  const resetData=useCallback(()=>{const d=emptyData();setData(d);saveData(d);},[]);

  if(loading||!data) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:T.bg}}>
      <div style={{textAlign:"center"}}>
        <div style={{marginBottom:"16px"}}><SlissLogo size={28} /></div>
        <div style={{color:T.textD,fontSize:"13px",animation:"pulse 1.5s infinite"}}>Caricamento...</div>
      </div>
    </div>
  );

  const ctx={data,update,addRecord,deleteRecord,updateSettings,resetData};
  const td=today();
  const pendingCount=(data.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td).length;

  const bizType=data?.settings?.bizType||"";
  const viewMap={
    home:<Home setView={setView}/>,
    appointments:<Appointments/>,
    orders:<Orders/>,
    followup:<FollowUp/>,
    clients:<Clients/>,
    templates:<Templates/>,
    feedback:<Feedback/>,
    modules:<ModulesMap/>,
    settings:<Settings/>,
    more:<MoreMenu setView={setView}/>,
  };
  const CurrentView=viewMap[view]||viewMap.home;

  if(showOnboarding) return <Ctx.Provider value={ctx}><GlobalCSS /><Onboarding onComplete={()=>setShowOnboarding(false)} /></Ctx.Provider>;

  return (
    <Ctx.Provider value={ctx}>
      <GlobalCSS />
      <div style={{display:"flex",minHeight:"100vh"}}>
        <DesktopSidebar view={view} setView={setView} />
        <main style={{flex:1,padding:"24px 20px",paddingBottom:"calc(80px + env(safe-area-inset-bottom))",maxWidth:"680px",margin:"0 auto",width:"100%"}} className="mobile-only" >
          {CurrentView}
        </main>
        <main style={{flex:1,marginLeft:"210px",padding:"28px 36px",maxWidth:"1040px"}} className="desktop-only">
          {CurrentView}
        </main>
      </div>
      <BottomNav view={view} setView={setView} pendingCount={pendingCount} />
    </Ctx.Provider>
  );
}
