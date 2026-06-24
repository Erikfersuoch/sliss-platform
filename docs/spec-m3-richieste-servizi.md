# SPEC — M3 "Richieste" per SERVIZI (chat guidata + FAQ + info pre/post)

> **Tipo:** spec-first su carta (CORE). Estende M3 al flusso servizi (appuntamenti).
> **Stato:** in fase di design. Motore chat guidata già costruito per prodotti (Luca). Si adatta, non si riscrive.
> Creata 24/06/2026. Complementare a `docs/spec-m3-richieste.md` (versione prodotti).

---

## A cosa serve (in una frase)

Il cliente che scrive a un professionista su appuntamento (tatuatrice, barbiere, estetista, officina, artigiano) trova **da solo** la risposta che cerca — FAQ, istruzioni pre/post trattamento — e **solo se vuole prenotare** il professionista viene disturbato con una richiesta da gestire.

---

## L'idea di Erik (24/06)

> "Combinerei gestione FAQ e onboarding: il cliente chiede, e magari sono solo info pre/post appuntamento gestibili in automatico. Ti tieni l'opzione di prenotazione."

Tradotto in architettura: **un punto di ingresso, tre rami**.

```
Cliente clicca il link
    │
    ├─ 🔍 "Ho una domanda"     → FAQ automatica (risposta istantanea, zero rumore)
    │
    ├─ 📋 "Info prima/dopo il trattamento" → Istruzioni pre/post automatiche (per tipo servizio)
    │
    └─ 📅 "Voglio prenotare"   → Richiesta → arriva al professionista nell'app
```

I primi due rami **non generano notifica**: il cliente ha la risposta, il professionista non viene disturbato. Solo il terzo arriva come "da gestire" nella cassetta Richieste.

---

## Cosa unifica

| Modulo originale | Cosa diventa qui |
|---|---|
| M3 Richieste | Il ramo "Voglio prenotare" |
| M6 FAQ | Il ramo "Ho una domanda" |
| M2 Onboarding (parte info) | Il ramo "Info prima/dopo il trattamento" |

Tre moduli → una sola chat guidata con script diverso per cluster. Il motore è quello già costruito per Luca (`public/richieste.html`).

---

## Architettura

**Motore:** identico alla versione prodotti. `public/richieste.html` con parametro `?o=TESTER&t=CLUSTER`.
- `o` = owner (chi riceve le richieste)
- `t` = tipo cluster (tattoo, barber, beauty, officine, artigiani) — determina lo script, le FAQ e le info pre/post

**Script per cluster:** ogni cluster ha il suo "copione" — domande diverse, risposte diverse, info pre/post diverse. Ma il motore (bolle chat, routing, invio) è lo stesso.

**Server:** stesso endpoint `api/richiesta-submit.js` — il ramo FAQ e info pre/post NON inviano nulla al server (sono self-contained nella pagina). Solo "Voglio prenotare" genera un submit.

---

## Banco FAQ per cluster (da ricerca di mercato)

### 🖤 Tattoo / PMU

**FAQ pre-appuntamento:**
1. Quanto costa un tatuaggio di [dimensione/soggetto]? → *"Dipende dalla dimensione e complessità. Scrivimi con un'idea e ti faccio un preventivo!"*
2. Quanto dura la seduta? → *"Da 1 a 4 ore in base alla complessità. Per lavori grandi si fanno più sedute."*
3. Quanto fa male? → *"Dipende dalla zona. Le parti con più osso (costole, piedi) sono più sensibili. La maggior parte delle persone lo sopporta bene!"*
4. Fate anche tatuaggi a colori / watercolor / realistico? → *[personalizzabile dal professionista]*
5. Posso portare un'immagine di riferimento? → *"Certo! Mandami pure le tue idee, le uso come base per il bozzetto."*
6. Bisogna essere maggiorenni? → *"Sì, serve essere maggiorenni. Sotto i 18 serve il consenso di un genitore."*
7. Chiedete un acconto? → *"Sì, l'acconto serve per confermare l'appuntamento. Se annulli entro [X] giorni ti viene restituito."*
8. Posso fare un tatuaggio se sono incinta? → *"No, è sconsigliato in gravidanza e allattamento per precauzione."*

