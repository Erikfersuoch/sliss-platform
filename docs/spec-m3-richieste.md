# SPEC — M3 "Richieste" (chat guidata che instrada)

> **Tipo:** spec-first su carta (CORE). NON è un via libera a costruire.
> **Stato:** M3 **bloccato fino a validazione M1** (gate "occasioni reali"). Questa spec serve solo ad anticipare il *cosa*, così che a GO lo sviluppo voli.
> Creata 22/06/2026. Fonte del dolore e cronologia: `docs/modulo-richieste-v1.md`.

---

## A cosa serve (in una frase)
Far sì che un cliente che scrive a Luca su WhatsApp arrivi **da solo** alla soluzione giusta — comprare un prodotto pronto **oppure** lasciare una richiesta su misura tracciata — **senza che Luca debba intervenire se non serve davvero**, e senza che la richiesta gli si perda.

## Il modello d'interazione (riferimento: chatbot YOUVERSE)
Una **chat guidata che ramifica**: poche domande, ogni risposta sblocca il passo giusto, finché il cliente atterra sull'esito migliore. Come il bot YOUVERSE (scegli lingua → prosegue), ma applicato allo smistamento di Luca.

## Dove vive (il punto tecnico che decide il fattibile)
- **Oggi (€0, no API):** WhatsApp Business manda un **messaggio di benvenuto automatico** (funzione gratuita della app, NON l'API) con un link. Il link apre una **pagina Sliss** che ospita la chat guidata. Il "cervello" che ramifica è Sliss; WhatsApp è solo la porta.
- **Fase 3 (API a pagamento):** la stessa chat può migrare *dentro* WhatsApp. La logica di ramificazione, progettata una volta, si riusa. **Nessun lavoro buttato.**

## Il flusso ramificato — v1 (bozza, da tarare su Luca)
1. **Apertura:** "Ciao! Ti aiuto a trovare quello che cerchi in 10 secondi 👋 Cosa ti serve?"
2. **Bivio principale (il cliente si auto-classifica con un tap — il giudice è il cliente, non un'AI):**
   - **A) "Un prodotto pronto / accessorio"** → micro-domanda di compatibilità su **due famiglie** (vedi tassonomia) → **instrada a eBay/catalogo** (bottone-link). La vendita si chiude lì, **zero effort Luca**.
   - **B) "Qualcosa su misura / personalizzato"** → mini-form guidato (cosa ti serve · per che moto · foto opzionale · come ricontattarti) → **richiesta tracciata in Sliss + promemoria attivo a Luca**.
   - **C) "Altro / un'informazione"** → risposte rapide alle domande frequenti; se non basta → confluisce in B (richiesta tracciata).
3. **Lato Luca:** lista **"Richieste"** con stati = **le stesse etichette che Luca già usa su WhatsApp** (ponte naturale, niente doppia lista). Stato base: nuova → presa in carico → chiusa.

## Struttura del modulo (ragionata 22/06)

**Grammatica — i mattoni.** Un flusso = 1 tipo di snodo + 3 finali:
- 🔹 **Blocco-domanda:** domanda con 2-4 risposte toccabili; ogni risposta → blocco successivo o finale.
- 🔚 **Finale-instrada:** messaggio + bottone-link (eBay/catalogo). Cliente esce, zero lavoro Luca.
- 🔚 **Finale-cattura:** mini-card → salva una Richiesta + promemoria a Luca + conferma al cliente.
- 🔚 **Finale-risposta:** risposta a una FAQ, con eventuale *"ti è bastato? no → cattura"*.

Il **motore** (comune, codice) renderizza i 4 mattoni; lo **script** (cucito per categoria, dati) li riempie e collega. Principio: **poco profondo — 1-3 tap a un finale.** Alberi profondi = abbandono (rif. YOUVERSE = 1 tap).

**Entità — Richiesta = lead separato "promovibile" (Opzione A).** Lead leggero in lista propria, stati = etichette WhatsApp di Luca (nuova → presa in carico → chiusa). NON sporca la lista Clienti finché non si concretizza.

