# Handoff — punto di ripartenza

> Si sovrascrive a ogni fine sessione. Per lo storico completo: `docs/stato-progetto.md`.
> Lo stato tecnico del repo lo stampa l'hook SessionStart all'avvio (main/branch/ahead/behind).

**Ultimo aggiornamento:** 16/06/2026 · v6.9 · Fase 1 · M1 Follow-Up in validazione · sessione hardening+CI+metodo agentic

---

## Dove siamo in una frase
M1 è deployato e funzionante; siamo in **attesa attiva del gate** — i tester usano l'app ma le occasioni d'uso scarseggiano per una flessione di lavoro, non per un problema del prodotto.

## Il gate (criterio in vigore, deciso 10/06)
"**Occasioni reali**", non data fissa: GO se copertura ≥80% dei clienti reali passati da Sliss + ~8 usi reali + valore + bilancio. Check settimanale + backstop morbido **fine luglio** (2 su 3 → GO condizionato). Numeri live: `GET …/api/track?tester=moira` (e `luca`).

## I due segnali che contano
- **Moira (servizi, tester di riferimento):** app aperta ogni giorno ma 1 solo cliente inserito. Causa = **contatti nuovi fermi, tutto già fissato** → il punto d'ingresso (Invita cliente) non scatta. Interesse **confermato** ("mi interessa, devo trovare il tempo"). Decisione Erik: **aspettare i suoi tempi, NON caricarla** (un uso spinto dal founder = falso positivo).
- **Luca (prodotti):** 9 follow-up inviati ≈ già a soglia. È il segnale più solido. M3 (richieste inbound) è il suo vero dolore.

## La regola della finestra
Niente feature nuove, niente pressione sui tester, solo cose a rischio nullo. Eccezioni UI consapevoli ammesse da Erik (v6.8 modal, v6.9 nome/cognome) perché migliorano l'usabilità senza toccare la logica.

## Cosa fare quando si riprende (in ordine)
1. **Niente di attivo: ascoltare.** Leggere il report serale (push a Erik 20:00) + check settimanale `api/track`.
2. **Trigger M3:** quando Luca si lamenta di una richiesta persa → "inoltramela che la uso come esempio". Stessa cosa per lo screenshot etichette, al volo. **Mai solleciti scritti** (`docs/test-m1/kickoff-luca.md`).
3. **Trigger Moira:** quando ricomincia a fissare clienti nuovi → eventuale "patto dei 5 minuti" (inserimento unico dei già fissati). Solo se lo riapre lei.

## Residui post-gate (NON ora)
- **Se GO:** (a) hardening error-recovery [P1, tocca safety dati] *prima* del tester freddo; (b) M3 Via-2 per Luca (2 conferme indipendenti, vedi `modulo-richieste-v1.md` + `sondaggi.md`); (c) emoji→icone + upgrade estetico; (d) pricing (Fase 3, abbozzo in `parking-lot.md`).
- **Se NO-GO su Moira ma Luca forte:** valutare ricentraggio su prodotti/inbound (Luca cliente-tipo, M3 punta di lancia). Già previsto in `decisioni.md`.
- **Pipeline tester freddi:** 2 Sì + 3 Forse dal sondaggio Tally (contatti SOLO in Tally — repo pubblico, mai PII in docs). Candidato d'oro = rispondente settore moto (dolore M3).

## Sessione 16/06 — hardening + metodo (rischio zero per i tester)
Lavoro a rischio nullo fatto in finestra-gate (non tocca logica utente):
- **Rete di sicurezza:** Vitest + **30 test** su `healData` (guardiano dati) e `helpers` (date/invio/greet). `npm test` verde.
- **Robot CI:** GitHub Actions (`.github/workflows/ci.yml`) → lint+test+build a ogni push/PR, in automatico. Primo run verde.
- **Mappa:** `docs/architettura.md` (flusso dati, pezzi, 5 regole d'oro). Abbatte il bus-factor.
- **Fix minori:** `greet()` pomeriggio; migrazione firstname spostata da effect a init (lint pulito).
- **Metodo agentic codificato** in CLAUDE.md ("Flusso agentic"): A spec-first · B visto-funzionare · C sistema-guardiano (CI fatto, test-sui-flussi post-gate) · D review indipendente. Default + coaching insieme (vanno nominati a Erik per fargli interiorizzare il modo di pensare).
- **Sicurezza PC/IP** (solo info, nessuna azione ora): repo pubblico ma nessun segreto committato e nessuna PII nei doc; da rivalutare in Fase 3 (repo privato? 2FA su GitHub/Vercel/Upstash). Patto: su azioni CLI rischiose → tripla conferma con parola `CONFERMO`.

## Note tecniche aperte
- Linguaggio di pitch per i freddi: **"meno caos coi clienti"**, mai "promemoria" (4/5 non si sente smemorato).
- Hook Claude Code attivi e portabili (`$CLAUDE_PROJECT_DIR`), girano su cloud e PC.
- Repo pulito: solo `main`. localStorage resta la fonte dati primaria (backup cloud best-effort).
