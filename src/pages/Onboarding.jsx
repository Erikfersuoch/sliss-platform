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
  // Salva dati e segna come onboardato — chiamato allo step "aha" prima dell'eventuale step install
  const saveProgress = () => {
    const updates = {businessName:bName.trim(),bizType,cluster,customSector:isCustomCluster?customSector:""};
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
  // Messaggi reali del settore scelto per la schermata "aha" (mostra invece di spiegare)
  const ahaMessages = () => {
    const tpls = CLUSTER_TEMPLATES[cluster] || CLUSTER_TEMPLATES[bizType==="prodotti"?"altro_p":"altro_s"] || [];
    const labels = ["Appena finite", "Qualche giorno dopo", "Più avanti"];
    return tpls.slice(0,3).map((t,i)=>({label:labels[i]||"Più avanti", text:t.text.replace(/\[Nome\]/g,"Sara").replace(/\[Data\]/g,"").trim()}));
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
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Apparirà nel saluto della home. Potrai cambiarlo quando vuoi.</p>
        <input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Es. Momo Ink" aria-label="Nome della tua attività" style={{fontSize:"18px",padding:"14px 16px",textAlign:"center",marginBottom:"20px"}} autoFocus />
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
        <p style={{fontSize:"15px",color:T.textM,lineHeight:1.7,marginBottom:"20px"}}>Sliss adatterà i messaggi al tuo settore.</p>
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
      case 4: {
        const msgs = ahaMessages();
        return <>
          <h1 style={{fontSize:"23px",fontWeight:700,marginBottom:"8px",letterSpacing:"-.02em",marginTop:"4px"}}>Ecco cosa farà Sliss per te</h1>
          <p style={{fontSize:"14px",color:T.textM,lineHeight:1.6,marginBottom:"16px"}}>Dopo ogni cliente, tiene il filo al posto tuo, al momento giusto.</p>
          <div style={{width:"100%",background:"#EAE6DF",borderRadius:"16px",padding:"10px 9px",border:`1px solid ${T.border}`,textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"4px 4px 10px"}}>
              <div style={{width:"26px",height:"26px",borderRadius:"50%",background:T.teal,color:"#fff",fontSize:"12px",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>S</div>
              <div><div style={{fontSize:"12.5px",fontWeight:600,color:"#0b3d2e",lineHeight:1.2}}>Sara · cliente</div><div style={{fontSize:"10px",color:"#3a6b58"}}>WhatsApp</div></div>
            </div>
            {msgs.map((m,i)=>(
              <div key={i}>
                <div style={{display:"flex",justifyContent:"center",margin:"6px 0"}}><span style={{fontSize:"9.5px",fontWeight:600,color:"#5b6b63",background:"#f4efe7",borderRadius:"7px",padding:"2px 10px"}}>{m.label}</span></div>
                <div style={{background:"#d9fdd3",borderRadius:"9px 9px 2px 9px",padding:"7px 10px 5px",margin:"0 2px 5px auto",maxWidth:"90%",boxShadow:"0 1px 0 rgba(0,0,0,.04)"}}>
                  <p style={{fontSize:"12px",color:"#0b1f18",lineHeight:1.45}}>{m.text}</p>
                  <div style={{fontSize:"9px",color:"#34a853",textAlign:"right",marginTop:"2px",fontWeight:700}}>{i===0?"\u{2713}\u{2713} inviato con 1 tap":"\u{2713}\u{2713}"}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{fontSize:"13px",color:T.textM,lineHeight:1.5,margin:"14px 0 4px"}}>Lo scrive <b style={{color:T.green}}>Sliss</b>, lo invii <b style={{color:T.green}}>tu</b> con un tap.<br/>In futuro partirà in automatico.</p>
          <p style={{fontSize:"11px",color:T.textMu,marginBottom:"18px"}}>Presto anche: Richieste · Recensioni · Riattivazione</p>
          <Btn onClick={needsPWAStep?()=>{saveProgress();setStep(5);}:doComplete} style={{width:"100%",justifyContent:"center"}}>{needsPWAStep?"Iniziamo \u{2192}":"Apri Sliss \u{2192}"}</Btn>
        </>;
      }
      case 5: return <>
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
          {Array.from({length:needsPWAStep?6:5},(_,i)=><div key={i} style={{width:i===step?20:6,height:"6px",borderRadius:"3px",background:i===step?T.green:T.border,transition:"all .3s"}} />)}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
