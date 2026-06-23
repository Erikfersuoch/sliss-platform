import { useState } from "react";
import T from "../theme.js";
import { useSliss } from "../context.js";
import { PageHeader, Card, Badge, Btn, Modal, FormField } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import { uid, today, addDays } from "../helpers.js";
import { buildProductFollowUps } from "../followups.js";

// Etichette dei tipi di richiesta (dal finale della chat pubblica)
const KIND = {
  sumisura: "Su misura",
  perso:    "Personalizzazione",
  diretto:  "Diretto",
  ebay:     "eBay",
  richiesta:"Richiesta",
};

// Stati = etichette che Luca già usa su WhatsApp
const STATUS = {
  nuova: { label: "Nuova",          color: T.green, bg: T.greenS },
  presa: { label: "In lavorazione", color: T.amber, bg: T.amberS },
  chiusa:{ label: "Chiusa",         color: T.textD, bg: "rgba(90,111,148,0.08)" },
};

const fmtWhen = (iso) => {
  try { return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
};

const Richieste = () => {
  const { data, update, deleteRecord, addRecord } = useSliss();
  const items = data?.richieste || [];
  const aperte = items.filter(r => (r.status || "nuova") !== "chiusa");
  const chiuse = items.filter(r => (r.status || "nuova") === "chiusa");

  // Modal "crea ordine" (la sinergia: richiesta → ordine → follow-up)
  const [promo, setPromo] = useState(null);   // la richiesta in promozione
  const [pf, setPf] = useState({ product: "", phone: "", price: "", days: "7" });
  const [done, setDone] = useState(false);

  const openPromo = (r) => {
    setPromo(r);
    setPf({ product: r.product || r.desc || "", phone: "", price: "", days: "7" });
    setDone(false);
  };

  const handlePromote = () => {
    if (!promo || !pf.product.trim() || !pf.phone.trim()) return;
    // 1. Cliente (dalla richiesta + telefono che Luca ha da WhatsApp)
    const clientId = uid();
    addRecord("clients", {
      id: clientId, firstName: promo.nome || "", lastName: promo.cognome || "",
      name: `${promo.nome || ""} ${promo.cognome || ""}`.trim(),
      phone: pf.phone.trim(), email: "", channel: "WhatsApp", status: "new",
      tags: [], notes: "", firstVisit: today(), lastVisit: today(),
    });
    // 2. Ordine (prezzo e dettaglio nelle note: il modello ordine non ha un campo prezzo)
    const orderId = uid();
    const days = parseInt(pf.days) || 7;
    const deliveryDate = addDays(today(), days);
    const noteParts = [];
    if (pf.price.trim()) noteParts.push(`Prezzo: ${pf.price.trim()}\u{20AC}`);
    if (promo.desc && promo.desc !== pf.product.trim()) noteParts.push(promo.desc);
    addRecord("orders", {
      id: orderId, clientId, product: pf.product.trim(), orderDate: today(),
      deliveryDate, notes: noteParts.join(" \u{B7} "), status: "pending", created: today(),
    });
    // 3. I follow-up partono da soli (stesso motore di un ordine normale)
    buildProductFollowUps(orderId, clientId, promo.nome || "", today(), deliveryDate, data?.templates)
      .forEach(fu => addRecord("followUps", fu));
    // 4. La richiesta si chiude e ricorda l'ordine creato
    update("richieste", promo.id, { status: "chiusa", orderId });
    setDone(true);
  };

  const Riga = (r) => {
    const sKey = r.status || "nuova";
    const st = STATUS[sKey] || STATUS.nuova;
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
              <span style={{ fontSize: "11px", color: T.textMu }}>{KIND[r.kind] || "Richiesta"} {"\u{B7}"} {fmtWhen(r.created)}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
          {sKey !== "chiusa" && <Btn s="sm" onClick={() => openPromo(r)}><Icon name="package" size={15} />Crea ordine</Btn>}
          {sKey === "nuova" && <Btn s="sm" v="secondary" onClick={() => update("richieste", r.id, { status: "presa" })}>Presa in carico</Btn>}
          {sKey === "presa" && <Btn s="sm" v="secondary" onClick={() => update("richieste", r.id, { status: "chiusa" })}>Chiudi</Btn>}
          {sKey === "chiusa" && <Btn s="sm" v="secondary" onClick={() => update("richieste", r.id, { status: "presa" })}>Riapri</Btn>}
          <Btn s="sm" v="ghost" onClick={() => { if (window.confirm("Eliminare questa richiesta?")) deleteRecord("richieste", r.id); }}>Elimina</Btn>
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

      <Modal open={!!promo} onClose={() => setPromo(null)} title="Crea ordine dalla richiesta">
        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>{"\u{1F3C1}"}</div>
            <div style={{ fontWeight: 800, fontSize: "17px", marginBottom: "6px" }}>Ordine creato!</div>
            <div style={{ fontSize: "13px", color: T.textD, lineHeight: 1.6, marginBottom: "16px" }}>
              Ci pensa Sliss: i follow-up post-vendita partono da soli<br />(conferma {"\u{2192}"} spedizione {"\u{2192}"} consegna {"\u{2192}"} recensione).
            </div>
            <Btn onClick={() => setPromo(null)} style={{ width: "100%", justifyContent: "center" }}>Fatto</Btn>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "13px", color: T.textD, lineHeight: 1.6, marginBottom: "14px" }}>
              Accordati col cliente su WhatsApp, poi qui inserisci i dettagli. Da qui {"\u{2192}"} ordine + follow-up automatici.
            </div>
            <FormField label="Cliente"><input value={`${promo?.nome || ""} ${promo?.cognome || ""}`.trim()} disabled style={{ opacity: .7 }} /></FormField>
            <FormField label="Prodotto / Descrizione"><input value={pf.product} onChange={e => setPf(p => ({ ...p, product: e.target.value }))} placeholder="Es. Supporto stampa 3D personalizzato" /></FormField>
            <FormField label="WhatsApp cliente" hint="Il numero da cui ti ha scritto — serve per i follow-up"><input type="tel" inputMode="tel" value={pf.phone} onChange={e => setPf(p => ({ ...p, phone: e.target.value }))} placeholder="347 123 4567" /></FormField>
            <FormField label="Prezzo concordato (opzionale)"><input inputMode="decimal" value={pf.price} onChange={e => setPf(p => ({ ...p, price: e.target.value }))} placeholder="35" /></FormField>
            <FormField label="Pronto in (giorni)" hint="Usato per calcolare i follow-up post-consegna"><input type="number" min="1" max="365" value={pf.days} onChange={e => setPf(p => ({ ...p, days: e.target.value }))} /></FormField>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <Btn v="secondary" onClick={() => setPromo(null)}>Annulla</Btn>
              <Btn onClick={handlePromote} disabled={!pf.product.trim() || !pf.phone.trim()}>Crea ordine e avvia follow-up</Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Richieste;
