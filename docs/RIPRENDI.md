# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 22/06/2026 — Fase 1 · ruolo CORE/TEST/DEV
**Tutto committato e pushato:** sì (HEAD = `ad62058`). ⚠️ **Deploy Vercel da verificare a casa** (vedi sospeso sotto).

## Cosa è successo l'ultima volta (22/06)
- Novità tester: Moira ha installato l'app su **desktop**, notifiche ok, aperta oggi (2 clienti, 2 inviati). Report broadcast ora raggiunge entrambi.
- **Incidente dati Luca (20/06):** Erik ha aperto il link di Luca da PC senza accorgersi del codice → contesto vuoto "Nathan/officine" ha sovrascritto tracking + backup di Luca lato server. Dati reali **salvi sul suo telefono** (verificato).
- **Fix DEV (commit `ad62058`):** portato in `api/track.js` lo stesso guard anti-overwrite-empty di `backup.js`. Non si ripete più. Lint pulito.
- Tutto registrato in `docs/test-m1/feedback-log.md` (check 22/06 per Moira e Luca).

## ⏸️ SOSPESO — da fare a casa
1. **Verificare auto-riparazione dati Luca:** Erik gli ha fatto riaprire l'app. Controllare (da browser loggato Vercel, oppure approvando l'MCP Vercel):
   - `https://sliss-platform.vercel.app/api/track?tester=luca` → `clients`/`followUpsSent` devono essere **> 0**
   - `https://sliss-platform.vercel.app/api/backup?tester=luca` → `businessName` deve essere **Kayek3D** (non "Nathan")
2. **Verificare deploy Vercel** del fix: deployment con `githubCommitSha` = `ad62058` in stato READY.

## ▶ Prossimo passo (quando riprendi)
**Giro TEST con Luca** (ruolo TEST, non codice): raccogliere a voce la conferma "valore" ("ti dà valore? vuoi continuare?") + il dato **copertura** ("dei clienti avuti, quanti gestiti con Sliss?"). Gancio naturale = i 2 riscontri recensione positivi. È la mossa a €0 che avvicina di più la beta-a-pagamento.

Dettaglio completo: `docs/stato-progetto.md`.
