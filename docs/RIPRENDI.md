# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 23/06/2026 — Fase 1→2 · ruolo CORE/TEST/DEV
**Tutto committato e pushato:** sì.

## Cosa è successo l'ultima volta (23/06)
- **Gate M1 Luca = GO** — tutti i criteri soddisfatti (copertura 100%, 15+ usi, valore confermato).
- **M3 Richieste sbloccato** — Erik: "sblocchiamo M3". Spec validata, trial approvato da Luca. CLAUDE.md aggiornato.
- **Brand chiuso:** one-liner + tagline live, `social.md` aggiornato.
- **Dominio:** `sliss-operations.it` scelto. **Da registrare a casa.**

## ✅ DOMINIO FATTO (23/06, a casa)
1. **Registrato `sliss.it`** (era libero! niente trattino — meglio del previsto) su SupportHost (€9,84/anno). DNS configurato: record **A `@` → `216.198.79.1`** (IP Vercel nuovo) nel cPanel Zone Editor (Attiva Gestione DNS); nameserver `ns.supporthost.*` invariati; dominio aggiunto al progetto Vercel `sliss-platform`. **In propagazione** — nuovo `.it`, può servire qualche ora per uscire da `dnsHold`. Quando risolve, Vercel valida e mette l'https da solo. *Opzionale dopo: far funzionare anche `www.sliss.it` (CNAME) — 2 min.*

## ▶ Prossimo passo (quando riprendi)
**M3 Richieste — preparazione build.** Prima di scrivere codice, raccogliere da Luca: 1) screenshot etichette WA, 2) 3-4 messaggi reali clienti, 3) volume settimanale. Spec completa in `docs/spec-m3-richieste.md`.

**In parallelo:** attesa attiva su Moira (gate M1 lato suo ancora aperto — nessuna sollecitazione).

Dettaglio completo: `docs/stato-progetto.md`.
