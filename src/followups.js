import { fmtDate, addDays, uid } from "./helpers.js";

const tplMessage = (templates, phase, clientName, fallback, date, extras) => {
  const t = (templates||[]).find(t => t.phase===phase && t.active!==false);
  let txt = t ? t.text : fallback;
  txt = (txt||"").replace(/\[Nome\]/g, clientName||"");
  if (date) txt = txt.replace(/\[Data\]/g, fmtDate(date));
  if (extras?.service) txt = txt.replace(/\[Servizio\]/g, extras.service);
  if (extras?.time) txt = txt.replace(/\[Ora\]/g, extras.time);
  return txt;
};

const buildProductFollowUps = (orderId, clientId, clientName, orderDate, estimatedDelivery, templates) => {
  const deliveryDate = estimatedDelivery || addDays(orderDate, 7);
  return [
    {id:uid(),orderId,clientId,phase:"order_confirm",status:"pending",scheduledDate:orderDate,sentDate:null,message:`Ciao ${clientName}! Ho ricevuto il tuo ordine, grazie mille \u{1F64F} Lo sto preparando con cura. Ti avviso non appena \u{e8} in partenza!`},
    {id:uid(),orderId,clientId,phase:"shipping",status:"pending",scheduledDate:null,sentDate:null,message:`Ciao ${clientName}! Il tuo ordine \u{e8} in partenza oggi \u{1F4E6} Arrivo stimato: ${fmtDate(deliveryDate)}. Per qualsiasi cosa sono qui!`,awaitShipping:true},
    {id:uid(),orderId,clientId,phase:"delivery_check",status:"pending",scheduledDate:addDays(deliveryDate,3),sentDate:null,message:`Ciao ${clientName}! \u{C8} arrivato tutto bene? Spero che il prodotto ti piaccia \u{1F64F} Se c'\u{e8} qualcosa che non va, scrivimi subito.`},
    {id:uid(),orderId,clientId,phase:"review",status:"pending",scheduledDate:addDays(deliveryDate,14),sentDate:null,message:`Ciao ${clientName}! Spero che stia usando il prodotto con soddisfazione \u{2728} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!`},
    {id:uid(),orderId,clientId,phase:"reorder",status:"pending",scheduledDate:addDays(deliveryDate,60),sentDate:null,message:`Ciao ${clientName}! Sono passati un po' di mesi \u{2014} se hai bisogno di riordinare o vuoi scoprire qualcosa di nuovo, sono qui \u{1F64F}`},
  ].map(fu => ({...fu, message: tplMessage(templates, fu.phase, clientName, fu.message, deliveryDate)})).filter(fu=>{const t=(templates||[]).find(t=>t.phase===fu.phase);return !t||t.active!==false;});
};

const buildFollowUps=(apptId,clientId,clientName,apptDate,serviceType,timings,templates,apptTime)=>{
  const tm={thankyou:timings.thankyou||0,check:timings.check||7,review:timings.review||21,reactivation:timings.reactivation||60};
  const timeStr=apptTime?` alle ${apptTime}`:"";
  const confirmMsg=`Ciao ${clientName}! Confermato \u{1F5A4} Ti aspetto il ${fmtDate(apptDate)}${timeStr} per ${serviceType||"l'appuntamento"}. Per qualsiasi cosa scrivimi!`;
  const msgs={thankyou:serviceType==="Ritocco"?`Ciao ${clientName}! Grazie per il ritocco di oggi \u{1F64F} Scrivimi per qualsiasi cosa.`:`Ciao ${clientName}! Grazie per oggi \u{1F5A4} Ricordati pellicola e sapone neutro. Scrivimi se hai dubbi.`,check:`Ciao ${clientName}! Come sta andando? \u{C8} normale che desquami un po'. Se hai dubbi mandami una foto \u{1F64F}`,review:`Ciao ${clientName}! Sono passate un po' di settimane \u{2728} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo.`,reactivation:`Ciao ${clientName}! Pensavo a te \u{2014} come stai? Se hai in mente qualcosa di nuovo, sono qui \u{1F5A4}`};
  const extras={service:serviceType||"",time:apptTime||""};
  const confirmFu={id:uid(),appointmentId:apptId,clientId,phase:"confirm",status:"pending",scheduledDate:apptDate,sentDate:null,satisfaction:null,message:tplMessage(templates,"confirm",clientName,confirmMsg,apptDate,extras)};
  const rest=["thankyou","check","review","reactivation"].filter(phase=>{const t=(templates||[]).find(t=>t.phase===phase);return !t||t.active!==false;}).map(phase=>({id:uid(),appointmentId:apptId,clientId,phase,status:"pending",scheduledDate:addDays(apptDate,tm[phase]),sentDate:null,satisfaction:null,message:tplMessage(templates,phase,clientName,msgs[phase])}));
  const confirmActive=(()=>{const t=(templates||[]).find(t=>t.phase==="confirm");return !t||t.active!==false;})();
  return confirmActive?[confirmFu,...rest]:rest;
};

export { tplMessage, buildFollowUps, buildProductFollowUps };
