import { useState, useId, useEffect, useRef, cloneElement } from "react";
import T from "../theme.js";

export const Badge = ({label,color,bg,s}) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:s?"3px 10px":"4px 12px",borderRadius:T.r.full,fontSize:s?"11px":"12px",fontWeight:600,color,background:bg,whiteSpace:"nowrap"}}>{label}</span>
);

export const Btn = ({children,v="primary",s="md",onClick,style,disabled,aria,title}) => {
  const VS={primary:{bg:T.green,c:"#fff",hb:T.greenH,bd:"none"},secondary:{bg:"transparent",c:T.textM,hb:T.bg4,bd:`1px solid ${T.border}`},success:{bg:T.green,c:"#fff",hb:"#09a066",bd:"none"},danger:{bg:"transparent",c:T.red,hb:T.redS,bd:`1px solid ${T.red}44`},ghost:{bg:"transparent",c:T.textD,hb:T.bg3,bd:"none"}};
  const SS={sm:{p:"8px 14px",f:"13px"},md:{p:"11px 20px",f:"14px"},lg:{p:"14px 28px",f:"15px"}};
  const vv=VS[v],ss=SS[s];
  const [h,setH]=useState(false);
  return <button onClick={onClick} disabled={disabled} aria-label={aria} title={title||aria} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-flex",alignItems:"center",gap:"6px",background:h&&!disabled?vv.hb:vv.bg,color:vv.c,border:vv.bd,borderRadius:T.r.m,fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all .15s",fontFamily:"inherit",opacity:disabled?.45:1,padding:ss.p,fontSize:ss.f,minHeight:"44px",...style}}>{children}</button>;
};

export const Card = ({children,style,onClick,hov}) => {
  const [h,setH]=useState(false);
  const kb=onClick?{role:"button",tabIndex:0,onKeyDown:e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onClick(e);}}}:{};
  return <div onClick={onClick} {...kb} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:T.bg2,border:`1px solid ${h&&hov?T.borderH:T.border}`,borderRadius:T.r.l,padding:"16px 18px",transition:"border-color .2s",cursor:hov?"pointer":"default",animation:"fadeIn .3s ease",...style}}>{children}</div>;
};

// Empty state che INSEGNA invece di dire "qui non c'è niente":
// - preview (opzionale): un'anteprima sbiadita di com'è la pagina piena (sfuma verso il fondo)
// - icon: ripiego quando non c'è preview
// - title/desc: cosa comparirà e perché
// - action: l'azione giusta · hint: il "filo" che rimanda al prerequisito (es. aggiungi un cliente)
// Le chiamate vecchie (icon/title/desc/action) restano valide.
export const Empty = ({icon,title,desc,action,preview,previewLabel,hint}) => (
  <div style={{textAlign:"center",padding:preview?"26px 18px 34px":"56px 20px"}}>
    {preview
      ? <div style={{maxWidth:"300px",margin:"0 auto 20px"}}>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",color:T.textMu,marginBottom:"8px"}}>{previewLabel||"Comparir\u{e0} cos\u{ec}"}</div>
          <div style={{position:"relative"}}>
            <div style={{opacity:.5}} aria-hidden="true">{preview}</div>
            <div style={{position:"absolute",left:0,right:0,bottom:0,height:"60%",background:`linear-gradient(180deg,transparent,${T.bg})`,pointerEvents:"none"}} aria-hidden="true" />
          </div>
        </div>
      : <div style={{fontSize:"44px",marginBottom:"14px",opacity:.35}} aria-hidden="true">{icon}</div>
    }
    <div style={{fontSize:"16px",fontWeight:700,color:T.text,marginBottom:"7px",letterSpacing:"-.01em"}}>{title}</div>
    <div style={{fontSize:"13.5px",color:T.textM,maxWidth:"270px",margin:"0 auto 18px",lineHeight:1.6}}>{desc}</div>
    {action}
    {hint&&<div style={{fontSize:"12.5px",color:T.textD,marginTop:"12px",lineHeight:1.5}}>{hint}</div>}
  </div>
);

