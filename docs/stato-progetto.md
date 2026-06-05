# Sliss — Stato del Progetto

<!-- SYNC ▸ FONTE DI VERITÀ · v5.6 · 2026-06-05 · Fase 1 Fondazione · M1 Follow-Up · git HEAD = deploy Vercel READY
     Questo file è la fonte UNICA per versione / fase / stato tester. Gli altri file puntano qui, NON duplicano il numero.
     A fine sessione: aggiorna questa riga, poi propaga gli stamp negli altri file (CLAUDE.md, memoria). -->

> Documento vivente · Aggiornato: 05/06/2026
> Fase corrente: **1 — Fondazione**

---

## Dove sono adesso

Sistema operativo in piedi, app deployata, tester attivi. Sessione del 28/05 ha portato un batch di miglioramenti significativi su M1.

**Sessione 05/06/2026 (v5.6) — onboarding cliente via link (spedito):** integrato il lavoro avviato da telefono (branch `claude/status-check-NoBBi`) su `main`. In Agenda nuovo flusso **"Prepara scheda"**: si genera un link (data + tipo servizio, es. "Consulenza") da mandare al cliente; il cliente compila un form pubblico (`onboarding.html`: nome, WhatsApp, **email facoltativa**, note) → dati su Upstash + **notifica push** al titolare → all'apertura dell'app l'**anagrafica entra in automatico** tra i clienti (no appuntamento: quello si aggiunge dopo dal profilo, così i follow-up partono dalla data giusta). Aggiunte: **modifica data appuntamento inline** con ricalcolo follow-up (✏️), invio link **solo via WhatsApp** (un tasto), e campo **"WhatsApp cliente" opzionale** così il tasto apre direttamente la chat del cliente (`whatsapp://send?phone=`, come i follow-up). Backend API verificato live (submit + check, email inclusa). Aggiunta anche **modifica data della scheda in attesa** (✏️, rigenera il link). Deploy Vercel commit `88224e5`. **Limite noto:** su iOS non si può forzare WhatsApp **Business** (schema condiviso, decide il sistema). **Verifica (05/06):** Erik ha provato il flusso, ok. **Moira proverà nei prossimi giorni** (uso reale: consulenza → link → anagrafica).

**Sessione 04/06/2026 (v5.5) — batch usabilità Follow-Up:** schema colori coerente **per-stato** (🟢 inviato · 🟠 da inviare · 🔴 scaduto · 🔵 risposto), risolta la contraddizione del rosso su "Risposto" (era colorato per data). Azioni "Risposto / No" **inline** dalla lista, senza aprire il dettaglio. Disattivando un tipo di follow-up i `pending` di quella fase **escono dai conteggi** (Home, badge nav, tab) e nella tab "Tutti" restano **sbiaditi e disabilitati** con badge "Disattivato" (helper condiviso `isPhaseOff`). Contatori Home aprono la pagina **già filtrata** (Da inviare / In attesa / Attivi). Deploy Vercel READY (commit `66eebce`). **Rimandato:** Agenda come vista calendario (Step 5, task dedicato).

**Sessione 03/06/2026 (v5.4) — qualità UI Home:** primo audit `/impeccable` sulla Home (baseline 10/20). Creato `PRODUCT.md` come baseline di design (register=product, mission piattaforma multi-fase). Spediti e deployati: contrasto testo a norma WCAG AA, rimossi i bordi-striscia laterali, stato follow-up con etichetta testuale (non solo colore), card cliccabili accessibili da tastiera, `prefers-reduced-motion`, eliminato il doppio render (due `<main>` → uno). Poi sostituite le emoji di sistema con un set di icone a tratto coerente (nuovo componente `<Icon>`, stile Lucide) su navigazione e fasi follow-up. Restano a emoji per scelta: pagina Moduli, settori nei select, illustrazioni stati vuoti, saluto Home.

**Setup tecnico — tutto completato:**
- ✅ Repo `sliss-platform` su GitHub (account: Erikfersuoch)
- ✅ Claude Code installato e funzionante
- ✅ CLAUDE.md nel repo
- ✅ docs/ strutturata (decisioni, parking-lot, settimane, test-m1, social)
- ✅ Node.js + Git installati
- ✅ Deploy attivo su Vercel — app v5.6

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

**Sessione 30/05 (v5.2) — notifiche affidabili:**
- **Diagnosi:** le subscription push venivano salvate come `sub:unknown` invece di `sub:moira`/`sub:luca`. Su PWA iOS il parametro `?tester=` si perde all'apertura da icona (start_url "/") e lo storage standalone è separato da Safari. I cron cercavano `sub:moira`/`sub:luca` → non trovavano nulla → zero notifiche. Confermato dal DB Upstash (unica chiave: `sub:unknown`).
- **Fix definitivo:** campo **Codice tester** in Impostazioni → Notifiche. Si scrive il proprio codice (erik/moira/luca), salvato in localStorage nello stesso contesto della PWA. Aggiunto bottone "Aggiorna iscrizione".
- `api/notify.js` ora gestisce e rimuove le subscription scadute (404/410).
- Nuovo tipo push `conferma` ("è tutto a posto").
- **Confermato end-to-end:** notifica di prova ricevuta sull'iPhone di Erik (`sub:ceoerik`).

**Sessione 03/06 (v5.3) — feedback tester + direzione v6:**
- Definita **direzione prodotto Opzione A** ("Sliss alleggerisce, non sostituisce"). Vedi `docs/roadmap-v6.md` e `decisioni.md`. Nata dal confronto con Moira.
- Spedito: follow-up disattivabili (toggle Attivo/Disattivato nei Template), "Nuovo appuntamento/ordine" dalla scheda cliente, card Home cliccabili (feedback Luca).
- Luca: tester attivo, lo sta usando; feedback più completo atteso in settimana.
- Prossimi passi roadmap: ponte "Aggiungi a Google Calendar" → poi onboarding cliente via link (Upstash + serverless, free tier).

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

**Nota push (agg. 30/05):** root cause risolta (vedi v5.2). Il 30/05 inviato ai tester il messaggio con istruzioni: aprire app → Impostazioni → scrivere il proprio codice (moira/luca) nel campo Codice tester → "Aggiorna iscrizione". DA VERIFICARE: che compaiano `sub:moira` e `sub:luca` nel DB, poi cancellare il vecchio `sub:unknown`. Erik si è aggiunto al test notifiche come `sub:ceoerik` (solo verifica, niente reminder ricorrenti).

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
