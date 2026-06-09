// Testi d'aiuto contestuali mostrati dalle "i" sparse nell'app. Centralizzati per coerenza
// e facilità d'aggiornamento. Uso: <Info {...HELP.followup} />
export const HELP = {
  moduleGuide: {
    title: "Come funziona Sliss",
    body: [
      "Sliss ti aiuta a curare i clienti come meritano e a riprenderti il tempo: niente più gestione manuale uno per uno.",
      "Il modulo attivo è Follow-Up: i messaggi di cortesia dopo il servizio o l'ordine \u{2014} il grazie, un controllo, l'invito a una recensione, un promemoria per tornare.",
      "Il flusso: aggiungi un cliente, inserisci un appuntamento o un ordine, e Sliss genera i follow-up gi\u{e0} scritti. Tu controlli e invii con un tap (in futuro li mander\u{e0} in automatico).",
      "Le fasi: verde = inviato, ambra = da inviare. Puoi disattivarne qualcuna dai Template.",
      "Altri moduli (Richieste, Recensioni, Riattivazione\u{2026}) arriveranno.",
    ],
  },
  followup: {
    title: "Cos'\u{e8} il Follow-Up",
    body: ["Messaggi di cortesia che mandi al cliente dopo: il grazie, un controllo su come va, l'invito a una recensione, un promemoria per tornare. Sliss te li ricorda al momento giusto e te li scrive gi\u{e0} pronti: oggi li invii con un tap, in futuro li mander\u{e0} in automatico."],
  },
  phases: {
    title: "Le fasi del follow-up",
    body: ["Ogni quadratino \u{e8} una fase. Verde = inviato, ambra = da inviare. L'icona indica il tipo: ringraziamento, controllo, recensione, riattivazione\u{2026}"],
  },
  preparaScheda: {
    title: "Prepara scheda",
    body: ["Crea un link da mandare al cliente: lo compila lui (nome, contatto) e la scheda entra da sola tra i tuoi clienti. Comodo per la consulenza prima dell'appuntamento."],
  },
  testerCode: {
    title: "Codice tester",
    body: ["Identifica il tuo telefono per ricevere i reminder. Serve solo durante la fase di test."],
  },
};
