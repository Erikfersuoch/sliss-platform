# Strategia Brand Sliss — Aggiornamento Giugno 2026

> Decisione strategica del 19/06/2026.
> Questo documento raccoglie e consolida tutte le decisioni precedenti
> sul brand, evidenzia cosa è superato, e traccia la roadmap aggiornata.

---

## 1. Analisi delle decisioni precedenti

### Già deciso e ancora valido

| Data | Decisione | Dove | Stato |
|---|---|---|---|
| Maggio 2026 | Nome **"Sliss"** adottato | tutto il progetto | ✅ Confermato |
| 10/06/2026 | Marchio verificato: nessun conflitto classi 9/42 (EUIPO/UIBM) | `docs/rischi-legali.md` | ✅ Valido |
| 30/05/2026 | Posizionamento: **"Alleggerisce, non sostituisce"** | `PRODUCT.md`, `decisioni.md` | ✅ Valido |
| Maggio 2026 | Personalità: **pratico, fidato, curato** | `PRODUCT.md` | ✅ Valido |
| 28/05/2026 | Comunicazione social centralizzata in `docs/social.md` | `decisioni.md` | ✅ Valido |
| 12/06/2026 | Primo post pubblicato (LinkedIn+Facebook): "Perché Sliss" | `docs/social.md` | ✅ Fatto |
| 12/06/2026 | Pitch: MAI vendere come "promemoria", bensì "meno caos, meno tempo perso" | `docs/sondaggi.md` | ✅ Valido |
| 10/06/2026 | Dominio proprio `sliss.it`/`sliss.com` — DA VALUTARE (pochi €/anno) | `docs/rischi-legali.md` | ⚠️ Aperto |
| Giugno 2026 | Accento verde `#16A34A`, font DM Sans 800, light mode | `src/theme.js` | ✅ Attivo |
| 17/06/2026 | Nuovo logo definitivo prodotto e integrato nell'app | commit `9b9a16a` | ✅ Attivo |
| 17/06/2026 | Dark mode "Revolut" verde — base approvata da Erik | `preview-ui-revolut.html` | ⏸️ Post-gate |

### Decisioni superate o da aggiornare

| Cosa | Era | Diventa | Motivazione |
|---|---|---|---|
| Logo provvisorio (SVG geometrico due S intrecciate) | In uso fino al 17/06 | **SUPERATO** — nuovo logo monogramma S bianco+verde con nodo centrale | Il nuovo logo è significativamente più professionale e distintivo |
| Nota parking-lot "Logo non corrisponde all'originale" (25/05) | Aperta | **CHIUSA** — il logo è stato ridisegnato da zero e integrato | Non più rilevante |
| Registrazione marchio — nessuna decisione esplicita | Implicitamente rimandata | **Decisione esplicita: NON registrare ora** (vedi sotto) | Risorse da concentrare su validazione |
| Identità visiva = solo colori+font nell'app | Implicito | **Identità visiva = logo definitivo adottato su tutti i canali** | Coerenza cross-canale fin da subito |
| Comunicazione = solo building in public (3 post) | Di fatto | **Comunicazione orientata al problema del cliente, non al prodotto** | Efficacia + posizionamento professionale |

### Incongruenze trovate

1. **Tagline "Ecosistema Operativo"** nel footer sidebar (`Nav.jsx` riga 57) — non è mai stata discussa/approvata come tagline ufficiale. Va deciso se tenerla, cambiarla o rimuoverla.
2. **PRODUCT.md anti-references** vietano glassmorphism, ma il mockup dark-mode approvato (`preview-ui-revolut.html`) usa glassmorphism cards con backdrop-blur. Da riconciliare al momento dell'implementazione.
3. **`sliss-platform.vercel.app`** è ancora l'unico dominio — con l'attivazione dei canali social il link pubblico diventa più visibile. Il dominio proprio dovrebbe salire di priorità.

---

## 2. Conclusioni strategiche (19/06/2026)

### 2.1 Il rischio principale NON è il furto dell'idea

Il vero rischio per Sliss è la **mancanza di visibilità**, non la copia. Le idee vengono replicate, il vantaggio competitivo viene da:
- Esecuzione e velocità di sviluppo
- Comprensione dei problemi reali degli utenti (già in corso con Moira e Luca)
- Acquisizione dei primi clienti
- Costruzione della fiducia nel brand

### 2.2 Logo definitivo: usare subito, ovunque

**Decisione:** adottare il nuovo logo ufficiale **immediatamente** su tutti i canali:
- Pagina Facebook
- LinkedIn (profilo personale Erik + futuro aziendale)
- Landing page (quando creata)
- Mockup e materiali
- Contenuti social
- App (già fatto, commit `9b9a16a`)

**Motivazione:** ogni contenuto pubblicato da oggi costruisce riconoscibilità sulla stessa identità. Nessun rebranding futuro, nessuna dispersione.

### 2.3 Registrazione marchio: rimandare

**Decisione:** NON procedere con la registrazione del marchio adesso.

**Motivazione:** le risorse (tempo + denaro) vanno su validazione, acquisizione utenti, feedback. La verifica EUIPO/UIBM del 10/06 conferma che non c'è urgenza (nessun conflitto attivo).

**Trigger per rivalutare:**
- Primi utenti attivi paganti
- Primi ricavi
- Segnali concreti di trazione
- Prima di pubblicazione su app store

### 2.4 Comunicazione: parlare del problema, non del software

**NON dire:** "Sto costruendo un software."

**Dire:** "Stiamo sviluppando una soluzione per aiutare professionisti e piccole attività a gestire meglio il rapporto con i clienti."

