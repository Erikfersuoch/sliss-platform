import T from "../theme.js";
import { MODULES } from "../config.js";
import { Badge, PageHeader } from "../components/ui.jsx";

const ModulesMap = () => {
  const stL={active:"Attivo",validating:"In validazione",planned:"In arrivo",future:"Futuro"};const stS={active:{color:T.green,bg:T.greenS},validating:{color:T.amber,bg:T.amberS},planned:{color:T.amber,bg:T.amberS},future:{color:T.textD,bg:"rgba(90,111,148,0.08)"}};const live={active:{c:T.green,l:"Attivo"},validating:{c:T.amber,l:"In validazione"}};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Moduli" />
      <p style={{color:T.textD,fontSize:"13px",marginBottom:"20px"}}>Ogni modulo si attiva quando c'{"\u{e8}"} una richiesta reale dai clienti.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"10px"}}>{MODULES.map((mod,i)=>{const ss=stS[mod.status];return (<div key={mod.id} style={{background:T.bg2,border:`1px solid ${mod.status==="active"?`color-mix(in srgb, ${mod.color} 25%, transparent)`:mod.status==="validating"?`color-mix(in srgb, ${T.amber} 32%, transparent)`:T.border}`,borderRadius:T.r.l,padding:"16px",animation:`fadeIn .3s ease ${i*.04}s both`}}><div style={{width:"40px",height:"40px",borderRadius:T.r.m,background:`color-mix(in srgb, ${mod.color} 9%, transparent)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",marginBottom:"10px"}}>{mod.icon}</div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{mod.name}</div><div style={{fontSize:"11px",color:T.textD,lineHeight:1.5,marginBottom:"10px"}}>{mod.desc}</div><Badge label={stL[mod.status]} {...ss} s />{live[mod.status]&&<div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"8px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:live[mod.status].c,animation:"pulse 2s infinite"}} /><span style={{fontSize:"11px",color:live[mod.status].c,fontWeight:600}}>{live[mod.status].l}</span></div>}</div>);})}</div>
    </div>
  );
};

export default ModulesMap;
