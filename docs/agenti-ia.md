# Mappa processi → agenti IA futuri

> Documento vivo. Si aggiorna man mano che Sliss cresce.
> Scopo: non perdere il lavoro fatto — quando implementeremo gli agenti, i dati e i pattern sono già qui.

---

## Agenti fondamentali (infrastruttura agentiva)

> Framework valutato il 2026-06-16. Questi 6 agenti sono prerequisiti
> a qualsiasi agente funzionale di Sliss. Nessun agente funzionale
> viene implementato prima che questi siano testati e stabili.

### Stato per fase

| Agente | Stato attuale | Copertura esistente | Da fare |
|---|---|---|---|
| **LOGGER / AUDITOR** | 🟡 Da fare subito | `console.error` sparso, nessun audit trail | Implementare in Fase 1 prima del primo agente AI |
| **VALIDATOR** | 🟡 Parziale | Guard `data?.x\|\|[]`, `healData()`, `ErrorBoundary` | Formalizzare quando entra il primo agente AI |
| **ERROR HANDLER** | 🟡 Parziale | `ErrorBoundary` lato UI, nessun retry su processi | Implementare in coppia con Validator (Fase 2) |
| **MEMORY MANAGER** | 🟢 Coperto per ora | `storage.js` + `healData()` + backup cloud | Evolvere in Fase 3 quando arriva Supabase |
| **ORCHESTRATOR** | 🟡 Embrionale | `buildFollowUps()` è un micro-orchestratore | Implementare in Fase 3 con multi-agente |
| **RATE LIMITER** | ⚪ Rimandabile | Nessuna chiamata AI oggi | Implementare in Fase 3 quando ci sono costi reali |

### 7° agente specifico a Sliss (non nella lista standard)

**→ SEQUENCE GUARDIAN** *(da aggiungere in Fase 2)*
Verifica che le fasi follow-up siano rispettate in ordine (non puoi mandare "Recensione" senza aver mandato "Ringraziamento"). Gestisce eccezioni: risposta negativa, fase saltata, fase disattivata. Oggi l'ordine non è enforced — per M1 manuale va bene, con invio automatico diventa critico.

### Ordine di implementazione

```
FASE 1 (adesso, prima del primo agente AI)
└── LOGGER — log strutturato su Vercel KV o file
    Registra: cron push, errori auto-import slot, azioni critiche

FASE 2 (primo agente AI — personalizzazione messaggi)
├── VALIDATOR — schema output testo messaggio
├── ERROR HANDLER — retry x3, fallback template statico
└── SEQUENCE GUARDIAN — prerequisiti fase soddisfatti?

FASE 3 (Supabase + multi-agente)
├── MEMORY MANAGER evoluto — da localStorage a DB
├── ORCHESTRATOR — coordina agenti paralleli
└── RATE LIMITER — soglie token per sessione/cliente/giorno
```

---

## Processi attuali → agenti funzionali futuri

### 1. Generazione follow-up
**Come funziona oggi:** automatica al salvataggio appuntamento. 4 follow-up creati con date calcolate dai timing in Impostazioni.
**Dati prodotti:** `appointmentId`, `clientId`, `phase`, `scheduledDate`, `message`, `status`
**Agente futuro:** *Agente personalizzazione messaggi* — genera il testo in modo dinamico: tipo servizio, storico cliente, fase ciclo, tono business. Oggi testo fisso (template).

---

### 2. Invio follow-up
**Come funziona oggi:** manuale — Erik vede la card, preme il tasto, copia/incolla su WhatsApp.
**Dati prodotti:** `sentDate`, `status: sent`
**Agente futuro:** *Agente invio automatico* — invia via WhatsApp Business API o email. Richiede integrazione canale (Fase 3+).

---

### 3. Risposta cliente
**Come funziona oggi:** manuale — Erik segna `replied` a mano dopo risposta su WhatsApp.
**Dati prodotti:** `status: replied`, `satisfaction`
**Agente futuro:** *Agente ascolto risposta* — intercetta risposta (webhook WhatsApp), classifica sentiment, aggiorna stato, suggerisce azione successiva.

---

### 4. Preparazione scheda cliente (slot)
**Come funziona oggi:** Erik genera link → cliente compila form → dati entrano in Sliss.
**Dati prodotti:** `name`, `phone`, `email`, `notes`, `firstVisit`
**Agente futuro:** *Agente raccolta dati cliente* — conversazione WhatsApp invece di form statico.

---

### 5. Notifiche push ai tester
**Come funziona oggi:** cron Vercel giornaliero, hardcoded per Moira e Luca (orari fissi).
**Dati prodotti:** log invio notifica
**Agente futuro:** *Agente timing intelligente* — decide quando notificare in base ad attività recente e follow-up in scadenza.

---

### 6. Onboarding nuovo cliente
**Come funziona oggi:** 5 step guidati (nome, tipo business, cluster settore).
**Dati prodotti:** `settings.businessName`, `settings.bizType`, `settings.cluster`
**Agente futuro:** *Agente onboarding conversazionale* — raccoglie le stesse info via chat con domande di approfondimento.

---

### 7. Gestione template follow-up
**Come funziona oggi:** Erik modifica i testi a mano nella sezione Templates.
**Dati prodotti:** template per fase, per cluster
**Agente futuro:** *Agente copywriting* — suggerisce varianti basandosi su tasso di risposta storico. A/B testing automatico.

---

### 8. Analisi clienti *(non ancora implementata)*
**Come funziona oggi:** non esiste. Visione parcellizzata (scheda cliente base).
**Dati disponibili già ora:** visite, date appuntamenti, stato follow-up, satisfaction
**Agente futuro:** *Agente analisi retention* — identifica clienti a rischio abbandono, suggerisce azione proattiva. Primo candidato Fase 2.

---

## Tabella priorità agenti funzionali

| Agente | Impatto | Complessità | Fase |
|---|---|---|---|
| Personalizzazione messaggi | Alto | Media | 2-3 |
| Analisi retention | Medio | Bassa | 2 |
| Ascolto risposta cliente | Alto | Alta (webhook) | 3 |
| Invio automatico | Alto | Alta (API) | 3 |
| Timing intelligente notifiche | Basso | Media | 3 |
| Onboarding conversazionale | Medio | Alta | 4 |
| Raccolta dati cliente via chat | Medio | Alta | 4 |
| Copywriting A/B | Basso | Alta | 4+ |

---

*Creato: 2026-06-16 · Fase 1*