**Focus comunicazione:**
- Problemi reali dei micro-business (caos clienti, tempo perso, follow-up dimenticati)
- Benefici concreti (meno stress, più clienti curati, tempo per il mestiere)
- Semplificazione ed efficienza
- Mai "promemoria" — sempre "meno caos, più tempo" (validato da sondaggio 12/06)

Questo è **coerente** con la linea social già in `docs/social.md` (CTA leggera, building in public autentico). Va solo rafforzato il focus sul problema del cliente vs. il racconto del prodotto.

### 2.5 Priorità operative brand

| # | Azione | Stato | Note |
|---|---|---|---|
| 1 | Consolidare identità visiva definitiva | ✅ FATTO | Logo integrato nell'app, varianti chiaro/scuro pronte |
| 2 | Attivare canali social ufficiali | 🟡 IN CORSO | LinkedIn attivo (3 post), Facebook attivo. Mancano: pagina aziendale dedicata, Instagram |
| 3 | Definire descrizione sintetica del progetto | 🟡 PARZIALE | `PRODUCT.md` ha il purpose; manca una **one-liner** da bio social/landing |
| 4 | Creare landing page con raccolta contatti | ❌ DA FARE | Fase 3+, ma valutare una pagina minimale prima (dominio necessario) |
| 5 | Iniziare pubblicazione orientata ai problemi | 🟡 IN CORSO | 3 post pubblicati, altri pronti; allineare al tono "problema, non prodotto" |
| 6 | Raccogliere feedback dai primi potenziali utenti | 🟡 IN CORSO | 2 tester attivi + sondaggio Tally (5 risposte) |

---

## 3. Rischi e opportunità

### Alta priorità

| Tipo | Descrizione | Azione |
|---|---|---|
| ⚠️ RISCHIO | **Dominio non registrato** — `sliss.it`/`sliss.com` potrebbe essere preso | Verificare disponibilità e registrare (pochi €/anno). Basso costo, alto rimpianto se perso |
| ⚠️ RISCHIO | **Mancanza di one-liner** — senza una frase sintetica (bio LinkedIn, header landing, pitch) la comunicazione è dispersa | Definire una frase tipo: "Sliss aiuta professionisti e piccole attività a curare i clienti senza perdere tempo" |
| ✅ OPPORTUNITÀ | **Logo nuovo = momento di rilancio social** — il rebranding è un contenuto naturale da pubblicare | Post "nuovo look" su LinkedIn/Facebook, mostrando il prima/dopo. Contenuto autentico, building in public |

### Media priorità

| Tipo | Descrizione | Azione |
|---|---|---|
| ⚠️ RISCHIO | **Tagline "Ecosistema Operativo" non validata** — è nel footer dell'app ma non è mai stata discussa come posizionamento | Decidere: tenerla, cambiarla ("Liscio come deve essere"?) o rimuoverla |
| ⚠️ RISCHIO | **Nessun canale Instagram** — il target (tatuatori, barbieri, estetiste) vive su Instagram più che su LinkedIn | Valutare apertura profilo Instagram in Fase 2/3 |
| ✅ OPPORTUNITÀ | **Dark mode come "lancio" di un tema premium** — il mockup Revolut è approvato e molto attraente | Può diventare un differenziatore visivo al momento del lancio pubblico |

### Bassa priorità

| Tipo | Descrizione | Azione |
|---|---|---|
| ⚠️ RISCHIO | **Glassmorphism nel dark mode vs anti-reference PRODUCT.md** — contraddizione stilistica | Da riconciliare quando si implementa. "Glassmorphism funzionale" (leggibilità) ≠ "glassmorphism decorativo" (slop) |
| ✅ OPPORTUNITÀ | **Slogan "liscio come deve essere"** già usato nei docs — potrebbe diventare il payoff ufficiale | Da testare come tagline su landing/social |

---

## 4. Riepilogo stato attuale del brand

### Cosa c'è (✅)
- **Nome:** Sliss — verificato, nessun conflitto marchio
- **Logo:** nuovo monogramma S bianco+verde con nodo centrale, integrato nell'app in tutte le declinazioni (icona PWA, header, favicon)
- **Colori:** verde `#16A34A` (accent), blu-notte `#0B1020` (scuro), bianco
- **Font:** DM Sans 800
- **Personalità:** pratico, fidato, curato
- **Posizionamento:** "Alleggerisce, non sostituisce"
- **Tono comunicazione:** building in public autentico, CTA leggera, focus sul problema
- **Canali attivi:** LinkedIn (profilo Erik), Facebook — 3 post pubblicati
- **Anti-pitch validato:** mai "promemoria", sempre "meno caos, più tempo"

### Cosa manca (❌)
- **One-liner** sintetica per bio/pitch/landing
- **Dominio proprio** (`sliss.it`/`sliss.com`)
- **Landing page** con raccolta contatti
- **Pagina aziendale** LinkedIn/Facebook dedicata (ora è il profilo personale di Erik)
- **Instagram** (il canale naturale del target)
- **Tagline ufficiale** validata (candidata: "Liscio come deve essere")

### Cosa è in stand-by (⏸️)
- Registrazione marchio → trigger: primi ricavi/trazione
- Dark mode Revolut → trigger: post-gate
- Upgrade estetico app → trigger: post-gate

---

## 5. Prossime azioni consigliate (in ordine)

1. **Registrare il dominio** `sliss.it` (e/o `.com`) — pochi euro, zero rischio, alto rimpianto se perso
2. **Scrivere la one-liner** — una frase per bio social, landing, pitch elevator
3. **Pubblicare il post "nuovo logo"** — contenuto naturale, building in public
4. **Decidere sulla tagline** — "Ecosistema Operativo" vs "Liscio come deve essere" vs altro
5. **Preparare la landing page minimale** — anche solo una pagina statica con la one-liner + form email (Fase 2/3)

---

*Sliss · liscio come deve essere.*
