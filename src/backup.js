// Client del backup cloud (best-effort). Non blocca mai l'app: ogni errore è silenzioso.
// La fonte primaria resta localStorage; questo serve solo come rete di sicurezza.

// Salva una copia dei dati nel cloud, legata al codice tester. Restituisce true se ok.
export const saveBackup = async (tester, data) => {
  if (!tester || !data) return false;
  try {
    const r = await fetch('/api/backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tester, data }),
    });
    return r.ok;
  } catch (_) {
    return false;
  }
};

// Legge l'ultimo backup salvato per quel tester. Restituisce { data, savedAt } o null.
export const loadBackup = async (tester) => {
  if (!tester) return null;
  try {
    const r = await fetch(`/api/backup?tester=${encodeURIComponent(tester)}`);
    if (!r.ok) return null;
    const j = await r.json();
    return j.backup || null;
  } catch (_) {
    return null;
  }
};
