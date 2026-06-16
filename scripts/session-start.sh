#!/bin/bash
# Stato reale del progetto all'avvio di ogni sessione Claude Code.
# Impedisce affermazioni su deploy/branch/codice senza verifica.

cd /home/user/sliss-platform 2>/dev/null || exit 0

git fetch origin main --quiet 2>/dev/null

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
  echo "│  ⚠️  BRANCH IN RITARDO — considera git rebase/merge"
fi
echo "└─────────────────────────────────────────────────────┘"
echo ""
