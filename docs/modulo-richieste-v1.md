# Modulo "Richieste" — definizione in corso (per Luca / prodotti)

> 📄 **Spec pronta:** `docs/spec-m3-richieste.md` (chat guidata che instrada, stile YOUVERSE). Questo file = cronologia/dolore validato; la spec = il "cosa" da costruire a GO.
> Stato: **in DEFINIZIONE — in attesa info da Luca** (non ancora iniziato).
> Aperto il 06/06/2026. Nato dal feedback di Luca (vedi `docs/test-m1/feedback-log.md`).
> Aggiornato l'08/06/2026.

---

## 🆕 AGGIORNAMENTO 12/06/2026 — seconda conferma indipendente (sondaggio Tally)

Un rispondente del sondaggio Tally (settore **ricambi moto**, 28/05, lead con telefono — contatto in Tally, possibile coincidenza con "Amico Motorsport" già in parking-lot) descrive il SUO dolore con le stesse parole del fondamento M3: vorrebbe automatizzare *"il primo contatto con il cliente per una scrematura, individuando perditempo da persone realmente interessate a concludere"* (= il deviatore/smistamento) e come UNO strumento vorrebbe *"un sito vetrina ben organizzato per proporre ai clienti tutti i prodotti a catalogo compatibili con la loro moto"* (= la Via 1 catalogo→carrello chiesta da Luca l'08/06). **Due settori diversi, stesso bisogno, stesso linguaggio → M3 è il modulo con più evidenza esterna della roadmap.** Resta bloccato fino a validazione M1; questo rafforza la scelta di farlo per primo se GO. Analisi completa in `docs/sondaggi.md`.

---

## 🆕 AGGIORNAMENTO 08/06/2026 — risposta di Luca (cosa vuole davvero)

Luca, alla domanda su cosa lo aiuterebbe di più, risponde:
> **«La gestione del cliente quando entra nella chat, con scrematura e/o indirizzamento al catalogo per riempire direttamente il carrello spesa.»**

Conferma in pieno lo **smistamento al primo contatto** e aggiunge un pezzo nuovo: non solo *classificare* (standard/particolare), ma **indirizzare al catalogo → carrello**. Cioè il cliente "pronto" viene guidato a **comporre l'ordine da solo** (self-service sul catalogo), così Luca riceve già il carrello composto invece di gestire la trattativa a mano. Spunto per la "Via 1" (standard): non solo rimando a eBay, ma un **mini-catalogo/carrello** dove il cliente sceglie e Luca riceve l'ordine pronto. Da valutare per M3 **dopo il gate M1 (21/06)**. ⚠️ M3 resta bloccato fino a validazione M1 — registrato per non perderlo, non si inizia ora.

---

## ⏳ AGGIORNAMENTO 07/06/2026 — fondamento rivisto + info richieste a Luca

**Fondamento corretto.** La visione di Erik è lo **smistamento automatico bidirezionale**: il cliente scrive → standard si chiude da sola verso eBay/catalogo (zero effort Luca) / particolare arriva a Luca tracciata. Il sistema NON può *leggere* il messaggio senza WhatsApp Business **API** (= Fase 3). La versione fattibile oggi sposta lo smistamento **al primo contatto**, non dentro il messaggio:

- **Deviatore automatico = messaggio di benvenuto automatico di WhatsApp Business app** (gratuito, NON l'API). Si attiva da solo al primo messaggio del cliente, presenta un menu → il **cliente si auto-classifica** con un tap (il "giudice" è il cliente, non l'AI):
  - Via 1 "cerco un prodotto pronto" → link eBay/catalogo → **vendita si chiude da sola**, Luca non tocca nulla.
  - Via 2 "personalizzato / su misura" → link Sliss → mini-form → **richiesta tracciata + push a Luca**.
- **Sliss costruisce solo la Via 2** (pagina-richiesta + cattura + lista). Il deviatore lo fa WhatsApp gratis.

**Contesto Luca confermato (07/06):** usa **WhatsApp Business** ✓ (quindi il benvenuto auto è disponibile). Vende **prodotti pronti + personalizzazione + su misura + magazzino** (quindi la Via 1 non è marginale). **Usa MOLTO le etichette** WA per organizzarsi.

**Insight etichette (chiave per il design):** Luca ha già un sistema (le etichette). Il modulo NON deve duplicarle (→ doppia lista = abbandono). Il dolore non è *organizzare* (le etichette lo fanno), è il **buco temporale prima**: tra "arriva il messaggio" e "lo gestisco". WhatsApp organizza ma **non richiama** (una chat etichettata non ti ripinga). Valore differenziale di Sliss = **cattura all'ingresso + promemoria attivo che torna**. Mossa a costo zero: progettare gli **stati della lista Richieste = uguali alle etichette che Luca già usa** (ponte naturale verso l'automazione futura). Leggere le etichette in automatico = API = Fase 3.

