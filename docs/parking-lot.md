# Parking Lot — Sliss

> Idee buone ma non adesso. Le scrivi qui invece di inseguirle.
> Si rivalutano in Fase 4, o quando M1 è validato.

---

## Critiche founder — da uso reale (Erik)

> Attriti e domande emersi dall'uso diretto di Erik. Dentro lo scope M1 → da affrontare a breve, NON parcheggiati in Fase 4.

- [30/05/2026] **[✅ FATTO 30/05] Template follow-up non salvati come default.** Creando un nuovo cliente il sistema usava il template base, anche se modificato nella sezione Template. → RISOLTO meglio del previsto: la generazione dei follow-up ora legge i template salvati (`data.templates`), quindi modificare un template si applica in automatico ai nuovi clienti, senza bottone "Salva" né passaggi extra. Commit 71eb0bd.
- [30/05/2026] **[🔧 FIX APPLICATO 30/05 — da verificare su iPhone] Link WhatsApp apre un foglio di scelta su iPhone.** Causa: il numero veniva passato grezzo (con spazi/`+39`) a `whatsapp://`, rendendolo non interpretabile → iOS mostrava il ripiego "Messaggio / Apri in WhatsApp". Fix: numero normalizzato (solo cifre, prefisso 39 una volta) in ui.jsx SendButtons. Commit f718422. PIANO B se persiste: passare a link universale `https://wa.me/<num>?text=`.
- [30/05/2026] **[✅ FATTO 30/05 → opzione A: gestione manuale] Home "in attesa di risposta".** Il sistema non può rilevare la risposta in automatico (serve WhatsApp Business API, Fase 3). Scartato il rename del contatore. RISOLTO: nel dettaglio del follow-up inviato due bottoni "👍 Ha risposto" / "👎 Nessuna risposta" che assegnano l'esito (satisfaction + status) e fanno scendere il contatore. Cattura anche il dato per la soglia M1 (>30% risposte). Commit ae9f3b6.

---

## Idee prodotto

- [27/05/2026] Orari notifiche push configurabili da impostazioni utente — oggi hardcoded per tester, diventa setting personalizzabile in Fase 3
- [25/05/2026] Rimuovere conferma invio messaggi — aggiungere feedback visivo post-invio al posto del confirm dialog
- [25/05/2026] Onboarding: utenti cliccano sui numeri dei passaggi — capire se navigazione intenzionale o confusione, qualcosa manca
- [25/05/2026] Rendere più visibile che il tag cliente (VIP, nuovo, ecc.) è modificabile
- [25/05/2026] Sezione follow-up: aggiungere pulsante "modifica" su ogni messaggio nella lista
- [25/05/2026] Recensioni Google: collegamento non funziona / valutare se la visualizzazione in-app serve — forse basta mandare la richiesta recensione e rimandare l'utente su Google

- [28/05/2026] Selezione canale invio (WhatsApp/SMS/Telegram/email) — Fase 3
- [28/05/2026] Notifiche configurabili da impostazioni utente — Fase 3
- [28/05/2026] Home evolve con automatismi attivi — Fase 3
- [28/05/2026] M3 Gestione Richieste (M3+M6 unificati) — parcheggiata 28/05/2026
- [28/05/2026] Gestione messaggi giorni di chiusura — parcheggiata 28/05/2026
- [28/05/2026] WhatsApp Business API via BSP — parcheggiata 28/05/2026
- [28/05/2026] Notifica conferma operazioni automatiche — parcheggiata 28/05/2026
- [28/05/2026] Notifiche anti-stress utente finale — parcheggiata 28/05/2026

## Idee commerciali

- **Approccio outreach 1:1** — conversazioni dirette, vocali, messaggi brevi, niente link. Da valutare per Fase 2 inoltrata quando avremo dati veri — parcheggiata 25/05/2026
- **Riapertura Tally con framing problema** — riproporre il sondaggio con tono colloquiale e dati Moira a supporto. Da valutare per Fase 2 inoltrata — parcheggiata 25/05/2026

- [28/05/2026] Tipi servizio personalizzabili in Settings — oggi derivati dal cluster (defaults), in futuro campo editabile in Impostazioni che sovrascrive i default. Implementazione: `data.settings.serviceTypes[]`, fallback a `CLUSTERS_SERVIZI[cluster].serviceTypes`

## Idee tecniche

- [27/05/2026] M3 Gestione Richieste (M3 + M6 unificati) — modulo unico con due livelli: Base = FAQ statica / Avanzato = filtro intelligente richieste in entrata con percorso guidato a step. Obiettivo: il professionista gestisce solo i task complessi, il sistema risolve i semplici in autonomia. Caso d'uso primario: Luca / stampa 3D
- [27/05/2026] Gestione messaggi giorni di chiusura — risposta automatica intelligente nei giorni di chiusura. Obiettivo: convertire anche quando non ci sei. Estensione naturale di M1, non modulo separato
- [27/05/2026] Automazione WhatsApp Business API via BSP (Twilio o 360dialog) — costo stimato 10-20€/mese scaricabile sul pricing cliente. Da attivare solo in Fase 3 con clienti paganti
- [25/05/2026] Integrare follow-up con WhatsApp Business: etichettando cliente con "follow up" su WA Business il sistema parte in automatico senza dover usare la piattaforma (da valutare fattibilità)
- [25/05/2026] Logo Sliss in app non corrisponde all'originale — allineare al file sorgente (Sliss_logo_png.png sul desktop)
- **Integrazione calendario esterno** (Google Calendar / iCal) — risolta come *ponte leggero*: bottone "Aggiungi a Google Calendar" sull'appuntamento (05/06/2026). Sync bidirezionale vera = Fase 3.
- **Calendario visuale in-app (ex Step 5)** — ARCHIVIATO 05/06/2026: contraddice Opzione A (il calendario resta Google). Vedi decisioni.md.
- **Invio automatico messaggi** senza azione del professionista — parcheggiata Maggio 2026
- **Fix emoji su Vercel** — problema font, fix veloce, bassa priorità — parcheggiata Maggio 2026

## Vertical alternativi

- **Amico stampa 3D / Motorsport** — valutare per Fase 4, modulo M3 Richieste Inbound — parcheggiato Maggio 2026

---

<!-- Regola: se un'idea sta qui da 2 fasi senza essere rivalutata, cancellala. -->
