# Sliss — Stato del Progetto

> Documento vivente · Aggiornato: 25/05/2026
> Fase corrente: **1 — Fondazione → transizione a Fase 2**

---

## Dove sono adesso

Fase 1 completata. Il sistema operativo è in piedi, l'app è deployata, il kickoff con la tester è avvenuto.

**Setup tecnico — tutto completato:**
- ✅ Repo `sliss-platform` su GitHub (account: Erikfersuoch)
- ✅ Claude Code installato e funzionante
- ✅ CLAUDE.md nel repo
- ✅ docs/ strutturata (decisioni, parking-lot, settimane, test-m1)
- ✅ Node.js + Git installati
- ✅ Deploy attivo su Vercel — app v5.0

---

## Il prodotto oggi

**App.jsx (v5.0)** — aggiornata il 24/05/2026.

Cosa è cambiato dalla v4.0:
- **Onboarding 5 step:** nome attività → tipo (servizi/prodotti) → cluster settore → template auto
- **Due flussi paralleli:** Servizi (Appuntamenti + 4 follow-up) e Prodotti (Ordini + 5 follow-up)
- **Light mode:** accent verde Sliss #16A34A, massima leggibilità
- **Mobile-first:** bottom nav con badge follow-up pendenti, menu "Altro" per sezioni secondarie
- **Desktop:** sidebar fissa adattiva per tipo attività
- **Template per cluster:** caricati automaticamente dall'onboarding in base al settore scelto
- **Ordini:** sezione dedicata con timeline 5 fasi (conferma → spedizione → ricezione → recensione → riordino)
- **Storage:** localStorage con wrapper robusto, chiavi `sliss-v4` e `sliss-onboarded-v4`
- **Guards:** tutti gli accessi a data usano `data?.tableName || []` per compatibilità dati precedenti

**Modulo attivo:** M1 Follow-Up
**Moduli bloccati fino a validazione M1:** M2, M3, M5, M6, M9

---

## I tester

**Tester zero — Moira (moglie, Momo Ink)**
- Kickoff: 19/05/2026
- Stato: ha visto l'app, reazione positiva all'interfaccia. Uso sistematico da avviare.
- Check settimanale: da concordare (giorno e ora fissi)

**Tester uno — Luca (Kayek3D, stampa 3D)**
- Stato: identificato il 25/05/2026
- Kickoff: da concordare
- Prossimo passo: contattarlo con proposta formale (30 giorni di test)

→ Decisione del 25/05: due tester in parallelo per raccogliere dati su profili diversi.
→ Dettaglio feedback kickoff Moira: vedi docs/test-m1/feedback-log.md

---

## I dubbi onesti

1. **La struttura dei moduli convince a metà.** La risposta arriverà dai dati del test.
2. **Il follow-up di riattivazione è contestato da Moira.** Tono e timing da verificare sul campo.
3. **Il one-man business è l'obiettivo vero.** Ogni scelta di complessità deve essere compatibile con questo.
4. **L'uscita (vendita, guadagno) è un'ambizione legittima.** Da affrontare solo dopo Fase 2 Go.
5. **La nebbia è il problema principale, non il tempo.** Il sistema esiste per questo.

---

## Prossimi 3 passi (in ordine)

1. **Chiamata diagnostica con Moira** — 20 minuti, capire cosa blocca l'avvio dell'uso sistematico. (Ruolo: TEST)
2. **Concordare check settimanale con Moira** — solo dopo la chiamata diagnostica, giorno e ora fissi. (Ruolo: TEST)
3. **Contattare Luca (Kayek3D)** — proposta formale di essere tester per 30 giorni, fissare kickoff. (Ruolo: TEST)

---

## Blocchi attivi

| Blocco | Note |
|---|---|
| Chiamata diagnostica con Moira non ancora fatta | Primo passo prima di concordare qualsiasi check |
| Check settimanale Moira non ancora concordato | Dipende dalla chiamata diagnostica |
| Kickoff Luca non ancora fissato | Da contattare — identificato il 25/05 |

---

## Regola attiva

> Una cosa alla volta. L'obiettivo di questa settimana è uno solo.
> Tutto il resto va in `docs/parking-lot.md`.

---

*Sliss · liscio come deve essere.*