**Info richieste a Luca via WhatsApp (in attesa):**
1. Screenshot della **lista etichette** che usa.
2. **3-4 messaggi reali** inoltrati (facile / personalizzazione / su misura) → per tarare le voci del menu di benvenuto.
3. **Volume settimanale** (stima) → per dimensionare il tipo di promemoria.

**Deciso 07/06:** niente push Sliss a Luca per questa richiesta (il WhatsApp già notifica; spunte blu = conferma). Idea "azioni rapide da notifica" (action button → cambio stato) → **parking-lot**, per il modulo, con caveat limite pulsanti iOS.

**➡️ Riprendere quando arrivano le risposte di Luca:** mappare etichette→stati, definire le voci del menu benvenuto, dimensionare il promemoria → poi scope preciso e build un passo alla volta.

---

## Perché (il dolore validato)
Luca (Kayek3D, stampa 3D) **perde richieste in entrata su WhatsApp** — messaggi che apre e dimentica, ritardi anche di settimane. È il suo dolore **a peso specifico maggiore**, più della gestione post-vendita. Risorsa scarsa di Luca = **attenzione** (fabbrica + figlie + pendolarismo, business in crescita). I follow-up (M1) invece gli funzionano e gli piacciono → M1 valida bene anche lato prodotti.

## Principio architetturale (deciso)
- **Modulo ≠ Motore.** Richieste è un **modulo separato** da Follow-Up (lavoro diverso: "non perdere il cliente *prima*" vs "*dopo*"). NON gonfiare Follow-Up.
- Ma poggia sul **motore condiviso** già esistente: link pubblico (pattern onboarding) + cattura record + promemoria + notifiche. Primo vero test del "modulo su motore".
- NON costruire ora un framework-moduli generico (astrazione prematura: prima 2 moduli veri, poi si estrae il comune).

## Coerenza con Opzione A
La vendita resta su **eBay** (shop vero) / catalogo WhatsApp. Sliss **NON fa checkout** — fa il **deflettore**: instrada le richieste facili verso eBay/catalogo e cattura quelle personalizzate. Coerente con "Sliss non ricostruisce ciò che altri fanno meglio".

## Scope proposto — v1 (fattibile oggi, niente WhatsApp API)
1. Link "richiesta" che Luca fissa/manda (riusa il pattern onboarding).
2. Il cliente apre e sceglie:
   - **"Cerco un prodotto"** → instradato a catalogo/eBay (bottone link) → vendita si chiude lì, zero effort Luca.
   - **"Personalizzato / non trovo"** → mini-form → **richiesta tracciata** in Sliss + **promemoria** a Luca.
3. Lato Luca: lista **"Richieste aperte"** con stato (nuova → presa in carico → chiusa).

**Rimandato (Fase 3 / evoluzione):**
- Intercettazione automatica dei messaggi su WhatsApp → richiede WhatsApp Business API (BSP, a pagamento) = Fase 3.
- Versione "ti escono 5 prodotti" → richiede un catalogo prodotti dentro Sliss (setup per Luca) = step 2.
- Pipeline di produzione (preso in carico → in stampa → post → spedizione) → estende gli Ordini, tassello successivo.

## Rischi noti
- **Adozione:** funziona solo se Luca dirotta davvero i clienti sul link (cambio abitudine). Stesso punto in test ora con l'onboarding di Moira.
- **Validazione M1:** scelta consapevole di Erik di procedere senza metriche numeriche complete (segnale qualitativo positivo da entrambi i tester). Metriche feedback-log ancora da riempire.

## ⏭️ RIPRENDERE DA QUI (2 domande aperte a Erik)
1. Ti torna la **v1 senza catalogo** (routing → eBay/catalogo + cattura delle personalizzate), col "5 prodotti" come step 2?
2. Per la v1 va bene il **link** (oggi, riusa onboarding), accettando che l'intercettazione automatica su WhatsApp resti Fase 3?

→ Se sì su entrambe: definire lo scope preciso e iniziare a costruire (un passo alla volta, build verificata).