**Info post-appuntamento (aftercare):**
1. Quando togliere la pellicola/second skin
2. Gonfiore/rossore/prurito: cosa è normale
3. Doccia sì, mare/piscina no per [X] giorni
4. Crema consigliata e frequenza
5. Il colore sbiadito nelle prime settimane è normale
6. Crosticine: non grattare, lasciare cadere da sole
7. Esposizione al sole: evitare per almeno 3-4 settimane
8. Ritocco: dopo 4-6 settimane, spesso incluso nel prezzo

### 💈 Barber / Parrucchiere

**FAQ pre-appuntamento:**
1. Quanto costa un taglio uomo/bambino? → *[prezzo personalizzabile]*
2. Fate anche barba e baffi? → *[sì/no personalizzabile]*
3. Quanto dura un appuntamento? → *"Taglio circa 30 min, taglio + barba circa 45-50 min."*
4. Accettate bambini? Da che età? → *[personalizzabile]*
5. Che prodotti usate? (allergie) → *[personalizzabile]*
6. Fate colorazione / copertura bianchi? → *[personalizzabile]*
7. Lo shampoo è incluso? → *[personalizzabile]*

**Info post-appuntamento:**
1. Prodotto usato oggi e dove trovarlo
2. Come mantenere il taglio a casa
3. Ogni quanto tornare per la forma
4. Cera/pomata consigliata per lo stile
5. Cura barba dopo il trattamento
6. Pelle irritata dopo rasatura: cosa usare

### ✨ Estetiste / Beauty

**FAQ pre-appuntamento:**
1. Quanto costa [ceretta/pulizia viso/laser]? → *[listino personalizzabile]*
2. Quanto dura il trattamento? → *[per tipo]*
3. Differenza tra trattamento A e B? → *[personalizzabile]*
4. Pelle sensibile / incinta / farmaci — posso farlo? → *[controindicazioni per tipo]*
5. Devo venire struccata? → *"Per la pulizia viso sì, per il resto no."*
6. Ogni quanto ripetere? → *[per tipo di trattamento]*
7. Avete pacchetti o promo? → *[personalizzabile]*

**Info post-appuntamento:**
1. Esposizione al sole dopo ceretta/laser: evitare 24-48h
2. Arrossamento normale, passa in poche ore
3. Trucco dopo pulizia viso: aspettare 12-24h
4. Crema consigliata a casa
5. Doccia/piscina/palestra: aspettare [X]h
6. Quando si vedono i risultati (per trattamenti a ciclo)
7. Irritazione/brufoli: quando è normale vs quando chiamare
8. Quando prenotare la seduta successiva

### 🔧 Officine

**FAQ pre-servizio:**
1. Quanto costa il tagliando per [modello]? → *"Dipende dal modello. Scrivimi marca e anno e ti faccio il prezzo."*
2. Quanto tempo ci vuole? → *[per tipo di intervento]*
3. Avete il ricambio in magazzino? → *"Scrivi il pezzo e controllo subito."*
4. Diagnosi con centralina: costo? → *[personalizzabile]*
5. Auto di cortesia disponibile? → *[personalizzabile]*
6. Ricambi originali o equivalenti? → *[personalizzabile]*

**Info post-servizio:**
1. Prossimo tagliando: quando
2. Spia riaccesa dopo intervento: cosa fare
3. Garanzia sul lavoro: durata e cosa copre
4. Manutenzione consigliata fino al prossimo check

### 🔨 Artigiani / Edilizia

