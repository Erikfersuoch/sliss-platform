# Test M1 — Feedback Log

> Due sezioni separate: una per tester. Metriche non aggregate.
> Durata minima per validazione: 14 giorni consecutivi di uso reale per tester.

---

## Tester zero — Moira (moglie, Momo Ink)

**Kickoff:** 19/05/2026
**Settore:** Studio tatuaggi

### Metriche (aggiornate settimanalmente)

| Settimana | Giorni di uso / 7 | Tempo medio / giorno | Risposte clienti ricevute | Recensioni generate |
|---|---|---|---|---|
| 1 (dal 19/05) | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

**Soglie di validazione M1:**
- Uso: ≥ 5 giorni su 7
- Tempo: < 15 minuti al giorno
- Risposta clienti ai follow-up: > 30%
- Recensioni generate: +2-4 al mese

### Log feedback

#### Kickoff — 19/05/2026

**Cosa ha usato:** prima presentazione dell'app

**Cosa ha funzionato:**
- Interfaccia: reazione positiva

**Cosa ha creato frizione / insight:**
- [Frizione] Follow-up riattivazione (60-90gg): lo considera inutile — il cliente deve rientrare autonomamente
- [Insight] Follow-up ringraziamento: deve essere molto vicino alla fine della prestazione (già strutturato così — da confermare sul campo)

**Richieste esplicite:** nessuna

**Note:** entrambi i punti vanno validati con i dati, non risolti a tavolino.

**Categoria:**
- [ ] Bloccante → fix immediato
- [x] Frizione → backlog prioritario
- [ ] Richiesta feature → parking-lot
- [x] Insight → da tenere sotto osservazione

---

<!-- Copia il blocco "#### Check — [DATA]" ogni settimana -->

#### Check — 07/06/2026 (questionario 6 domande, riportato da Erik)

**Cosa ha usato:** app usata **poco**. Follow-up: li ha mandati davvero. Notifiche: le riceve.

**Cosa ha funzionato:**
- ✅ La notifica/promemoria **aiuta a ricordarsi** (valore del reminder confermato).
- ✅ Follow-up mandati davvero ai clienti.
- ✅ Notifiche ricevute (step zero ok).

**Cosa ha creato frizione (IL punto):**
- 🔴 **"Mi aggiunge tempo di lavoro al momento."** Equazione costo/beneficio negativa: il promemoria aiuta, ma l'**inserimento dei dati costa più del beneficio percepito** → uso basso. Segnale di validazione M1 **debole** sul criterio "risparmia tempo".

**Canali ingresso (D3):** clienti/appuntamenti da **tutti e 3** (WhatsApp, Instagram, di persona).

**Gestione (D4):** "prendo appuntamento" — usa l'agenda; non lamenta mancanza di stati.

**Bacchetta magica (D6) — il dolore vero:** *"Segnare i dati e gli appuntamenti, ricordarli, e sapere come stanno guarendo."* → **COMBACIA con la missione di M1** (registrare + ricordare + seguire la guarigione). La direzione è giusta; il valore è **strozzato dal costo d'inserimento manuale**.

**Metriche:** uso = basso ("poco", sotto soglia ≥5/7). Tempo = "aggiunge", non risparmia. Follow-up inviati: sì. Tasso risposta: da leggere in-app.

