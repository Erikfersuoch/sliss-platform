# CLAUDE.md — Sliss Platform

<!-- SYNC ▸ v7.3 · 2026-06-21 · fonte: docs/stato-progetto.md
     Versione / fase / stato tester NON si scrivono qui: vivono solo in docs/stato-progetto.md.
     Questa riga è solo un checksum: a fine sessione verifica che combaci con la FONTE DI VERITÀ. -->

> Questo file viene letto automaticamente da Claude Code ad ogni sessione.
> Non serve spiegare il progetto da zero: il contesto è qui.

---

## Cos'è Sliss

Piattaforma web modulare per micro-business (tatuatori, barber, estetiste, officine, stampa 3D, negozi). Automatizza follow-up, reminder, FAQ, onboarding clienti. Due flussi paralleli: servizi (con appuntamenti) e prodotti (con ordini).

**Stack:** React (Vite) + Vercel + GitHub
**Repo:** github.com/Erikfersuoch/sliss-platform
**Deploy:** Vercel (attivo) — sliss-platform.vercel.app
**App:** versione corrente → vedi `docs/stato-progetto.md`. Struttura: `src/App.jsx` = solo root (stato + Provider + routing viste). Pagine in `src/pages/` (Home, FollowUp, Appointments, Orders, Clients, Templates, Feedback, Settings, ModulesMap, Onboarding); `src/components/` (Nav, ErrorBoundary, ui, Icon, SlissLogo, FeedbackNudge); logica condivisa: config.js, storage.js, helpers.js, context.js, theme.js, GlobalCSS.jsx, followups.js, push.js
**UI:** tema chiaro/scuro (opt-in da Impostazioni, default chiaro · token CSS `--c-*` in `index.html`, scelta in `localStorage['sliss-theme']`) · accent verde #16A34A · velature verdi sullo sfondo · mobile-first (barra superiore con logo + "Altro"; isola flottante in basso con 4 voci + tasto "+") · sidebar desktop
**Storage:** localStorage · chiavi: `sliss-v4`, `sliss-onboarded-v4`
**Onboarding:** 5 step — nome attività → tipo (servizi/prodotti) → cluster settore
**Flussi:** Servizi (Appuntamenti + 4 follow-up) · Prodotti (Ordini + 5 follow-up)
**Modulo attivo:** M1 Follow-Up — non toccare M2, M3, M5, M6, M9

---

## Chi sono

Mi chiamo Erik. Non sono sviluppatore, ma ho forte capacità sistemica e progettuale.
Ho 10-15h/settimana variabili (sere + frammenti + weekend).
Uso Claude Code come moltiplicatore operativo, non come tutor di coding.

**Il mio obiettivo con Sliss:** costruire un one-man business sostenibile.
**Rischio principale:** dispersione cognitiva — molte idee, poco focus.
**Regola sempre attiva:** una cosa alla volta. Il resto va in docs/parking-lot.md.

---

## Come lavoriamo insieme

Ad ogni sessione dichiaro un ruolo:

| Ruolo | Perimetro |
|---|---|
| **CORE** | Strategia, priorità, coordinamento generale |
| **DEV** | Solo codice React — un passo alla volta, con conferma prima di procedere |
| **TEST** | Gestione tester (moglie + futuro terzo), feedback, metriche |
| **BUSINESS** | Pricing, pitch, documenti commerciali — solo da Fase 3 in poi |

Se tocco un tema fuori perimetro, segnalarmelo e dirmi dove portarlo.

---

## Regole operative per Claude Code (ruolo DEV)