**Sinergia coi moduli** *(bussola di Erik: ogni modulo funziona da solo MA si amplifica in sinergia con gli altri).* Il follow-up di M1 è appeso all'**Ordine**, non al cliente → quindi: **Richiesta → promozione → Ordine → follow-up automatici.**
- *Percorso su misura* (Sliss controlla la transazione): l'accettazione di Luca **crea l'Ordine** → i follow-up partono. ~Zero-tocco.
- *Percorso eBay* (Sliss è cieco sulla vendita, niente checkout in casa): **un tap di Luca** ("andata a buon fine → crea ordine"). **Accettato da Erik come prezzo della sinergia.** Lo zero-tocco vero su eBay = integrazione eBay = **dipendenza pesante, NON v1.**

**Cattura contatto = Ibrido (il più "liscio") — scelto 22/06.**
- *Percorso eBay:* **rimbalzo WhatsApp** — bottone "Sì, avvisami" apre WhatsApp con messaggio già scritto (contesto incluso) → Luca riceve numero + contesto in modo nativo. Zero form, un tap. L'opt-in "sì" **è** il consenso (niente checkbox).
- *Percorso su misura:* **mini-card sulla pagina** (cosa serve + foto opzionale), contesto pre-riempito, conferma calda ("Fatto 😌 ci penso io").
- Principi trasversali: **mai bloccare l'uscita** (eBay sempre raggiungibile, saltare è gratis); **frase-regalo, non richiesta**; **"già sa, non ti fa ripetere"** (le risposte della chat viaggiano nel contatto). Quando si costruirà, passaggio obbligato da `/impeccable`.
- ⚠️ **Nessuna automazione oltre al benvenuto nativo.** L'unico messaggio automatico è il **benvenuto di WhatsApp Business** (al primo contatto, gratis, nativo — non nostro). I "ricevuto / ti rispondo a breve" **li scrive il professionista a mano**: non vanno mai mostrati come automatici. Anzi, l'assenza di ack automatico è il **buco che il promemoria di Sliss copre** (se il professionista tarda, Sliss glielo ricorda) — mostrarlo come automatico indebolirebbe il senso del modulo.

## Tassonomia di instradamento (il ramo "prodotto pronto")
Luca vende su **due assi di compatibilità diversi** — la domanda strategica cambia in base a cosa cerca il cliente:
- **Famiglia A — cover per cronometri/strumenti** (Starlane ST500/Stealth, Alfano, ecc.): la domanda chiave è *quale strumento hai?*, non quale moto.
- **Famiglia B — ricambi/accessori moto** (kit manutenzione CRF250, accessori KTM, ecc.): la domanda chiave è *che moto hai?*.
Quindi il primo bivio del ramo prodotti è *"cosa cerchi: cover per cronometro / ricambio-accessorio moto / altro"*, poi la domanda di compatibilità giusta per la famiglia. (Conferma dallo storico ordini reale di Luca.)

### Menu di primo livello + catalogo reale (da eBay `kayek_3d`, 22/06)
Prima selezione (categorie reali, non inventate): **Cover cronometro/GPS · Cover pulsanti · Recupero fluidi · Protezioni & tamponi · Lavaggio moto · Su misura/altro**. Nome e cognome del cliente → **due campi separati** (igiene dato: niente valori invertiti nei follow-up).

Catalogo (semina della mappa di instradamento):
- **Cover cronometro/GPS** (~29,90 €): Aim Solo 1/2, Aim Mychron 5/6 *(personalizzabili)*, Starlane Stealth / Stealth 5 / Athon / Corsaro, PzRacing Start / ST500, Alfano 7.
- **Cover pulsanti** (25 €): Honda/Kawasaki, CRF250.
- **Recupero fluidi** (15-25 €): imbuto filettato Kawasaki/CRF, apri tappo radiatore KTM.
- **Protezioni & tamponi/slider** (6-39 €): tamponi universali/forcellone, kit tamponi supermoto, slider/puntale pedana, cover dischi freno.
- **Lavaggio**: tappo lavaggio airbox CRF.
- **Supporti**: ForkTag localizzatore, supporto tachimetro Honda, copri viti GoldWing.

**Personalizzazione = supplemento configurabile dal professionista.** Alcune cover sono "personalizzabili" (es. Mychron 5/6, PzRacing ST500). Luca imposta una volta un **supplemento** (es. +5 €), mostrato al cliente **prima** (Base + personalizzazione = Totale). La cover personalizzata **non va su eBay** → diventa un **ordine catturato** (base + supplemento), stesso formato del su-misura. (Visualizzato nel trial, sezione 3.)

