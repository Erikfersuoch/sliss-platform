#!/bin/bash
# Misura il "peso" del contesto che Claude si carica e segnala cosa è oltre soglia.
# Uso: bash docs/check-contesto.sh
# Regole e soglie: docs/protocollo-contesto.md
cd "$(dirname "$0")/.."

words() { wc -w < "$1" 2>/dev/null | tr -d ' '; }
lines() { wc -l < "$1" 2>/dev/null | tr -d ' '; }
flag()  { if [ "$1" -gt "$2" ]; then echo "  ⚠️ OLTRE SOGLIA ($1 > $2) — $3"; fi; }

MEM="$HOME/.claude/projects/C--Users-erikf/memory"

echo "🔥 CALDO (ogni sessione)"
echo "  MEMORY.md          : $(lines "$MEM/MEMORY.md") righe"
flag "$(lines "$MEM/MEMORY.md")" 18 "accorpa righe / togli date superate"
echo "  CLAUDE.md          : $(words CLAUDE.md) parole"
flag "$(words CLAUDE.md)" 1800 "sposta dettaglio nel freddo"
echo "  RIPRENDI.md        : $(lines docs/RIPRENDI.md) righe"
flag "$(lines docs/RIPRENDI.md)" 40 "tieni solo ultima sessione + prossimo passo"

echo "🌡️  TIEPIDO (inizio sessione)"
echo "  stato-progetto.md  : $(words docs/stato-progetto.md) parole"
flag "$(words docs/stato-progetto.md)" 3000 "archivia sessioni vecchie in docs/archivio/"
echo "  memorie > 400 parole:"
for f in "$MEM"/*.md; do
  w=$(words "$f")
  [ "$w" -gt 400 ] && echo "    ⚠️ $(basename "$f"): $w parole — snellisci al fatto durevole"
done

echo ""
echo "Soglie e regole: docs/protocollo-contesto.md"
