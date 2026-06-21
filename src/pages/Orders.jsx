import { useState } from "react";
import T from "../theme.js";
import { PRODUCT_PHASES } from "../config.js";
import { fmtDate, daysUntil, addDays, uid, today, isPhaseOff } from "../helpers.js";
import { useSliss } from "../context.js";
import Icon from "../components/Icon.jsx";
import { Btn, Card, Empty, GhostRow, Modal, FormField, PageHeader } from "../components/ui.jsx";
import { buildProductFollowUps } from "../followups.js";

const Orders = ({setView,openAdd}) => {
  const {data,addRecord,update,deleteRecord}=useSliss();
  const [showNew,setShowNew]=useState(!!openAdd);const [done,setDone]=useState(false);
  const [form,setForm]=useState({clientId:"",product:"",orderDate:today(),deliveryDays:"7",notes:""});
  const [prevAdd,setPrevAdd]=useState(openAdd);
  if(openAdd!==prevAdd){setPrevAdd(openAdd);if(openAdd)setShowNew(true);}
  const sorted=[...(data?.orders||[])].sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate));
  // Stessa trappola di Agenda: senza clienti il form ordine ha il menù cliente vuoto.
  const noClients=(data?.clients||[]).length===0;
  const handleAdd=()=>{if(!form.clientId||!form.product.trim())return;const client=(data?.clients||[]).find(c=>c.id===form.clientId);if(!client)return;const orderId=uid();const deliveryDate=addDays(form.orderDate,parseInt(form.deliveryDays)||7);addRecord("orders",{id:orderId,clientId:form.clientId,product:form.product,orderDate:form.orderDate,deliveryDate,notes:form.notes,status:"pending",created:today()});buildProductFollowUps(orderId,form.clientId,client.firstName||client.name.split(' ')[0],form.orderDate,deliveryDate,data?.templates).forEach(fu=>addRecord("followUps",fu));setDone(true);setTimeout(()=>{setDone(false);setShowNew(false);setForm({clientId:"",product:"",orderDate:today(),deliveryDays:"7",notes:""});},1800);};
  const markShipped=(order)=>{update("orders",order.id,{status:"shipped",shippedDate:today()});const shippingFU=(data?.followUps||[]).find(f=>f.orderId===order.id&&f.phase==="shipping"&&f.awaitShipping);if(shippingFU)update("followUps",shippingFU.id,{scheduledDate:today(),status:"pending"});};
  const handleDelete=(order)=>{if(!window.confirm("Eliminare questo ordine?"))return;deleteRecord("orders",order.id);(data?.followUps||[]).filter(f=>f.orderId===order.id).forEach(f=>deleteRecord("followUps",f.id));};
  const statusLabel={pending:"In preparazione",shipped:"Spedito",delivered:"Consegnato"};const statusColor={pending:T.amber,shipped:T.blue,delivered:T.green};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Ordini in corso" action={<Btn onClick={()=>setShowNew(true)}>+ Nuovo ordine</Btn>} />
      <p style={{fontSize:"13px",color:T.textD,marginBottom:"20px",marginTop:"-10px"}}>{"Aggiungi un ordine \u{2192} i 5 follow-up si generano automaticamente"}</p>
      {!sorted.length
        ? noClients
          ? <Empty preview={<GhostRow avatar={false} />} previewLabel="qui vedrai gli ordini" title="L'ordine parte da un cliente" desc="Prima aggiungi chi servirai, poi qui registri l'ordine e i follow-up si generano da soli." action={<Btn onClick={()=>setView&&setView("clients")}>+ Aggiungi un cliente</Btn>} hint="poi torna qui per l'ordine" />
          : <Empty icon={<Icon name="package" size={44} color={T.textD} />} title="Nessun ordine" desc="Aggiungi il primo ordine per generare i follow-up automaticamente." action={<Btn onClick={()=>setShowNew(true)}>+ Aggiungi</Btn>} />
        : <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>{sorted.map((order,i)=>{const cl=(data?.clients||[]).find(c=>c.id===order.clientId);const fus=(data?.followUps||[]).filter(f=>f.orderId===order.id);const pendingFUs=fus.filter(f=>f.status==="pending"&&f.scheduledDate&&f.scheduledDate<=today()).length;return (<Card key={order.id} style={{animation:`fadeIn .3s ease ${i*.03}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}><div><div style={{fontWeight:700,fontSize:"15px"}}>{cl?.name||"\u{2014}"}</div><div style={{fontSize:"13px",color:T.textM,marginTop:"2px"}}>{order.product}</div>{order.notes&&<div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{"\u{1F4DD}"} {order.notes}</div>}</div><span style={{fontSize:"12px",fontWeight:600,color:statusColor[order.status]||T.amber,background:`color-mix(in srgb, ${statusColor[order.status]||T.amber} 9%, transparent)`,padding:"3px 10px",borderRadius:T.r.full}}>{statusLabel[order.status]||"\u{2014}"}</span></div><div style={{display:"flex",gap:"12px",fontSize:"12px",color:T.textD,marginBottom:"10px"}}><span>Ordine: {fmtDate(order.orderDate)}</span><span>Consegna: {fmtDate(order.deliveryDate)}</span></div><div style={{display:"flex",gap:"5px",marginBottom:"10px"}}>{["order_confirm","shipping","delivery_check","review","reorder"].map(phase=>{const fu=fus.find(f=>f.phase===phase);const ph=PRODUCT_PHASES[phase];const off=fu&&fu.status==="pending"&&isPhaseOff(data?.templates,phase);const col=off?"#E9ECEF":!fu?"#E9ECEF":fu.status==="sent"||fu.status==="replied"?T.greenS:fu.awaitShipping&&order.status==="pending"?"#E9ECEF":T.amberS;const textCol=off?T.textMu:!fu?T.textMu:fu.status==="sent"||fu.status==="replied"?T.green:fu.awaitShipping&&order.status==="pending"?T.textMu:T.amber;return (<div key={phase} style={{flex:1,padding:"5px 4px",background:col,borderRadius:T.r.s,textAlign:"center",opacity:off?0.4:1}}><div style={{display:"flex",justifyContent:"center"}}><Icon name={ph.icon} size={15} color={textCol} /></div><div style={{fontSize:"9px",color:textCol,fontWeight:600,marginTop:"1px"}}>{fu&&fu.scheduledDate?daysUntil(fu.scheduledDate):fu?.awaitShipping?"\u{23F3}":"\u{2014}"}</div></div>);})}</div><div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>{order.status==="pending"&&<Btn v="primary" s="sm" onClick={()=>markShipped(order)}>{"\u{1F680}"} Ready to go</Btn>}{pendingFUs>0&&<span style={{fontSize:"12px",color:T.amber,fontWeight:600,padding:"8px 0"}}>{pendingFUs} follow-up da inviare</span>}<Btn v="danger" s="sm" aria="Elimina ordine" onClick={()=>handleDelete(order)}><Icon name="trash" size={16} /></Btn></div></Card>);})}</div>}
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

export default Orders;
