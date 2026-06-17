import T from "../theme.js";
import { useSliss } from "../context.js";
import SlissLogo from "./SlissLogo.jsx";
import Icon from "./Icon.jsx";
import { Card } from "./ui.jsx";

const getNavMain = (bizType) => {
  const agendaItem = bizType==="prodotti" ? {id:"orders",icon:"package",label:"Ordini in corso"} : {id:"appointments",icon:"calendar",label:"Agenda"};
  return [{id:"home",icon:"home",label:"Home"},{id:"clients",icon:"users",label:"Clienti"},agendaItem,{id:"followup",icon:"message",label:"Follow-Up"}];
};

const BottomNav = ({view,setView,pendingCount,bizType=""}) => (
  <nav className="mobile-only" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:T.bg2,borderTop:`1px solid ${T.border}`,boxShadow:"0 -1px 0 rgba(0,0,0,0.06)",display:"flex",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)"}}>
    {getNavMain(bizType).map(n=>{
      const a=view===n.id;
      const showBadge=n.id==="followup"&&pendingCount>0;
      return (
        <button key={n.id} onClick={()=>setView(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"10px 0",background:"none",border:"none",cursor:"pointer",color:a?T.green:T.textD,fontFamily:"inherit",transition:"color .15s",position:"relative",minHeight:"56px"}}>
          {showBadge&&<div style={{position:"absolute",top:"6px",right:"calc(50% - 14px)",width:"16px",height:"16px",borderRadius:"50%",background:T.amber,fontSize:"10px",fontWeight:700,color:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>{pendingCount>9?"9+":pendingCount}</div>}
          <Icon name={n.icon} size={22} color={a?T.green:T.textD} />
          <span style={{fontSize:"11px",fontWeight:a?600:400}}>{n.label}</span>
        </button>
      );
    })}
    <button onClick={()=>setView("more")} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"10px 0",background:"none",border:"none",cursor:"pointer",color:["templates","feedback","modules","settings"].includes(view)?T.blue:T.textD,fontFamily:"inherit",minHeight:"56px"}}>
      <Icon name="more" size={22} color={["templates","feedback","modules","settings"].includes(view)?T.blue:T.textD} />
      <span style={{fontSize:"11px",fontWeight:400}}>Altro</span>
    </button>
  </nav>
);

const MoreMenu = ({setView}) => {
  const items=[{id:"templates",icon:"file",label:"Template",desc:"Gestisci i messaggi"},{id:"feedback",icon:"star",label:"Feedback",desc:"Recensioni clienti"},{id:"modules",icon:"grid",label:"Moduli",desc:"Funzioni aggiuntive"},{id:"settings",icon:"settings",label:"Impostazioni",desc:"Personalizza Sliss"}];
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
  const allNav=[...getNavMain(sData?.settings?.bizType||""),{id:"templates",icon:"file",label:"Template"},{id:"feedback",icon:"star",label:"Feedback"},{id:"modules",icon:"grid",label:"Moduli"},{id:"settings",icon:"settings",label:"Impostazioni"}];
  return (
    <div className="desktop-only" style={{width:"210px",minHeight:"100vh",background:T.bg2,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:100}}>
      <div style={{padding:"22px 18px 18px",borderBottom:`1px solid ${T.border}`}}>
        <SlissLogo size={24} />
        <div style={{fontSize:"9px",color:T.textMu,fontWeight:500,letterSpacing:".05em",textTransform:"uppercase",marginTop:"4px"}}>Ecosistema Operativo</div>
      </div>
      <nav style={{flex:1,padding:"8px 6px",display:"flex",flexDirection:"column",gap:"1px"}}>
        {allNav.map(n=>{const a=view===n.id; return (
          <button key={n.id} onClick={()=>setView(n.id)} style={{display:"flex",alignItems:"center",gap:"9px",padding:"10px 12px",borderRadius:T.r.m,border:"none",cursor:"pointer",background:a?T.greenS:"transparent",color:a?T.green:T.textD,fontWeight:a?600:400,fontSize:"13px",fontFamily:"inherit",transition:"all .12s",textAlign:"left",width:"100%",minHeight:"44px"}}>
            <span style={{width:"22px",display:"flex",justifyContent:"center",flexShrink:0}}><Icon name={n.icon} size={18} color={a?T.green:T.textD} /></span>{n.label}
          </button>
        );})}
      </nav>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${T.border}`}}>
        <div style={{fontSize:"10px",color:T.textMu}}>Sliss v6.9 · liscio come deve essere.</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════

export { BottomNav, MoreMenu, DesktopSidebar };
