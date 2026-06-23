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

#### Check — 16/06/2026 (riportato da Erik, a caldo)

**Numeri live al 16/06 (da `api/track`):** app aperta **7 giorni su 7** (09–16/06, salto solo il 14) · 1 cliente in app · 5 follow-up inviati · 7 pending. Quadro invariato sui clienti, ciclo follow-up che gira sull'unico cliente.

**Cosa ha detto/fatto:** oggi ha **messo Sliss sul PC** (passo concreto di integrazione nel posto di lavoro, non solo telefono) e l'ha fatto davvero. Poi **in negozio sono arrivati clienti e non ha più fatto molto.**

**Lettura:** stesso attrito strutturale già mappato (07/06 e 12/06), ora osservato dal vivo nel punto preciso: il **flusso di lavoro reale in negozio mangia il momento dell'inserimento**. Il gesto di mettere l'app sul PC è un segnale positivo di volontà di adozione (vuole averla a portata sul banco), ma conferma che l'inserimento manuale non sopravvive all'arrivo dei clienti. Nessuna azione: si resta nella decisione del 12/06 (aspettare i suoi tempi, non caricare). Rafforza ulteriormente l'evidenza pro **sync Calendar/automazione ingresso** (Fase 3).

**Categoria:**
- [ ] Bloccante
- [x] Frizione → attrito d'ingresso confermato sul campo (il lavoro reale interrompe l'inserimento)
- [ ] Richiesta feature
- [x] Insight → tentativo di adozione spontaneo (app sul PC) ⇒ interesse vivo; il collo di bottiglia è l'inserimento, non la motivazione

---

#### Check — 22/06/2026 (aggiornamento Erik + verifica dati live)

**Novità:** Moira ha **installato Sliss su desktop** e le **notifiche funzionano**. Aperta oggi 22/06.

**Numeri live (da tracking + backup):** 11 giorni attivi · 2 clienti (ulrike, marilena — entrambe inserite il 18/06) · 2 follow-up inviati · 6 pending. Backup sano, aggiornato 22/06 07:50. Templates personalizzati per tattoo (testo sulla cicatrizzazione, pellicola, ripasso gratuito 30gg).

**Nota:** il passaggio telefono→desktop ha creato un **secondo localStorage**. I 2 clienti del 18/06 sono diversi dal "1 cliente" del 16/06 (inserito da telefono). Non è perdita dati ma split: il server vede solo l'ultimo device che pinga. In futuro la sync (Fase 3/Supabase) risolve; per ora è solo un'imprecisione nelle metriche server, non un problema per Moira.

