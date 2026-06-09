# Brief sessione — Redesign "Prepara scheda"

> Aperto 09/06/2026 come handoff per la prossima sessione. Ruolo: DEV (+ CORE per le scelte UX).
> SYNC: la versione/stato vive in `docs/stato-progetto.md`.

## Il problema (dal feedback + audit /impeccable)
In **Agenda** ci sono due punti d'ingresso vicini e poco distinguibili:
- **"Prepara scheda"** (bottone secondario) → genera un **link da mandare al cliente**: lo compila lui (nome, contatto) e la scheda entra da sola tra i clienti. Comodo per la **consulenza prima** dell'appuntamento.
- **"+ Nuovo"** (bottone primario) → crea **subito un appuntamento** per un cliente esistente.

Un nuovo utente (persona **Nathan**) e **Moira** non capiscono quale premere → il flusso risulta **legnoso / poco capibile** (feedback Moira 07/06, confermato dall'audit come **P1 auto-evidenza**, critique 28→~30/40).

## La decisione già presa (NON ridiscutere, NON stravolgere)
- **Spostare/chiarire** "Prepara scheda", linguaggio **umano**.
- **LOGICA INVARIATA**: cliente e appuntamento restano **separati di proposito** (link pre-consulenza → il cliente entra; l'appuntamento vero si definisce **dopo** la consulenza → da lì partono i follow-up). Si toccano **solo parole e posto**, NON il flusso.
- Ipotesi di posto: portarlo **sotto CLIENTI** (era il "punto 3" del piano 07/06). Da validare in anteprima.

## Stato attuale del codice (cosa esiste già)
- `src/pages/Appointments.jsx`: i due bottoni in `PageHeader` (c'è già una **"i"** `HELP.preparaScheda` accanto a "Prepara scheda" che spiega cosa fa — aiuta ma non risolve il bivio). Modale slot (genera link), sezione **"Schede in attesa"** (fondo ambra), invio link via WhatsApp.
- Aggiunte recenti dall'altro PC (09/06): **"Prepara scheda" anche dal calendario** sul giorno selezionato, e **consulenza automatica** (il tipo sessione dello slot è hardcoded "Consulenza", niente più selezione). Tenerne conto: parte dell'attrito è già stata limata.
- Flusso link cliente: `public/onboarding.html` (form pubblico) + `api/onboarding-submit.js` / `api/onboarding-check.js` (Upstash) + auto-import all'apertura app (effetto in `App.jsx`). **Non toccare il backend**, funziona.
- Sistema "i": componente `<Info>` in `components/ui.jsx` + testi in `src/help.js` → riusabile per nuove spiegazioni.

## Come procedere (metodo confermato)
1. **Anteprima prima/dopo** (HTML in `docs/test-m1/`, coi colori reali) del nuovo flusso/posto/copy → Erik approva PRIMA del codice (regola UX [[feedback]]).
2. Implementare **chirurgico e additivo**: build + eslint (max-warnings=0) + **prova reale** ad ogni passo ([[feedback-auto-healing]]).
3. ⚠️ **Siamo in finestra di validazione** (gate 21/06): Moira usa questo flusso → non romperle l'abitudine, cambiare il minimo che risolve la confusione. Se il rischio è alto, valutare se rimandare a dopo il gate.
4. A modifica fatta e deployata: valutare se avvisare Moira (sistema novità push) e **ri-lanciare `/impeccable critique`** per vedere il salto dal 28.

## Spunti di direzione (da esplorare in anteprima, non decisi)
- Un **unico punto d'ingresso** in Agenda/Clienti, e la scelta "scheda al volo / link al cliente / appuntamento diretto" arriva **dopo**, dentro un solo flusso guidato?
- Rinominare "Prepara scheda" in qualcosa di più parlante ("Invita il cliente a compilare i dati"?), gerarchia chiara (1 primario).
- Se si sposta sotto Clienti: cosa resta in Agenda? (probabile: solo "+ Nuovo appuntamento").

## Riferimenti
- `docs/stato-progetto.md` (Prossimi passi / Residuo) · `docs/parking-lot.md` (entry Prepara scheda) · `docs/decisioni.md` (flusso cliente/appuntamento separati) · audit in `.impeccable/critique/`.
