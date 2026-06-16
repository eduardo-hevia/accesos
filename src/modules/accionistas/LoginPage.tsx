// ── Login Page ────────────────────────────────────────────────────────────────
import { useState } from "react";
import { BantrabImagotypePng, BantrabLogoText } from "@bantrab/ui";
import type { ThemeName } from "@bantrab/ui";
import { Btn, C, Spinner } from "../../ui/components/index";

interface LoginPageProps {
  onLogin: (usuario: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  theme: ThemeName;
  onToggleTheme: () => void;
}

export function LoginPage({ onLogin, loading, error, theme, onToggleTheme }: LoginPageProps) {
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
  const themeLabel = theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";

  return (
    <div style={{ minHeight:"100vh", background:"var(--bt-bg-page)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative" }}>
      <style>{`
        [data-theme='dark'] .bt-login__brand-text,
        html[data-darkreader-mode] .bt-login__brand-text,
        html[data-darkreader-scheme] .bt-login__brand-text {
          filter: brightness(0) invert(1) !important;
        }
      `}</style>
      <button
        type="button"
        onClick={onToggleTheme}
        title={themeLabel}
        aria-label={themeLabel}
        style={{
          position:"absolute", top:24, right:24,
          width:38, height:38, borderRadius:8,
          border:"1px solid var(--bt-border-mid)",
          background:"var(--bt-bg-surface)",
          color:"var(--bt-text-primary)",
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          boxShadow:"var(--bt-shadow-xs)",
          transition:"border-color var(--bt-transition-fast), background var(--bt-transition-fast), transform var(--bt-transition-fast)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "var(--bt-action-primary)";
          e.currentTarget.style.background = "rgba(24, 179, 179, 0.08)";
          e.currentTarget.style.transform = "scale(1.04)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--bt-border-mid)";
          e.currentTarget.style.background = "var(--bt-bg-surface)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {theme === "light" ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        )}
      </button>

      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ height:58, display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
            <BantrabImagotypePng style={{ height:46, width:"auto" }} />
            <span style={{ width:118, height:48, position:"relative", overflow:"hidden", display:"inline-block" }}>
              <BantrabLogoText className="bt-login__brand-text" data-darkreader-ignore style={{
                position:"absolute", width:148, height:148, maxWidth:"none", left:-17, top:-78,
              }} />
            </span>
          </div>
          <div style={{ fontSize:10, color:"var(--bt-text-muted)", letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:6 }}>Sistema de Accesos</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"var(--bt-text-primary)", lineHeight:1 }}>
            Gestión de <span style={{ color:"var(--bt-action-primary)" }}>Accionistas</span>
          </h1>
        </div>

        <div style={{ background:"var(--bt-bg-surface)", borderRadius:16, padding:"32px 28px",
          boxShadow:"var(--bt-shadow-md)", border:"1px solid var(--bt-border)" }}>

          <div style={{ fontSize:13, fontWeight:700, color:"var(--bt-text-primary)", marginBottom:20 }}>
            Iniciar Sesión
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"var(--bt-text-secondary)",
                textTransform:"uppercase", letterSpacing:"0.08em" }}>Usuario</label>
              <input value={usuario} onChange={e=>setUsuario(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                style={iS} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"var(--bt-text-secondary)",
                textTransform:"uppercase", letterSpacing:"0.08em" }}>Contraseña</label>
              <input type="password" value={password}
                onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                style={iS} />
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

          <div style={{ marginTop:20, padding:"12px 14px", background:"var(--bt-bg-alt)",
            borderRadius:8, fontSize:11, color:"var(--bt-text-secondary)" }}>
            Ingrese con el usuario autorizado para administrar accesos.
          </div>
        </div>
      </div>
    </div>
  );
}
