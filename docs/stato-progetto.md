# Sliss — Stato del Progetto

<!-- SYNC ▸ FONTE DI VERITÀ · v5.1 · 2026-05-30 · Fase 1 Fondazione · M1 Follow-Up · git HEAD = deploy Vercel READY
     Questo file è la fonte UNICA per versione / fase / stato tester. Gli altri file puntano qui, NON duplicano il numero.
     A fine sessione: aggiorna questa riga, poi propaga gli stamp negli altri file (CLAUDE.md, memoria). -->

> Documento vivente · Aggiornato: 30/05/2026
> Fase corrente: **1 — Fondazione**

---

## Dove sono adesso

Sistema operativo in piedi, app deployata, tester attivi. Sessione del 28/05 ha portato un batch di miglioramenti significativi su M1.

**Setup tecnico — tutto completato:**
- ✅ Repo `sliss-platform` su GitHub (account: Erikfersuoch)
- ✅ Claude Code installato e funzionante
- ✅ CLAUDE.md nel repo
- ✅ docs/ strutturata (decisioni, parking-lot, settimane, test-m1, social)
- ✅ Node.js + Git installati
- ✅ Deploy attivo su Vercel — app v5.1

---

## Il prodotto oggi

**App.jsx (v5.1)** — aggiornata il 28/05/2026.

Miglioramenti dalla v5.0 (sessione 28/05):
- **Follow-up highlight:** border 4px colorato + sfondo tinto per stato (verde=inviato, arancio=oggi, rosso=scaduto)
- **Scheda cliente M1:** metriche pulite — Visite/Ordini totali (full-width), Ultima visita/Ultimo ordine, stato Follow-up
- **Feedback:** rimossi counter, aggiunto link "Vedi recensioni" GMB nell'header
- **Tipi servizio per cluster:** ogni settore ha la propria lista nel form quick entry e Appuntamenti (tattoo, barber, beauty, officine, artigiani, altro)
- **Edit messaggio follow-up:** dal modale di dettaglio, tasto "✏️ Modifica messaggio" su pending — modifica, salva, WhatsApp aggiornato in tempo reale
- **BizType in Settings:** "Tipo attività" (Servizi/Prodotti) ora modificabile da Impostazioni — cluster si adatta, tutto il nav si aggiorna al salvataggio
- **Notifica aggiornamento:** nuovo tipo push `aggiornamento` nell'API notify — triggera manualmente con curl

**Modulo attivo:** M1 Follow-Up
**Moduli bloccati fino a validazione M1:** M2, M3, M5, M6, M9

---

## I tester

**Tester zero — Moira (moglie, Momo Ink)**
- Kickoff: 19/05/2026
- Stato: uso in corso. Subscription push da riattivare (Impostazioni → Notifiche)
- Check settimanale: da concordare

**Tester uno — Luca (Kayek3D, stampa 3D)**
- Identificato: 25/05/2026
- Stato: subscription push da riattivare (Impostazioni → Notifiche)
- Kickoff formale: da concordare

**Nota push:** entrambe le subscription Redis risultano scadute. Basta che riaprano la PWA e premano "Attiva notifiche" in Impostazioni per ripristinarle.

---

## I dubbi onesti

1. **La struttura dei moduli convince a metà.** La risposta arriverà dai dati del test.
2. **Il follow-up di riattivazione è contestato da Moira.** Tono e timing da verificare sul campo.
3. **Il one-man business è l'obiettivo vero.** Ogni scelta di complessità deve essere compatibile con questo.
4. **L'uscita (vendita, guadagno) è un'ambizione legittima.** Da affrontare solo dopo Fase 2 Go.
5. **La nebbia è il problema principale, non il tempo.** Il sistema esiste per questo.

---

## Prossimi 3 passi (in ordine)

1. **Chiamata diagnostica con Moira** — 20 minuti, capire cosa blocca l'uso sistematico. (Ruolo: TEST)
2. **Concordare check settimanale con Moira** — solo dopo la chiamata diagnostica, giorno e ora fissi. (Ruolo: TEST)
3. **Contattare Luca (Kayek3D)** — proposta formale 30 giorni di test, fissare kickoff. (Ruolo: TEST)

---

## Blocchi attivi

| Blocco | Note |
|---|---|
| Chiamata diagnostica con Moira non ancora fatta | Primo passo prima di concordare qualsiasi check |
| Check settimanale Moira non ancora concordato | Dipende dalla chiamata diagnostica |
| Kickoff Luca non ancora fissato | Da contattare |
| Subscription push entrambi i tester scaduta | Si risolve da soli aprendo Impostazioni → Notifiche |

---

## Parcheggiato (non adesso)

- Tipi servizio personalizzabili in Settings
- Orari notifiche configurabili da utente
- Automazioni avanzate (WhatsApp Business API, invio automatico)

Vedi lista completa in `docs/parking-lot.md`.

---

## Regola attiva

> Una cosa alla volta. L'obiettivo di questa settimana è uno solo.
> Tutto il resto va in `docs/parking-lot.md`.

---

*Sliss · liscio come deve essere.*
