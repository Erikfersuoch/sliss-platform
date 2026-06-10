import { useState } from "react";
import T from "../theme.js";
import { uid, today, inviteWaLink, openSend, gcalLink } from "../helpers.js";
import { useSliss } from "../context.js";
import { Modal, Btn, FormField } from "./ui.jsx";

// Modale condiviso "Invita cliente": genera il link da mandare al cliente, che si compila da solo
// (nome, contatto) ed entra in anagrafica. Stesso flusso e backend di prima — usato sia da Agenda
// sia da Clienti. Si monta solo quando aperto, così lo stato si inizializza al mount: niente
// setState dentro useEffect (convenzione del progetto, cfr. lezioni bug).
const InviteClient = ({ onClose, initialDate }) => {
  const { data, addRecord } = useSliss();
  const [form, setForm] = useState({ date: initialDate || today(), phone: "" });
  const [done, setDone] = useState(false);
  const [link, setLink] = useState("");
  const handleCreate = () => {
    const slotId = uid();
    const owner = localStorage.getItem("sliss-tester") || "unknown";
    const biz = data.settings?.businessName || "Sliss";
    const svcType = "Consulenza";
    const lnk = `https://sliss-platform.vercel.app/onboarding.html?slot=${slotId}&date=${form.date}&biz=${encodeURIComponent(biz)}&o=${encodeURIComponent(owner)}&svc=${encodeURIComponent(svcType)}`;
    addRecord("slots", { id: slotId, date: form.date, serviceType: svcType, status: "waiting", created: today(), owner, link: lnk, phone: form.phone?.trim() || "" });
    setLink(lnk);
    setDone(true);
  };
  return (
    <Modal open onClose={onClose} title="Invita un cliente">
      {done
        ? <div>
            <p style={{ fontSize: "13px", color: T.textD, lineHeight: 1.6, marginBottom: "14px" }}>Mandalo al cliente su WhatsApp. Appena compila, lo trovi automaticamente tra i clienti.</p>
            <div style={{ padding: "12px 14px", background: T.bg3, borderRadius: T.r.m, border: `1px solid ${T.border}`, fontSize: "12px", wordBreak: "break-all", marginBottom: "14px", color: T.textM, lineHeight: 1.6 }}>{link}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Btn style={{ width: "100%", justifyContent: "center" }} onClick={() => openSend(inviteWaLink(form.phone, link, form.date))}>{"\u{1F4F2} Invia su WhatsApp"}</Btn>
              <Btn v="secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => window.open(gcalLink(form.date, "Consulenza nuovo cliente", form.phone ? `Tel: ${form.phone}` : ""), "_blank")}>{"\u{1F4C5} Aggiungi al calendario"}</Btn>
              <Btn v="ghost" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>Fatto</Btn>
            </div>
          </div>
        : <>
            <FormField label="Data della consulenza" hint="Sarà mostrata al cliente nel form"><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></FormField>
            <FormField label="WhatsApp cliente" hint="Facoltativo — se lo metti, il tasto apre direttamente la sua chat"><input type="tel" inputMode="tel" placeholder="347 123 4567" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></FormField>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}><Btn v="secondary" onClick={onClose}>Annulla</Btn><Btn onClick={handleCreate} disabled={!form.date}>Genera link</Btn></div>
          </>
      }
    </Modal>
  );
};

export default InviteClient;
