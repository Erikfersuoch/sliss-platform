# Sliss — Stato del Progetto

<!-- SYNC ▸ FONTE DI VERITÀ · v7.5 · 2026-06-21 · Fase 1 Fondazione · M1 Follow-Up · git HEAD = deploy Vercel READY
     Questo file è la fonte UNICA per versione / fase / stato tester. Gli altri file puntano qui, NON duplicano il numero.
     A fine sessione: aggiorna questa riga, poi propaga gli stamp negli altri file (CLAUDE.md, memoria). -->

> Documento vivente · Aggiornato: 21/06/2026
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

**Sessione 21/06/2026 (v7.5) — /ultrareview: fix bug alpha-hex su CSS var (primo catch della review) (DEV).** Erik ha lanciato `/ultrareview` (`/code-review ultra bfe2e2f`) da una sessione Claude **rootata nel repo** (vedi [[reference-ultrareview-session-root]]; ha dovuto usare `claude.cmd` per aggirare l'ExecutionPolicy di PowerShell). **La review ha trovato un BUG VERO che lint+build NON vedono:** col dark mode (v7.0) i colori sono diventati `var(--c-*)`, ma in vari punti il codice creava la trasparenza concatenando l'alpha-hex (`${T.color}55`, `${mod.color}18`, `${T.red}44`…) → con una variabile `var(--c-amber)55` è **CSS invalido** → sfondi/bordi tinti rotti (badge Ordini, bordo slot Agenda, card Moduli, bordo Btn danger, WarmTips, UpdateNudge). Era **live dalla v7.0**. **Fix (applicati dalla review, verificati da me):** sostituito ovunque con `color-mix(in srgb, COLORE NN%, transparent)` (6 file: ui.jsx, Home, Orders, Appointments, ModulesMap, UpdateNudge). ⚠️ La review aveva **aggiunto `playwright` a package.json** (l'avrà usato il cloud per testare la UI) → **RIMOSSO** prima del commit: binario pesante = rischio build Vercel (lezione `sharp`, [[feedback-bug-lessons]]). Lint 0, build verde. **Nuova lezione tecnica:** mai `${colorVar}NN` per l'alpha → `color-mix`. Commit + deploy v7.5. **L'ultrareview si è ripagata al primo colpo** (punto D del flusso ora abilitato per i pezzi grossi futuri).

**Sessione 21/06/2026 (v7.4) — icone pulsanti Template (chiusura coerenza) + STOP restyling (DEV+CORE).** Quick win: i pulsanti di `Templates.jsx` (✏️ modifica → `pencil` [icona nuova], 🗑️ elimina → `trash`, 📋 copia → `clipboard`) erano l'ultima pagina con pulsanti a emoji mentre il resto era già iconato. Convertiti → iconificazione pulsanti **coerente in tutta l'app**. Lint 0, build verde. **Decisione CORE (priorità delegata da Erik "valuta e segui"): STOP restyling qui.** Siamo a rendimenti decrescenti e abbiamo già spinto **5 versioni oggi** (v7.0→v7.4) tutte visibili ai tester in piena finestra gate. **Restano come pezzi DELIBERATI futuri (non urgenti):** Blocco 3 (icone settori/moduli ~10 nuove + Onboarding first-run), pencil inline sulle date (Agenda/Clienti, simboli tollerabili), 3 glow variante C. **Vera priorità ora = il gate/tester** (notifica Moira quando in negozio + dato Luca alla sua riapertura), su cui non si può forzare nulla.

**Sessione 21/06/2026 (v7.3) — emoji → icone, Blocco 2 (stati vuoti + tema + decorativi) (DEV, restyling 4° pezzo).** Continuato il restyling "come pianificato". Convertiti: **stati vuoti** (`<Empty icon=…>`) di Clienti/Agenda/Ordini/Follow-Up/Feedback/Template → icone (search/calendar/package/star/users/file/clipboard); **toggle tema** ☀️/🌙 → icone `sun`/`moon` (aggiunte al set, +`target`); **decorativi Home** (🎯 hero "Inizia da qui"→target, ⭐ "Vedi recensioni"→star, 📦 heading "Ordini da spedire"→package) e **Feedback** (⭐ "Vedi su Google"→star). Centratura icone risolta una volta nel componente `Empty` (icon div → flex center) invece di 8 modifiche. **Lasciate apposta:** 👍 "niente oggi" e 🎉 celebrazione (delight), 👋 saluto, 🚀 Ready-to-go, simboli ✓/✕/✏️, e i pulsanti edit/delete/copy di **Template** (dietro "Altro" → giro di coerenza dopo), emoji **Onboarding** (defer) + 🔕/📝 (edge). Flusso D: `/code-review` mio = pulito. Lint 0, build verde. **Restano:** Blocco 3 (settori/moduli — ~10 icone nuove) + Onboarding + Template-buttons + 3 glow variante C.

**Sessione 21/06/2026 (v7.2) — emoji → icone, Blocco 1 (pulsanti/azioni) (DEV, restyling 3° pezzo).** Restyling. Distinzione chiave fatta prima di toccare: (a) le emoji **dentro i messaggi WhatsApp** (followups.js) RESTANO (calore per il cliente, non UI); (b) gli avatar delle fasi follow-up erano **già icone** (`config.js` usa nomi-icona `heart/star/rotate/...` resi con `<Icon>`). Quindi convertiti solo i **pulsanti/azioni di sistema**: 🔗→`link`, invio (📱/✉️/💬)→`send` (aeroplanino unico, canale distinto da testo+colore), 📅→`calendar`, 🔔→`bell`, 🔄→`rotate`, ☁️→`download`, 🗑️→`trash`, 🔍→`search`. Aggiunte 6 icone al set `Icon` (link/bell/trash/search/send/download); le icone nei `Btn` ereditano il colore via `currentColor`. File: ui.jsx (SendButtons+Search), InviteClient, Clients, App (mini-menu +), Home, Settings, Appointments, Orders. **Lasciate apposta** (Blocco 2/delight): 🚀 "Ready to go", 👋 saluto, icone stati vuoti, ☀️/🌙 tema. **Review (flusso D):** `/code-review` leggero fatto da me = pulito (1 bug trovato+corretto: `</Btn>` perso nello scambio del pulsante Ripristina, beccato dalla build). **`/ultrareview` NON eseguibile** da questa sessione: è rootata nella home (non un repo git) → slash-command falliscono ([[reference-ultrareview-session-root]], salvato in memoria); per Blocco 1 (piccolo, meccanico) si è scelto di procedere col solo /code-review. Lint 0, build verde. Commit + deploy.

**Sessione 21/06/2026 (v7.1) — NAVIGAZIONE FLOTTANTE: barra alto (logo) + isola basso (4 voci + tasto +) (DEV, design-led).** Continua il restyling dopo v7.0. Scelta tra 4 varianti di barra flottante (anteprima `docs/test-m1/nav-flottante-anteprima.html`) → Erik sceglie il **tasto + centrale**; risolta la conseguenza ("5 destinazioni non stanno con un + centrale") con l'opzione **"barra in alto + logo"** (anteprima `layout-app-anteprima.html`): risolve anche il **logo mancante su mobile**. **Implementato:** (1) `TopBar` mobile (logo reale `SlissLogo` a sx + "Altro" a dx che apre `MoreMenu`); (2) `FloatingNav` mobile al posto di `BottomNav`: isola vetro con 4 destinazioni (Home·Follow-Up·Agenda/Ordini·Clienti) + **FAB "+"** centrale rialzato; (3) il **+** apre un mini-menu (`Modal`) con **🔗 Invita cliente** (gap segnalato da Erik: mancava!), **Nuovo cliente**, **Nuovo appuntamento/ordine**; le pagine ricevono prop `openAdd` che apre il form al volo (pattern React "adjust state on prop change" in render, **niente setState-in-effect** [[feedback-bug-lessons]]). Token nav `--c-nav/--c-navHi` in `index.html`; `Icon` nuova icona `plus`; `.app-main` padding-bottom 110px per l'isola. Desktop (sidebar) invariato. Lint 0, build verde, provato live (`vite preview`, boot OK). **⚠️ Cambiamento VISIBILE ai tester (non opt-in come il dark mode): Erik ha scelto di pubblicarlo comunque** in piena finestra gate (gate in stallo, è un miglioramento non una regressione). **Da valutare:** piccolo avviso a Moira/Luca (non ancora dato). **Prossimi pezzi restyling:** emoji→icone, 3 glow variante C.

**Sessione 21/06/2026 (v7.0) — DARK MODE (opt-in) + velature verdi (DEV, design-led con /impeccable):** Erik decide di usare l'incidente dati come slancio e avviare il restyling (deciso post-gate, ma il gate è in stallo → "attesa attiva", come il 18/06). **Scelta del primo pezzo (sicuro): tema scuro commutabile**, default Chiaro → **i tester non vengono toccati**. **Flusso agentic A→B:** "Fatto quando" concordato (tema in Impostazioni, default Chiaro, tutta l'app coerente popup inclusi, scelta salvata, non rompe dati/invii/chi resta su chiaro) → anteprime HTML in `docs/test-m1/` (`dark-mode-anteprima.html` + variante C) provate e approvate ("che spettacolo"). **Audit /impeccable:** emerso conflitto col `PRODUCT.md` (vieta glassmorphism/glow decorativo, "premium = cura"); il mockup v4 "Revolut" era pieno di vetro → scelta **"via di mezzo"** (variante C): base leggibile + vetro/glow SOLO dove non c'è testo (barra, banner, dietro i numeri). Leggibilità verificata (contrasti WCAG: dark muted text 4.9→5.5:1, card rese piene). **Implementazione (a basso rischio, componenti non toccati uno per uno):** i token `theme.js` diventano **variabili CSS** `var(--c-*)`; i due set chiaro/scuro definiti in `index.html` (disponibili prima del render = niente flash) + script che applica `data-theme` da `localStorage['sliss-theme']`. Velature verdi su `--c-shell` (sfondo). Punti tecnici risolti: **Icon.jsx** (stroke via *style*, non attributo, sennò la var non risolve), **Btn** (testo `onGreen` scuro su verde brillante in dark), **Modal** (bg/border a token). Interruttore "Aspetto" in Settings. **Provato dal vivo** (`vite preview`, build di produzione). Lint 0, build verde. **Tester NON avvisati** (opt-in + finestra gate, default chiaro = invisibile). **Pezzi successivi (uno per volta):** i 3 glow della variante C sui componenti reali (Home/Nav) + emoji→icone (allineato al brand). [[feedback-bug-lessons]] [[reference-impeccable]]

**Sessione 20/06/2026 — fix resoconto sballato + backup a prova di sovrascrittura (DEV+TEST, pre-gate):** Segnalazione di Erik: a Moira non arrivavano le notifiche su desktop, e i suoi 2 follow-up inviati **non comparivano nel resoconto serale**. **Diagnosi su stato reale del server (non a memoria):** confronto `usage:` (contatore report) vs `backup:` (copia dati veri). **(1) Resoconto sballato [bug strutturale]:** `pingUsage` (il "ping" col conteggio) girava **solo al mount** dell'app → fotografava lo stato *all'apertura*, prima che il tester inviasse i follow-up nella stessa sessione. Il backup invece parte ~8s *dopo* ogni modifica → aveva i 2 invii, il report no. Conferma dai dati: backup Moira 19/06 = **2 sent / 6 pending** ✅; usage Moira = **0 sent / 8 pending** ❌. **Fix:** helper unico `computeUsageStats` in `App.jsx`; il ping ora parte **anche dopo le modifiche** (agganciato all'effect del backup, debounced 8s) oltre che al mount. Numeri del gate ora veri. **(2) Backup cancellabile [rischio dati]:** scoperto che `api/backup.js` faceva `kv.set` last-write-wins → una copia **vuota sovrascriveva una piena**. Causa concreta: Erik aveva aperto per sbaglio un **contesto vuoto col codice tester di Luca** → backup+usage cloud di Luca azzerati. **Nessun danno ai dati veri di Luca** (vivono nel suo localStorage; il ripristino è *solo manuale* via Settings, nessun auto-restore → il suo telefono non è stato toccato; si rigenerano alla sua prossima apertura). **Fix:** guard in `api/backup.js` — una copia vuota (0 clienti, 0 follow-up, 0 ordini) **non sostituisce mai** una copia piena. L'incidente diventa innocuo per sempre. **Verifica:** 45 test verdi, lint pulito, build OK + guard provato dal vivo su chiave di test post-deploy. Notifiche desktop Moira: guidata all'attivazione (Impostazioni → permesso); su iPhone restano solo-Safari. Tester non disturbati con solleciti (i dati di Moira erano già salvi, quelli di Luca si auto-riparano).

**Sessione 18/06/2026 — rete di sicurezza sul motore follow-up (DEV, lavoro pre-gate, NESSUN codice app toccato):** in **attesa attiva** sul gate (decisione 12/06: aspettare i tempi di Moira, non caricare) si è scelto un lavoro *invisibile ai tester*. Verificato che la **CI** (`.github/workflows/ci.yml`, lint+test+build a ogni push) era già montata (punto C1 del flusso agentic ✅), ma **mancavano i test sul cuore di M1**: il motore `src/followups.js`. **Fatto (flusso agentic A→B):** concordato prima il "Fatto quando" in italiano, poi scritto `src/followups.test.js` — **15 test di caratterizzazione** che fotografano il comportamento *attuale* di `buildFollowUps` (servizi/Moira: 4 follow-up alle date +0/+7/+21/+60, tempi personalizzati, fase disattivata, "Ritocco", `[Nome]`, stato pending) e `buildProductFollowUps` (prodotti/Luca: 5 follow-up, consegna +7 di default e date +3/+14/+60, spedizione `awaitShipping` senza data = "Ready to go", `[Data]`) + `tplMessage`. **Scopo:** quando post-gate arriveranno i lavori estetici grossi (emoji→icone, dark mode Revolut), la CI segnala al push se una modifica tocca per sbaglio *quando/come* partono i follow-up, prima che arrivi ai tester ([[feedback-auto-healing]]). **Nessun comportamento storto emerso** (il motore era già corretto, i test lo bloccano). Suite **30 → 45 verdi**, lint pulito. Commit `edf44a8`. ⚠️ Webhook Vercel impuntato (problema noto) → redeploy forzato `41ce64d` (commit vuoto), deploy **READY** verificato via MCP. Tester non avvisati (lavoro interno, invisibile). **Da qui:** restiamo in attesa sul gate.

**Sessione 16/06/2026 (v6.9) — split nome/cognome nel form cliente (DEV):** Richiesta dei tester: nei follow-up WhatsApp il cognome era fastidioso. **Fatto:** (1) Form "Nuovo cliente" e "Modifica cliente" in `Clients.jsx`: campo unico "Nome completo" → **due campi separati Nome + Cognome**. Salvataggio: `firstName`, `lastName`, `name=firstName+' '+lastName` (la visualizzazione in lista/scheda usa ancora il nome completo). (2) Generazione follow-up (`buildFollowUps`, `buildProductFollowUps` via Clients.jsx): usa `sel.firstName || sel.name.split(' ')[0]` — solo il nome nel messaggio WhatsApp. (3) Propagate template (`Templates.jsx`): stessa logica, usa `firstName || prima parola del name`. (4) **Retroattivo automatico:** migrazione una-tantum in `App.jsx` — alla prima apertura dell'app con il nuovo codice, sostituisce il nome completo con solo il nome in **tutti i follow-up in attesa**; flag `sliss-mig-firstname` in localStorage. (5) **Retroattivo profili:** il form modifica cliente auto-popola `firstName`/`lastName` dalla prima/resto parole del `name` esistente — senza che i tester debbano riscrivere niente. Confermato funzionante da Erik. Commit `a204ddf` + `fae89ee`, deploy READY.

**Sessione 12/06/2026 (v6.8) — modal centrato in tutta l'app + fix overflow input data (DEV+CORE):** **Eccezione approvata da Erik alla finestra pre-gate** ("non stravolgono la UX, migliorano l'usabilità"): il `Modal` condiviso (`components/ui.jsx`), usato da **tutti i popup dell'app**, passa da bottom-sheet (ancorato in basso, angoli arrotondati solo in alto) a **centrato** (in mezzo allo schermo, angoli arrotondati su tutti i lati `T.r.xl`, ombra più soft). Verificato prima con anteprima statica (`docs/test-m1/modal-centrato-anteprima.html/png`, committata) poi su produzione live. Commit `c979423` deployato READY. **Bug trovato da Erik subito dopo:** nel modal "Invita un cliente", il campo `<input type="date">` ("Data della consulenza") usciva dal bordo destro su mobile — causa: larghezza minima intrinseca dell'input data su Chrome Android, ora superiore allo spazio disponibile col modal centrato (margini laterali). **Fix 1:** aggiunto `min-width:0` alla regola globale `input,textarea,select` in `GlobalCSS.jsx` (commit `01b3ff3`, deployato READY). **Risultava ancora rotto su iOS Safari (PWA)** — screenshot di Erik dopo chiusura/riapertura app: causa diversa, bug noto di WebKit per cui `<input type="date">`/`time` dipinge oltre la larghezza impostata via CSS (icona calendario nativa fuori box-model). **Fix 2:** aggiunta regola `input[type="date"],input[type="time"]{-webkit-appearance:none;appearance:none}` in `GlobalCSS.jsx`, commit `acce757` deployato READY (`dpl_2kAMgbCQbZubwdNHyHtmEGRwftxd`). Effetto collaterale possibile: icona calendario nativa su iOS meno visibile (il campo resta tappabile). Nessun impatto su logica/dati, solo CSS — zero rischio per i tester nella finestra gate.

**Sessione 11/06/2026 (v6.7) — redesign per l'utente "freddo" + fix notifiche (DEV+CORE):** Tutto dietro stati vuoti/primo accesso → **invisibile ai tester con dati** (Moira/Luca), zero rischio nella finestra gate. **(1) 🔔 Fix notifiche [rotto → risolto]:** Vercel Hobby registra **max 2 cron**, ne avevamo 5 → giravano solo i 2 di Moira (report serale e notifiche Luca **non partivano**). Consolidati in **2 cron broadcast** (`api/notify.js` itera la lista `TESTERS`): follow-up **12:00**, inserimento + report a Erik **20:00**. Invii manuali invariati; `gate-report.js` → on-demand. **(2) 🎨 Redesign 360° empty state + onboarding** (2 anteprime approvate da Erik in `docs/test-m1/`): componente `<Empty>` che **insegna** (anteprima sbiadita + perché + azione + "filo" → "aggiungi un cliente"); **Home 1° accesso "Inizia da qui"** (via "Tutto fatto" fuorviante); **onboarding 7→6 step** con schermata **"aha"** (mini-telefono WhatsApp coi messaggi reali del settore) al posto delle 2 schermate-lettura, link Reviews tolto dallo step nome; **fix trappola Agenda/Ordini** (cliente-vuoto); Follow-Up distingue "non hai niente" da "oggi a posto"; **Feedback asciugata** (via lista "Ricevuti" morta, attiva solo col link recensioni, solo rimando Google + richiesta). **(3) 🤝 Aiuti contestuali:** **send-coachmark** `<SendCoach>` ("tocca WhatsApp") riportato ai **soli nuovi** (`sent===0`); **dritte "Lo sapevi?"** `<WarmTips>` per i **caldi** in Home (✏️ modifica messaggio · 🔕 disattiva follow-up · 🔗 invito via link, una alla volta, dismissibili, **tornano riaprendo l'app**); **festeggio 1° invio** (`<Celebration>`). I coachmark caldi *mirati* veri usciranno dalla chiamata diagnostica con Moira (questi 3 = scommesse sicure). **Verifica:** lint 0, build, **render headless 10/10** del flusso freddo, deploy READY (`bbba394`). Scopo: terreno pronto per un **tester freddo** post-gate. **Residuo:** giro estetico di Erik in incognito (fatto) + conferma Luca notifiche (domani).

**Sessione 10/06/2026 — workflow & pulizia repo (NESSUN codice app toccato):** (1) **Consolidati su `main`** i 3 branch paralleli (workflow, rischi-legali, social) + cancellati tutti i branch vecchi → **repo pulito, solo `main`** (verifica "0 commit fuori da main" prima di ogni cancellazione). (2) **Workflow:** regola **0b** ora verifica il deploy via **MCP Vercel** (non più dashboard, ID in CLAUDE.md); **`docs/check-sync.sh --fix`** auto-propaga lo stamp SYNC in CLAUDE.md (memoria a mano); criteri agenti paralleli Fase 3 scritti (`parking-lot.md`). Voto workflow interno 7.8 → **~8.7/10**. (3) **Deciso:** incoerenza emoji↔icone → **Strada A: tutto icone** (premium, coerente con PRODUCT.md), da fare **post-gate**. (4) Nuovo `docs/rischi-legali.md` (marchio/copyright/GDPR/fiscale) + contenuti social. **Audit UI invariato (29/40)** di proposito (nessun cambio app → si rifà post-gate insieme a icone+error-recovery). **I tester non vedono differenze.** Focus invariato: dati per il **gate 21/06**.

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

**✅ FATTO 10/06:** (1) **"Invita cliente" anche in Home** (sotto "Aggiungi cliente", riusa `InviteClient`); (2) **tasto "Aggiungi al calendario"** nel modale invito (ponte a un tap verso Google Calendar, come WhatsApp — *non* sync automatica, quella è Fase 3); `gcalLink` spostata in `helpers.js` e riusata in Agenda. Anteprima approvata, lint 0, build OK, provato live, deploy READY.

**▶️ FOCUS ORA → arrivare al gate con i dati.** **Gate rivisto il 10/06 (vedi `decisioni.md`): non più data fissa 21/06 ma "occasioni reali"** — Moira/Luca hanno una flessione di lavoro nuovo, quindi pochi giorni d'uso = mancanza di dati, non bocciatura. Nuovi criteri: copertura ≥80% dei clienti reali passati da Sliss + ~8 usi reali + valore + bilancio; check settimanale + backstop morbido fine luglio. **Regola della finestra:** non rompere l'abitudine dei tester, niente feature nuove, solo cose a rischio nullo.

### A · Durante l'attesa — NON espandere
- 📊 **Lasciar girare il tracking d'uso** (ogni apertura registra il giorno per tester). Niente da fare, solo lasciarlo lavorare.
- 🔔 **Leggere il report giornaliero** — la push automatica a Erik (`/api/gate-report`, 21 CEST) dà ogni sera giorni attivi Moira/Luca + follow-up + giorni al gate. Tenerlo d'occhio come polso del test.
- 👀 **Verificare che la v6.5 "attecchisca":** che Moira (e Luca) vedano la schermata Novità e usino "Invita cliente" senza intoppi. Se emergono attriti → annotare in `docs/test-m1/`, NON correre a patchare.
- 🤝 **TEST (ruolo TEST, lato Erik, non codice):** chiamata diagnostica con Moira · concordare il check settimanale · kickoff formale Luca. (Vedi *Blocchi attivi*.)
- 🗳️ **Preparare la decisione go/no-go** (metrica 10/06, non più data fissa): `GET …/api/track?tester=moira` (e `luca`) per gli usi reali, + chiedere a Moira la **copertura** ("dei clienti avuti, quanti con Sliss?"). Applicare i criteri di `decisioni.md` (copertura ≥80% + ~8 usi + valore + bilancio; rif. Moira; backstop fine luglio).
- ⏸️ *Candidato anticipabile solo se serve (safety, non estetica):* rendere **visibili i fallimenti di backup**. Deciso 09/06 di **lasciarlo post-gate** salvo problemi reali.

### B · Post-gate (dopo la decisione gate)
**B0 · Pulizia del temporaneo (subito dopo la decisione):**
- ⚠️ Notifiche: togliere il `report` dal cron serale (`/api/notify?type=inserimento&report=1` in `vercel.json`) + la funzione `sendGateReport` in `notify.js` (e/o `api/gate-report.js`).
- ⚠️ Rimuovere il blocco "periodo di convalida → presa in carico seria" da `UpdateNudge.jsx` (commento già segnato nel file).
- ⚠️ Coachmark di fase test: `<SendCoach>` (solo nuovi) e `<WarmTips>` "Lo sapevi?" (caldi) — rivedere/rimuovere o sostituire coi coachmark mirati emersi dalla chiamata con Moira.

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