// Mattoncini "anteprima sbiadita" riusabili dagli empty state (passati come prop `preview`).
// GhostRow = riga lista (clienti/appuntamenti) · GhostBubble = card messaggio (follow-up/recensione).
export const GhostRow = ({avatar=true}) => (
  <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"11px 13px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:T.r.l,marginBottom:"7px"}}>
    {avatar&&<div style={{width:"34px",height:"34px",borderRadius:"50%",background:T.bg3,border:`1px solid ${T.border}`,flexShrink:0}} />}
    <div style={{flex:1}}>
      <div style={{height:"9px",width:"60%",background:T.bg4,borderRadius:"5px",marginBottom:"6px"}} />
      <div style={{height:"7px",width:"40%",background:T.bg3,borderRadius:"5px"}} />
    </div>
    <div style={{width:"46px",height:"16px",borderRadius:"8px",background:T.bg3,flexShrink:0}} />
  </div>
);

export const GhostBubble = ({stars=false}) => (
  <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:T.r.l,padding:"11px",marginBottom:"7px",textAlign:"left"}}>
    {stars
      ? <div style={{fontSize:"14px",letterSpacing:"2px",color:T.amber,marginBottom:"6px"}}>{"\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}"}</div>
      : <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"7px"}}><div style={{width:"18px",height:"18px",borderRadius:"5px",background:T.blueS}} /><div style={{height:"9px",width:"70px",background:T.bg4,borderRadius:"5px"}} /></div>}
    <div style={{height:"7px",background:T.bg3,borderRadius:"5px",marginBottom:"5px"}} />
    <div style={{height:"7px",width:"80%",background:T.bg3,borderRadius:"5px"}} />
  </div>
);

export const Search = ({value,onChange,placeholder}) => (
  <div style={{position:"relative"}}>
    <span style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",fontSize:"15px",opacity:.3}}>{"\u{1F50D}"}</span>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Cerca..."} style={{paddingLeft:"40px",fontSize:"15px"}} />
  </div>
);

