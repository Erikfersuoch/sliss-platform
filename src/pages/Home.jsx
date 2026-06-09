import { useState } from "react";
import T from "../theme.js";
import { PHASES, CLIENT_ST, CLUSTERS_SERVIZI } from "../config.js";
import { daysAgo, uid, today, greet, isPhaseOff, sendHref, openSend } from "../helpers.js";
import { useSliss } from "../context.js";
import Icon from "../components/Icon.jsx";
import { Badge, Btn, Card, Modal, FormField, SendButtons, Info } from "../components/ui.jsx";
import { HELP } from "../help.js";
import { buildFollowUps, buildProductFollowUps } from "../followups.js";

const Home = ({setView}) => {
  const {data,update,addRecord}=useSliss();
  const [showQuickAdd,setShowQuickAdd]=useState(false);
  const [qDone,setQDone]=useState(false);
  const [qForm,setQForm]=useState({name:"",phone:"",email:"",date:today(),serviceType:"Sessione",product:"",channel:"WhatsApp"});
  const td=today();
  const biz=data.settings?.businessName||"la tua attivit\u{e0}";
  const bizType=data?.settings?.bizType||"servizi";
  const cluster=data?.settings?.cluster||"altro_s";
  const clusterSvcTypes=(CLUSTERS_SERVIZI[cluster]?.serviceTypes)||CLUSTERS_SERVIZI.altro_s.serviceTypes;
  const pending=(data?.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td&&!isPhaseOff(data?.templates,f.phase));
  const sent=(data?.followUps||[]).filter(f=>f.status==="sent"||f.status==="replied"||f.status==="completed");
  const activeC=(data?.clients||[]).filter(c=>c.status==="active"||c.status==="vip");
  const toReact=(data?.clients||[]).filter(c=>c.status==="to_reactivate");
  const toShip=bizType==="prodotti"?(data?.orders||[]).filter(o=>o.status==="pending"):[];
  const markReady=(order)=>{const cl=(data?.clients||[]).find(c=>c.id===order.clientId);const fu=(data?.followUps||[]).find(f=>f.orderId===order.id&&f.phase==="shipping");update("orders",order.id,{status:"shipped",shippedDate:today()});if(fu){update("followUps",fu.id,{scheduledDate:today(),status:"sent",sentDate:today()});openSend(sendHref(fu.message,cl?.phone,cl?.email,cl?.channel));}};
  const handleQuickAdd=()=>{
    const needEmail=qForm.channel==="Email";
    if(!qForm.name.trim()||(needEmail?!qForm.email.trim():!qForm.phone.trim()))return;
    let clientId=(data?.clients||[]).find(c=>(qForm.phone.trim()&&c.phone===qForm.phone.trim())||(qForm.email.trim()&&c.email===qForm.email.trim()))?.id;
    if(!clientId){clientId=uid();addRecord("clients",{id:clientId,name:qForm.name.trim(),phone:qForm.phone.trim(),email:qForm.email.trim(),channel:qForm.channel||"WhatsApp",status:"active",tags:[],notes:"",firstVisit:qForm.date,lastVisit:qForm.date,consent:true,created:today()});}
    if(bizType==="servizi"){const apptId=uid();const timings=data?.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};addRecord("appointments",{id:apptId,clientId,date:qForm.date,serviceType:qForm.serviceType,notes:""});buildFollowUps(apptId,clientId,qForm.name.trim(),qForm.date,qForm.serviceType,timings,data?.templates).forEach(fu=>addRecord("followUps",fu));}
    else{const orderId=uid();addRecord("orders",{id:orderId,clientId,product:qForm.product||"Ordine",orderDate:qForm.date,status:"pending",notes:""});buildProductFollowUps(orderId,clientId,qForm.name.trim(),qForm.date,null,data?.templates).forEach(fu=>addRecord("followUps",fu));}
    setQDone(true);setTimeout(()=>{setQDone(false);setShowQuickAdd(false);setQForm({name:"",phone:"",email:"",date:today(),serviceType:clusterSvcTypes[0],product:"",channel:"WhatsApp"});},1500);
  };
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"-4px"}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"12px",color:T.textD}}>Come funziona <Info {...HELP.moduleGuide} /></span>
      </div>
      <div style={{marginBottom:"16px"}}>
        <div style={{fontSize:"13px",color:T.textD,marginBottom:"3px"}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</div>
        <h1 style={{fontSize:"26px",fontWeight:700,letterSpacing:"-.03em",lineHeight:1.2}}>{greet()},<br/><span style={{color:T.green}}>{biz}</span> {"\u{1F44B}"}</h1>
      </div>
      <Btn onClick={()=>setShowQuickAdd(true)} style={{width:"100%",justifyContent:"center",marginBottom:"10px"}}>{"+ Aggiungi cliente"}</Btn>
      {data?.settings?.reviewLink&&<div style={{textAlign:"center",marginBottom:"16px"}}><a href={data.settings.reviewLink} target="_blank" rel="noreferrer" style={{fontSize:"13px",color:T.textD,textDecoration:"none"}}>{"\u{2B50}"} Vedi recensioni</a></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"20px"}}>
        {[{label:"Da inviare",value:pending.length,color:pending.length?T.amber:T.green,sub:pending.length?"oggi":"tutto ok",go:"followup",gf:"today"},{label:"Inviati",value:sent.length,color:T.green,sub:"storico",go:"followup",gf:"awaiting"},{label:"Attivi",value:activeC.length,color:T.green,sub:`${toReact.length} da riatt.`,go:"clients"}].map((s,i)=>(
          <Card key={i} onClick={()=>setView(s.go,s.gf?{fuFilter:s.gf}:undefined)} hov style={{padding:"14px 12px",display:"flex",flexDirection:"column",gap:"4px"}}>
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
                const ph=PHASES[fu.phase]||{icon:"file",label:fu.phase,color:T.textD,bg:T.bg3};
                return (
                  <div key={fu.id} style={{padding:"12px",background:fu.scheduledDate<td?T.redS:T.amberS,borderRadius:T.r.m,border:`1px solid ${fu.scheduledDate<td?T.red:T.amber}44`}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                      <Icon name={ph.icon} size={16} color={ph.color} />
                      <span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"\u{2014}"}</span>
                      <Badge {...ph} s />
                      <span style={{marginLeft:"auto",fontSize:"11px",fontWeight:700,color:fu.scheduledDate<td?T.red:T.amberD}}>{fu.scheduledDate<td?"Scaduto":"Oggi"}</span>
                    </div>
                    <div style={{fontSize:"13px",color:T.textD,lineHeight:1.5,marginBottom:"10px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{fu.message}</div>
                    <SendButtons message={fu.message} clientPhone={cl?.phone||""} clientEmail={cl?.email} channel={cl?.channel} labelOverride={fu.phase==="shipping"?"\u{1F680} Ready to go":undefined} onSend={()=>update("followUps",fu.id,{status:"sent",sentDate:today()})} />
                  </div>
                );
              })}
              {pending.length>3&&<button onClick={()=>setView("followup")} style={{width:"100%",padding:"10px",background:"none",border:`1px solid ${T.border}`,borderRadius:T.r.m,color:T.textM,fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{"Vedi tutti i "+pending.length+" follow-up \u{2192}"}</button>}
            </div>
        }
      </Card>
      {toShip.length>0&&<Card style={{marginBottom:"14px"}}>
        <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>{"\u{1F4E6}"} Ordini da spedire</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {toShip.map(o=>{const cl=(data?.clients||[]).find(c=>c.id===o.clientId);return (
            <div key={o.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px",background:T.bg3,borderRadius:T.r.m}}>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl?.name||"\u{2014}"}</div><div style={{fontSize:"12px",color:T.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.product}</div></div>
              <Btn s="sm" onClick={()=>markReady(o)}>{"\u{1F680}"} Ready to go</Btn>
            </div>
          );})}
        </div>
      </Card>}
      <Card>
        <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>Clienti</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
          {(data?.clients||[]).slice(0,5).map(cl=>{
            const st=CLIENT_ST[cl.status]||{label:cl.status,color:T.textD,bg:T.bg3};
            return (<div key={cl.id} onClick={()=>setView("clients",{clientId:cl.id})} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:T.bg3,borderRadius:T.r.m,cursor:"pointer"}}><div style={{width:"7px",height:"7px",borderRadius:"50%",background:st.color,flexShrink:0}} /><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cl.name}</div><div style={{fontSize:"11px",color:T.textD}}>{daysAgo(cl.lastVisit)}</div></div><Badge {...st} s /><span style={{color:T.textMu,fontSize:"18px",lineHeight:1,flexShrink:0}}>{"\u{203A}"}</span></div>);
          })}
          {(data?.clients||[]).length===0&&<div style={{fontSize:"13px",color:T.textD,textAlign:"center",padding:"12px 0"}}>Nessun cliente ancora</div>}
        </div>
      </Card>
      <Modal open={showQuickAdd} onClose={()=>{setShowQuickAdd(false);setQDone(false);}} title="Nuovo cliente">
        {qDone
          ?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:"44px",marginBottom:"12px"}}>{"\u{2705}"}</div><div style={{fontWeight:700,fontSize:"16px",marginBottom:"6px"}}>Salvato!</div><div style={{fontSize:"13px",color:T.textD}}>Follow-up generati automaticamente.</div></div>
          :<>
            <FormField label="Nome"><input value={qForm.name} onChange={e=>setQForm(p=>({...p,name:e.target.value}))} placeholder="Nome Cognome" /></FormField>
            <FormField label="Metodo di contatto"><select value={qForm.channel} onChange={e=>setQForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
            {qForm.channel==="Email"
              ? <FormField label="Email"><input value={qForm.email} onChange={e=>setQForm(p=>({...p,email:e.target.value}))} placeholder="email@esempio.com" type="email" /></FormField>
              : <FormField label={qForm.channel==="SMS"?"Numero di telefono":"Numero WhatsApp"}><input value={qForm.phone} onChange={e=>setQForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" type="tel" /></FormField>}
            <FormField label={bizType==="prodotti"?"Data ordine":"Data appuntamento"}><input value={qForm.date} onChange={e=>setQForm(p=>({...p,date:e.target.value}))} type="date" /></FormField>
            {bizType==="servizi"
              ?<FormField label="Tipo servizio"><select value={qForm.serviceType} onChange={e=>setQForm(p=>({...p,serviceType:e.target.value}))}>{clusterSvcTypes.map(s=><option key={s}>{s}</option>)}</select></FormField>
              :<FormField label="Prodotto"><input value={qForm.product} onChange={e=>setQForm(p=>({...p,product:e.target.value}))} placeholder="Es. Stampa figurina" /></FormField>
            }
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowQuickAdd(false)}>Annulla</Btn><Btn onClick={handleQuickAdd} disabled={!qForm.name.trim()||(qForm.channel==="Email"?!qForm.email.trim():!qForm.phone.trim())}>Salva e genera</Btn></div>
          </>
        }
      </Modal>
    </div>
  );
};

export default Home;