## Come si costruisce la mappa di instradamento (sorgente dati — niente carico su Luca ora)
Tre livelli di "intelligenza" del ramo prodotti:
- **Livello 0:** nessuna lista, instrada al catalogo eBay e basta. Zero dati, zero manutenzione.
- **Livello 1 (target v1):** poche domande → **link eBay già filtrato** per famiglia/modello. Serve la **mappa di instradamento** (domande + dove punta ogni risposta), NON la lista prodotti.
- **Livello 2 (step 2):** mini-catalogo dentro Sliss ("ti escono 5 prodotti compatibili"). Serve lista + compatibilità + manutenzione. Non da v1.

**Sorgente della mappa, senza chiedere niente a Luca adesso:** (a) struttura del suo **shop eBay** (`ebay.us/m/tuyQnq` — pubblico; fetch automatico fallisce perché JS-rendered, serve uno screenshot delle categorie); (b) **storico ordini** già nel backup (dà le famiglie reali); (c) i **3-4 messaggi reali** già richiesti (danno le parole con cui i clienti chiedono = le voci del menu). L'albero decisionale lo ricaviamo da come i clienti chiedono davvero, non a tavolino.

## Il valore differenziale (perché non basta WhatsApp)
WhatsApp **organizza** (le etichette) ma **non richiama**: una chat etichettata non ti ripinga. Sliss aggiunge i due pezzi che mancano: **cattura all'ingresso** + **promemoria attivo che torna**. È il buco temporale "messaggio arrivato → gestito" che oggi gli fa perdere clienti.

## ✅ Fatto quando (righello di accettazione, in italiano normale)
- a) Un cliente apre il link e, **senza scrivere a Luca**, viene portato a: o un prodotto pronto (link eBay/catalogo) o un form di richiesta su misura.
- b) Una richiesta "su misura" compilata **compare nella lista di Luca** con i dati e fa partire un **promemoria** finché non la prende in carico.
- c) Una richiesta "prodotto pronto" **non genera lavoro per Luca** (si chiude verso eBay/catalogo).
- d) Gli stati della lista **corrispondono alle etichette WhatsApp** di Luca (li mappiamo sui suoi reali).

## 🚫 Cosa NON deve fare / NON deve rompere
- **NON** fa checkout/pagamenti: la vendita resta su eBay/catalogo. Sliss è il **deflettore**, non il negozio.
- **NON** duplica le etichette di Luca (doppia lista = abbandono).
- **NON** gonfia il modulo Follow-Up (M1): è un **modulo separato** ("non perdere il cliente *prima*" vs "*dopo*").
- **NON** legge i messaggi WhatsApp in automatico: serve l'API = Fase 3. La v1 parte dal **link** nel benvenuto.
- **NON** rompe M1 né i flussi tester attuali.

## Come si aggancia all'esistente
Poggia sul **motore condiviso** già in uso da M1: link pubblico (pattern onboarding) + cattura record + promemoria + notifiche. È il primo vero test del "modulo su motore". **Niente framework-moduli generico ora** (astrazione prematura: prima 2 moduli veri, poi si estrae il comune).

## Confine fattibile-oggi vs Fase 3
| | Oggi (v1, €0) | Fase 3 (API a pagamento) |
|---|---|---|
| Porta d'ingresso | Benvenuto auto WA → link | Chat dentro WhatsApp |
| Chat guidata | Pagina Sliss | Dentro WhatsApp |
| Lettura msg automatica | No | Sì |
| Catalogo "ti escono 5 prodotti" | Step 2 (serve catalogo in Sliss) | Sì |

## Scalabilità ai servizi su appuntamento (visione raffinata — NON da v1, da rifinire su un vero tester servizi)
Erik vuole che il sistema scali anche alle attività **a appuntamento**. Si può, ma il format va impostato bene — la mappatura ingenua "prodotti→servizi 1:1" è sbagliata.

**L'asse giusto NON è "prodotti vs servizi".** È: **standard & self-service ↔ su misura & serve l'umano**, e taglia trasversalmente. La cover pronta di Luca e il taglio standard del barbiere stanno entrambi a sinistra; il tatuaggio su consulto e la richiesta custom di Luca stanno entrambi a destra. Prodotti e servizi sono **lo stesso bivio** con oggetti diversi.

