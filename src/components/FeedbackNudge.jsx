import T from "../theme.js";
import { FOUNDER_WA } from "../config.js";

// Schermata mostrata quando il tester apre la notifica "è ora dei feedback".
// Non raccoglie il feedback in-app (resta conversazionale): fa da ponte alla chat WhatsApp con Erik.
export default function FeedbackNudge({ onClose }) {
  const text = encodeURIComponent("Ciao Erik! Ecco il mio feedback su Sliss: ");
  const waHref = FOUNDER_WA
    ? `whatsapp://send?phone=${FOUNDER_WA}&text=${text}`
    : `https://wa.me/?text=${text}`;

  return (
    <div style={{position:"fixed",inset:0,zIndex:1100,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"32px 24px",paddingBottom:"calc(32px + env(safe-area-inset-bottom))"}}>
      <div style={{fontSize:"56px",marginBottom:"20px"}} aria-hidden="true">{"\u{1F5E3}\u{FE0F}"}</div>
      <h1 style={{fontSize:"24px",fontWeight:700,letterSpacing:"-.02em",color:T.text,marginBottom:"14px"}}>È il momento del feedback</h1>
      <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,maxWidth:"340px",marginBottom:"32px"}}>
        Mi stai aiutando a rendere Sliss migliore. Ti ho scritto su WhatsApp: raccontami com'è andata in questi giorni.
      </p>
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        onClick={onClose}
        style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",background:"#1DA851",color:"#fff",borderRadius:T.r.m,fontSize:"16px",fontWeight:600,textDecoration:"none",padding:"15px 30px",minHeight:"44px",width:"100%",maxWidth:"340px"}}
      >
        {"\u{1F4AC}"} Rispondi su WhatsApp
      </a>
      <button
        onClick={onClose}
        style={{marginTop:"18px",background:"transparent",border:"none",color:T.textD,fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",minHeight:"44px"}}
      >
        Torna all'app
      </button>
    </div>
  );
}