**FAQ pre-servizio:**
1. Fate un preventivo per [tipo lavoro]? → *"Certo! Mandami qualche foto e una descrizione, ti rispondo entro [X]."*
2. Quanto ci vuole per il lavoro? → *"Dipende dall'entità. Dopo il sopralluogo ti do una stima precisa."*
3. Materiali: li fornite voi o li porto io? → *[personalizzabile]*
4. Serve qualche permesso? → *[per tipo di lavoro]*
5. Come funziona il pagamento? → *"Acconto alla conferma, saldo a fine lavori."*

**Info post-servizio:**
1. Garanzia: durata e copertura
2. Tempi di asciugatura/utilizzo (pavimento, tinteggiatura ecc.)
3. Prodotti per manutenzione/pulizia
4. Crepe/assestamenti: quando è normale

---

## Flusso dettagliato per il cliente

### Ramo 1: "Ho una domanda" (FAQ)
```
Chat: "Cosa vuoi sapere?"
→ Mostra le FAQ più frequenti per il cluster (lista cliccabile)
→ Cliente sceglie una domanda
→ Risposta automatica nella bolla chat
→ "Ti ho aiutato?" → Sì (fine) / No (→ "Scrivimi direttamente su WhatsApp")
```
**Zero submit al server. Zero notifica al professionista.**

### Ramo 2: "Info prima/dopo il trattamento" (info pre/post)
```
Chat: "Vuoi sapere cosa fare prima o dopo?"
→ "Prima del trattamento" → info PRE (come prepararsi, per tipo servizio)
→ "Dopo il trattamento" → info POST (aftercare, per tipo servizio)
→ Mostra le istruzioni nella bolla chat
→ "Hai bisogno d'altro?" → No (fine) / Sì (→ link WhatsApp)
```
**Zero submit al server. Zero notifica al professionista.**

### Ramo 3: "Voglio prenotare" (richiesta)
```
Chat: "Che servizio ti interessa?"
→ Mostra i tipi di servizio del cluster (lista cliccabile)
→ "Hai una preferenza di giorno/orario?"
→ Raccoglie nome + telefono
→ SUBMIT al server → notifica push al professionista
→ "La tua richiesta è stata inviata! Ti contatterà a breve."
```
**Unico ramo che genera un submit. Arriva nella cassetta Richieste dell'app.**

---

## Personalizzazione (settaggio per professionista)

Il professionista deve poter **personalizzare** il banco FAQ senza toccare codice. Approccio progressivo:

**v1 (ora):** le FAQ sono precompilate per cluster (il banco sopra). Il professionista le usa così come sono. È già meglio di niente — copre l'80% delle domande.

**v2 (prossimo):** in Impostazioni, una sezione "Le tue FAQ" dove può:
- Modificare le risposte precompilate (es. inserire i propri prezzi)
- Disattivare domande che non si applicano
- Aggiungere 2-3 domande custom

**v3 (Fase 3):** le risposte si arricchiscono con i dati dell'app (es. "Il prossimo slot libero è giovedì" → richiede sync calendario).

---

## Materiale proprio del professionista (brochure, PDF, immagini)

> **Principio (feedback Erik 24/06):** Sliss non sostituisce il materiale del professionista — lo distribuisce meglio. Se Moira ha già una brochure aftercare bella e fatta bene, farle riscrivere tutto come FAQ testuale è un passo indietro.

**Approccio ibrido:** la chat fa da smistamento, ma il contenuto può essere un file caricato dal professionista (PDF, immagine, brochure) oppure il testo precompilato come fallback.

**Flusso con materiale proprio:**
```
Cliente: "Info prima/dopo il trattamento" → "Dopo il trattamento"
Chat:    "Ecco la guida alla cura del tuo tatuaggio 👇"
         ┌──────────────────────────────────┐
         │  📄  Guida Aftercare             │
         │  [anteprima / icona file]        │
         │                                  │
         │       [ Apri la guida ]          │
         └──────────────────────────────────┘
```

