import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { loadData, saveData, isOnboarded, emptyData, storage, ONBOARDING_KEY } from "./storage.js";
import { uid, today, isPhaseOff } from "./helpers.js";
import { Ctx } from "./context.js";
import GlobalCSS from "./GlobalCSS.jsx";
import { BottomNav, MoreMenu, DesktopSidebar } from "./components/Nav.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
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
  // localStorage è sincrono: inizializziamo i dati subito (niente stato "loading", niente flash all'avvio)
  const [data,setData]=useState(()=>loadData());
  const [showOnboarding,setShowOnboarding]=useState(()=>!isOnboarded());
  const autoCheckRef=useRef(false);

  // Cattura il codice tester dall'URL (?tester=) una sola volta, senza toccare lo stato React
  useEffect(()=>{const t=new URLSearchParams(window.location.search).get('tester');if(t)localStorage.setItem('sliss-tester',t);},[]);
  useEffect(()=>{saveData(data);},[data]);

  const update=useCallback((table,id,updates)=>setData(prev=>({...prev,[table]:(prev[table]||[]).map(r=>r.id===id?{...r,...updates}:r)})),[]);
  const addRecord=useCallback((table,record)=>setData(prev=>({...prev,[table]:[...(prev[table]||[]),record]})),[]);
  const deleteRecord=useCallback((table,id)=>setData(prev=>({...prev,[table]:(prev[table]||[]).filter(r=>r.id!==id)})),[]);
  const updateSettings=useCallback((updates)=>setData(prev=>({...prev,settings:{...prev.settings,...updates}})),[]);
  const resetData=useCallback(()=>{const d=emptyData();setData(d);saveData(d);storage.remove(ONBOARDING_KEY);},[]);
  // Navigazione: imposta vista e, opzionalmente, il filtro iniziale Follow-Up (resettato per ogni navigazione normale)
  const go=useCallback((v,opts)=>{setFuFilter(opts&&opts.fuFilter?opts.fuFilter:null);setView(v);},[]);
  // Auto-import schede onboarding: una sola volta, importa gli slot già compilati dal cliente
  useEffect(()=>{
    if(autoCheckRef.current)return;
    autoCheckRef.current=true;
    const waiting=(data?.slots||[]).filter(s=>s.status==="waiting");
    if(!waiting.length)return;
    waiting.forEach(async slot=>{try{const r=await fetch(`/api/onboarding-check?slot=${slot.id}`);const d=await r.json();if(d.found){const clientId=uid();addRecord("clients",{id:clientId,name:d.name,phone:d.phone,email:d.email||"",channel:"WhatsApp",status:"new",tags:[],notes:d.notes||"",firstVisit:today(),lastVisit:today()});update("slots",slot.id,{status:"imported"});}}catch(e){console.error("[auto-check]",e);}});
  },[data,addRecord,update]);
  const ctx=useMemo(()=>({data,update,addRecord,deleteRecord,updateSettings,resetData}),[data,update,addRecord,deleteRecord,updateSettings,resetData]);

  const td=today();
  const pendingCount=(data?.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td&&!isPhaseOff(data?.templates,f.phase)).length;
  const viewMap={home:<Home setView={go}/>,appointments:<Appointments/>,orders:<Orders/>,followup:<FollowUp setView={go} initialFilter={fuFilter}/>,clients:<Clients/>,templates:<Templates/>,feedback:<Feedback/>,modules:<ModulesMap/>,settings:<Settings/>,more:<MoreMenu setView={go}/>};
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
      </Ctx.Provider>
    </ErrorBoundary>
  );
}
