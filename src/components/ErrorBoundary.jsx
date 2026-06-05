import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = {hasError:false,msg:"",stack:""}; }
  static getDerivedStateFromError(e) { return {hasError:true,msg:e?.message||String(e)}; }
  componentDidCatch(e,info) {
    console.error("[Sliss] Crash:", e, info?.componentStack);
    this.setState({stack:info?.componentStack||""});
  }
  handleReset() {
    try { Object.keys(localStorage).filter(k=>k.startsWith("sliss")).forEach(k=>localStorage.removeItem(k)); } catch(_) {}
    window.location.reload();
  }
  render() {
    if(this.state.hasError) return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F8F9FA",padding:"20px",fontFamily:"sans-serif"}}>
        <div style={{textAlign:"center",maxWidth:"480px"}}>
          <div style={{fontSize:"44px",marginBottom:"16px"}}>⚠️</div>
          <h2 style={{fontSize:"18px",fontWeight:700,marginBottom:"8px",color:"#111318"}}>Qualcosa è andato storto</h2>
          <p style={{fontSize:"14px",color:"#868E96",lineHeight:1.6,marginBottom:"8px"}}>L'app ha incontrato un errore. Prova prima a ricaricare; se non basta, usa il reset completo.</p>
          {this.state.msg&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:"8px",padding:"10px 14px",marginBottom:"8px",fontSize:"12px",color:"#DC2626",fontFamily:"monospace",textAlign:"left",wordBreak:"break-all"}}>{this.state.msg}</div>}
          {this.state.stack&&<details style={{marginBottom:"16px",textAlign:"left"}}><summary style={{fontSize:"12px",color:"#868E96",cursor:"pointer"}}>Dettaglio tecnico</summary><div style={{background:"#F1F3F5",borderRadius:"6px",padding:"8px 10px",marginTop:"6px",fontSize:"11px",color:"#495057",fontFamily:"monospace",whiteSpace:"pre-wrap",wordBreak:"break-all",maxHeight:"150px",overflow:"auto"}}>{this.state.stack}</div></details>}
          <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>window.location.reload()} style={{padding:"12px 20px",background:"#16A34A",color:"#fff",border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>🔄 Ricarica</button>
            <button onClick={()=>this.handleReset()} style={{padding:"12px 20px",background:"#DC2626",color:"#fff",border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>🗑️ Reset e ricomincia</button>
          </div>
        </div>
      </div>
    );
    return this.props.children;
  }
}

export default ErrorBoundary;
