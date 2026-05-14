// ── App Root — with module navigation ────────────────────────────────────────
import { useState } from "react";
import { useAuth } from "./application/hooks/index";
import { LoginPage } from "./modules/accionistas/LoginPage";
import { AccionistaSearch } from "./modules/accionistas/AccionistaSearch";
import { CasosEspecialesPage } from "./modules/accionistas/CasosEspecialesPage";

type ActiveModule = "consulta" | "casos";

export default function App() {
  const { session, loading, error, login, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>("casos");

  if (!session) {
    return <LoginPage onLogin={login} loading={loading} error={error} />;
  }

  return (
    <div>
      {/* ── Module nav bar ─────────────────────────────────────────────────── */}
      <div style={{
        background:"#0F172A", padding:"8px 40px",
        display:"flex", alignItems:"center", gap:8,
      }}>
        <span style={{ color:"#2BAB8E", fontSize:11, fontWeight:700, letterSpacing:"0.06em", marginRight:12 }}>
          BANTRAB
        </span>
        {([
          ["casos",   "Casos Especiales"],
          ["consulta","Consulta Accionistas"],
        ] as [ActiveModule, string][]).map(([mod, label]) => (
          <button key={mod} onClick={() => setActiveModule(mod)} style={{
            fontFamily:"inherit", fontSize:11, fontWeight:600,
            padding:"5px 14px", borderRadius:999, border:"none",
            background: activeModule === mod ? "#2BAB8E" : "rgba(255,255,255,0.08)",
            color:"#fff", cursor:"pointer", letterSpacing:"0.03em",
            transition:"background 0.18s",
          }}>{label}</button>
        ))}
      </div>

      {/* ── Active module ─────────────────────────────────────────────────── */}
      {activeModule === "consulta" && (
        <AccionistaSearch session={session} onLogout={logout} />
      )}
      {activeModule === "casos" && (
        <CasosEspecialesPage session={session} onLogout={logout} />
      )}
    </div>
  );
}
