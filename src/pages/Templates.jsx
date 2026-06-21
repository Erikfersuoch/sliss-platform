import { useState } from "react";
import T from "../theme.js";
import { PHASES, CLUSTER_TEMPLATES } from "../config.js";
import { uid } from "../helpers.js";
import { useSliss } from "../context.js";
import Icon from "../components/Icon.jsx";
import { Badge, Btn, Card, Empty, Tabs, Modal, FormField, PageHeader } from "../components/ui.jsx";

const Templates = () => {
  const {data,update,addRecord,deleteRecord}=useSliss();
  const [filter,setFilter]=useState("all");const [editingId,setEditingId]=useState(null);const [editText,setEditText]=useState("");const [editName,setEditName]=useState("");const [showNew,setShowNew]=useState(false);const [newForm,setNewForm]=useState({name:"",phase:"thankyou",channel:"WhatsApp",text:""});
  const phases=[{id:"all",label:"Tutti"},{id:"thankyou",label:"Ringraziamento"},{id:"check",label:"Controllo"},{id:"review",label:"Recensione"},{id:"reactivation",label:"Riattivazione"}];
  const templates=data?.templates||[];const filtered=templates.filter(t=>filter==="all"||t.phase===filter);
  const startEdit=t=>{setEditingId(t.id);setEditText(t.text);setEditName(t.name);};const saveEdit=id=>{update("templates",id,{text:editText,name:editName});setEditingId(null);};
  const handleAdd=()=>{if(!newForm.name.trim()||!newForm.text.trim())return;addRecord("templates",{...newForm,id:uid(),code:`T${uid().slice(0,4).toUpperCase()}`,active:true});setNewForm({name:"",phase:"thankyou",channel:"WhatsApp",text:""});setShowNew(false);};
  const handlePropagate=()=>{const fus=data?.followUps||[];const clients=data?.clients||[];const toUpdate=fus.filter(f=>f.status==="pending"&&templates.some(t=>t.phase===f.phase));if(!toUpdate.length){alert("Nessun follow-up in attesa da aggiornare.");return;}if(!window.confirm(`Aggiornare i messaggi di ${toUpdate.length} follow-up in attesa?\n\nI follow-up già inviati non saranno modificati.`))return;toUpdate.forEach(fu=>{const tmpl=templates.find(t=>t.phase===fu.phase);if(!tmpl)return;const cl=clients.find(c=>c.id===fu.clientId);const name=cl?.firstName||(cl?.name||"").split(' ')[0]||"";update("followUps",fu.id,{message:tmpl.text.replace(/\[Nome\]/g,name)});});};
  const handleAddBase=()=>{const bizType=data?.settings?.bizType||"servizi";const base=bizType==="prodotti"?CLUSTER_TEMPLATES["altro_p"]:CLUSTER_TEMPLATES["altro_s"];base.forEach(t=>addRecord("templates",{...t,id:uid()}));};
  return (
    <div style={{animation:"fadeIn .35s ease"}}>
      <PageHeader title="Template" action={<div style={{display:"flex",gap:"6px"}}><Btn v="secondary" s="sm" onClick={handlePropagate}>{"\u{21BB}"} Aggiorna follow-up</Btn><Btn s="sm" onClick={()=>setShowNew(true)}>+ Nuovo</Btn></div>} />
      <div style={{marginBottom:"16px"}}><Tabs tabs={phases.map(p=>({...p,count:p.id==="all"?templates.length:templates.filter(t=>t.phase===p.id).length}))} active={filter} onChange={setFilter} /></div>
      {templates.length===0
        ?<Empty icon={<Icon name="file" size={44} color={T.textD} />} title="Nessun template" desc="Aggiungi i template base per iniziare, oppure creane uno personalizzato." action={<Btn onClick={handleAddBase}>+ Template base</Btn>} />
        :filtered.length===0
        ?<Empty icon={<Icon name="clipboard" size={44} color={T.textD} />} title="Nessun template in questa fase" desc="Prova un altro filtro o aggiungine uno nuovo." />
        :<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{filtered.map((tmpl,i)=>{const ph=PHASES[tmpl.phase]||{icon:"file",label:tmpl.phase||"",color:T.textD,bg:T.bg3};const isEditing=editingId===tmpl.id;return (<Card key={tmpl.id} style={{animation:`fadeIn .3s ease ${i*.04}s both`,opacity:tmpl.active===false?0.6:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}><div style={{display:"flex",alignItems:"center",gap:"8px",flex:1,minWidth:0}}><Icon name={ph.icon} size={16} color={ph.color} />{isEditing?<input value={editName} onChange={e=>setEditName(e.target.value)} style={{fontSize:"14px",fontWeight:600,padding:"6px 10px"}} />:<div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tmpl.name}</div><div style={{fontSize:"11px",color:T.textD,marginTop:"1px"}}>{tmpl.channel}</div></div>}</div><div style={{display:"flex",gap:"6px",alignItems:"center",flexShrink:0,marginLeft:"8px"}}><Badge {...ph} s />{isEditing?<><Btn v="success" s="sm" aria="Salva modifiche" onClick={()=>saveEdit(tmpl.id)}>{"\u{2713}"}</Btn><Btn v="ghost" s="sm" aria="Annulla" onClick={()=>setEditingId(null)}>{"\u{2715}"}</Btn></>:<><Btn v="ghost" s="sm" aria="Modifica template" onClick={()=>startEdit(tmpl)}>{"\u{270F}\u{FE0F}"}</Btn><Btn v="danger" s="sm" aria="Elimina template" onClick={()=>{if(window.confirm("Eliminare?"))deleteRecord("templates",tmpl.id);}}>{"\u{1F5D1}\u{FE0F}"}</Btn></>}</div></div>{isEditing?<textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{minHeight:"90px",fontSize:"14px",lineHeight:1.7}} />:<div style={{padding:"12px 14px",background:T.bg3,borderRadius:T.r.m,border:`1px solid ${T.border}`,fontSize:"14px",lineHeight:1.7,color:T.textM,whiteSpace:"pre-wrap"}}>{tmpl.text}</div>}{!isEditing&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"10px"}}><button onClick={()=>update("templates",tmpl.id,{active:tmpl.active===false?true:false})} style={{background:"none",border:`1px solid ${tmpl.active===false?T.border:T.green}`,color:tmpl.active===false?T.textMu:T.green,borderRadius:T.r.m,padding:"7px 14px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",minHeight:"44px"}}>{tmpl.active===false?"○ Disattivato":"● Attivo"}</button><button onClick={()=>navigator.clipboard.writeText(tmpl.text)} style={{background:"none",border:`1px solid ${T.border}`,color:T.textD,borderRadius:T.r.m,padding:"7px 14px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",minHeight:"44px"}}>{"\u{1F4CB}"} Copia</button></div>}</Card>);})}</div>
      }
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuovo template">
        <FormField label="Nome"><input value={newForm.name} onChange={e=>setNewForm(p=>({...p,name:e.target.value}))} placeholder="Es. Ringraziamento personalizzato" /></FormField>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}><FormField label="Fase"><select value={newForm.phase} onChange={e=>setNewForm(p=>({...p,phase:e.target.value}))}><option value="thankyou">Ringraziamento</option><option value="check">Controllo</option><option value="review">Recensione</option><option value="reactivation">Riattivazione</option></select></FormField><FormField label="Metodo di contatto"><select value={newForm.channel} onChange={e=>setNewForm(p=>({...p,channel:e.target.value}))}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField></div>
        <FormField label="Testo" hint="Usa [Nome] come segnaposto."><textarea value={newForm.text} onChange={e=>setNewForm(p=>({...p,text:e.target.value}))} placeholder="Ciao [Nome]! ..." style={{minHeight:"100px"}} /></FormField>
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowNew(false)}>Annulla</Btn><Btn onClick={handleAdd} disabled={!newForm.name.trim()||!newForm.text.trim()}>Salva</Btn></div>
      </Modal>
    </div>
  );
};

export default Templates;
