# Parking Lot — Sliss

> Idee buone ma non adesso. Le scrivi qui invece di inseguirle.
> Si rivalutano in Fase 4, o quando M1 è validato.

---

## Critiche founder — da uso reale (Erik)

> Attriti e domande emersi dall'uso diretto di Erik. Dentro lo scope M1 → da affrontare a breve, NON parcheggiati in Fase 4.

- [09/06/2026] **[✅ FATTO 09/06 — v6.5] Redesign "Prepara scheda" → "Invita cliente".** Risolto il bivio dei due tasti gemelli in Agenda: rinominato **"Invita cliente"** (stesso nome in Agenda = box descrittivo, e Clienti = tasto + "i"), Agenda con un solo primario "+ Nuovo appuntamento", messaggio WhatsApp del link reso caldo (Opzione 1). Logica invariata. Anteprima approvata da Erik (`docs/test-m1/prepara-scheda-anteprima.html`), decisione in `decisioni.md`. **Residui post-gate:** (a) eventuale spostamento dell'azione *sotto* Clienti togliendola da Agenda (Opzione B, più ambiziosa, scartata ora per non cambiare l'abitudine di Moira in validazione); (b) **link corto (Opzione 2)** — `sliss…/c/<id>`: salvare lo slot su Upstash alla creazione + rotta di redirect, così il messaggio porta un link pulito invece dell'URL lungo. Da fare **dopo il gate 21/06**.

- [30/05/2026] **[✅ FATTO 30/05] Template follow-up non salvati come default.** Creando un nuovo cliente il sistema usava il template base, anche se modificato nella sezione Template. → RISOLTO meglio del previsto: la generazione dei follow-up ora legge i template salvati (`data.templates`), quindi modificare un template si applica in automatico ai nuovi clienti, senza bottone "Salva" né passaggi extra. Commit 71eb0bd.
- [30/05/2026] **[🔧 FIX APPLICATO 30/05 — da verificare su iPhone] Link WhatsApp apre un foglio di scelta su iPhone.** Causa: il numero veniva passato grezzo (con spazi/`+39`) a `whatsapp://`, rendendolo non interpretabile → iOS mostrava il ripiego "Messaggio / Apri in WhatsApp". Fix: numero normalizzato (solo cifre, prefisso 39 una volta) in ui.jsx SendButtons. Commit f718422. PIANO B se persiste: passare a link universale `https://wa.me/<num>?text=`.
- [30/05/2026] **[✅ FATTO 30/05 → opzione A: gestione manuale] Home "in attesa di risposta".** Il sistema non può rilevare la risposta in automatico (serve WhatsApp Business API, Fase 3). Scartato il rename del contatore. RISOLTO: nel dettaglio del follow-up inviato due bottoni "👍 Ha risposto" / "👎 Nessuna risposta" che assegnano l'esito (satisfaction + status) e fanno scendere il contatore. Cattura anche il dato per la soglia M1 (>30% risposte). Commit ae9f3b6.

---

## Normativa / legale

