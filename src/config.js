import T from "./theme.js";

// Numero WhatsApp del founder (Erik) — usato dalla schermata feedback dei tester.
// Formato internazionale senza + né spazi (es. 39347xxxxxxx). Vuoto = apre WhatsApp senza chat.
export const FOUNDER_WA = "393316351951";

export const PHASES = {
  confirm:       { label: "Conferma",       color: T.green,  icon: "check",     bg: T.greenS },
  thankyou:      { label: "Ringraziamento", color: T.blue,   icon: "heart",     bg: T.blueS },
  check:         { label: "Controllo",      color: T.amberD, icon: "check",     bg: T.amberS },
  review:        { label: "Recensione",     color: T.purple, icon: "star",      bg: T.purpleS },
  reactivation:  { label: "Riattivazione",  color: T.greenH, icon: "rotate",    bg: T.greenS },
  order_confirm: { label: "Conferma ordine", color: T.blue,   icon: "clipboard", bg: T.blueS },
  shipping:      { label: "In spedizione",   color: T.amberD, icon: "truck",     bg: T.amberS },
  delivery_check:{ label: "Ricezione",       color: T.tealD,  icon: "check",     bg: T.tealS },
  reorder:       { label: "Riordino",        color: T.greenH, icon: "rotate",    bg: T.greenS },
};

export const PRODUCT_PHASES = {
  order_confirm: { label: "Conferma ordine", color: T.blue,   icon: "clipboard", bg: T.blueS },
  shipping:      { label: "In spedizione",   color: T.amberD, icon: "truck",     bg: T.amberS },
  delivery_check:{ label: "Ricezione",       color: T.tealD,  icon: "check",     bg: T.tealS },
  review:        { label: "Recensione",      color: T.purple, icon: "star",      bg: T.purpleS },
  reorder:       { label: "Riordino",        color: T.greenH, icon: "rotate",    bg: T.greenS },
};

export const STATUSES = {
  pending:   { label: "In attesa",  color: T.amberD, bg: T.amberS },
  sent:      { label: "Inviato",    color: T.greenH, bg: T.greenS },
  replied:   { label: "Risposto",   color: T.blue,   bg: T.blueS },
  completed: { label: "Completato", color: T.textD,  bg: "rgba(90,111,148,0.10)" },
  skipped:   { label: "Saltato",    color: T.textMu, bg: "rgba(61,81,120,0.08)" },
};

export const CLIENT_ST = {
  new:           { label: "Nuovo",         color: T.blue,   bg: T.blueS },
  active:        { label: "Attivo",        color: T.greenH, bg: T.greenS },
  vip:           { label: "VIP",           color: T.purple, bg: T.purpleS },
  to_reactivate: { label: "Da riattivare", color: T.amberD, bg: T.amberS },
  inactive:      { label: "Inattivo",      color: T.textD,  bg: "rgba(90,111,148,0.10)" },
};

export const CLUSTERS_SERVIZI = {
  tattoo:    { label: "Tatuaggi / PMU",        icon: "\u{1F5A4}", color: T.purple, serviceTypes: ["Sessione","Ritocco","Flash","Consulenza","Copertura","PMU"] },
  barber:    { label: "Barber / Parrucchiere", icon: "\u{1F488}", color: T.blue,   serviceTypes: ["Taglio","Barba","Taglio + Barba","Colore","Trattamento"] },
  beauty:    { label: "Estetiste / Beauty",    icon: "\u{2728}", color: T.teal,   serviceTypes: ["Pulizia viso","Massaggio","Ceretta","Semipermanente","Manicure"] },
  officine:  { label: "Officine",              icon: "\u{1F527}", color: T.green,  serviceTypes: ["Tagliando","Revisione","Riparazione","Cambio gomme","Controllo"] },
  artigiani: { label: "Artigiani / Edilizia",  icon: "\u{1F528}", color: T.amber,  serviceTypes: ["Sopralluogo","Lavoro","Installazione","Manutenzione","Preventivo"] },
  altro_s:   { label: "Altro",                 icon: "\u{26A1}", color: T.textM,  serviceTypes: ["Appuntamento","Consulenza","Servizio","Sessione"], custom: true },
};

