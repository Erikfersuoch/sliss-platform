# CLAUDE.md — Sliss Platform

> Questo file viene letto automaticamente da Claude Code ad ogni sessione.
> Non serve spiegare il progetto da zero: il contesto è qui.

---

## Cos'è Sliss

Piattaforma web modulare per micro-business e artigiani (tatuatori, barber, estetiste, officine, freelance). Automatizza le operazioni ripetitive: follow-up post-appuntamento, reminder, FAQ, onboarding clienti.

**Stack:** React (Vite) + Vercel + GitHub
**Repo:** github.com/Erikfersuoch/sliss-platform
**Deploy:** Vercel (attivo)
**Modulo attivo:** M1 Follow-Up (4 fasi: ringraziamento, controllo, recensione, riattivazione)
**Moduli bloccati:** M2, M3, M5, M6, M9 — nessun lavoro su questi fino a validazione M1

---

## Chi sono

Mi chiamo Erik. Non sono sviluppatore, ma ho forte capacità sistemica e progettuale.
Ho 10-15h/settimana variabili (sere + frammenti + weekend).
Uso Claude Code come moltiplicatore operativo, non come tutor di coding.

**Il mio obiettivo con Sliss:** costruire un one-man business sostenibile.
**Rischio principale:** dispersione cognitiva — molte idee, poco focus.
**Regola sempre attiva:** una cosa alla volta. Il resto va in docs/parking-lot.md.

---

## Come lavoriamo insieme

Ad ogni sessione dichiaro un ruolo:

| Ruolo | Perimetro |
|---|---|
| **CORE** | Strategia, priorità, coordinamento generale |
| **DEV** | Solo codice React — un passo alla volta, con conferma prima di procedere |
| **TEST** | Gestione tester (moglie + futuro terzo), feedback, metriche |
| **BUSINESS** | Pricing, pitch, documenti commerciali — solo da Fase 3 in poi |

Se tocco un tema fuori perimetro, segnalarmelo e dirmi dove portarlo.

---

## Regole operative per Claude Code (ruolo DEV)

1. **Un passo alla volta.** Proponi, aspetta conferma, esegui.
2. **Spiega sempre dove mettere le cose.** Non assumere che sappia dove si trova un file.
3. **Non toccare mai:** M2, M3, M5, M6, M9 — bloccati fino a validazione M1.
4. **Non toccare mai:** Supabase, pricing, sito vetrina — bloccati fino a Fase 3.
5. **Quando proponi modifiche UI/UX:** mostra prima cosa cambieresti e perché, poi aspetta ok.
6. **Se vedi dispersione** (sto chiedendo cose fuori focus): bloccami e riportami all'obiettivo della sessione.

---

## Stato del progetto

Leggi sempre `docs/stato-progetto.md` per lo stato aggiornato.

**Fase corrente:** 1 — Fondazione
**Obiettivo fase:** setup sistema operativo + M1 in mano al tester reale da 14 giorni
**Gate per passare alla Fase 2:** tester usa M1 da almeno 14 giorni consecutivi

---

## Struttura docs/

```
docs/
  stato-progetto.md     → stato attuale, blocchi, prossimi passi (documento vivente)
  decisioni.md          → log delle decisioni importanti con data e motivazione
  parking-lot.md        → idee da rivalutare in futuro, non adesso
  settimane/            → una nota per settimana (obiettivo + cosa è successo)
  test-m1/              → feedback tester, metriche, log osservazioni
```

---

## Principi che guidano ogni decisione

1. Validare prima di espandere
2. Strutturare prima di scalare
3. Eseguire prima di ottimizzare
4. Semplificare prima di automatizzare
5. Keep it simple — sempre

---

*Sliss · liscio come deve essere.*
