import React, { useState, useEffect, useCallback } from "react";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = {hasError:false,msg:"",stack:""}; }
  static getDerivedStateFromError(e) { return {hasError:true,msg:e?.message||String(e)}; }
  componentDidCatch(e,info) {
    console.error("[Sliss] Crash:", e, info?.componentStack);
    this.setState({stack:info?.componentStack||""});
  }
  handleReset() {
    try { Object.keys(localStorage).filter(k=>k.startsWith("sliss")).forEach(k=>localStorage.removeItem(k)); } catch(_) {}
    window.location.reload();
  }
  render() {
    if(this.state.hasError) return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F8F9FA",padding:"20px",fontFamily:"sans-serif"}}>
        <div style={{textAlign:"center",maxWidth:"480px"}}>
          <div style={{fontSize:"44px",marginBottom:"16px"}}>⚠️</div>
          <h2 style={{fontSize:"18px",fontWeight:700,marginBottom:"8px",color:"#111318"}}>Qualcosa è andato storto</h2>
          <p style={{fontSize:"14px",color:"#868E96",lineHeight:1.6,marginBottom:"8px"}}>L'app ha incontrato un errore. Prova prima a ricaricare; se non basta, usa il reset completo.</p>
          {this.state.msg&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:"8px",padding:"10px 14px",marginBottom:"8px",fontSize:"12px",color:"#DC2626",fontFamily:"monospace",textAlign:"left",wordBreak:"break-all"}}>{this.state.msg}</div>}
          {this.state.stack&&<details style={{marginBottom:"16px",textAlign:"left"}}><summary style={{fontSize:"12px",color:"#868E96",cursor:"pointer"}}>Dettaglio tecnico</summary><div style={{background:"#F1F3F5",borderRadius:"6px",padding:"8px 10px",marginTop:"6px",fontSize:"11px",color:"#495057",fontFamily:"monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",maxHeight:"150px",overflow:"auto"}}>{this.state.stack}</div></details>}
          <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>window.location.reload()} style={{padding:"12px 20px",background:"#16A34A",color:"#fff",border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>🔄 Ricarica</button>
            <button onClick={()=>this.handleReset()} style={{padding:"12px 20px",background:"#DC2626",color:"#fff",border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>🗑️ Reset e ricomincia</button>
          </div>
        </div>
      </div>
    );
    return this.props.children;
  }
}
import T from "./theme.js";
import { loadData, saveData, isOnboarded, setOnboarded, emptyData, storage, ONBOARDING_KEY } from "./storage.js";
import { PHASES, PRODUCT_PHASES, STATUSES, CLIENT_ST, CLUSTERS_SERVIZI, CLUSTERS_PRODOTTI, CLUSTERS, CLUSTER_TEMPLATES, MODULES } from "./config.js";
import { fmtDate, daysAgo, daysUntil, addDays, uid, today, greet, urlBase64ToUint8Array } from "./helpers.js";
import { Ctx, useSliss } from "./context.js";
import SlissLogo from "./components/SlissLogo.jsx";
import GlobalCSS from "./GlobalCSS.jsx";
import { Badge, Btn, Card, Empty, Search, Tabs, Modal, FormField, SendButtons, PageHeader } from "./components/ui.jsx";

// ── Push notifications ────────────────────────────────────────────────────────
const subscribeToPush = async () => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return false;
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  const sub = existing || await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
  });
  const tester = new URLSearchParams(window.location.search).get('tester') || localStorage.getItem('sliss-tester') || 'unknown';
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON(), tester })
  });
  return true;
};

// ── Onboarding ───────────────────────────────────────────────────────────────
const Onboarding = ({onComplete}) => {
  const {updateSettings, addRecord} = useSliss();
  const [step, setStep] = useState(0);
  const [bName, setBName] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [bizType, setBizType] = useState("");
  const [cluster, setCluster] = useState("");
  const [customSector, setCustomSector] = useState("");
  const clustersForType = bizType === "prodotti" ? CLUSTERS_PRODOTTI : CLUSTERS_SERVIZI;
  const isCustomCluster = cluster === "altro_s" || cluster === "altro_p";
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;
  const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS/.test(navigator.userAgent);
  const needsPWAStep = isIOS && !isStandalone;
  const needsSafariSwitch = needsPWAStep && !isSafari;
  // Salva dati e segna come onboardato — chiamato allo step 4 prima dello step Safari
  const saveProgress = () => {
    const updates = {businessName:bName.trim(),bizType,cluster,customSector:isCustomCluster?customSector:"",reviewLink:reviewLink.trim()};
    updateSettings(updates);
    if(bizType==="servizi"&&cluster&&CLUSTER_TEMPLATES[cluster]) CLUSTER_TEMPLATES[cluster].forEach(t=>addRecord("templates",{...t,id:uid()}));
    if(bizType==="prodotti") {
      const tpls = CLUSTER_TEMPLATES[cluster] || CLUSTER_TEMPLATES["altro_p"];
      if(tpls) tpls.forEach(t=>addRecord("templates",{...t,id:uid()}));
    }
    setOnboarded();
  };

  const doComplete = () => { saveProgress(); onComplete(); };

  const requestAndSubscribe = async () => {
    try { await subscribeToPush(); } catch(e) { console.error(e); }
    onComplete();
  };
  const renderStep = () => {
    switch(step) {
      case 0: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F44B}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Benvenuto in Sliss</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"24px"}}>Lo strumento operativo per professionisti che vogliono curare i propri clienti senza perdere tempo.</p>
        <Btn onClick={()=>setStep(1)} style={{width:"100%",justifyContent:"center"}}>{"Inizia \u{2192}"}</Btn>
      </>;
      case 1: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F4BC}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Come si chiama la tua attività?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Apparirà nel saluto della home. Potrai cambiarlo nelle impostazioni.</p>
        <input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" style={{fontSize:"18px",padding:"14px 16px",textAlign:"center",marginBottom:"16px"}} autoFocus />
        <div style={{marginBottom:"20px",textAlign:"left"}}>
          <label style={{fontSize:"12px",color:T.textD,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:"7px"}}>Link Google Reviews <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(opzionale)</span></label>
          <input value={reviewLink} onChange={e=>setReviewLink(e.target.value)} placeholder="https://g.page/r/..." style={{fontSize:"14px"}} />
        </div>
        <Btn onClick={()=>setStep(2)} disabled={!bName.trim()} style={{width:"100%",justifyContent:"center"}}>{"Avanti \u{2192}"}</Btn>
      </>;
      case 2: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F3AF}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Come lavori?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Sliss si adatta al tuo tipo di attività.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {[{key:"servizi",icon:"\u{1F5D3}\u{FE0F}",label:"Offro servizi con appuntamento",desc:"Tatuaggi, barber, estetica, officine..."},{key:"prodotti",icon:"\u{1F4E6}",label:"Vendo prodotti",desc:"Stampa 3D, negozio, prodotti artigianali..."}].map(opt=>(
            <button key={opt.key} onClick={()=>{setBizType(opt.key);setCluster("");setCustomSector("");setStep(3);}} style={{display:"flex",alignItems:"center",gap:"14px",padding:"16px 18px",background:T.bg2,border:`1.5px solid ${T.border}`,borderRadius:T.r.l,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:"26px"}}>{opt.icon}</span>
              <div><div style={{fontSize:"15px",fontWeight:500,color:T.text}}>{opt.label}</div><div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{opt.desc}</div></div>
            </button>
          ))}
        </div>
      </>;
      case 3: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F3F7}\u{FE0F}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>In quale settore lavori?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Sliss adatterà i template al tuo settore.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:isCustomCluster?"16px":"0"}}>
          {Object.entries(clustersForType).map(([key,cl])=>(
            <button key={key} onClick={()=>{setCustomSector("");setCluster(key);if(key!=="altro_s"&&key!=="altro_p")setStep(4);}} style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 18px",background:cluster===key?T.greenS:T.bg2,border:`1.5px solid ${cluster===key?T.green:T.border}`,borderRadius:T.r.l,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:"22px"}}>{cl.icon}</span>
              <span style={{fontSize:"15px",fontWeight:cluster===key?600:400,color:cluster===key?T.green:T.text}}>{cl.label}</span>
            </button>
          ))}
        </div>
        {isCustomCluster&&<>
          <input value={customSector} onChange={e=>setCustomSector(e.target.value)} placeholder="Descrivi il tuo settore..." style={{fontSize:"15px",margin:"0 0 20px"}} autoFocus />
          <Btn onClick={()=>setStep(4)} disabled={!customSector.trim()} style={{width:"100%",justifyContent:"center"}}>{"Avanti \u{2192}"}</Btn>
        </>}
      </>;
      case 4: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F680}"}</div>
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
        <Btn onClick={needsPWAStep?()=>{saveProgress();setStep(5);}:doComplete} style={{width:"100%",justifyContent:"center"}}>{needsPWAStep?"Avanti \u{2192}":"Apri Sliss \u{2192}"}</Btn>
      </>;
      case 5: return <>
        {needsSafariSwitch ? <>
          <div style={{fontSize:"52px",marginBottom:"20px"}}>{"🌐"}</div>
          <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Apri Sliss con Safari</h1>
          <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"24px"}}>Le notifiche push su iPhone funzionano solo da Safari, non da Chrome.</p>
          <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:T.r.l,padding:"16px",marginBottom:"24px",textAlign:"left"}}>
            <div style={{fontSize:"13px",color:T.textM,marginBottom:"10px",fontWeight:600}}>Copia il link e aprilo in Safari:</div>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <div style={{flex:1,fontSize:"13px",padding:"10px 12px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.r.l,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>sliss-platform.vercel.app</div>
              <Btn onClick={()=>navigator.clipboard?.writeText("https://sliss-platform.vercel.app")} style={{padding:"10px 14px",fontSize:"13px",flexShrink:0}}>Copia</Btn>
            </div>
          </div>
          <button onClick={doComplete} style={{fontSize:"14px",color:T.textD,background:"none",border:"none",cursor:"pointer",padding:"8px",width:"100%"}}>Salta per ora</button>
        </> : <>
          <div style={{fontSize:"52px",marginBottom:"20px"}}>{"📲"}</div>
          <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Installa Sliss sul tuo iPhone</h1>
          <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Per ricevere i reminder, aggiungi Sliss alla schermata Home.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"24px"}}>
            {[
              {n:1,txt:<>Tocca <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,background:T.greenS,border:`1px solid ${T.green}`,borderRadius:"5px",margin:"0 3px",verticalAlign:"middle"}}><svg width="11" height="13" viewBox="0 0 11 13" fill="none"><path d="M5.5 1v7M2.5 4l3-3 3 3" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="0.9" y="7.5" width="9.2" height="4.6" rx="1.5" stroke="#16A34A" strokeWidth="1.8"/></svg></span> in basso su Safari</>},
              {n:2,txt:'"Aggiungi a schermata Home"'},
              {n:3,txt:'"Aggiungi" in alto a destra'},
            ].map(({n,txt})=>(
              <div key={n} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",background:T.bg2,borderRadius:T.r.l,border:`1px solid ${T.border}`,textAlign:"left"}}>
                <div style={{width:"26px",height:"26px",borderRadius:"50%",background:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0}}>{n}</div>
                <span style={{fontSize:"14px",color:T.textM,lineHeight:1.5}}>{txt}</span>
              </div>
            ))}
          </div>
          <Btn onClick={requestAndSubscribe} style={{width:"100%",justifyContent:"center",marginBottom:"12px"}}>{"Ho installato, inizia \u{2192}"}</Btn>
          <button onClick={doComplete} style={{fontSize:"14px",color:T.textD,background:"none",border:"none",cursor:"pointer",padding:"8px",width:"100%"}}>Salta per ora</button>
        </>}
      </>;
      default: return null;
    }
  };
  return (
    <div translate="no" lang="it" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",background:T.bg,animation:"fadeIn .5s ease"}}>
      <div style={{width:"100%",maxWidth:"400px",textAlign:"center"}}>
        <div style={{marginBottom:"20px"}}><SlissLogo size={32} /></div>
        {renderStep()}
        <div style={{display:"flex",gap:"6px",justifyContent:"center",marginTop:"28px"}}>
          {Array.from({length:needsPWAStep?6:5},(_,i)=><div key={i} style={{width:i===step?20:6,height:"6px",borderRadius:"3px",background:i===step?T.green:T.border,transition:"all .3s"}} />)}
        </div>
      </div>
    </div>
  );
};