**Perché i servizi sono un po' più complessi (limite reale, da nominare):** per i prodotti il ramo "standard" chiude **fuori da Sliss** (eBay fa il checkout, cliente se ne va, zero lavoro). Per i servizi il ramo "standard" sarebbe **prenotare** — ma Sliss oggi **non ha agenda con disponibilità pubblica** (gli appuntamenti li inserisce il professionista). Quindi il cliente **non chiude da solo** una prenotazione come compra una cover. Il self-service di prenotazione richiede la **gestione disponibilità** = pezzo in più, più grande → step successivo, non v1.

**Format servizi v1 (raffinato):** NON un sistema di prenotazione, ma una **chat di triage/qualifica**: domande giuste (che servizio, più o meno quando, urgenza, foto per i lavori su misura) → **richiesta strutturata e pre-qualificata** → il professionista **conferma**. Non azzera il suo intervento, ma gli arriva tutto pronto invece del ping-pong di messaggi. In pratica per i servizi **il ramo "su misura" di Luca diventa il ramo principale** (qualifica + cattura); la prenotazione self-service è uno step a parte.

⚠️ **Disciplina (regola del progetto): NON costruire ora il framework generico.** L'astrazione prematura è il rischio numero uno. Si fa M3 **concreto su Luca/prodotti**, lo si fa funzionare davvero, e **solo dopo** si estrae il pattern comune per la variante servizi (= "prima 2 moduli veri, poi si estrae il comune"). Registrato qui come visione raffinata per non perderlo, **non per anticiparlo nel codice**.

## Cucito su categoria o mezzeria comune? (la falsa scelta — risoluzione)
Dubbio di Erik: cucire il modulo su ogni categoria (utile ma non scala) o trovare una mezzeria comune (scala ma rischia di non servire a nessuno). **È una falsa scelta.** Si spacca il modulo in due strati:
1. **Motore = comune (codice, scritto una volta):** la meccanica della chat guidata — domande, ramificazione, instradamento a link OPPURE cattura richiesta tracciata + promemoria. Identica per tutti.
2. **Script = cucito per categoria (dati, non codice):** le domande vere, le etichette dei rami, dove punta ogni risposta. Luca ha lo script-Luca; il tatuatore lo script-tatuatore. Stesso motore, copione diverso.

Così ogni categoria *sembra* cucita (perché le domande SONO le sue) senza riscrivere il modulo. **La "mezzeria inutile" nasce solo se si generalizzano le *domande* ("come posso aiutarti?" → blando). Si generalizza il *motore*, mai il *copione*.**

⚠️ La mezzeria giusta **non si indovina a tavolino** (lì sta il rischio astrazione-inutile): si **scopre dal 2° caso reale**. Quindi M3 si fa **cucito-concreto su Luca prima**, e il motore comune si estrae quando arriva un tester servizi vero. Costruisci concreto → generalizza dopo l'evidenza, non prima.

## Authoring delle selezioni — chi costruisce lo "script" (a fasi)
Le selezioni/albero sono **dati**, non codice (vedi struttura sopra). Chi li compila evolve:
- **v1 / test (ora):** selezioni **cucite su Luca** a mano da noi. Va bene per provare il flusso.
- **Generalizzazione (productization, post-gate):** ogni professionista **configura le proprie selezioni da sé** — editor self-service. È la messa a terra del principio "motore comune + script cucito": il motore è nostro, lo script lo fa il professionista.
- **Avanzato:** chi ha un **inventario** lo **importa**, Sliss lo **elabora** (categorie/attributi → struttura) e lo lascia **modificabile dopo il caricamento**. Possibile assist AI per la categorizzazione = Haiku, costo trascurabile in test (cfr. `docs/decisioni.md` 21/06).

⚠️ Disciplina: **non costruire ora** editor/import. Emergono quando si esce dal cerchio tester (primo "freddo") post-gate. Erik stesso li colloca "dopo aver provato su Luca" — concreto prima, autonomia poi.

## ⏳ Da validare con Luca prima di costruire (non sollecitare ora — attesa attiva)
Info già richieste e in attesa (vedi log): 1) screenshot **etichette** WA; 2) **3-4 messaggi reali** (facile / personalizzato / su misura) per tarare le voci del menu; 3) **volume settimanale** per dimensionare il promemoria.
Due conferme aperte a Erik: i) ok alla **v1 senza catalogo** (routing + cattura), col "5 prodotti" come step 2? ii) ok al **link** oggi, accettando che l'intercettazione automatica sia Fase 3?

---
*Prossimo passo reale: nessuno finché non scatta il GATE M1. Questa spec resta in frigo, pronta.*
