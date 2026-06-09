---
target: Sliss app — valutazione generale (post v6.4+v6.5)
total_score: 29
p0_count: 0
p1_count: 1
timestamp: 2026-06-09T19-13-51Z
slug: src-sliss-app-valutazione-generale
---
# Sliss — Critica di design (09/06/2026, post v6.4+v6.5)

Valutazione da codice + detector automatico (no browser live), register: product. Re-run dello stesso target del 28/40 per misurare il salto dopo: sistema "i" `<Info>` + onboarding ripensato (v6.4) e redesign "Prepara scheda" → "Invita cliente" + messaggio WhatsApp caldo (v6.5).

## Design Health Score — 29/40 (Good)

| # | Euristica | Voto | Problema chiave |
|---|-----------|-------|-----------------|
| 1 | Visibility of System Status | 3 | Stati follow-up chiari; backup silenzioso, no skeleton, esito link senza "salvato ✓" |
| 2 | Match System / Real World | 3 | "Invita cliente"/copy caldo migliorano; restano "follow-up" e "codice tester" |
| 3 | User Control & Freedom | 3 | Annulla invio, Escape, conferme, modale con Annulla |
| 4 | Consistency & Standards | 3 | Componenti coerenti; mix emoji (ora anche 🔗) + set `<Icon>` |
| 5 | Error Prevention | 3 | Conferme elimina/reset, submit disabilitato, autosave |
| 6 | Recognition vs Recall | 3 | Bivio Agenda RISOLTO + "i" pervasive; restano riquadrini-fase non etichettati |
| 7 | Flexibility & Efficiency | 3 | Nav contestuale, quick-add; no scorciatoie/bulk |
| 8 | Aesthetic & Minimalist | 3 | Pulito; Home densa; upgrade estetico dedicato ancora da fare |
| 9 | Error Recovery | 2 | **Invariato:** no validazione inline; errori di rete silenziosi |
| 10 | Help & Documentation | 3 | **2→3:** "i" contestuali (Home/Follow-Up/Agenda/Clienti/Settings); manca solo l'ultima sui riquadrini-fase |
| **Total** | | **29/40** | **Good** |

Delta vs 28: **+1**. La storia vera: i due P1 visibili sono chiusi (Agenda + aiuto contestuale), ma il punteggio sale di poco perché il tetto residuo è **Error Recovery (#9, ancora 2)** e gli item di polish consapevolmente parcheggiati (emoji→icone, skeleton, upgrade Home). Il numero è frenato da ciò che è stato rimandato, non da ciò che è stato corretto.

## Anti-pattern
Non slop, anzi rafforzata l'identità (DM Sans, verde, light, copy caldo da artigiano, empty state, componenti con stati/focus, allineata a PRODUCT.md). Detector automatico: **0 findings** (il bordo-striscia laterale di giugno è stato rimosso). Unico neo LLM persistente: mix di emoji grezze + set `<Icon>` (scelta di Erik di tenere le emoji → tetto a 3 su Consistency/Aesthetic).

## Impressione
Il salto si vede nel prodotto più che nel numero. La domanda "un nuovo utente lo usa da solo?" oggi ha una risposta più solida: il bivio di Agenda — la legnosità segnalata da Moira — è sciolto, e c'è aiuto contestuale ovunque serva. Il punteggio resta a 29 perché l'unico 2 (Error Recovery) non è stato toccato: è lì il prossimo guadagno reale, ed è anche un tema di sicurezza dati ([[feedback-safety-first]]).

## What's Working
1. **Risoluzione del bivio Agenda (v6.5):** un solo primario "+ Nuovo appuntamento" + box "Invita cliente" auto-esplicativo; stesso nome e stessa azione in Clienti. Riduce il carico cognitivo nel punto più caldo.
2. **Aiuto contestuale pervasivo (v6.4):** componente `<Info>` riusato (Home guida-modulo, Follow-Up, Agenda/Clienti, Settings) → Help & Doc da 2 a 3.
3. **Sistema componenti + a11y:** 44px, focus-visible, reduced-motion, stato sempre con colore + etichetta, Modal accessibile.

## Priority Issues
- **[P1] Error recovery silenzioso.** Backup, onboarding-submit e track falliscono senza alcun segnale; nessuna validazione inline su telefono/email. In un prodotto coi dati in localStorage, un backup fallito invisibile è un rischio reale. *Fix:* far emergere i fallimenti (toast/inline), validare i campi al volo. → /impeccable harden.
- **[P2] Riquadrini-fase non etichettati.** Ultimo buco di recognition: il testo `HELP.phases` esiste già in `help.js` ma non è piazzato. *Fix:* "i" sulle fasi + micro-label. → /impeccable onboard.
- **[P2] Incoerenza emoji ↔ set icone** (ora anche 🔗 in "Invita cliente"). Tiene Consistency/Aesthetic a 3, abbassa il "premium = cura". *Fix:* emoji funzionali → `<Icon>`. → /impeccable polish. (NB: Erik ha scelto di tenere le emoji per ora.)
- **[P2] Visibility:** nessuno skeleton al caricamento, stato backup invisibile, esito generazione link senza conferma "salvato". *Fix:* micro-feedback. → /impeccable polish.
- **[P3] "Codice tester"** (sparisce in Fase 3) + densità Home in crescita.

## Persona Red Flags
- **Jordan (primo utente, chiave):** ora supera il bivio Agenda (era il red flag #1) e trova aiuto nelle "i". Residui: riquadrini-fase muti, "codice tester", "Tutto fatto ✅" su account vuoto.
- **Casey (mobile):** quasi pulito (bottom-nav, stato persistito, 44px, lazy). Il box "Invita cliente" è in alto, non in thumb-zone: minore.
- **Moira/Luca (artigiano non-tech):** la legnosità "Prepara scheda" è risolta; resta l'attrito d'inserimento e il rischio dei fallimenti silenziosi (= ciò che il gate misura).

## Minori
- Validazione inline assente anche nel nuovo modale "Invita cliente" (telefono libero).
- Home ricca di sezioni da tenere d'occhio crescendo per moduli.
- Scrollbar custom trascurabile.
