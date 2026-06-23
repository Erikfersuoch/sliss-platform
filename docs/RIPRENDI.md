# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 23/06/2026 — Fase 2 · ruolo CORE/DEV (sessione monster: dominio + M3 costruito completo)
**Tutto committato e pushato:** sì. ⚠️ **Webhook Vercel↔GitHub inaffidabile:** se un commit `src` non si deploya (controlla via MCP `get_deployment` sul branch alias), forza con `git commit --allow-empty -m "trigger redeploy" && git push`.

## Cosa è successo (23/06)
- 🌐 **`sliss.it` REGISTRATO e LIVE** (HTTP 200, https ok). SupportHost €9,84/anno; DNS A `@`→`216.198.79.1` nel cPanel Zone Editor; aliasato su Vercel. *(Opzionale dopo: `www.sliss.it` CNAME; far puntare welcome+link a `sliss.it`.)*
- 🏗️ **M3 "Richieste" COSTRUITO, COMPLETO e online** — da spec a modulo funzionante in 4 slice:
  - **Slice 1** — chat pubblica `public/richieste.html`: flusso = DATI ("script di Luca") + motore; categorie eBay reali; finale prodotto = bivio eBay/diretto (nome+cognome sempre) + Personalizzala; su-misura. **Provata sul telefono.**
  - **Slice 2** — cassetta server `api/richiesta-submit.js` + `api/richiesta-list.js` (Upstash, lista per owner, push immediata). **Verificata (POST→GET ok).**
  - **Slice 3** — sezione **Richieste** nell'app (`src/pages/Richieste.jsx`) + raccolta auto all'avvio (`/api/richiesta-list`, dedup per id) + voce nav. Lint/build/45-test verdi.
  - **Slice 4** — **"Crea ordine"**: richiesta → cliente + ordine + 5 follow-up (riuso `buildProductFollowUps` = sinergia M1). "Presa in carico" = stato intermedio.
- Gate M1 Luca = GO (sessione precedente). Moira: **attesa attiva** (gate aperto, non sollecitare).

## ▶ Prossimo passo (quando riprendi)
1. **Rivedere/approvare l'anteprima `docs/test-m1/home-moduli-anteprima.html`** — Home a moduli (ogni modulo un suo spazio + task, gestire quasi tutto da lì), barra che raggiunge i moduli, "Altro" = gestione Sliss, sinergia visibile col "filo". È un **redesign della scocca → tocca M1 → design-first**, poi costruire. (Scaling a pacchetti Smart/Pro/Enterprise = Fase 3, in parking-lot.)
2. **Auto-aggiornamento** della lista Richieste (no refresh manuale — poll o refresh al rientro). [feedback Erik]
3. **Link eBay reali:** export CSV dal Seller Hub di Luca → riempire i campi `ebay` in `richieste.html` (deep-link scheda). Stesso CSV = seme del futuro "importa inventario".
4. **Go-live M3 coi clienti veri (SOLO ora che è completo):** Luca imposta il **messaggio di benvenuto** WhatsApp Business col link (testo pronto; numero Kayek3D `393458983135`). Far puntare i link a `sliss.it`.
5. **Verifica end-to-end** dall'app: `https://sliss.it/?tester=demo` → manda richiesta dal link (`…/richieste.html?o=demo&wa=393458983135`) → Richieste → Crea ordine → Ordini+Follow-Up.

Dettaglio: `docs/spec-m3-richieste.md` · `docs/decisioni.md` · `docs/parking-lot.md`.