// ── Navigation ───────────────────────────────────────────────────────────────
const getNavMain = (bizType) => {
  const agendaItem = bizType==="prodotti" ? {id:"orders",icon:"\u{1F4E6}",label:"Ordini in corso"} : {id:"appointments",icon:"\u{1F4C5}",label:"Agenda"};
  return [{id:"home",icon:"\u{1F3E0}",label:"Home"},{id:"clients",icon:"\u{1F465}",label:"Clienti"},agendaItem,{id:"followup",icon:"\u{1F4AC}",label:"Follow-Up"}];
};

const BottomNav = ({view,setView,pendingCount,bizType=""}) => (
  <nav className="mobile-only" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"#FFFFFF",borderTop:"1px solid #DEE2E6",boxShadow:"0 -1px 0 rgba(0,0,0,0.06)",display:"flex",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)"}}>
    {getNavMain(bizType).map(n=>{
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
      <span style={{fontSize:"22px",lineHeight:1}}>{"\u{22EF}"}</span>
      <span style={{fontSize:"11px",fontWeight:400}}>Altro</span>
    </button>
  </nav>
);

const MoreMenu = ({setView}) => {
  const items=[{id:"templates",icon:"\u{1F4DD}",label:"Template",desc:"Gestisci i messaggi"},{id:"feedback",icon:"\u{2B50}",label:"Feedback",desc:"Recensioni clienti"},{id:"modules",icon:"\u{1F9E9}",label:"Moduli",desc:"Funzioni aggiuntive"},{id:"settings",icon:"\u{2699}\u{FE0F}",label:"Impostazioni",desc:"Personalizza Sliss"}];
  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"22px"}}>Altro</h1>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {items.map(it=>(
          <Card key={it.id} hov onClick={()=>setView(it.id)} style={{display:"flex",alignItems:"center",gap:"14px",padding:"16px 18px"}}>
            <div style={{width:"44px",height:"44px",borderRadius:T.r.l,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>{it.icon}</div>
            <div><div style={{fontWeight:600,fontSize:"15px"}}>{it.label}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{it.desc}</div></div>
            <span style={{marginLeft:"auto",color:T.textMu,fontSize:"18px"}}>{"\u{203A}"}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

const DesktopSidebar = ({view,setView}) => {
  const {data:sData}=useSliss();
  const allNav=[...getNavMain(sData?.settings?.bizType||""),{id:"templates",icon:"\u{1F4DD}",label:"Template"},{id:"feedback",icon:"\u{2B50}",label:"Feedback"},{id:"modules",icon:"\u{1F9E9}",label:"Moduli"},{id:"settings",icon:"\u{2699}\u{FE0F}",label:"Impostazioni"}];
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
        <div style={{fontSize:"10px",color:T.textMu}}>Sliss v5.0 · liscio come deve essere.</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════

const Home = ({setView}) => {
  const {data,update,addRecord}=useSliss();
  const [showQuickAdd,setShowQuickAdd]=useState(false);
  const [qDone,setQDone]=useState(false);
  const [qForm,setQForm]=useState({name:"",phone:"",date:today(),serviceType:"Sessione",product:""});
  const td=today();
  const biz=data.settings?.businessName||"la tua attivit\u{e0}";
  const bizType=data?.settings?.bizType||"servizi";
  const cluster=data?.settings?.cluster||"altro_s";
  const clusterSvcTypes=(CLUSTERS_SERVIZI[cluster]?.serviceTypes)||CLUSTERS_SERVIZI.altro_s.serviceTypes;
  const pending=(data?.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td);
  const awaiting=(data?.followUps||[]).filter(f=>f.status==="sent"&&!f.satisfaction);
  const activeC=(data?.clients||[]).filter(c=>c.status==="active"||c.status==="vip");
  const toReact=(data?.clients||[]).filter(c=>c.status==="to_reactivate");
  const handleQuickAdd=()=>{
    if(!qForm.name.trim()||!qForm.phone.trim())return;
    let clientId=(data?.clients||[]).find(c=>c.phone===qForm.phone)?.id;
    if(!clientId){clientId=uid();addRecord("clients",{id:clientId,name:qForm.name.trim(),phone:qForm.phone.trim(),email:"",channel:"WhatsApp",status:"active",tags:[],notes:"",firstVisit:qForm.date,lastVisit:qForm.date});}
    if(bizType==="servizi"){const apptId=uid();const timings=data?.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};addRecord("appointments",{id:apptId,clientId,date:qForm.date,serviceType:qForm.serviceType,notes:""});buildFollowUps(apptId,clientId,qForm.name.trim(),qForm.date,qForm.serviceType,timings).forEach(fu=>addRecord("followUps",fu));}
    else{const orderId=uid();addRecord("orders",{id:orderId,clientId,product:qForm.product||"Ordine",orderDate:qForm.date,status:"pending",notes:""});buildProductFollowUps(orderId,clientId,qForm.name.trim(),qForm.date,null).forEach(fu=>addRecord("followUps",fu));}
    setQDone(true);setTimeout(()=>{setQDone(false);setShowQuickAdd(false);setQForm({name:"",phone:"",date:today(),serviceType:clusterSvcTypes[0],product:""});},1500);
  };
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:"16px"}}>
        <div style={{fontSize:"13px",color:T.textD,marginBottom:"3px"}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</div>
        <h1 style={{fontSize:"26px",fontWeight:700,letterSpacing:"-.03em",lineHeight:1.2}}>{greet()},<br/><span style={{color:T.green}}>{biz}</span> {"\u{1F44B}"}</h1>
      </div>
      <Btn onClick={()=>setShowQuickAdd(true)} style={{width:"100%",justifyContent:"center",marginBottom:"10px"}}>{"+ Aggiungi cliente"}</Btn>
      {data?.settings?.reviewLink&&<div style={{textAlign:"center",marginBottom:"16px"}}><a href={data.settings.reviewLink} target="_blank" rel="noreferrer" style={{fontSize:"13px",color:T.textD,textDecoration:"none"}}>{"\u{2B50}"} Vedi recensioni</a></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"20px"}}>
        {[{label:"Da inviare",value:pending.length,color:pending.length?T.amber:T.green,sub:pending.length?"oggi":"tutto ok"},{label:"In attesa",value:awaiting.length,color:T.blue,sub:"risposta"},{label:"Attivi",value:activeC.length,color:T.green,sub:`${toReact.length} da riatt.`}].map((s,i)=>(
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
          ? <div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:"24px",marginBottom:"6px"}}>{"\u{2705}"}</div><div style={{fontSize:"13px",color:T.textD}}>Tutto fatto per oggi!</div></div>
          : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {pending.slice(0,3).map(fu=>{
                const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);
                const ph=PHASES[fu.phase]||{icon:"📋",label:fu.phase,color:T.textD,bg:T.bg3};
                return (
                  <div key={fu.id} style={{padding:"12px",background:fu.scheduledDate<td?T.redS:T.amberS,borderRadius:T.r.m,border:`1px solid ${fu.scheduledDate<td?T.red:T.amber}44`,borderLeft:`4px solid ${fu.scheduledDate<td?T.red:T.amber}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                      <span style={{fontSize:"16px"}}>{ph.icon}</span>
                      <span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"\u{2014}"}</span>
                      <Badge {...ph} s />
                    </div>
                    <div style={{fontSize:"13px",color:T.textD,lineHeight:1.5,marginBottom:"10px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{fu.message}</div>
                    <SendButtons message={fu.message} clientPhone={cl?.phone||""} onSend={()=>update("followUps",fu.id,{status:"sent",sentDate:today()})} />
                  </div>
                );
              })}
              {pending.length>3&&<button onClick={()=>setView("followup")} style={{width:"100%",padding:"10px",background:"none",border:`1px solid ${T.border}`,borderRadius:T.r.m,color:T.textM,fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{"Vedi tutti i "+pending.length+" follow-up \u{2192}"}</button>}
            </div>
        }
      </Card>
      <Card>
        <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>Clienti</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
          {(data?.clients||[]).slice(0,5).map(cl=>{
            const st=CLIENT_ST[cl.status]||{label:cl.status,color:T.textD,bg:T.bg3};
            return (<div key={cl.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:T.bg3,borderRadius:T.r.m}}><div style={{width:"7px",height:"7px",borderRadius:"50%",background:st.color,flexShrink:0}} /><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl.name}</div><div style={{fontSize:"11px",color:T.textD}}>{daysAgo(cl.lastVisit)}</div></div><Badge {...st} s /></div>);
          })}
          {(data?.clients||[]).length===0&&<div style={{fontSize:"13px",color:T.textD,textAlign:"center",padding:"12px 0"}}>Nessun cliente ancora</div>}
        </div>
      </Card>
      <Modal open={showQuickAdd} onClose={()=>{setShowQuickAdd(false);setQDone(false);}} title="Nuovo cliente">
        {qDone
          ?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:"44px",marginBottom:"12px"}}>{"\u{2705}"}</div><div style={{fontWeight:700,fontSize:"16px",marginBottom:"6px"}}>Salvato!</div><div style={{fontSize:"13px",color:T.textD}}>Follow-up generati automaticamente.</div></div>
          :<>
            <FormField label="Nome"><input value={qForm.name} onChange={e=>setQForm(p=>({...p,name:e.target.value}))} placeholder="Nome Cognome" /></FormField>
            <FormField label="WhatsApp"><input value={qForm.phone} onChange={e=>setQForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" type="tel" /></FormField>
            <FormField label={bizType==="prodotti"?"Data ordine":"Data appuntamento"}><input value={qForm.date} onChange={e=>setQForm(p=>({...p,date:e.target.value}))} type="date" /></FormField>
            {bizType==="servizi"
              ?<FormField label="Tipo servizio"><select value={qForm.serviceType} onChange={e=>setQForm(p=>({...p,serviceType:e.target.value}))}>{clusterSvcTypes.map(s=><option key={s}>{s}</option>)}</select></FormField>
              :<FormField label="Prodotto"><input value={qForm.product} onChange={e=>setQForm(p=>({...p,product:e.target.value}))} placeholder="Es. Stampa figurina" /></FormField>
            }
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowQuickAdd(false)}>Annulla</Btn><Btn onClick={handleQuickAdd} disabled={!qForm.name.trim()||!qForm.phone.trim()}>Salva e genera</Btn></div>
          </>
        }
      </Modal>
    </div>
  );
};

const FollowUp = ({setView}) => {
  const {data,update}=useSliss();
  const [filter,setFilter]=useState("today");
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const [editMsg,setEditMsg]=useState(null);
  const td=today();
  const allFU=data?.followUps||[];
  const tabs=[{id:"today",label:"Da inviare",count:allFU.filter(f=>f.status==="pending"&&f.scheduledDate<=td).length},{id:"awaiting",label:"In attesa",count:allFU.filter(f=>f.status==="sent").length},{id:"all",label:"Tutti",count:allFU.length}];
  const filtered=allFU.filter(fu=>{const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);const ms=!search||cl?.name.toLowerCase().includes(search.toLowerCase());const mf=filter==="all"||(filter==="today"&&fu.status==="pending"&&fu.scheduledDate<=td)||(filter==="awaiting"&&fu.status==="sent");return ms&&mf;}).sort((a,b)=>new Date(a.scheduledDate)-new Date(b.scheduledDate));
  const markSent=fu=>{update("followUps",fu.id,{status:"sent",sentDate:today()});if(sel?.id===fu.id)setSel({...fu,status:"sent",sentDate:today()});};
  const pendingToday=allFU.filter(f=>f.status==="pending"&&f.scheduledDate<=td);
  const markAllSent=()=>{if(!pendingToday.length)return;if(!window.confirm(`Segna tutti i ${pendingToday.length} follow-up come inviati?`))return;pendingToday.forEach(fu=>update("followUps",fu.id,{status:"sent",sentDate:today()}));};
  const allDone=filter==="today"&&pendingToday.length===0&&allFU.some(f=>f.sentDate===td);
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
        <h1 style={{fontSize:"22px",fontWeight:700}}>Follow-Up</h1>
        {pendingToday.length>0&&<Btn v="success" s="sm" onClick={markAllSent}>{"\u{2713}"} Tutti ({pendingToday.length})</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"8px"}}><Tabs tabs={tabs} active={filter} onChange={setFilter} /><Search value={search} onChange={setSearch} placeholder="Cerca cliente..." /></div>
      {setView&&<div style={{textAlign:"right",marginBottom:"12px"}}><button onClick={()=>setView("templates")} style={{background:"none",border:"none",color:T.blue,fontSize:"13px",cursor:"pointer",padding:"4px 0",fontFamily:"inherit",textDecoration:"underline"}}>{"\u{1F4DD}"} Modifica template</button></div>}
      {allDone
        ? <div style={{textAlign:"center",padding:"60px 20px",animation:"fadeIn .4s ease"}}><div style={{fontSize:"52px",marginBottom:"16px"}}>{"\u{1F389}"}</div><div style={{fontSize:"20px",fontWeight:700,marginBottom:"8px"}}>Ottimo lavoro!</div><div style={{fontSize:"14px",color:T.textM}}>Tutti i follow-up di oggi sono stati inviati.</div><div style={{fontSize:"13px",color:T.textD,marginTop:"6px"}}>I tuoi clienti si sentiranno seguiti.</div></div>
        : !filtered.length
        ? <Empty icon={"\u{1F4ED}"} title="Nessun follow-up" desc="Non ci sono follow-up per questo filtro." />
        : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {filtered.map((fu,i)=>{const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);const ph=PHASES[fu.phase]||{icon:"📋",label:fu.phase,color:T.textD,bg:T.bg3};const st=STATUSES[fu.status]||{label:fu.status,color:T.textD,bg:T.bg3};const timing=fu.status==="pending"?daysUntil(fu.scheduledDate):daysAgo(fu.sentDate);const cardColor=fu.status==="sent"?T.green:fu.scheduledDate<td?T.red:fu.scheduledDate===td?T.amber:T.border;const cardBg=fu.status==="sent"?T.greenS:fu.scheduledDate<td?T.redS:fu.scheduledDate===td?T.amberS:"transparent";return (
              <Card key={fu.id} hov onClick={()=>setSel(fu)} style={{borderLeft:`4px solid ${cardColor}`,background:cardBg,animation:`fadeIn .3s ease ${i*.03}s both`}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
                  <span style={{fontSize:"20px",marginTop:"2px",flexShrink:0}}>{ph.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px",flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"\u{2014}"}</span><Badge {...ph} s /><Badge {...st} s /></div>
                    <div style={{fontSize:"13px",color:T.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"8px"}}>{fu.message}</div>
                    {fu.status==="pending"&&<SendButtons message={fu.message} clientPhone={cl?.phone||""} onSend={()=>markSent(fu)} />}
                  </div>
                  <div style={{flexShrink:0,textAlign:"right"}}><span style={{fontSize:"11px",color:T.textMu}}>{timing}</span></div>
                </div>
              </Card>
            );})}
          </div>
      }
      <Modal open={!!sel} onClose={()=>{setSel(null);setEditMsg(null);}} title="Dettaglio Follow-Up">
        {sel&&(()=>{const cl=(data?.clients||[]).find(c=>c.id===sel.clientId);const ph=PHASES[sel.phase]||{icon:"📋",label:sel.phase,color:T.textD,bg:T.bg3};const st=STATUSES[sel.status]||{label:sel.status,color:T.textD,bg:T.bg3};return (
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}><Badge {...ph} /><Badge {...st} /></div>
            <div><div style={{fontWeight:700,fontSize:"17px"}}>{cl?.name}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{cl?.phone} · {cl?.channel}</div></div>
            {editMsg!==null
              ?<div><textarea value={editMsg} onChange={e=>setEditMsg(e.target.value)} style={{minHeight:"120px",marginBottom:"10px"}} /><div style={{display:"flex",gap:"8px",justifyContent:"flex-end"}}><Btn v="secondary" s="sm" onClick={()=>setEditMsg(null)}>Annulla</Btn><Btn s="sm" onClick={()=>{update("followUps",sel.id,{message:editMsg});setSel({...sel,message:editMsg});setEditMsg(null);}}>Salva</Btn></div></div>
              :<div><div style={{padding:"14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"14px",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:"8px"}}>{sel.message}</div>{sel.status==="pending"&&<button onClick={()=>setEditMsg(sel.message)} style={{background:"none",border:"none",color:T.blue,fontSize:"13px",cursor:"pointer",padding:"2px 0",fontFamily:"inherit",textDecoration:"underline"}}>{"✏️ Modifica messaggio"}</button>}</div>
            }
            <SendButtons message={editMsg!==null?editMsg:sel.message} clientPhone={cl?.phone||""} onSend={sel.status==="pending"?()=>{markSent(sel);setSel(null);setEditMsg(null);}:undefined} />
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",paddingTop:"12px",borderTop:`1px solid ${T.border}`}}>
              <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Programmato</span><div style={{fontSize:"14px",marginTop:"3px"}}>{fmtDate(sel.scheduledDate)}</div></div>
              <div><span style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em"}}>Inviato</span><div style={{fontSize:"14px",marginTop:"3px"}}>{sel.sentDate?fmtDate(sel.sentDate):"\u{2014}"}</div></div>
            </div>
          </div>
        );})()}
      </Modal>
    </div>
  );
};

const buildProductFollowUps = (orderId, clientId, clientName, orderDate, estimatedDelivery) => {
  const deliveryDate = estimatedDelivery || addDays(orderDate, 7);
  return [
    {id:uid(),orderId,clientId,phase:"order_confirm",status:"pending",scheduledDate:orderDate,sentDate:null,message:`Ciao ${clientName}! Ho ricevuto il tuo ordine, grazie mille \u{1F64F} Lo sto preparando con cura. Ti avviso non appena \u{e8} in partenza!`},
    {id:uid(),orderId,clientId,phase:"shipping",status:"pending",scheduledDate:null,sentDate:null,message:`Ciao ${clientName}! Il tuo ordine \u{e8} in partenza oggi \u{1F4E6} Arrivo stimato: ${fmtDate(deliveryDate)}. Per qualsiasi cosa sono qui!`,awaitShipping:true},
    {id:uid(),orderId,clientId,phase:"delivery_check",status:"pending",scheduledDate:addDays(deliveryDate,3),sentDate:null,message:`Ciao ${clientName}! \u{C8} arrivato tutto bene? Spero che il prodotto ti piaccia \u{1F64F} Se c'\u{e8} qualcosa che non va, scrivimi subito.`},
    {id:uid(),orderId,clientId,phase:"review",status:"pending",scheduledDate:addDays(deliveryDate,14),sentDate:null,message:`Ciao ${clientName}! Spero che stia usando il prodotto con soddisfazione \u{2728} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!`},
    {id:uid(),orderId,clientId,phase:"reorder",status:"pending",scheduledDate:addDays(deliveryDate,60),sentDate:null,message:`Ciao ${clientName}! Sono passati un po' di mesi \u{2014} se hai bisogno di riordinare o vuoi scoprire qualcosa di nuovo, sono qui \u{1F64F}`},
  ];
};

const Orders = () => {
  const {data,addRecord,update,deleteRecord}=useSliss();
  const [showNew,setShowNew]=useState(false);const [done,setDone]=useState(false);
  const [form,setForm]=useState({clientId:"",product:"",orderDate:today(),deliveryDays:"7",notes:""});
  const sorted=[...(data?.orders||[])].sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate));
  const handleAdd=()=>{if(!form.clientId||!form.product.trim())return;const client=(data?.clients||[]).find(c=>c.id===form.clientId);if(!client)return;const orderId=uid();const deliveryDate=addDays(form.orderDate,parseInt(form.deliveryDays)||7);addRecord("orders",{id:orderId,clientId:form.clientId,product:form.product,orderDate:form.orderDate,deliveryDate,notes:form.notes,status:"pending",created:today()});buildProductFollowUps(orderId,form.clientId,client.name,form.orderDate,deliveryDate).forEach(fu=>addRecord("followUps",fu));setDone(true);setTimeout(()=>{setDone(false);setShowNew(false);setForm({clientId:"",product:"",orderDate:today(),deliveryDays:"7",notes:""});},1800);};
  const markShipped=(order)=>{update("orders",order.id,{status:"shipped",shippedDate:today()});const shippingFU=(data?.followUps||[]).find(f=>f.orderId===order.id&&f.phase==="shipping"&&f.awaitShipping);if(shippingFU)update("followUps",shippingFU.id,{scheduledDate:today(),status:"pending"});};
  const handleDelete=(order)=>{if(!window.confirm("Eliminare questo ordine?"))return;deleteRecord("orders",order.id);(data?.followUps||[]).filter(f=>f.orderId===order.id).forEach(f=>deleteRecord("followUps",f.id));};
  const statusLabel={pending:"In preparazione",shipped:"Spedito",delivered:"Consegnato"};const statusColor={pending:T.amber,shipped:T.blue,delivered:T.green};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Ordini in corso" action={<Btn onClick={()=>setShowNew(true)}>+ Nuovo ordine</Btn>} />
      <p style={{fontSize:"13px",color:T.textD,marginBottom:"20px",marginTop:"-10px"}}>{"Aggiungi un ordine \u{2192} i 5 follow-up si generano automaticamente"}</p>
      {!sorted.length ? <Empty icon={"\u{1F4E6}"} title="Nessun ordine" desc="Aggiungi il primo ordine per generare i follow-up automaticamente." /> : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>{sorted.map((order,i)=>{const cl=(data?.clients||[]).find(c=>c.id===order.clientId);const fus=(data?.followUps||[]).filter(f=>f.orderId===order.id);const pendingFUs=fus.filter(f=>f.status==="pending"&&f.scheduledDate&&f.scheduledDate<=today()).length;return (<Card key={order.id} style={{animation:`fadeIn .3s ease ${i*.03}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}><div><div style={{fontWeight:700,fontSize:"15px"}}>{cl?.name||"\u{2014}"}</div><div style={{fontSize:"13px",color:T.textM,marginTop:"2px"}}>{order.product}</div>{order.notes&&<div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{"\u{1F4DD}"} {order.notes}</div>}</div><span style={{fontSize:"12px",fontWeight:600,color:statusColor[order.status]||T.amber,background:`${statusColor[order.status]}18`,padding:"3px 10px",borderRadius:T.r.full}}>{statusLabel[order.status]||"\u{2014}"}</span></div><div style={{display:"flex",gap:"12px",fontSize:"12px",color:T.textD,marginBottom:"10px"}}><span>Ordine: {fmtDate(order.orderDate)}</span><span>Consegna: {fmtDate(order.deliveryDate)}</span></div><div style={{display:"flex",gap:"5px",marginBottom:"10px"}}>{["order_confirm","shipping","delivery_check","review","reorder"].map(phase=>{const fu=fus.find(f=>f.phase===phase);const ph=PRODUCT_PHASES[phase];const col=!fu?"#E9ECEF":fu.status==="sent"||fu.status==="replied"?T.greenS:fu.awaitShipping&&order.status==="pending"?"#E9ECEF":T.amberS;const textCol=!fu?T.textMu:fu.status==="sent"||fu.status==="replied"?T.green:fu.awaitShipping&&order.status==="pending"?T.textMu:T.amber;return (<div key={phase} style={{flex:1,padding:"5px 4px",background:col,borderRadius:T.r.s,textAlign:"center"}}><div style={{fontSize:"13px"}}>{ph.icon}</div><div style={{fontSize:"9px",color:textCol,fontWeight:600,marginTop:"1px"}}>{fu&&fu.scheduledDate?daysUntil(fu.scheduledDate):fu?.awaitShipping?"\u{23F3}":"\u{2014}"}</div></div>);})}</div><div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>{order.status==="pending"&&<Btn v="primary" s="sm" onClick={()=>markShipped(order)}>{"\u{1F4E6}"} Segna spedito</Btn>}{pendingFUs>0&&<span style={{fontSize:"12px",color:T.amber,fontWeight:600,padding:"8px 0"}}>{pendingFUs} follow-up da inviare</span>}<Btn v="danger" s="sm" onClick={()=>handleDelete(order)}>{"\u{1F5D1}\u{FE0F}"}</Btn></div></Card>);})}</div>}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setDone(false);}} title="Nuovo ordine">
        {done ? <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:"36px",marginBottom:"12px"}}>{"\u{2705}"}</div><div style={{fontWeight:700,fontSize:"16px",marginBottom:"6px"}}>Ordine salvato</div><div style={{fontSize:"13px",color:T.textD}}>5 follow-up generati automaticamente</div></div> : <>
          <FormField label="Cliente"><select value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))}><option value="">Seleziona cliente...</option>{(data?.clients||[]).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
          <FormField label="Prodotto / Descrizione"><input value={form.product} onChange={e=>setForm(p=>({...p,product:e.target.value}))} placeholder="Es. Supporto stampa 3D personalizzato" /></FormField>
          <FormField label="Data ordine"><input type="date" value={form.orderDate} onChange={e=>setForm(p=>({...p,orderDate:e.target.value}))} /></FormField>
          <FormField label="Consegna stimata (giorni)" hint="Usato per calcolare i follow-up post-consegna"><input type="number" min="1" max="365" value={form.deliveryDays} onChange={e=>setForm(p=>({...p,deliveryDays:e.target.value}))} /></FormField>
          <FormField label="Note (opzionale)"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Dettagli prodotto..." style={{minHeight:"60px"}} /></FormField>
          <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.clientId||!form.product.trim()}>Salva e genera follow-up</Btn></div>
        </>}
      </Modal>
    </div>
  );
};

const buildFollowUps=(apptId,clientId,clientName,apptDate,serviceType,timings)=>{
  const tm={thankyou:timings.thankyou||0,check:timings.check||7,review:timings.review||21,reactivation:timings.reactivation||60};
  const msgs={thankyou:serviceType==="Ritocco"?`Ciao ${clientName}! Grazie per il ritocco di oggi \u{1F64F} Scrivimi per qualsiasi cosa.`:`Ciao ${clientName}! Grazie per oggi \u{1F5A4} Ricordati pellicola e sapone neutro. Scrivimi se hai dubbi.`,check:`Ciao ${clientName}! Come sta andando? \u{C8} normale che desquami un po'. Se hai dubbi mandami una foto \u{1F64F}`,review:`Ciao ${clientName}! Sono passate un po' di settimane \u{2728} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo.`,reactivation:`Ciao ${clientName}! Pensavo a te \u{2014} come stai? Se hai in mente qualcosa di nuovo, sono qui \u{1F5A4}`};
  return ["thankyou","check","review","reactivation"].map(phase=>({id:uid(),appointmentId:apptId,clientId,phase,status:"pending",scheduledDate:addDays(apptDate,tm[phase]),sentDate:null,satisfaction:null,message:msgs[phase]}));
};

const Appointments = () => {
  const {data,addRecord,deleteRecord}=useSliss();
  const [showNew,setShowNew]=useState(false);const [form,setForm]=useState({clientId:"",date:today(),serviceType:"Sessione",notes:""});const [done,setDone]=useState(false);
  const cluster=data?.settings?.cluster||"altro_s";
  const SERVICE_TYPES=(CLUSTERS_SERVIZI[cluster]?.serviceTypes)||CLUSTERS_SERVIZI.altro_s.serviceTypes;
  const sorted=[...(data?.appointments||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const handleAdd=()=>{if(!form.clientId||!form.date)return;const client=(data?.clients||[]).find(c=>c.id===form.clientId);if(!client)return;const apptId=uid();const timings=data.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};addRecord("appointments",{id:apptId,clientId:form.clientId,date:form.date,serviceType:form.serviceType,notes:form.notes,followUpTriggered:true,created:today()});buildFollowUps(apptId,form.clientId,client.name,form.date,form.serviceType,timings).forEach(fu=>addRecord("followUps",fu));setDone(true);setTimeout(()=>{setDone(false);setShowNew(false);setForm({clientId:"",date:today(),serviceType:"Sessione",notes:""});},1800);};
  const handleDelete=appt=>{if(!window.confirm("Eliminare questo appuntamento e i suoi follow-up?"))return;deleteRecord("appointments",appt.id);(data?.followUps||[]).filter(f=>f.appointmentId===appt.id).forEach(f=>deleteRecord("followUps",f.id));};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Agenda" action={<Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn>} />
      <div style={{marginBottom:"10px"}}><p style={{fontSize:"13px",color:T.textD}}>{"Aggiungi un appuntamento \u{2192} i 4 follow-up si generano in automatico"}</p></div>
      {!sorted.length ? <Empty icon={"\u{1F4C5}"} title="Nessun appuntamento" desc="Aggiungi il primo appuntamento per generare i follow-up." action={<Btn onClick={()=>setShowNew(true)}>+ Aggiungi</Btn>} /> : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>{sorted.map((appt,i)=>{const cl=(data?.clients||[]).find(c=>c.id===appt.clientId);const fus=(data?.followUps||[]).filter(f=>f.appointmentId===appt.id);const pc=fus.filter(f=>f.status==="pending").length;const dc=fus.filter(f=>f.status==="sent"||f.status==="replied").length;return (<Card key={appt.id} style={{animation:`fadeIn .3s ease ${i*.03}s both`}}><div style={{display:"flex",alignItems:"flex-start",gap:"12px",marginBottom:fus.length?"12px":"0"}}><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"15px"}}>{cl?.name||"\u{2014}"}</div><div style={{fontSize:"13px",color:T.textM,marginTop:"2px"}}>{appt.serviceType} · {fmtDate(appt.date)}</div>{appt.notes&&<div style={{fontSize:"12px",color:T.textMu,marginTop:"3px"}}>{"\u{1F4DD}"} {appt.notes}</div>}<div style={{fontSize:"12px",color:T.textD,marginTop:"4px"}}>{pc} in attesa · {dc} inviati</div></div><Btn v="danger" s="sm" onClick={()=>handleDelete(appt)}>{"\u{1F5D1}\u{FE0F}"}</Btn></div>{fus.length>0&&<div style={{display:"flex",gap:"6px"}}>{["thankyou","check","review","reactivation"].map(phase=>{const fu=fus.find(f=>f.phase===phase);const ph=PHASES[phase];const col=!fu?"rgba(90,111,148,0.12)":fu.status==="pending"?T.amberS:T.greenS;const txtCol=!fu?T.textMu:fu.status==="pending"?T.amber:T.green;return (<div key={phase} style={{flex:1,padding:"6px 4px",background:col,borderRadius:T.r.s,textAlign:"center"}}><div style={{fontSize:"13px"}}>{ph.icon}</div><div style={{fontSize:"10px",color:txtCol,fontWeight:600,marginTop:"2px"}}>{fu?daysUntil(fu.scheduledDate):"\u{2014}"}</div></div>);})}</div>}</Card>);})}</div>}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setDone(false);}} title="Nuovo appuntamento">
        {done ? <div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:"44px",marginBottom:"12px"}}>{"\u{2705}"}</div><div style={{fontWeight:700,fontSize:"17px",marginBottom:"6px"}}>Appuntamento salvato</div><div style={{fontSize:"14px",color:T.textD}}>4 follow-up generati automaticamente</div></div> : <>
          <FormField label="Cliente"><select value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))}><option value="">Seleziona cliente...</option>{(data?.clients||[]).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
          <FormField label="Data" hint="I follow-up si calcolano da questa data"><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></FormField>
          <FormField label="Tipo servizio"><select value={form.serviceType} onChange={e=>setForm(p=>({...p,serviceType:e.target.value}))}>{SERVICE_TYPES.map(s=><option key={s}>{s}</option>)}</select></FormField>
          <FormField label="Note (opzionale)"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Zona, dettagli..." style={{minHeight:"60px"}} /></FormField>
          <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.clientId||!form.date}>Salva e genera</Btn></div>
        </>}
      </Modal>
    </div>
  );
};

const Clients = () => {
  const {data,addRecord,update,deleteRecord}=useSliss();
  const [search,setSearch]=useState("");const [sf,setSf]=useState("all");const [sel,setSel]=useState(null);const [showNew,setShowNew]=useState(false);const [editMode,setEditMode]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",email:"",channel:"WhatsApp",notes:""});const [editForm,setEditForm]=useState(null);
  const clients=data?.clients||[];
  const tabs=[{id:"all",label:"Tutti",count:clients.length},{id:"active",label:"Attivi",count:clients.filter(c=>c.status==="active").length},{id:"vip",label:"VIP",count:clients.filter(c=>c.status==="vip").length},{id:"to_reactivate",label:"Da riatt.",count:clients.filter(c=>c.status==="to_reactivate").length}];
  const filtered=clients.filter(c=>{const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase());return ms&&(sf==="all"||c.status===sf);});
  const handleAdd=()=>{if(!form.name.trim())return;const td=today();addRecord("clients",{...form,id:uid(),status:"new",firstVisit:td,lastVisit:td,consent:true,created:td});setForm({name:"",phone:"",email:"",channel:"WhatsApp",notes:""});setShowNew(false);};
  const handleEdit=()=>{if(!editForm?.name?.trim())return;update("clients",sel.id,editForm);setSel({...sel,...editForm});setEditMode(false);};
  const handleDelete=id=>{if(window.confirm("Eliminare questo cliente?")){deleteRecord("clients",id);setSel(null);}};
  const openClient=cl=>{setSel(cl);setEditForm({name:cl.name,phone:cl.phone,email:cl.email,channel:cl.channel,notes:cl.notes||"",status:cl.status});setEditMode(false);};
  const statusOrder=["new","active","vip","to_reactivate","inactive"];
  const nextStatus=cur=>{const idx=statusOrder.indexOf(cur);return statusOrder[(idx+1)%statusOrder.length];};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Clienti" action={<Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn>} />
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"16px"}}><Tabs tabs={tabs} active={sf} onChange={setSf} /><Search value={search} onChange={setSearch} placeholder="Cerca nome o email..." /></div>
      {!filtered.length ? <Empty icon={"\u{1F465}"} title="Nessun cliente" desc="Aggiungi il tuo primo cliente per iniziare." action={<Btn onClick={()=>setShowNew(true)}>+ Aggiungi</Btn>} /> : <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>{filtered.map((cl,i)=>{const st=CLIENT_ST[cl.status]||{label:cl.status,color:T.textD,bg:T.bg3};return (<Card key={cl.id} hov onClick={()=>openClient(cl)} style={{padding:"13px 16px",animation:`fadeIn .3s ease ${i*.03}s both`}}><div style={{display:"flex",alignItems:"center",gap:"12px"}}><div style={{width:"40px",height:"40px",borderRadius:"50%",background:T.bg3,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:700,color:T.textM,flexShrink:0}}>{cl.name.charAt(0).toUpperCase()}</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"15px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl.name}</div><div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{cl.channel} · {daysAgo(cl.lastVisit)}</div></div><div onClick={e=>{e.stopPropagation();update("clients",cl.id,{status:nextStatus(cl.status)});}} style={{cursor:"pointer",padding:"4px"}}><Badge {...st} s /></div></div></Card>);})}</div>}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo cliente">
        <FormField label="Nome completo"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Nome Cognome" /></FormField>
        <FormField label="Telefono"><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" type="tel" /></FormField>
        <FormField label="Email"><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@esempio.com" type="email" /></FormField>
        <FormField label="Canale"><select value={form.channel} onChange={e=>setForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
        <FormField label="Note"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Preferenze, info utili..." /></FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.name.trim()}>Salva</Btn></div>
      </Modal>
      <Modal open={!!sel} onClose={()=>{setSel(null);setEditMode(false);}} title="Scheda Cliente">
        {sel&&editForm&&(()=>{const st=CLIENT_ST[sel.status]||{label:sel.status,color:T.textD,bg:T.bg3};const fus=(data?.followUps||[]).filter(f=>f.clientId===sel.id).sort((a,b)=>new Date(b.scheduledDate)-new Date(a.scheduledDate));return !editMode ? (
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:"18px",fontWeight:700}}>{sel.name}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{sel.phone}{sel.email&&` · ${sel.email}`}</div></div><div style={{display:"flex",gap:"7px",alignItems:"center"}}><Badge {...st} /><Btn v="secondary" s="sm" onClick={()=>setEditMode(true)}>{"\u{270F}\u{FE0F}"}</Btn></div></div>
            {sel.notes&&<div style={{padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,fontSize:"13px",color:T.textM,lineHeight:1.6,border:`1px solid ${T.border}`}}>{"\u{1F4DD}"} {sel.notes}</div>}
            {(()=>{const bizType=data?.settings?.bizType||"servizi";const appts=bizType==="prodotti"?(data?.orders||[]).filter(o=>o.clientId===sel.id):(data?.appointments||[]).filter(a=>a.clientId===sel.id);const visite=appts.length;const lastDate=appts.length?[...appts].sort((a,b)=>new Date(b.date||b.orderDate)-new Date(a.date||a.orderDate))[0]?.date||[...appts].sort((a,b)=>new Date(b.date||b.orderDate)-new Date(a.date||a.orderDate))[0]?.orderDate:null;const haReview=(data?.followUps||[]).some(f=>f.clientId===sel.id&&(f.phase==="review")&&f.status==="sent");const td2=today();const pendingFus=fus.filter(f=>f.status==="pending");const ciclo=fus.length===0?"—":pendingFus.length===0?"Completato":pendingFus.some(f=>f.scheduledDate<=td2)?"In corso":"Programmato";return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>{[{label:bizType==="prodotti"?"Ordini totali":"Visite totali",value:visite,color:T.green,span:true,big:true},{label:bizType==="prodotti"?"Ultimo ordine":"Ultima visita",value:lastDate?fmtDate(lastDate):"—"},{label:"Follow-up",value:ciclo,color:ciclo==="In corso"?T.amber:ciclo==="Completato"?T.green:T.textD}].map((m,i)=>(<div key={i} style={{padding:"10px 12px",background:T.bg3,borderRadius:T.r.m,gridColumn:m.span?"1/-1":undefined}}><div style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em",marginBottom:"4px"}}>{m.label}</div><div style={{fontSize:m.big?"22px":"14px",fontWeight:700,color:m.color||T.text}}>{m.value}</div></div>))}</div>);})()}
            {fus.length>0&&<div><h4 style={{fontSize:"13px",fontWeight:600,marginBottom:"8px",color:T.textM}}>Follow-Up</h4><div style={{display:"flex",flexDirection:"column",gap:"5px"}}>{fus.map(fu=>{const ph=PHASES[fu.phase]||{icon:"📋",label:fu.phase,color:T.textD,bg:T.bg3};const ss=STATUSES[fu.status]||{label:fu.status,color:T.textD,bg:T.bg3};return (<div key={fu.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 10px",background:T.bg3,borderRadius:T.r.s,border:`1px solid ${T.border}`}}><span style={{fontSize:"14px"}}>{ph.icon}</span><div style={{flex:1,display:"flex",gap:"5px",flexWrap:"wrap"}}><Badge {...ph} s /><Badge {...ss} s /></div><span style={{fontSize:"11px",color:T.textD}}>{fmtDate(fu.scheduledDate)}</span></div>);})}</div></div>}
            <div style={{paddingTop:"12px",borderTop:`1px solid ${T.border}`}}><Btn v="danger" s="sm" onClick={()=>handleDelete(sel.id)}>{"\u{1F5D1}\u{FE0F}"} Elimina</Btn></div>
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
        );})()}
      </Modal>
    </div>
  );
};

const Templates = () => {
  const {data,update,addRecord,deleteRecord}=useSliss();
  const [filter,setFilter]=useState("all");const [editingId,setEditingId]=useState(null);const [editText,setEditText]=useState("");const [editName,setEditName]=useState("");const [showNew,setShowNew]=useState(false);const [newForm,setNewForm]=useState({name:"",phase:"thankyou",channel:"WhatsApp",text:""});
  const phases=[{id:"all",label:"Tutti"},{id:"thankyou",label:"Ringraziamento"},{id:"check",label:"Controllo"},{id:"review",label:"Recensione"},{id:"reactivation",label:"Riattivazione"}];
  const templates=data?.templates||[];const filtered=templates.filter(t=>filter==="all"||t.phase===filter);
  const startEdit=t=>{setEditingId(t.id);setEditText(t.text);setEditName(t.name);};const saveEdit=id=>{update("templates",id,{text:editText,name:editName});setEditingId(null);};
  const handleAdd=()=>{if(!newForm.name.trim()||!newForm.text.trim())return;addRecord("templates",{...newForm,id:uid(),code:`T${uid().slice(0,4).toUpperCase()}`,active:true});setNewForm({name:"",phase:"thankyou",channel:"WhatsApp",text:""});setShowNew(false);};
  const handlePropagate=()=>{const fus=data?.followUps||[];const clients=data?.clients||[];const toUpdate=fus.filter(f=>f.status==="pending"&&templates.some(t=>t.phase===f.phase));if(!toUpdate.length){alert("Nessun follow-up in attesa da aggiornare.");return;}if(!window.confirm(`Aggiornare i messaggi di ${toUpdate.length} follow-up in attesa?\n\nI follow-up già inviati non saranno modificati.`))return;toUpdate.forEach(fu=>{const tmpl=templates.find(t=>t.phase===fu.phase);if(!tmpl)return;const name=(clients.find(c=>c.id===fu.clientId)?.name)||"";update("followUps",fu.id,{message:tmpl.text.replace(/\[Nome\]/g,name)});});};
  const handleAddBase=()=>{const bizType=data?.settings?.bizType||"servizi";const base=bizType==="prodotti"?CLUSTER_TEMPLATES["altro_p"]:CLUSTER_TEMPLATES["altro_s"];base.forEach(t=>addRecord("templates",{...t,id:uid()}));};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Template" action={<div style={{display:"flex",gap:"6px"}}><Btn v="secondary" s="sm" onClick={handlePropagate}>{"\u{21BB}"} Aggiorna follow-up</Btn><Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn></div>} />
      <div style={{marginBottom:"16px"}}><Tabs tabs={phases.map(p=>({...p,count:p.id==="all"?templates.length:templates.filter(t=>t.phase===p.id).length}))} active={filter} onChange={setFilter} /></div>
      {templates.length===0
        ?<Empty icon={"\u{1F4DD}"} title="Nessun template" desc="Aggiungi i template base per iniziare, oppure creane uno personalizzato." action={<Btn onClick={handleAddBase}>+ Template base</Btn>} />
        :filtered.length===0
        ?<Empty icon={"\u{1F4CB}"} title="Nessun template in questa fase" desc="Prova un altro filtro o aggiungine uno nuovo." />
        :<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{filtered.map((tmpl,i)=>{const ph=PHASES[tmpl.phase]||{icon:"📋",label:tmpl.phase||"",color:T.textD,bg:T.bg3};const isEditing=editingId===tmpl.id;return (<Card key={tmpl.id} style={{animation:`fadeIn .3s ease ${i*.04}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}><div style={{display:"flex",alignItems:"center",gap:"8px",flex:1,minWidth:0}}><span style={{fontSize:"16px",flexShrink:0}}>{ph.icon}</span>{isEditing?<input value={editName} onChange={e=>setEditName(e.target.value)} style={{fontSize:"14px",fontWeight:600,padding:"6px 10px"}} />:<div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tmpl.name}</div><div style={{fontSize:"11px",color:T.textD,marginTop:"1px"}}>{tmpl.channel}</div></div>}</div><div style={{display:"flex",gap:"6px",alignItems:"center",flexShrink:0,marginLeft:"8px"}}><Badge {...ph} s />{isEditing?<><Btn v="success" s="sm" onClick={()=>saveEdit(tmpl.id)}>{"\u{2713}"}</Btn><Btn v="ghost" s="sm" onClick={()=>setEditingId(null)}>{"\u{2715}"}</Btn></>:<><Btn v="ghost" s="sm" onClick={()=>startEdit(tmpl)}>{"\u{270F}\u{FE0F}"}</Btn><Btn v="danger" s="sm" onClick={()=>{if(window.confirm("Eliminare?"))deleteRecord("templates",tmpl.id);}}>{"\u{1F5D1}\u{FE0F}"}</Btn></>}</div></div>{isEditing?<textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{minHeight:"90px",fontSize:"14px",lineHeight:1.7}} />:<div style={{padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"14px",lineHeight:1.7,color:T.textM,whiteSpace:"pre-wrap"}}>{tmpl.text}</div>}{!isEditing&&<div style={{display:"flex",justifyContent:"flex-end",marginTop:"10px"}}><button onClick={()=>navigator.clipboard.writeText(tmpl.text)} style={{background:"none",border:`1px solid ${T.border}`,color:T.textD,borderRadius:T.r.m,padding:"7px 14px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",minHeight:"40px"}}>{"\u{1F4CB}"} Copia</button></div>}</Card>);})}</div>
      }
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo template">
        <FormField label="Nome"><input value={newForm.name} onChange={e=>setNewForm(p=>({...p,name:e.target.value}))} placeholder="Es. Ringraziamento personalizzato" /></FormField>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}><FormField label="Fase"><select value={newForm.phase} onChange={e=>setNewForm(p=>({...p,phase:e.target.value}))}><option value="thankyou">Ringraziamento</option><option value="check">Controllo</option><option value="review">Recensione</option><option value="reactivation">Riattivazione</option></select></FormField><FormField label="Canale"><select value={newForm.channel} onChange={e=>setNewForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField></div>
        <FormField label="Testo" hint="Usa [Nome] come segnaposto."><textarea value={newForm.text} onChange={e=>setNewForm(p=>({...p,text:e.target.value}))} placeholder="Ciao [Nome]! ..." style={{minHeight:"100px"}} /></FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!newForm.name.trim()||!newForm.text.trim()}>Salva</Btn></div>
      </Modal>
    </div>
  );
};

const Feedback = () => {
  const {data}=useSliss();const feedbacks=data?.feedbacks||[];const clients=data?.clients||[];const reviewLink=data.settings?.reviewLink||"";
  const clientsWithFeedback=new Set(feedbacks.map(f=>f.clientId));const clientsWithout=clients.filter(c=>!clientsWithFeedback.has(c.id)&&(c.status==="active"||c.status==="vip"||c.status==="new"));
  const avgR=feedbacks.length?(feedbacks.reduce((a,f)=>a+f.rating,0)/feedbacks.length).toFixed(1):"\u{2014}";
  const reviewMsg=name=>`Ciao ${name}! Spero tu sia rimasto/a soddisfatto/a \u{1F64F} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. ${reviewLink}`.trim();
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Feedback" action={reviewLink&&<a href={reviewLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:T.bg2,color:T.textM,border:`1px solid ${T.border}`,borderRadius:T.r.m,fontSize:"13px",fontWeight:600,textDecoration:"none",minHeight:"44px"}}>{"⭐ Vedi recensioni"}</a>} />
      {clientsWithout.length>0&&<Card style={{marginBottom:"16px"}}><h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>Richiedi recensione <span style={{fontSize:"12px",fontWeight:400,color:T.textD,marginLeft:"4px"}}>{clientsWithout.length} clienti</span></h2><div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{clientsWithout.map(cl=>(<div key={cl.id} style={{padding:"12px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}><div style={{fontWeight:600,fontSize:"14px",marginBottom:"3px"}}>{cl.name}</div><div style={{fontSize:"12px",color:T.textD,marginBottom:"10px"}}>{cl.channel} · {daysAgo(cl.lastVisit)}</div><SendButtons message={reviewMsg(cl.name)} clientPhone={cl.phone} /></div>))}</div></Card>}
      <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px",color:T.textM}}>Ricevuti</h2>
      {!feedbacks.length ? <Empty icon={"\u{2B50}"} title="Nessun feedback" desc="Appariranno qui quando i clienti risponderanno." /> : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{feedbacks.map((fb,i)=>{const cl=clients.find(c=>c.id===fb.clientId);return (<Card key={fb.id} style={{animation:`fadeIn .3s ease ${i*.05}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontWeight:600,fontSize:"14px",marginBottom:"5px"}}>{cl?.name||"\u{2014}"}</div><div style={{fontSize:"17px",marginBottom:"7px"}}>{"\u{2B50}".repeat(fb.rating)}{"\u{2606}".repeat(5-fb.rating)}</div>{fb.comment&&<div style={{fontSize:"13px",color:T.textM,lineHeight:1.6,fontStyle:"italic"}}>"{fb.comment}"</div>}</div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:"11px",color:T.textD,marginBottom:"5px"}}>{fmtDate(fb.date)}</div>{fb.wouldRecommend&&<Badge label="Consiglia" color={T.green} bg={T.greenS} s />}</div></div></Card>);})}</div>}
    </div>
  );
};

const ModulesMap = () => {
  const stL={active:"Attivo",planned:"In arrivo",future:"Futuro"};const stS={active:{color:T.green,bg:T.greenS},planned:{color:T.amber,bg:T.amberS},future:{color:T.textD,bg:"rgba(90,111,148,0.08)"}};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Moduli" />
      <p style={{color:T.textD,fontSize:"13px",marginBottom:"20px"}}>Ogni modulo si attiva quando c'{"\u{e8}"} una richiesta reale dai clienti.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"10px"}}>{MODULES.map((mod,i)=>{const ss=stS[mod.status];return (<div key={mod.id} style={{background:T.bg2,border:`1px solid ${mod.status==="active"?`${mod.color}40`:T.border}`,borderRadius:T.r.l,padding:"16px",animation:`fadeIn .3s ease ${i*.04}s both`}}><div style={{width:"40px",height:"40px",borderRadius:T.r.m,background:`${mod.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",marginBottom:"10px"}}>{mod.icon}</div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{mod.name}</div><div style={{fontSize:"11px",color:T.textD,lineHeight:1.5,marginBottom:"10px"}}>{mod.desc}</div><Badge label={stL[mod.status]} {...ss} s />{mod.status==="active"&&<div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"8px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}} /><span style={{fontSize:"11px",color:T.green,fontWeight:600}}>Attivo</span></div>}</div>);})}</div>
    </div>
  );
};

const Settings = () => {
  const {data,updateSettings,resetData}=useSliss();const s=data.settings||{};
  const [bName,setBName]=useState(s.businessName||"");const [currentCluster,setCurrentCluster]=useState(s.cluster||"altro");const [reviewLink,setReviewLink]=useState(s.reviewLink||"");const [timings,setTimings]=useState(s.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60});const [saved,setSaved]=useState(false);
  const [notifStatus,setNotifStatus]=useState(()=>'Notification' in window?Notification.permission:'unsupported');
  const handleSave=()=>{updateSettings({businessName:bName,reviewLink,cluster:currentCluster,followUpTimings:timings});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const handleNotif=async()=>{const ok=await subscribeToPush();setNotifStatus(ok?'granted':'denied');};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Impostazioni" />
      <Card style={{marginBottom:"14px"}}><h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"16px"}}>{"Attivit\u{e0}"}</h3><FormField label={"Nome attivit\u{e0}"} hint="Appare nel saluto della Home"><input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" /></FormField><FormField label="Settore" hint="Usato per adattare i template"><select value={currentCluster} onChange={e=>setCurrentCluster(e.target.value)}>{Object.entries(CLUSTERS).map(([key,cl])=>(<option key={key} value={key}>{cl.icon} {cl.label}</option>))}</select></FormField><FormField label="Link Google Reviews" hint="Aggiunto ai messaggi di recensione"><input value={reviewLink} onChange={e=>setReviewLink(e.target.value)} placeholder="https://g.page/r/..." /></FormField></Card>
      <Card style={{marginBottom:"14px"}}><h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"4px"}}>Timing follow-up</h3><p style={{fontSize:"12px",color:T.textD,marginBottom:"16px"}}>Quando inviare ogni fase dopo l'appuntamento.</p><div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}><div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:500}}>Ringraziamento</div><div style={{fontSize:"12px",color:T.textMu}}>Ore dopo l'appuntamento</div></div><div style={{display:"flex",alignItems:"center",gap:"8px"}}><input type="number" min="0" max="48" value={timings.thankyouHours||2} onChange={e=>setTimings(p=>({...p,thankyouHours:parseInt(e.target.value)||0}))} style={{width:"70px",textAlign:"center"}} /><span style={{fontSize:"13px",color:T.textD}}>ore</span></div></div>{[{key:"check",label:"Controllo",note:"7 giorni"},{key:"review",label:"Recensione",note:"21 giorni"},{key:"reactivation",label:"Riattivazione",note:"60 giorni"}].map(({key,label,note})=>(<div key={key} style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}><div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:500}}>{label}</div><div style={{fontSize:"12px",color:T.textMu}}>Di solito {note}</div></div><div style={{display:"flex",alignItems:"center",gap:"8px"}}><input type="number" min="0" max="365" value={timings[key]} onChange={e=>setTimings(p=>({...p,[key]:parseInt(e.target.value)||0}))} style={{width:"70px",textAlign:"center"}} /><span style={{fontSize:"13px",color:T.textD}}>giorni</span></div></div>))}</Card>
      <Card style={{marginBottom:"14px"}}>
        <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"10px"}}>Notifiche</h3>
        {notifStatus==='granted' && <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 14px",background:T.greenS,borderRadius:T.r.l,border:`1px solid ${T.green}`}}><span style={{fontSize:"18px"}}>{"✓"}</span><span style={{fontSize:"14px",color:T.green,fontWeight:600}}>Notifiche attive</span></div>}
        {notifStatus==='denied' && <><div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 14px",background:"#FEF2F2",borderRadius:T.r.l,border:"1px solid #FECACA",marginBottom:"10px"}}><span style={{fontSize:"18px"}}>{"🔕"}</span><span style={{fontSize:"13px",color:"#DC2626"}}>Notifiche bloccate dal browser</span></div><p style={{fontSize:"12px",color:T.textD,lineHeight:1.6}}>{"Vai in Impostazioni iPhone → Safari → Notifiche e riattiva Sliss."}</p></>}
        {notifStatus==='default' && <><p style={{fontSize:"13px",color:T.textM,lineHeight:1.6,marginBottom:"12px"}}>Ricevi un reminder quando inserire i clienti e quando hai follow-up in scadenza.</p><Btn onClick={handleNotif} style={{width:"100%",justifyContent:"center"}}>{"🔔 Attiva notifiche"}</Btn></>}
        {notifStatus==='unsupported' && <p style={{fontSize:"13px",color:T.textD}}>{"Le notifiche non sono supportate su questo browser. Usa Safari su iPhone."}</p>}
      </Card>
      <Card style={{marginBottom:"20px"}}><h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"10px"}}>Dati</h3><p style={{fontSize:"13px",color:T.textD,lineHeight:1.7,marginBottom:"14px"}}>I dati sono salvati nel browser. Usa sempre lo stesso dispositivo e browser.</p><Btn v="danger" s="sm" onClick={()=>{if(window.confirm("Reset completo? Tutti i dati verranno eliminati."))resetData();}}>{"\u{1F5D1}\u{FE0F}"} Reset dati</Btn></Card>
      <Btn onClick={handleSave} style={{width:"100%",justifyContent:"center"}}>{saved?"\u{2713} Salvato!":"Salva impostazioni"}</Btn>
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

  useEffect(()=>{const d=loadData();setData(d);setShowOnboarding(!isOnboarded());setLoading(false);const t=new URLSearchParams(window.location.search).get('tester');if(t)localStorage.setItem('sliss-tester',t);},[]);
  useEffect(()=>{if(data&&!loading)saveData(data);},[data,loading]);

  const update=useCallback((table,id,updates)=>setData(prev=>({...prev,[table]:(prev[table]||[]).map(r=>r.id===id?{...r,...updates}:r)})),[]);
  const addRecord=useCallback((table,record)=>setData(prev=>({...prev,[table]:[...(prev[table]||[]),record]})),[]);
  const deleteRecord=useCallback((table,id)=>setData(prev=>({...prev,[table]:(prev[table]||[]).filter(r=>r.id!==id)})),[]);
  const updateSettings=useCallback((updates)=>setData(prev=>({...prev,settings:{...prev.settings,...updates}})),[]);
  const resetData=useCallback(()=>{const d=emptyData();setData(d);saveData(d);storage.remove(ONBOARDING_KEY);},[]);

  if(loading||!data) return (<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:T.bg}}><div style={{textAlign:"center"}}><div style={{marginBottom:"16px"}}><SlissLogo size={28} /></div><div style={{color:T.textD,fontSize:"13px",animation:"pulse 1.5s infinite"}}>Caricamento...</div></div></div>);

  const ctx={data,update,addRecord,deleteRecord,updateSettings,resetData};
  const td=today();
  const pendingCount=(data?.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td).length;
  const viewMap={home:<Home setView={setView}/>,appointments:<Appointments/>,orders:<Orders/>,followup:<FollowUp setView={setView}/>,clients:<Clients/>,templates:<Templates/>,feedback:<Feedback/>,modules:<ModulesMap/>,settings:<Settings/>,more:<MoreMenu setView={setView}/>};
  const CurrentView=viewMap[view]||viewMap.home;

  if(showOnboarding) return <ErrorBoundary><Ctx.Provider value={ctx}><GlobalCSS /><Onboarding onComplete={()=>setShowOnboarding(false)} /></Ctx.Provider></ErrorBoundary>;

  return (
    <ErrorBoundary>
      <Ctx.Provider value={ctx}>
        <GlobalCSS />
        <div translate="no" lang="it" style={{display:"flex",minHeight:"100vh"}}>
          <DesktopSidebar view={view} setView={setView} />
          <main style={{flex:1,padding:"24px 20px",paddingBottom:"calc(80px + env(safe-area-inset-bottom))",maxWidth:"680px",margin:"0 auto",width:"100%"}} className="mobile-only">{CurrentView}</main>
          <main style={{flex:1,marginLeft:"210px",padding:"28px 36px",maxWidth:"1040px"}} className="desktop-only">{CurrentView}</main>
        </div>
        <BottomNav view={view} setView={setView} pendingCount={pendingCount} bizType={data?.settings?.bizType||""} />
      </Ctx.Provider>
    </ErrorBoundary>
  );
}