0. **Fine sessione — SEMPRE committare E verificare Vercel.** Prima di chiudere Claude Code: (a) `git add -A && git commit -m "sessione: [descrizione breve]" && git push`; (b) verifica il deploy via **MCP Vercel** (non più dashboard): chiama `list_deployments` (projectId `prj_zRT2Bo7tBfUCVTUJ2uafqPYDNKzH`, teamId `team_UABbdaEYXFV3dNFiFVj4Lut3`) e conferma che esista un deployment con `githubCommitSha` = HEAD locale (`git rev-parse HEAD`) e `state: READY`. Se manca o non combacia, esegui `git commit --allow-empty -m "chore: trigger redeploy" && git push` per forzare il deploy. Senza questa verifica, il codice committato può non essere mai deployato (webhook Vercel→GitHub inaffidabile). *Fallback:* se l'MCP Vercel non è collegato nella sessione, controlla a mano sulla dashboard. (c) **Allineamento doc:** se è cambiata versione/fase/stato, aggiorna la riga `SYNC ▸ FONTE DI VERITÀ` in `docs/stato-progetto.md`, poi propaga negli altri stamp `SYNC ▸`: per CLAUDE.md basta `bash docs/check-sync.sh --fix` (lo stamp della **memoria** di Claude va allineato a mano), e verifica con `bash docs/check-sync.sh` (deve stampare "OK: stamp allineati"). Gli stamp devono SEMPRE combaciare con la fonte.

1. **Un passo alla volta.** Proponi, aspetta conferma, esegui.

1b. **Stato del progetto — verificare SEMPRE prima di affermare.** Prima di dire cosa è deployato, cosa è su main, cosa contiene un file: verificare con `git log origin/main -1`, `git status`, `git log --oneline origin/main..HEAD`. Mai assumere dalla memoria. Il SessionStart hook mostra il contesto all'avvio — usarlo. Docs e configurazione Claude Code (`docs/`, `CLAUDE.md`, `.claude/settings.json`, `scripts/`) vanno committati **direttamente su main**, mai su branch laterali che possono divergere silenziosamente.
2. **Spiega sempre dove mettere le cose.** Non assumere che sappia dove si trova un file.
3. **Non toccare mai:** M2, M3, M5, M6, M9 — bloccati fino a validazione M1.
4. **Non toccare mai:** Supabase, pricing, sito vetrina — bloccati fino a Fase 3.
5. **Quando proponi modifiche UI/UX:** mostra prima cosa cambieresti e perché, poi aspetta ok.
6. **Se vedi dispersione** (sto chiedendo cose fuori focus): bloccami e riportami all'obiettivo della sessione.
7. **Notifiche push — hardcoded per tester attuali.** ⚠️ **Vercel Hobby = MAX 2 cron job.** Avevamo 5 cron (2 per tester + report) → Vercel ne registrava solo 2 in silenzio (per questo report e notifiche Luca non partivano). Ora **2 soli cron** in `vercel.json` che fanno **broadcast a tutti i tester** (lista `TESTERS` in `api/notify.js`): follow-up **12:00 CEST** (`?type=followup`), inserimento + report a Erik **20:00 CEST** (`?type=inserimento&report=1`). Orari **condivisi** tra i tester (il per-utente fine richiederebbe più cron → arriva con la schermata orari in Fase 3, non generalizzare oltre la lista `TESTERS`). Gli **invii manuali singoli** restano `?target=&type=` (aggiornamento/feedback/conferma). Il report giornaliero è dentro `notify.js` (`sendGateReport`); `api/gate-report.js` resta come endpoint manuale on-demand, non più schedulato. Hobby plan: 1x/giorno, precisione ±59min.
8. **PWA su iPhone — solo Safari.** Le notifiche push PWA funzionano solo da Safari iOS. L'onboarding deve guidare esplicitamente: apri con Safari, non con Chrome.
9. **Scheda cliente è parte di M1**, non modulo separato. Dati: visite totali, data ultimo appuntamento, recensione lasciata, stato ciclo follow-up.
10. **docs/social.md** è il riferimento per tutta la comunicazione social.

---

## Flusso agentic (default su ogni modifica)

> Obiettivo: ridurre la dipendenza dalla fiducia. Erik è non-dev e non legge il codice — la correttezza la deve poter **verificare dal sistema**, non dalla mia parola.
> **Le due cose insieme (non in alternativa):** (1) *applicarle sempre di default* — il passo non salta mai, lo garantisco io anche se Erik è stanco/di fretta (rete di sicurezza); (2) *renderle esplicite a Erik passo per passo* — nominare il punto A/B/C/D + una riga di perché, coinvolgerlo nella decisione, così interiorizza il modo di pensare agentic. NON applicarle in silenzio. Man mano che un passo diventa automatico per lui, lo guida lui e io resto il backstop che non lo lascia cadere; lì alleggerire la spiegazione.

