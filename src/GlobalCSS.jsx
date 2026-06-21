import T from "./theme.js";

const GlobalCSS = () => <style>{`
  *{margin:0;padding:0;box-sizing:border-box;font-family:'DM Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;overflow-wrap:break-word}
  html{background:${T.bg}}
  html,body,#root{color:${T.text};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh}
  body{background:var(--c-shell,#F8F9FA)}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
  input,textarea,select{font-family:inherit;background:${T.bg2};border:1.5px solid ${T.border};color:${T.text};border-radius:10px;padding:12px 14px;font-size:15px;outline:none;transition:border-color .2s;width:100%;min-width:0}
  input[type="date"],input[type="time"]{-webkit-appearance:none;appearance:none}
  input:focus,textarea:focus,select:focus{border-color:${T.green};box-shadow:0 0 0 3px rgba(22,163,74,0.12)}
  textarea{resize:vertical;min-height:80px;line-height:1.6}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23495057' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}
  button{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
  a{-webkit-tap-highlight-color:transparent}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @media(max-width:768px){
    .desktop-only{display:none!important}
  }
  @media(min-width:769px){
    .mobile-only{display:none!important}
  }
  ::placeholder{color:${T.textMu};opacity:1}
  button:focus-visible,[role="button"]:focus-visible,a:focus-visible{outline:2px solid ${T.green};outline-offset:2px;border-radius:6px}
  .app-main{flex:1;width:100%;max-width:680px;margin:0 auto;padding:24px 20px;padding-bottom:calc(80px + env(safe-area-inset-bottom))}
  @media(min-width:769px){.app-main{max-width:1040px;margin:0 0 0 210px;padding:28px 36px}}
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`}</style>;

export default GlobalCSS;
