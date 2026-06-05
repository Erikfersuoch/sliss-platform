import { useState } from "react";
import T from "../theme.js";
import { CLUSTERS_SERVIZI, CLUSTERS_PRODOTTI } from "../config.js";
import { useSliss } from "../context.js";
import { Btn, Card, FormField, PageHeader } from "../components/ui.jsx";
import { subscribeToPush } from "../push.js";

const Settings = () => {
  const {data,updateSettings,resetData}=useSliss();const s=data.settings||{};
  const [bName,setBName]=useState(s.businessName||"");const [currentBizType,setCurrentBizType]=useState(s.bizType||"servizi");const [currentCluster,setCurrentCluster]=useState(s.cluster||"altro");const [reviewLink,setReviewLink]=useState(s.reviewLink||"");const [timings,setTimings]=useState(s.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60});const [saved,setSaved]=useState(false);
  const [notifStatus,setNotifStatus]=useState(()=>'Notification' in window?Notification.permission:'unsupported');
  const [testerCode,setTesterCode]=useState(()=>localStorage.getItem('sliss-tester')||"");
  const handleSave=()=>{updateSettings({businessName:bName,reviewLink,bizType:currentBizType,cluster:currentCluster,followUpTimings:timings});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const handleNotif=async()=>{const ok=await subscribeToPush();setNotifStatus(ok?'granted':'denied');};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Impostazioni" />
      <Card style={{marginBottom:"14px"}}><h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"16px"}}>{"Attivit\u{e0}"}</h3><FormField label={"Nome attivit\u{e0}"} hint="Appare nel saluto della Home"><input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" /></FormField><FormField label="Tipo attività" hint="Cambia il flusso: appuntamenti o ordini"><select value={currentBizType} onChange={e=>{const t=e.target.value;setCurrentBizType(t);setCurrentCluster(t==="prodotti"?Object.keys(CLUSTERS_PRODOTTI)[0]:Object.keys(CLUSTERS_SERVIZI)[0]);}}><option value="servizi">Servizi — appuntamenti</option><option value="prodotti">Prodotti — ordini</option></select></FormField><FormField label="Settore" hint="Usato per adattare i template"><select value={currentCluster} onChange={e=>setCurrentCluster(e.target.value)}>{Object.entries(currentBizType==="prodotti"?CLUSTERS_PRODOTTI:CLUSTERS_SERVIZI).map(([key,cl])=>(<option key={key} value={key}>{cl.icon} {cl.label}</option>))}</select></FormField><FormField label="Link Google Reviews" hint="Aggiunto ai messaggi di recensione"><input value={reviewLink} onChange={e=>setReviewLink(e.target.value)} placeholder="https://g.page/r/..." /></FormField></Card>
      <Card style={{marginBottom:"14px"}}><h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"4px"}}>Timing follow-up</h3><p style={{fontSize:"12px",color:T.textD,marginBottom:"16px"}}>Quando inviare ogni fase dopo l'appuntamento.</p><div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}><div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:500}}>Ringraziamento</div><div style={{fontSize:"12px",color:T.textMu}}>Ore dopo l'appuntamento</div></div><div style={{display:"flex",alignItems:"center",gap:"8px"}}><input type="number" min="0" max="48" value={timings.thankyouHours||2} onChange={e=>setTimings(p=>({...p,thankyouHours:parseInt(e.target.value)||0}))} style={{width:"70px",textAlign:"center"}} /><span style={{fontSize:"13px",color:T.textD}}>ore</span></div></div>{[{key:"check",label:"Controllo",note:"7 giorni"},{key:"review",label:"Recensione",note:"21 giorni"},{key:"reactivation",label:"Riattivazione",note:"60 giorni"}].map(({key,label,note})=>(<div key={key} style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}><div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:500}}>{label}</div><div style={{fontSize:"12px",color:T.textMu}}>Di solito {note}</div></div><div style={{display:"flex",alignItems:"center",gap:"8px"}}><input type="number" min="0" max="365" value={timings[key]} onChange={e=>setTimings(p=>({...p,[key]:parseInt(e.target.value)||0}))} style={{width:"70px",textAlign:"center"}} /><span style={{fontSize:"13px",color:T.textD}}>giorni</span></div></div>))}</Card>
      <Card style={{marginBottom:"14px"}}>
        <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"10px"}}>Notifiche</h3>
        <FormField label="Codice tester" hint="Identifica il tuo telefono per i reminder. Scrivi: erik, moira o luca."><input value={testerCode} onChange={e=>{const v=e.target.value.trim().toLowerCase();setTesterCode(v);if(v)localStorage.setItem('sliss-tester',v);}} placeholder="es. erik" /></FormField>
        {notifStatus==='granted' && <><div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 14px",background:T.greenS,borderRadius:T.r.l,border:`1px solid ${T.green}`}}><span style={{fontSize:"18px"}}>{"✓"}</span><span style={{fontSize:"14px",color:T.green,fontWeight:600}}>Notifiche attive</span></div><Btn v="secondary" s="sm" disabled={!testerCode} onClick={handleNotif} style={{width:"100%",justifyContent:"center",marginTop:"10px"}}>{"🔄 Aggiorna iscrizione"}</Btn></>}
        {notifStatus==='denied' && <><div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 14px",background:"#FEF2F2",borderRadius:T.r.l,border:"1px solid #FECACA",marginBottom:"10px"}}><span style={{fontSize:"18px"}}>{"🔕"}</span><span style={{fontSize:"13px",color:"#DC2626"}}>Notifiche bloccate dal browser</span></div><p style={{fontSize:"12px",color:T.textD,lineHeight:1.6}}>{"Vai in Impostazioni iPhone → Safari → Notifiche e riattiva Sliss."}</p></>}
        {notifStatus==='default' && <><p style={{fontSize:"13px",color:T.textM,lineHeight:1.6,marginBottom:"12px"}}>Ricevi un reminder quando inserire i clienti e quando hai follow-up in scadenza.</p><Btn disabled={!testerCode} onClick={handleNotif} style={{width:"100%",justifyContent:"center"}}>{"🔔 Attiva notifiche"}</Btn></>}
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

export default Settings;
