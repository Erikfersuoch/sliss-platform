# Roadmap v6 — Opzione A ("Sliss alleggerisce, non sostituisce")

<!-- SYNC ▸ la fonte di versione/fase resta docs/stato-progetto.md. Questo file è la VISIONE di prodotto v6, non lo stato. -->

> Nata il 30/05/2026 dal feedback diretto di Moira + decisione strategica di Erik.
> Regola guida: **Sliss si aggancia agli strumenti che il cliente già usa. Non li ricostruisce.**

---

## Il bivio risolto

Moira (e ogni micro-business target) non vuole un nuovo gestionale che sostituisce calendario,
agenda, WhatsApp. Vuole qualcosa che **tolga sbatti** intorno a quello che già fa.

- **Opzione A (SCELTA):** Sliss vive *accanto* agli strumenti esistenti. Il calendario resta suo
  (Google Calendar). Sliss fa solo i pezzi che mancano: l'onboarding del cliente e il follow-up dopo.
- **Opzione B (SCARTATA):** mini-gestionale con calendario dentro. Mercato affollato, troppo lavoro
  per un one-man business, e ricostruisce cose che Google fa meglio.

---

## Cosa fa Sliss (e cosa NON fa)

**FA (il valore che non esiste già):**
1. **Onboarding cliente self-service** — il cliente inserisce da solo i propri dati, legati a un
   appuntamento già fissato da Moira di persona.
2. **Follow-up post-appuntamento** — ringraziamento + cura, e check guarigione (es. 7 giorni).
   Disattivabili uno per uno.

**NON FA (lo fanno già altri, meglio):**
- Calendario / agenda visiva / gestione orari → resta Google Calendar.
- Chat col cliente → resta WhatsApp.
- Raccolta/visualizzazione recensioni → resta Google (Sliss manda solo il link).

---

## I 3 chiarimenti di Moira (30/05) — recepiti

1. **Niente messaggio pre-appuntamento.** Tolto dalla sequenza. (Era una mia ipotesi, scartata.)
2. **L'onboarding è la chiusura della conversazione di persona.** Moira fissa l'appuntamento
   davanti al cliente, poi gli manda un link. Il cliente apre e vede *"stai inserendo i tuoi dati
   per l'appuntamento di [data]"* → compila lui. Moira non scrive niente a mano.
3. **Follow-up non fissi a 4.** Disattivabili all'occorrenza. Default tattoo = ringraziamento+cura
   e check guarigione.

---

## Il nodo tecnico (onestà sui limiti attuali)

Il link onboarding lo apre il **cliente, dal suo telefono** → non da quello di Moira. Perché i dati
tornino nella Sliss di Moira serve un pezzo "in mezzo":
- pagina pubblica del form → ospitata gratis da Vercel;
- store dove appoggiare i dati → **si può usare Upstash** (già attivo per le notifiche push) +
  funzioni serverless Vercel. **Nessun servizio nuovo a pagamento.**

La sync vera con Google Calendar (Sliss legge gli appuntamenti da sola) richiede login Google +
backend dedicato → **Fase 3**. Per ora il "collegamento" è il **ponte leggero**: dall'appuntamento
in Sliss, bottone "Aggiungi a Google Calendar" (link, zero backend).

---

## Ordine dei passi (una cosa alla volta)

1. **Follow-up disattivabili** — il fix più piccolo e a impatto immediato per Moira. Ogni follow-up
   attivabile/disattivabile; rimuovere il pre-appuntamento dalla sequenza tattoo. *(solo frontend, €0)*
2. **"Crea nuovo appuntamento" dentro la scheda cliente** — richiesta diretta di Moira. *(solo frontend)*
3. **Ponte calendario leggero** — bottone "Aggiungi a Google Calendar" dall'appuntamento. *(solo frontend)*
4. **Onboarding cliente via link** — il pezzo grosso. Form pubblico + ritorno dati via Upstash.
   Da progettare a parte quando arriviamo qui. *(serverless + Upstash, free tier)*

> NB: i passi 1-3 sono dentro l'attuale Fase 1 e costano €0. Il passo 4 è il primo che tocca
> infrastruttura condivisa: lo apriamo solo dopo aver chiuso 1-3 e averne discusso il design.

---

## Sostenibilità economica (sintesi)

- **Adesso → gate Fase 2:** €0/mese. Tutto su free tier (Vercel, Upstash, GitHub).
- **Primi clienti paganti:** Vercel Pro ~€19/mese (l'uso commerciale lo richiede).
- **A volumi:** + Supabase/Upstash a pagamento + dominio → ~€30-40/mese.
- **Break-even indicativo:** ~3 clienti a €15/mese coprono l'infra. *(Pricing vero = Fase 3, BUSINESS.)*

**Principio:** non si spende un euro prima della validazione. I soldi sono un problema di Fase 3,
non di adesso.

---

*Sliss · liscio come deve essere.*
