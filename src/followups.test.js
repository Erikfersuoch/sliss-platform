import { describe, it, expect } from "vitest";
import { buildFollowUps, buildProductFollowUps, tplMessage } from "./followups.js";
import { addDays, fmtDate } from "./helpers.js";

// Rete di sicurezza sul MOTORE dei follow-up (cuore di M1, in validazione).
// Questi test FOTOGRAFANO il comportamento attuale: se una modifica futura
// (icone, dark mode, refactor) lo cambia per sbaglio, la CI lo segnala prima
// che arrivi sui telefoni di Moira e Luca. NON modificano il motore: lo leggono.

const byPhase = (list, phase) => list.find(fu => fu.phase === phase);

// ────────────────────────────────────────────────────────────────────
// SERVIZI — buildFollowUps (flusso di Moira: appuntamento → 4 follow-up)
// ────────────────────────────────────────────────────────────────────
describe("buildFollowUps — follow-up dei servizi (Moira)", () => {
  const APPT = "appt1";
  const CLIENT = "cli1";
  const NAME = "Giulia";
  const DATE = "2026-06-16";
  const TIMINGS = {}; // tutti default: 0 / 7 / 21 / 60

  it("a) genera 4 follow-up nelle fasi giuste, alle date giuste", () => {
    const fus = buildFollowUps(APPT, CLIENT, NAME, DATE, "Tatuaggio", TIMINGS, []);
    expect(fus.map(f => f.phase)).toEqual(["thankyou", "check", "review", "reactivation"]);
    expect(byPhase(fus, "thankyou").scheduledDate).toBe(addDays(DATE, 0));
    expect(byPhase(fus, "check").scheduledDate).toBe(addDays(DATE, 7));
    expect(byPhase(fus, "review").scheduledDate).toBe(addDays(DATE, 21));
    expect(byPhase(fus, "reactivation").scheduledDate).toBe(addDays(DATE, 60));
  });

  it("b) i tempi personalizzati nei Template spostano le date", () => {
    const timings = { thankyou: 1, check: 10, review: 30, reactivation: 90 };
    const fus = buildFollowUps(APPT, CLIENT, NAME, DATE, "Tatuaggio", timings, []);
    expect(byPhase(fus, "thankyou").scheduledDate).toBe(addDays(DATE, 1));
    expect(byPhase(fus, "check").scheduledDate).toBe(addDays(DATE, 10));
    expect(byPhase(fus, "review").scheduledDate).toBe(addDays(DATE, 30));
    expect(byPhase(fus, "reactivation").scheduledDate).toBe(addDays(DATE, 90));
  });

  it("c) una fase disattivata non viene creata (restano 3)", () => {
    const templates = [{ phase: "review", text: "x", active: false }];
    const fus = buildFollowUps(APPT, CLIENT, NAME, DATE, "Tatuaggio", TIMINGS, templates);
    expect(fus.map(f => f.phase)).toEqual(["thankyou", "check", "reactivation"]);
    expect(byPhase(fus, "review")).toBeUndefined();
  });

  it("d) il servizio 'Ritocco' usa un messaggio di ringraziamento diverso", () => {
    const normale = byPhase(buildFollowUps(APPT, CLIENT, NAME, DATE, "Tatuaggio", TIMINGS, []), "thankyou");
    const ritocco = byPhase(buildFollowUps(APPT, CLIENT, NAME, DATE, "Ritocco", TIMINGS, []), "thankyou");
    expect(ritocco.message).not.toBe(normale.message);
    expect(ritocco.message).toContain("ritocco");
  });

  it("e) un template personalizzato con [Nome] esce col nome del cliente", () => {
    const templates = [{ phase: "thankyou", text: "Grazie [Nome] per la fiducia!", active: true }];
    const fus = buildFollowUps(APPT, CLIENT, NAME, DATE, "Tatuaggio", TIMINGS, templates);
    expect(byPhase(fus, "thankyou").message).toBe("Grazie Giulia per la fiducia!");
  });

  it("f) tutti nascono 'da inviare', non inviati, agganciati al cliente/appuntamento", () => {
    const fus = buildFollowUps(APPT, CLIENT, NAME, DATE, "Tatuaggio", TIMINGS, []);
    for (const fu of fus) {
      expect(fu.status).toBe("pending");
      expect(fu.sentDate).toBeNull();
      expect(fu.satisfaction).toBeNull();
      expect(fu.appointmentId).toBe(APPT);
      expect(fu.clientId).toBe(CLIENT);
      expect(fu.id).toBeTruthy();
    }
  });
});

