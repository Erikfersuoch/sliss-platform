# Sliss — Stato del Progetto

> Documento vivente · Aggiornato: maggio 2026
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
- ✅ Deploy attivo su Vercel — app v4.0

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

## Il tester

**Tester zero:** moglie, Momo Ink (studio tatuaggi)
**Kickoff:** avvenuto — 19/05/2026
**Stato:** ha visto l'app, le piace l'interfaccia. Deve iniziare l'uso sistematico.
**Check settimanale:** da concordare (giorno e ora fissi)

**Primi feedback raccolti al kickoff:**
- Interfaccia: positiva
- Follow-up 60-90 giorni (riattivazione): lo considera inutile — il cliente deve rientrare autonomamente
- Follow-up ringraziamento: deve essere molto vicino alla fine della prestazione (già strutturato così, da approfondire)

→ Entrambi i punti vanno validati con i dati, non risolti a tavolino adesso.

**Tester uno (futuro):** altro tatuatore della rete di tua moglie — da attivare in Fase 2.

**Secondo contatto noto:** amico stampa 3D / Motorsport.
→ NON per M1. Parcheggiato per Fase 4.

---

## I dubbi onesti

1. **La struttura dei moduli convince a metà.** La risposta arriverà dai dati del test.
2. **Il follow-up di riattivazione è contestato dalla tester.** Tono e timing da verificare sul campo.
3. **Il one-man business è l'obiettivo vero.** Ogni scelta di complessità deve essere compatibile con questo.
4. **L'uscita (vendita, guadagno) è un'ambizione legittima.** Da affrontare solo dopo Fase 2 Go.
5. **La nebbia è il problema principale, non il tempo.** Il sistema esiste per questo.

---

## Prossimi 3 passi (in ordine)

1. **Concordare check settimanale con tua moglie** — giorno fisso, 20 minuti, ogni settimana. (Ruolo: TEST)
2. **Passare il form sondaggio professionisti** — elaborarlo e distribuirlo a una cerchia ristretta. (Ruolo: CORE)
3. **Prima settimana di uso reale** — lei usa l'app, tu osservi. Niente modifiche al codice. (Ruolo: TEST)

---

## Blocchi attivi

| Blocco | Note |
|---|---|
| Check settimanale non ancora concordato | Serve giorno e ora fissi prima di partire |
| Uso sistematico tester non ancora iniziato | Il timer dei 14 giorni parte quando inizia davvero |

---

## Parking lot (idee da rivalutare in Fase 4)

- Integrazione calendario esterno (Google Calendar / iCal)
- Invio automatico messaggi senza azione del professionista
- Emoji nei messaggi (problema font su Vercel — fix veloce, bassa priorità)

---

## Regola attiva

> Una cosa alla volta. L'obiettivo di questa settimana è uno solo.
> Tutto il resto va in `docs/parking-lot.md`.

---

*Sliss · liscio come deve essere.*
