const STORAGE_KEY = "sliss-v4";
const ONBOARDING_KEY = "sliss-onboarded-v4";

const storage = {
  get: (key) => { try { return localStorage.getItem(key); } catch(_) { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, val); } catch(_) {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch(_) {} },
};

export const emptyData = () => ({
  clients: [],
  appointments: [],
  followUps: [],
  templates: [],
  feedbacks: [],
  orders: [],
  slots: [],
  richieste: [],
  settings: {
    businessName: "",
    reviewLink: "",
    bizType: "",
    cluster: "",
    followUpTimings: { thankyou: 0, check: 7, review: 21, reactivation: 60 },
  },
});

// Auto-healing: garantisce che la struttura dei dati sia sempre valida
const healData = (raw) => {
  if (!raw || typeof raw !== "object") return emptyData();
  const def = emptyData();
  return {
    clients:      Array.isArray(raw.clients)      ? raw.clients.map(c => ({...c, name: c.name||"", status: c.status||"new"}))      : def.clients,
    appointments: Array.isArray(raw.appointments) ? raw.appointments : def.appointments,
    followUps:    Array.isArray(raw.followUps)    ? raw.followUps.map(f => ({...f, phase: f.phase||"thankyou", status: f.status||"pending"})) : def.followUps,
    templates:    Array.isArray(raw.templates)    ? raw.templates : def.templates,
    feedbacks:    Array.isArray(raw.feedbacks)    ? raw.feedbacks : def.feedbacks,
    orders:       Array.isArray(raw.orders)       ? raw.orders : def.orders,
    slots:        Array.isArray(raw.slots)        ? raw.slots  : def.slots,
    richieste:    Array.isArray(raw.richieste)    ? raw.richieste : def.richieste,
    settings: {
      ...def.settings,
      ...(raw.settings && typeof raw.settings === "object" ? raw.settings : {}),
      followUpTimings: {
        ...def.settings.followUpTimings,
        ...(raw.settings?.followUpTimings || {}),
      },
    },
  };
};

export const loadData = () => {
  try {
    const r = storage.get(STORAGE_KEY);
    const parsed = r ? JSON.parse(r) : null;
    return healData(parsed);
  } catch(_) {
    return emptyData();
  }
};

export const saveData = (data) => {
  try { storage.set(STORAGE_KEY, JSON.stringify(data)); } catch(e) { console.error(e); }
};

export const isOnboarded = () => {
  try { return !!storage.get(ONBOARDING_KEY); } catch(_) { return false; }
};

export const setOnboarded = () => {
  try { storage.set(ONBOARDING_KEY, "1"); } catch(_) {}
};

export const clearOnboarding = () => {
  storage.remove(ONBOARDING_KEY);
};

export { STORAGE_KEY, ONBOARDING_KEY, storage, healData };
