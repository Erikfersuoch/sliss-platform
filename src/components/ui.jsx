import { useState } from "react";
import T from "../theme.js";

export const Badge = ({label,color,bg,s}) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:s?"3px 10px":"4px 12px",borderRadius:T.r.full,fontSize:s?"11px":"12px",fontWeight:600,color,background:bg,whiteSpace:"nowrap"}}>{label}</span>
);

export const Btn = ({children,v="primary",s="md",onClick,style,disabled}) => {
  const VS={primary:{bg:T.green,c:"#fff",hb:T.greenH,bd:"none"},secondary:{bg:"transparent",c:T.textM,hb:T.bg4,bd:`1px solid ${T.border}`},success:{bg:T.green,c:"#fff",hb:"#09a066",bd:"none"},danger:{bg:"transparent",c:T.red,hb:T.redS,bd:`1px solid ${T.red}44`},ghost:{bg:"transparent",c:T.textD,hb:T.bg3,bd:"none"}};
  const SS={sm:{p:"8px 14px",f:"13px"},md:{p:"11px 20px",f:"14px"},lg:{p:"14px 28px",f:"15px"}};
  const vv=VS[v],ss=SS[s];
  const [h,setH]=useState(false);
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-flex",alignItems:"center",gap:"6px",background:h&&!disabled?vv.hb:vv.bg,color:vv.c,border:vv.bd,borderRadius:T.r.m,fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all .15s",fontFamily:"inherit",opacity:disabled?.45:1,padding:ss.p,fontSize:ss.f,minHeight:"44px",...style}}>{children}</button>;
};

export const Card = ({children,style,onClick,hov}) => {
  const [h,setH]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:T.bg2,border:`1px solid ${h&&hov?T.borderH:T.border}`,borderRadius:T.r.l,padding:"16px 18px",transition:"border-color .2s",cursor:hov?"pointer":"default",animation:"fadeIn .3s ease",...style}}>{children}</div>;
};

export const Empty = ({icon,title,desc,action}) => (
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{fontSize:"44px",marginBottom:"14px",opacity:.35}}>{icon}</div>
    <div style={{fontSize:"16px",fontWeight:600,color:T.textM,marginBottom:"8px"}}>{title}</div>
    <div style={{fontSize:"14px",color:T.textD,maxWidth:"300px",margin:"0 auto 20px",lineHeight:1.7}}>{desc}</div>
    {action}
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
      <button key={t.id} onClick={()=>onChange(t.id)} style={{padding:"8px 14px",borderRadius:T.r.s,border:"none",cursor:"pointer",background:active===t.id?T.bg3:"transparent",color:active===t.id?T.text:T.textD,fontWeight:active===t.id?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap",minHeight:"40px"}}>
        {t.label}{t.count!=null&&<span style={{marginLeft:"5px",fontSize:"11px",opacity:.55}}>({t.count})</span>}
      </button>
    ))}
  </div>
);

export const Modal = ({open,onClose,title,children,w}) => {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.82)",backdropFilter:"blur(8px)"}} />
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#FFFFFF",border:"1px solid #DEE2E6",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:w||"580px",maxHeight:"92vh",overflowX:"hidden",overflowY:"auto",animation:"slideUp .25s ease",boxShadow:"0 -8px 40px rgba(0,0,0,.6)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px 14px",borderBottom:`1px solid ${T.border}`}}>
          <h3 style={{fontSize:"16px",fontWeight:700}}>{title}</h3>
          <button onClick={onClose} style={{background:T.bg3,border:"none",color:T.textM,fontSize:"16px",cursor:"pointer",width:"32px",height:"32px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u{2715}"}</button>
        </div>
        <div style={{padding:"20px 22px",paddingBottom:"calc(20px + env(safe-area-inset-bottom))"}}>{children}</div>
      </div>
    </div>
  );
};

export const FormField = ({label,children,hint}) => (
  <div style={{marginBottom:"18px"}}>
    <label style={{display:"block",fontSize:"12px",color:T.textD,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:"7px"}}>{label}</label>
    {children}
    {hint&&<div style={{fontSize:"12px",color:T.textMu,marginTop:"6px",lineHeight:1.5}}>{hint}</div>}
  </div>
);

export const SendButtons = ({message,clientPhone}) => {
  const [ok,setOk]=useState(false);
  const copy=()=>{navigator.clipboard.writeText(message);setOk(true);setTimeout(()=>setOk(false),2000);};
  const waLink=`https://wa.me/39${clientPhone}?text=${encodeURIComponent(message)}`;
  return (
    <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
      <a href={waLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:"#1DA851",color:"#fff",borderRadius:T.r.m,fontSize:"13px",fontWeight:600,textDecoration:"none",minHeight:"44px"}}>{"\u{1F4F1}"} WhatsApp</a>
      <button onClick={copy} style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:ok?T.green:T.bg4,color:ok?"#fff":T.textM,border:`1px solid ${T.border}`,borderRadius:T.r.m,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",minHeight:"44px"}}>{ok?"\u{2713} Copiato":"\u{1F4CB} Copia"}</button>
    </div>
  );
};

export const PageHeader = ({title,action}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
    <h1 style={{fontSize:"22px",fontWeight:700,letterSpacing:"-.02em"}}>{title}</h1>
    {action}
  </div>
);
