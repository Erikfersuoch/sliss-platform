# Parking-lot — voci chiuse (fatte o bocciate)

> Voci spostate da `docs/parking-lot.md` perché **fatte** (✅) o **bocciate** (❌).
> Non erano più "idee parcheggiate". Le idee vere restano nel parking-lot attivo.
> Niente è perso: qui resta il record. (25/06/2026)

---

## ✅ Fatte

- **[v6.5, 09/06] Redesign "Prepara scheda" → "Invita cliente".** Risolto il bivio dei due tasti gemelli in Agenda: rinominato "Invita cliente" (Agenda = box descrittivo, Clienti = tasto + "i"), Agenda con un solo primario "+ Nuovo appuntamento", messaggio WhatsApp del link reso caldo. Logica invariata. (Residui ancora vivi → tornati nel parking-lot attivo: link corto `/c/<id>` + valutare invito sotto Clienti.)
- **[30/05] Template follow-up non salvati come default.** La generazione dei follow-up ora legge i template salvati (`data.templates`): modificare un template si applica in automatico ai nuovi clienti, senza "Salva". Commit 71eb0bd.
- **[30/05] Link WhatsApp apriva un foglio di scelta su iPhone.** Numero normalizzato (solo cifre, prefisso 39 una volta) in ui.jsx SendButtons. Commit f718422. Piano B se ricapita: `https://wa.me/<num>?text=`. (Stabile da mesi.)
- **[30/05] Home "in attesa di risposta".** Scartato il rename del contatore; risolto con due bottoni "👍 Ha risposto / 👎 Nessuna risposta" nel dettaglio del follow-up inviato (esito + scende il contatore, cattura il dato soglia M1). Commit ae9f3b6.
- **[v7.1, 21/06] Logo in alto nell'app su mobile.** Aggiunto header mobile `TopBar` con `SlissLogo` sopra la Home (giro restyling nav flottante).
- **[v7.0/v7.1, 21/06] Dark mode verde Sliss + nav flottante.** Tema scuro opt-in (default chiaro) + nav flottante implementati. ⚠️ La versione "Revolut piena" (glassmorphism ovunque) del mockup v4 **NON è stata adottata**: scelta "via di mezzo / variante C" (vetro/glow solo dove non c'è testo) per coerenza con PRODUCT.md. Il file `preview-ui-revolut.html` resta come riferimento del mockup scartato.
- **[17/06] Logo Sliss in app allineato all'originale.** Sostituiti i PNG reali del logo (header, icone PWA, splash, favicon).
- **[built 23/06] M3 Gestione Richieste (M3+M6 unificati).** Era l'idea (27/05 e 28/05): modulo unico, FAQ + filtro richieste in entrata, caso d'uso Luca/3D. **Ora costruito e live** su entrambi i flussi (prodotti Luca + servizi Moira). Spec attuali: `docs/spec-m3-richieste.md` + `docs/spec-m3-richieste-servizi.md`.
- **[10/06] Automazioni workflow Claude Code (da review interna 7.8→8.7/10).** (1) check deploy Vercel via MCP a fine sessione (regola 0b); (2) `check-sync.sh --fix` propaga lo stamp SYNC in CLAUDE.md; (3) potatura periodica di stato-progetto.md → **fatta il 25/06** col protocollo contesto + `docs/archivio/`; (4) agenti paralleli → criteri Fase 3 (voce ancora viva nel parking-lot). Punti deboli risaliti: MCP usato, agenti pianificati.

## ❌ Bocciate / scartate

- **[05/06] Calendario visuale in-app (ex Step 5).** Scartato: contraddice Opzione A — il calendario resta Google (ponte "Aggiungi a Google Calendar"), non si ricostruisce in-app. Vedi `decisioni.md`.
