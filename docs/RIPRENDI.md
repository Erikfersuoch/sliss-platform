# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 25/06/2026 — Fase 1 · ruolo DEV (pagina Prenota per servizi MomoInk/Moira)
**Tutto committato e pushato:** sì. ⚠️ **Webhook Vercel↔GitHub inaffidabile:** se un commit `src` non si deploya (controlla via MCP `get_deployment` sul branch alias), forza con `git commit --allow-empty -m "trigger redeploy" && git push`.

## Cosa è successo (25/06)
- 📅 **PAGINA PRENOTA PER SERVIZI costruita e live** (`265dbcf`). `public/prenota.html` — chat guidata per MomoInk (Moira) con 3 rami:
  - **🔍 Ho una domanda** → 8 FAQ tattoo (costo, dolore, acconto, colori…) — risposta automatica, zero disturbo a Moira
  - **📋 Info prima/dopo il trattamento** → istruzioni preparazione + aftercare (5+8 punti)
  - **📅 Voglio prenotare** → scelta servizio (sessione/ritocco/flash/consulenza/copertura/PMU) + nome/cognome/telefono/note → submit su WhatsApp
  - Default: `biz=MomoInk`, `o=moira`, `wa=393337887794`. Parametrizzata via URL come quella di Luca.
  - Rewrite Vercel `/prenota` → `/prenota.html` aggiunto a `vercel.json`.
- ✅ **Moira ha provato e approvato** — "sorpresa positivamente".
- 📝 **Messaggio di benvenuto WA** pronto per Moira da impostare su WhatsApp Business.

## Cosa era successo (24/06)
- Home a moduli Slice 1 costruita (prodotti + servizi). Calibrazione Luca (3 risposte processate). Link pulito `/richieste`. Spec M3 servizi. Pagina aggiornamento Moira. Panificio al parking-lot.

## ▶ Prossimo passo (quando riprendi)
1. **Moira: impostare il messaggio di benvenuto WA** con il link `sliss.it/prenota?o=moira&biz=MomoInk&wa=393337887794`.
2. **Validare le FAQ con Moira** — chiedere se vuole aggiustare risposte/prezzi/aftercare. Usare le sue domande reali come aggancio.
3. **Luca: flip pulsanti diretto/eBay** in `richieste.html` — proposto, copy pronto, aspetta ok di Erik.
4. **Luca: go-live messaggio di benvenuto WA** col link Richieste.
5. **Auto-aggiornamento** della lista Richieste (no refresh manuale). [feedback Erik]
6. **Link eBay reali:** URLs manuali dalle inserzioni attive di Luca → riempire i campi `ebay` in `richieste.html`.
7. *(Panificio: spec o attesa dati reali dal panettiere — Erik non ha ancora scelto.)*

Dettaglio: `docs/spec-m3-richieste.md` · `docs/spec-m3-richieste-servizi.md` · `docs/decisioni.md` · `docs/parking-lot.md`.