A. **Definire "fatto" PRIMA di costruire (spec-first).** Prima di scrivere codice, concordare in italiano normale una piccola lista *"Fatto quando: a)… b)… e NON deve rompere…"*. È il righello di Erik per accettare il lavoro senza leggere codice. A fine modifica si spuntano le caselle insieme.

B. **"Visto funzionare", non "fidati".** Prima di dichiarare fatto, aprire l'app vera, eseguire il comportamento e mostrarne la **prova visiva** (screenshot/registrazione via `/verify` o `/run`). "Build verde" ≠ "funziona per l'utente" (cfr. bug cron: build ok, notifiche ferme). La prova è il comportamento osservato, non la compilazione.

C. **Il guardiano è il sistema, non la memoria.** (C1) I controlli automatici devono girare **da soli a ogni push** (CI su GitHub Actions) — non dipendere dal lancio manuale di `npm test`. *Montabile ora, rischio zero.* (C2) Aggiungere **test sui flussi utente** veri (es. "crea cliente + appuntamento → genera i follow-up giusti nelle date giuste"), oltre a quelli sul guardiano dati già presenti. *Meglio post-gate: toccano logica viva.*

D. **Secondo paio d'occhi (bonus).** Per modifiche non banali, passare le mie modifiche a una review indipendente (`/code-review`) prima che vadano online — non controllarmi da solo il lavoro.

---

## Regole tecniche (imparate dai bug — non ripetere)

1. **STORAGE — sempre localStorage.** `window.storage` esiste solo in Claude Artifacts. Su Vercel crasha silenziosamente. Il wrapper è in App.jsx: `const storage = { get, set, remove }`.

2. **PHASES centralizzato.** Ogni fase follow-up (servizi e prodotti) DEVE essere nell'oggetto `PHASES` globale. Se manca, Follow-Up crasha con "Cannot read properties of undefined (reading 'icon')".

3. **Guards sui dati.** MAI `data.tableName` diretto. Sempre `data?.tableName || []`. Le tabelle nuove possono essere undefined nei dati salvati da sessioni precedenti.

4. **CSS — una sola regola `*{}`.** Due regole `*{}` separate si sovrascrivono e rompono font-family.

5. **Context fuori Provider.** Componenti che usano `useSliss()` devono stare dentro `<Ctx.Provider>`. Se servono dati fuori dal Provider, passarli come prop.

---

## Stato del progetto

Leggi sempre `docs/stato-progetto.md` per lo stato aggiornato.

**Fase corrente:** 1 — Fondazione
**Obiettivo fase:** setup sistema operativo + M1 in mano al tester reale da 14 giorni
**Gate per passare alla Fase 2:** metrica "occasioni reali" (rivista 10/06, vedi `docs/decisioni.md`): copertura ≥80% dei clienti reali passati da Sliss + ~8 usi reali + valore + bilancio. Niente data fissa; check settimanale + backstop morbido fine luglio.

---

## Struttura docs/

```
docs/
  stato-progetto.md     → stato attuale, blocchi, prossimi passi (documento vivente)
  decisioni.md          → log delle decisioni importanti con data e motivazione
  parking-lot.md        → idee da rivalutare in futuro, non adesso
  note-al-volo.md       → inbox cattura rapida di Erik (idee/dubbi al volo, da smistare). Usata anche da remoto.
  social.md             → comunicazione social: post pubblicati, idee, prossimi contenuti
  settimane/            → una nota per settimana (obiettivo + cosa è successo)
  test-m1/              → feedback tester, metriche, log osservazioni
```

---

## Principi che guidano ogni decisione

1. Validare prima di espandere
2. Strutturare prima di scalare
3. Eseguire prima di ottimizzare
4. Semplificare prima di automatizzare
5. Keep it simple — sempre

---

*Sliss · liscio come deve essere.*
