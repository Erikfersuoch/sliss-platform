import { useState } from "react";
import T from "../theme.js";
import { Btn } from "./ui.jsx";

// Vista mese read-only degli appuntamenti Sliss. Non legge Google (sync vera = Fase 3):
// mostra solo gli appuntamenti creati in Sliss + un ponte "Apri Google Calendar a quel giorno".
const WD = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTHS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const ymd = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export default function MonthCalendar({ appointments, clients }) {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selDay, setSelDay] = useState(null);
  const todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());

  const byDay = {};
  (appointments || []).forEach(a => { if (a.date) (byDay[a.date] = byDay[a.date] || []).push(a); });

  const firstDow = (new Date(ym.y, ym.m, 1).getDay() + 6) % 7; // settimana Lun→Dom
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => { setSelDay(null); setYm(p => p.m === 0 ? { y: p.y - 1, m: 11 } : { y: p.y, m: p.m - 1 }); };
  const next = () => { setSelDay(null); setYm(p => p.m === 11 ? { y: p.y + 1, m: 0 } : { y: p.y, m: p.m + 1 }); };
  const goToday = () => { setSelDay(null); setYm({ y: now.getFullYear(), m: now.getMonth() }); };

  const nameOf = id => (clients || []).find(c => c.id === id)?.name || "—";
  const openGoogleDay = day => { const dt = new Date(day); window.open(`https://calendar.google.com/calendar/r/day/${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`, "_blank"); };
  const selAppts = selDay ? (byDay[selDay] || []) : [];

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <button onClick={prev} aria-label="Mese precedente" style={{ background: T.bg3, border: `1px solid ${T.border}`, borderRadius: T.r.m, width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", color: T.textM, fontFamily: "inherit" }}>{"‹"}</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>{MONTHS[ym.m]} {ym.y}</div>
          <button onClick={goToday} style={{ background: "none", border: "none", color: T.green, fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "2px 0" }}>Oggi</button>
        </div>
        <button onClick={next} aria-label="Mese successivo" style={{ background: T.bg3, border: `1px solid ${T.border}`, borderRadius: T.r.m, width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", color: T.textM, fontFamily: "inherit" }}>{"›"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "4px" }}>
        {WD.map(w => <div key={w} style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: T.textMu, padding: "4px 0" }}>{w}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const ds = ymd(ym.y, ym.m, d);
          const appts = byDay[ds] || [];
          const isToday = ds === todayStr;
          const isSel = ds === selDay;
          return (
            <button key={ds} onClick={() => setSelDay(isSel ? null : ds)} style={{
              aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
              border: isSel ? `1.5px solid ${T.green}` : isToday ? `1.5px solid ${T.amber}` : `1px solid ${T.border}`,
              background: isSel ? T.greenS : appts.length ? T.greenS : T.bg2, borderRadius: T.r.m, cursor: "pointer", fontFamily: "inherit", padding: "2px",
            }}>
              <span style={{ fontSize: "13px", fontWeight: isToday ? 700 : 500, color: isToday ? T.amberD : T.text }}>{d}</span>
              {appts.length > 0 && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.green }} />}
            </button>
          );
        })}
      </div>

      {selDay && (
        <div style={{ marginTop: "16px", padding: "14px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: T.r.l, animation: "fadeIn .25s ease" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>{new Date(selDay).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</div>
          {selAppts.length === 0
            ? <p style={{ fontSize: "13px", color: T.textD, marginBottom: "12px" }}>Nessun appuntamento Sliss in questo giorno.</p>
            : <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>{selAppts.map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: T.bg3, borderRadius: T.r.m }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.green, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nameOf(a.clientId)}</div><div style={{ fontSize: "11px", color: T.textD }}>{a.serviceType || "Appuntamento"}</div></div>
                </div>
              ))}</div>}
          <Btn v="secondary" s="sm" onClick={() => openGoogleDay(selDay)} style={{ width: "100%", justifyContent: "center" }}>{"\u{1F4C5}"} Apri su Google Calendar</Btn>
        </div>
      )}
      <p style={{ fontSize: "11px", color: T.textMu, marginTop: "14px", lineHeight: 1.5, textAlign: "center" }}>Mostra gli appuntamenti creati in Sliss. Per modificarli usa Google Calendar.</p>
    </div>
  );
}
