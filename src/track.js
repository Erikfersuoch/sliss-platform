// Tracking minimo d'uso (best-effort, silenzioso): segnala che il tester ha aperto l'app oggi.
// Non blocca mai e non manda dati personali: solo il codice tester + conteggi aggregati.
export const pingUsage = async (tester, stats) => {
  if (!tester) return;
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tester, stats }),
    });
  } catch (_) { /* mai bloccante */ }
};
