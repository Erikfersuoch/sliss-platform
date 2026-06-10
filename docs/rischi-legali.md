# Rischi legali / IP — Sliss

> Documento vivente. Traccia rischi su marchio, copyright, brevetti, privacy/GDPR
> che potrebbero compromettere il go-to-market futuro.
> Pensato per essere letto e aggiornato anche da un agente autonomo: ogni voce ha
> uno stato, un trigger (quando va rivalutata) e un'azione concreta.

---

## SYNC ▸ Stato generale: nessun blocco attivo per Fase 1-2

---

## 1. Marchio "Sliss"

- **Stato:** ✅ VERIFICATO 10/06/2026 — nessun marchio identico "Sliss" registrato
  in classi 9 (software) e 42 (SaaS), né su EUIPO né su UIBM (ricerca frase esatta).
  Esiste solo "SLISS" come app Google Play (settore investimenti/fondi, diverso) —
  conflitto diretto improbabile.
- **Rischio residuo:** basso. Da ricontrollare se si entra in contatto diretto con
  l'app finanziaria omonima (es. comparsa su stessi store/categorie) o prima di
  un'eventuale registrazione formale del marchio (la ricerca preliminare non
  sostituisce una ricerca di anteriorità professionale pre-deposito)
- **Azione:** nessuna azione immediata. Verifica preliminare completata.
- **Trigger di rivalutazione:** prima di registrare formalmente il marchio
  (ripetere ricerca + valutare ricerca di anteriorità professionale), prima di
  pubblicare su app store, prima di campagne ads/social su larga scala
- **Owner:** Erik

---

## 2. Copyright codice / asset / librerie

- **Stato:** ✅ basso rischio attuale
- **Rischio:** snippet copiati, librerie con licenze restrictive (GPL/AGPL),
  template grafici a pagamento usati senza licenza
- **Azione:** se in futuro si aggiungono librerie nuove, verificare licenza
  (preferire MIT/Apache/BSD). Non usare asset grafici scaricati senza licenza
  commerciale chiara.
- **Trigger di rivalutazione:** ogni volta che si aggiunge una dipendenza npm
  nuova non banale, o asset grafico esterno (loghi, icone, font)

---

## 3. Brevetti

- **Stato:** ✅ non applicabile per ora
- **Rischio:** molto basso — i brevetti software UE riguardano processi tecnici
  specifici, non flussi di business (follow-up/reminder è prassi comune nel
  settore CRM/booking)
- **Azione:** nessuna ora. Da rivalutare solo se si sviluppa un algoritmo
  realmente originale (es. previsione automatica del momento ottimale di
  follow-up con logica proprietaria non banale)
- **Trigger di rivalutazione:** Fase 3+, solo in presenza di innovazione
  tecnica concreta e differenziante

---

## 4. Privacy / GDPR

- **Stato:** ✅ non applicabile finché si usa solo localStorage
- **Rischio:** appena si introduce Supabase (dati clienti su server), scattano
  obblighi GDPR (privacy policy, base giuridica trattamento, possibilità di
  export/cancellazione dati su richiesta cliente finale)
- **Azione:** nessuna ora. Predisporre privacy policy + termini di servizio
  prima del passaggio a Supabase
- **Trigger di rivalutazione:** Fase 3, al momento dell'introduzione di Supabase
  (vedi regola CLAUDE.md: Supabase bloccato fino a Fase 3)

---

## 5. Termini di servizio / contratti con clienti paganti

- **Stato:** ✅ non applicabile finché non ci sono clienti paganti
- **Rischio:** nessuno ora
- **Azione:** redigere ToS minimi prima del primo cliente pagante
- **Trigger di rivalutazione:** Fase 3, primo cliente pagante (allineato a
  perimetro BUSINESS in CLAUDE.md)

---

## Checklist rapida — quando rivalutare l'intero documento

- Prima di registrare il marchio
- Prima di pubblicare su app store / store pubblici
- Prima di introdurre Supabase
- Prima del primo cliente pagante
- Prima di campagne marketing/social su larga scala
- Ogni volta che si aggiunge una dipendenza/libreria/asset esterno non banale

---

*Ultimo aggiornamento: 10/06/2026 — verifica marchio "Sliss" completata, nessun conflitto rilevato*
