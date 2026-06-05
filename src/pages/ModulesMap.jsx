import T from "../theme.js";
import { MODULES } from "../config.js";
import { Badge, PageHeader } from "../components/ui.jsx";

const ModulesMap = () => {
  const stL={active:"Attivo",planned:"In arrivo",future:"Futuro"};const stS={active:{color:T.green,bg:T.greenS},planned:{color:T.amber,bg:T.amberS},future:{color:T.textD,bg:"rgba(90,111,148,0.08)"}};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Moduli" />
      <p style={{color:T.textD,fontSize:"13px",marginBottom:"20px"}}>Ogni modulo si attiva quando c'{"\u{e8}"} una richiesta reale dai clienti.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"10px"}}>{MODULES.map((mod,i)=>{const ss=stS[mod.status];return (<div key={mod.id} style={{background:T.bg2,border:`1px solid ${mod.status==="active"?`${mod.color}40`:T.border}`,borderRadius:T.r.l,padding:"16px",animation:`fadeIn .3s ease ${i*.04}s both`}}><div style={{width:"40px",height:"40px",borderRadius:T.r.m,background:`${mod.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",marginBottom:"10px"}}>{mod.icon}</div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{mod.name}</div><div style={{fontSize:"11px",color:T.textD,lineHeight:1.5,marginBottom:"10px"}}>{mod.desc}</div><Badge label={stL[mod.status]} {...ss} s />{mod.status==="active"&&<div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"8px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}} /><span style={{fontSize:"11px",color:T.green,fontWeight:600}}>Attivo</span></div>}</div>);})}</div>
    </div>
  );
};

export default ModulesMap;
