# Sliss — Stato del Progetto

<!-- SYNC ▸ FONTE DI VERITÀ · v7.5 · 2026-06-24 · Fase 1 Fondazione · M1 live + M3 in validazione · git HEAD = deploy Vercel READY
     Questo file è la fonte UNICA per versione / fase / stato tester. Gli altri file puntano qui, NON duplicano il numero.
     A fine sessione: aggiorna questa riga, poi propaga gli stamp negli altri file (CLAUDE.md, memoria). -->

> Documento vivente · Aggiornato: 25/06/2026
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

**App v7.5** (deploy Vercel READY). Tema chiaro/scuro opt-in (default chiaro), nav flottante mobile (barra logo in alto + isola 4 voci + FAB "+"), velature verdi.

- **Moduli:** **M1 Follow-Up** = attivo e validato (gate Luca GO 23/06). **M3 Richieste** = sbloccato, **in validazione su entrambi i flussi**: prodotti (Luca, pagina Richieste) e servizi (Moira, pagina Prenota) costruiti e live; prenotazione/richiesta → appuntamento/ordine + follow-up. Bloccati fino ad avanzamento: M2, M5, M6, M9.
- **Flussi:** Servizi (Appuntamenti + 4 follow-up, Moira) · Prodotti (Ordini + 5 follow-up, Luca).
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
3. **Auto-aggiornamento** della lista Richieste (no refresh manuale — poll o refresh al rientro).
4. **Link eBay reali:** export CSV dal Seller Hub di Luca → riempire i campi `ebay` in `richieste.html`.
5. **Validare il banco FAQ servizi con Moira** al momento naturale, non sollecitare.
6. *(Slice 2+ Home a moduli: completare HomeServizi — dopo feedback Luca/Moira.)*

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
| Go-live M3 coi clienti veri di Luca | Dipende dall'impostazione del messaggio benvenuto WA (link pronto) |
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
