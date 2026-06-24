# Calibrazione M3 Richieste — dati reali Luca (24/06/2026)

> Risposte di Luca alle 3 domande di calibrazione (pagina `aggiornamento-luca.html`).
> Materiale grezzo dal campo per rifinire M3 Richieste prima del go-live coi clienti veri.

---

## 1. Etichette WhatsApp Business di Luca (= i suoi stati reali)

Luca già organizza le richieste con queste etichette. **Gli stati della lista Richieste in Sliss devono mappare queste, non inventarne di nuove** (principio: non fare un doppione di ciò che già usa — deciso 07/06).

| Etichetta Luca | Significato | Stato Sliss corrispondente |
|---|---|---|
| **potenziale cliente** | dopo richiesta di info, senza conferma ordine | `nuova` / "Presa in carico" |
| **importante** | richieste per pezzi su misura non urgenti | tag "su misura" |
| **pagamento in sospeso** | ordine confermato ma non ancora pagato | ordine creato, in attesa pagamento |
| **pagato** | confermato, pagato, in attesa di imballaggio | ordine → "Ready to go" (spedizione) |
| **cliente kayek 3D** | dopo il primo acquisto (storico) | cliente attivo (rubrica) |

**Flusso stati osservato:** potenziale cliente → pagamento in sospeso → pagato → (spedito) → cliente kayek 3D.

---

## 2. Messaggi reali dei clienti (campioni dal vivo)

### Msg A — Matteo (cover + personalizzazione + secondo prodotto)
- "Ero interessato a questa [foto cover]"
- "L'unica cosa ti chiedo se si possono mettere sopra delle scritte **Matteo 97**"
- "Compro questo come cronometro [ST500] quindi devo farlo per questo"
→ **Pattern: prodotto + personalizzazione (nome/numero) + lega l'acquisto a uno strumento specifico.**

### Msg B — Francesco Fasanella (richiesta multipla + compatibilità modello)
- arriva da passaparola ("amico di Giancarmine Spadaro")
- "copri dischi anche per i **dischi Cobra** e quale costo"
- "kit protezione elettronica per **Honda CRF 450 R** (cover pulsanti Start e mappe)"
- "2 porta strumentazione per **Alfano 7**"
→ **Pattern: UNA richiesta = 3 prodotti diversi + domanda di compatibilità ("ce l'hai per il mio modello?") + preventivo.**

### Msg C — Gianni De Grandi ("prendo tutto" + pagamento + indirizzo)
- "Prenderei tutto, tranne il coperchio aria, uso il tappo cassa filtro"
- "Modalità di pagamento?"
- lascia indirizzo completo
→ **Pattern: cliente caldo che vuole chiudere — chiede come pagare e dà i dati spedizione.**

### Msg D — Luca (cliente, passaparola + foto)
- "amico e lavoro assieme a Gastaldon Luca, mi ha dato il vostro contatto"
- "supporto x il mio crono **pz racing BASIC**, tamponi forcelle ant. e forcellone post."
- "Mando le foto della moto e del crono"
→ **Pattern: passaparola + più pezzi + manda foto per farsi capire/compatibilità.**

---

## 3. Volume

- **~1 richiesta al giorno** di media.
- **A raffica: a volte 5 in un giorno, poi 3 giorni di silenzio.**
→ La cassetta server attuale regge ampiamente. Nessun bisogno di scalare. Il valore è non perdere le richieste nei giorni di picco.

---

## Insight per la rifinitura M3 (sintesi)

1. **Gli stati = etichette di Luca.** Mappare 1:1, non inventare.
2. **Le richieste reali sono COMPOSITE e basate su compatibilità.** La domanda #1 non è "compra questo" ma **"ce l'hai per il mio strumento/moto?"** (Cobra, CRF 450 R, Alfano 7, PZ Racing Basic…). Il flusso attuale single-product è troppo stretto.
3. **Personalizzazione ricorrente** (scritte/nome/numero) → già previsto nel flusso, confermato dal campo.
4. **Foto e passaparola** sono parte naturale del contatto → il deviatore WhatsApp Business (welcome message) si innesta bene su questo.
5. **Volume basso a picchi** → cassetta ok, priorità = cattura affidabile.

---

*Fonte: chat WhatsApp Luca → Erik, 24/06/2026 13:19–13:23.*
