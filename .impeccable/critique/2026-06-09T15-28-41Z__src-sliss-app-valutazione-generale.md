---
target: Sliss app — valutazione generale
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-06-09T15-28-41Z
slug: src-sliss-app-valutazione-generale
---
# Sliss — Critica di design (09/06/2026)

Valutazione da codice + detector automatico (no browser live). Register: product.

## Design Health Score — 28/40 (Good)

| # | Euristica | Voto | Problema chiave |
|---|-----------|-------|-----------------|
| 1 | Visibility of System Status | 3 | Stati follow-up chiari; backup silenzioso, no skeleton |
| 2 | Match System / Real World | 3 | Italiano da artigiano; "follow-up"/"codice tester" tecnicismi |
| 3 | User Control & Freedom | 3 | Annulla invio, Escape, conferme |
| 4 | Consistency & Standards | 3 | Componenti coerenti; mix emoji + set icone |
| 5 | Error Prevention | 3 | Conferme elimina/reset, select, submit disabilitato, autosave |
| 6 | Recognition vs Recall | 3 | Nav etichettata; riquadrini-fase non spiegati |
| 7 | Flexibility & Efficiency | 3 | "Tutti", quick-add, nav contestuale; no scorciatoie |
| 8 | Aesthetic & Minimalist | 3 | Pulito; Home densa ma con empty state |
| 9 | Error Recovery | 2 | No validazione inline; errori di rete silenziosi |
| 10 | Help & Documentation | 2 | Zero aiuto in-app dopo onboarding — limite "primo utente" |

## Anti-pattern
Non slop: identità decisa (DM Sans, verde, light, copy caldo, logo, empty state, componenti con stati/focus). Nei: (1) detector → bordo-striscia laterale `borderLeft:4px` in Appointments.jsx:38 (Schede in attesa); (2) mix emoji grezze (🗑️🚀📦↩️) + set <Icon>.

## Impressione
Sliss è messa bene. "Nuovo utente lo usa da solo?" = sì sul percorso felice (onboarding forte + linguaggio piano + empty state + "+ Aggiungi cliente"), ma inciampa su 2-3 punti di non-evidenza (= il feedback Moira "legnoso/mi aggiunge tempo"). Opportunità #1: rendere auto-evidenti i bivi, soprattutto Agenda.

## What's Working
1. Onboarding (5 step, 1 decisione/schermata, linguaggio umano, progress dots, step iOS condizionali).
2. Sistema componenti (Btn/Card/Modal/FormField coerenti, 44px, focus-visible, Modal a11y, reduced-motion, una regola *).
3. Stato comunicato con colore + etichetta (no daltonismo-trap).

## Priority Issues
- [P1] Ambiguità "Prepara scheda" vs "+ Nuovo" in Agenda — bivio non auto-evidente (= legnosità Moira). Fix: clarify copy/gerarchia o redesign. → /impeccable clarify, /impeccable shape.
- [P1] Nessun aiuto contestuale dopo l'onboarding (limite "primo utente"); riquadrini-fase non etichettati. Fix: empty state che insegnano + micro-hint. → /impeccable onboard.
- [P2] Incoerenza emoji ↔ set icone (abbassa "premium=cura"). Fix: emoji funzionali → <Icon>. → /impeccable polish.
- [P2] Bordo-striscia laterale "Schede in attesa" (ban). Fix: bordo pieno/sfondo tinto. → /impeccable polish.
- [P2] Empty/error: "Tutto fatto per oggi ✅" su account vuoto + no validazione inline + errori rete muti. → /impeccable harden.

## Persona Red Flags
- Jordan (primo utente, chiave): passa il percorso felice ma esita su Prepara scheda/Nuovo, riquadrini-fase, campo "Codice tester", "Tutto fatto" a vuoto.
- Casey (mobile): quasi nessun red flag (bottom-nav, stato persistito, 44px, lazy).
- Moira/Luca (artigiano non-tech): red flag = attrito inserimento, legnosità Prepara scheda, densità Home (= ciò che il gate misura).

## Minori
- "Codice tester" non per utenti reali (Fase 3). Scrollbar custom 3px trascurabile. Home ricca di sezioni da tenere d'occhio crescendo.
