import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { loadData, saveData, isOnboarded, emptyData, storage, ONBOARDING_KEY, healData } from "./storage.js";
import { saveBackup } from "./backup.js";
import { pingUsage } from "./track.js";
import { uid, today, isPhaseOff } from "./helpers.js";
import { Ctx } from "./context.js";
import GlobalCSS from "./GlobalCSS.jsx";
import { TopBar, FloatingNav, MoreMenu, DesktopSidebar } from "./components/Nav.jsx";
import { Modal, Btn } from "./components/ui.jsx";
import InviteClient from "./components/InviteClient.jsx";
import Icon from "./components/Icon.jsx";
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
import Richieste from "./pages/Richieste.jsx";

// Migrazione una-tantum (v6.9): nei follow-up in attesa sostituisce il nome completo col solo nome.
// Gira UNA volta in fase di init dello stato (non dentro un effect → niente setState a cascata).
// Per chi l'ha già eseguita il flag è impostato e ritorna i dati invariati.
function migrateFirstName(data) {
  if (localStorage.getItem('sliss-mig-firstname')) return data;
  const clients = data?.clients || [];
  const followUps = data?.followUps || [];
  let changed = false;
  const updated = followUps.map(fu => {
    if (fu.status !== 'pending') return fu;
    const cl = clients.find(c => c.id === fu.clientId);
    if (!cl) return fu;
    const firstName = cl.firstName || cl.name.split(' ')[0];
    if (cl.name === firstName) return fu;
    const esc = cl.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newMsg = (fu.message || '').replace(new RegExp(esc, 'g'), firstName);
    if (newMsg === fu.message) return fu;
    changed = true;
    return { ...fu, message: newMsg };
  });
  localStorage.setItem('sliss-mig-firstname', '1');
  return changed ? { ...data, followUps: updated } : data;
}

// Conteggi aggregati per il resoconto del gate M1 (nessun dato personale, solo numeri).
// Unica fonte della formula "inviati/pending" così mount-ping e post-modifica restano allineati.
function computeUsageStats(d) {
  const fus = d?.followUps || [];
  return {
    clients: (d?.clients || []).length,
    followUpsSent: fus.filter(f => f.status === "sent" || f.status === "replied" || f.status === "completed").length,
    followUpsPending: fus.filter(f => f.status === "pending").length,
  };
}