// ────────────────────────────────────────────────────────────────────
// PRODOTTI — buildProductFollowUps (flusso di Luca: ordine → 5 follow-up)
// ────────────────────────────────────────────────────────────────────
describe("buildProductFollowUps — follow-up dei prodotti (Luca)", () => {
  const ORDER = "ord1";
  const CLIENT = "cli2";
  const NAME = "Marco";
  const ORDER_DATE = "2026-06-16";
  const PHASES = ["order_confirm", "shipping", "delivery_check", "review", "reorder"];

  it("g) genera 5 follow-up nelle fasi giuste", () => {
    const fus = buildProductFollowUps(ORDER, CLIENT, NAME, ORDER_DATE, null, []);
    expect(fus.map(f => f.phase)).toEqual(PHASES);
  });

  it("h) senza consegna stimata: consegna = ordine +7; date +3/+14/+60 da lì", () => {
    const fus = buildProductFollowUps(ORDER, CLIENT, NAME, ORDER_DATE, null, []);
    const delivery = addDays(ORDER_DATE, 7);
    expect(byPhase(fus, "order_confirm").scheduledDate).toBe(ORDER_DATE);
    expect(byPhase(fus, "delivery_check").scheduledDate).toBe(addDays(delivery, 3));
    expect(byPhase(fus, "review").scheduledDate).toBe(addDays(delivery, 14));
    expect(byPhase(fus, "reorder").scheduledDate).toBe(addDays(delivery, 60));
  });

  it("i) con una consegna stimata, le date la rispettano", () => {
    const delivery = "2026-07-01";
    const fus = buildProductFollowUps(ORDER, CLIENT, NAME, ORDER_DATE, delivery, []);
    expect(byPhase(fus, "delivery_check").scheduledDate).toBe(addDays(delivery, 3));
    expect(byPhase(fus, "review").scheduledDate).toBe(addDays(delivery, 14));
    expect(byPhase(fus, "reorder").scheduledDate).toBe(addDays(delivery, 60));
  });

  it("j) la spedizione nasce senza data e in attesa (il 'Ready to go' manuale di Luca)", () => {
    const fus = buildProductFollowUps(ORDER, CLIENT, NAME, ORDER_DATE, null, []);
    const shipping = byPhase(fus, "shipping");
    expect(shipping.scheduledDate).toBeNull();
    expect(shipping.awaitShipping).toBe(true);
  });

  it("k) disattivare una fase la esclude; [Data] nel template esce formattata", () => {
    const delivery = "2026-07-01";
    const templates = [
      { phase: "reorder", text: "x", active: false },
      { phase: "shipping", text: "In partenza! Arrivo: [Data]", active: true },
    ];
    const fus = buildProductFollowUps(ORDER, CLIENT, NAME, ORDER_DATE, delivery, templates);
    expect(byPhase(fus, "reorder")).toBeUndefined();
    expect(byPhase(fus, "shipping").message).toBe(`In partenza! Arrivo: ${fmtDate(delivery)}`);
  });

  it("tutti nascono 'da inviare', non inviati, agganciati al cliente/ordine", () => {
    const fus = buildProductFollowUps(ORDER, CLIENT, NAME, ORDER_DATE, null, []);
    for (const fu of fus) {
      expect(fu.status).toBe("pending");
      expect(fu.sentDate).toBeNull();
      expect(fu.orderId).toBe(ORDER);
      expect(fu.clientId).toBe(CLIENT);
      expect(fu.id).toBeTruthy();
    }
  });
});

// ────────────────────────────────────────────────────────────────────
// tplMessage — sostituzione segnaposto e scelta template
// ────────────────────────────────────────────────────────────────────
describe("tplMessage — testo del messaggio", () => {
  it("usa il template attivo dell'utente al posto del default", () => {
    const templates = [{ phase: "check", text: "Ciao [Nome], tutto ok?", active: true }];
    expect(tplMessage(templates, "check", "Ada", "fallback")).toBe("Ciao Ada, tutto ok?");
  });

  it("ripiega sul testo di default se non c'è un template attivo", () => {
    expect(tplMessage([], "check", "Ada", "messaggio di default")).toBe("messaggio di default");
  });

  it("ignora un template disattivato e usa il fallback", () => {
    const templates = [{ phase: "check", text: "personalizzato", active: false }];
    expect(tplMessage(templates, "check", "Ada", "default")).toBe("default");
  });
});