**Lettura:** l'adozione spontanea su desktop conferma interesse reale (già segnalato il 16/06). Moira continua a usare Sliss e a inserire clienti veri. Il collo di bottiglia resta l'inserimento manuale, ma il ritmo è migliorato (da 1→2 clienti in pochi giorni quando il lavoro c'è).

**Categoria:**
- [ ] Bloccante
- [ ] Frizione
- [ ] Richiesta feature
- [x] Insight → adozione desktop + notifiche = un passo in più nell'integrazione quotidiana; split localStorage = nota tecnica per Fase 3

---

#### Check — 23/06/2026 (impressioni a voce raccolte da Erik, entrambi i tester)

**Cosa hanno detto (entrambi):**
- ✅ **Nuova interfaccia piace** — le migliorie apportate apprezzate da tutti e due.
- 🟡 **Richiesta potenziamento notifiche:** vogliono essere triggerati nei momenti giusti — es. i "da fare oggi" dovrebbero arrivare come notifica al mattino (~10:00), non solo comparire nell'app. Valevole per **tutti i moduli presenti e futuri**. Erik ha spiegato che per ora le notifiche sono gestite così (2 cron, orari fissi) per non spendere risorse su strumenti di notifica.

**Moira:** sta **cominciando a instradare il flusso di lavoro** dentro Sliss. Segnale positivo: non è più "devo trovare 5 minuti" ma integrazione attiva nel processo quotidiano.

**Luca:** trial M3 "Richieste" (`public/anteprima-richieste.html`) inviato ieri sera da Erik. **In fase di valutazione** — ci guarda quando ha tempo e voglia. Nessuna pressione.

**Lettura (gate):** il quadro migliora su entrambi i fronti. Moira ha superato la fase "aggiunge tempo" (07/06) e sta entrando nel ritmo. Luca continua solido e si prepara a testare M3. La richiesta notifiche è un segnale sano: non chiedono meno notifiche (= fastidio) ma **più precise** (= vogliono essere aiutati meglio, il valore c'è). Il vincolo è infrastrutturale (Vercel Hobby 2 cron, ±59min), non di design — si sblocca con Vercel Pro o cron esterni in Fase 3.

**Categoria:**
- [ ] Bloccante
- [ ] Frizione
- [x] Richiesta feature → notifiche smart per timing (cross-modulo, Fase 3)
- [x] Insight → entrambi i tester apprezzano le migliorie UI; Moira in fase di adozione attiva; la richiesta "notifiche migliori" conferma che il valore del reminder è acquisito

--- (Kayek3D, stampa 3D)

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

#### Check — 16/06/2026 (riportato da Erik, a caldo)

**Numeri live al 16/06 (da `api/track`):** app aperta **7 giorni su 7** (09–16/06, salto solo il 13) · 6 clienti in app · 13 follow-up inviati · 15 pending. Cresciuto da 9→13 inviati e 4→6 clienti rispetto al 12/06.

**Cosa ha detto:** **approva per adesso.** Niente lamentele, uso costante.

**Lettura:** segnale solido che si rinforza. **13 usi reali ⇒ ben oltre la soglia ~8 del gate** sul criterio "usi reali". Resta da raccogliere a voce la conferma esplicita di "valore" e l'eventuale dolore M3 (richieste perse) come trigger d'esempio.

**Categoria:**
- [ ] Bloccante
- [ ] Frizione
- [ ] Richiesta feature
- [x] Insight → criterio "usi reali" del gate soddisfatto da Luca; in attesa della conferma "valore" a voce

---

#### Check — 21/06/2026 (riportato da Erik)

**Cosa ha detto:** Luca ha avuto **2 riscontri positivi dai clienti sui follow-up di richiesta recensione.** Cioè i messaggi di richiesta recensione generati da Sliss hanno prodotto risposte positive reali dai suoi clienti.

**Lettura (gate):** è la **prima evidenza concreta del criterio "valore"** dal lato Luca — non più solo "approva", ma un risultato osservabile prodotto da M1 (il follow-up recensione funziona sul campo). Sommato a: 13+ usi reali (oltre soglia ~8) + uso costante 7/7. **Luca è molto vicino a un GO personale**; restano da raccogliere a voce la conferma esplicita "mi dà valore / voglio continuare" + il dato **copertura** ("dei clienti avuti, quanti gestiti con Sliss?"). Prossimo passo = giro TEST con Luca, i 2 riscontri positivi sono il gancio naturale.

**Categoria:**
- [ ] Bloccante
- [ ] Frizione
- [ ] Richiesta feature
- [x] Insight → **segnale "valore" positivo** (recensioni generate da M1 con esito reale); gate lato Luca quasi completo

---

#### Check — 22/06/2026 (verifica dati live + aggiornamento Erik)

**Novità:**
- ✅ **Moira ha installato Sliss su desktop (PC)** — notifiche funzionanti anche da lì. Aperta **oggi 22/06** (confermato da tracking).
- ✅ **Notifiche broadcast arrivano a entrambi i tester** — il bug 5-cron (decisione 11/06) è superato. Report giornaliero include correttamente Luca.

**Numeri live al 22/06 (da `api/track` + `api/backup`):**
- **Moira:** 11 giorni attivi (ultimo: 22/06) · 2 clienti (ulrike, marilena — inseriti 18/06) · 2 follow-up inviati · 6 pending. Backup sano e aggiornato (22/06 07:50). ⚠️ I 2 clienti sono diversi dal precedente "1 cliente" del 16/06: probabile split telefono/desktop (due localStorage separate). Non è perdita, ma i numeri server dipendono da quale device pinga per ultimo.
- **Luca:** 10 giorni attivi (ultimo: 20/06) · tracking mostra **0 clienti, 0 inviati** — MA è un **falso zero** causato da incidente del 20/06 (vedi sotto). Dati reali **ancora sul suo telefono** (verificato da Erik).

**Incidente dati Luca (20/06):** Erik ha aperto il link di ingresso di Luca dal suo PC pensando di usare quello senza codice tester. Questo ha creato un contesto vuoto "Nathan/officine" sotto il codice `luca`, sovrascrivendo sia `usage:luca` (tracking) sia `backup:luca`. Il guard anti-cancellazione in `backup.js` è stato aggiunto **dopo** l'incidente. `track.js` non ha ancora lo stesso guard → **bug aperto**. I dati server si riparano da soli alla prossima apertura di Luca dal suo telefono (il ping sovrascriverà i dati "Nathan" con quelli reali).

**Lettura (gate):** i numeri server di Luca **non sono affidabili al 22/06** per via dell'incidente. Il dato reale del 21/06 (2 riscontri recensione + 13 usi) resta valido perché osservato prima della sovrascrittura e confermato da Erik a voce. Per il prossimo check, aspettare che Luca riapra → tracking si riallinea.

**Azioni:**
1. ~~Aggiungere guard anti-overwrite-empty anche a `track.js`~~ → fix DEV
2. Prossima apertura di Luca dal telefono ripristina i dati server

**Categoria:**
- [ ] Bloccante
- [x] Frizione → dati server di Luca contaminati (auto-risolvibile, ma track.js va protetto)
- [ ] Richiesta feature
- [x] Insight → il link tester aperto dal device sbagliato è un vettore di corruzione dati; serve protezione su tutti gli endpoint, non solo backup

---

#### Check — 23/06/2026 (riportato da Erik)

**Cosa ha detto:** Luca **approva il trial M3 "Richieste"** (`public/anteprima-richieste.html`, inviato la sera del 22/06). Il design della chat guidata su pagina Sliss è validato dall'utente reale per cui è stato progettato.

**Lettura (gate + roadmap):** questo chiude il cerchio spec-first per M3 — spec scritta (`docs/spec-m3-richieste.md`), prototipo prodotto, validato dal tester. Quando il gate M1 passa, M3 si costruisce senza ri-ragionare il "cosa". Lato gate M1: Luca è sempre più vicino al GO — 15+ usi reali ✅, uso costante ✅, 2 riscontri recensione ✅, trial M3 approvato ✅. Restano solo le due risposte esplicite a voce (conferma "valore" + copertura).

**Categoria:**
- [ ] Bloccante
- [ ] Frizione
- [ ] Richiesta feature
- [x] Insight → **spec M3 validata dal tester reale prima di costruire** — approccio spec-first confermato; Luca è il tester più avanzato verso il GO

---
