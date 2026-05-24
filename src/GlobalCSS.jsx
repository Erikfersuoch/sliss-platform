const GlobalCSS = () => <style>{`
  *{margin:0;padding:0;box-sizing:border-box;font-family:'DM Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif}
  html,body,#root{background:#F8F9FA;color:#111318;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#DEE2E6;border-radius:3px}
  input,textarea,select{font-family:inherit;background:#FFFFFF;border:1.5px solid #DEE2E6;color:#111318;border-radius:10px;padding:12px 14px;font-size:15px;outline:none;transition:border-color .2s;width:100%}
  input:focus,textarea:focus,select:focus{border-color:#16A34A;box-shadow:0 0 0 3px rgba(22,163,74,0.12)}
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
`}</style>;

export default GlobalCSS;