**Flusso senza materiale (fallback):**
```
Chat: risposte testuali precompilate per cluster (il banco FAQ sopra)
```

**Dove si carica:** in Impostazioni, sezione "Il tuo materiale":
- **Info pre-trattamento** → upload file (PDF/immagine) oppure niente (usa testo default)
- **Info post-trattamento** → upload file (PDF/immagine) oppure niente (usa testo default)
- Ogni tipo di servizio può avere il suo file diverso (es. aftercare tatuaggio ≠ aftercare PMU)

**Perché è potente:**
- Chi ha già materiale (Moira con la brochure) → lo carica e funziona subito, zero riscrittura
- Chi non ha niente → usa le FAQ testuali precompilate (comunque meglio di niente)
- Il materiale del professionista mantiene il suo **brand** (grafica, tono, stile) — Sliss non lo appiattisce
- Stesso materiale distribuito a ogni cliente, automaticamente, al momento giusto — oggi Moira lo manda a mano su WhatsApp uno per uno

**Estensione futura:** lo stesso meccanismo vale anche per FAQ (un professionista potrebbe caricare un PDF "listino prezzi" come risposta alla domanda "Quanto costa?") e per il ramo prenotazione (un PDF "cosa portare al primo appuntamento").

---

## Sinergia con M1 (follow-up)

| Evento | Cosa succede in M1 |
|---|---|
| Ramo FAQ | Niente — è self-service |
| Ramo info pre/post | Niente — è self-service. MA: le stesse info possono essere inviate come follow-up post-appuntamento (M1 già lo fa!) |
| Ramo "Voglio prenotare" | La richiesta arriva → il professionista la accetta → crea appuntamento → partono i follow-up automatici (come oggi) |

Il ramo 3 è la **cucitura M3→M1** per i servizi, identica nel principio a quella M3→M1 per i prodotti (richiesta → ordine → follow-up).

---

## Da validare con Moira (prima di costruire)

1. **Quali domande riceve davvero su WhatsApp/Instagram?** (Confronto con il banco FAQ sopra — conferma o aggiusta)
2. **Che istruzioni aftercare dà oggi ai clienti?** (Es. le manda già su WhatsApp? Ha un foglio stampato?)
3. **Come gestisce le prenotazioni oggi?** (WhatsApp diretto? DM Instagram? Telefono?)
4. **Quante richieste/domande a settimana?** (Volume per capire il valore)

---

## Fatto quando (criteri di accettazione)

- a) Il cliente clicca il link → sceglie tra FAQ / Info / Prenotare
- b) Ramo FAQ: vede le domande, clicca, ottiene la risposta. **Zero notifica al professionista.**
- c) Ramo Info: sceglie pre o post, vede le istruzioni. **Zero notifica.**
- d) Ramo Prenotazione: sceglie servizio, lascia nome+telefono → arriva nella cassetta dell'app → il professionista la accetta e crea l'appuntamento
- e) Le FAQ e le info sono **specifiche per cluster** (tattoo ≠ barber ≠ beauty)
- f) **NON deve rompere:** il flusso prodotti (Luca), i follow-up, la Home, i 45 test

---

## Costruzione a slice (proposta)

| Slice | Cosa |
|---|---|
| 1 | Biforcazione `richieste.html`: se `t=tattoo/barber/beauty/officine/artigiani` → script servizi; se assente → script prodotti (Luca, invariato) |
| 2 | Ramo FAQ: banco domande/risposte per cluster, self-contained (zero server) |
| 3 | Ramo Info pre/post: istruzioni aftercare per cluster, self-contained |
| 4 | Ramo Prenotazione: raccolta servizio + preferenza orario + nome/telefono → submit |
| 5 | Cucitura M3→M1: "Accetta richiesta" → crea appuntamento + follow-up automatici |

---

*Prossimo passo: validare il banco FAQ con Moira (confronto con le domande che riceve davvero). Si costruisce solo dopo conferma.*
