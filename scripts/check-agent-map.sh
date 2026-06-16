#!/bin/bash
# Controlla se nell'ultima sessione sono cambiati file che descrivono processi.
# Se sì, ricorda di aggiornare docs/agenti-ia.md

PROCESS_FILES="src/pages/ src/followups.js src/config.js src/storage.js src/push.js"

# File cambiati dall'ultimo commit rispetto al commit precedente
CHANGED=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD 2>/dev/null)

RELEVANT=""
for pattern in $PROCESS_FILES; do
  if echo "$CHANGED" | grep -q "$pattern"; then
    RELEVANT="$RELEVANT\n  • $pattern"
  fi
done

if [ -n "$RELEVANT" ]; then
  echo ""
  echo "┌─────────────────────────────────────────────────────┐"
  echo "│  🤖  AGENTI IA — aggiornare docs/agenti-ia.md ?    │"
  echo "│                                                     │"
  echo "│  File processo cambiati in questa sessione:         │"
  printf "$RELEVANT\n"
  echo "│                                                     │"
  echo "│  Valuta se aggiungere/modificare processi o agenti. │"
  echo "└─────────────────────────────────────────────────────┘"
  echo ""
fi
