#!/bin/bash
# Confronta/allinea lo stamp SYNC tra stato-progetto.md (FONTE DI VERITÀ) e CLAUDE.md.
# Uso:
#   bash docs/check-sync.sh        -> CHECK: exit 0 se combaciano, 1 se mismatch
#   bash docs/check-sync.sh --fix  -> PROPAGA versione/data della FONTE dentro CLAUDE.md
# Nota: lo stamp nella memoria di Claude (fuori dal repo) va allineato a parte.

set -e
cd "$(dirname "$0")/.."

FONTE=$(grep -m1 "SYNC ▸ FONTE DI VERITÀ" docs/stato-progetto.md | grep -oE "v[0-9]+\.[0-9]+ · [0-9]{4}-[0-9]{2}-[0-9]{2}" || true)
CLAUDE=$(grep -m1 "SYNC ▸" CLAUDE.md | grep -oE "v[0-9]+\.[0-9]+ · [0-9]{4}-[0-9]{2}-[0-9]{2}" || true)

if [ "$1" = "--fix" ]; then
  if [ -z "$FONTE" ]; then echo "ERRORE: stamp FONTE non trovato in docs/stato-progetto.md"; exit 1; fi
  if [ "$FONTE" = "$CLAUDE" ]; then
    echo "Già allineati ($FONTE) — niente da fare."
    exit 0
  fi
  # Sostituisce il token 'vX.Y · DATA' solo sulla riga che contiene 'SYNC ▸' in CLAUDE.md
  sed -i "/SYNC ▸/ s/v[0-9]\+\.[0-9]\+ · [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}/$FONTE/" CLAUDE.md
  echo "Propagato in CLAUDE.md: ${CLAUDE:-(vuoto)} -> $FONTE"
  echo "(Ricorda: allinea anche lo stamp nella memoria di Claude.)"
  exit 0
fi

# --- default: CHECK ---
echo "stato-progetto.md : $FONTE"
echo "CLAUDE.md         : $CLAUDE"
if [ "$FONTE" != "$CLAUDE" ]; then
  echo "MISMATCH: esegui 'bash docs/check-sync.sh --fix' per allineare CLAUDE.md"
  exit 1
fi
echo "OK: stamp allineati"
