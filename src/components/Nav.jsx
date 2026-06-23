import T from "../theme.js";
import { useSliss } from "../context.js";
import SlissLogo from "./SlissLogo.jsx";
import Icon from "./Icon.jsx";
import { Card } from "./ui.jsx";

const getNavMain = (bizType) => {
  const agendaItem = bizType==="prodotti" ? {id:"orders",icon:"package",label:"Ordini in corso"} : {id:"appointments",icon:"calendar",label:"Agenda"};
  return [{id:"home",icon:"home",label:"Home"},{id:"clients",icon:"users",label:"Clienti"},agendaItem,{id:"followup",icon:"message",label:"Follow-Up"}];
};

// Barra superiore (solo mobile): logo Sliss a sinistra, "Altro" a destra (apre il MoreMenu).
const TopBar = ({view,setView}) => {
  const moreActive=["richieste","templates","feedback","modules","settings","more"].includes(view);
  return (
    <div className="mobile-only" style={{position:"sticky",top:0,zIndex:90,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",background:"var(--c-nav,rgba(255,255,255,.82))",backdropFilter:"blur(20px) saturate(1.3)",WebkitBackdropFilter:"blur(20px) saturate(1.3)",borderBottom:`1px solid ${T.border}`}}>
      <SlissLogo size={22} />
      <button onClick={()=>setView("more")} aria-label="Altro" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",color:moreActive?T.green:T.textD,fontFamily:"inherit",padding:"4px 6px",minHeight:"44px"}}>
        <Icon name="more" size={22} color={moreActive?T.green:T.textD} />
        <span style={{fontSize:"9px",fontWeight:700}}>Altro</span>
      </button>
    </div>
  );
};

// Isola flottante (solo mobile): 4 destinazioni + tasto "+" centrale rialzato (azione rapida).
const FloatingNav = ({view,setView,pendingCount,bizType="",onAdd}) => {
  const agenda = bizType==="prodotti" ? {id:"orders",icon:"package",label:"Ordini"} : {id:"appointments",icon:"calendar",label:"Agenda"};
  const left=[{id:"home",icon:"home",label:"Home"},{id:"followup",icon:"message",label:"Follow-Up"}];
  const right=[agenda,{id:"clients",icon:"users",label:"Clienti"}];
  const itemBtn=(n)=>{
    const a=view===n.id;
    const showBadge=n.id==="followup"&&pendingCount>0;
    return (
      <button key={n.id} onClick={()=>setView(n.id)} aria-label={n.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"8px 11px",borderRadius:"16px",border:"none",cursor:"pointer",background:a?T.greenS:"transparent",color:a?T.green:T.textD,fontFamily:"inherit",position:"relative",minWidth:"54px",transition:"background .2s,color .2s"}}>
        {showBadge&&<div style={{position:"absolute",top:"3px",right:"7px",minWidth:"15px",height:"15px",padding:"0 3px",borderRadius:"8px",background:T.amber,fontSize:"9px",fontWeight:800,color:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>{pendingCount>9?"9+":pendingCount}</div>}
        <Icon name={n.icon} size={21} color={a?T.green:T.textD} />
        <span style={{fontSize:"9px",fontWeight:700}}>{n.label}</span>
      </button>
    );
  };
  return (
    <div className="mobile-only" style={{position:"fixed",left:0,right:0,bottom:0,zIndex:100,display:"flex",justifyContent:"center",pointerEvents:"none",paddingBottom:"calc(14px + env(safe-area-inset-bottom))"}}>
      <div style={{pointerEvents:"auto",display:"flex",alignItems:"center",gap:"2px",padding:"7px 9px",background:"var(--c-nav,rgba(255,255,255,.82))",backdropFilter:"blur(24px) saturate(1.5)",WebkitBackdropFilter:"blur(24px) saturate(1.5)",border:`1px solid ${T.border}`,borderRadius:"28px",boxShadow:`0 12px 40px rgba(20,60,40,.20), inset 0 1px 0 var(--c-navHi,rgba(255,255,255,.6))`}}>
        {left.map(itemBtn)}
        <button onClick={onAdd} aria-label="Aggiungi" style={{width:"56px",height:"56px",borderRadius:"50%",background:T.green,color:T.onGreen,border:`3px solid ${T.bg2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",margin:"-18px 6px 0",flexShrink:0,boxShadow:`0 10px 24px ${T.greenG}, 0 2px 6px rgba(0,0,0,.2)`}}>
          <Icon name="plus" size={26} color={T.onGreen} stroke={2.4} />
        </button>
        {right.map(itemBtn)}
      </div>
    </div>
  );
};

const MoreMenu = ({setView}) => {
  const items=[{id:"richieste",icon:"message",label:"Richieste",desc:"Le richieste dal tuo link"},{id:"templates",icon:"file",label:"Template",desc:"Gestisci i messaggi"},{id:"feedback",icon:"star",label:"Feedback",desc:"Recensioni clienti"},{id:"modules",icon:"grid",label:"Moduli",desc:"Funzioni aggiuntive"},{id:"settings",icon:"settings",label:"Impostazioni",desc:"Personalizza Sliss"}];
  return (
    <div style={{animation:"fadeIn .3s ease"}}>
      <h1 style={{fontSize:"22px",fontWeight:700,marginBottom:"22px"}}>Altro</h1>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {items.map(it=>(
          <Card key={it.id} hov onClick={()=>setView(it.id)} style={{display:"flex",alignItems:"center",gap:"14px",padding:"16px 18px"}}>
            <div style={{width:"44px",height:"44px",borderRadius:T.r.l,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={it.icon} size={22} color={T.textM} /></div>
            <div><div style={{fontWeight:600,fontSize:"15px"}}>{it.label}</div><div style={{fontSize:"13px",color:T.textD,marginTop:"2px"}}>{it.desc}</div></div>
            <span style={{marginLeft:"auto",color:T.textMu,fontSize:"18px"}}>{"\u{203A}"}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

const DesktopSidebar = ({view,setView}) => {
  const {data:sData}=useSliss();
  const allNav=[...getNavMain(sData?.settings?.bizType||""),{id:"richieste",icon:"message",label:"Richieste"},{id:"templates",icon:"file",label:"Template"},{id:"feedback",icon:"star",label:"Feedback"},{id:"modules",icon:"grid",label:"Moduli"},{id:"settings",icon:"settings",label:"Impostazioni"}];
  return (
    <div className="desktop-only" style={{width:"210px",minHeight:"100vh",background:T.bg2,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:100}}>
      <div style={{padding:"22px 18px 18px",borderBottom:`1px solid ${T.border}`}}>
        <SlissLogo size={24} />
        <div style={{fontSize:"9px",color:T.textMu,fontWeight:500,letterSpacing:".05em",textTransform:"uppercase",marginTop:"4px"}}>Liscio come deve essere</div>
      </div>
      <nav style={{flex:1,padding:"8px 6px",display:"flex",flexDirection:"column",gap:"1px"}}>
        {allNav.map(n=>{const a=view===n.id; return (
          <button key={n.id} onClick={()=>setView(n.id)} style={{display:"flex",alignItems:"center",gap:"9px",padding:"10px 12px",borderRadius:T.r.m,border:"none",cursor:"pointer",background:a?T.greenS:"transparent",color:a?T.green:T.textD,fontWeight:a?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .12s",textAlign:"left",width:"100%",minHeight:"44px"}}>
            <span style={{width:"22px",display:"flex",justifyContent:"center",flexShrink:0}}><Icon name={n.icon} size={18} color={a?T.green:T.textD} /></span>{n.label}
          </button>
        );})}
      </nav>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${T.border}`}}>
        <div style={{fontSize:"10px",color:T.textMu}}>Sliss v7.5 · liscio come deve essere.</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════

export { TopBar, FloatingNav, MoreMenu, DesktopSidebar };
