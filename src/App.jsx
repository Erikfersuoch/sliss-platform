import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { loadData, saveData, isOnboarded, emptyData, storage, ONBOARDING_KEY, healData } from "./storage.js";
import { saveBackup } from "./backup.js";
import { uid, today, isPhaseOff } from "./helpers.js";
import { Ctx } from "./context.js";
import GlobalCSS from "./GlobalCSS.jsx";
import { BottomNav, MoreMenu, DesktopSidebar } from "./components/Nav.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import FeedbackNudge from "./components/FeedbackNudge.jsx";
import UpdateNudge from "./components/UpdateNudge.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Home from "./pages/Home.jsx";
import FollowUp from "./pages/FollowUp.jsx";
import Orders from "./pages/Orders.jsx";
import Appointments from "./pages/Appointments.jsx";
import Clients from "./pages/Clients.jsx";
import Templates from "./pages/Templates.jsx";
import Feedback from "./pages/Feedback.jsx";
import ModulesMap from "./pages/ModulesMap.jsx";
import Settings from "./pages/Settings.jsx";

export default function SlissPlatform() {
  const [view,setView]=useState("home");
  const [fuFilter,setFuFilter]=useState(null);
  const [selFuId,setSelFuId]=useState(null);
  const [selClientId,setSelClientId]=useState(null);
  // localStorage è sincrono: inizializziamo i dati subito (niente stato "loading", niente flash all'avvio)
  const [data,setData]=useState(()=>loadData());
  const [showOnboarding,setShowOnboarding]=useState(()=>!isOnboarded());
  // Notifica "è ora dei feedback" → apre l'app su ?goto=feedback: mostriamo la schermata dedicata
  const [showFeedbackNudge,setShowFeedbackNudge]=useState(()=>new URLSearchParams(window.location.search).get('goto')==='feedback');
  const [showUpdateNudge,setShowUpdateNudge]=useState(()=>new URLSearchParams(window.location.search).get('goto')==='novita');
  const autoCheckRef=useRef(false);

  // Cattura il codice tester dall'URL (?tester=) una sola volta, senza toccare lo stato React
  useEffect(()=>{const t=new URLSearchParams(window.location.search).get('tester');if(t)localStorage.setItem('sliss-tester',t);},[]);
  // Pulisce ?goto dall'URL dopo averlo letto (così un refresh non riapre la schermata)
  useEffect(()=>{const p=new URLSearchParams(window.location.search);if(p.get('goto')){p.delete('goto');const qs=p.toString();window.history.replaceState({},"",window.location.pathname+(qs?`?${qs}`:""));}},[]);
  useEffect(()=>{saveData(data);},[data]);
  // Backup cloud best-effort: copia i dati nel cloud poco dopo ogni modifica (solo se c'è un codice tester). Mai bloccante.
  useEffect(()=>{const tester=localStorage.getItem('sliss-tester');if(!tester)return;const id=setTimeout(()=>{saveBackup(tester,data);},8000);return ()=>clearTimeout(id);},[data]);

  const update=useCallback((table,id,updates)=>setData(prev=>({...prev,[table]:(prev[table]||[]).map(r=>r.id===id?{...r,...updates}:r)})),[]);
  const addRecord=useCallback((table,record)=>setData(prev=>({...prev,[table]:[...(prev[table]||[]),record]})),[]);
  const deleteRecord=useCallback((table,id)=>setData(prev=>({...prev,[table]:(prev[table]||[]).filter(r=>r.id!==id)})),[]);
  const updateSettings=useCallback((updates)=>setData(prev=>({...prev,settings:{...prev.settings,...updates}})),[]);
  const resetData=useCallback(()=>{const d=emptyData();setData(d);saveData(d);storage.remove(ONBOARDING_KEY);},[]);
  // Ripristino da backup: sostituisce i dati locali con quelli passati (sanati dalla stessa heal di loadData).
  const importData=useCallback((d)=>{const healed=healData(d);setData(healed);saveData(healed);},[]);
  // Navigazione: imposta vista e, opzionalmente, il filtro iniziale Follow-Up (resettato per ogni navigazione normale)
  const go=useCallback((v,opts)=>{setFuFilter(opts&&opts.fuFilter?opts.fuFilter:null);setSelFuId(opts&&opts.fuId?opts.fuId:null);setSelClientId(opts&&opts.clientId?opts.clientId:null);setView(v);},[]);
  // Auto-import schede onboarding: una sola volta, importa gli slot già compilati dal cliente
  useEffect(()=>{
    if(autoCheckRef.current)return;
    autoCheckRef.current=true;
    const waiting=(data?.slots||[]).filter(s=>s.status==="waiting");
    if(!waiting.length)return;
    waiting.forEach(async slot=>{try{const r=await fetch(`/api/onboarding-check?slot=${slot.id}`);const d=await r.json();if(d.found){const clientId=uid();addRecord("clients",{id:clientId,name:d.name,phone:d.phone,email:d.email||"",channel:"WhatsApp",status:"new",tags:[],notes:d.notes||"",firstVisit:today(),lastVisit:today()});update("slots",slot.id,{status:"imported"});}}catch(e){console.error("[auto-check]",e);}});
  },[data,addRecord,update]);
  const ctx=useMemo(()=>({data,update,addRecord,deleteRecord,updateSettings,resetData,importData}),[data,update,addRecord,deleteRecord,updateSettings,resetData,importData]);

  const td=today();
  const pendingCount=(data?.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td&&!isPhaseOff(data?.templates,f.phase)).length;
  const viewMap={home:<Home setView={go}/>,appointments:<Appointments setView={go}/>,orders:<Orders/>,followup:<FollowUp setView={go} initialFilter={fuFilter} initialFuId={selFuId}/>,clients:<Clients initialClientId={selClientId}/>,templates:<Templates/>,feedback:<Feedback/>,modules:<ModulesMap/>,settings:<Settings/>,more:<MoreMenu setView={go}/>};
  const CurrentView=viewMap[view]||viewMap.home;

  if(showOnboarding) return <ErrorBoundary><Ctx.Provider value={ctx}><GlobalCSS /><Onboarding onComplete={()=>setShowOnboarding(false)} /></Ctx.Provider></ErrorBoundary>;

  return (
    <ErrorBoundary>
      <Ctx.Provider value={ctx}>
        <GlobalCSS />
        <div translate="no" lang="it" style={{display:"flex",minHeight:"100vh"}}>
          <DesktopSidebar view={view} setView={go} />
          <main className="app-main">{CurrentView}</main>
        </div>
        <BottomNav view={view} setView={go} pendingCount={pendingCount} bizType={data?.settings?.bizType||""} />
        {showFeedbackNudge && <FeedbackNudge onClose={()=>setShowFeedbackNudge(false)} />}
        {showUpdateNudge && <UpdateNudge onClose={()=>setShowUpdateNudge(false)} />}
      </Ctx.Provider>
    </ErrorBoundary>
  );
}
