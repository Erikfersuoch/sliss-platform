#!/bin/bash
# Confronta lo stamp SYNC ▸ FONTE DI VERITÀ (stato-progetto.md) con lo stamp SYNC in CLAUDE.md.
# Uso: bash docs/check-sync.sh
# Exit 0 = combaciano, exit 1 = mismatch (da propagare manualmente).

set -e
cd "$(dirname "$0")/.."

FONTE=$(grep -m1 "SYNC ▸ FONTE DI VERITÀ" docs/stato-progetto.md | grep -oE "v[0-9]+\.[0-9]+ · [0-9]{4}-[0-9]{2}-[0-9]{2}")
CLAUDE=$(grep -m1 "SYNC ▸" CLAUDE.md | grep -oE "v[0-9]+\.[0-9]+ · [0-9]{4}-[0-9]{2}-[0-9]{2}")

echo "stato-progetto.md : $FONTE"
echo "CLAUDE.md         : $CLAUDE"

if [ "$FONTE" != "$CLAUDE" ]; then
  echo "MISMATCH: aggiorna lo stamp SYNC in CLAUDE.md per allinearlo a stato-progetto.md"
  exit 1
fi

echo "OK: stamp allineati"
