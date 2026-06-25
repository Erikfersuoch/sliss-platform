# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 25/06/2026 — Fase 1 · ruolo DEV/CORE (M3 servizi live per Moira + pulizia generale + stabilizzazione multi-postazione)
**Tutto committato e pushato:** sì, repo = solo `main`. ⚠️ Webhook Vercel a volte salta: se un commit `src` non si deploya, forza con `git commit --allow-empty -m "trigger redeploy" && git push`.

## Cosa è successo (25/06, sessione pulizia)
- 🎯 **M3 servizi COMPLETO e LIVE per Moira** (`3e5d961`, era fermo su un branch non fuso): l'API salva tel/servizio/note; in HomeServizi compaiono hero "Prenotazione in attesa" + modulo Richieste col contatore (**Moira ora vede le prenotazioni**); prenotazione → appuntamento + follow-up. Deploy READY. (La pagina pubblica `prenota.html` era già live dal 24/06, Moira l'aveva approvata.)
- 🧹 **Pulizia generale:** repo riportato a solo `main` (recuperati 3 branch: feature M3, autocertificazione AI+PDF, log social); `stato-progetto.md` 6.200→~1.900 parole, storia ≤20/06 in `docs/archivio/`; memoria sgonfiata.
- 🛡️ **Sistema anti-appesantimento:** `docs/protocollo-contesto.md` + `docs/check-contesto.sh` (righello). Integrato nell'auto-healing.
- 🔗 **Stabilizzazione multi-postazione:** `session-start.sh` ora rileva "sei indietro" + "lavoro non fuso su branch"; regola 1c in CLAUDE.md (sync-first, sempre merge-to-main, aprire Claude DENTRO il repo).

## ▶ Prossimo passo (quando riprendi)
1. **Moira: impostare il messaggio di benvenuto WA** col link `sliss.it/prenota?o=moira&biz=MomoInk&wa=393337887794` + validare con lei le FAQ (al momento naturale, non sollecitare).
2. **Luca: flip pulsanti diretto/eBay** in `richieste.html` (proposto, copy pronto, aspetta ok Erik) + go-live messaggio benvenuto WA + link eBay reali nei campi `ebay`.
3. **Auto-aggiornamento** della lista Richieste (no refresh manuale). [feedback Erik]
4. *(Panificio: spec o attesa dati reali — Erik non ha ancora scelto. Slice 2+ Home a moduli: dopo feedback tester.)*

Dettaglio: `docs/stato-progetto.md` · `docs/spec-m3-richieste*.md` · `docs/decisioni.md` · `docs/parking-lot.md`.
