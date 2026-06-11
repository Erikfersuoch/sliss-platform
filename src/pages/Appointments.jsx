import { useState } from "react";
import T from "../theme.js";
import { PHASES, CLUSTERS_SERVIZI } from "../config.js";
import { fmtDate, daysUntil, addDays, uid, today, isPhaseOff, inviteWaLink, openSend, gcalLink } from "../helpers.js";
import { useSliss } from "../context.js";
import Icon from "../components/Icon.jsx";
import { Badge, Btn, Card, Empty, GhostRow, Modal, FormField, PageHeader } from "../components/ui.jsx";
import { buildFollowUps } from "../followups.js";
import MonthCalendar from "../components/MonthCalendar.jsx";
import InviteClient from "../components/InviteClient.jsx";

const Appointments = ({setView}) => {
  const {data,addRecord,deleteRecord,update}=useSliss();
  const [showNew,setShowNew]=useState(false);const [form,setForm]=useState({clientId:"",date:today(),serviceType:"Sessione",notes:""});const [done,setDone]=useState(false);
  const [showInvite,setShowInvite]=useState(false);const [inviteDate,setInviteDate]=useState(today());
  const [editApptId,setEditApptId]=useState(null);const [editApptDate,setEditApptDate]=useState("");
  const [editSlotId,setEditSlotId]=useState(null);const [editSlotDate,setEditSlotDate]=useState("");
  const [calView,setCalView]=useState("month");
  const cluster=data?.settings?.cluster||"altro_s";
  const SERVICE_TYPES=(CLUSTERS_SERVIZI[cluster]?.serviceTypes)||CLUSTERS_SERVIZI.altro_s.serviceTypes;
  const sorted=[...(data?.appointments||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  // Trappola del cliente-vuoto: senza clienti il form "Nuovo appuntamento" ha il menù
  // cliente vuoto. Allora l'empty manda PRIMA ad aggiungere un cliente, non in un form bloccato.
  const noClients=(data?.clients||[]).length===0;
  const handleAdd=()=>{if(!form.clientId||!form.date)return;const client=(data?.clients||[]).find(c=>c.id===form.clientId);if(!client)return;const apptId=uid();const timings=data.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};addRecord("appointments",{id:apptId,clientId:form.clientId,date:form.date,serviceType:form.serviceType,notes:form.notes,followUpTriggered:true,created:today()});buildFollowUps(apptId,form.clientId,client.name,form.date,form.serviceType,timings,data?.templates).forEach(fu=>addRecord("followUps",fu));setDone(true);setTimeout(()=>{setDone(false);setShowNew(false);setForm({clientId:"",date:today(),serviceType:"Sessione",notes:""});},1800);};
  const handleDelete=appt=>{if(!window.confirm("Eliminare questo appuntamento e i suoi follow-up?"))return;deleteRecord("appointments",appt.id);(data?.followUps||[]).filter(f=>f.appointmentId===appt.id).forEach(f=>deleteRecord("followUps",f.id));};
  const rescheduleAppt=(apptId,newDate)=>{update("appointments",apptId,{date:newDate});const timings=data.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};(data?.followUps||[]).filter(f=>f.appointmentId===apptId&&f.status==="pending").forEach(f=>update("followUps",f.id,{scheduledDate:addDays(newDate,timings[f.phase]||0)}));};
  // Modifica data di una scheda in attesa: aggiorna la data (informativa) e rigenera il link coerente
  const rescheduleSlot=(slot,newDate)=>{const biz=data.settings?.businessName||'Sliss';const link=`https://sliss-platform.vercel.app/onboarding.html?slot=${slot.id}&date=${newDate}&biz=${encodeURIComponent(biz)}&o=${encodeURIComponent(slot.owner||'unknown')}&svc=${encodeURIComponent(slot.serviceType||'')}`;update("slots",slot.id,{date:newDate,link});};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Agenda" action={<Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo appuntamento</Btn>} />
      <div style={{marginBottom:"10px"}}><p style={{fontSize:"13px",color:T.textD}}>{"Aggiungi un appuntamento \u{2192} i follow-up si generano in automatico"}</p></div>
      <div role="button" tabIndex={0} onClick={()=>{setInviteDate(today());setShowInvite(true);}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setInviteDate(today());setShowInvite(true);}}} style={{display:"flex",alignItems:"center",gap:"10px",border:`1px dashed ${T.borderH}`,background:T.bg2,borderRadius:T.r.m,padding:"11px 13px",marginBottom:"14px",cursor:"pointer"}}>
        <span style={{fontSize:"18px",flexShrink:0}}>{"\u{1F517}"}</span>
        <span style={{flex:1,minWidth:0}}><span style={{display:"block",fontSize:"13px",fontWeight:700}}>Invita cliente</span><span style={{display:"block",fontSize:"11.5px",color:T.textD,lineHeight:1.45,marginTop:"1px"}}>Fissi la consulenza e gli mandi il link: lo compila lui ed entra tra i clienti</span></span>
        <span style={{color:T.borderH,fontSize:"16px",flexShrink:0}}>{"\u{203A}"}</span>
      </div>
      <div style={{display:"flex",gap:"6px",marginBottom:"14px"}}>{[{id:"month",label:"Calendario"},{id:"list",label:"Lista"}].map(t=>(<button key={t.id} onClick={()=>setCalView(t.id)} style={{flex:1,padding:"9px 0",borderRadius:T.r.m,border:`1px solid ${calView===t.id?T.green:T.border}`,background:calView===t.id?T.greenS:T.bg2,color:calView===t.id?T.green:T.textD,fontWeight:600,fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{t.label}</button>))}</div>
      {calView==="month"&&<MonthCalendar appointments={data?.appointments||[]} clients={data?.clients||[]} onPrepareScheda={date=>{setInviteDate(date);setShowInvite(true);}} />}
      {calView==="list"&&<>
      {(data?.slots||[]).filter(s=>s.status==="waiting").length>0&&<div style={{marginBottom:"16px"}}><div style={{fontSize:"11px",fontWeight:700,color:T.textD,textTransform:"uppercase",letterSpacing:".06em",marginBottom:"8px"}}>Schede in attesa</div><div style={{display:"flex",flexDirection:"column",gap:"8px"}}>{(data?.slots||[]).filter(s=>s.status==="waiting").map(slot=>{return (<Card key={slot.id} style={{background:T.amberS,border:`1px solid ${T.amber}55`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}><div>{editSlotId===slot.id?<div style={{display:"flex",gap:"6px",alignItems:"center"}}><input type="date" value={editSlotDate} onChange={e=>setEditSlotDate(e.target.value)} style={{fontSize:"12px",padding:"4px 8px",border:`1px solid ${T.border}`,borderRadius:"8px"}} /><Btn s="sm" onClick={()=>{rescheduleSlot(slot,editSlotDate);setEditSlotId(null);}} disabled={!editSlotDate}>✓</Btn><Btn v="secondary" s="sm" onClick={()=>setEditSlotId(null)}>✕</Btn></div>:<div style={{fontWeight:600,fontSize:"14px"}}>{slot.serviceType} · {fmtDate(slot.date)} <span role="button" onClick={()=>{setEditSlotId(slot.id);setEditSlotDate(slot.date);}} style={{cursor:"pointer",fontSize:"11px",opacity:.6}}>✏️</span></div>}<div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>In attesa del cliente</div></div><Badge label="In attesa" color={T.amber} bg={T.amberS} s /></div><div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}><Btn v="secondary" s="sm" onClick={()=>openSend(inviteWaLink(slot.phone,slot.link||"",slot.date))}>{"📲 WhatsApp"}</Btn><Btn v="danger" s="sm" onClick={()=>update("slots",slot.id,{status:"imported"})}>✕</Btn></div></Card>);})}</div></div>}
      {!sorted.length
        ? noClients
          ? <Empty preview={<GhostRow avatar={false} />} previewLabel="qui vedrai gli appuntamenti" title="L'appuntamento parte da un cliente" desc="Prima aggiungi chi servirai, poi qui fissi l'appuntamento e i follow-up si generano da soli." action={<Btn onClick={()=>setView&&setView("clients")}>+ Aggiungi un cliente</Btn>} hint="poi torna qui per l'appuntamento" />
          : <Empty icon={"\u{1F4C5}"} title="Nessun appuntamento" desc="Aggiungi il primo appuntamento per generare i follow-up." action={<Btn onClick={()=>setShowNew(true)}>+ Aggiungi</Btn>} />
        : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>{sorted.map((appt,i)=>{const cl=(data?.clients||[]).find(c=>c.id===appt.clientId);const fus=(data?.followUps||[]).filter(f=>f.appointmentId===appt.id);const pc=fus.filter(f=>f.status==="pending").length;const dc=fus.filter(f=>f.status==="sent"||f.status==="replied").length;return (<Card key={appt.id} style={{animation:`fadeIn .3s ease ${i*.03}s both`}}><div style={{display:"flex",alignItems:"flex-start",gap:"12px",marginBottom:fus.length?"12px":"0"}}><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"15px"}}>{cl?.name||"\u{2014}"}</div>{editApptId===appt.id?<div style={{display:"flex",gap:"6px",alignItems:"center",marginTop:"4px"}}><input type="date" value={editApptDate} onChange={e=>setEditApptDate(e.target.value)} style={{fontSize:"12px",padding:"4px 8px",border:`1px solid ${T.border}`,borderRadius:"8px",flex:1}} /><Btn s="sm" onClick={()=>{rescheduleAppt(appt.id,editApptDate);setEditApptId(null);}} disabled={!editApptDate}>✓</Btn><Btn v="secondary" s="sm" onClick={()=>setEditApptId(null)}>✕</Btn></div>:<div style={{fontSize:"13px",color:T.textM,marginTop:"2px"}}>{appt.serviceType} · {fmtDate(appt.date)} <span role="button" onClick={e=>{e.stopPropagation();setEditApptId(appt.id);setEditApptDate(appt.date);}} style={{cursor:"pointer",fontSize:"11px",opacity:.6}}>✏️</span></div>}{appt.notes&&<div style={{fontSize:"12px",color:T.textMu,marginTop:"3px"}}>{"\u{1F4DD}"} {appt.notes}</div>}<div style={{fontSize:"12px",color:T.textD,marginTop:"4px"}}>{pc} in attesa · {dc} inviati</div></div><div style={{display:"flex",flexDirection:"column",gap:"6px"}}><Btn v="secondary" s="sm" aria="Aggiungi a Google Calendar" onClick={()=>window.open(gcalLink(appt.date,`${appt.serviceType||"Appuntamento"} \u{00B7} ${cl?.name||"Cliente"}`,appt.notes),"_blank")}>{"\u{1F4C5}"}</Btn><Btn v="danger" s="sm" aria="Elimina appuntamento" onClick={()=>handleDelete(appt)}>{"\u{1F5D1}\u{FE0F}"}</Btn></div></div>{fus.length>0&&<div style={{display:"flex",gap:"6px"}}>{["thankyou","check","review","reactivation"].map(phase=>{const fu=fus.find(f=>f.phase===phase);const ph=PHASES[phase];const off=fu&&fu.status==="pending"&&isPhaseOff(data?.templates,phase);const col=off?"rgba(90,111,148,0.12)":!fu?"rgba(90,111,148,0.12)":fu.status==="pending"?T.amberS:T.greenS;const txtCol=off?T.textMu:!fu?T.textMu:fu.status==="pending"?T.amber:T.green;const clickable=fu&&setView;return (<div key={phase} onClick={clickable?e=>{e.stopPropagation();const filter=fu.status==="pending"?"today":"awaiting";setView("followup",{fuId:fu.id,fuFilter:filter});}:undefined} style={{flex:1,padding:"6px 4px",background:col,borderRadius:T.r.s,textAlign:"center",opacity:off?0.4:1,cursor:clickable?"pointer":"default"}}><div style={{display:"flex",justifyContent:"center"}}><Icon name={ph.icon} size={15} color={txtCol} /></div><div style={{fontSize:"10px",color:txtCol,fontWeight:600,marginTop:"2px"}}>{fu?daysUntil(fu.scheduledDate):"\u{2014}"}</div></div>);})}</div>}</Card>);})}</div>}
      </>}
      {showInvite && <InviteClient initialDate={inviteDate} onClose={()=>setShowInvite(false)} />}
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

export default Appointments;
