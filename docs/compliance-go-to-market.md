# Sliss — Compliance per il go-to-market (Italia/UE)

> Riferimento per la **Fase 3** (pre-lancio commerciale). Frutto di una ricerca del 28/06/2026.
> ⚠️ **Non è consulenza legale.** Prima di vendere, far validare privacy policy, DPA e ToS da un legale privacy/consumer. Dove la norma è recente o interpretabile è segnato **[DA RIVERIFICARE]**.
> Collegato: nota AI Act e nota "recesso 19/06/2026" in `docs/parking-lot.md`.

---

## 0. La distinzione che regge tutto

Sliss tratta dati di **due categorie**, con ruoli diversi:
1. **Professionisti** (clienti paganti) → Sliss è **Titolare**.
2. **Clienti finali del professionista** (nomi+telefoni caricati) → Sliss è **Responsabile**, il professionista è **Titolare**.

La fraintendono quasi tutti i micro-SaaS. È la prima cosa che un cliente B2B attento o un legale contesta.

---

## 1. GDPR / Privacy

**Si applica:** sui dati dei clienti finali, professionista = Titolare, Sliss = Responsabile (art. 28). Serve un **DPA** accettato in onboarding. Upstash/Vercel sono **sub-responsabili** (vanno nominati; verificare region UE). Come Responsabile serve un **registro dei trattamenti** (art. 30 §2).

**Checklist (priorità):**
1. **DPA art. 28** accettato all'iscrizione (oggetto/durata/finalità, trattamento su istruzione, riservatezza, misure di sicurezza, lista sub-responsabili, assistenza diritti, cancellazione a fine rapporto, audit).
2. Verifica **region** Upstash/Vercel → scegli UE; documenta dove stanno i dati.
3. **Privacy policy** di Sliss (verso i professionisti) + indicazione del doppio ruolo.
4. **Template di informativa** per i clienti finali, da dare in dotazione al professionista (è lui il Titolare che deve informarli) — kit pronto = differenziante.
5. **Registro trattamenti** come Responsabile.
6. **Minimizzazione + retention** (solo nome+telefono+storico; definire cancellazione, anche del backup Redis).
7. **Sicurezza backup:** il "codice tester" **non basta** al lancio → autenticazione vera per account + cifratura a riposo + cancellazione che si propaga a Redis. **[Punto debole tecnico attuale.]**

**Attenzione a:** dichiararsi Titolare anche dei dati dei clienti finali (errore classico); cancellazione "finta" (localStorage sì, Redis no); sub-responsabili non dichiarati.

