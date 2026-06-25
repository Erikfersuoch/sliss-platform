# Protocollo Contesto — sistema anti-appesantimento

> **Scopo:** tenere Claude al massimo della lucidità man mano che il progetto cresce.
> Non è documentazione da leggere ogni sessione (vive nel FREDDO): si apre solo
> quando si fa pulizia. Il principio sta in una riga: **percorso caldo sottile**.

---

## Il principio

Tutto ciò che Claude si porta in testa si divide in 3 livelli per **quanto spesso
viene caricato**. La regola è una: più un file è caldo, più dev'essere sottile.
Storia e dettaglio vanno spinti verso il freddo, **indicizzati non incollati**.

| Livello | File | Regola | Limite (trigger di pulizia) |
|---|---|---|---|
| 🔥 **CALDO** — ogni sessione, sempre in testa | `MEMORY.md` · `CLAUDE.md` · `docs/RIPRENDI.md` | sottilissimi | MEMORY.md > 18 righe o una riga > ~25 parole · CLAUDE.md > ~1800 parole · RIPRENDI.md > 40 righe |
| 🌡️ **TIEPIDO** — letto a inizio sessione | `docs/stato-progetto.md` · file di memoria richiamati | snelli, **zero contraddizioni**, finestra mobile | stato-progetto.md > ~3000 parole **o** > 4 sessioni verbose · singolo file di memoria > ~400 parole |
| 🧊 **FREDDO** — solo su richiesta per un compito | `decisioni.md` · `parking-lot.md` · spec moduli · `archivio/` | possono crescere all'infinito **se indicizzati** | nessuno (ma serve un indice/pointer da un file più caldo) |

---

## Quando si fa pulizia (il trigger)

Due inneschi, basta uno:
1. **A soglia** — un file caldo/tiepido supera il suo limite (misura con `bash docs/check-contesto.sh`).
2. **A giudizio** — Claude sente che il focus cala (risposte vaghe, fatica a trovare la verità corrente, contraddizioni). Non serve aspettare la soglia.

Momento naturale: **a fine sessione**, insieme al commit di chiusura.

---

## Cosa è alleggerimento (regole d'oro)

L'alleggerimento è **funzionale, mai distruttivo**. Si toglie solo il *superfluo non
compromettente*: verbosità, ripetizioni, date superate, stato congelato che contraddice
quello nuovo. **Nessuna informazione che serve a operare va persa** — si *sposta* (in
archivio/freddo), non si cancella.

### NON si tocca MAI (lista intoccabili)
- **Codice dell'app** (`src/`, `api/`, `public/`, config build): la pulizia riguarda SOLO doc e memoria. Niente di ciò che fa qui può rompere l'app.
- **Spec dei moduli** attivi o futuri, **decisioni** con motivazione, **rischi legali/IP**: sono fonte di verità, si spostano al freddo ma non si tagliano.
- Il **perché** dietro una scelta: si conserva sempre (è ciò che non è ricostruibile dal codice).

### Si alleggerisce (superfluo)
- **Verbosità storica:** sessioni vecchie → riga-sommario in attivo + testo pieno in `docs/archivio/`.
- **Stato congelato/contraddittorio:** sezioni "oggi/adesso" rimaste indietro → riallineate alla realtà corrente (fonte: `RIPRENDI.md` + ultime sessioni del log).
- **Duplicazione:** stesso fatto in più file → vive in UN posto, gli altri puntano (es. versione/fase solo in `stato-progetto.md`, vedi stamp `SYNC ▸`).
- **Memorie superate:** fatti non più veri (date di gate passate, blocchi risolti) → si correggono o si cancellano.

---

## Reversibilità (rete di sicurezza)

Ogni passata di pulizia è **un commit a sé**, prefisso `chore(contesto):`, mai mischiata
a lavoro di feature. Così qualsiasi passo si annulla atomico con `git revert`. È tutto
in git: niente è davvero perso. Per pulizie grosse o dubbie → prima si mostra a Erik,
poi si esegue (regola PC-safety).

---

## Lungimiranza — crescita per moduli

Il progetto crescerà (M3, M4, …). Perché il caldo non gonfi a ogni modulo nuovo:

- **Dettaglio di modulo** (spec, FAQ, calibrazione) vive in un file/cartella di modulo
  nel FREDDO, non nel log attivo.
- Il **log attivo** (`stato-progetto.md`) tiene solo: stato corrente + ultime ~2-4
  sessioni + pointer. La storia scende in `archivio/`.
- **Convenzione nuovo modulo:** quando un modulo diventa attivo, la sua spec sta in
  `docs/spec-mN-*.md` (o `docs/moduli/mN-*/` se i file diventano molti); il log attivo
  lo cita in una riga, non lo riassume.

---

## La routine (cosa fare, in ordine)

1. `bash docs/check-contesto.sh` → vedi cosa è oltre soglia.
2. **stato-progetto.md:** sessioni oltre la 4ª → taglia e incolla in `docs/archivio/`, lascia una riga-sommario. Riallinea le sezioni "oggi/adesso/prossimi passi" alla realtà corrente.
3. **MEMORY.md:** accorpa righe, togli date superate, tieni ≤ ~25 parole/riga.
4. **File di memoria > 400 parole:** snellisci al fatto durevole (togli ciò che il repo/git già registra).
5. Verifica che gli stamp `SYNC ▸` combacino (`bash docs/check-sync.sh`).
6. Commit unico `chore(contesto): …`. Una riga in `stato-progetto.md` (log) e fine.
