const STORAGE_KEY = "sliss-v4";
const ONBOARDING_KEY = "sliss-onboarded-v4";

const storage = {
  get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, val); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

export const emptyData = () => ({
  clients: [],
  appointments: [],
  followUps: [],
  templates: [],
  feedbacks: [],
  orders: [],
  settings: {
    businessName: "",
    reviewLink: "",
    bizType: "",
    followUpTimings: { thankyou: 0, check: 7, review: 21, reactivation: 60 },
  },
});

export const loadData = () => {
  try { const r = storage.get(STORAGE_KEY); return r ? JSON.parse(r) : emptyData(); }
  catch { return emptyData(); }
};

export const saveData = (data) => {
  try { storage.set(STORAGE_KEY, JSON.stringify(data)); } catch(e) { console.error(e); }
};

export const isOnboarded = () => {
  try { return !!storage.get(ONBOARDING_KEY); } catch { return false; }
};

export const setOnboarded = () => {
  try { storage.set(ONBOARDING_KEY, "1"); } catch {}
};

export const clearOnboarding = () => {
  storage.remove(ONBOARDING_KEY);
};

export { STORAGE_KEY, ONBOARDING_KEY, storage };
