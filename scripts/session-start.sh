#!/bin/bash
# Stato reale del progetto all'avvio di ogni sessione Claude Code.
# Impedisce affermazioni su deploy/branch/codice senza verifica.

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" 2>/dev/null || exit 0

# Multi-postazione (PC casa + altro PC + telefono): fetch di TUTTO, non solo main,
# per accorgersi di lavoro fermo su altri branch prima di iniziare cose nuove.
git fetch origin --prune --quiet 2>/dev/null

MAIN=$(git log --oneline origin/main -1 2>/dev/null)
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
AHEAD=$(git log --oneline origin/main..HEAD 2>/dev/null | wc -l | tr -d ' ')
BEHIND=$(git log --oneline HEAD..origin/main 2>/dev/null | wc -l | tr -d ' ')
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│  📍 STATO PROGETTO — $(date '+%d/%m/%Y %H:%M')              │"
echo "├─────────────────────────────────────────────────────┤"
printf "│  main (Vercel): %.52s\n" "$MAIN"
echo "│  branch attivo: $CURRENT_BRANCH"
echo "│  ahead main:    $AHEAD commit"
echo "│  behind main:   $BEHIND commit"
echo "│  non committati: $UNCOMMITTED file"
if [ "$BEHIND" -gt "0" ] 2>/dev/null; then
  echo "│  ⚠️  SEI INDIETRO di $BEHIND commit → SINCRONIZZA PRIMA di lavorare:"
  echo "│      git stash -u && git merge --ff-only origin/main && git stash pop"
fi
echo "└─────────────────────────────────────────────────────┘"

# Lavoro fermo su altri branch (es. sessioni da telefono/altro PC chiuse senza merge).
UNMERGED=""
for ref in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin 2>/dev/null | grep -vE 'origin/(main|HEAD)$'); do
  n=$(git log --oneline "origin/main..$ref" 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -gt "0" ] 2>/dev/null && UNMERGED="$UNMERGED\n│  ⚠️  $ref: $n commit NON in main"
done
if [ -n "$UNMERGED" ]; then
  echo "┌──────────── ⚠️  LAVORO NON FUSO IN main ────────────┐"
  printf "$UNMERGED\n"
  echo "│  → rivedi e integra in main PRIMA di iniziare cose nuove"
  echo "│    (git log origin/main..<branch> per vedere cosa contiene)"
  echo "└─────────────────────────────────────────────────────┘"
fi
echo ""

# ▶ Riprendi da qui: punto di ripresa scritto all'ultima chiusura ("chiudi per oggi").
if [ -f docs/RIPRENDI.md ]; then
  echo "════════════ ▶ RIPRENDI DA QUI ════════════"
  # mostra dal titolo "Prossimo passo" in giù (la parte azionabile)
  awk '/^## ▶ Prossimo passo/{p=1} p' docs/RIPRENDI.md
  echo "  (contesto completo: docs/RIPRENDI.md + docs/stato-progetto.md)"
  echo "═══════════════════════════════════════════"
  echo ""
fi
