export const fmtDate = d => !d ? "\u{2014}" : new Date(d).toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"});
export const daysAgo = d => { if(!d) return null; const td=today(); if(d===td) return "Oggi"; const diff=Math.round((new Date(td)-new Date(d))/864e5); return diff===1?"Ieri":`${diff}g fa`; };
export const daysUntil = d => { if(!d) return null; const td=today(); if(d===td) return "Oggi"; const diff=Math.round((new Date(d)-new Date(td))/864e5); if(diff<0) return `${Math.abs(diff)}g fa`; if(diff===1) return "Domani"; return `Tra ${diff}g`; };
export const addDays = (dateStr, days) => { const d=new Date(dateStr); d.setDate(d.getDate()+days); return d.toISOString().split("T")[0]; };
export const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
export const today = () => new Date().toISOString().split("T")[0];
export const greet = () => { const h=new Date().getHours(); return h<12?"Buongiorno":h<18?"Buon pomeriggio":"Buonasera"; };
// true se la fase ha template ma nessuno attivo (tipo follow-up disattivato dall'utente)
export const isPhaseOff = (templates, phase) => { const t=templates||[]; return t.some(x=>x.phase===phase) && !t.some(x=>x.phase===phase&&x.active!==false); };
export const urlBase64ToUint8Array = b64 => { const pad='='.repeat((4-b64.length%4)%4); const b=(b64+pad).replace(/-/g,'+').replace(/_/g,'/'); const raw=atob(b); return Uint8Array.from([...raw].map(c=>c.charCodeAt(0))); };
// Link d'invio (stessa logica di SendButtons): sceglie il canale e ripiega sui contatti disponibili
export const sendHref = (message, clientPhone, clientEmail, channel) => {
  const digits=String(clientPhone||"").replace(/\D/g,""); const phone=digits.length===10?`39${digits}`:digits;
  const email=String(clientEmail||"").trim(); const body=encodeURIComponent(message||""); const subj=encodeURIComponent("Un messaggio per te"); const ch=channel||"WhatsApp";
  if(ch==="Email"&&email) return `mailto:${email}?subject=${subj}&body=${body}`;
  if(ch==="SMS"&&digits) return `sms:${phone}?&body=${body}`;
  if(digits) return `whatsapp://send?phone=${phone}&text=${body}`;
  if(email) return `mailto:${email}?subject=${subj}&body=${body}`;
  return null;
};
// Apre il link d'invio in modo affidabile anche per schemi custom (whatsapp://) — come un click su <a target=_blank>
export const openSend = href => { if(!href) return; const a=document.createElement("a"); a.href=href; a.target="_blank"; a.rel="noreferrer"; document.body.appendChild(a); a.click(); a.remove(); };
// Messaggio WhatsApp per "Invita cliente": testo caldo, link in fondo (Opzione 1). Col numero apre la sua chat;
// senza numero ripiega sul selettore contatti. Numero locale (10 cifre) -> prefisso 39.
export const inviteWaLink = (phone, link, dateStr) => {
  const digits=String(phone||"").replace(/\D/g,""); const p=digits.length===10?`39${digits}`:digits;
  const quando=dateStr?` del ${fmtDate(dateStr)}`:"";
  const text=encodeURIComponent(`Ciao! \u{1F60A} Per la nostra consulenza${quando} ti ho preparato la scheda: compila i tuoi dati qui, è un minuto \u{1F447}\n${link}\nA presto!`);
  return p?`whatsapp://send?phone=${p}&text=${text}`:`https://wa.me/?text=${text}`;
};
// Ponte calendario leggero: link che pre-compila un evento (giornaliero) su Google Calendar. Zero backend.
// Usato sia in Agenda (appuntamento confermato) sia in Invita cliente (data della consulenza).
export const gcalLink = (date, title, notes="") => {
  const start=String(date||"").replace(/-/g,""); const end=addDays(date,1).replace(/-/g,"");
  const t=encodeURIComponent(title||"Appuntamento");
  const details=encodeURIComponent((notes?notes+"\n\n":"")+"Creato con Sliss");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${t}&dates=${start}/${end}&details=${details}`;
};
