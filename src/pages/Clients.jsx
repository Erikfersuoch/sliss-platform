import { useState } from "react";
import T from "../theme.js";
import { CLIENT_ST, CLUSTERS_SERVIZI } from "../config.js";
import { fmtDate, daysAgo, addDays, uid, today } from "../helpers.js";
import { useSliss } from "../context.js";
import { Badge, Btn, Card, Empty, Search, Tabs, Modal, FormField, PageHeader, Info } from "../components/ui.jsx";
import { HELP } from "../help.js";
import { buildFollowUps, buildProductFollowUps } from "../followups.js";
import InviteClient from "../components/InviteClient.jsx";

const Clients = ({initialClientId}) => {
  const {data,addRecord,update,deleteRecord}=useSliss();
  // Apertura diretta della scheda quando si arriva dalla Home (?clientId): init al mount, niente effect
  const _initC=initialClientId?(data?.clients||[]).find(x=>x.id===initialClientId):null;
  const [search,setSearch]=useState("");const [sf,setSf]=useState("all");const [sel,setSel]=useState(_initC||null);const [showNew,setShowNew]=useState(false);const [editMode,setEditMode]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",email:"",channel:"WhatsApp",notes:""});const [editForm,setEditForm]=useState(_initC?{name:_initC.name,phone:_initC.phone,email:_initC.email,channel:_initC.channel,notes:_initC.notes||"",status:_initC.status}:null);const [showInvite,setShowInvite]=useState(false);
  const bizType=data?.settings?.bizType||"servizi";const clientCluster=data?.settings?.cluster||"altro_s";const clusterSvcTypes=(CLUSTERS_SERVIZI[clientCluster]?.serviceTypes)||CLUSTERS_SERVIZI.altro_s.serviceTypes;
  const [newApptMode,setNewApptMode]=useState(false);const [newApptDone,setNewApptDone]=useState(false);const [newApptForm,setNewApptForm]=useState({date:today(),serviceType:"",notes:"",product:""});
  const handleNewAppt=()=>{if(!sel||!newApptForm.date)return;if(bizType==="servizi"){const apptId=uid();const svcType=newApptForm.serviceType||clusterSvcTypes[0]||"Sessione";const timings=data.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};addRecord("appointments",{id:apptId,clientId:sel.id,date:newApptForm.date,serviceType:svcType,notes:newApptForm.notes,followUpTriggered:true,created:today()});buildFollowUps(apptId,sel.id,sel.name,newApptForm.date,svcType,timings,data?.templates).forEach(fu=>addRecord("followUps",fu));}else{const orderId=uid();const deliveryDate=addDays(newApptForm.date,7);addRecord("orders",{id:orderId,clientId:sel.id,product:newApptForm.product||"Ordine",orderDate:newApptForm.date,deliveryDate,notes:newApptForm.notes,status:"pending",created:today()});buildProductFollowUps(orderId,sel.id,sel.name,newApptForm.date,deliveryDate,data?.templates).forEach(fu=>addRecord("followUps",fu));}setNewApptDone(true);setTimeout(()=>{setNewApptMode(false);setNewApptDone(false);setNewApptForm({date:today(),serviceType:"",notes:"",product:""});},1500);};
  const clients=data?.clients||[];
  const tabs=[{id:"all",label:"Tutti",count:clients.length},{id:"active",label:"Attivi",count:clients.filter(c=>c.status==="active").length},{id:"vip",label:"VIP",count:clients.filter(c=>c.status==="vip").length},{id:"to_reactivate",label:"Da riatt.",count:clients.filter(c=>c.status==="to_reactivate").length}];
  const filtered=clients.filter(c=>{const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase());return ms&&(sf==="all"||c.status===sf);});
  const handleAdd=()=>{if(!form.name.trim())return;const td=today();addRecord("clients",{...form,id:uid(),status:"new",firstVisit:td,lastVisit:td,consent:true,created:td});setForm({name:"",phone:"",email:"",channel:"WhatsApp",notes:""});setShowNew(false);};
  const handleEdit=()=>{if(!editForm?.name?.trim())return;update("clients",sel.id,editForm);setSel({...sel,...editForm});setEditMode(false);};
  const handleDelete=id=>{if(window.confirm("Eliminare questo cliente?")){deleteRecord("clients",id);setSel(null);}};
  const openClient=cl=>{setSel(cl);setEditForm({name:cl.name,phone:cl.phone,email:cl.email,channel:cl.channel,notes:cl.notes||"",status:cl.status});setEditMode(false);setNewApptMode(false);setNewApptDone(false);};
  const statusOrder=["new","active","vip","to_reactivate","inactive"];
  const nextStatus=cur=>{const idx=statusOrder.indexOf(cur);return statusOrder[(idx+1)%statusOrder.length];};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Clienti" action={<div style={{display:"flex",gap:"6px",alignItems:"center"}}><Info {...HELP.invitaCliente} /><Btn v="secondary" s="sm" onClick={()=>setShowInvite(true)}>{"\u{1F517} Invita cliente"}</Btn><Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn></div>} />
      {showInvite && <InviteClient onClose={()=>setShowInvite(false)} />}
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"16px"}}><Tabs tabs={tabs} active={sf} onChange={setSf} /><Search value={search} onChange={setSearch} placeholder="Cerca nome o email..." /></div>
      {!filtered.length ? <Empty icon={"\u{1F465}"} title="Nessun cliente" desc="Aggiungi il tuo primo cliente per iniziare." action={<Btn onClick={()=>setShowNew(true)}>+ Aggiungi</Btn>} /> : <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>{filtered.map((cl,i)=>{const st=CLIENT_ST[cl.status]||{label:cl.status,color:T.textD,bg:T.bg3};return (<Card key={cl.id} hov onClick={()=>openClient(cl)} style={{padding:"13px 16px",animation:`fadeIn .3s ease ${i*.03}s both`}}><div style={{display:"flex",alignItems:"center",gap:"12px"}}><div style={{width:"40px",height:"40px",borderRadius:"50%",background:T.bg3,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:700,color:T.textM,flexShrink:0}}>{cl.name.charAt(0).toUpperCase()}</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"15px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl.name}</div><div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{cl.channel} · {daysAgo(cl.lastVisit)}</div></div><div onClick={e=>{e.stopPropagation();update("clients",cl.id,{status:nextStatus(cl.status)});}} style={{cursor:"pointer",padding:"4px"}}><Badge {...st} s /></div></div></Card>);})}</div>}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo cliente">
        <FormField label="Nome completo"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Nome Cognome" /></FormField>
        <FormField label="Telefono"><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" type="tel" /></FormField>
        <FormField label="Email"><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@esempio.com" type="email" /></FormField>
        <FormField label="Metodo di contatto"><select value={form.channel} onChange={e=>setForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
        <FormField label="Note"><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Preferenze, info utili..." /></FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!form.name.trim()}>Salva</Btn></div>
      </Modal>
      <Modal open={!!sel} onClose={()=>{setSel(null);setEditMode(false);setNewApptMode(false);setNewApptDone(false);}} title="Scheda Cliente">
        {sel&&editForm&&(()=>{const st=CLIENT_ST[sel.status]||{label:sel.status,color:T.textD,bg:T.bg3};const fus=(data?.followUps||[]).filter(f=>f.clientId===sel.id).sort((a,b)=>new Date(b.scheduledDate)-new Date(a.scheduledDate));return newApptMode ? (
          newApptDone
            ?<div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:"44px",marginBottom:"12px"}}>{"\u{2705}"}</div><div style={{fontWeight:700,fontSize:"17px",marginBottom:"6px"}}>Salvato!</div><div style={{fontSize:"13px",color:T.textD}}>{bizType==="prodotti"?"Ordine e follow-up generati.":"Appuntamento e follow-up generati."}</div></div>
            :<div style={{display:"flex",flexDirection:"column",gap:"0"}}><div style={{fontWeight:600,fontSize:"15px",marginBottom:"14px",color:T.textM}}>{(bizType==="prodotti"?"Nuovo ordine":"Nuovo appuntamento")+" per "+sel.name}</div><FormField label={bizType==="prodotti"?"Data ordine":"Data"} hint="I follow-up si calcolano da questa data"><input type="date" value={newApptForm.date} onChange={e=>setNewApptForm(p=>({...p,date:e.target.value}))} /></FormField>{bizType==="servizi"&&<FormField label="Tipo servizio"><select value={newApptForm.serviceType||clusterSvcTypes[0]} onChange={e=>setNewApptForm(p=>({...p,serviceType:e.target.value}))}>{clusterSvcTypes.map(s=><option key={s}>{s}</option>)}</select></FormField>}{bizType==="prodotti"&&<FormField label="Prodotto"><input value={newApptForm.product||""} onChange={e=>setNewApptForm(p=>({...p,product:e.target.value}))} placeholder="Es. Stampa..." /></FormField>}<FormField label="Note (opzionale)"><textarea value={newApptForm.notes} onChange={e=>setNewApptForm(p=>({...p,notes:e.target.value}))} style={{minHeight:"60px"}} /></FormField><div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setNewApptMode(false)}>Annulla</Btn><Btn onClick={handleNewAppt} disabled={!newApptForm.date||(bizType==="prodotti"&&!(newApptForm.product||"").trim())}>Salva e genera</Btn></div></div>
        ) : !editMode ? (
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:"18px",fontWeight:700}}>{sel.name}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{sel.phone}{sel.email&&` · ${sel.email}`}</div></div><div style={{display:"flex",gap:"7px",alignItems:"center"}}><Badge {...st} /><Btn v="secondary" s="sm" aria="Modifica cliente" onClick={()=>setEditMode(true)}>{"\u{270F}\u{FE0F}"}</Btn></div></div>
            {sel.notes&&<div style={{padding:"10px 14px",background:T.bg3,borderRadius:T.r.m,fontSize:"13px",color:T.textM,lineHeight:1.6,border:`1px solid ${T.border}`}}>{"\u{1F4DD}"} {sel.notes}</div>}
            {(()=>{const bizType=data?.settings?.bizType||"servizi";const appts=bizType==="prodotti"?(data?.orders||[]).filter(o=>o.clientId===sel.id):(data?.appointments||[]).filter(a=>a.clientId===sel.id);const visite=appts.length;const lastDate=appts.length?[...appts].sort((a,b)=>new Date(b.date||b.orderDate)-new Date(a.date||a.orderDate))[0]?.date||[...appts].sort((a,b)=>new Date(b.date||b.orderDate)-new Date(a.date||a.orderDate))[0]?.orderDate:null;const td2=today();const pendingFus=fus.filter(f=>f.status==="pending");const ciclo=fus.length===0?"—":pendingFus.length===0?"Completato":pendingFus.some(f=>f.scheduledDate<=td2)?"In corso":"Programmato";return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>{[{label:bizType==="prodotti"?"Ordini totali":"Visite totali",value:visite,color:T.green,span:true,big:true},{label:bizType==="prodotti"?"Ultimo ordine":"Ultima visita",value:lastDate?fmtDate(lastDate):"—"},{label:"Follow-up",value:ciclo,color:ciclo==="In corso"?T.amber:ciclo==="Completato"?T.green:T.textD}].map((m,i)=>(<div key={i} style={{padding:"10px 12px",background:T.bg3,borderRadius:T.r.m,gridColumn:m.span?"1/-1":undefined}}><div style={{fontSize:"11px",color:T.textD,textTransform:"uppercase",letterSpacing:".05em",marginBottom:"4px"}}>{m.label}</div><div style={{fontSize:m.big?"22px":"14px",fontWeight:700,color:m.color||T.text}}>{m.value}</div></div>))}</div>);})()}
            <div style={{paddingTop:"12px",borderTop:`1px solid ${T.border}`,display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}><Btn s="sm" onClick={()=>{setNewApptMode(true);setNewApptForm({date:today(),serviceType:clusterSvcTypes[0]||"Sessione",notes:"",product:""}); }} style={{flex:1,justifyContent:"center"}}>{"+ "+(bizType==="prodotti"?"Nuovo ordine":"Nuovo appuntamento")}</Btn><Btn v="danger" s="sm" onClick={()=>handleDelete(sel.id)}>{"\u{1F5D1}\u{FE0F}"} Elimina</Btn></div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"0"}}>
            <FormField label="Nome"><input value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} /></FormField>
            <FormField label="Telefono"><input value={editForm.phone} onChange={e=>setEditForm(p=>({...p,phone:e.target.value}))} type="tel" /></FormField>
            <FormField label="Email"><input value={editForm.email} onChange={e=>setEditForm(p=>({...p,email:e.target.value}))} type="email" /></FormField>
            <FormField label="Metodo di contatto"><select value={editForm.channel} onChange={e=>setEditForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
            <FormField label="Stato"><select value={editForm.status} onChange={e=>setEditForm(p=>({...p,status:e.target.value}))}><option value="new">Nuovo</option><option value="active">Attivo</option><option value="vip">VIP</option><option value="to_reactivate">Da riattivare</option><option value="inactive">Inattivo</option></select></FormField>
            <FormField label="Note"><textarea value={editForm.notes} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} /></FormField>
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setEditMode(false)}>Annulla</Btn><Btn onClick={handleEdit} disabled={!editForm.name?.trim()}>Salva</Btn></div>
          </div>
        );})()}
      </Modal>
    </div>
  );
};

export default Clients;
