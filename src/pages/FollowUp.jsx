import { useState } from "react";
import T from "../theme.js";
import { PHASES, STATUSES } from "../config.js";
import { fmtDate, daysAgo, daysUntil, today, isPhaseOff } from "../helpers.js";
import { useSliss } from "../context.js";
import Icon from "../components/Icon.jsx";
import { Badge, Btn, Card, Empty, Search, Tabs, Modal, SendButtons } from "../components/ui.jsx";

const FollowUp = ({setView,initialFilter,initialFuId}) => {
  const {data,update,deleteRecord}=useSliss();
  const [filter,setFilter]=useState(initialFilter||"today");
  const [search,setSearch]=useState("");
  // Apertura diretta del follow-up quando si arriva dall'Agenda (initialFuId): init al mount, niente effect
  const _initFu=initialFuId?(data?.followUps||[]).find(f=>f.id===initialFuId):null;
  const [sel,setSel]=useState(_initFu||null);
  const [editMsg,setEditMsg]=useState(null);
  const td=today();
  const allFU=data?.followUps||[];
  const isDone=f=>f.status==="sent"||f.status==="replied"||f.status==="completed";
  const tabs=[{id:"today",label:"Da inviare",count:allFU.filter(f=>f.status==="pending"&&f.scheduledDate<=td&&!isPhaseOff(data?.templates,f.phase)).length},{id:"awaiting",label:"Inviati",count:allFU.filter(isDone).length},{id:"all",label:"Tutti",count:allFU.length}];
  const filtered=allFU.filter(fu=>{const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);const ms=!search||cl?.name.toLowerCase().includes(search.toLowerCase());const mf=filter==="all"||(filter==="today"&&fu.status==="pending"&&fu.scheduledDate<=td&&!isPhaseOff(data?.templates,fu.phase))||(filter==="awaiting"&&isDone(fu));return ms&&mf;}).sort((a,b)=>new Date(a.scheduledDate)-new Date(b.scheduledDate));
  const markSent=fu=>{update("followUps",fu.id,{status:"sent",sentDate:today()});if(sel?.id===fu.id)setSel({...fu,status:"sent",sentDate:today()});};
  const markUnsend=fu=>{update("followUps",fu.id,{status:"pending",sentDate:null,satisfaction:null});if(sel?.id===fu.id)setSel({...fu,status:"pending",sentDate:null,satisfaction:null});};
  const pendingToday=allFU.filter(f=>f.status==="pending"&&f.scheduledDate<=td&&!isPhaseOff(data?.templates,f.phase));
  const markAllSent=()=>{if(!pendingToday.length)return;if(!window.confirm(`Segna tutti i ${pendingToday.length} follow-up come inviati?`))return;pendingToday.forEach(fu=>update("followUps",fu.id,{status:"sent",sentDate:today()}));};
  const deleteFU=fu=>{if(!window.confirm("Eliminare questo follow-up?"))return;deleteRecord("followUps",fu.id);if(sel?.id===fu.id)setSel(null);};
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
            {filtered.map((fu,i)=>{const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);const ph=PHASES[fu.phase]||{icon:"file",label:fu.phase,color:T.textD,bg:T.bg3};const st=STATUSES[fu.status]||{label:fu.status,color:T.textD,bg:T.bg3};const timing=fu.status==="pending"?daysUntil(fu.scheduledDate):daysAgo(fu.sentDate);const isReplied=fu.status==="replied";const isSent=fu.status==="sent";const isOverdue=fu.status==="pending"&&fu.scheduledDate<td;const phaseOff=fu.status==="pending"&&isPhaseOff(data?.templates,fu.phase);const cardColor=phaseOff?T.border:isReplied?T.blue:isSent?T.green:isOverdue?T.red:fu.status==="pending"?T.amber:T.border;const cardBg=phaseOff?"transparent":isReplied?T.blueS:isSent?T.greenS:isOverdue?T.redS:fu.status==="pending"?T.amberS:"transparent";return (
              <Card key={fu.id} hov onClick={()=>setSel(fu)} style={{border:`1px solid ${cardColor}`,background:cardBg,opacity:phaseOff?0.55:1,animation:`fadeIn .3s ease ${i*.03}s both`}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
                  <Icon name={ph.icon} size={20} color={ph.color} style={{marginTop:"2px"}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px",flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:"14px"}}>{cl?.name||"\u{2014}"}</span><Badge {...ph} s /><Badge {...st} s />{phaseOff&&<Badge label="Disattivato" color={T.textMu} bg={T.bg3} s />}</div>
                    <div style={{fontSize:"13px",color:T.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"8px"}}>{fu.message}</div>
                    {fu.status==="pending"&&!phaseOff&&<SendButtons message={fu.message} clientPhone={cl?.phone||""} clientEmail={cl?.email} channel={cl?.channel} labelOverride={fu.phase==="shipping"?"\u{1F680} Ready to go":undefined} onSend={()=>markSent(fu)} />}
                    {isDone(fu)&&(
                      <div onClick={e=>e.stopPropagation()} style={{marginTop:"2px"}}>
                        <Btn v="secondary" s="sm" onClick={()=>markUnsend(fu)}>{"\u{21A9}\u{FE0F}"} Annulla invio</Btn>
                      </div>
                    )}
                  </div>
                  <div style={{flexShrink:0,textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"8px"}}>
                    <span style={{fontSize:"11px",color:T.textMu}}>{timing}</span>
                    {fu.status==="pending"&&!phaseOff&&<button onClick={e=>{e.stopPropagation();deleteFU(fu);}} style={{background:"none",border:"none",cursor:"pointer",padding:"2px",color:T.textMu,fontSize:"15px",lineHeight:1}} title="Elimina">🗑️</button>}
                  </div>
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
            <SendButtons message={editMsg!==null?editMsg:sel.message} clientPhone={cl?.phone||""} clientEmail={cl?.email} channel={cl?.channel} labelOverride={sel.phase==="shipping"?"\u{1F680} Ready to go":undefined} onSend={sel.status==="pending"?()=>{markSent(sel);setSel(null);setEditMsg(null);}:undefined} />
            {isDone(sel)&&(
              <div style={{paddingTop:"4px"}}>
                <Btn v="secondary" s="sm" onClick={()=>markUnsend(sel)}>{"\u{21A9}\u{FE0F}"} Annulla invio</Btn>
              </div>
            )}
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

// Restituisce il testo del template salvato per quella fase (con [Nome]/[Data] sostituiti),
// oppure il testo di default se l'utente non ha un template per quella fase.

export default FollowUp;
