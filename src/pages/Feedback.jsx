import T from "../theme.js";
import { fmtDate, daysAgo } from "../helpers.js";
import { useSliss } from "../context.js";
import { Badge, Card, Empty, SendButtons, PageHeader } from "../components/ui.jsx";

const Feedback = () => {
  const {data}=useSliss();const feedbacks=data?.feedbacks||[];const clients=data?.clients||[];const reviewLink=data.settings?.reviewLink||"";
  const clientsWithFeedback=new Set(feedbacks.map(f=>f.clientId));const clientsWithout=clients.filter(c=>!clientsWithFeedback.has(c.id)&&(c.status==="active"||c.status==="vip"||c.status==="new"));
  const reviewMsg=name=>`Ciao ${name}! Spero tu sia rimasto/a soddisfatto/a \u{1F64F} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. ${reviewLink}`.trim();
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Feedback" action={reviewLink&&<a href={reviewLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:T.bg2,color:T.textM,border:`1px solid ${T.border}`,borderRadius:T.r.m,fontSize:"13px",fontWeight:600,textDecoration:"none",minHeight:"44px"}}>{"⭐ Vedi recensioni"}</a>} />
      {clientsWithout.length>0&&<Card style={{marginBottom:"16px"}}><h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px"}}>Richiedi recensione <span style={{fontSize:"12px",fontWeight:400,color:T.textD,marginLeft:"4px"}}>{clientsWithout.length} clienti</span></h2><div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{clientsWithout.map(cl=>(<div key={cl.id} style={{padding:"12px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`}}><div style={{fontWeight:600,fontSize:"14px",marginBottom:"3px"}}>{cl.name}</div><div style={{fontSize:"12px",color:T.textD,marginBottom:"10px"}}>{cl.channel} · {daysAgo(cl.lastVisit)}</div><SendButtons message={reviewMsg(cl.name)} clientPhone={cl.phone} clientEmail={cl.email} channel={cl.channel} /></div>))}</div></Card>}
      <h2 style={{fontSize:"15px",fontWeight:700,marginBottom:"12px",color:T.textM}}>Ricevuti</h2>
      {!feedbacks.length ? <Empty icon={"\u{2B50}"} title="Nessun feedback" desc="Appariranno qui quando i clienti risponderanno." /> : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{feedbacks.map((fb,i)=>{const cl=clients.find(c=>c.id===fb.clientId);return (<Card key={fb.id} style={{animation:`fadeIn .3s ease ${i*.05}s both`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontWeight:600,fontSize:"14px",marginBottom:"5px"}}>{cl?.name||"\u{2014}"}</div><div style={{fontSize:"17px",marginBottom:"7px"}}>{"\u{2B50}".repeat(fb.rating)}{"\u{2606}".repeat(5-fb.rating)}</div>{fb.comment&&<div style={{fontSize:"13px",color:T.textM,lineHeight:1.6,fontStyle:"italic"}}>"{fb.comment}"</div>}</div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:"11px",color:T.textD,marginBottom:"5px"}}>{fmtDate(fb.date)}</div>{fb.wouldRecommend&&<Badge label="Consiglia" color={T.green} bg={T.greenS} s />}</div></div></Card>);})}</div>}
    </div>
  );
};

export default Feedback;
