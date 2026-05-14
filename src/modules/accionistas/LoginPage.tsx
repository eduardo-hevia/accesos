// ── Login Page ────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Btn, C, Spinner } from "../../ui/components/index";
import { USE_MOCK } from "../../infrastructure/ServiceFactory";

interface LoginPageProps {
  onLogin: (usuario: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function LoginPage({ onLogin, loading, error }: LoginPageProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!usuario || !password) return;
    await onLogin(usuario, password);
  };

  const iS = {
    width:"100%", padding:"12px 16px", fontFamily:"inherit",
    fontSize:14, fontWeight:500,
    border:`1px solid ${C.border}`, borderRadius:10,
    background:C.g50, color:C.g900, outline:"none",
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(145deg,${C.tealLt},#f8fafc 60%,#fff)`,
      display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>

      <div style={{ width:"100%", maxWidth:420 }}>
        {/* Logo / Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:56, height:56, background:C.teal, borderRadius:14,
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 16px", fontSize:28, boxShadow:`0 8px 24px ${C.teal}44` }}>
            🏦
          </div>
          <div style={{ fontSize:10, color:C.g400, letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:6 }}>BANTRAB · Sistema de Accionistas</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:C.g900, lineHeight:1 }}>
            Módulo de <span style={{ color:C.gold }}>Asambleas</span>
          </h1>
        </div>

        {/* Card */}
        <div style={{ background:C.white, borderRadius:16, padding:"32px 28px",
          boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:`1px solid ${C.border}` }}>

          <div style={{ fontSize:13, fontWeight:700, color:C.g700, marginBottom:20 }}>
            Iniciar Sesión
          </div>

          {/* Mode badge */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20,
            padding:"8px 12px", background: USE_MOCK ? "#FEF3DC" : C.tealLt,
            borderRadius:8, fontSize:11, color: USE_MOCK ? "#78350F" : C.tealDk, fontWeight:600 }}>
            <span>{USE_MOCK ? "⚙️" : "🌐"}</span>
            {USE_MOCK
              ? "Modo Mock — sin conexión al backend"
              : "Modo Real — conectado al backend"}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600,
                textTransform:"uppercase", letterSpacing:"0.08em" }}>Usuario</label>
              <input value={usuario} onChange={e=>setUsuario(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                placeholder="supervisor" style={iS} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600,
                textTransform:"uppercase", letterSpacing:"0.08em" }}>Contraseña</label>
              <input type="password" value={password}
                onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                placeholder="••••" style={iS} />
            </div>

            {error && (
              <div style={{ padding:"10px 14px", background:C.redLt, border:`1px solid #FCA5A5`,
                borderRadius:8, fontSize:12, color:C.red, fontWeight:500 }}>
                ⚠ {error}
              </div>
            )}

            <Btn variant="primary" onClick={handleSubmit}
              disabled={loading || !usuario || !password}
              style={{ width:"100%", justifyContent:"center", padding:"12px 20px", fontSize:14, marginTop:4 }}>
              {loading ? <><Spinner size={15}/> Verificando...</> : "Ingresar al sistema"}
            </Btn>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop:20, padding:"12px 14px", background:C.g50,
            borderRadius:8, fontSize:11, color:C.g500 }}>
            <strong style={{ color:C.g700 }}>Demo:</strong>&nbsp;
            supervisor / 1234 &nbsp;·&nbsp; admin / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