- [18/06/2026] **Nuove regole sul diritto di recesso — "pulsante di recesso" obbligatorio dal 19/06/2026**
  ⚠️ **AZIONE:** quando iniziamo a lavorarci (Fase 3), fare ricerca aggiornata al giorno stesso — le regole potrebbero cambiare nella finestra temporale. Non basarsi su questa nota come fonte definitiva.
  **Riferimento normativo:** Direttiva UE 2023/2673 → recepita con D.Lgs. 209/2025 (GU 08/01/2026) → nuovo art. 54-bis Codice del Consumo → in vigore dal 19/06/2026.
  **Cosa cambia:** ogni e-commerce/interfaccia online B2C deve avere una "funzione digitale di recesso" (pulsante dedicato) che consenta al consumatore di recedere dal contratto direttamente online, con doppia conferma e ricevuta automatica (data+ora).
  **Chi è obbligato:** tutti i professionisti che concludono contratti a distanza con consumatori tramite interfaccia online — incluse micro-imprese, artigiani che vendono online, creator, abbonamenti, servizi digitali. NON i contratti offline o B2B.
  **Eccezioni note al recesso (preesistenti, art. 59 Codice Consumo):** servizi già eseguiti con consenso espresso del consumatore, prodotti personalizzati/su misura, prodotti sigillati per igiene aperti dopo consegna. Da verificare se i servizi con appuntamento (es. tatuaggio, barbiere) rientrano nelle eccezioni.
  **Requisiti tecnici:** pulsante ben visibile e accessibile nella stessa interfaccia dove si è comprato; invio diretto della dichiarazione; conferma automatica con data/ora; tracciabilità.
  **Sanzioni AGCM:** da €5.000 a €10.000.000. Se manca l'informativa completa sul recesso → il termine si estende automaticamente a 12 mesi + 14 giorni.
  **Rilevanza per Sliss:** se in Fase 3 Sliss gestirà ordini/pagamenti online (flusso prodotti), questa normativa si applica. Per il flusso servizi con appuntamento, verificare se rientra nelle eccezioni o se serve comunque il pulsante.
  **Sliss stesso come prodotto venduto:** Erik vende Sliss (SaaS/abbonamento) a professionisti. Se anche alcuni clienti acquistano come consumatori (senza P.IVA), il Codice del Consumo si applica a Sliss direttamente. In Fase 3 (pricing): implementare pulsante recesso nell'app, informativa pre-acquisto, gestione rimborso 14gg. Valutare se trial gratuita evita il problema (niente pagamento = niente recesso). Verificare se vendita esclusivamente B2B (solo con P.IVA) esclude l'obbligo — ma limita il mercato.
  **Servizi con prenotazione/appuntamento:** per i servizi, il recesso di 14gg decorre dalla conclusione del contratto (= momento della prenotazione/conferma). MA l'art. 59 esclude il recesso per: (a) servizi con data/periodo specifico (es. appuntamento tatuaggio, trattamento estetico — interpretazione "attività del tempo libero" da verificare con legale); (b) servizi già completamente eseguiti con consenso espresso del consumatore. In Fase 3, Sliss dovrà: informare sempre il cliente prima della prenotazione; raccogliere consenso espresso se si invoca l'eccezione; per i prodotti, implementare il pulsante di recesso.
  **Vendita senza sito (eBay/Instagram/WhatsApp):** il diritto di recesso 14gg (art. 52) vale per TUTTI i contratti a distanza professionista→consumatore, indipendentemente dal canale. Il nuovo pulsante (art. 54-bis) si applica a chi controlla l'interfaccia online: su marketplace (eBay, Instagram Shop) l'onere è probabilmente della piattaforma; su trattative informali via DM/WhatsApp è zona grigia per il pulsante, ma l'obbligo di informare sul recesso e accettarlo resta. Vendite tra privati (no P.IVA) → Codice Consumo non si applica.
  **Fonti da consultare (Fase 3):** art. 52, 54-bis e 59 Codice del Consumo aggiornato; sito AGCM; FAQ MIMIT sul recesso (mimit.gov.it); commercialista/avvocato per applicazione specifica al caso Sliss.

## Idee prodotto

- [20/06/2026] **Vero multi-dispositivo (notifiche su tutti i device + SINCRONIZZAZIONE DATI reale).** ⚠️ Famiglia "multi-dispositivo", da fare come si deve POST-GATE — non pezze prima. Oggi due limiti collegati: (1) **Notifiche:** l'iscrizione push è una sola casella per codice (`sub:<tester>`), il secondo device che attiva sovrascrive il primo → ne riceve uno solo (verificato 20/06: PC sì, cell no, codice `ceoerik`). Fix = salvare un'iscrizione **per dispositivo** (set di sub per tester) + `notify.js` itera e pulisce gli scaduti singolarmente. (2) **DATI [il punto delicato]:** i dati stanno in localStorage **per-dispositivo, non sincronizzati**; il backup cloud è una casella last-write-wins → due device con lo stesso codice possono **sovrascriversi i dati a vicenda** (e basta *aprire* il secondo device: dopo ~8s fa un backup automatico). Il guard messo il 20/06 blocca solo "vuoto schiaccia pieno", NON "pieno diverso schiaccia pieno". Fix vero = **server come fonte di verità** con sync/merge (per-record, con timestamp o conflict-resolution) — lavoro architetturale grosso, OAuth/backend, primo pezzo non-€0, **Fase 3**. **Regola operativa fino ad allora: una persona = un dispositivo per inserire i dati** (principio safety-first: i dati non si devono mai compromettere). Collegato: orari notifiche per-utente (stessa famiglia "notifiche fini").
- [12/06/2026] **Fase follow-up 💰 "sollecito pagamento"** — dal sondaggio Tally: "recupero pagamenti" = ambito da semplificare più votato (2/5, artigiani/edilizia). Un sollecito di pagamento È un follow-up: stesso motore M1, solo una fase nuova. Da valutare post-validazione. Vedi `docs/sondaggi.md`.
- [12/06/2026] **Ponte M1 → social "dal lavoro fatto al post pronto"** — dal sondaggio Tally (tatuatrice, social = dolore n.1 ma n=1 nel campione). Il check guarigione di M1 produce foto e recensioni = materia prima dei post Instagram per tattoo. NON un social manager (mercato affollatissimo, contro Opzione A): solo preparare il contenuto dal flusso che già esiste. Fase 4, solo se il pattern si ripete nei prossimi sondaggi. Vedi `docs/sondaggi.md`.

