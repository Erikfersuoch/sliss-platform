# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 22/06/2026 — Fase 1 · ruolo CORE/TEST/DEV (chiusura sospeso a casa)
**Tutto committato e pushato:** sì (HEAD = `c7ff33d`). ✅ **Deploy Vercel verificato READY su HEAD.** Nessun sospeso aperto.

## Cosa è successo l'ultima volta (22/06)
- Novità tester: Moira ha installato l'app su **desktop**, notifiche ok, aperta oggi (2 clienti, 2 inviati). Report broadcast ora raggiunge entrambi.
- **Incidente dati Luca (20/06):** Erik ha aperto il link di Luca da PC senza accorgersi del codice → contesto vuoto "Nathan/officine" ha sovrascritto tracking + backup di Luca lato server. Dati reali **salvi sul suo telefono** (verificato).
- **Fix DEV (commit `ad62058`):** portato in `api/track.js` lo stesso guard anti-overwrite-empty di `backup.js`. Non si ripete più. Lint pulito.
- **Fix DEV (commit `0be5bf4`):** "Invita cliente" nascosto nel flusso **prodotti** (Luca) — non aveva senso (link legato a un appuntamento). Tolto da tutti e 5 i punti (+, Home banner+lista, Clienti header+empty). Flusso servizi invariato. Lint 0, build verde.
- Tutto registrato in `docs/test-m1/feedback-log.md` (check 22/06 per Moira e Luca).

## ✅ SOSPESO CHIUSO (22/06, a casa)
1. **Auto-riparazione dati Luca: confermata.** `api/track?tester=luca` → `clients: 6`, `followUpsSent: 15` (>0). `api/backup?tester=luca` → `businessName: Kayek3D` (non più "Nathan"), 6 clienti reali presenti. Il guard anti-overwrite-empty (`ad62058`) ha tenuto: l'incidente del 20/06 è rientrato del tutto.
2. **Deploy Vercel: verificato.** Ultimo deployment produzione READY su HEAD `c7ff33d` (oltre il `0be5bf4` richiesto). Fix "Invita cliente" e guard track live.

## ▶ Prossimo passo (quando riprendi)
**Attesa attiva** (ruolo TEST, non codice): lasciar usare Luca e Moira **senza sollecitare**. Erik ha deciso (22/06) di non fare pressing — coi tester le info si raccolgono su occasione naturale, non a calendario. Riprendere il giro TEST (conferma "valore" + dato **copertura** "dei clienti avuti, quanti gestiti con Sliss?") **solo su aggancio naturale** (è il tester a scrivere, arriva un'altra recensione) o se cambia qualcosa lato tester. Messaggio già pronto in archivio — gancio = i 2 riscontri recensione positivi. È la mossa a €0 che avvicina di più la beta-a-pagamento, ma va giocata al momento giusto, non forzata.

Dettaglio completo: `docs/stato-progetto.md`.
