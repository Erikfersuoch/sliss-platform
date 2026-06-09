import T from "../theme.js";

// Schermata mostrata quando il tester apre la notifica "ci sono novità" (?goto=novita).
// Changelog leggibile delle ultime modifiche nate dal feedback dei tester.
const CHANGES = [
  { emoji: "\u{1F5D1}\u{FE0F}", title: "Elimina follow-up", desc: "Puoi togliere un follow-up che non ti serve, direttamente dalla lista." },
  { emoji: "\u{1F4C5}", title: "Prepara scheda dal calendario", desc: "Per chi usa gli appuntamenti: dal calendario, sul giorno scelto, prepari subito la scheda cliente." },
  { emoji: "\u{1F446}", title: "Apri il follow-up dall'Agenda", desc: "Tocca i quadratini delle fasi su un appuntamento e si apre il follow-up." },
  { emoji: "\u{1F9F9}", title: "Scheda cliente più pulita", desc: "Tolto l'elenco follow-up ripetuto nella scheda: lo trovi nella pagina Follow-Up." },
];

export default function UpdateNudge({ onClose }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:1100,background:T.bg,overflowY:"auto",padding:"40px 22px",paddingBottom:"calc(40px + env(safe-area-inset-bottom))"}}>
      <div style={{maxWidth:"420px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"28px"}}>
          <div style={{fontSize:"52px",marginBottom:"14px"}} aria-hidden="true">{"\u{1F389}"}</div>
          <h1 style={{fontSize:"24px",fontWeight:700,letterSpacing:"-.02em",color:T.text,marginBottom:"10px"}}>Ci sono novità</h1>
          <p style={{fontSize:"15px",color:T.textM,lineHeight:1.6}}>Nate dal tuo feedback. Ecco cosa cambia 👇</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {CHANGES.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:"14px",alignItems:"flex-start",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:T.r.l,padding:"16px"}}>
              <div style={{fontSize:"24px",lineHeight:1,flexShrink:0}} aria-hidden="true">{c.emoji}</div>
              <div>
                <div style={{fontSize:"15px",fontWeight:700,color:T.text}}>{c.title}</div>
                <div style={{fontSize:"13.5px",color:T.textD,marginTop:"3px",lineHeight:1.5}}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{marginTop:"26px",width:"100%",background:T.green,border:"none",color:"#fff",borderRadius:T.r.m,fontSize:"16px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",padding:"15px 24px",minHeight:"44px"}}
        >
          Inizia a usarle
        </button>
      </div>
    </div>
  );
}
