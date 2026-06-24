# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 24/06/2026 — Fase 1 · ruolo CORE/DEV (Home a moduli costruita + M3 servizi spec + aggiornamento Luca)
**Tutto committato e pushato:** sì. ⚠️ **Webhook Vercel↔GitHub inaffidabile:** se un commit `src` non si deploya (controlla via MCP `get_deployment` sul branch alias), forza con `git commit --allow-empty -m "trigger redeploy" && git push`.

## Cosa è successo (24/06)
- 🏠 **HOME A MODULI — Slice 1 COSTRUITA e live** (`0515555`). Split architetturale: `HomeProdotti` (nuova) vs `HomeServizi` (estratta, comportamento invariato = zero rischio per Moira).
  - **Hero dinamico** con priorità: richiesta in attesa (la più vecchia) → ordine da spedire → follow-up scaduto. Completare un'azione → la successiva emerge. Tutto fatto → "Tutto sotto controllo ✓" + suggerimento.
  - **Righe modulo compatte**: Richieste (n nuove), Ordini (n da spedire), Follow-Up (n da inviare) — pill amber/green, cliccabili.
  - **Filo di sinergia** tra moduli ("diventa un ordine", "accende i follow-up").
  - **Colore = stato, non modulo**: amber = da fare, green = in pari, grey = info. Icone modulo tutte brand tint.
  - Mockup v2 UX-reviewed prima di costruire (`docs/test-m1/home-moduli-anteprima-v2.html`).
- 🟠 **M3 "In validazione"** nella Mappa Moduli (`03ae5f3`): nuovo stato tra "planned" e "active" — badge amber, bordo amber, pallino arancione pulsante.
- 📬 **Pagina aggiornamento per Luca** (`04b6fd6`): `public/aggiornamento-luca.html` — mockup mini-telefono della nuova Home, flusso Richieste in 3 passi, link con tasto copia (`sliss.it/richieste.html?o=luca`), testo welcome WA pronto, 3 domande di calibrazione. **INVIATA, in attesa di feedback.**
- 📋 **Spec M3 Richieste per SERVIZI** (`docs/spec-m3-richieste-servizi.md`): tre rami — FAQ (auto, zero server), Info pre/post trattamento (auto, zero server), Prenotazione (submit → notifica). Unifica M3+M6+parte M2.
  - **Banco FAQ per 5 cluster** (tattoo, barber, beauty, officine, artigiani) — ~8 domande ciascuno, da ricerca di mercato.
  - **Supporto materiale proprio del professionista** (brochure/PDF/immagini) — il chat li serve come card, con fallback a FAQ precompilate.
  - Roadmap personalizzazione v1→v2→v3. Piano build in 5 slice.
- Gate M1 Luca = GO (sessione precedente). Moira: **attesa attiva** (gate aperto, non sollecitare).

## ▶ Prossimo passo (quando riprendi)
1. **Attendere feedback di Luca** sulla pagina aggiornamento — le 3 risposte (screenshot etichette WA, 3-4 messaggi reali, volume settimanale) servono per rifinire M3 beta.
2. **Go-live M3 coi clienti veri:** Luca imposta il **messaggio di benvenuto** WhatsApp Business col link (testo pronto in `aggiornamento-luca.html`; numero Kayek3D `393458983135`).
3. **Auto-aggiornamento** della lista Richieste (no refresh manuale — poll o refresh al rientro). [feedback Erik]
4. **Link eBay reali:** export CSV dal Seller Hub di Luca → riempire i campi `ebay` in `richieste.html` (deep-link scheda).
5. **Validare il banco FAQ servizi con Moira** — al momento naturale, non sollecitare. Usare come aggancio le sue domande reali.
6. *(Slice 2+ Home a moduli: completare HomeServizi, stato calmo avanzato — dopo feedback Luca/Moira.)*

Dettaglio: `docs/spec-m3-richieste.md` · `docs/spec-m3-richieste-servizi.md` · `docs/decisioni.md` · `docs/parking-lot.md`.
