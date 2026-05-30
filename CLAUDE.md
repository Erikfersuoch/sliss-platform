# CLAUDE.md — Sliss Platform

> Questo file viene letto automaticamente da Claude Code ad ogni sessione.
> Non serve spiegare il progetto da zero: il contesto è qui.

---

## Cos'è Sliss

Piattaforma web modulare per micro-business (tatuatori, barber, estetiste, officine, stampa 3D, negozi). Automatizza follow-up, reminder, FAQ, onboarding clienti. Due flussi paralleli: servizi (con appuntamenti) e prodotti (con ordini).

**Stack:** React (Vite) + Vercel + GitHub
**Repo:** github.com/Erikfersuoch/sliss-platform
**Deploy:** Vercel (attivo) — sliss-platform.vercel.app
**App:** v5.0 · src/App.jsx (split modulare: config.js, storage.js, helpers.js, context.js, theme.js, GlobalCSS.jsx, components/ui.jsx, components/SlissLogo.jsx)
**UI:** light mode · accent verde #16A34A · mobile-first (bottom nav) · sidebar desktop
**Storage:** localStorage · chiavi: `sliss-v4`, `sliss-onboarded-v4`
**Onboarding:** 5 step — nome attività → tipo (servizi/prodotti) → cluster settore
**Flussi:** Servizi (Appuntamenti + 4 follow-up) · Prodotti (Ordini + 5 follow-up)
**Modulo attivo:** M1 Follow-Up — non toccare M2, M3, M5, M6, M9

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

0. **Fine sessione — SEMPRE committare E verificare Vercel.** Prima di chiudere Claude Code: (a) `git add -A && git commit -m "sessione: [descrizione breve]" && git push`; (b) controlla su Vercel dashboard che il deployment più recente corrisponda all'ultimo commit SHA. Se non coincide, esegui `git commit --allow-empty -m "chore: trigger redeploy" && git push` per forzare il deploy. Senza questa verifica, il codice committato può non essere mai deployato (webhook Vercel→GitHub inaffidabile).

1. **Un passo alla volta.** Proponi, aspetta conferma, esegui.
2. **Spiega sempre dove mettere le cose.** Non assumere che sappia dove si trova un file.
3. **Non toccare mai:** M2, M3, M5, M6, M9 — bloccati fino a validazione M1.
4. **Non toccare mai:** Supabase, pricing, sito vetrina — bloccati fino a Fase 3.
5. **Quando proponi modifiche UI/UX:** mostra prima cosa cambieresti e perché, poi aspetta ok.
6. **Se vedi dispersione** (sto chiedendo cose fuori focus): bloccami e riportami all'obiettivo della sessione.
7. **Notifiche push — hardcoded per tester attuali.** Moira: inserimento 19:30 / follow-up 12:30. Luca: inserimento 20:30 / follow-up 12:00. Non generalizzare. La schermata impostazioni orari viene in Fase 3. Implementato con 4 cron giornalieri in vercel.json (`?target=&type=` nel path). Hobby plan: max 1x/giorno, precisione ±59min.
8. **PWA su iPhone — solo Safari.** Le notifiche push PWA funzionano solo da Safari iOS. L'onboarding deve guidare esplicitamente: apri con Safari, non con Chrome.
9. **Scheda cliente è parte di M1**, non modulo separato. Dati: visite totali, data ultimo appuntamento, recensione lasciata, stato ciclo follow-up.
10. **docs/social.md** è il riferimento per tutta la comunicazione social.

---

## Regole tecniche (imparate dai bug — non ripetere)

1. **STORAGE — sempre localStorage.** `window.storage` esiste solo in Claude Artifacts. Su Vercel crasha silenziosamente. Il wrapper è in App.jsx: `const storage = { get, set, remove }`.

2. **PHASES centralizzato.** Ogni fase follow-up (servizi e prodotti) DEVE essere nell'oggetto `PHASES` globale. Se manca, Follow-Up crasha con "Cannot read properties of undefined (reading 'icon')".

3. **Guards sui dati.** MAI `data.tableName` diretto. Sempre `data?.tableName || []`. Le tabelle nuove possono essere undefined nei dati salvati da sessioni precedenti.

4. **CSS — una sola regola `*{}`.** Due regole `*{}` separate si sovrascrivono e rompono font-family.

5. **Context fuori Provider.** Componenti che usano `useSliss()` devono stare dentro `<Ctx.Provider>`. Se servono dati fuori dal Provider, passarli come prop.

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
  social.md             → comunicazione social: post pubblicati, idee, prossimi contenuti
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