- [27/05/2026] Orari notifiche push configurabili da impostazioni utente — oggi hardcoded per tester, diventa setting personalizzabile in Fase 3
- [23/06/2026] **Notifiche smart "da fare oggi" — cross-modulo, Fase 3.** Richiesta di entrambi i tester (23/06): vogliono essere notificati **nel momento giusto** (es. i follow-up da inviare oggi → notifica alle ~10:00 del mattino). Non basta l'orario configurabile (voce 27/05): serve una notifica **event-driven** ("hai N cose da fare oggi") e non solo reminder a orario fisso. Valevole per tutti i moduli presenti e futuri. Vincolo attuale: Vercel Hobby = max 2 cron, precisione ±59min. Sblocco: Vercel Pro (~€20/mese, fuori budget attuale) o cron esterno (es. Upstash QStash, free tier). Collegato a: orari configurabili (27/05), multi-dispositivo (20/06).
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

## Rischi legali / IP

- [10/06/2026] **[✅ VERIFICATO] Marchio "Sliss"** — nessun marchio identico registrato in classi 9/42 su EUIPO e UIBM (ricerca frase esatta). Esiste solo un'app "SLISS" su Google Play (settore investimenti, diverso). Da ricontrollare solo prima di registrazione formale del marchio. Sistema completo di tracciamento rischi legali/IP in `docs/rischi-legali.md` (struttura pensata anche per agente autonomo, con trigger di rivalutazione per ogni voce).

## Pricing — da finalizzare in Fase 3

> Ragionamento fatto il 16/06/2026 in sessione esterna. Non toccare fino a gate M1 + Fase 3.

**Costi operativi stimati a regime (50 clienti)**
- Infrastruttura: ~€35/mese
- API Claude (token AI): ~€70/mese
- Totale: ~€115/mese → costo per cliente: ~€2,30/mese

**Range scartato: €75-150/mese** — competizione diretta con Treatwell, Booksy, Fresha, Acuity (più feature, più brand, non battibili in early stage).

**Struttura a tier ipotizzata:**

| Fase | Prezzo | Contenuto |
|---|---|---|
| Beta / primi clienti | €19/mese | Modulo follow-up (M1) |
| Regime - base | €29/mese | Follow-up + richieste in entrata (M1+M3) |
| Regime - completo | €49/mese | Tutti i moduli integrati |

**Posizionamento:** "Costa meno di un caffè al giorno, niente funzioni inutili, risolve esattamente il problema che hai." Vantaggio strutturale: architettura leggera = costi fissi bassi = possibilità di stare sotto €50 dove i grandi non possono scendere.

