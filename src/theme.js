// Token colore come VARIABILI CSS (--c-*), con fallback = valore tema chiaro.
// I due set (chiaro/scuro) sono definiti in index.html così sono disponibili
// PRIMA del render (niente flash). I componenti continuano a usare T.bg, T.green…:
// cambia solo QUALE set è attivo (attributo data-theme su <html>). Niente da
// toccare nelle pagine. I raggi (r) restano statici.
const T = {
  bg:  "var(--c-bg,#F8F9FA)",
  bg2: "var(--c-bg2,#FFFFFF)",
  bg3: "var(--c-bg3,#F1F3F5)",
  bg4: "var(--c-bg4,#E9ECEF)",
  border:  "var(--c-border,#DEE2E6)", borderH: "var(--c-borderH,#ADB5BD)",
  text:  "var(--c-text,#111318)",
  textM: "var(--c-textM,#495057)",
  textD: "var(--c-textD,#5C636A)",
  textMu:"var(--c-textMu,#6C757D)",
  green:  "var(--c-green,#16A34A)", greenH: "var(--c-greenH,#15803D)",
  greenS: "var(--c-greenS,rgba(22,163,74,0.10))", greenG: "var(--c-greenG,rgba(22,163,74,0.18))",
  onGreen:"var(--c-onGreen,#FFFFFF)",
  blue:   "var(--c-blue,#2563EB)", blueH: "var(--c-blueH,#1D4ED8)", blueS: "var(--c-blueS,rgba(37,99,235,0.10))",
  amber:  "var(--c-amber,#D97706)", amberD: "var(--c-amberD,#B45309)", amberS: "var(--c-amberS,rgba(217,119,6,0.10))",
  red:    "var(--c-red,#DC2626)", redS:   "var(--c-redS,rgba(220,38,38,0.10))",
  purple: "var(--c-purple,#7C3AED)", purpleS:"var(--c-purpleS,rgba(124,58,237,0.10))",
  teal:   "var(--c-teal,#0D9488)", tealD: "var(--c-tealD,#0F766E)", tealS:  "var(--c-tealS,rgba(13,148,136,0.10))",
  r: { s: "6px", m: "10px", l: "14px", xl: "20px", full: "9999px" },
};

export default T;
