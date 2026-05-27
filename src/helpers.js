export const fmtDate = d => !d ? "\u{2014}" : new Date(d).toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"});
export const daysAgo = d => { if(!d) return null; const diff=Math.floor((Date.now()-new Date(d))/(864e5)); return diff===0?"Oggi":diff===1?"Ieri":`${diff}g fa`; };
export const daysUntil = d => { if(!d) return null; const diff=Math.floor((new Date(d)-Date.now())/(864e5)); if(diff<0) return `${Math.abs(diff)}g fa`; if(diff===0) return "Oggi"; if(diff===1) return "Domani"; return `Tra ${diff}g`; };
export const addDays = (dateStr, days) => { const d=new Date(dateStr); d.setDate(d.getDate()+days); return d.toISOString().split("T")[0]; };
export const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
export const today = () => new Date().toISOString().split("T")[0];
export const greet = () => { const h=new Date().getHours(); return h<12?"Buongiorno":h<18?"Buonasera":"Buonasera"; };
export const urlBase64ToUint8Array = b64 => { const pad='='.repeat((4-b64.length%4)%4); const b=(b64+pad).replace(/-/g,'+').replace(/_/g,'/'); const raw=atob(b); return Uint8Array.from([...raw].map(c=>c.charCodeAt(0))); };