export const CLUSTERS_PRODOTTI = {
  stampa3d:  { label: "Stampa 3D",             icon: "\u{1F5A8}\u{FE0F}", color: T.blue },
  negozio:   { label: "Proprietario negozio",  icon: "\u{1F3EA}", color: T.amber },
  altro_p:   { label: "Altro",                 icon: "\u{26A1}", color: T.textM, custom: true },
};

export const CLUSTERS = {...CLUSTERS_SERVIZI, ...CLUSTERS_PRODOTTI};

export const CLUSTER_TEMPLATES = {
  tattoo: [
    { id:"t0", name:"Conferma appuntamento", code:"CF1", phase:"confirm", channel:"WhatsApp", text:"Ciao [Nome]! Confermato 🖤 Ti aspetto [Data] per [Servizio]. Per qualsiasi cosa scrivimi!", active:true },
    { id:"t1", name:"Ringraziamento sessione", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per la sessione di oggi \u{1F5A4} Ricordati pellicola e sapone neutro per i primi giorni. Scrivimi per qualsiasi cosa.", active:true },
    { id:"t2", name:"Controllo cicatrizzazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Come sta andando la cicatrizzazione? \u{C8} normale che desquami un po' \u{2014} se hai dubbi mandami una foto \u{1F64F}", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero stia guarendo bene \u{2728} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Pensavo a te \u{2014} hai in mente qualcosa di nuovo? Sono qui \u{1F5A4} Buona giornata!", active:true },
  ],
  barber: [
    { id:"t0", name:"Conferma appuntamento", code:"CF1", phase:"confirm", channel:"WhatsApp", text:"Ciao [Nome]! Confermato 🖤 Ti aspetto [Data] per [Servizio]. Per qualsiasi cosa scrivimi!", active:true },
    { id:"t1", name:"Ringraziamento taglio", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie del passaggio oggi \u{1F488} Spero ti piaccia il risultato. Quando vuoi tornare, sai dove trovarmi!", active:true },
    { id:"t2", name:"Controllo soddisfazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Tutto ok con il taglio? Se vuoi una sistemata o vuoi prenotare il prossimo, sono qui \u{1F488}", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero ti stia piacendo il risultato \u{1F64F} Se hai un minuto, una recensione su Google mi aiuterebbe tanto. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! \u{C8} un po' che non ti vedo \u{1F488} Tutto bene? Quando vuoi passare, sono qui!", active:true },
  ],
  beauty: [
    { id:"t0", name:"Conferma appuntamento", code:"CF1", phase:"confirm", channel:"WhatsApp", text:"Ciao [Nome]! Confermato 🖤 Ti aspetto [Data] per [Servizio]. Per qualsiasi cosa scrivimi!", active:true },
    { id:"t1", name:"Ringraziamento trattamento", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per essere passata oggi \u{2728} Spero ti sia piaciuto il trattamento. Per consigli scrivimi. A presto!", active:true },
    { id:"t2", name:"Controllo risultato", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Come ti stai trovando dopo il trattamento? Tutto ok? Sono qui per qualsiasi domanda \u{1F64F}", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero stia ancora piacendoti il risultato \u{2728} Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Pensavo a te \u{2014} \u{e8} un po' che non ci sentiamo \u{2728} Se hai voglia di un nuovo trattamento, sono qui!", active:true },
  ],
  artigiani: [
    { id:"t0", name:"Conferma appuntamento", code:"CF1", phase:"confirm", channel:"WhatsApp", text:"Ciao [Nome]! Confermato 🖤 Ti aspetto [Data] per [Servizio]. Per qualsiasi cosa scrivimi!", active:true },
    { id:"t1", name:"Ringraziamento lavoro", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per avermi scelto per questo lavoro \u{1F64F} Spero che il risultato ti soddisfi. Per qualsiasi cosa scrivimi.", active:true },
    { id:"t2", name:"Controllo soddisfazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Volevo assicurarmi che tutto sia a posto dopo i lavori. C'\u{e8} qualcosa che vorresti sistemare?", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero che il lavoro stia reggendo bene \u{1F64F} Se sei soddisfatto, una recensione su Google mi aiuterebbe a trovare nuovi clienti. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Sono passati un po' di mesi \u{2014} se hai altri lavori in programma, fammi sapere. Sono a disposizione!", active:true },
  ],
  officine: [
    { id:"t0", name:"Conferma appuntamento", code:"CF1", phase:"confirm", channel:"WhatsApp", text:"Ciao [Nome]! Confermato 🖤 Ti aspetto [Data] per [Servizio]. Per qualsiasi cosa scrivimi!", active:true },
    { id:"t1", name:"Ringraziamento servizio", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per essere passato oggi \u{1F527} Speriamo che tutto proceda alla grande. Per qualsiasi problema siamo qui.", active:true },
    { id:"t2", name:"Controllo post-servizio", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Com'\u{e8} andata dopo il servizio? Tutto ok con il veicolo? Scrivici per qualsiasi dubbio \u{1F64F}", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Speriamo che tutto stia andando bene \u{1F527} Se sei soddisfatto, una recensione su Google ci aiuterebbe molto. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! \u{C8} un po' che non ci sentiamo \u{2014} se hai bisogno di manutenzione o controllo, siamo qui \u{1F527}", active:true },
  ],
  altro: [
    { id:"t0", name:"Conferma appuntamento", code:"CF1", phase:"confirm", channel:"WhatsApp", text:"Ciao [Nome]! Confermato 🖤 Ti aspetto [Data] per [Servizio]. Per qualsiasi cosa scrivimi!", active:true },
    { id:"t1", name:"Ringraziamento base", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per oggi! \u{C8} stato un piacere. Se hai dubbi scrivimi. A presto!", active:true },
    { id:"t2", name:"Controllo soddisfazione", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Volevo solo sapere come stai andando. Tutto ok? Se qualcosa non ti convince al 100%, dimmelo.", active:true },
    { id:"t3", name:"Richiesta recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero di averti soddisfatto. Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Pensavo a te \u{2014} come stai? Se hai in mente qualcosa, sono qui. Buona giornata!", active:true },
  ],
  stampa3d: [
    { id:"t1", name:"Conferma ordine", code:"PO1", phase:"order_confirm", channel:"WhatsApp", text:"Ciao [Nome]! Ho ricevuto il tuo ordine, grazie! Lo sto preparando in stampa. Ti avviso non appena \u{e8} pronto per la spedizione.", active:true },
    { id:"t2", name:"In spedizione", code:"PO2", phase:"shipping", channel:"WhatsApp", text:"Ciao [Nome]! Il tuo ordine \u{e8} in partenza oggi. Arrivo stimato: [Data]. Se hai domande sul prodotto, sono qui!", active:true },
    { id:"t3", name:"Feedback ricezione", code:"PO3", phase:"delivery_check", channel:"WhatsApp", text:"Ciao [Nome]! \u{C8} arrivato tutto bene? Spero che il pezzo ti soddisfi. Se c'\u{e8} qualcosa che non va \u{2014} qualit\u{e0}, dimensioni, finitura \u{2014} scrivimi subito.", active:true },
    { id:"t4", name:"Richiesta recensione", code:"PO4", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero che il prodotto stia funzionando bene. Se hai un minuto, una recensione su Google mi aiuterebbe tanto a far conoscere il lavoro. Grazie!", active:true },
    { id:"t5", name:"Riordino", code:"PO5", phase:"reorder", channel:"WhatsApp", text:"Ciao [Nome]! Sono passati un po' di mesi \u{2014} se hai bisogno di riordinare o vuoi qualcosa di nuovo, sono qui. Posso anche farti un preventivo personalizzato!", active:true },
  ],
  negozio: [
    { id:"t1", name:"Conferma ordine", code:"PO1", phase:"order_confirm", channel:"WhatsApp", text:"Ciao [Nome]! Ho ricevuto il tuo ordine, grazie! Lo sto preparando con cura. Ti avviso non appena \u{e8} in partenza.", active:true },
    { id:"t2", name:"In spedizione", code:"PO2", phase:"shipping", channel:"WhatsApp", text:"Ciao [Nome]! Il tuo ordine \u{e8} partito oggi. Arrivo stimato: [Data]. Per qualsiasi cosa sono qui!", active:true },
    { id:"t3", name:"Feedback ricezione", code:"PO3", phase:"delivery_check", channel:"WhatsApp", text:"Ciao [Nome]! \u{C8} arrivato tutto bene? Spero che il prodotto ti piaccia. Se c'\u{e8} qualcosa che non va, scrivimi subito.", active:true },
    { id:"t4", name:"Richiesta recensione", code:"PO4", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Spero che il prodotto ti stia soddisfacendo. Se hai un minuto, una recensione su Google mi aiuterebbe tantissimo. Grazie!", active:true },
    { id:"t5", name:"Riordino", code:"PO5", phase:"reorder", channel:"WhatsApp", text:"Ciao [Nome]! \u{C8} passato un po' \u{2014} se hai bisogno di riordinare o vuoi scoprire le novit\u{e0}, sono qui!", active:true },
  ],
  altro_s: [
    { id:"t0", name:"Conferma appuntamento", code:"CF1", phase:"confirm", channel:"WhatsApp", text:"Ciao [Nome]! Confermato 🖤 Ti aspetto [Data] per [Servizio]. Per qualsiasi cosa scrivimi!", active:true },
    { id:"t1", name:"Ringraziamento", code:"R1", phase:"thankyou", channel:"WhatsApp", text:"Ciao [Nome]! Grazie per oggi! \u{C8} stato un piacere lavorare con te. Per qualsiasi cosa scrivimi.", active:true },
    { id:"t2", name:"Controllo", code:"C1", phase:"check", channel:"WhatsApp", text:"Ciao [Nome]! Come stai andando? Tutto ok? Scrivimi se hai bisogno.", active:true },
    { id:"t3", name:"Recensione", code:"RC1", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Se sei soddisfatto, una recensione su Google mi aiuterebbe molto. Grazie!", active:true },
    { id:"t4", name:"Riattivazione", code:"RI1", phase:"reactivation", channel:"WhatsApp", text:"Ciao [Nome]! Pensavo a te \u{2014} se hai bisogno di qualcosa, sono qui. Buona giornata!", active:true },
  ],
  altro_p: [
    { id:"t1", name:"Conferma ordine", code:"PO1", phase:"order_confirm", channel:"WhatsApp", text:"Ciao [Nome]! Ho ricevuto il tuo ordine, grazie! Lo sto preparando. Ti aggiorno a breve.", active:true },
    { id:"t2", name:"In spedizione", code:"PO2", phase:"shipping", channel:"WhatsApp", text:"Ciao [Nome]! Il tuo ordine \u{e8} in partenza. Arrivo stimato: [Data].", active:true },
    { id:"t3", name:"Feedback ricezione", code:"PO3", phase:"delivery_check", channel:"WhatsApp", text:"Ciao [Nome]! \u{C8} arrivato tutto bene? Se c'\u{e8} qualcosa che non va, scrivimi subito.", active:true },
    { id:"t4", name:"Recensione", code:"PO4", phase:"review", channel:"WhatsApp", text:"Ciao [Nome]! Se sei soddisfatto, una recensione su Google mi aiuterebbe molto. Grazie!", active:true },
    { id:"t5", name:"Riordino", code:"PO5", phase:"reorder", channel:"WhatsApp", text:"Ciao [Nome]! Se hai bisogno di riordinare o vuoi qualcosa di nuovo, sono qui!", active:true },
  ],
};

export const MODULES = [
  { id: "followup",   name: "Follow-Up",  icon: "\u{1F4AC}", color: T.blue,   desc: "Follow-up post-appuntamento", status: "active" },
  { id: "onboarding", name: "Onboarding", icon: "\u{1F4CB}", color: T.purple, desc: "Info pre-appuntamento",        status: "planned" },
  { id: "reminders",  name: "Reminder",   icon: "\u{23F0}", color: T.amber,  desc: "Riduci i no-show",             status: "planned" },
  { id: "inbound",    name: "Richieste",  icon: "\u{1F4E5}", color: T.teal,   desc: "Chat guidata + cassetta richieste", status: "validating" },
  { id: "faq",        name: "FAQ",        icon: "\u{1F4DA}", color: "#6366F1",desc: "Risposte automatiche",          status: "future" },
  { id: "referral",   name: "Referral",   icon: "\u{1F91D}", color: T.green,  desc: "Passaparola strutturato",       status: "future" },
];
