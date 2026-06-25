# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 25/06/2026 (sera) — Fase 1 · ruolo DEV/CORE (M3 servizi: auto-aggiornamento Richieste validato dal vivo PC↔cell + orario appuntamento + 3 fix; disegnato col CORE il flusso conferma/follow-up post-seduta)
**Tutto committato e pushato:** sì, repo = solo `main`. ⚠️ Webhook Vercel a volte salta: se un commit `src` non si deploya, forza con `git commit --allow-empty -m "trigger redeploy" && git push`.

## Cosa è successo (25/06 sera, sessione DEV — M3 servizi: auto-aggiornamento + orario + fix)
Tutto live, ognuno provato da Erik dal vivo (PC incognito = "finto Moira" ↔ cellulare = cliente, owner finto `prova1`/`moira-test`).
- ✅ **Auto-aggiornamento lista Richieste** (`4b17002`): controllo della cassetta server all'avvio + ogni 60s + al rientro (visibilitychange), non più solo al mount. **Validato dal vivo.**
- ✅ **Bottone "Aggiungi a Google Calendar"** (`0e682cb`): nella conferma del modal prenotazione→appuntamento (solo servizi), riusa `gcalLink`. **Validato.**
- ✅ **Fix hero Home servizi** (`6a91727`): le prenotazioni in attesa hanno priorità sul "Inizia da qui / nessun cliente" (bug pre-esistente: l'hero "Prenotazione in attesa" era nascosto dal blocco noClients). **Emerso dal test.**
- ✅ **Orario sull'appuntamento** (`5c27b7e`): campo Ora (opzionale, HH:MM) in creazione (modal Richieste + form Agenda) e visualizzazione (hero, lista Agenda, dettaglio calendario, ordinati per ora). Retrocompatibile. **Fondazione per il +3h.**
- ✅ **Fix "richieste eliminate tornano"** (`09e7e69`): registro locale `sliss-richieste-seen-<owner>` → una richiesta eliminata resta eliminata, non più ripescata dalla cassetta ogni 60s. (Era la "ridondanza dopo cancellazione" vista nei test.)

## ▶ Prossimo passo (sequenza concordata col CORE per il flusso prenotazione→appuntamento)
**Decisione di design (25/06):** la trattativa su data/ora resta **umana, su WhatsApp** — Sliss NON la automatizza (per tatuaggi/PMU è il cuore del mestiere). Ruoli: *conversazione* = professionista; *nebbia intorno* = Sliss (non perdere il lead + dare il messaggio giusto pronto al momento giusto). Il cliente dal link `prenota` atterra già nella chat WA del professionista; quando si accordano, lui apre Sliss e fissa data+ora concordate.

1. **PUNTO 2 (prossimo, già OK da Erik) — Messaggio di CONFERMA alla creazione appuntamento:** fissato data+ora, Sliss prepara la conferma da inviare con un tap (*"Ciao [Nome], confermato! Ti aspetto [data] alle [ora] per [servizio] 🖤"*). Diventa **la vera azione dell'hero** ("DA FARE ADESSO: manda la conferma a [Nome]" + Invia su WhatsApp) → risolve l'hero-loop che confondeva Erik. Tecnicamente = nuova fase follow-up **"conferma"** (parte subito, scheduledDate = oggi). Ricorda: ogni fase va in `PHASES` + nei chip Agenda + template.
2. **PUNTO 3 — Ringraziamento DOPO la seduta:** parte a **ora appuntamento + 3h** (es. seduta alle 15 → grazie alle 18), non più +0 dal giorno. Usa il nuovo campo orario. Sistema il "grazie per oggi" che oggi può partire prima della seduta.
3. **Ordine fasi servizi** dopo i punti 2-3: conferma (subito) → ringraziamento (seduta +3h) → controllo +7 → recensione +21 → riattivazione +60.
4. 🅿️ **Parcheggiato:** "Segna completato" per sedute multiple (tatuaggi a più sedute → eccezione, l'80% sono sedute singole dove +3h basta).

**Ambiente di prova:** PC incognito `sliss.it/?tester=provaX` + cell `sliss.it/prenota?o=provaX&biz=Test&wa=393337887794`. Per un test vergine usa un owner **nuovo** (cassetta vuota). NB cache PWA: per vedere una versione nuova serve finestra incognito nuova, non solo F5.

**In sospeso da prima (non toccato oggi):**
- Moira: messaggio benvenuto WA `sliss.it/prenota?o=moira&biz=MomoInk&wa=393337887794` + validare FAQ (al momento naturale).
- Luca: flip pulsanti diretto/eBay in `richieste.html` (copy pronto) + go-live WA + link eBay reali.

Dettaglio: `docs/stato-progetto.md` · `docs/spec-m3-richieste*.md` · `docs/decisioni.md` · `docs/parking-lot.md`.
