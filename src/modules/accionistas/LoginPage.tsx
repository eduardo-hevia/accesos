// ── Login Page ────────────────────────────────────────────────────────────────
import { useState } from "react";
import { BantrabImagotypePng, BantrabLogoText } from "@bantrab/ui";
import { Btn, C, Spinner } from "../../ui/components/index";

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
    <div style={{ minHeight:"100vh", background:"var(--bt-bg-page)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>

      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ height:58, display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
            <BantrabImagotypePng style={{ height:46, width:"auto" }} />
            <span style={{ width:118, height:48, position:"relative", overflow:"hidden", display:"inline-block" }}>
              <BantrabLogoText style={{ position:"absolute", width:148, height:148, maxWidth:"none", left:-17, top:-78 }} />
            </span>
          </div>
          <div style={{ fontSize:10, color:C.g400, letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:6 }}>Sistema de Accesos</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:C.g900, lineHeight:1 }}>
            Gestión de <span style={{ color:"var(--bt-action-primary)" }}>Accionistas</span>
          </h1>
        </div>

        <div style={{ background:C.white, borderRadius:16, padding:"32px 28px",
          boxShadow:"var(--bt-shadow-md)", border:"1px solid var(--bt-border)" }}>

          <div style={{ fontSize:13, fontWeight:700, color:C.g700, marginBottom:20 }}>
            Iniciar Sesión
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

          <div style={{ marginTop:20, padding:"12px 14px", background:C.g50,
            borderRadius:8, fontSize:11, color:C.g500 }}>
            Ingrese con el usuario autorizado para administrar accesos.
          </div>
        </div>
      </div>
    </div>
  );
}
