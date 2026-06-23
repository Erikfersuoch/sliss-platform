# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 23/06/2026 — Fase 1 · ruolo CORE/TEST/DEV
**Tutto committato e pushato:** sì (HEAD = `4958a86`).

## Cosa è successo l'ultima volta (23/06)
- **Check test:** feedback 23/06 registrato — UI nuova piace a entrambi i tester, richiesta notifiche smart "da fare oggi" (parking-lot, Fase 3), Moira in fase di adozione attiva, Luca valuta trial M3.
- **Brand chiuso:** one-liner ufficiale ("Sliss aiuta professionisti e piccole attività a curare i clienti senza perdere tempo"), tagline "Liscio come deve essere" live nell'app (Nav.jsx), `social.md` aggiornato.
- **Dominio:** `sliss.it`/`.com` non disponibili. Scelto `sliss-operations.it` (~€9+IVA/anno SupportHost). **Da registrare a casa.**

## ⏸️ DA FARE A CASA
1. **Registrare `sliss-operations.it`** su SupportHost (~€9+IVA/anno). Non serve hosting: Vercel c'è già. Dopo la registrazione, puntare i DNS a Vercel (cambiare nameserver/CNAME in SupportHost + aggiungere il dominio nel progetto Vercel — 5 minuti, gratis). Chiedere a Claude quando ci arrivi.

## ▶ Prossimo passo (quando riprendi)
**Attesa attiva** (ruolo TEST, non codice): lasciar usare Luca e Moira **senza sollecitare**. Riprendere il giro TEST (conferma "valore" + dato **copertura**) **solo su aggancio naturale**. Messaggio già pronto — gancio = i 2 riscontri recensione positivi di Luca.

**In frigo (NON da costruire ora):** spec M3 "Richieste" pronta in `docs/spec-m3-richieste.md`. Si costruisce solo a GATE M1.

Dettaglio completo: `docs/stato-progetto.md`.
