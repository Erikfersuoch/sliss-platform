import { describe, it, expect, beforeEach } from "vitest";
import { healData, loadData, saveData, emptyData, STORAGE_KEY } from "./storage.js";

// Guardiano dei dati: questi test difendono il principio "il sistema non deve MAI
// perdere/corrompere i dati dei tester". Se healData smette di sanare, qui diventa rosso.

describe("healData — riparazione struttura dati", () => {
  it("da input vuoto/nullo restituisce la struttura completa e vuota", () => {
    for (const bad of [null, undefined, "stringa", 42, true]) {
      const d = healData(bad);
      expect(d).toEqual(emptyData());
    }
  });

  it("riempie le tabelle mancanti con array vuoti", () => {
    const d = healData({});
    expect(d.clients).toEqual([]);
    expect(d.appointments).toEqual([]);
    expect(d.followUps).toEqual([]);
    expect(d.orders).toEqual([]);
    expect(d.slots).toEqual([]);
    expect(d.feedbacks).toEqual([]);
    expect(d.templates).toEqual([]);
  });

  it("sostituisce le tabelle corrotte (non-array) con array vuoti", () => {
    const d = healData({ clients: "rotto", followUps: 123, orders: { a: 1 } });
    expect(d.clients).toEqual([]);
    expect(d.followUps).toEqual([]);
    expect(d.orders).toEqual([]);
  });

  it("conserva i clienti validi e riempie i campi mancanti (name, status)", () => {
    const d = healData({ clients: [{ id: "c1" }, { id: "c2", name: "Marco", status: "vip" }] });
    expect(d.clients).toHaveLength(2);
    expect(d.clients[0]).toMatchObject({ id: "c1", name: "", status: "new" });
    expect(d.clients[1]).toMatchObject({ id: "c2", name: "Marco", status: "vip" });
  });

  it("riempie i campi mancanti dei follow-up (phase, status)", () => {
    const d = healData({ followUps: [{ id: "f1" }] });
    expect(d.followUps[0]).toMatchObject({ id: "f1", phase: "thankyou", status: "pending" });
  });

  it("unisce le impostazioni custom con i default senza perderle", () => {
    const d = healData({ settings: { businessName: "Momo Ink", bizType: "servizi" } });
    expect(d.settings.businessName).toBe("Momo Ink");
    expect(d.settings.bizType).toBe("servizi");
    // i campi non forniti restano ai default
    expect(d.settings.reviewLink).toBe("");
    expect(d.settings.followUpTimings).toEqual({ thankyou: 0, check: 7, review: 21, reactivation: 60 });
  });

  it("unisce i tempi follow-up parziali con i default", () => {
    const d = healData({ settings: { followUpTimings: { check: 10 } } });
    expect(d.settings.followUpTimings).toEqual({ thankyou: 0, check: 10, review: 21, reactivation: 60 });
  });

  it("ignora chiavi sconosciute (la struttura resta quella attesa)", () => {
    const d = healData({ clients: [], robaStrana: [1, 2, 3] });
    expect(d).not.toHaveProperty("robaStrana");
    expect(Object.keys(d).sort()).toEqual(Object.keys(emptyData()).sort());
  });
});

describe("loadData / saveData — giro completo su localStorage", () => {
  beforeEach(() => {
    // localStorage finto in memoria (i test girano in Node, senza browser)
    const store = {};
    globalThis.localStorage = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    };
  });

  it("salva e rilegge gli stessi dati", () => {
    const data = { ...emptyData(), clients: [{ id: "c1", name: "Luca", status: "active" }] };
    saveData(data);
    const back = loadData();
    expect(back.clients).toHaveLength(1);
    expect(back.clients[0]).toMatchObject({ id: "c1", name: "Luca", status: "active" });
  });

  it("se non c'è nulla salvato restituisce la struttura vuota", () => {
    expect(loadData()).toEqual(emptyData());
  });

  it("se il JSON salvato è corrotto NON crasha e restituisce struttura vuota", () => {
    localStorage.setItem(STORAGE_KEY, "{ questo non è json valido ");
    expect(loadData()).toEqual(emptyData());
  });
});
