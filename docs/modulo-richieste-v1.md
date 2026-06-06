# Modulo "Richieste" — definizione in corso (per Luca / prodotti)

> Stato: **in DEFINIZIONE** (non ancora iniziato). Documento di ripresa per la prossima sessione.
> Aperto il 06/06/2026. Nato dal feedback di Luca (vedi `docs/test-m1/feedback-log.md`).

---

## Perché (il dolore validato)
Luca (Kayek3D, stampa 3D) **perde richieste in entrata su WhatsApp** — messaggi che apre e dimentica, ritardi anche di settimane. È il suo dolore **a peso specifico maggiore**, più della gestione post-vendita. Risorsa scarsa di Luca = **attenzione** (fabbrica + figlie + pendolarismo, business in crescita). I follow-up (M1) invece gli funzionano e gli piacciono → M1 valida bene anche lato prodotti.

## Principio architetturale (deciso)
- **Modulo ≠ Motore.** Richieste è un **modulo separato** da Follow-Up (lavoro diverso: "non perdere il cliente *prima*" vs "*dopo*"). NON gonfiare Follow-Up.
- Ma poggia sul **motore condiviso** già esistente: link pubblico (pattern onboarding) + cattura record + promemoria + notifiche. Primo vero test del "modulo su motore".
- NON costruire ora un framework-moduli generico (astrazione prematura: prima 2 moduli veri, poi si estrae il comune).

## Coerenza con Opzione A
La vendita resta su **eBay** (shop vero) / catalogo WhatsApp. Sliss **NON fa checkout** — fa il **deflettore**: instrada le richieste facili verso eBay/catalogo e cattura quelle personalizzate. Coerente con "Sliss non ricostruisce ciò che altri fanno meglio".

## Scope proposto — v1 (fattibile oggi, niente WhatsApp API)
1. Link "richiesta" che Luca fissa/manda (riusa il pattern onboarding).
2. Il cliente apre e sceglie:
   - **"Cerco un prodotto"** → instradato a catalogo/eBay (bottone link) → vendita si chiude lì, zero effort Luca.
   - **"Personalizzato / non trovo"** → mini-form → **richiesta tracciata** in Sliss + **promemoria** a Luca.
3. Lato Luca: lista **"Richieste aperte"** con stato (nuova → presa in carico → chiusa).

**Rimandato (Fase 3 / evoluzione):**
- Intercettazione automatica dei messaggi su WhatsApp → richiede WhatsApp Business API (BSP, a pagamento) = Fase 3.
- Versione "ti escono 5 prodotti" → richiede un catalogo prodotti dentro Sliss (setup per Luca) = step 2.
- Pipeline di produzione (preso in carico → in stampa → post → spedizione) → estende gli Ordini, tassello successivo.

## Rischi noti
- **Adozione:** funziona solo se Luca dirotta davvero i clienti sul link (cambio abitudine). Stesso punto in test ora con l'onboarding di Moira.
- **Validazione M1:** scelta consapevole di Erik di procedere senza metriche numeriche complete (segnale qualitativo positivo da entrambi i tester). Metriche feedback-log ancora da riempire.

## ⏭️ RIPRENDERE DA QUI (2 domande aperte a Erik)
1. Ti torna la **v1 senza catalogo** (routing → eBay/catalogo + cattura delle personalizzate), col "5 prodotti" come step 2?
2. Per la v1 va bene il **link** (oggi, riusa onboarding), accettando che l'intercettazione automatica su WhatsApp resti Fase 3?

→ Se sì su entrambe: definire lo scope preciso e iniziare a costruire (un passo alla volta, build verificata).
