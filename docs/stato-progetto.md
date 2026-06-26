# Sliss — Stato del Progetto

<!-- SYNC ▸ FONTE DI VERITÀ · v7.6 · 2026-06-26 · Fase 1 Fondazione · M1 live + M3 in validazione · messaggi di benvenuto WA pronti · editor "Le tue FAQ" self-service LIVE su entrambi i flussi (Moira servizi + Luca prodotti) · git HEAD = deploy Vercel READY
     Questo file è la fonte UNICA per versione / fase / stato tester. Gli altri file puntano qui, NON duplicano il numero.
     A fine sessione: aggiorna questa riga, poi propaga gli stamp negli altri file (CLAUDE.md, memoria). -->

> Documento vivente · Aggiornato: 26/06/2026
> Fase corrente: **1 — Fondazione**
> Storia delle sessioni vecchie (≤20/06): `docs/archivio/sessioni-2026-h1.md` · igiene contesto: `docs/protocollo-contesto.md`

---

## ⚠️ Branch attivi non mergeati — controllo a inizio sessione

> Lavoro da più postazioni (web/remoto + PC casa). Per non perdere pezzi:
> ad inizio sessione fai `git fetch origin --prune` e controlla se ci sono
> branch ancora aperti con lavoro da mergiare. Quando un branch è mergeato in
> `main`, cancellalo.

**Repo pulito (10/06/2026): solo `main`.** I 3 branch paralleli (workflow, rischi-legali, social) consolidati su `main` il 10/06; vecchi branch cancellati.

---

## Dove sono adesso

Sistema operativo in piedi, app deployata (v7.5), tester attivi. M1 Follow-Up validato (gate Luca GO il 23/06); M3 Richieste sbloccato e in validazione su **entrambi i flussi**: prodotti (Luca, Richieste) e servizi (Moira, Prenota) costruiti e live.

