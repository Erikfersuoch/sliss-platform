// FAQ di default per i due contesti. Sono le stesse che vivono "fisse" nelle
// pagine pubbliche (prenota.html per servizi): qui servono a far partire
// l'editor "Le tue FAQ" già pieno, prima che il professionista salvi le sue.
// Se cambi questi testi, allinea anche il fallback dentro prenota.html.

export const FAQ_DEFAULTS = {
  servizi: [
    { q: "Quanto costa un tatuaggio?", a: "Dipende dalla dimensione e complessità. Scrivimi con un'idea e ti faccio un preventivo!", on: true },
    { q: "Quanto dura la seduta?", a: "Da 1 a 4 ore in base alla complessità. Per lavori grandi si fanno più sedute.", on: true },
    { q: "Quanto fa male?", a: "Dipende dalla zona. Le parti con più osso (costole, piedi) sono più sensibili. La maggior parte delle persone lo sopporta bene!", on: true },
    { q: "Posso portare un'immagine di riferimento?", a: "Certo! Mandami pure le tue idee, le uso come base per il bozzetto.", on: true },
    { q: "Bisogna essere maggiorenni?", a: "Sì, serve essere maggiorenni. Sotto i 18 serve il consenso di un genitore.", on: true },
    { q: "Chiedete un acconto?", a: "Sì, l'acconto serve per confermare l'appuntamento. Se annulli entro tempo ti viene restituito.", on: true },
    { q: "Si può fare in gravidanza?", a: "No, è sconsigliato in gravidanza e allattamento per precauzione.", on: true },
    { q: "Fate anche tatuaggi a colori?", a: "Certo! Scrivimi e ne parliamo — ti mostro anche dei lavori già fatti.", on: true },
  ],
  prodotti: [
    { q: "Quanto costa?", a: "Dipende dal pezzo e dalla personalizzazione. Scrivimi cosa ti serve e ti faccio un preventivo!", on: true },
    { q: "In quanto tempo è pronto?", a: "Pochi giorni per i pezzi a catalogo; per i su misura te lo dico al momento dell'ordine.", on: true },
    { q: "Di che materiale sono i pezzi?", a: "Plastiche tecniche resistenti, scelte in base all'uso (più robuste per i pezzi sollecitati).", on: true },
    { q: "Posso personalizzarlo (colore, logo, scritta)?", a: "Sì! Dimmi come lo vuoi e te lo realizzo su misura.", on: true },
    { q: "Come si compra?", a: "Scrivimi diretto su WhatsApp, oppure compra dal nostro shop eBay.", on: true },
    { q: "Fate pezzi su misura, non a catalogo?", a: "Certo, è la nostra specialità: mandami foto e misure e vediamo insieme.", on: true },
  ],
};

export default FAQ_DEFAULTS;
