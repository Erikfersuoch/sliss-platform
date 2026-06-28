import { useState, useEffect } from "react";
import T from "../theme.js";
import { Card, Empty, PageHeader } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";

// "Aiuto · Come funziona Sliss" (M3 v2, slice 2): pagina di SOLA LETTURA dove il
// tester/cliente trova le risposte su come funziona Sliss, così si serve da solo.
// I contenuti li gestisce Erik dall'editor admin (Impostazioni, codice ceoerik):
// vivono sul backend con owner riservato 'sliss-help'. Qui mostriamo solo le ON.
const HelpSliss = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready
  const [open, setOpen] = useState(0); // indice della FAQ aperta (-1 = nessuna)

  useEffect(() => {
    let alive = true;
    fetch("/api/faq?owner=sliss-help")
      .then(r => r.json())
      .then(d => {
        if (!alive) return;
        const on = (Array.isArray(d.faq) ? d.faq : []).filter(x => x.q && x.on !== false);
        setItems(on);
        setStatus("ready");
      })
      .catch(() => { if (!alive) return; setItems([]); setStatus("ready"); });
    return () => { alive = false; };
  }, []);

  return (
    <div style={{ animation: "fadeIn .35s ease" }}>
      <PageHeader title="Aiuto" />
      <p style={{ fontSize: "13px", color: T.textD, marginBottom: "16px", lineHeight: 1.55 }}>
        Le domande più comuni su come funziona Sliss. Tocca una domanda per leggere la risposta.
      </p>

      {status === "loading" && (
        <div style={{ fontSize: "13px", color: T.textMu, padding: "8px 0" }}>Carico le risposte{"…"}</div>
      )}

      {status === "ready" && items.length === 0 && (
        <Empty icon={<Icon name="message" size={44} color={T.textD} />} title="Ancora niente qui" desc="Le risposte su come funziona Sliss arriveranno presto. Nel frattempo, per qualsiasi dubbio scrivimi pure." />
      )}

      {status === "ready" && items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Card key={i} style={{ padding: 0, overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", minHeight: "44px" }}
                >
                  <span style={{ flex: 1, fontWeight: 600, fontSize: "15px", color: T.textM }}>{it.q}</span>
                  <span style={{ flexShrink: 0, color: T.textMu, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s", fontSize: "18px", lineHeight: 1 }}>{"\u{203A}"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 18px 16px", fontSize: "14px", color: T.textD, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                    {it.a || "—"}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HelpSliss;
