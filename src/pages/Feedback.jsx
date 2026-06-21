import T from "../theme.js";
import { daysAgo } from "../helpers.js";
import { useSliss } from "../context.js";
import { Btn, Card, Empty, SendButtons, PageHeader } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";

// Le recensioni vivono su Google: Sliss non le duplica (la vecchia lista "Ricevuti" era
// codice morto, mai popolata). Questa pagina serve solo a CHIEDERLE con un tap e a rimandare
// alle recensioni reali. Si attiva solo se il titolare ha messo il link recensioni.
const Feedback = ({setView}) => {
  const {data}=useSliss();
  const clients=data?.clients||[];
  const reviewLink=data.settings?.reviewLink||"";
  const askable=clients.filter(c=>c.status==="active"||c.status==="vip"||c.status==="new");
  const reviewMsg=name=>`Ciao ${name}! Spero tu sia rimasto/a soddisfatto/a \u{1F64F} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. ${reviewLink}`.trim();

  if(!reviewLink) return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Feedback" />
      <Empty icon={<Icon name="star" size={44} color={T.textD} />} title="Attiva le recensioni" desc="Aggiungi il link delle tue recensioni Google: poi potrai chiederle ai clienti con un tap, dalla loro scheda e da qui." action={<Btn onClick={()=>setView&&setView("settings")}>Aggiungi il link in Impostazioni</Btn>} />
    </div>
  );

  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Feedback" action={<a href={reviewLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:T.bg2,color:T.textM,border:`1px solid ${T.border}`,borderRadius:T.r.m,fontSize:"13px",fontWeight:600,textDecoration:"none",minHeight:"44px"}}><Icon name="star" size={15} />Vedi su Google</a>} />
      <p style={{fontSize:"13px",color:T.textD,marginBottom:"16px",lineHeight:1.55}}>Le recensioni vivono su Google. Da qui le chiedi ai tuoi clienti con un tap.</p>
      {askable.length>0
        ? <Card>
            <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>Richiedi una recensione <span style={{fontSize:"12px",fontWeight:400,color:T.textD,marginLeft:"4px"}}>{askable.length} clienti</span></h2>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{askable.map(cl=>(
              <div key={cl.id} style={{padding:"12px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}>
                <div style={{fontWeight:600,fontSize:"14px",marginBottom:"3px"}}>{cl.name}</div>
                <div style={{fontSize:"12px",color:T.textD,marginBottom:"10px"}}>{cl.channel} · {daysAgo(cl.lastVisit)}</div>
                <SendButtons message={reviewMsg(cl.name)} clientPhone={cl.phone} clientEmail={cl.email} channel={cl.channel} />
              </div>
            ))}</div>
          </Card>
        : <Empty icon={<Icon name="users" size={44} color={T.textD} />} title="Nessun cliente a cui chiedere" desc="Aggiungi un cliente: da qui potrai invitarlo a lasciarti una recensione su Google." action={<Btn onClick={()=>setView&&setView("clients")}>+ Aggiungi un cliente</Btn>} />
      }
    </div>
  );
};

export default Feedback;