**Da validare prima di finalizzare:** (a) costo API reale per utente attivo (dipende dall'uso M3 soprattutto); (b) se €19 beta è sostenibile con margini o è sussidiato per acquisizione; (c) confermare che i moduli pianificati (M1→M3→M5/M6) giustificano i 3 tier — oggi M1 da solo vale €19, ma €49 per "tutto" richiede che ci sia davvero un "tutto" maturo.

---

## Idee commerciali

- **Approccio outreach 1:1** — conversazioni dirette, vocali, messaggi brevi, niente link. Da valutare per Fase 2 inoltrata quando avremo dati veri — parcheggiata 25/05/2026
- **Riapertura Tally con framing problema** — riproporre il sondaggio con tono colloquiale e dati Moira a supporto. Da valutare per Fase 2 inoltrata — parcheggiata 25/05/2026

- [28/05/2026] Tipi servizio personalizzabili in Settings — oggi derivati dal cluster (defaults), in futuro campo editabile in Impostazioni che sovrascrive i default. Implementazione: `data.settings.serviceTypes[]`, fallback a `CLUSTERS_SERVIZI[cluster].serviceTypes`

## Idee UI/UX

- [21/06/2026] **[PROSSIMI MIGLIORAMENTI] Logo in alto nell'app su mobile.** Sul desktop il logo c'è (sidebar); nella vista app (mobile) in cima manca — sopra/vicino al "Buongiorno, Erik" non c'è il marchio. Aggiungere un header mobile con il logo Sliss (piccolo, sopra il saluto della Home, o in una top-bar leggera). Da fare nel giro restyling, dopo barra flottante + icone.

- [17/06/2026] **[BASE APPROVATA] Dark mode verde Sliss + navigazione Revolut-style.** Mockup v4 approvato da Erik (`preview-ui-revolut.html`): sfondo gradiente verde foresta (#145A38 → #081E15), card glassmorphism trasparenti, barra isola flottante con glow, icone SVG Lucide, transizioni slide tra viste. **Implementazione prevista a breve.** Il tema attuale (light, sfondo bianco, accent #16A34A) resta come **light mode** selezionabile da Impostazioni. Quindi: `data.settings.theme` = `"light"` (default attuale) | `"dark"` (nuovo). Il file preview resta nel repo come riferimento visivo.

## Idee tecniche

- [09/06/2026] **[POST-GATE] Pass "verso il top" — backlog da audit /impeccable (29/40, snapshot in `.impeccable/critique/`).** L'app è "Good"; il tetto residuo è: **(P1)** *error recovery* — backup/onboarding/track falliscono in silenzio + nessuna validazione inline (telefono/email): da far emergere con feedback (tocca anche la sicurezza dati, [[feedback-safety-first]]) → `/impeccable harden`; **(P2)** riquadrini-fase da etichettare (testo `HELP.phases` già pronto, solo da piazzare) · emoji grezze → set `<Icon>` — **DECISO 10/06: Strada A, tutto icone** (via le emoji funzionali, direzione "premium" coerente con PRODUCT.md), da fare **post-gate** · skeleton + micro-feedback al caricamento/salvataggio; **(P3)** togliere "codice tester" (Fase 3), densità Home. Più l'**upgrade estetico dedicato** ("molto più figo"). Trend punteggio: 28 (09/06 mattina) → 29 (post v6.4+v6.5). Ri-lanciare `/impeccable critique` dopo gli interventi per misurare.

- [07/06/2026] **Azioni rapide da notifica push** (action button → cambio stato) — al servizio del Modulo Richieste: la push "Nuova richiesta da X" porta un pulsante "Presa in carico" che aggiorna lo stato della richiesta SENZA aprire l'app. Catena: `actions` nel payload → `sw.js` cattura `notificationclick` → `fetch` a endpoint nuovo (`/api/ack` o simile) → aggiorna su Upstash. Stesso meccanismo utile anche per ack-lettura. ⚠️ LIMITE iOS: i pulsanti nelle notifiche PWA iOS sono inaffidabili (Safari li mostra male/non li mostra) — il *tap* semplice sulla notifica è più solido del pulsante. Da valutare quando si costruisce il modulo. Nota: per la semplice "conferma ricezione" NON vale (WhatsApp ha già le spunte blu).
- [27/05/2026] M3 Gestione Richieste (M3 + M6 unificati) — modulo unico con due livelli: Base = FAQ statica / Avanzato = filtro intelligente richieste in entrata con percorso guidato a step. Obiettivo: il professionista gestisce solo i task complessi, il sistema risolve i semplici in autonomia. Caso d'uso primario: Luca / stampa 3D
- [27/05/2026] Gestione messaggi giorni di chiusura — risposta automatica intelligente nei giorni di chiusura. Obiettivo: convertire anche quando non ci sei. Estensione naturale di M1, non modulo separato
- [27/05/2026] Automazione WhatsApp Business API via BSP (Twilio o 360dialog) — costo stimato 10-20€/mese scaricabile sul pricing cliente. Da attivare solo in Fase 3 con clienti paganti
- [25/05/2026] Integrare follow-up con WhatsApp Business: etichettando cliente con "follow up" su WA Business il sistema parte in automatico senza dover usare la piattaforma (da valutare fattibilità)
- [25/05/2026] Logo Sliss in app non corrisponde all'originale — allineare al file sorgente (Sliss_logo_png.png sul desktop)
- **Integrazione calendario esterno** (Google Calendar / iCal) — risolta come *ponte leggero*: bottone "Aggiungi a Google Calendar" sull'appuntamento (05/06/2026). Sync bidirezionale vera = Fase 3.
- [12/06/2026] **Evidenza pro sync Google Calendar (per la priorità di Fase 3):** brief con Moira — interesse confermato ma *"devo trovare 5 minuti"*: l'attrito è l'inserimento manuale, e senza contatti nuovi il punto d'ingresso (Invita cliente) non scatta mai. Una sync che **legge gli appuntamenti da Calendar** farebbe girare i follow-up senza input suo = Opzione A portata a compimento (si aggancia, non ricostruisce). NON costruirla ora: richiede OAuth Google + backend vero (primo pezzo non-€0) e automatizzerebbe un loop non ancora validato. Se il gate è GO, candidata **prima priorità Fase 3**, con questo episodio come motivazione scritta. Dettaglio in `docs/test-m1/feedback-log.md` (check 12/06).
- **Calendario visuale in-app (ex Step 5)** — ARCHIVIATO 05/06/2026: contraddice Opzione A (il calendario resta Google). Vedi decisioni.md.
- **Invio automatico messaggi** senza azione del professionista — parcheggiata Maggio 2026
- **Fix emoji su Vercel** — problema font, fix veloce, bassa priorità — parcheggiata Maggio 2026

- [10/06/2026] **Criteri per introdurre agenti paralleli (Fase 3+)**: NON usarli finché vale anche solo una di queste condizioni: (a) M1 non è ancora validato dai tester (gate 14gg), (b) c'è un solo modulo "attivo" alla volta, (c) le sessioni richiedono ancora approvazione passo-passo di Erik su quasi ogni modifica. Trigger per rivalutare: quando 2+ moduli sono in sviluppo/manutenzione in parallelo E i task di un modulo sono ben isolati (es. un agente fa solo refactor/lint/check su M3 mentre Erik+Claude lavorano su M1) — in quel caso valutare un agente "Explore"/"general-purpose" in background per ricerca/QA, non per scrittura autonoma di feature.
- [10/06/2026] **TARGET dichiarato da Erik: range 8.5-9.5/10**, sia per workflow/uso Claude Code sia per valutazione del prodotto. Da tenere come riferimento nelle prossime review/valutazioni numeriche (mantenere obiettività alta come richiesto, non gonfiare i voti per "centrare" il target).
- [10/06/2026] **Automazioni workflow Claude Code** (da review interna, voto 7.8/10): (1) ✅ FATTO 10/06 — check deploy Vercel via MCP a fine sessione (regola 0b, sostituito il check manuale dashboard); (2) ✅ FATTO 10/06 — `bash docs/check-sync.sh --fix` propaga lo stamp SYNC in CLAUDE.md (memoria a mano); (3) potatura periodica di stato-progetto.md (archiviare sessioni vecchie in docs/settimane/) quando supera ~40KB; (4) agenti paralleli — NON ora, valutare solo in Fase 3 quando più moduli saranno attivi in parallelo. Punti deboli identificati: leva tecnica MCP non sfruttata (5/10), pianificazione agenti futuri non scritta (6/10) — il resto (setup, doc, scope discipline, workflow preview→ok) era già 8-9/10. **Aggiornamento 10/06 (post-interventi) → ~8.7/10:** saliti i due punti deboli (MCP ora usato per il check deploy 5→~8.5; agenti pianificati coi criteri Fase 3 6→~8.5) + aggiunti `check-sync.sh --fix` (auto-propaga lo stamp) e pulizia/consolidamento branch (5 branch → solo `main`). Resta sotto 9.5 perché: la propagazione SYNC è un comando manuale (non un hook automatico a ogni commit), lo stamp memoria è ancora a mano, e manca un gate lint/build automatico pre-commit.

## Vertical alternativi

- **Amico stampa 3D / Motorsport** — valutare per Fase 4, modulo M3 Richieste Inbound — parcheggiato Maggio 2026

---

<!-- Regola: se un'idea sta qui da 2 fasi senza essere rivalutata, cancellala. -->
