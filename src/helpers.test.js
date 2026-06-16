import { describe, it, expect, vi, afterEach } from "vitest";
import { addDays, today, isPhaseOff, sendHref, fmtDate, uid, greet } from "./helpers.js";

describe("addDays — calcolo date follow-up", () => {
  it("aggiunge i giorni e tiene il formato YYYY-MM-DD", () => {
    expect(addDays("2026-06-16", 7)).toBe("2026-06-23");
  });
  it("gestisce il cambio di mese", () => {
    expect(addDays("2026-06-28", 5)).toBe("2026-07-03");
  });
  it("gestisce il cambio d'anno", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
  });
  it("con 0 giorni restituisce lo stesso giorno", () => {
    expect(addDays("2026-06-16", 0)).toBe("2026-06-16");
  });
});

describe("today — data odierna", () => {
  it("ha il formato YYYY-MM-DD", () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("isPhaseOff — fase disattivata dall'utente", () => {
  it("è OFF se esistono template per la fase ma nessuno è attivo", () => {
    expect(isPhaseOff([{ phase: "thankyou", active: false }], "thankyou")).toBe(true);
  });
  it("è ON se almeno un template della fase è attivo", () => {
    expect(isPhaseOff([{ phase: "thankyou", active: true }], "thankyou")).toBe(false);
  });
  it("non è OFF se per quella fase non c'è nessun template", () => {
    expect(isPhaseOff([], "thankyou")).toBe(false);
    expect(isPhaseOff([{ phase: "check", active: true }], "thankyou")).toBe(false);
  });
});

describe("sendHref — scelta canale d'invio con fallback", () => {
  it("WhatsApp: numero locale a 10 cifre prende il prefisso 39", () => {
    expect(sendHref("ciao", "3471234567", null, "WhatsApp")).toMatch(/^whatsapp:\/\/send\?phone=393471234567/);
  });
  it("Email: con email valida apre mailto", () => {
    expect(sendHref("ciao", "3471234567", "a@b.com", "Email")).toMatch(/^mailto:a@b\.com/);
  });
  it("SMS: con numero apre sms", () => {
    expect(sendHref("ciao", "3471234567", null, "SMS")).toMatch(/^sms:393471234567/);
  });
  it("ripiega su email se manca il telefono", () => {
    expect(sendHref("ciao", null, "a@b.com", "WhatsApp")).toMatch(/^mailto:a@b\.com/);
  });
  it("restituisce null se non c'è né telefono né email", () => {
    expect(sendHref("ciao", null, null, "WhatsApp")).toBeNull();
  });
});

describe("fmtDate — formattazione data", () => {
  it("data vuota mostra il trattino", () => {
    expect(fmtDate(null)).toBe("\u{2014}");
  });
  it("data valida contiene l'anno", () => {
    expect(fmtDate("2026-06-16")).toContain("2026");
  });
});

describe("greet — saluto in base all'ora", () => {
  afterEach(() => vi.useRealTimers());
  const at = (h) => { vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 5, 16, h, 0, 0)); };
  it("mattina (prima delle 12) → Buongiorno", () => { at(9); expect(greet()).toBe("Buongiorno"); });
  it("pomeriggio (12–17) → Buon pomeriggio", () => { at(15); expect(greet()).toBe("Buon pomeriggio"); });
  it("sera (dalle 18) → Buonasera", () => { at(20); expect(greet()).toBe("Buonasera"); });
});

describe("uid — identificatori unici", () => {
  it("genera id diversi a ogni chiamata", () => {
    const ids = new Set(Array.from({ length: 1000 }, () => uid()));
    expect(ids.size).toBe(1000);
  });
});