export default function SlissPlatform() {
  const [view,setView]=useState("home");
  const [fuFilter,setFuFilter]=useState(null);
  const [selFuId,setSelFuId]=useState(null);
  const [selClientId,setSelClientId]=useState(null);
  // localStorage è sincrono: inizializziamo i dati subito (niente stato "loading", niente flash all'avvio)
  const [data,setData]=useState(()=>migrateFirstName(loadData()));
  const [showOnboarding,setShowOnboarding]=useState(()=>!isOnboarded());
  // Notifica "è ora dei feedback" → apre l'app su ?goto=feedback: mostriamo la schermata dedicata
  const [showFeedbackNudge,setShowFeedbackNudge]=useState(()=>new URLSearchParams(window.location.search).get('goto')==='feedback');
  const [showUpdateNudge,setShowUpdateNudge]=useState(()=>new URLSearchParams(window.location.search).get('goto')==='novita');
  const autoCheckRef=useRef(false);
  const richiesteCheckRef=useRef(false);
  // Tasto "+" della barra flottante: apre un mini-menu, poi naviga alla pagina e ne apre il form "aggiungi".
  const [addSheet,setAddSheet]=useState(false);
  const [addOn,setAddOn]=useState(null);
  const [showInvite,setShowInvite]=useState(false);

  // Cattura il codice tester dall'URL (?tester=) una sola volta, senza toccare lo stato React
  useEffect(()=>{const t=new URLSearchParams(window.location.search).get('tester');if(t)localStorage.setItem('sliss-tester',t);},[]);
  // Tracking minimo d'uso (gate M1): ping silenzioso all'apertura, registra il giorno d'uso + conteggi aggregati
  useEffect(()=>{const tester=localStorage.getItem('sliss-tester');if(!tester)return;pingUsage(tester,computeUsageStats(loadData()));},[]);
  // Pulisce ?goto dall'URL dopo averlo letto (così un refresh non riapre la schermata)
  useEffect(()=>{const p=new URLSearchParams(window.location.search);if(p.get('goto')){p.delete('goto');const qs=p.toString();window.history.replaceState({},"",window.location.pathname+(qs?`?${qs}`:""));}},[]);
  useEffect(()=>{saveData(data);},[data]);

  // Backup cloud best-effort: copia i dati nel cloud poco dopo ogni modifica (solo se c'è un codice tester). Mai bloccante.
  useEffect(()=>{const tester=localStorage.getItem('sliss-tester');if(!tester)return;const id=setTimeout(()=>{saveBackup(tester,data);pingUsage(tester,computeUsageStats(data));},8000);return ()=>clearTimeout(id);},[data]);

  const update=useCallback((table,id,updates)=>setData(prev=>({...prev,[table]:(prev[table]||[]).map(r=>r.id===id?{...r,...updates}:r)})),[]);
  const addRecord=useCallback((table,record)=>setData(prev=>({...prev,[table]:[...(prev[table]||[]),record]})),[]);
  const deleteRecord=useCallback((table,id)=>setData(prev=>({...prev,[table]:(prev[table]||[]).filter(r=>r.id!==id)})),[]);
  const updateSettings=useCallback((updates)=>setData(prev=>({...prev,settings:{...prev.settings,...updates}})),[]);
  const resetData=useCallback(()=>{const d=emptyData();setData(d);saveData(d);storage.remove(ONBOARDING_KEY);},[]);
  // Ripristino da backup: sostituisce i dati locali con quelli passati (sanati dalla stessa heal di loadData).
  const importData=useCallback((d)=>{const healed=healData(d);setData(healed);saveData(healed);},[]);
  // Navigazione: imposta vista e, opzionalmente, il filtro iniziale Follow-Up (resettato per ogni navigazione normale)
  const go=useCallback((v,opts)=>{setFuFilter(opts&&opts.fuFilter?opts.fuFilter:null);setSelFuId(opts&&opts.fuId?opts.fuId:null);setSelClientId(opts&&opts.clientId?opts.clientId:null);setView(v);},[]);
  // Il segnale "apri il form aggiungi" è transitorio: si spegne dopo che la pagina l'ha consumato.
  useEffect(()=>{if(!addOn)return;const t=setTimeout(()=>setAddOn(null),150);return ()=>clearTimeout(t);},[addOn]);
  // Auto-import schede onboarding: una sola volta, importa gli slot già compilati dal cliente
  useEffect(()=>{
    if(autoCheckRef.current)return;
    autoCheckRef.current=true;
    const waiting=(data?.slots||[]).filter(s=>s.status==="waiting");
    if(!waiting.length)return;
    waiting.forEach(async slot=>{try{const r=await fetch(`/api/onboarding-check?slot=${slot.id}`);const d=await r.json();if(d.found){const clientId=uid();const _np=(d.name||'').trim().split(' ');const _fn=_np[0]||'';const _ln=_np.slice(1).join(' ');addRecord("clients",{id:clientId,firstName:_fn,lastName:_ln,name:d.name||'',phone:d.phone,email:d.email||"",channel:"WhatsApp",status:"new",tags:[],notes:d.notes||"",firstVisit:today(),lastVisit:today()});update("slots",slot.id,{status:"imported"});}}catch(e){console.error("[auto-check]",e);}});
  },[data,addRecord,update]);
  // Raccolta automatica delle Richieste dalla cassetta (M3): una volta all'avvio,
  // importa quelle nuove (dedup per id) nella lista locale di Luca.
  useEffect(()=>{
    if(richiesteCheckRef.current)return;
    richiesteCheckRef.current=true;
    const tester=localStorage.getItem('sliss-tester');
    if(!tester)return;
    (async()=>{try{
      const r=await fetch(`/api/richiesta-list?owner=${encodeURIComponent(tester)}`);
      const d=await r.json();
      const incoming=d?.items||[];
      if(!incoming.length)return;
      setData(prev=>{
        const have=new Set((prev.richieste||[]).map(x=>x.id));
        const fresh=incoming.filter(it=>it&&it.id&&!have.has(it.id));
        return fresh.length?{...prev,richieste:[...fresh,...(prev.richieste||[])]}:prev;
      });
    }catch(e){console.error("[richieste-check]",e);}})();
  },[]);
  const ctx=useMemo(()=>({data,update,addRecord,deleteRecord,updateSettings,resetData,importData}),[data,update,addRecord,deleteRecord,updateSettings,resetData,importData]);

  const td=today();
  const pendingCount=(data?.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td&&!isPhaseOff(data?.templates,f.phase)).length;
  const viewMap={home:<Home setView={go}/>,appointments:<Appointments setView={go} openAdd={addOn==='appointments'}/>,orders:<Orders setView={go} openAdd={addOn==='orders'}/>,followup:<FollowUp setView={go} initialFilter={fuFilter} initialFuId={selFuId}/>,clients:<Clients initialClientId={selClientId} openAdd={addOn==='clients'}/>,richieste:<Richieste/>,templates:<Templates/>,feedback:<Feedback setView={go}/>,modules:<ModulesMap/>,settings:<Settings/>,more:<MoreMenu setView={go}/>};
  const CurrentView=viewMap[view]||viewMap.home;

  if(showOnboarding) return <ErrorBoundary><Ctx.Provider value={ctx}><GlobalCSS /><Onboarding onComplete={()=>setShowOnboarding(false)} /></Ctx.Provider></ErrorBoundary>;

  return (
    <ErrorBoundary>
      <Ctx.Provider value={ctx}>
        <GlobalCSS />
        <div translate="no" lang="it">
          <TopBar view={view} setView={go} />
          <div style={{display:"flex",minHeight:"100vh"}}>
            <DesktopSidebar view={view} setView={go} />
            <main className="app-main">{CurrentView}</main>
          </div>
        </div>
        <FloatingNav view={view} setView={go} pendingCount={pendingCount} bizType={data?.settings?.bizType||""} onAdd={()=>setAddSheet(true)} />
        <Modal open={addSheet} onClose={()=>setAddSheet(false)} title="Cosa vuoi aggiungere?" w="380px">
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {/* "Invita cliente" genera un link onboarding legato a un appuntamento → ha senso solo nel flusso servizi. Nascosto per i prodotti (il cliente arriva da WhatsApp/eBay/Instagram, non si invita). */}
            {data?.settings?.bizType!=="prodotti" && <Btn onClick={()=>{setAddSheet(false);setShowInvite(true);}} style={{width:"100%",justifyContent:"center"}}><Icon name="link" size={16} />Invita cliente</Btn>}
            <Btn v={data?.settings?.bizType==="prodotti"?"primary":"secondary"} onClick={()=>{setAddSheet(false);setAddOn("clients");go("clients");}} style={{width:"100%",justifyContent:"center"}}>Nuovo cliente</Btn>
            <Btn v="secondary" onClick={()=>{const v=(data?.settings?.bizType==="prodotti")?"orders":"appointments";setAddSheet(false);setAddOn(v);go(v);}} style={{width:"100%",justifyContent:"center"}}>{(data?.settings?.bizType==="prodotti")?"Nuovo ordine":"Nuovo appuntamento"}</Btn>
          </div>
        </Modal>
        {showInvite && <InviteClient onClose={()=>setShowInvite(false)} />}
        {showFeedbackNudge && <FeedbackNudge onClose={()=>setShowFeedbackNudge(false)} />}
        {showUpdateNudge && <UpdateNudge onClose={()=>setShowUpdateNudge(false)} />}
      </Ctx.Provider>
    </ErrorBoundary>
  );
}
