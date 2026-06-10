# Sliss — Stato del Progetto

<!-- SYNC ▸ FONTE DI VERITÀ · v6.5 · 2026-06-09 · Fase 1 Fondazione · M1 Follow-Up · git HEAD = deploy Vercel READY
     Questo file è la fonte UNICA per versione / fase / stato tester. Gli altri file puntano qui, NON duplicano il numero.
     A fine sessione: aggiorna questa riga, poi propaga gli stamp negli altri file (CLAUDE.md, memoria). -->

> Documento vivente · Aggiornato: 08/06/2026
> Fase corrente: **1 — Fondazione**

---

## ⚠️ Branch attivi non mergeati — controllo a inizio sessione

> Lavoro da più postazioni (web/remoto + PC casa). Per non perdere pezzi:
> ad inizio sessione fai `git fetch origin --prune` e controlla se questi
> branch sono ancora aperti. Se sì, valuta se contengono lavoro da mergiare
> prima di iniziare cose nuove. Quando un branch è mergeato in `main`,
> cancellalo e rimuovi la riga qui sotto.

| Branch | Contenuto | Stato (10/06/2026) |
|---|---|---|
| _(nessuno pendente)_ | — | ✅ Tutti consolidati su `main` il 10/06/2026 |

**Consolidati su main il 10/06/2026** (workflow di pulizia branch): `claude/relaxed-volta-twlti4` (workflow + `check-sync.sh` + regola 0b check deploy MCP + criteri Fase 3), `claude/busy-noether-5fbb1i` (`docs/rischi-legali.md` + tracciamento legale/IP), `claude/social-media-update-content-I038T` (contenuti `docs/social.md`).
Cancellati anche i 2 vecchi branch già mergeati (`blissful-turing`, `status-check`). **Repo pulito al 10/06/2026: rimane solo `main`.**

---

## Dove sono adesso

Sistema operativo in piedi, app deployata, tester attivi. Sessione del 28/05 ha portato un batch di miglioramenti significativi su M1.

