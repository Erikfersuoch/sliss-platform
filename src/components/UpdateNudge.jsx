import T from "../theme.js";

// Schermata mostrata quando il tester apre la notifica "ci sono novità" (?goto=novita).
// Changelog leggibile delle ultime modifiche nate dal feedback dei tester.
// AGGIORNARE A OGNI RELEASE: lascia solo le novità dell'ultimo aggiornamento.
const CHANGES = [
  { emoji: "\u{1F517}", title: "\"Invita cliente\" — più chiaro", desc: "Per far entrare un cliente nuovo col link ora c'è un tasto dedicato \u{201C}Invita cliente\u{201D}, sia in Agenda sia in Clienti. Niente più dubbio su quale tasto premere." },
  { emoji: "\u{1F4AC}", title: "Messaggio più curato", desc: "Il link che mandi al cliente arriva dentro un messaggio caldo e ordinato, non più come un link spoglio." },
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
        {/* Blocco periodo di convalida — RIMUOVERE dopo il gate del 21/06 */}
        <div style={{marginTop:"18px",background:T.greenS,border:`1px solid color-mix(in srgb, ${T.green} 20%, transparent)`,borderRadius:T.r.l,padding:"18px"}}>
          <div style={{fontSize:"15px",fontWeight:700,color:T.greenH,marginBottom:"7px"}}>{"\u{23F3} Ora tocca a te"}</div>
          <p style={{fontSize:"13.5px",color:T.textM,lineHeight:1.65}}>Con questo workflow più chiaro è iniziato il periodo di prova vero. Per capire insieme se Sliss ti serve davvero ho bisogno che lo usi con costanza in questi giorni: aggiungi i clienti, manda i follow-up, fallo entrare nel tuo lavoro di tutti i giorni. Il tuo uso reale è quello che conta di più.</p>
        </div>
        <button
          onClick={onClose}
          style={{marginTop:"22px",width:"100%",background:T.green,border:"none",color:"#fff",borderRadius:T.r.m,fontSize:"16px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",padding:"15px 24px",minHeight:"44px"}}
        >
          Ci sono, parto
        </button>
      </div>
    </div>
  );
}