**Fonti:** [Art. 28 GDPR (Altalex)](https://www.altalex.com/documents/news/2018/04/12/articolo-28-gdpr-responsabile-del-trattamento) · [DPA/nomina Responsabile](https://www.avvocatitech.com/nomina-responsabile-trattamento-data-processing-agreement-gdpr/) · [GDPR e cloud (Cybersecurity360)](https://www.cybersecurity360.it/legal/privacy-dati-personali/gdpr-e-fornitori-di-servizi-cloud-buone-regole-di-gestione-dei-grandi-outsourcer-extra-ue/) · [Garante Privacy](https://www.garanteprivacy.it)

---

## 2. Marketing diretto e WhatsApp — *il fronte più alto e sottovalutato*

**Regola base (art. 130 Cod. Privacy + ePrivacy):** comunicazioni **promozionali** via mezzi automatizzati (email, SMS, e per prudenza WhatsApp) = **consenso preventivo, specifico, documentato**.

**Distinzione chiave (la via di fuga):**
- **Messaggi di servizio/transazionali** (conferma, promemoria) = **non** marketing, **niente** consenso, purché senza elementi promozionali.
- **Messaggi promozionali** (offerte) = consenso.
- → I follow-up di Sliss sono in buona parte **borderline**: la **richiesta recensione** tende al promozionale → tienila sobria e legata alla prestazione appena erogata.

**Soft opt-in (art. 130 c.4):** promuovere servizi analoghi a un cliente esistente senza consenso, con opt-out facile in ogni messaggio. **[DA RIVERIFICARE]** la dottrina prevalente lo limita alla **sola email**; dubbio se valga per SMS/WhatsApp → **non assumerlo**, raccogli consenso per i promozionali via WhatsApp.

**Lato WhatsApp/Meta (policy contrattuale ≠ legge):**
- Oggi Sliss = **link wa.me + invio manuale** dall'app personale → uso **consentito**, uno-a-uno, non bulk → fuori dal rischio ban. **Resta così** in beta/early.
- **Mai** estensioni/tool per invii massivi da WhatsApp Web → ban permanente.
- **WhatsApp Business API via BSP** (Twilio/360dialog) cambia tutto: opt-in obbligatorio documentato, **template approvati da Meta** per categoria (Utility/Authentication/Marketing), Business Verification + privacy URL, blocchi progressivi sulle violazioni. **Dal 15/01/2026 Meta vieta i "General Purpose AI Chatbot" su WhatsApp** (rilevante per l'evoluzione IA).

**Checklist:** separa nei template "servizio" vs "promozionale"; resta su wa.me manuale; micro-avviso in-app al professionista (è lui il mittente/Titolare); opt-out negli eventuali promozionali; progetta opt-in/registro **prima** di automazione o API.

**Attenzione a:** l'invio automatico cambia il profilo di rischio (Sliss diventa parte attiva); soft opt-in su WhatsApp non scontato; richiesta recensione = zona grigia; wa.me massivo automatizzato fa bannare, manuale no.

**Fonti:** [Garante – consenso marketing](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2543820) · [Garante – linee guida spam](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2542348) · [Art. 130 Cod. Privacy](https://www.brocardi.it/codice-della-privacy/parte-ii/titolo-x/capo-i/art130.html) · [Soft spam solo email? (Osborne Clarke)](https://www.osborneclarke.com/it/insights/soft-spam-italia-stiamo-correttamente-applicando-la-norma) · [WhatsApp Business Policy](https://whatsappbusiness.com/policy/) · [Meta – opt-in WhatsApp](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in)

---

## 3. AI Act (Reg. UE 2024/1689)

**La tesi "oggi sono fuori scope" è corretta.** Template deterministici + invio manuale = non rientra nella definizione di "sistema di IA" (le linee guida Commissione feb. 2025 escludono i sistemi a regole definite da persone / matching deterministico).

**Con la generazione IA** entri nel perimetro, ma quasi certamente **rischio limitato/minimo**: scatta la **trasparenza (art. 50)**, applicabile dal **2/8/2026** (contenuti generati da IA marcati come artificiali). **Eccezione rilevante:** non si applica con **revisione umana sostanziale** e responsabilità editoriale di una persona → il tuo flusso (professionista legge/modifica/invia) **probabilmente copre**. **[DA RIVERIFICARE]** alla luce delle linee guida art. 50 (bozza mag. 2026) + codice di condotta trasparenza (giu. 2026).

**Checklist:** oggi nessun adempimento; quando aggiungi IA → nota di trasparenza ("testo proposto da assistente IA, rivedilo"); non spacciare per "AI" ciò che è template.

**Attenzione a:** auto-etichettarti "AI" in marketing mentre sei deterministico (svantaggio senza vantaggio); IA che scrive **e** invia da sola indebolisce l'eccezione "revisione umana".

**Fonti:** [Reg. UE 2024/1689 (EUR-Lex)](https://eur-lex.europa.eu/legal-content/IT/TXT/PDF/?uri=OJ%3AL_202401689) · [Linee guida definizione IA (Altalex)](https://www.altalex.com/documents/news/2025/02/19/sistema-intelligenza-artificiale-linee-guida-commissione-ue-definizione) · [Trasparenza dal 2/8/2026 (Agenda Digitale)](https://www.agendadigitale.eu/sicurezza/ai-act-dal-2-agosto-scatta-la-trasparenza-obbligatoria-cosa-cambia-e-per-chi/)

---

## 4. Diritto dei consumatori — vendita dell'abbonamento Sliss

**B2B vs B2C è il discrimine.** Recesso = solo consumatori. Professionisti con P.IVA che comprano per lavoro = **B2B → niente recesso obbligatorio**. Ma se vendi anche a **privati senza P.IVA** → recesso 14 giorni + **pulsante di recesso** (art. 54-bis Cod. Consumo, D.Lgs. 209/2025, **in vigore dal 19/06/2026**): funzione dedicata in-app, sempre visibile, dicitura inequivoca, senza obbligare a email esterne. **Se manca → recesso esteso automaticamente a 12 mesi + 14 giorni.**

**Prova gratuita → pagamento:** informa esplicitamente del passaggio a pagamento (data + importo) prima dell'addebito; la Corte UE: il recesso opera una sola volta se l'utente era stato informato chiaramente. **[Configura bene il flusso prova→pagamento.]**

**Checklist:** posizionati B2B (riduce obblighi); se accetti consumatori → informativa recesso + pulsante in-app; flusso prova→pagamento trasparente; disdetta facile comunque.

**Attenzione a:** "solo B2B" non basta dirlo (conta chi compra davvero); rinnovo automatico opaco = contestabile.

**Fonti:** [Pulsante di recesso (Bird & Bird)](https://www.twobirds.com/it/insights/2026/italy/la-nuova-funzione-digitale-di-recesso) · [D.Lgs. 209/2025 (PMI.it)](https://www.pmi.it/impresa/normativa/496173/pulsante-recesso-online-obbligatorio-ecommerce.html) · [MIMIT – diritto di recesso](https://www.mimit.gov.it/it/mercato-e-consumatori/tutela-del-consumatore/diritti-del-consumatore/diritto-di-recesso)

---

## 5. Adempimenti minimi al lancio

1. **Privacy Policy** (verso i professionisti) — titolare, dati, finalità, basi giuridiche, retention, sub-responsabili, diritti, doppio ruolo.
2. **DPA art. 28** accettato in onboarding.
3. **ToS** — oggetto, prezzo/rinnovo, recesso/disdetta, limitazioni, foro, B2B/B2C.
4. **Cookie/consensi:** con **solo storage tecnico** (stato app) e **nessun** tracker di terzi → **niente banner**, basta citarlo in policy. **Appena aggiungi analytics/pixel → banner conforme** (provv. Garante 27/02/2025: "Accetta tutti"/"Rifiuta tutto"/"Gestisci", blocco preventivo dei non tecnici).
5. **Contatti** + identità impresa.
6. **P.IVA/forma giuridica** pronta **prima del primo incasso** (in beta gratuita non scatta; verifica con commercialista). **[Materia fiscale, non privacy.]**

**Attenzione a:** banner cookie inutile/sbagliato (non metterlo se hai solo storage tecnico); vendere senza P.IVA in modo continuativo; policy "copia-incolla" che non nomina Upstash/Vercel né il doppio ruolo.

**Fonti:** [Garante – FAQ Cookie](https://www.garanteprivacy.it/faq/cookie) · [Garante – provv. 27/02/2025](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10118222)

---

## Sintesi — le 7 cose da fare PRIMA di incassare il primo euro

1. **DPA art. 28** accettato in onboarding (Sliss = Responsabile).
2. **Sicurezza backup:** sostituire il "codice tester" con autenticazione reale + cifratura + cancellazione propagata a Redis. *(unico punto tecnico critico oggi)*
3. **Privacy Policy + ToS + contatti** pubblicati; cookie banner solo con tracker.
4. **Separare** messaggi di servizio da promozionali nei template, con avviso al professionista.
5. **Restare su wa.me manuale**; progettare opt-in/opt-out prima di automazione o WhatsApp API.
6. **Pulsante di recesso** in-app se vendi a consumatori (obbligo dal 19/06/2026).
7. **P.IVA/forma giuridica** prima del primo incasso.

**AI Act: nessun adempimento ora** (deterministico). Rilevante solo con la generazione IA → trasparenza art. 50 dal 2/8/2026, con probabile copertura dell'eccezione "revisione umana".

**Da riverificare con un legale (recenti/interpretabili):** soft opt-in su WhatsApp/SMS · perimetro eccezione art. 50 · flusso prova→pagamento · soglia/forma P.IVA col commercialista.