**Categoria:**
- [x] Frizione → backlog prioritario (**attrito d'inserimento**: "aggiunge tempo")
- [x] Insight → la bacchetta magica conferma la direzione di M1; valore reale ma **costo d'ingresso troppo alto**
- [ ] Bloccante
- [ ] Richiesta feature

**Ipotesi da verificare (prossimo giro con Moira):**
1. DOVE esattamente aggiunge tempo? (inserire il cliente? l'appuntamento? entrambi?)
2. Usa il flusso **"Prepara scheda"** (onboarding via link, il cliente compila i dati da sé)? Se no, è la leva diretta per azzerare l'inserimento manuale.

---

#### Check — 12/06/2026 (brief 30 secondi, riportato da Erik)

**Numeri live al 12/06 (da `api/track`):** app aperta **4 giorni su 4** da quando esiste il tracking (09–12/06) · 1 cliente in app · 4 follow-up inviati · 8 pending. (Luca, stesso giorno: 4/4 giorni · 4 clienti · 9 inviati.)

**Cosa ha detto (domanda diretta "perché non lo usi?"):**
- 🔴 *"Devo trovare 5 minuti liberi."*
- ✅ **Interesse confermato esplicitamente:** all'offerta di Erik di passare il test ad altri ha risposto *"no no, mi interessa, devo trovare il tempo"*. Mezzo segnale positivo sul criterio "valore" del gate.

**Contesto (la chiave di lettura):** Moira lavora continuamente ma il **flusso di contatti NUOVI è fermo** — ha tutto già fissato. Il punto d'ingresso naturale di Sliss (link "Invita cliente" alla chiusura della conversazione col cliente nuovo) **non si verifica mai** in questo periodo: l'unico uso possibile sarebbe l'inserimento retroattivo a freddo, puro lavoro amministrativo con beneficio rimandato. (Luca conferma la stessa flessione di lavoro dal suo lato.)

**Lettura:** è lo scenario **"mancanza di dati, non bocciatura"** previsto dal gate rivisto il 10/06. Il dato "1 cliente in app" del tracking NON era perdita dati né disinteresse: era assenza di occasioni.

**Decisione di Erik (12/06):** **aspettare i tempi di Moira, senza caricare.** Un uso spinto dal founder (e marito) inquinerebbe il test: misurerebbe quanto le pesa dire di no, non il prodotto. Il backstop di fine luglio resta l'orologio.

**Opzione sul tavolo (NON proposta a Moira, da giocare se/quando lei riapre il tema):** "patto dei 5 minuti" — inserimento unico dei clienti **già fissati** (3-5 clienti, ~30 sec l'uno); i cicli di follow-up partono poi dagli appuntamenti reali. Uso legittimo (appuntamenti veri, non gonfiati) che testa il cuore del gate (il follow-up produce risposte/recensioni?) bypassando la siccità di contatti nuovi.

**Categoria:**
- [ ] Bloccante
- [x] Frizione → **attrito d'ingresso strutturale** (senza clienti nuovi non c'è trigger d'uso), non difetto del prodotto
- [ ] Richiesta feature
- [x] Insight → interesse reale + attrito d'inserimento ⇒ evidenza diretta per la **sync Google Calendar in Fase 3** (vedi `parking-lot.md`)

---

<!-- Copia il blocco "#### Check — [DATA]" ogni settimana -->

#### Check — [DATA]

**Cosa ha usato:**

**Cosa ha funzionato:**

**Cosa ha creato frizione:**

**Richieste esplicite:**

**Categoria:**
- [ ] Bloccante → fix immediato
- [ ] Frizione → backlog prioritario
- [ ] Richiesta feature → parking-lot
- [ ] Insight → da tenere sotto osservazione

---

## Tester uno — Luca (Kayek3D, stampa 3D)

**Kickoff:** in uso reale (kickoff formale da concordare)
**Settore:** Stampa 3D · vendita prodotti
**Canali ordini:** WhatsApp Business + eBay (lo shop vero) + Instagram. Catalogo prodotti su WhatsApp.

### Metriche (aggiornate settimanalmente)

| Settimana | Giorni di uso / 7 | Tempo medio / giorno | Risposte clienti ricevute | Recensioni generate |
|---|---|---|---|---|
| 1 | (non ancora rilevato) | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

**Soglie di validazione M1:**
- Uso: ≥ 5 giorni su 7
- Tempo: < 15 minuti al giorno
- Risposta clienti ai follow-up: > 30%
- Recensioni generate: +2-4 al mese

### Log feedback

#### Check — 06/06/2026 (riportato da Erik)

**Cosa ha usato:** i follow-up, concretamente.

**Cosa ha funzionato:**
- ✅ I follow-up gli piacciono **così come li abbiamo strutturati** (valore M1 confermato sul flusso prodotti).
- ✅ Le notifiche gli arrivano (`sub:luca` ok — step zero superato).

**Cosa ha creato frizione (IL punto):**
- 🔴 **Perde richieste in entrata su WhatsApp** e a volte le **ritarda di settimane**. Il dolore è *a monte* dell'ordine (gestione delle richieste che arrivano), non nel follow-up. Erik lo indica come "punto di apertura" per aiutarlo.

**Richieste esplicite:** nessuna diretta da Luca. La "bacchetta magica" (#6) non ancora raccolta da lui — Erik ha un'intuizione da confermare.

**Metriche:** uso/tempo non ancora rilevati.

**Categoria:**
- [ ] Bloccante → fix immediato
- [x] Frizione → backlog prioritario (richieste in entrata perse)
- [x] Richiesta feature → tocca **M3 Gestione Richieste** (oggi bloccato fino a validazione M1)
- [x] Insight → conferma che il caso d'uso primario di Luca è l'**inbound**, non il follow-up

---
