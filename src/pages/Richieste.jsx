import T from "../theme.js";
import { useSliss } from "../context.js";
import { PageHeader, Card, Badge, Btn } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";

// Etichette dei tipi di richiesta (dal finale della chat pubblica)
const KIND = {
  sumisura: "Su misura",
  perso:    "Personalizzazione",
  diretto:  "Diretto",
  ebay:     "eBay",
  richiesta:"Richiesta",
};

// Stati della richiesta = etichette che Luca già usa su WhatsApp
const STATUS = {
  nuova: { label: "Nuova",          color: T.green, bg: T.greenS },
  presa: { label: "In lavorazione", color: T.amber, bg: T.amberS },
  chiusa:{ label: "Chiusa",         color: T.textD, bg: "rgba(90,111,148,0.08)" },
};

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
};

const Richieste = () => {
  const { data, update, deleteRecord } = useSliss();
  const items = data?.richieste || [];
  const aperte = items.filter(r => (r.status || "nuova") !== "chiusa");
  const chiuse = items.filter(r => (r.status || "nuova") === "chiusa");

  const Riga = (r) => {
    const st = STATUS[r.status || "nuova"] || STATUS.nuova;
    const what = r.product || r.desc || "Richiesta";
    return (
      <Card key={r.id} style={{ padding: "14px 16px", marginBottom: "9px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: T.r.m, background: st.bg, color: st.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "15px", flexShrink: 0 }}>
            {(r.nome || "?").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 700 }}>{r.nome} {r.cognome}</div>
            <div style={{ fontSize: "12.5px", color: T.textM, marginTop: "2px", lineHeight: 1.45 }}>{what}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              <Badge label={st.label} color={st.color} bg={st.bg} s />
              <span style={{ fontSize: "11px", color: T.textMu }}>{KIND[r.kind] || "Richiesta"} · {fmtDate(r.created)}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
          {(r.status || "nuova") === "nuova" && <Btn s="sm" onClick={() => update("richieste", r.id, { status: "presa" })}>Prendi in carico</Btn>}
          {(r.status || "nuova") === "presa" && <Btn s="sm" onClick={() => update("richieste", r.id, { status: "chiusa" })}>Segna chiusa</Btn>}
          {(r.status || "nuova") === "chiusa" && <Btn s="sm" v="secondary" onClick={() => update("richieste", r.id, { status: "presa" })}>Riapri</Btn>}
          <Btn s="sm" v="ghost" onClick={() => { if (confirm("Eliminare questa richiesta?")) deleteRecord("richieste", r.id); }}>Elimina</Btn>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ animation: "fadeIn .35s ease" }}>
      <PageHeader title="Richieste" />
      <p style={{ color: T.textD, fontSize: "13px", marginBottom: "20px" }}>
        Le richieste che arrivano dal tuo link. Qui non se ne perde nessuna.
      </p>

      {items.length === 0 ? (
        <Card style={{ padding: "28px 20px", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: T.r.l, background: T.bg3, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Icon name="message" size={24} color={T.textD} />
          </div>
          <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>Ancora nessuna richiesta</div>
          <div style={{ fontSize: "13px", color: T.textD, lineHeight: 1.6 }}>
            Metti il tuo link nel messaggio di benvenuto di WhatsApp: appena un cliente lo usa, la richiesta compare qui.
          </div>
        </Card>
      ) : (
        <>
          {aperte.map(Riga)}
          {chiuse.length > 0 && (
            <>
              <div style={{ fontSize: "12px", fontWeight: 700, color: T.textMu, textTransform: "uppercase", letterSpacing: ".05em", margin: "20px 0 10px" }}>Chiuse</div>
              {chiuse.map(Riga)}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Richieste;