**Sessione 26/06/2026 (sera) (DEV) — messaggi di benvenuto WA pronti su entrambe le pagine aggiornamento + verifica M3 end-to-end.** (1) **Verifica stato sviluppo M3** (richiesta da Erik prima di passare ai messaggi): tracciato l'intero giro nel codice su entrambi i flussi — pagina pubblica (`richieste.html?o=luca` / `prenota.html?o=moira`) → `richiesta-submit` (cassetta `richieste:<owner>` + push) → polling `richiesta-list` ogni 60s+avvio+rientro con dedup id + registro "seen" → `Richieste.jsx` → "Crea ordine/appuntamento" + follow-up. Aggancio chiavi confermato: `owner` pagine = `sliss-tester` polling = `TESTERS` notify.js. **Lint 0 + build verde + 45 test.** Sviluppo M3 chiuso: il go-live è solo gesto operativo. (2) **Fix link Luca** (`eb4cdb6`): in `aggiornamento-luca.html` il testo di benvenuto pronto aveva il link **senza numero** (`?o=luca`) → il pulsante "scrivimi diretto" del cliente apriva un `wa.me` senza destinatario. Corretto in `?o=luca&wa=393458983135` (numero Kayek3D) in entrambi i punti (link visibile + testo da copiare). (3) **Sezione "link prenotazioni" per Moira** (`eb4cdb6`): `aggiornamento-moira.html` aveva solo l'avviso Home, **mancava** il pezzo "link + copia + testo benvenuto" che ha Luca. Aggiunta (link-box `prenota?o=moira`, bottone Copia link, testo "Benvenuta/o da Momo Ink", mini-istruzioni WA Business); header marcato 26/06 con sub aggiornato. (4) **Quickguide** impostazione messaggio di benvenuto WhatsApp Business (Strumenti attività → Messaggio di benvenuto → incolla → Tutti → salva) consegnata a Erik. (5) **Verifica dal vivo:** pagine scaricate da sliss.it (non dal file locale) — Moira ha la nuova sezione, Luca ha il link col numero in entrambi i punti e **nessun link monco residuo**, pagine cliente `richieste`/`prenota` HTTP 200. Deploy `eb4cdb6` READY confermato via MCP Vercel. **Resta operativo (zona TEST/decisione Erik):** mandare le pagine aggiornate ai tester e impostare i messaggi — per Moira regola "non sollecitare" ancora attiva. (6) **Editor "Le tue FAQ" self-service — M3 v2 slice 1 (servizi/Moira), LIVE** (`46dc9ee`): il professionista modifica le risposte automatiche che il cliente vede, **senza toccare codice** (era la "v2" prevista nella spec M3). Tre pezzi end-to-end: **`api/faq.js`** (nuovo, store per-owner su Upstash: GET legge, POST salva, generico → riusabile da Luca); **`FaqEditor.jsx`** (nuovo) in Impostazioni — solo flusso servizi per ora — modifica risposta/domanda, on/off, aggiungi, salva, parte dai default del settore (`src/faqDefaults.js`); **`prenota.html`** scarica le FAQ dell'owner all'apertura con **rete di sicurezza** (magazzino vuoto/giù → default hardcoded, zero regressione per i clienti). **Verifica:** lint 0 + build + 45 test; giro provato dal vivo con owner di prova `test-faq-demo` (GET null → POST 2 FAQ → GET le restituisce con on/off → pulizia); deploy `46dc9ee` READY. Anteprima interattiva PC consegnata a Erik (`Desktop/sliss-faq-preview.html`, editor↔chat collegati). **(7) L2 — FAQ self-service anche per Luca/prodotti, LIVE** (`0fc813f`): aggiunto a `richieste.html` il **ramo "Ho una domanda"** (prima non c'era: la pagina era solo product-finder) con domande/risposte; scarica le FAQ dell'owner da `api/faq` con rete di sicurezza (6 default Kayek3D inline, in `src/faqDefaults.js`). Editor "Le tue FAQ" in Impostazioni ora attivo anche per `bizType` prodotti. Non tocca il flusso d'acquisto (eBay/diretto/personalizza). Verifica: lint 0 + build + 45 test + sintassi JS pagine OK; pagina Luca live contiene il ramo (HTTP 200). Anteprima PC aggiornata con switch Moira/Luca. **Parcheggiato:** info pre/post editabili (Moira) + "Le tue FAQ" esposta come feature al tester con onboarding/UX dedicata.

**Sessione 26/06/2026 (CORE + DEV remoto) — flusso prenotazione→appuntamento COMPLETATO (PUNTO 2+3) + fix lint + riallineamento.** Lavoro costruito da sessioni web (Sonnet 4.6) e consolidato/verificato in questa sessione CORE da PC casa. (1) **PUNTO 2 — Conferma appuntamento** (`0d3eabb`, `e58fe1d`): nuova fase follow-up `confirm` per i servizi (registrata in `PHASES`). Alla creazione dell'appuntamento Sliss prepara il messaggio di conferma WhatsApp; l'hero Home diventa *"DA FARE ADESSO: manda la conferma a [Nome]"* con tasto "Invia su WhatsApp" + "Segna come inviata". Template "Conferma appuntamento" aggiunto a tutti e 7 i cluster servizi. Ordine fasi servizi ora: **conferma → ringraziamento → controllo → recensione → riattivazione**. (2) **PUNTO 3 — Ringraziamento a ora-appuntamento +3h** (`e58fe1d`): il ringraziamento non parte più a ora-0 ma 3h dopo l'orario dell'appuntamento, via nuovo helper `isFuReady()` (controlla `scheduledTime` oltre a `scheduledDate`; gestisce lo sforamento a mezzanotte). È il "ringraziamento post-seduta" disegnato il 25/06. (3) **4 fix UX** (`24f887d`,`dc1836e`,`3ea9be6`,`5e8ded3`): hero separato da "Oggi in agenda" (azione vs info), label "I tuoi moduli" riposizionata, `isFuReady()` usato anche in Clients.jsx, hint "premi ✕ per tornare" su Richieste. (4) **Prassi d'avvio CORE:** main era indietro di 7 commit → riallineato (ff); branch laterale `claude/continue-discussion-1bjio3` verificato vuoto e cancellato → repo di nuovo solo `main`. (5) **Fix lint** (questa sessione): le sessioni remote avevano pushato con **lint rosso** (3 variabili `td`/`td2` morte, residui del refactor `isFuReady` in App.jsx/Home.jsx/Clients.jsx) — build e 45 test passavano ma il lint falliva. Pulite. **Verifica:** lint 0 + build verde + 45 test + deploy `e58fe1d` READY confermato da Erik. (6) **Valutazione go-live M3 (CORE):** il modulo Richieste è pronto da prodotto su **entrambi** i flussi — pagine live, in-app funzionante, follow-up completi; il go-live vero è ora un **gesto operativo** (impostare il messaggio di benvenuto WhatsApp Business col link per ogni tester), non altro codice. (7) **eBay pagina Luca:** mantenuto il collegamento al catalogo generale, **rimossa la macchina dei link per-prodotto da CSV** (decisione Erik: non approfondire). (8) **Hero secondario "POI" in HomeProdotti:** sotto l'hero principale compare una card compatta con la seconda priorità (ordine da spedire / follow-up), tap → vista giusta; sottomessa all'hero, non tocca HomeServizi. Verificata in anteprima locale prima del push. (9) **Cancello pre-push (husky)** (`074102c`): hook `.husky/pre-push` che esegue lint+test e **blocca il push se sono rossi**; si autoinstalla via `prepare` anche nelle sessioni web (`npm ci`). Provato dal vivo su verde (passa) e rosso (blocca, exit 1). Deploy `b9388e4` (con husky) verificato **READY** — lo script `prepare` non rompe la build Vercel. Rende sistemico quello che oggi era a memoria: il lint rosso pushato dalle sessioni remote non sarebbe arrivato su main. *(Strumenti, attivati con Erik: **Chrome DevTools MCP** installato (`~/.claude.json`, scope local — prova "visto funzionare" + base test E2E) e **Vercel MCP** già connesso (verifica deploy). Entrambi gratis; usabili dalla prossima sessione, i server MCP si caricano al riavvio di Claude Code.)*

**Sessione 25/06/2026 (sera) (DEV/CORE) — M3 servizi: auto-aggiornamento Richieste validato dal vivo + orario appuntamento + 3 fix + disegno flusso conferma.** Cinque pezzi, tutti live e provati da Erik in prima persona (PC incognito = "finto Moira" ↔ cellulare = cliente, owner finto). (1) **Auto-aggiornamento lista Richieste** (`4b17002`): la cassetta server viene controllata all'avvio + ogni 60s + al rientro (visibilitychange), non più solo al mount; prima le prenotazioni nuove non comparivano senza riaprire l'app. **Validato dal vivo.** (2) **Bottone "Aggiungi a Google Calendar"** (`0e682cb`) nella conferma del modal prenotazione→appuntamento (solo servizi), riusa `gcalLink`. (3) **Fix hero Home servizi** (`6a91727`): le prenotazioni in attesa hanno priorità sul blocco "Inizia da qui/nessun cliente" — bug **pre-esistente** (l'hero "Prenotazione in attesa" era nascosto se l'attività non aveva ancora clienti: esattamente il caso reale di Moira); emerso dal test end-to-end. (4) **Orario sull'appuntamento** (`5c27b7e`): campo Ora opzionale (HH:MM) in creazione (modal Richieste + form Agenda) e visualizzazione (hero "ore 15 · Copertura", lista Agenda, dettaglio calendario, ordinati per ora); retrocompatibile. È la **fondazione** per il ringraziamento "post-seduta". (5) **Fix "richieste eliminate tornano"** (`09e7e69`): registro locale `sliss-richieste-seen-<owner>` → una richiesta eliminata resta eliminata, non più ripescata dalla cassetta ad ogni poll. **Disegno col CORE del flusso prenotazione→appuntamento** (vedi `RIPRENDI.md`): la trattativa data/ora resta **umana su WhatsApp** (Sliss non la automatizza); prossimi passi concordati = (2) **messaggio di conferma** alla creazione appuntamento, che diventa la vera azione dell'hero ("manda la conferma"); (3) **ringraziamento a ora-appuntamento +3h**; parcheggiato "segna completato" per sedute multiple.

**Sessione 25/06/2026 (DEV) — M3 servizi completato e live per Moira + sessione di pulizia (contesto, branch, repo).** (1) **Pagina Prenota per servizi** (`265dbcf`, `public/prenota.html`): chat guidata MomoInk/Moira con 3 rami (8 FAQ tattoo · info pre/post trattamento · prenotazione). **Moira ha provato e approvato.** (2) **Metà in-app della feature** (`3e5d961`, portata live in questa sessione di pulizia): l'API salva tel/servizio/note (prima si perdevano); in `HomeServizi` compaiono **hero "Prenotazione in attesa"** + **modulo "Richieste" con contatore** → Moira ora **vede** le prenotazioni in arrivo (prima no); una prenotazione → **appuntamento + follow-up** con un tocco. Lint/build verificati, deploy. (3) **Pulizia generale:** introdotto il sistema anti-appesantimento (`docs/protocollo-contesto.md` + `check-contesto.sh`), `stato-progetto.md` da 6.200→~1.700 parole con storia ≤20/06 spostata in `docs/archivio/`, MEMORY.md asciugato; recuperati 3 branch non mergeati (feature M3 servizi + autocertificazione AI + log social) e **repo riportato a solo `main`**.

**Sessione 24/06/2026 (CORE/DEV) — Home a moduli costruita (prodotti) + M3 servizi spec + aggiornamento Luca.** (1) **Home a moduli Slice 1 LIVE** (`0515555`): split architetturale `HomeProdotti` (nuova, hero dinamico + righe modulo compatte) / `HomeServizi` (estratta, invariata = zero rischio Moira). Hero con priorità richiesta→ordine→follow-up, auto-scale al completamento; stato calmo "Tutto sotto controllo ✓". Colore = stato (amber/green), non modulo. Mockup v2 con fix UX approvato prima di costruire. (2) **M3 "In validazione"** in Mappa Moduli (`03ae5f3`): stato amber con pallino arancione pulsante. (3) **Pagina aggiornamento visiva per Luca** (`04b6fd6`, `public/aggiornamento-luca.html`): mini-telefono mockup Home, flusso Richieste in 3 passi, link con copia, testo welcome WA, 3 domande di calibrazione. **Inviata, in attesa feedback.** (4) **Spec M3 Richieste per SERVIZI** completa (`docs/spec-m3-richieste-servizi.md`): tre rami (FAQ auto, Info pre/post auto, Prenotazione manuale), unifica M3+M6+parte M2; banco FAQ per 5 cluster da ricerca di mercato (~8 domande ciascuno); supporto materiale proprio del professionista (brochure/PDF → card in chat, fallback a FAQ precompilate); roadmap personalizzazione v1→v3; piano build in 5 slice. (5) Fix copy "Info prima/dopo il trattamento" (più chiaro per il cliente vs "Ho un appuntamento"). Poi (`55e7ddb`): **link Richieste più pulito** `sliss.it/richieste?o=luca` (rewrite mirato in `vercel.json`, no `.html`).

**Sessione 21/06/2026 (CORE) — audit post-ultrareview + decisione "aspettare" + sequenza espansione.** Dopo il fix v7.5, audit a 360° (richiesto da Erik "fai tutto in ordine"): **(1) codice — nessun altro bug della classe alpha-hex** né delle altre classi note: tutto pulito. **(2) health code: sano** — ~2.350 righe src, zero TODO/`eslint-disable`, 45 test sul motore; unica lacuna nota = test flussi-utente E2E (= punto C2, post-gate). **(3) perimetro ultrareview:** affidabile per regressioni di codice trasversali sui refactor grossi; NON sostituisce prova runtime (B) né test flussi (C2) né i tester. **(4) readiness gate: NON ancora raggiunto, ma per "mancanza dati su Moira", non bocciatura.** **Luca quasi-GO** (13+ usi reali oltre soglia + uso 7/7 + **2 riscontri positivi reali sui follow-up recensione**). **Moira** ferma per assenza di clienti nuovi (attrito d'inserimento), non difetto prodotto. **Decisione Erik: aspettare** — dare tempo a Moira e a Luca; nessuna spinta. **Confronto strategico (le 2 idee per il "dopo"):** la roadmap le **sequenzia, non sono alternative** — su GO parte **M3 "Richieste" a €0 per Luca (Fase 2)**, poi **automazione/sync Calendar in Fase 3**. Il gate è lo sblocco di entrambe. Driver di spesa unico = WhatsApp Business API; tutto il resto (Calendar API, Vercel/Upstash, Claude API per triage M3) è €0 o pochi € in fase test. Nessuna modifica al codice in questa sessione.

**Sessione 21/06/2026 (v7.5) — /ultrareview: fix bug alpha-hex su CSS var (DEV).** Erik ha lanciato `/ultrareview` da una sessione rootata nel repo. **La review ha trovato un BUG VERO che lint+build NON vedono:** col dark mode (v7.0) i colori sono diventati `var(--c-*)`, ma in vari punti il codice creava la trasparenza concatenando l'alpha-hex (`${T.color}55`…) → con una variabile `var(--c-amber)55` è **CSS invalido** → sfondi/bordi tinti rotti (badge Ordini, bordo slot Agenda, card Moduli, Btn danger, WarmTips, UpdateNudge). Era **live dalla v7.0**. **Fix:** sostituito ovunque con `color-mix(in srgb, COLORE NN%, transparent)` (6 file). ⚠️ La review aveva **aggiunto `playwright` a package.json** → **RIMOSSO** prima del commit (binario pesante = rischio build Vercel). Lint 0, build verde. **Lezione:** mai `${colorVar}NN` per l'alpha → `color-mix`. Commit + deploy v7.5. L'ultrareview si è ripagata al primo colpo.

**Sessione 21/06/2026 (v7.0→v7.4) — restyling design-led (DEV).** Cinque pezzi in giornata, tutti deployati: **v7.0 DARK MODE (opt-in, default chiaro = tester non toccati)** + velature verdi, con `/impeccable`: token `theme.js` → variabili CSS `var(--c-*)`, due set chiaro/scuro in `index.html` (niente flash), `data-theme` da `localStorage['sliss-theme']`; via di mezzo "variante C" (vetro/glow solo dove non c'è testo); contrasti WCAG verificati. **v7.1 NAV FLOTTANTE:** `TopBar` mobile (logo + "Altro") + `FloatingNav` (isola vetro 4 voci + FAB "+" centrale che apre mini-menu Invita cliente/Nuovo cliente/Nuovo appuntamento). **⚠️ Visibile ai tester** (non opt-in), pubblicato comunque in finestra gate (miglioria, non regressione). **v7.2–v7.3 emoji→icone** (pulsanti/azioni + stati vuoti + toggle tema): aggiunte icone al set `Icon`, ereditano colore via `currentColor`; emoji nei messaggi WhatsApp lasciate (calore). **v7.4** icone pulsanti Template (coerenza chiusa) → **STOP restyling** (rendimenti decrescenti, 5 versioni in un giorno in finestra gate). Residui deliberati: icone settori/moduli + Onboarding first-run + 3 glow variante C. *(Dettaglio completo di ogni pezzo: vedi cronologia git e archivio.)*

**Storico recente (riassunto) — dettaglio in `docs/archivio/sessioni-2026-h1.md`:**
- **20/06** — fix resoconto sballato (`pingUsage` girava solo al mount → ora anche dopo le modifiche) + guard `api/backup.js` (copia vuota non sovrascrive una piena). Incidente dati Luca reso innocuo.
- **18/06** — 15 test di caratterizzazione sul motore `followups.js` (suite 30→45). CI già montata.
- **16/06 (v6.9)** — split nome/cognome nel form cliente + migrazione retroattiva follow-up.
- **12/06 (v6.8)** — modal centrato in tutta l'app + fix overflow `input[type=date]` (Android + iOS WebKit).
- **11/06 (v6.7)** — redesign utente "freddo" (empty state che insegna, onboarding 7→6) + fix notifiche (5 cron → 2 broadcast, Vercel Hobby max 2).
- **10/06** — consolidamento branch su `main`, workflow (check deploy via MCP, `check-sync.sh`), `rischi-legali.md`.
- **≤09/06** — v5.4→v6.5: prima Home /impeccable, split `App.jsx` (749→67 righe), onboarding via link, ponte Google Calendar, backup cloud, tracking d'uso, "Invita cliente", gate M1 definito. Tutto in archivio.

---

## Il prodotto oggi

**App v7.6** (deploy Vercel READY). Tema chiaro/scuro opt-in (default chiaro), nav flottante mobile (barra logo in alto + isola 4 voci + FAB "+"), velature verdi.

- **Moduli:** **M1 Follow-Up** = attivo e validato (gate Luca GO 23/06). **M3 Richieste** = sbloccato, **in validazione su entrambi i flussi**: prodotti (Luca, pagina Richieste) e servizi (Moira, pagina Prenota) costruiti e live; prenotazione/richiesta → appuntamento/ordine + follow-up. Bloccati fino ad avanzamento: M2, M5, M6, M9.
- **Flussi:** Servizi (Appuntamenti + 5 follow-up: conferma → ringraziamento +3h → controllo → recensione → riattivazione, Moira) · Prodotti (Ordini + 5 follow-up, Luca).
- **Home a moduli** (Slice 1, prodotti): hero dinamico per priorità (richiesta→ordine→follow-up), righe modulo compatte, colore = stato. `HomeServizi` invariata.
- **Scheda cliente** (parte di M1): visite/ordini totali, ultima visita/ordine, stato ciclo follow-up.
- **Backup:** cloud su Upstash, additivo, ~8s dopo ogni modifica; ripristino manuale da Impostazioni. localStorage resta primario. Guard anti-sovrascrittura attiva.

---

## I tester

**Tester zero — Moira (moglie, Momo Ink · servizi).** Uso in corso. Subscription push viva. **Pagina Prenota provata e approvata (25/06)**; metà in-app ora live → vede le prenotazioni sulla Home. **Stato gate: attesa attiva** — ancora ferma su clienti nuovi (attrito d'inserimento, non difetto prodotto). Decisione 21/06: dare tempo, non sollecitare. **Prossimo aggancio naturale:** impostare il messaggio di benvenuto WA con il link Prenota + validare le FAQ con lei.

**Tester uno — Luca (Kayek3D, stampa 3D · prodotti).** Uso reale 7/7. Subscription push viva. **Gate: GO (23/06)** — 13+ usi reali oltre soglia + 2 riscontri positivi sui follow-up recensione. Pagina aggiornamento Home/M3 inviata 24/06, **in attesa delle 3 risposte di calibrazione** (etichette WA, messaggi reali, volume settimanale). Dolore primario → M3 Richieste (ora in costruzione per lui).

---

## I dubbi onesti

1. **La struttura dei moduli convince a metà.** La risposta arriverà dai dati del test.
2. **Il follow-up di riattivazione è contestato da Moira.** Tono e timing da verificare sul campo.
3. **Il one-man business è l'obiettivo vero.** Ogni scelta di complessità deve essere compatibile con questo.
4. **L'uscita (vendita, guadagno) è un'ambizione legittima.** Da affrontare solo dopo Fase 2 Go.
5. **La nebbia è il problema principale, non il tempo.** Il sistema esiste per questo.

---

## Prossimi passi

**▶️ FOCUS ORA → costruire M3 Richieste per Luca (Fase 2) + tenere viva l'attesa su Moira.** Gate Luca GO; M3 sbloccato. Regola della finestra ancora valida per Moira: non rompere l'abitudine, niente pressione.

**Quando riprendi (da `docs/RIPRENDI.md`):**
1. **Attendere/raccogliere il feedback di Luca** sulla pagina aggiornamento — le 3 risposte servono a rifinire M3 beta.
2. **Go-live M3 coi clienti veri di Luca:** imposta il messaggio di benvenuto WhatsApp Business col link (testo pronto in `aggiornamento-luca.html`; numero Kayek3D `393458983135`).
3. **Link eBay reali:** export CSV dal Seller Hub di Luca → riempire i campi `ebay` in `richieste.html`.
4. **Provare dal vivo il flusso conferma + ringraziamento +3h con Moira** (PUNTO 2+3 ora live): creare un appuntamento con orario → verificare hero "manda la conferma" e che il ringraziamento scatti a +3h. Validare il banco FAQ servizi al momento naturale, non sollecitare.
5. *(Slice 2+ Home a moduli: completare HomeServizi — dopo feedback Luca/Moira.)*
6. *(Parcheggiato dal flusso servizi: "segna completato" per sedute multiple.)*

**Pulizia del temporaneo (residuo di fase test, da fare quando si chiude la finestra gate):**
- Togliere il `report` dal cron serale (`vercel.json`) + `sendGateReport` in `notify.js`.
- Rimuovere il blocco "periodo di convalida" da `UpdateNudge.jsx` (commento già nel file).
- Rivedere/rimuovere i coachmark di fase test (`<SendCoach>`, `<WarmTips>`).

**Backlog "verso il top" (parcheggiato, vedi `parking-lot.md`):** hardening error-recovery (far emergere i fallimenti di rete + validazione inline) · icone settori/moduli + Onboarding first-run · 3 glow variante C · link corto invito (`…/c/<id>`) · sync Google Calendar (Fase 3).

---

## Blocchi attivi

| Blocco | Note |
|---|---|
| Feedback Luca su pagina aggiornamento M3 | Inviata 24/06, in attesa delle 3 risposte di calibrazione |
| Go-live M3 coi clienti veri di Luca | Messaggi di benvenuto WA pronti (link + testo su entrambe le pagine aggiornamento, 26/06). Resta: incollarli in WhatsApp Business e mandare le pagine ai tester (gesto operativo) |
| Moira ferma su clienti nuovi | Attesa attiva, nessun sollecito (decisione 21/06) |
| Chiamata diagnostica con Moira | Non ancora fatta; primo passo prima di concordare check |

---

## Parcheggiato (non adesso)

- Tipi servizio personalizzabili in Settings · orari notifiche configurabili da utente · automazioni avanzate (WhatsApp Business API, invio automatico).

Vedi lista completa in `docs/parking-lot.md`.

---

## Regola attiva

> Una cosa alla volta. L'obiettivo di questa settimana è uno solo.
> Tutto il resto va in `docs/parking-lot.md`.

---

*Sliss · liscio come deve essere.*
