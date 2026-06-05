# Decisioni — Sliss

> Una riga per ogni decisione importante: cosa, perché, quando.
> Serve per non ripetere ragionamenti già fatti.

---

| Data | Decisione | Motivazione |
|---|---|---|
| 05/06/2026 | Revisione tecnica del codice (senior review) + lint reso affidabile | Giudizio: base solida (`storage.js` healData auto-healing, ErrorBoundary, pattern React corretti, no over-engineering). Fatto subito: config ESLint per-cartella (browser `src` / Node `api` / serviceworker `sw.js`) + rimozione codice morto → **da 35 a 1 problema lint**. In coda (passo dedicato): split `App.jsx` (750 righe, 18 componenti → `src/pages/`) e refactor caricamento (init lazy, elimina l'ultimo `set-state-in-effect`). UI/UX lasciata intatta su richiesta di Erik. Stili inline NON toccati (alto rumore, zero valore ora). |
| 30/05/2026 | Direzione prodotto = Opzione A ("Sliss alleggerisce, non sostituisce") | Sliss si aggancia agli strumenti che il cliente già usa (Google Calendar, WhatsApp), non li ricostruisce. Scartata Opzione B (mini-gestionale): mercato affollato, troppo lavoro per one-man business. Vedi docs/roadmap-v6.md. |
| 30/05/2026 | Tolto il messaggio pre-appuntamento dalla sequenza follow-up | Feedback Moira: non serve. Era ipotesi di Claude, scartata. |
| 30/05/2026 | Onboarding = chiusura della conversazione di persona + link self-service | Moira fissa l'appuntamento dal vivo, poi manda un link; il cliente inserisce i propri dati legati a quell'appuntamento. Zero doppia digitazione. |
| 30/05/2026 | Follow-up disattivabili uno per uno (non più 4 fissi) | Feedback Moira: il numero di follow-up va adattato, non imposto. |
| 30/05/2026 | Spesa rinviata: €0 fino al gate Fase 2 | Onboarding link costruibile su Upstash + Vercel serverless (free tier), senza nuovi servizi a pagamento. Pricing/finanziamento = Fase 3. |
| 28/05/2026 | Scheda cliente aggiunta a M1 | Dati: visite totali, data ultimo appuntamento, recensione lasciata, stato ciclo follow-up. Non è modulo separato. |
| 28/05/2026 | Tasto Copia rimosso, tenuto solo WhatsApp | Selezione canale rinviata a Fase 3. Riduzione friction operativo. |
| 28/05/2026 | Spunta manuale eliminata | Colore verde sostituisce la conferma visiva. Meno click, stesso risultato. |
| 28/05/2026 | Home semplificata | Bottone "Aggiungi cliente" sempre visibile + lista follow-up attivi con colori stato. |
| 28/05/2026 | Accesso template aggiunto dentro sezione follow-up | Mantenuto anche nel menu. Riduce navigazione per uso frequente. |
| 28/05/2026 | Recensioni: link Google My Business in onboarding | Tasto "Vedi recensioni" apre il link. Sliss non raccoglie né mostra recensioni. |
| 28/05/2026 | Sezione gestione rinominata | "Agenda" per flusso servizi / "Ordini in corso" per flusso prodotti. |
| 28/05/2026 | Gestione social centralizzata in docs/social.md | Documento vivente per post pubblicati, idee, prossimi contenuti. |
| 27/05/2026 | Automazione invio messaggi confermata come feature core di Sliss, non accessoria | Senza trigger esterno il test non produce dati affidabili. |
| 27/05/2026 | WhatsApp Business API rimandata a Fase 3 | Il flusso wa.me pre-compilato già funziona. Automazione completa richiede BSP e approvazione Meta — non giustificata prima della validazione. |
| 27/05/2026 | M3 e M6 unificati in unico modulo "Gestione Richieste" | FAQ statica e filtro intelligente richieste condividono la stessa infrastruttura. Due livelli di complessità, un modulo solo. |
| 27/05/2026 | Notifiche push identificate come sblocco principale del test | Il friction point di Moira non è il prodotto ma il trigger esterno. Le notifiche sostituiscono l'abitudine che non si è ancora formata. |
| 25/05/2026 | Due tester in parallelo per M1 | Raccogliere dati su profili diversi senza aspettare il completamento del primo ciclo. |
| 19/05/2026 | Kickoff M1 avviato con Moira (moglie, Momo Ink) | Primo uso reale dell'app. Il timer dei 14 giorni parte da qui. |
| Maggio 2026 (data esatta non recuperabile) | Tester zero = Moira (moglie, Momo Ink) | Accesso quotidiano, target perfetto per M1, costo zero. |
| Maggio 2026 (data esatta non recuperabile) | Adottato percorso a 4 fasi con gate obbligatori | Ritmo sostenibile con 10-15h/settimana. Evita il pattern sprint+abbandono. |
| Maggio 2026 (data esatta non recuperabile) | Archiviato sistema chat parallele (CORE/M1_DEV/M1_TEST/BUSINESS) | Sostituito da Claude Code + CLAUDE.md. Era overhead inutile. |
| Maggio 2026 (data esatta non recuperabile) | Amico Motorsport parcheggiato per Fase 4 | No appuntamenti ricorrenti, no follow-up post-trattamento. Non il target di M1. |

---

<!-- Aggiungi nuove righe qui sopra, in ordine cronologico inverso -->