**Sessione 09/06/2026 (v6.5) — redesign "Prepara scheda" → "Invita cliente" (DEV+CORE):** chiuso il residuo parcheggiato (brief `docs/prepara-scheda-redesign.md`). Problema: in Agenda due tasti gemelli ("Prepara scheda" / "+ Nuovo") confondevano il nuovo utente (feedback Moira + audit P1). **Metodo: anteprima prima/dopo approvata da Erik** (`docs/test-m1/prepara-scheda-anteprima.html`, colori reali) → poi codice. **Fatto:** (1) rinominato **"Invita cliente"**, stesso nome in **Agenda** (box descrittivo con mini-spiegazione) e **Clienti** (tasto + "i" `HELP.invitaCliente`); entrambi aprono la stessa generazione link → nuovo componente condiviso `components/InviteClient.jsx` (montato on-open = init al mount, niente setState-in-effect). (2) Agenda con **un solo primario** "+ Nuovo appuntamento" → sciolto il bivio. (3) Messaggio WhatsApp del link reso **caldo** (Opzione 1, helper `inviteWaLink` in helpers.js, link in fondo). **Logica invariata** (cliente/appuntamento separati). Scelto lo scope a rischio basso (non spostare, non rompere l'abitudine di Moira in validazione); **Opzione B** (spostare sotto Clienti) e **Opzione 2** (link corto `…/c/<id>`, serve mini-backend) → **post-gate**. Lint 0, build OK, provato live da Erik. **Novità tester:** `UpdateNudge` aggiornato (le 2 migliorie + blocco "periodo di convalida → presa in carico seria", da rimuovere dopo il 21/06) + paginetta `docs/test-m1/novita-v6.5.html`. Push `aggiornamento` da inviare a deploy vivo.

**Sessione 09/06/2026 (v6.4) — audit /impeccable + auto-evidenza "primo utente" (DEV+CORE):** fatto un **audit critique** con `/impeccable` (28/40 "Good", snapshot in `.impeccable/critique/`). Domanda guida di Erik: *"un nuovo utente lo usa da solo?"*. Interventi mirati: (1) **🆕 Sistema "i" contestuale** — componente riusabile `<Info>` (ui.jsx, riusa il Modal) + testi centralizzati `src/help.js`; "i" piazzate in Home (guida modulo: cos'è Sliss + flusso + legenda fasi + moduli futuri), Follow-Up (cos'è), Agenda (Prepara scheda). Additivo, non tocca i flussi → safe in validazione. (2) **Onboarding ripensato**: benvenuto sulla **missione** (curare i clienti + riprendersi il tempo, non più "senza perdere tempo"); nuovo step **"I moduli di Sliss"** (Follow-Up attivo + Richieste/Recensioni/Riattivazione "presto"); step **"Il tuo primo modulo: Follow-Up"** che **spiega cos'è un follow-up** (la gente non lo sa) + "in futuro sarà automatico" + nota "tocca la i"; progress dots a 6/7. (3) **Tolto il bordo-striscia** su "Schede in attesa" (detector ora pulito). **Emoji: lasciate** (scelta di Erik, basta sobrietà). **Upgrade estetico "molto più figo" = lavoro futuro dedicato** (non ora). Lint 0, build OK, provato live da Erik. Anteprima in `docs/test-m1/anteprima-onboarding-info.html`.

**Sessione 09/06/2026 (v6.3) — lavoro da altro PC + scheda cliente + tracking d'uso + gate M1 (DEV+CORE):** (1) **Integrato e deployato il lavoro sviluppato da Erik da un altro PC** (branch `claude/blissful-turing-i32b80`, fast-forward su main): elimina follow-up pending, tap riquadrini Agenda → apre follow-up, "Prepara scheda" dal calendario sul giorno selezionato, consulenza auto + **stepper** timing follow-up. ⚠️ Conteneva un **bug di lint** (`set-state-in-effect` in FollowUp per `initialFuId`) sfuggito alla build → corretto con init al mount ([[feedback-bug-lessons]]: il codice da altro PC va sempre lintato dopo il merge). (2) **Scheda Cliente ripulita**: rimossa la lista follow-up ridondante (resta il riepilogo "Follow-up: stato"). (3) **🆕 Tracking minimo d'uso (Option B)** per il gate M1: `api/track.js` (ping all'apertura → set `usedays:<tester>` + snapshot conteggi `usage:<tester>`; GET per leggere), `src/track.js`, ping silenzioso in App.jsx. **Endpoint testato live.** Solo conteggi, zero dati personali. (4) **Gate M1 ufficiale** (criteri go/no-go + cosa fare se GO/NO-GO) scritto in `decisioni.md` (09/06). (5) Notifica novità 09/06 a **Luca, Moira ed Erik** (Erik via `ceoerik`). Branch social (`claude/social-media-update-content-I038T`) = **ignorato** (creato per errore, base vecchia). Lint 0, build OK.

**Sessione 08/06/2026 (v6.2) — backup dati + calendario (ruolo DEV):** chiusi i punti 1 e 2 del piano. **(1) 🔒 Backup cloud additivo su Upstash** [PRIORITÀ 1, fatta]: `api/backup.js` (POST salva `backup:<tester>`, GET rilegge), `src/backup.js` (client best-effort, errori silenziosi), **backup automatico ~8s dopo ogni modifica** in App.jsx (solo se c'è codice tester), **ripristino manuale** in Impostazioni ("Dati e backup" → "Ripristina da backup", usa `importData`+`healData`). localStorage resta primario, zero rischio. **Endpoint testato live** (POST+GET ok). **(2) 📅 Calendario read-only sotto Agenda** [fatto]: nuovo `MonthCalendar.jsx`, toggle **Lista/Calendario** in Agenda, vista mese con appuntamenti Sliss segnati, tap giorno → lista + **"Apri su Google Calendar a quel giorno"** (`calendar.google.com/r/day/Y/M/D`). Read-only (non legge Google = Fase 3). Lint 0, build OK, calendario provato live da Erik. **Punto 3 (redesign "Prepara scheda") → PARCHEGGIATO** (è UX, richiede anteprima; vedi `parking-lot.md`). Risposta di Luca su catalogo/carrello registrata in `docs/modulo-richieste-v1.md` (M3, dopo gate 21/06).

**Sessione 08/06/2026 (v6.1) — sistema "aggiorna i tester" (ruolo DEV+CORE):** stabilito un **modus operandi** (deciso con Erik): a ogni miglioria importante/rilevante si avvisa il tester con una **notifica push Sliss** che al tap apre una **schermata "Novità" in-app** (pattern notifica → vista contestuale, come i feedback). Più professionale e gratificante per i tester (vedono che rispondiamo alle loro esigenze). Implementato: tipo push `aggiornamento` ora ha `url:'/?goto=novita'`; nuova `src/components/UpdateNudge.jsx` (changelog leggibile, array `CHANGES` **da aggiornare a ogni release**); `App.jsx` mostra la schermata su `?goto=novita`. **Prima notifica inviata a Luca** per le novità v6.0. Evoluzione di [[feedback-tester-update-pages]] (le pagine HTML restano per changelog più ricchi). Lint 0, build OK.

**Sessione 08/06/2026 (v6.0) — fix UX da feedback Luca (ruolo DEV):** 5 modifiche chirurgiche e additive al flusso M1, tutte da richieste reali di Luca (prodotti). (1) **Tolto l'esito 👍/👎** dopo l'invio (prodotti + servizi → vale anche per Moira): inviato = fatto, un tocco in meno. (2) Contatore Home/Follow-Up **"In attesa" → "Inviati"** (storico). (3) **"🚀 Ready to go"**: il 2° follow-up (spedizione) non è più a tempo ma si attiva con un tasto — nuova sezione **"📦 Ordini da spedire" in Home** + tasto rinominato in Ordini; **un click apre WhatsApp diretto** (no doppio click) e il tasto resta "Ready to go" anche dopo un annulla (label override su `SendButtons` per la fase `shipping`). (4) **"↩️ Annulla invio"** su ogni follow-up inviato → torna in "Da inviare" (rimedio agli errori, [[feedback-safety-first]]). (5) **Righe clienti cliccabili in Home** → aprono la scheda (`go` esteso con `clientId`, init al mount in Clients). File: FollowUp/Home/Orders/Clients/App + helpers (`sendHref`/`openSend`) + ui (`labelOverride`). **Bug auto-inflitto risolto:** helper `isSent` in collisione con variabile locale → rinominato `isDone` ([[feedback-bug-lessons]]: controllare shadowing quando si aggiunge un helper). Lint 0, build OK, **provato live da Erik**. Anteprima prima/dopo + paginetta tester per Luca in `docs/test-m1/`. **Backup dati torna la prossima priorità.**

**Sessione 07/06/2026 (v5.9) — validazione M1 + notifiche contestuali (ruolo CORE+DEV):**
- **Modulo "Richieste" (M3, bloccato): fondamento RIVISTO, in definizione, in attesa info Luca.** La visione è lo *smistamento automatico bidirezionale* (richiesta standard → si chiude da sola su eBay/catalogo · personalizzata → arriva a Luca tracciata). Senza WhatsApp Business **API** il sistema non legge il messaggio (=Fase 3); la versione di oggi sposta lo smistamento al **primo contatto**: deviatore = **messaggio di benvenuto automatico di WhatsApp Business app** (gratis) → il cliente si auto-classifica con un tap. Sliss costruirebbe solo la "Via 2" (cattura personalizzate). Luca: usa WA Business ✓, vende pronti+personalizzazione+su misura, **usa molto le etichette** → gli stati della futura lista Richieste = sue etichette (no doppione). Dettagli in `docs/modulo-richieste-v1.md`.
- **Validazione M1 — scoperta chiave:** le metriche del gate sono **vuote** dopo ~19gg → M1 è in *uso non misurato*. Mandato a Luca e Moira il **questionario 6 domande** (`docs/test-m1/check-luca-2026-06.md`). Fissata la **decisione go/no-go M1 al 21/06/2026**. Il tasso di risposta (>30%) è **già catturato in-app** (bottoni 👍/👎). Prossimo passo tecnico concordato (rimandato): **tracking minimo d'uso** (ping apertura + sync tasso risposta) per avere i numeri oggettivi.
- **Notifiche push — nuovo tipo `feedback` + pattern "notifica → vista contestuale":** corretto `sw.js` (al click **naviga alla destinazione** anche con app già aperta — prima faceva solo `focus` = "si apriva nel vuoto"); il tipo `feedback` apre `/?goto=feedback` → nuova schermata `FeedbackNudge` (ponte WhatsApp al founder, `FOUNDER_WA` in config). **Testato live** da Erik. Pattern riusabile per il Modulo Richieste (notifica → "Presa in carico"). Push `feedback` inviata a Luca/Moira/Erik: **tutte e tre le subscription sono VIVE** (Moira inclusa). Idea "azioni rapide da notifica" → parking-lot. Deploy commit `7691b07`.

**Sessione 05/06/2026 (v5.8) — revisione tecnica + split di App.jsx (qualità, no nuove feature):** revisione del codice da senior engineer (richiesta di Erik). Giudizio: base solida. Interventi tecnici, **UI/UX e comportamento invariati**: (1) ESLint reso affidabile (config per-cartella browser/Node/serviceworker + codice morto rimosso); (2) **`App.jsx` da 749 → 67 righe**: pagine in `src/pages/`, nav+ErrorBoundary in `src/components/`, builder follow-up in `src/followups.js`, push in `src/push.js` (38 moduli, era 24) — fine dei merge-conflict sul file gigante, navigazione e diff più leggeri; (3) caricamento lazy (`useState(()=>loadData())`) → niente più stato `loading`/flash. **Lint progetto da 35 → 0 problemi.** Build + runtime verificati (Erik ha controllato l'app in locale). Stili inline lasciati intatti (eventuale futura migrazione a token CSS, bassa priorità). Vedi `docs/decisioni.md`.

**Sessione 05/06/2026 (v5.7) — ponte Google Calendar (roadmap v6 COMPLETATA):** aggiunto bottone **📅 "Aggiungi a Google Calendar"** sulla card appuntamento in Agenda: apre Google Calendar con un evento **giornaliero** pre-compilato (titolo `servizio · cliente`, data, note nei dettagli), link `calendar.google.com/render`, **zero backend**. Formato link verificato (evento si genera correttamente). **Caveat:** gli appuntamenti hanno solo la data, non l'ora → evento all-day; aggiungere l'orario è un'evoluzione futura. Con questo si **chiudono tutti e 4 i passi della roadmap v6 Opzione A** (1 follow-up disattivabili · 2 nuovo appuntamento da scheda · 3 ponte Google Calendar · 4 onboarding cliente via link). Deploy commit `4bb4eea`.

**Sessione 05/06/2026 (v5.6) — onboarding cliente via link (spedito):** integrato il lavoro avviato da telefono (branch `claude/status-check-NoBBi`) su `main`. In Agenda nuovo flusso **"Prepara scheda"**: si genera un link (data + tipo servizio, es. "Consulenza") da mandare al cliente; il cliente compila un form pubblico (`onboarding.html`: nome, WhatsApp, **email facoltativa**, note) → dati su Upstash + **notifica push** al titolare → all'apertura dell'app l'**anagrafica entra in automatico** tra i clienti (no appuntamento: quello si aggiunge dopo dal profilo, così i follow-up partono dalla data giusta). Aggiunte: **modifica data appuntamento inline** con ricalcolo follow-up (✏️), invio link **solo via WhatsApp** (un tasto), e campo **"WhatsApp cliente" opzionale** così il tasto apre direttamente la chat del cliente (`whatsapp://send?phone=`, come i follow-up). Backend API verificato live (submit + check, email inclusa). Aggiunta anche **modifica data della scheda in attesa** (✏️, rigenera il link). Deploy Vercel commit `88224e5`. **Limite noto:** su iOS non si può forzare WhatsApp **Business** (schema condiviso, decide il sistema). **Verifica (05/06):** Erik ha provato il flusso, ok. **Moira proverà nei prossimi giorni** (uso reale: consulenza → link → anagrafica).

**Sessione 04/06/2026 (v5.5) — batch usabilità Follow-Up:** schema colori coerente **per-stato** (🟢 inviato · 🟠 da inviare · 🔴 scaduto · 🔵 risposto), risolta la contraddizione del rosso su "Risposto" (era colorato per data). Azioni "Risposto / No" **inline** dalla lista, senza aprire il dettaglio. Disattivando un tipo di follow-up i `pending` di quella fase **escono dai conteggi** (Home, badge nav, tab) e nella tab "Tutti" restano **sbiaditi e disabilitati** con badge "Disattivato" (helper condiviso `isPhaseOff`). Contatori Home aprono la pagina **già filtrata** (Da inviare / In attesa / Attivi). Deploy Vercel READY (commit `66eebce`). **Rimandato:** Agenda come vista calendario (Step 5, task dedicato).

**Sessione 03/06/2026 (v5.4) — qualità UI Home:** primo audit `/impeccable` sulla Home (baseline 10/20). Creato `PRODUCT.md` come baseline di design (register=product, mission piattaforma multi-fase). Spediti e deployati: contrasto testo a norma WCAG AA, rimossi i bordi-striscia laterali, stato follow-up con etichetta testuale (non solo colore), card cliccabili accessibili da tastiera, `prefers-reduced-motion`, eliminato il doppio render (due `<main>` → uno). Poi sostituite le emoji di sistema con un set di icone a tratto coerente (nuovo componente `<Icon>`, stile Lucide) su navigazione e fasi follow-up. Restano a emoji per scelta: pagina Moduli, settori nei select, illustrazioni stati vuoti, saluto Home.

**Setup tecnico — tutto completato:**
- ✅ Repo `sliss-platform` su GitHub (account: Erikfersuoch)
- ✅ Claude Code installato e funzionante
- ✅ CLAUDE.md nel repo
- ✅ docs/ strutturata (decisioni, parking-lot, settimane, test-m1, social)
- ✅ Node.js + Git installati
- ✅ Deploy attivo su Vercel — app v5.9

---

## Il prodotto oggi

**App.jsx (v5.1)** — aggiornata il 28/05/2026.

Miglioramenti dalla v5.0 (sessione 28/05):
- **Follow-up highlight:** border 4px colorato + sfondo tinto per stato (verde=inviato, arancio=oggi, rosso=scaduto)
- **Scheda cliente M1:** metriche pulite — Visite/Ordini totali (full-width), Ultima visita/Ultimo ordine, stato Follow-up
- **Feedback:** rimossi counter, aggiunto link "Vedi recensioni" GMB nell'header
- **Tipi servizio per cluster:** ogni settore ha la propria lista nel form quick entry e Appuntamenti (tattoo, barber, beauty, officine, artigiani, altro)
- **Edit messaggio follow-up:** dal modale di dettaglio, tasto "✏️ Modifica messaggio" su pending — modifica, salva, WhatsApp aggiornato in tempo reale
- **BizType in Settings:** "Tipo attività" (Servizi/Prodotti) ora modificabile da Impostazioni — cluster si adatta, tutto il nav si aggiorna al salvataggio
- **Notifica aggiornamento:** nuovo tipo push `aggiornamento` nell'API notify — triggera manualmente con curl

**Sessione 30/05 (v5.2) — notifiche affidabili:**
- **Diagnosi:** le subscription push venivano salvate come `sub:unknown` invece di `sub:moira`/`sub:luca`. Su PWA iOS il parametro `?tester=` si perde all'apertura da icona (start_url "/") e lo storage standalone è separato da Safari. I cron cercavano `sub:moira`/`sub:luca` → non trovavano nulla → zero notifiche. Confermato dal DB Upstash (unica chiave: `sub:unknown`).
- **Fix definitivo:** campo **Codice tester** in Impostazioni → Notifiche. Si scrive il proprio codice (erik/moira/luca), salvato in localStorage nello stesso contesto della PWA. Aggiunto bottone "Aggiorna iscrizione".
- `api/notify.js` ora gestisce e rimuove le subscription scadute (404/410).
- Nuovo tipo push `conferma` ("è tutto a posto").
- **Confermato end-to-end:** notifica di prova ricevuta sull'iPhone di Erik (`sub:ceoerik`).

**Sessione 03/06 (v5.3) — feedback tester + direzione v6:**
- Definita **direzione prodotto Opzione A** ("Sliss alleggerisce, non sostituisce"). Vedi `docs/roadmap-v6.md` e `decisioni.md`. Nata dal confronto con Moira.
- Spedito: follow-up disattivabili (toggle Attivo/Disattivato nei Template), "Nuovo appuntamento/ordine" dalla scheda cliente, card Home cliccabili (feedback Luca).
- Luca: tester attivo, lo sta usando; feedback più completo atteso in settimana.
- Prossimi passi roadmap: ponte "Aggiungi a Google Calendar" → poi onboarding cliente via link (Upstash + serverless, free tier).

**Modulo attivo:** M1 Follow-Up
**Moduli bloccati fino a validazione M1:** M2, M3, M5, M6, M9

---

## I tester

**Tester zero — Moira (moglie, Momo Ink)**
- Kickoff: 19/05/2026
- Stato: uso in corso. **Subscription push VIVA** (confermata 07/06, push `feedback` consegnata)
- Check settimanale: da concordare · questionario 6 domande inviato 07/06

**Tester uno — Luca (Kayek3D, stampa 3D)**
- Identificato: 25/05/2026
- Stato: uso reale (follow-up). **Subscription push VIVA** (confermata 07/06)
- Kickoff formale: da concordare · questionario 6 domande inviato 07/06
- Dolore primario emerso: **richieste in entrata WhatsApp perse** → Modulo Richieste (M3, bloccato fino a validazione M1)

**Nota push (agg. 07/06):** tutte e tre le subscription (`sub:luca`, `sub:moira`, `sub:ceoerik`) **verificate vive** inviando la push `feedback`. Lo step zero notifiche è confermato su entrambi i tester.

**Nota push (storico 30/05):** root cause risolta (vedi v5.2). Il 30/05 inviato ai tester il messaggio con istruzioni: aprire app → Impostazioni → scrivere il proprio codice (moira/luca) nel campo Codice tester → "Aggiorna iscrizione". DA VERIFICARE: che compaiano `sub:moira` e `sub:luca` nel DB, poi cancellare il vecchio `sub:unknown`. Erik si è aggiunto al test notifiche come `sub:ceoerik` (solo verifica, niente reminder ricorrenti).

---

## I dubbi onesti

1. **La struttura dei moduli convince a metà.** La risposta arriverà dai dati del test.
2. **Il follow-up di riattivazione è contestato da Moira.** Tono e timing da verificare sul campo.
3. **Il one-man business è l'obiettivo vero.** Ogni scelta di complessità deve essere compatibile con questo.
4. **L'uscita (vendita, guadagno) è un'ambizione legittima.** Da affrontare solo dopo Fase 2 Go.
5. **La nebbia è il problema principale, non il tempo.** Il sistema esiste per questo.

---

## Prossimi passi

**✅ FATTO 08–09/06:** v6.0–v6.2 (fix Luca · sistema aggiorna-tester · backup dati · calendario) · v6.3 (lavoro da altro PC integrato · scheda cliente pulita · **tracking d'uso** · **gate M1 definito**). Luca, Moira ed Erik notificati delle novità.

**▶️ FOCUS ORA → arrivare al gate del 21/06 con i dati.** Piano pianificato il 09/06 (v6.5), diviso in *durante l'attesa* e *post-gate*. **Regola della finestra:** non rompere l'abitudine dei tester, niente feature nuove, solo cose a rischio nullo.

### A · Durante l'attesa (09/06 → 21/06) — NON espandere
- 📊 **Lasciar girare il tracking d'uso** (ogni apertura registra il giorno per tester). Niente da fare, solo lasciarlo lavorare.
- 🔔 **Leggere il report giornaliero** — la push automatica a Erik (`/api/gate-report`, 21 CEST) dà ogni sera giorni attivi Moira/Luca + follow-up + giorni al gate. Tenerlo d'occhio come polso del test.
- 👀 **Verificare che la v6.5 "attecchisca":** che Moira (e Luca) vedano la schermata Novità e usino "Invita cliente" senza intoppi. Se emergono attriti → annotare in `docs/test-m1/`, NON correre a patchare.
- 🤝 **TEST (ruolo TEST, lato Erik, non codice):** chiamata diagnostica con Moira · concordare il check settimanale · kickoff formale Luca. (Vedi *Blocchi attivi*.)
- 🗳️ **Preparare la decisione go/no-go** per il 21/06: al giorno, `GET …/api/track?tester=moira` (e `luca`) per i numeri, poi applicare i criteri di `decisioni.md` (uso ≥10/14 + valore + bilancio; rif. Moira).
- ⏸️ *Candidato anticipabile solo se serve (safety, non estetica):* rendere **visibili i fallimenti di backup**. Deciso 09/06 di **lasciarlo post-gate** salvo problemi reali.

### B · Post-gate (dopo il 21/06)
**B0 · Pulizia del temporaneo (subito dopo la decisione):**
- ⚠️ Rimuovere il cron `/api/gate-report` da `vercel.json`.
- ⚠️ Rimuovere il blocco "periodo di convalida → presa in carico seria" da `UpdateNudge.jsx` (commento già segnato nel file).

**B1 · Se GO →** espansione (Fase 2): (a) **M3 "Richieste" Via-2** per Luca (info catalogo→carrello in `docs/modulo-richieste-v1.md`); (b) 1 tester "freddo" fuori cerchia; (c) solo dopo: pricing/Fase 3.
**B1 · Se NO-GO →** diagnosi (tracking + questionari) → fix + mini-validazione ~14gg, oppure **pivot** della punta di lancia. Niente nuovi moduli finché non c'è un "sì".

**B2 · Pass "verso il top" (da audit 29/40, backlog in `parking-lot.md`):**
- **[P1] Hardening error-recovery** — far emergere i fallimenti di rete (backup/onboarding/track) + validazione inline (telefono/email). → `/impeccable harden`.
- **[P2]** riquadrini-fase: piazzare `HELP.phases` (già pronto) · emoji→`<Icon>` · skeleton/feedback caricamento.
- **Upgrade estetico dedicato** ("molto più figo", Home meno densa).

**B3 · Residui "Invita cliente":** Opzione B (spostare l'invito *sotto* Clienti togliendolo da Agenda) · **Opzione 2 link corto** (`…/c/<id>`, salva slot su Upstash + redirect). Vedi `parking-lot.md`.

**Promemoria per la chat nuova:** muoversi chirurgici e additivi, build+eslint+prova reale ad ogni passo, non rompere logiche già strutturate ([[feedback-auto-healing]]). Flusso confermato: *chat → consulenza → link auto-inserimento cliente → consulenza → appuntamento tatuaggio → follow-up*.

---

## Blocchi attivi

| Blocco | Note |
|---|---|
| Chiamata diagnostica con Moira non ancora fatta | Primo passo prima di concordare qualsiasi check |
| Check settimanale Moira non ancora concordato | Dipende dalla chiamata diagnostica |
| Kickoff Luca non ancora fissato | Da contattare |
| Metriche validazione M1 vuote | Decisione go/no-go fissata al 21/06. Prossimo passo: tracking minimo d'uso (rimandato). Questionari inviati 07/06 |
| ~~Subscription push tester scaduta~~ | ✅ RISOLTO 07/06: tutte e tre le sub verificate vive |

---

## Parcheggiato (non adesso)

- Tipi servizio personalizzabili in Settings
- Orari notifiche configurabili da utente
- Automazioni avanzate (WhatsApp Business API, invio automatico)

Vedi lista completa in `docs/parking-lot.md`.

---

## Regola attiva

> Una cosa alla volta. L'obiettivo di questa settimana è uno solo.
> Tutto il resto va in `docs/parking-lot.md`.

---

*Sliss · liscio come deve essere.*
