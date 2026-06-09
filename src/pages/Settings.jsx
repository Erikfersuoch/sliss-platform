import { useState } from "react";
import T from "../theme.js";
import { CLUSTERS_SERVIZI, CLUSTERS_PRODOTTI } from "../config.js";
import { useSliss } from "../context.js";
import { Btn, Card, FormField, PageHeader } from "../components/ui.jsx";
import { subscribeToPush } from "../push.js";
import { loadBackup } from "../backup.js";

const Settings = () => {
  const {data,updateSettings,resetData,importData}=useSliss();const s=data.settings||{};
  const [bName,setBName]=useState(s.businessName||"");const [currentBizType,setCurrentBizType]=useState(s.bizType||"servizi");const [currentCluster,setCurrentCluster]=useState(s.cluster||"altro");const [reviewLink,setReviewLink]=useState(s.reviewLink||"");const [timings,setTimings]=useState(s.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60});const [saved,setSaved]=useState(false);
  const [notifStatus,setNotifStatus]=useState(()=>'Notification' in window?Notification.permission:'unsupported');
  const [testerCode,setTesterCode]=useState(()=>localStorage.getItem('sliss-tester')||"");
  const handleSave=()=>{updateSettings({businessName:bName,reviewLink,bizType:currentBizType,cluster:currentCluster,followUpTimings:timings});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const handleNotif=async()=>{const ok=await subscribeToPush();setNotifStatus(ok?'granted':'denied');};
  const [restoring,setRestoring]=useState(false);const [restoreMsg,setRestoreMsg]=useState("");
  const handleRestore=async()=>{
    if(!testerCode){setRestoreMsg("Inserisci prima il codice tester qui sopra.");return;}
    setRestoring(true);setRestoreMsg("");
    const b=await loadBackup(testerCode);
    setRestoring(false);
    if(!b||!b.data){setRestoreMsg("Nessun backup trovato nel cloud per questo codice.");return;}
    const when=b.savedAt?new Date(b.savedAt).toLocaleString("it-IT"):"data sconosciuta";
    if(!window.confirm(`Ripristinare i dati dal backup del ${when}?\nI dati attuali su questo telefono verranno sostituiti.`))return;
    importData(b.data);
    setRestoreMsg("\u{2713} Dati ripristinati dal backup del "+when+".");
  };
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Impostazioni" />
      <Card style={{marginBottom:"14px"}}><h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"16px"}}>{"Attivit\u{e0}"}</h3><FormField label={"Nome attivit\u{e0}"} hint="Appare nel saluto della Home"><input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" /></FormField><FormField label="Tipo attività" hint="Cambia il flusso: appuntamenti o ordini"><select value={currentBizType} onChange={e=>{const t=e.target.value;setCurrentBizType(t);setCurrentCluster(t==="prodotti"?Object.keys(CLUSTERS_PRODOTTI)[0]:Object.keys(CLUSTERS_SERVIZI)[0]);}}><option value="servizi">Servizi — appuntamenti</option><option value="prodotti">Prodotti — ordini</option></select></FormField><FormField label="Settore" hint="Usato per adattare i template"><select value={currentCluster} onChange={e=>setCurrentCluster(e.target.value)}>{Object.entries(currentBizType==="prodotti"?CLUSTERS_PRODOTTI:CLUSTERS_SERVIZI).map(([key,cl])=>(<option key={key} value={key}>{cl.icon} {cl.label}</option>))}</select></FormField><FormField label="Link Google Reviews" hint="Aggiunto ai messaggi di recensione"><input value={reviewLink} onChange={e=>setReviewLink(e.target.value)} placeholder="https://g.page/r/..." /></FormField></Card>
      <Card style={{marginBottom:"14px"}}><h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"4px"}}>Timing follow-up</h3><p style={{fontSize:"12px",color:T.textD,marginBottom:"16px"}}>Quando inviare ogni fase dopo l'appuntamento.</p>
        {[
          {key:"thankyouHours",label:"Ringraziamento",unit:"ore",step:1,min:0,max:48,def:2},
          {key:"check",label:"Controllo",unit:"giorni",step:1,min:0,max:365,def:7},
          {key:"review",label:"Recensione",unit:"giorni",step:5,min:0,max:365,def:21},
          {key:"reactivation",label:"Riattivazione",unit:"giorni",step:10,min:0,max:365,def:60},
        ].map(({key,label,unit,step,min,max,def})=>{
          const val=timings[key]??def;
          const btnStyle={width:"36px",height:"36px",border:`1px solid ${T.border}`,borderRadius:T.r.m,background:T.bg3,color:T.text,fontSize:"18px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"};
          return (<div key={key} style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}>
            <div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:500}}>{label}</div><div style={{fontSize:"12px",color:T.textMu}}>step: {step} {unit}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <button style={btnStyle} onClick={()=>setTimings(p=>({...p,[key]:Math.max(min,val-step)}))}>−</button>
              <span style={{minWidth:"42px",textAlign:"center",fontSize:"15px",fontWeight:600}}>{val}</span>
              <button style={btnStyle} onClick={()=>setTimings(p=>({...p,[key]:Math.min(max,val+step)}))}>+</button>
              <span style={{fontSize:"13px",color:T.textD,minWidth:"32px"}}>{unit}</span>
            </div>
          </div>);
        })}
      </Card>
      <Card style={{marginBottom:"14px"}}>
        <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"10px"}}>Notifiche</h3>
        <FormField label="Codice tester" hint="Identifica il tuo telefono per i reminder. Scrivi: erik, moira o luca."><input value={testerCode} onChange={e=>{const v=e.target.value.trim().toLowerCase();setTesterCode(v);if(v)localStorage.setItem('sliss-tester',v);}} placeholder="es. erik" /></FormField>
        {notifStatus==='granted' && <><div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 14px",background:T.greenS,borderRadius:T.r.l,border:`1px solid ${T.green}`}}><span style={{fontSize:"18px"}}>{"✓"}</span><span style={{fontSize:"14px",color:T.green,fontWeight:600}}>Notifiche attive</span></div><Btn v="secondary" s="sm" disabled={!testerCode} onClick={handleNotif} style={{width:"100%",justifyContent:"center",marginTop:"10px"}}>{"🔄 Aggiorna iscrizione"}</Btn></>}
        {notifStatus==='denied' && <><div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 14px",background:"#FEF2F2",borderRadius:T.r.l,border:"1px solid #FECACA",marginBottom:"10px"}}><span style={{fontSize:"18px"}}>{"🔕"}</span><span style={{fontSize:"13px",color:"#DC2626"}}>Notifiche bloccate dal browser</span></div><p style={{fontSize:"12px",color:T.textD,lineHeight:1.6}}>{"Vai in Impostazioni iPhone → Safari → Notifiche e riattiva Sliss."}</p></>}
        {notifStatus==='default' && <><p style={{fontSize:"13px",color:T.textM,lineHeight:1.6,marginBottom:"12px"}}>Ricevi un reminder quando inserire i clienti e quando hai follow-up in scadenza.</p><Btn disabled={!testerCode} onClick={handleNotif} style={{width:"100%",justifyContent:"center"}}>{"🔔 Attiva notifiche"}</Btn></>}
        {notifStatus==='unsupported' && <p style={{fontSize:"13px",color:T.textD}}>{"Le notifiche non sono supportate su questo browser. Usa Safari su iPhone."}</p>}
      </Card>
      <Card style={{marginBottom:"20px"}}>
        <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"10px"}}>Dati e backup</h3>
        <p style={{fontSize:"13px",color:T.textD,lineHeight:1.7,marginBottom:"12px"}}>I dati vivono su questo telefono. Se hai impostato il <b>codice tester</b>, una copia di sicurezza viene salvata automaticamente nel cloud: se cambi telefono o reinstalli l'app, puoi ripristinarla da qui.</p>
        <Btn v="secondary" s="sm" disabled={!testerCode||restoring} onClick={handleRestore}>{restoring?"Controllo backup\u{2026}":"\u{2601}\u{FE0F} Ripristina da backup"}</Btn>
        {restoreMsg&&<p style={{fontSize:"12px",color:restoreMsg.startsWith("\u{2713}")?T.green:T.textD,marginTop:"10px",lineHeight:1.5}}>{restoreMsg}</p>}
        <div style={{borderTop:`1px solid ${T.border}`,marginTop:"14px",paddingTop:"14px"}}>
          <Btn v="danger" s="sm" onClick={()=>{if(window.confirm("Reset completo? Tutti i dati verranno eliminati."))resetData();}}>{"\u{1F5D1}\u{FE0F}"} Reset dati</Btn>
        </div>
      </Card>
      <Btn onClick={handleSave} style={{width:"100%",justifyContent:"center"}}>{saved?"\u{2713} Salvato!":"Salva impostazioni"}</Btn>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default Settings;
