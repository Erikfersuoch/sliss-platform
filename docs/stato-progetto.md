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
- ✅ Deploy attivo su Vercel — app v3.0

---

## Il prodotto oggi

**App.jsx (v3.0)** — revisione UX/UI completata nella sessione del 20/05/2026.

Cosa è cambiato dalla v2.0:
- Home pulita: saluto con nome attività, 3 metriche, lista unica "Da fare oggi"
- Follow-Up: bottoni WhatsApp/Copia diretti, tasto "Segna tutti inviati", schermata completamento
- Clienti: modifica + eliminazione, tag cliccabile dalla lista, rimosso campo "settore"
- Template: modifica inline + eliminazione + nuovo template
- Feedback: logica ribaltata — lista clienti senza recensione + richiesta diretta
- Appuntamenti: nuova sezione con generazione automatica dei 4 follow-up dalla data inserita
- Moduli: layout a cubi compatti
- Impostazioni: nome attività, link Google, timing personalizzabili (ringraziamento in ore)

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
