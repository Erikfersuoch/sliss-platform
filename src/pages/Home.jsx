import { useState } from "react";
import T from "../theme.js";
import { PHASES, CLUSTERS_SERVIZI } from "../config.js";
import { uid, today, greet, isPhaseOff, sendHref, openSend } from "../helpers.js";
import { useSliss } from "../context.js";
import Icon from "../components/Icon.jsx";
import { Btn, Modal, FormField, Celebration } from "../components/ui.jsx";
import { buildFollowUps, buildProductFollowUps } from "../followups.js";
import InviteClient from "../components/InviteClient.jsx";

// ═══════════════════════════════════════════════════════════════
//  HOME PRODOTTI — hero dinamico + moduli compatti (v2)
// ═══════════════════════════════════════════════════════════════
const HomeProdotti = ({setView,data,update,pending,toShip}) => {
  const td=today();
  const biz=data.settings?.businessName||"la tua attività";
  const richNuove=(data?.richieste||[]).filter(r=>(r.status||"nuova")==="nuova");
  const orders=(data?.orders||[]);
  const ordersActive=orders.filter(o=>o.status==="pending"||o.status==="shipped");

  const markReady=(order)=>{const cl=(data?.clients||[]).find(c=>c.id===order.clientId);const fu=(data?.followUps||[]).find(f=>f.orderId===order.id&&f.phase==="shipping");update("orders",order.id,{status:"shipped",shippedDate:today()});if(fu){update("followUps",fu.id,{scheduledDate:today(),status:"sent",sentDate:today()});openSend(sendHref(fu.message,cl?.phone,cl?.email,cl?.channel));}};

  // Hero: la singola azione più urgente
  // Priorità: 1) richiesta più vecchia in attesa, 2) ordine da spedire, 3) follow-up scaduto/oggi
  let hero=null;
  if(richNuove.length>0){
    const oldest=richNuove[richNuove.length-1];
    const d=oldest.date||oldest.created;
    const age=d?Math.round((new Date(td)-new Date(d))/864e5):0;
    hero={type:"richiesta",item:oldest,label:"Richiesta in attesa",name:`${oldest.nome||""} ${oldest.cognome||""}`.trim()||"Nuovo cliente",desc:oldest.prodotto||oldest.tipo||"Richiesta dal link",age:age>0?`da ${age} giorn${age===1?"o":"i"}`:"oggi",action:"Crea ordine",onAction:()=>setView("richieste"),icon:"bell",color:T.green};
  } else if(toShip.length>0){
    const o=toShip[0];const cl=(data?.clients||[]).find(c=>c.id===o.clientId);
    hero={type:"ordine",item:o,label:"Ordine da spedire",name:cl?.name||"—",desc:o.product||"Ordine",age:null,action:"🚀 Segna come spedito",onAction:()=>markReady(o),icon:"package",color:T.amber};
  } else if(pending.length>0){
    const fu=pending[0];const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);const ph=PHASES[fu.phase]||{icon:"file",label:fu.phase,color:T.textD};
    hero={type:"followup",item:fu,label:`Follow-up: ${ph.label}`,name:cl?.name||"—",desc:fu.message?.slice(0,80)||"",age:fu.scheduledDate<td?"scaduto":"oggi",action:"Apri Follow-Up",onAction:()=>setView("followup"),icon:ph.icon,color:ph.color};
  }

  // Conteggi moduli
  const richCount=richNuove.length;
  const shipCount=toShip.length;
  const fuCount=pending.length;
  const allCalm=richCount===0&&shipCount===0&&fuCount===0;

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:"16px"}}>
        <div style={{fontSize:"13px",color:T.textD,marginBottom:"3px"}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</div>
        <h1 style={{fontSize:"24px",fontWeight:800,letterSpacing:"-.03em",lineHeight:1.2}}>{greet()}, <span style={{color:T.green}}>{biz}</span></h1>
        <div style={{fontSize:"13px",color:T.textD,marginTop:"3px"}}>{allCalm?"Niente di urgente: sei in pari.":"La cosa più importante prima — poi il resto."}</div>
      </div>

      {/* HERO o STATO CALMO */}
      {hero ? (
        <div style={{background:`linear-gradient(165deg,${T.bg2},${T.bg3})`,border:`1.6px solid color-mix(in srgb, ${hero.color} 38%, transparent)`,borderRadius:T.r.xl,padding:"16px",marginBottom:"16px",position:"relative",overflow:"hidden",boxShadow:`0 12px 30px color-mix(in srgb, ${hero.color} 16%, transparent)`}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:"4px",background:hero.color}} />
          <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"10.5px",fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",color:hero.color,marginBottom:"10px"}}>
            <div style={{width:"7px",height:"7px",borderRadius:"50%",background:hero.color,animation:"pulse 1.8s infinite"}} />
            Da fare adesso
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"11px",marginBottom:"13px"}}>
            <div style={{width:"42px",height:"42px",borderRadius:"12px",background:`color-mix(in srgb, ${hero.color} 10%, transparent)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name={hero.icon} size={20} color={hero.color} />
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:"15.5px"}}>{hero.name}</div>
              <div style={{fontSize:"12.5px",color:T.textM,marginTop:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{hero.label}: {hero.desc}{hero.age?` · ${hero.age}`:""}</div>
            </div>
          </div>
          <button onClick={hero.onAction} style={{display:"block",width:"100%",textAlign:"center",background:hero.color,color:"#fff",fontSize:"14px",fontWeight:800,padding:"13px 0",borderRadius:"13px",border:"none",cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 18px color-mix(in srgb, ${hero.color} 18%, transparent)`}}>{hero.action}</button>
          {hero.type==="richiesta"&&richCount>1&&<button onClick={()=>setView("richieste")} style={{display:"block",width:"100%",textAlign:"center",fontSize:"11.5px",color:T.textD,fontWeight:700,marginTop:"9px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Vedi tutte le richieste ({richCount})</button>}
        </div>
      ) : (
        <div style={{background:`linear-gradient(165deg,${T.bg2},${T.bg3})`,border:`1.4px solid ${T.border}`,borderRadius:T.r.xl,padding:"26px 18px",textAlign:"center",marginBottom:"16px",boxShadow:`0 8px 22px color-mix(in srgb, ${T.green} 6%, transparent)`}}>
          <div style={{width:"54px",height:"54px",borderRadius:"50%",background:T.greenS,color:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",margin:"0 auto 12px"}}>✓</div>
          <h2 style={{fontSize:"17px",fontWeight:800}}>Tutto sotto controllo</h2>
          <p style={{fontSize:"12.5px",color:T.textD,marginTop:"5px",lineHeight:1.5}}>Nessuna richiesta in attesa, nessun ordine da spedire.<br/>I follow-up partono quando serve.</p>
          <div style={{marginTop:"15px",fontSize:"12px",fontWeight:700,color:T.green,background:T.greenS,borderRadius:"12px",padding:"10px 13px",display:"inline-block"}}>💡 Aggiorna gli stati spedizione quando spedisci</div>
        </div>
      )}

      {/* SEZIONE MODULI */}
      <div style={{fontSize:"11px",fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",color:T.textMu,margin:"18px 2px 9px"}}>I tuoi moduli</div>

      {/* Richieste */}
      <button onClick={()=>setView("richieste")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"5px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 4px 14px color-mix(in srgb, ${T.green} 5%, transparent)`}}>
        <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="bell" size={18} color={T.green} /></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:"14px"}}>Richieste</div><div style={{fontSize:"11.5px",color:T.textD,marginTop:"1px"}}>dal tuo link</div></div>
        {richCount>0
          ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.amberS,color:T.amber,whiteSpace:"nowrap"}}>{richCount} da gestire</span>
          : <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.greenS,color:T.greenH,whiteSpace:"nowrap"}}>in pari</span>
        }
        <span style={{color:T.textMu,fontSize:"17px",fontWeight:700,marginLeft:"2px"}}>›</span>
      </button>
      <div style={{display:"flex",alignItems:"center",gap:"7px",margin:"1px 0 9px 24px",fontSize:"10px",color:T.textMu,fontWeight:700}}>
        <div style={{width:"11px",height:"11px",borderLeft:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottom:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottomLeftRadius:"5px"}} />
        diventa un ordine
      </div>

      {/* Ordini */}
      <button onClick={()=>setView("orders")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"5px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 4px 14px color-mix(in srgb, ${T.green} 5%, transparent)`}}>
        <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="package" size={18} color={T.green} /></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:"14px"}}>Ordini</div><div style={{fontSize:"11.5px",color:T.textD,marginTop:"1px"}}>{ordersActive.length} in corso</div></div>
        {shipCount>0
          ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.amberS,color:T.amber,whiteSpace:"nowrap"}}>{shipCount} da spedire</span>
          : <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.greenS,color:T.greenH,whiteSpace:"nowrap"}}>in pari</span>
        }
        <span style={{color:T.textMu,fontSize:"17px",fontWeight:700,marginLeft:"2px"}}>›</span>
      </button>
      <div style={{display:"flex",alignItems:"center",gap:"7px",margin:"1px 0 9px 24px",fontSize:"10px",color:T.textMu,fontWeight:700}}>
        <div style={{width:"11px",height:"11px",borderLeft:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottom:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottomLeftRadius:"5px"}} />
        accende i follow-up
      </div>

      {/* Follow-Up */}
      <button onClick={()=>setView("followup")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 4px 14px color-mix(in srgb, ${T.green} 5%, transparent)`}}>
        <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="message" size={18} color={T.green} /></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:"14px"}}>Follow-Up</div><div style={{fontSize:"11.5px",color:T.textD,marginTop:"1px"}}>post-vendita</div></div>
        {fuCount>0
          ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.amberS,color:T.amber,whiteSpace:"nowrap"}}>{fuCount} da inviare</span>
          : <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.greenS,color:T.greenH,whiteSpace:"nowrap"}}>in pari</span>
        }
        <span style={{color:T.textMu,fontSize:"17px",fontWeight:700,marginLeft:"2px"}}>›</span>
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  HOME SERVIZI — hero dinamico + moduli compatti (v2)
// ═══════════════════════════════════════════════════════════════
const HomeServizi = ({setView,data,update,pending,activeC,toReact,noClients,setShowQuickAdd,setShowInvite}) => {
  const td=today();
  const biz=data.settings?.businessName||"la tua attività";
  const appts=(data?.appointments||[]);
  const apptToday=appts.filter(a=>a.date===td).sort((x,y)=>(x.time||"").localeCompare(y.time||""));
  const apptUpcoming=appts.filter(a=>a.date>=td);
  const fuCount=pending.length;
  const reactCount=toReact.length;
  const richNuove=(data?.richieste||[]).filter(r=>(r.status||"nuova")==="nuova");
  const richCount=richNuove.length;

  const confirmPending=(data?.followUps||[]).filter(f=>f.phase==="confirm"&&f.status==="pending"&&f.scheduledDate<=td);
  const confirmCount=confirmPending.length;
  const pendingNonConfirm=pending.filter(f=>f.phase!=="confirm");
  const fuCountNoConfirm=pendingNonConfirm.length;

  let hero=null;
  if(confirmCount>0){
    const fu=confirmPending[0];const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);
    hero={type:"confirm",item:fu,label:"Manda la conferma",name:cl?.name||"\u{2014}",desc:fu.message?.slice(0,80)||"",age:null,action:"Invia su WhatsApp",onAction:()=>openSend(sendHref(fu.message,cl?.phone,cl?.email,cl?.channel)),icon:"check",color:T.green,fu,cl};
  } else if(richCount>0){
    const oldest=richNuove[richNuove.length-1];
    const d=oldest.date||oldest.created;
    const age=d?Math.round((new Date(td)-new Date(d))/864e5):0;
    hero={type:"richiesta",item:oldest,label:"Prenotazione in attesa",name:`${oldest.nome||""} ${oldest.cognome||""}`.trim()||"Nuovo cliente",desc:oldest.service||oldest.desc||"Prenotazione dal link",age:age>0?`da ${age} giorn${age===1?"o":"i"}`:"oggi",action:"Gestisci",onAction:()=>setView("richieste"),icon:"bell",color:T.green};
  } else if(!noClients&&fuCountNoConfirm>0){
    const fu=pendingNonConfirm[0];const cl=(data?.clients||[]).find(c=>c.id===fu.clientId);const ph=PHASES[fu.phase]||{icon:"file",label:fu.phase,color:T.textD};
    hero={type:"followup",label:`Follow-up: ${ph.label}`,name:cl?.name||"\u{2014}",desc:fu.message?.slice(0,80)||"",age:fu.scheduledDate<td?"scaduto":"oggi",action:"Apri Follow-Up",onAction:()=>setView("followup"),icon:ph.icon,color:ph.color};
  }
  const allCalm=!hero&&!noClients;

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:"16px"}}>
        <div style={{fontSize:"13px",color:T.textD,marginBottom:"3px"}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</div>
        <h1 style={{fontSize:"24px",fontWeight:800,letterSpacing:"-.03em",lineHeight:1.2}}>{greet()}, <span style={{color:T.green}}>{biz}</span></h1>
        <div style={{fontSize:"13px",color:T.textD,marginTop:"3px"}}>{noClients&&!hero?"Aggiungi il tuo primo cliente per iniziare.":allCalm?(apptToday.length>0?"Niente di urgente — guarda chi arriva oggi.":"Niente di urgente: sei in pari."):"La cosa più importante prima — poi il resto."}</div>
      </div>

      {noClients&&!hero ? (
        <div style={{background:`linear-gradient(180deg,${T.greenS},${T.bg2})`,border:`1px solid ${T.green}`,borderRadius:T.r.xl,padding:"22px 18px",textAlign:"center",marginBottom:"14px"}}>
          <div style={{width:"46px",height:"46px",borderRadius:"14px",background:T.green,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Icon name="target" size={24} color="#fff" /></div>
          <h2 style={{fontSize:"17px",fontWeight:800,letterSpacing:"-.02em",marginBottom:"6px"}}>Inizia da qui</h2>
          <p style={{fontSize:"13.5px",color:T.textM,lineHeight:1.55,maxWidth:"280px",margin:"0 auto 16px"}}>Aggiungi il tuo primo cliente: Sliss prepara subito i messaggi da inviargli, già scritti.</p>
          <Btn onClick={()=>setShowQuickAdd(true)} style={{width:"100%",justifyContent:"center"}}>{"+ Aggiungi il tuo primo cliente"}</Btn>
          <button onClick={()=>setShowInvite(true)} style={{display:"block",margin:"12px auto 0",background:"none",border:"none",color:T.textD,fontSize:"12.5px",cursor:"pointer",fontFamily:"inherit"}}>oppure <span style={{color:T.blue,fontWeight:600}}>invitalo con un link</span></button>
        </div>
      ) : hero ? (
        <div style={{background:`linear-gradient(165deg,${T.bg2},${T.bg3})`,border:`1.6px solid color-mix(in srgb, ${hero.color} 38%, transparent)`,borderRadius:T.r.xl,padding:"16px",marginBottom:"16px",position:"relative",overflow:"hidden",boxShadow:`0 12px 30px color-mix(in srgb, ${hero.color} 16%, transparent)`}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:"4px",background:hero.color}} />
          <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"10.5px",fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",color:hero.color,marginBottom:"10px"}}>
            <div style={{width:"7px",height:"7px",borderRadius:"50%",background:hero.color,animation:"pulse 1.8s infinite"}} />
            Da fare adesso
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"11px",marginBottom:"13px"}}>
            <div style={{width:"42px",height:"42px",borderRadius:"12px",background:`color-mix(in srgb, ${hero.color} 10%, transparent)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name={hero.icon} size={20} color={hero.color} />
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:"15.5px"}}>{hero.name}</div>
              <div style={{fontSize:"12.5px",color:T.textM,marginTop:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{hero.label}{hero.desc?`: ${hero.desc}`:""}{hero.age?` \u{00B7} ${hero.age}`:""}</div>
            </div>
          </div>
          <button onClick={hero.onAction} style={{display:"block",width:"100%",textAlign:"center",background:hero.color,color:"#fff",fontSize:"14px",fontWeight:800,padding:"13px 0",borderRadius:"13px",border:"none",cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 18px color-mix(in srgb, ${hero.color} 18%, transparent)`}}>{hero.action}</button>
          {hero.type==="confirm"&&<button onClick={()=>{update("followUps",hero.fu.id,{status:"sent",sentDate:today()});}} style={{display:"block",width:"100%",textAlign:"center",fontSize:"11.5px",color:T.textD,fontWeight:700,marginTop:"9px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Segna come inviata</button>}
          {hero.type==="confirm"&&confirmCount>1&&<button onClick={()=>setView("followup")} style={{display:"block",width:"100%",textAlign:"center",fontSize:"11.5px",color:T.textD,fontWeight:700,marginTop:"5px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Altre conferme da inviare ({confirmCount})</button>}
          {hero.type==="followup"&&fuCountNoConfirm>1&&<button onClick={()=>setView("followup")} style={{display:"block",width:"100%",textAlign:"center",fontSize:"11.5px",color:T.textD,fontWeight:700,marginTop:"9px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Vedi tutti i follow-up ({fuCountNoConfirm})</button>}
          {hero.type==="richiesta"&&richCount>1&&<button onClick={()=>setView("richieste")} style={{display:"block",width:"100%",textAlign:"center",fontSize:"11.5px",color:T.textD,fontWeight:700,marginTop:"9px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Vedi tutte le prenotazioni ({richCount})</button>}
        </div>
      ) : (
        <div style={{background:`linear-gradient(165deg,${T.bg2},${T.bg3})`,border:`1.4px solid ${T.border}`,borderRadius:T.r.xl,padding:"26px 18px",textAlign:"center",marginBottom:"16px",boxShadow:`0 8px 22px color-mix(in srgb, ${T.green} 6%, transparent)`}}>
          <div style={{width:"54px",height:"54px",borderRadius:"50%",background:T.greenS,color:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",margin:"0 auto 12px"}}>{"\u{2713}"}</div>
          <h2 style={{fontSize:"17px",fontWeight:800}}>Tutto sotto controllo</h2>
          <p style={{fontSize:"12.5px",color:T.textD,marginTop:"5px",lineHeight:1.5}}>Nessun follow-up in sospeso, agenda gestita.<br/>I messaggi partono quando serve.</p>
          <button onClick={()=>setShowInvite(true)} style={{marginTop:"15px",fontSize:"12px",fontWeight:700,color:T.green,background:T.greenS,borderRadius:"12px",padding:"10px 13px",display:"inline-block",border:"none",cursor:"pointer",fontFamily:"inherit"}}>{"\u{1F4A1}"} Invita un cliente con il link</button>
        </div>
      )}

      {/* OGGI IN AGENDA — informativo, non azione */}
      {apptToday.length>0&&(
        <button onClick={()=>setView("appointments")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"10px",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.blueS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="calendar" size={18} color={T.blue} /></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:"13px",color:T.blue}}>Oggi in agenda</div>
            <div style={{fontSize:"12px",color:T.textM,marginTop:"2px"}}>{apptToday.map(a=>{const cl=(data?.clients||[]).find(c=>c.id===a.clientId);return (a.time?`${a.time} `:"")+(cl?.name||"\u{2014}");}).join(" \u{00B7} ")}</div>
          </div>
          <span style={{color:T.textMu,fontSize:"17px",fontWeight:700}}>{"\u{203A}"}</span>
        </button>
      )}

      {/* SEZIONE MODULI */}
      <div style={{fontSize:"11px",fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",color:T.textMu,margin:"18px 2px 9px"}}>I tuoi moduli</div>

      {/* Richieste */}
      <button onClick={()=>setView("richieste")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"5px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 4px 14px color-mix(in srgb, ${T.green} 5%, transparent)`}}>
        <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="bell" size={18} color={T.green} /></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:"14px"}}>Richieste</div><div style={{fontSize:"11.5px",color:T.textD,marginTop:"1px"}}>prenotazioni dal link</div></div>
        {richCount>0
          ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.amberS,color:T.amber,whiteSpace:"nowrap"}}>{richCount} da gestire</span>
          : <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.greenS,color:T.greenH,whiteSpace:"nowrap"}}>in pari</span>
        }
        <span style={{color:T.textMu,fontSize:"17px",fontWeight:700,marginLeft:"2px"}}>{"\u{203A}"}</span>
      </button>
      <div style={{display:"flex",alignItems:"center",gap:"7px",margin:"1px 0 9px 24px",fontSize:"10px",color:T.textMu,fontWeight:700}}>
        <div style={{width:"11px",height:"11px",borderLeft:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottom:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottomLeftRadius:"5px"}} />
        diventa un appuntamento
      </div>

      {/* Agenda */}
      <button onClick={()=>setView("appointments")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"5px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 4px 14px color-mix(in srgb, ${T.green} 5%, transparent)`}}>
        <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="calendar" size={18} color={T.green} /></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:"14px"}}>Agenda</div><div style={{fontSize:"11.5px",color:T.textD,marginTop:"1px"}}>i tuoi appuntamenti</div></div>
        {apptToday.length>0
          ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.amberS,color:T.amber,whiteSpace:"nowrap"}}>{apptToday.length} oggi</span>
          : apptUpcoming.length>0
            ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.blueS,color:T.blue,whiteSpace:"nowrap"}}>{apptUpcoming.length} prossim{apptUpcoming.length===1?"o":"i"}</span>
            : <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.greenS,color:T.greenH,whiteSpace:"nowrap"}}>in pari</span>
        }
        <span style={{color:T.textMu,fontSize:"17px",fontWeight:700,marginLeft:"2px"}}>{"\u{203A}"}</span>
      </button>
      <div style={{display:"flex",alignItems:"center",gap:"7px",margin:"1px 0 9px 24px",fontSize:"10px",color:T.textMu,fontWeight:700}}>
        <div style={{width:"11px",height:"11px",borderLeft:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottom:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottomLeftRadius:"5px"}} />
        il cliente arriva
      </div>

      {/* Follow-Up */}
      <button onClick={()=>setView("followup")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"5px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 4px 14px color-mix(in srgb, ${T.green} 5%, transparent)`}}>
        <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="message" size={18} color={T.green} /></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:"14px"}}>Follow-Up</div><div style={{fontSize:"11.5px",color:T.textD,marginTop:"1px"}}>post-appuntamento</div></div>
        {fuCount>0
          ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.amberS,color:T.amber,whiteSpace:"nowrap"}}>{fuCount} da inviare</span>
          : <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.greenS,color:T.greenH,whiteSpace:"nowrap"}}>in pari</span>
        }
        <span style={{color:T.textMu,fontSize:"17px",fontWeight:700,marginLeft:"2px"}}>{"\u{203A}"}</span>
      </button>
      <div style={{display:"flex",alignItems:"center",gap:"7px",margin:"1px 0 9px 24px",fontSize:"10px",color:T.textMu,fontWeight:700}}>
        <div style={{width:"11px",height:"11px",borderLeft:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottom:`1.6px solid color-mix(in srgb, ${T.green} 45%, transparent)`,borderBottomLeftRadius:"5px"}} />
        cura il rapporto
      </div>

      {/* Clienti */}
      <button onClick={()=>setView("clients")} style={{display:"flex",alignItems:"center",gap:"12px",width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:"15px",padding:"12px 13px",marginBottom:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:`0 4px 14px color-mix(in srgb, ${T.green} 5%, transparent)`}}>
        <div style={{width:"36px",height:"36px",borderRadius:"11px",background:T.greenS,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="users" size={18} color={T.green} /></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:"14px"}}>Clienti</div><div style={{fontSize:"11.5px",color:T.textD,marginTop:"1px"}}>{noClients?"la tua rubrica":`${activeC.length} attiv${activeC.length===1?"o":"i"}`}</div></div>
        {reactCount>0
          ? <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.amberS,color:T.amber,whiteSpace:"nowrap"}}>{reactCount} da riatt.</span>
          : <span style={{fontSize:"11px",fontWeight:800,padding:"5px 11px",borderRadius:"20px",background:T.greenS,color:T.greenH,whiteSpace:"nowrap"}}>in pari</span>
        }
        <span style={{color:T.textMu,fontSize:"17px",fontWeight:700,marginLeft:"2px"}}>{"\u{203A}"}</span>
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  HOME — router servizi/prodotti + modal condivisi
// ═══════════════════════════════════════════════════════════════
const Home = ({setView}) => {
  const {data,update,addRecord}=useSliss();
  const [showQuickAdd,setShowQuickAdd]=useState(false);
  const [showInvite,setShowInvite]=useState(false);
  const [qDone,setQDone]=useState(false);
  const [qForm,setQForm]=useState({firstName:"",lastName:"",phone:"",email:"",date:today(),serviceType:"Sessione",product:"",channel:"WhatsApp"});
  const [celebrate,setCelebrate]=useState(false);
  const td=today();
  const bizType=data?.settings?.bizType||"servizi";
  const cluster=data?.settings?.cluster||"altro_s";
  const clusterSvcTypes=(CLUSTERS_SERVIZI[cluster]?.serviceTypes)||CLUSTERS_SERVIZI.altro_s.serviceTypes;
  const pending=(data?.followUps||[]).filter(f=>f.status==="pending"&&f.scheduledDate<=td&&!isPhaseOff(data?.templates,f.phase));
  const activeC=(data?.clients||[]).filter(c=>c.status==="active"||c.status==="vip");
  const toReact=(data?.clients||[]).filter(c=>c.status==="to_reactivate");
  const toShip=bizType==="prodotti"?(data?.orders||[]).filter(o=>o.status==="pending"):[];
  const noClients=(data?.clients||[]).length===0;

  const handleQuickAdd=()=>{
    const needEmail=qForm.channel==="Email";
    if(!qForm.firstName.trim()||(needEmail?!qForm.email.trim():!qForm.phone.trim()))return;
    const qName=qForm.firstName.trim()+(qForm.lastName.trim()?' '+qForm.lastName.trim():'');
    let clientId=(data?.clients||[]).find(c=>(qForm.phone.trim()&&c.phone===qForm.phone.trim())||(qForm.email.trim()&&c.email===qForm.email.trim()))?.id;
    if(!clientId){clientId=uid();addRecord("clients",{id:clientId,firstName:qForm.firstName.trim(),lastName:qForm.lastName.trim(),name:qName,phone:qForm.phone.trim(),email:qForm.email.trim(),channel:qForm.channel||"WhatsApp",status:"active",tags:[],notes:"",firstVisit:qForm.date,lastVisit:qForm.date,consent:true,created:today()});}
    if(bizType==="servizi"){const apptId=uid();const timings=data?.settings?.followUpTimings||{thankyou:0,check:7,review:21,reactivation:60};addRecord("appointments",{id:apptId,clientId,date:qForm.date,serviceType:qForm.serviceType,notes:""});buildFollowUps(apptId,clientId,qForm.firstName.trim(),qForm.date,qForm.serviceType,timings,data?.templates,"").forEach(fu=>addRecord("followUps",fu));}
    else{const orderId=uid();addRecord("orders",{id:orderId,clientId,product:qForm.product||"Ordine",orderDate:qForm.date,status:"pending",notes:""});buildProductFollowUps(orderId,clientId,qForm.firstName.trim(),qForm.date,null,data?.templates).forEach(fu=>addRecord("followUps",fu));}
    setQDone(true);setTimeout(()=>{setQDone(false);setShowQuickAdd(false);setQForm({firstName:"",lastName:"",phone:"",email:"",date:today(),serviceType:clusterSvcTypes[0],product:"",channel:"WhatsApp"});},1500);
  };

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      {bizType==="prodotti"
        ? <HomeProdotti setView={setView} data={data} update={update} pending={pending} toShip={toShip} />
        : <HomeServizi setView={setView} data={data} update={update} pending={pending} activeC={activeC} toReact={toReact} noClients={noClients} setShowQuickAdd={setShowQuickAdd} setShowInvite={setShowInvite} />
      }
      {showInvite&&<InviteClient onClose={()=>setShowInvite(false)} />}
      <Modal open={showQuickAdd} onClose={()=>{setShowQuickAdd(false);setQDone(false);}} title="Nuovo cliente">
        {qDone
          ?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:"44px",marginBottom:"12px"}}>{"\u{2705}"}</div><div style={{fontWeight:700,fontSize:"16px",marginBottom:"6px"}}>Salvato!</div><div style={{fontSize:"13px",color:T.textD}}>Follow-up generati automaticamente.</div></div>
          :<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}><FormField label="Nome *"><input value={qForm.firstName} onChange={e=>setQForm(p=>({...p,firstName:e.target.value}))} placeholder="Es. Marco" /></FormField><FormField label="Cognome"><input value={qForm.lastName} onChange={e=>setQForm(p=>({...p,lastName:e.target.value}))} placeholder="Es. Rossi" /></FormField></div>
            <FormField label="Metodo di contatto"><select value={qForm.channel} onChange={e=>setQForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
            {qForm.channel==="Email"
              ? <FormField label="Email"><input value={qForm.email} onChange={e=>setQForm(p=>({...p,email:e.target.value}))} placeholder="email@esempio.com" type="email" /></FormField>
              : <FormField label={qForm.channel==="SMS"?"Numero di telefono":"Numero WhatsApp"}><input value={qForm.phone} onChange={e=>setQForm(p=>({...p,phone:e.target.value}))} placeholder="347 123 4567" type="tel" /></FormField>}
            <FormField label={bizType==="prodotti"?"Data ordine":"Data appuntamento"}><input value={qForm.date} onChange={e=>setQForm(p=>({...p,date:e.target.value}))} type="date" /></FormField>
            {bizType==="servizi"
              ?<FormField label="Tipo servizio"><select value={qForm.serviceType} onChange={e=>setQForm(p=>({...p,serviceType:e.target.value}))}>{clusterSvcTypes.map(s=><option key={s}>{s}</option>)}</select></FormField>
              :<FormField label="Prodotto"><input value={qForm.product} onChange={e=>setQForm(p=>({...p,product:e.target.value}))} placeholder="Es. Stampa figurina" /></FormField>
            }
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowQuickAdd(false)}>Annulla</Btn><Btn onClick={handleQuickAdd} disabled={!qForm.firstName.trim()||(qForm.channel==="Email"?!qForm.email.trim():!qForm.phone.trim())}>Salva e genera</Btn></div>
          </>
        }
      </Modal>
      <Celebration open={celebrate} onClose={()=>setCelebrate(false)} title="Primo follow-up inviato!" text="Il tuo cliente si sentirà seguito. Sliss ti ricorderà il prossimo al momento giusto." />
    </div>
  );
};

export default Home;
