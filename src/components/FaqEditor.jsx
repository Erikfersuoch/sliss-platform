import { useState, useEffect } from "react";
import T from "../theme.js";
import { Card, Btn } from "./ui.jsx";
import Icon from "./Icon.jsx";
import { FAQ_DEFAULTS } from "../faqDefaults.js";

// "Le tue FAQ" (M3 v2): il professionista modifica le risposte automatiche che
// il cliente vede nella pagina pubblica. Carica le sue FAQ salvate (api/faq);
// se non ne ha ancora, parte dai default del suo settore così può modificarle.
const FaqEditor = ({ owner, bizType = "servizi" }) => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!owner) return;
    let alive = true;
    const fallback = () => (FAQ_DEFAULTS[bizType] || FAQ_DEFAULTS.servizi).map(x => ({ ...x }));
    fetch(`/api/faq?owner=${encodeURIComponent(owner)}`)
      .then(r => r.json())
      .then(d => {
        if (!alive) return;
        const base = Array.isArray(d.faq) && d.faq.length ? d.faq : fallback();
        setItems(base.map(x => ({ q: x.q || "", a: x.a || "", on: x.on !== false })));
        setStatus("ready");
      })
      .catch(() => { if (!alive) return; setItems(fallback()); setStatus("ready"); });
    return () => { alive = false; };
  }, [owner, bizType]);

  const setField = (i, key, val) => setItems(p => p.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  const toggle = (i) => setField(i, "on", !items[i].on);
  const remove = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const add = () => setItems(p => [...p, { q: "", a: "", on: true }]);

  const save = async () => {
    setSaving(true); setMsg("");
    const clean = items.filter(it => it.q.trim());
    try {
      const r = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, faq: clean }),
      });
      const d = await r.json();
      setMsg(d.ok ? `✓ Salvate ${d.count} FAQ. I tuoi clienti le vedono subito.` : "Qualcosa è andato storto, riprova.");
    } catch {
      setMsg("Niente rete: riprova quando sei online.");
    }
    setSaving(false);
  };

  return (
    <Card style={{ marginBottom: "14px" }}>
      <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Le tue FAQ</h3>
      <p style={{ fontSize: "12px", color: T.textD, marginBottom: "14px", lineHeight: 1.6 }}>
        Le risposte automatiche che il cliente vede nel tuo link. Modifica i testi (es. i tuoi prezzi), spegni le domande che non ti servono, aggiungine di tue.
      </p>

      {!owner && (
        <div style={{ fontSize: "13px", color: T.textD, background: T.bg3, borderRadius: T.r.m, padding: "14px", lineHeight: 1.6 }}>
          Imposta prima il <b>codice tester</b> qui sopra (nella sezione Notifiche): serve a collegare le tue FAQ al tuo link.
        </div>
      )}

      {owner && status === "loading" && (
        <div style={{ fontSize: "13px", color: T.textMu, padding: "8px 0" }}>Carico le tue FAQ{"…"}</div>
      )}

      {owner && status === "ready" && (
        <>
          {items.map((it, i) => (
            <div key={i} style={{ border: `1px solid ${T.border}`, borderRadius: T.r.m, padding: "12px", marginBottom: "10px", background: it.on ? T.bg2 : "rgba(90,111,148,0.05)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                <input
                  value={it.q}
                  onChange={e => setField(i, "q", e.target.value)}
                  placeholder="La domanda del cliente"
                  style={{ fontWeight: 700, fontSize: "14px" }}
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Elimina domanda"
                  style={{ flexShrink: 0, width: "40px", height: "44px", border: `1px solid ${T.border}`, borderRadius: T.r.m, background: T.bg3, color: T.textD, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
              <textarea
                value={it.a}
                onChange={e => setField(i, "a", e.target.value)}
                placeholder="La tua risposta"
                style={{ minHeight: "64px", fontSize: "14px" }}
              />
              <button
                type="button"
                onClick={() => toggle(i)}
                style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", border: `1px solid ${it.on ? T.green : T.border}`, background: it.on ? T.greenS : T.bg3, color: it.on ? T.greenH : T.textMu, fontWeight: 700, fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}
              >
                <Icon name={it.on ? "check" : "message"} size={13} />
                {it.on ? "Visibile ai clienti" : "Nascosta"}
              </button>
            </div>
          ))}

          <Btn v="secondary" s="sm" onClick={add} style={{ width: "100%", justifyContent: "center", marginTop: "4px", marginBottom: "12px" }}>
            <Icon name="plus" size={15} />Aggiungi domanda
          </Btn>

          <Btn onClick={save} disabled={saving} style={{ width: "100%", justifyContent: "center" }}>
            {saving ? "Salvo…" : "Salva le FAQ"}
          </Btn>
          {msg && <p style={{ fontSize: "12.5px", color: msg.startsWith("✓") ? T.green : T.textD, marginTop: "10px", lineHeight: 1.5 }}>{msg}</p>}
        </>
      )}
    </Card>
  );
};

export default FaqEditor;
