# Architettura Sliss — come funziona in una pagina

> Mappa per ritrovarsi: dove vivono i dati, come si muovono, quali regole non si toccano.
> Pensata per chiunque ci debba mettere le mani (Erik tra 6 mesi, un dev nuovo, una sessione AI senza contesto).

---

## L'idea in una frase

Sliss è un'app React **senza database server**: tutti i dati dell'utente vivono nel **suo browser** (localStorage). Il "cervello" è un unico oggetto `data` tenuto in `App.jsx`; tutto il resto legge da lì e scrive solo passando da 4 funzioni controllate.

---

## Il flusso dei dati (la cosa più importante)

```
        localStorage (browser dell'utente)
          chiave "sliss-v4"  ─ JSON
                │   ▲
        loadData│   │saveData      ← storage.js
   (sana i dati)│   │(ad ogni modifica)
                ▼   │
        ┌───────────────────┐
        │  App.jsx           │   stato React  data = { clients, appointments,
        │  const [data]      │                 followUps, orders, slots,
        │  UNICA fonte verità│                 templates, feedbacks, settings }
        └───────────────────┘
                │
        Context (context.js) espone 4 SOLE porte per modificare i dati:
            addRecord(tabella, record)      → aggiunge una riga
            update(tabella, id, modifiche)  → modifica una riga
            deleteRecord(tabella, id)       → cancella una riga
            updateSettings(modifiche)       → cambia le impostazioni
                │
                ▼
        Le schermate (src/pages/*) leggono `data` e chiamano quelle 4 porte.
        Non scrivono MAI su localStorage da sole.
```

**Perché è solido:** c'è una sola strada per cambiare i dati. Se qualcosa va storto nei dati, il problema è in una di quelle 4 funzioni — non sparso in 30 file.

---

## Il percorso vero d'uso: da cliente a follow-up

```
1. Nuovo cliente        → Clients.jsx (handleAdd)  → addRecord("clients", ...)
2. Nuovo appuntamento   → Clients.jsx (handleNewAppt)
                          ├─ addRecord("appointments", ...)
                          └─ buildFollowUps(...) → genera i follow-up programmati
                             (followups.js)      → addRecord("followUps", ...) x N
3. Arriva il giorno     → FollowUp.jsx mostra i follow-up "da inviare oggi"
4. Invio                → helpers.js sendHref() sceglie il canale (WhatsApp/SMS/Email)
                          openSend() apre l'app di messaggi col testo già pronto
```

I **testi** dei follow-up per ogni settore stanno in `config.js` (`CLUSTER_TEMPLATES`).
Le **fasi** del ciclo (ringraziamento, controllo, recensione…) stanno in `config.js` (`PHASES`).

---

## I pezzi e a cosa servono

| File / cartella | Ruolo |
|---|---|
| `src/main.jsx` | punto d'avvio: monta `App` |
| `src/App.jsx` | **root**: tiene lo stato `data`, fornisce il Context, smista le schermate |
| `src/storage.js` | salva/carica da localStorage + **`healData`** (ripara la struttura dati) |
| `src/context.js` | il "tubo" che porta dati e funzioni alle schermate (`useSliss()`) |
| `src/config.js` | **dati di configurazione centralizzati**: fasi, stati, template per settore |
| `src/helpers.js` | funzioni pure riutilizzabili: date, link d'invio, id unici |
| `src/followups.js` | costruisce i follow-up programmati a partire da un appuntamento/ordine |
| `src/pages/*` | le schermate (Home, Clienti, Follow-Up, Agenda, Ordini, Impostazioni…) |
| `src/components/*` | pezzi UI riusabili (Nav, Modal, bottoni, Icone…) |
| `src/theme.js` + `GlobalCSS.jsx` | colori e stili globali |

## Il "fuori" (le funzioni serverless su Vercel)

Sono in `api/` — girano sul server, **non** nel browser. Sono accessori, non il cuore dell'app:

| Endpoint | A cosa serve |
|---|---|
| `api/track.js` | conteggio uso dei tester (per il gate M1) |
| `api/backup.js` | backup cloud best-effort dei dati (rete di sicurezza, non fonte primaria) |
| `api/notify.js` | notifiche push (2 cron: follow-up 12:00, report+inserimento 20:00) |
| `api/subscribe.js` | registra il dispositivo per le notifiche push |
| `api/onboarding-submit.js` / `onboarding-check.js` | il cliente compila i suoi dati via link → l'app li auto-importa |
| `api/gate-report.js` | report manuale on-demand sullo stato del gate |

---

## Le 5 regole d'oro (imparate dai bug — non violarle)

1. **Dati sempre da localStorage.** Mai `window.storage` (esiste solo in Claude Artifacts, su Vercel crasha in silenzio). Il wrapper sicuro è in `storage.js`.
2. **Ogni fase follow-up deve stare in `PHASES`** (`config.js`). Se manca, Follow-Up crasha leggendo `.icon` di undefined.
3. **Mai accedere ai dati "nudi".** Sempre `data?.tabella || []`: le tabelle nuove possono essere `undefined` nei dati salvati da versioni vecchie.
4. **Una sola regola CSS `*{}`.** Due si sovrascrivono e rompono il font.
5. **Chi usa `useSliss()` deve stare dentro `<Ctx.Provider>`.** Fuori dal Provider, passare i dati come prop.

---

## La rete di sicurezza (test automatici)

`npm test` esegue i controlli automatici. Oggi coprono il **guardiano dei dati** (`healData`, salva/carica) e le **funzioni date/invio** (`helpers.js`) — vedi `src/storage.test.js` e `src/helpers.test.js`. Regola: prima di un deploy importante, `npm test` deve essere verde. Se tocchi `storage.js` o `helpers.js` e un test diventa rosso, hai (probabilmente) rotto qualcosa che gli utenti useranno.
```
npm test          # esegue i test una volta
npm run test:watch # li riesegue ad ogni modifica (durante lo sviluppo)
```

**Robot CI (gira da solo).** Non serve ricordarsi di lanciare i controlli a mano: ad ogni `push` e ad ogni pull request, GitHub Actions esegue **lint + test + build** in automatico (`.github/workflows/ci.yml`). Esito verde = tutto ok; rosso = qualcosa è rotto e arriva un'email. È separato e indipendente dal deploy su Vercel. Storico run: scheda **Actions** del repo su GitHub.

> Manca ancora (post-gate): i **test sui flussi utente** veri (es. "crea cliente + appuntamento → genera i follow-up giusti"). Vedi CLAUDE.md › "Flusso agentic" punto C2.