export const Tabs = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:"2px",background:T.bg,padding:"3px",borderRadius:T.r.m,border:`1px solid ${T.border}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)} style={{padding:"8px 14px",borderRadius:T.r.s,border:"none",cursor:"pointer",background:active===t.id?T.bg3:"transparent",color:active===t.id?T.text:T.textD,fontWeight:active===t.id?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap",minHeight:"44px"}}>
        {t.label}{t.count!=null&&<span style={{marginLeft:"5px",fontSize:"11px",opacity:.55}}>({t.count})</span>}
      </button>
    ))}
  </div>
);

export const Modal = ({open,onClose,title,children,w}) => {
  const panelRef=useRef(null);
  const titleId=useId();
  // Focus sul pannello SOLO all'apertura (dipende da `open`, non da `onClose`):
  // così non ruba il focus all'input mentre si digita.
  useEffect(()=>{ if(open) panelRef.current?.focus(); },[open]);
  useEffect(()=>{
    if(!open) return;
    const onKey=e=>{if(e.key==="Escape"&&onClose)onClose();};
    document.addEventListener("keydown",onKey);
    return ()=>document.removeEventListener("keydown",onKey);
  },[open,onClose]);
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.82)",backdropFilter:"blur(8px)"}} />
      <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#FFFFFF",border:"1px solid #DEE2E6",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:w||"580px",maxHeight:"92vh",overflowX:"hidden",overflowY:"auto",animation:"slideUp .25s ease",boxShadow:"0 -8px 40px rgba(0,0,0,.6)",outline:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px 14px",borderBottom:`1px solid ${T.border}`}}>
          <h3 id={titleId} style={{fontSize:"16px",fontWeight:700}}>{title}</h3>
          <button onClick={onClose} aria-label="Chiudi" style={{background:T.bg3,border:"none",color:T.textM,fontSize:"16px",cursor:"pointer",width:"40px",height:"40px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"\u{2715}"}</button>
        </div>
        <div style={{padding:"20px 22px",paddingBottom:"calc(20px + env(safe-area-inset-bottom))"}}>{children}</div>
      </div>
    </div>
  );
};

export const FormField = ({label,children,hint}) => {
  const id=useId();
  const hintId=hint?`${id}-hint`:undefined;
  const field=cloneElement(children,{id,...(hintId?{"aria-describedby":hintId}:{})});
  return (
    <div style={{marginBottom:"18px"}}>
      <label htmlFor={id} style={{display:"block",fontSize:"12px",color:T.textD,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:"7px"}}>{label}</label>
      {field}
      {hint&&<div id={hintId} style={{fontSize:"12px",color:T.textMu,marginTop:"6px",lineHeight:1.5}}>{hint}</div>}
    </div>
  );
};

export const SendButtons = ({message,clientPhone,clientEmail,channel,onSend,labelOverride}) => {
  // Sceglie il canale d'invio in base alla preferenza del cliente, con ripiego
  // sui contatti effettivamente disponibili. Numero locale (10 cifre) -> prefisso 39.
  const digits=String(clientPhone||"").replace(/\D/g,"");
  const phone=digits.length===10?`39${digits}`:digits;
  const email=String(clientEmail||"").trim();
  const body=encodeURIComponent(message);
  const subj=encodeURIComponent("Un messaggio per te");
  const ch=channel||"WhatsApp";
  let href,label,bg;
  if(ch==="Email"&&email){ href=`mailto:${email}?subject=${subj}&body=${body}`; label=`\u{2709}\u{FE0F} Email`; bg="#2563EB"; }
  else if(ch==="SMS"&&digits){ href=`sms:${phone}?&body=${body}`; label=`\u{1F4AC} SMS`; bg=T.teal; }
  else if(digits){ href=`whatsapp://send?phone=${phone}&text=${body}`; label=`\u{1F4F1} WhatsApp`; bg="#1DA851"; }
  else if(email){ href=`mailto:${email}?subject=${subj}&body=${body}`; label=`\u{2709}\u{FE0F} Email`; bg="#2563EB"; }
  else return <span style={{fontSize:"12px",color:T.textMu}}>Nessun contatto disponibile</span>;
  return (
    <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
      <a href={href} target="_blank" rel="noreferrer" onClick={onSend} style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:bg,color:"#fff",borderRadius:T.r.m,fontSize:"13px",fontWeight:600,textDecoration:"none",minHeight:"44px"}}>{labelOverride||label}</a>
    </div>
  );
};

export const PageHeader = ({title,action}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
    <h1 style={{fontSize:"22px",fontWeight:700,letterSpacing:"-.02em"}}>{title}</h1>
    {action}
  </div>
);

// "i" contestuale: tocchi → si apre una scheda con la spiegazione. Riusa il Modal.
export const Info = ({title,body}) => {
  const [open,setOpen]=useState(false);
  return (
    <>
      <button type="button" onClick={e=>{e.stopPropagation();setOpen(true);}} aria-label={`Informazioni: ${title}`} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"18px",height:"18px",minWidth:"18px",borderRadius:"50%",background:T.blueS,color:T.blue,border:"none",cursor:"pointer",fontSize:"12px",fontWeight:700,fontFamily:"inherit",padding:0,flexShrink:0,lineHeight:1}}>i</button>
      <Modal open={open} onClose={()=>setOpen(false)} title={title}>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",fontSize:"14px",color:T.textM,lineHeight:1.7}}>
          {(Array.isArray(body)?body:[body]).map((p,i)=><p key={i}>{p}</p>)}
        </div>
      </Modal>
    </>
  );
};
