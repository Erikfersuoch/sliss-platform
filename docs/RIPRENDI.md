# ▶ Riprendi da qui

> Aggiornato a ogni "chiudi per oggi". È il primo punto da leggere riaprendo Claude Code.
> Mostrato in automatico all'avvio (hook `scripts/session-start.sh`).

**Ultima sessione:** 28/06/2026 — Fase 1 · ruolo DEV/CORE (strumenti founder per Sliss, gate `ceoerik`; onboarding tester NON toccato; ricerca compliance go-to-market)
**Tutto committato e pushato:** sì, repo = solo `main`, tutti i deploy verificati READY via MCP Vercel. ⚠️ Webhook Vercel a volte salta: se un commit `src` non si deploya, forza con `git commit --allow-empty -m "trigger redeploy" && git push`.

## Cosa è successo (28/06 — strumenti founder + compliance)
Tutto live, costruito a fette spec-first, verificato dal vivo. **I tester veri non sono stati toccati** (onboarding e app invariati; tutto blindato sul codice segreto `ceoerik`).
- ✅ **Editor "FAQ su Sliss" admin** (`c586e52`): in Impostazioni con codice `ceoerik`; salva su owner riservato `sliss-help` via `api/faq`. 11 FAQ-su-Sliss precaricate.
- ✅ **Pagina "Aiuto · Come funziona Sliss"** (`d8850fd`): `HelpSliss.jsx` in Altro→Aiuto + sidebar; sola lettura, legge `sliss-help`. Provata live come `moira`.
- ✅ **Attività riservata "Sliss" (founder)** (`23f2e59`): cluster `sliss` in `CLUSTERS_RESERVED` + 5 template a tema + serviceTypes; card "Founder" in Impostazioni (solo `ceoerik`) → tipo servizi + settore sliss + template sostituiti, clienti/appuntamenti preservati. Con codice normale: tutto invisibile (verificato).
- ✅ **AI Act parcheggiato** (`c10b960`) + **ricerca compliance** salvata in `docs/compliance-go-to-market.md`.

**Convenzioni founder (da ricordare):** `ceoerik` = admin/founder gate · `erik` = sandbox isolato (`?tester=erik` in incognito) · owner `sliss-help` = store delle FAQ-su-Sliss.

## ▶ Prossimo passo
Il flusso prenotazione→appuntamento (PUNTO 2 conferma + PUNTO 3 ringraziamento +3h) è **già live** dal 26/06. Da fare quando si presenta il momento naturale:

1. **Provare dal vivo conferma + ringraziamento +3h con Moira:** creare un appuntamento con orario → verificare hero "manda la conferma" e che il ringraziamento scatti a +3h. Validare il banco FAQ servizi (non sollecitare).
2. **Go-live M3 coi clienti veri di Luca** (gesto operativo): impostare il messaggio di benvenuto WhatsApp Business col link (testo pronto in `aggiornamento-luca.html`, numero Kayek3D `393458983135`) + raccogliere le 3 risposte di calibrazione.
3. **Link eBay reali:** export CSV Seller Hub di Luca → campi `ebay` in `richieste.html`.
4. 🅿️ **Parcheggiato:** "segna completato" per sedute multiple (tatuaggi a più sedute).

**Per la Fase 3 (quando si arriva al go-to-market):** leggere `docs/compliance-go-to-market.md`. Punto tecnico critico che tocca il dev: il **backup legato al "codice tester"** va sostituito con autenticazione vera + cifratura + cancellazione propagata a Redis (oggi è anche un requisito privacy, non solo comodità multi-dispositivo).

**Ambiente di prova:** PC incognito `sliss.it/?tester=provaX` + cell `sliss.it/prenota?o=provaX&biz=Test&wa=393337887794`. Per un test vergine usa un owner **nuovo** (cassetta vuota). NB cache PWA: per vedere una versione nuova serve finestra incognito nuova, non solo F5. Sandbox founder: `?tester=erik`.

**In sospeso da prima:**
- Moira: validare FAQ servizi al momento naturale.
- Luca: flip pulsanti diretto/eBay in `richieste.html` (copy pronto) + go-live WA + link eBay reali.

Dettaglio: `docs/stato-progetto.md` · `docs/compliance-go-to-market.md` · `docs/spec-m3-richieste*.md` · `docs/decisioni.md` · `docs/parking-lot.md`.
