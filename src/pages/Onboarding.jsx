import { useState } from "react";
import T from "../theme.js";
import { setOnboarded } from "../storage.js";
import { CLUSTERS_SERVIZI, CLUSTERS_PRODOTTI, CLUSTER_TEMPLATES } from "../config.js";
import { uid } from "../helpers.js";
import { useSliss } from "../context.js";
import SlissLogo from "../components/SlissLogo.jsx";
import { Btn } from "../components/ui.jsx";
import { subscribeToPush } from "../push.js";

const Onboarding = ({onComplete}) => {
  const {updateSettings, addRecord} = useSliss();
  const [step, setStep] = useState(0);
  const [bName, setBName] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [bizType, setBizType] = useState("");
  const [cluster, setCluster] = useState("");
  const [customSector, setCustomSector] = useState("");
  const clustersForType = bizType === "prodotti" ? CLUSTERS_PRODOTTI : CLUSTERS_SERVIZI;
  const isCustomCluster = cluster === "altro_s" || cluster === "altro_p";
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;
  const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS/.test(navigator.userAgent);
  const needsPWAStep = isIOS && !isStandalone;
  const needsSafariSwitch = needsPWAStep && !isSafari;
  // Salva dati e segna come onboardato — chiamato allo step 4 prima dello step Safari
  const saveProgress = () => {
    const updates = {businessName:bName.trim(),bizType,cluster,customSector:isCustomCluster?customSector:"",reviewLink:reviewLink.trim()};
    updateSettings(updates);
    if(bizType==="servizi"&&cluster&&CLUSTER_TEMPLATES[cluster]) CLUSTER_TEMPLATES[cluster].forEach(t=>addRecord("templates",{...t,id:uid()}));
    if(bizType==="prodotti") {
      const tpls = CLUSTER_TEMPLATES[cluster] || CLUSTER_TEMPLATES["altro_p"];
      if(tpls) tpls.forEach(t=>addRecord("templates",{...t,id:uid()}));
    }
    setOnboarded();
  };

  const doComplete = () => { saveProgress(); onComplete(); };

  const requestAndSubscribe = async () => {
    try { await subscribeToPush(); } catch(e) { console.error(e); }
    onComplete();
  };
  const renderStep = () => {
    switch(step) {
      case 0: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F44B}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Benvenuto in Sliss</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"24px"}}>Cura i tuoi clienti come meritano e riprenditi il tempo: basta gestirli a mano, uno per uno. Tu pensi al mestiere, Sliss tiene il filo con i clienti.</p>
        <Btn onClick={()=>setStep(1)} style={{width:"100%",justifyContent:"center"}}>{"Inizia \u{2192}"}</Btn>
      </>;
      case 1: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F4BC}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Come si chiama la tua attività?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Apparirà nel saluto della home. Potrai cambiarlo nelle impostazioni.</p>
        <input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" aria-label="Nome della tua attività" style={{fontSize:"18px",padding:"14px 16px",textAlign:"center",marginBottom:"16px"}} autoFocus />
        <div style={{marginBottom:"20px",textAlign:"left"}}>
          <label style={{fontSize:"12px",color:T.textD,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:"7px"}}>Link Google Reviews <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(opzionale)</span></label>
          <input value={reviewLink} onChange={e=>setReviewLink(e.target.value)} placeholder="https://g.page/r/..." aria-label="Link Google Reviews (opzionale)" style={{fontSize:"14px"}} />
        </div>
        <Btn onClick={()=>setStep(2)} disabled={!bName.trim()} style={{width:"100%",justifyContent:"center"}}>{"Avanti \u{2192}"}</Btn>
      </>;
      case 2: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F3AF}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Come lavori?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Sliss si adatta al tuo tipo di attività.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {[{key:"servizi",icon:"\u{1F5D3}\u{FE0F}",label:"Offro servizi con appuntamento",desc:"Tatuaggi, barber, estetica, officine..."},{key:"prodotti",icon:"\u{1F4E6}",label:"Vendo prodotti",desc:"Stampa 3D, negozio, prodotti artigianali..."}].map(opt=>(
            <button key={opt.key} onClick={()=>{setBizType(opt.key);setCluster("");setCustomSector("");setStep(3);}} style={{display:"flex",alignItems:"center",gap:"14px",padding:"16px 18px",background:T.bg2,border:`1.5px solid ${T.border}`,borderRadius:T.r.l,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:"26px"}}>{opt.icon}</span>
              <div><div style={{fontSize:"15px",fontWeight:500,color:T.text}}>{opt.label}</div><div style={{fontSize:"12px",color:T.textD,marginTop:"2px"}}>{opt.desc}</div></div>
            </button>
          ))}
        </div>
      </>;
      case 3: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F3F7}\u{FE0F}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>In quale settore lavori?</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Sliss adatterà i template al tuo settore.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:isCustomCluster?"16px":"0"}}>
          {Object.entries(clustersForType).map(([key,cl])=>(
            <button key={key} onClick={()=>{setCustomSector("");setCluster(key);if(key!=="altro_s"&&key!=="altro_p")setStep(4);}} style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 18px",background:cluster===key?T.greenS:T.bg2,border:`1.5px solid ${cluster===key?T.green:T.border}`,borderRadius:T.r.l,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:"22px"}}>{cl.icon}</span>
              <span style={{fontSize:"15px",fontWeight:cluster===key?600:400,color:cluster===key?T.green:T.text}}>{cl.label}</span>
            </button>
          ))}
        </div>
        {isCustomCluster&&<>
          <input value={customSector} onChange={e=>setCustomSector(e.target.value)} placeholder="Descrivi il tuo settore..." aria-label="Descrizione del tuo settore" style={{fontSize:"15px",margin:"0 0 20px"}} autoFocus />
          <Btn onClick={()=>setStep(4)} disabled={!customSector.trim()} style={{width:"100%",justifyContent:"center"}}>{"Avanti \u{2192}"}</Btn>
        </>}
      </>;
      case 4: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F9E9}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>I moduli di Sliss</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"18px"}}>Sliss segue il cliente in più fasi del rapporto. Oggi è attivo il primo modulo; gli altri arriveranno.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"8px",justifyContent:"center",marginBottom:"24px"}}>
          <span style={{fontSize:"13px",fontWeight:600,padding:"7px 13px",borderRadius:"999px",background:T.greenS,color:T.green,border:`1px solid ${T.green}`}}>{"\u{25CF}"} Follow-Up · attivo</span>
          {["Richieste","Recensioni","Riattivazione"].map(m=><span key={m} style={{fontSize:"13px",fontWeight:600,padding:"7px 13px",borderRadius:"999px",background:T.bg3,color:T.textMu,border:`1px dashed ${T.border}`}}>{m} · presto</span>)}
        </div>
        <Btn onClick={()=>setStep(5)} style={{width:"100%",justifyContent:"center"}}>{"Avanti \u{2192}"}</Btn>
      </>;
      case 5: return <>
        <div style={{fontSize:"52px",marginBottom:"20px"}}>{"\u{1F4AC}"}</div>
        <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Il tuo primo modulo: Follow-Up</h1>
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"16px"}}>I follow-up sono i messaggi di cortesia che mandi al cliente <b>dopo</b>: il grazie, un controllo, l'invito a una recensione, un promemoria per tornare. Sliss te li ricorda e te li scrive già pronti: oggi li invii con un tap, in futuro li manderà in automatico.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"18px"}}>
          {(bizType==="prodotti"?["Aggiungi un cliente","Inserisci un ordine","Sliss prepara i messaggi per te"]:["Aggiungi un cliente","Inserisci un appuntamento","Sliss prepara i messaggi per te"]).map((st,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",background:T.bg2,borderRadius:T.r.l,border:`1px solid ${T.border}`,textAlign:"left"}}>
              <div style={{width:"26px",height:"26px",borderRadius:"50%",background:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:"14px",color:T.textM}}>{st}</span>
            </div>
          ))}
        </div>
        <p style={{fontSize:"13px",color:T.textD,marginBottom:"20px",display:"flex",alignItems:"center",gap:"7px",justifyContent:"center"}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"18px",height:"18px",borderRadius:"50%",background:T.blueS,color:T.blue,fontSize:"12px",fontWeight:700,flexShrink:0}}>i</span> Se qualcosa non è chiaro, tocca la "i" nell'app.</p>
        <Btn onClick={needsPWAStep?()=>{saveProgress();setStep(6);}:doComplete} style={{width:"100%",justifyContent:"center"}}>{needsPWAStep?"Avanti \u{2192}":"Apri Sliss \u{2192}"}</Btn>
      </>;
      case 6: return <>
        {needsSafariSwitch ? <>
          <div style={{fontSize:"52px",marginBottom:"20px"}}>{"🌐"}</div>
          <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Apri Sliss con Safari</h1>
          <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"24px"}}>Le notifiche push su iPhone funzionano solo da Safari, non da Chrome.</p>
          <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:T.r.l,padding:"16px",marginBottom:"24px",textAlign:"left"}}>
            <div style={{fontSize:"13px",color:T.textM,marginBottom:"10px",fontWeight:600}}>Copia il link e aprilo in Safari:</div>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <div style={{flex:1,fontSize:"13px",padding:"10px 12px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.r.l,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>sliss-platform.vercel.app</div>
              <Btn onClick={()=>navigator.clipboard?.writeText("https://sliss-platform.vercel.app")} style={{padding:"10px 14px",fontSize:"13px",flexShrink:0}}>Copia</Btn>
            </div>
          </div>
          <button onClick={doComplete} style={{fontSize:"14px",color:T.textD,background:"none",border:"none",cursor:"pointer",padding:"8px",width:"100%"}}>Salta per ora</button>
        </> : <>
          <div style={{fontSize:"52px",marginBottom:"20px"}}>{"📲"}</div>
          <h1 style={{fontSize:"24px",fontWeight:700,marginBottom:"12px",letterSpacing:"-.02em"}}>Installa Sliss sul tuo iPhone</h1>
          <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Per ricevere i reminder, aggiungi Sliss alla schermata Home.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"24px"}}>
            {[
              {n:1,txt:<>Tocca <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,background:T.greenS,border:`1px solid ${T.green}`,borderRadius:"5px",margin:"0 3px",verticalAlign:"middle"}}><svg width="11" height="13" viewBox="0 0 11 13" fill="none"><path d="M5.5 1v7M2.5 4l3-3 3 3" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="0.9" y="7.5" width="9.2" height="4.6" rx="1.5" stroke="#16A34A" strokeWidth="1.8"/></svg></span> in basso su Safari</>},
              {n:2,txt:'"Aggiungi a schermata Home"'},
              {n:3,txt:'"Aggiungi" in alto a destra'},
            ].map(({n,txt})=>(
              <div key={n} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",background:T.bg2,borderRadius:T.r.l,border:`1px solid ${T.border}`,textAlign:"left"}}>
                <div style={{width:"26px",height:"26px",borderRadius:"50%",background:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0}}>{n}</div>
                <span style={{fontSize:"14px",color:T.textM,lineHeight:1.5}}>{txt}</span>
              </div>
            ))}
          </div>
          <Btn onClick={requestAndSubscribe} style={{width:"100%",justifyContent:"center",marginBottom:"12px"}}>{"Ho installato, inizia \u{2192}"}</Btn>
          <button onClick={doComplete} style={{fontSize:"14px",color:T.textD,background:"none",border:"none",cursor:"pointer",padding:"8px",width:"100%"}}>Salta per ora</button>
        </>}
      </>;
      default: return null;
    }
  };
  return (
    <div translate="no" lang="it" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",background:T.bg,animation:"fadeIn .5s ease"}}>
      <div style={{width:"100%",maxWidth:"400px",textAlign:"center"}}>
        <div style={{marginBottom:"20px"}}><SlissLogo size={32} /></div>
        {renderStep()}
        <div style={{display:"flex",gap:"6px",justifyContent:"center",marginTop:"28px"}}>
          {Array.from({length:needsPWAStep?7:6},(_,i)=><div key={i} style={{width:i===step?20:6,height:"6px",borderRadius:"3px",background:i===step?T.green:T.border,transition:"all .3s"}} />)}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
