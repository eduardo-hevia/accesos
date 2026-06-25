// ── AccionistaSearch — Consulta de Accionista (rediseño) ─────────────────────
import { useState, useCallback } from "react";
import { useAccionista } from "../../application/hooks/index";
import { C, SectionHeader, BrandSpinner } from "../../ui/components/index";
import { PageHeader } from "../../ui/layout";
import { AccionistaResult } from "./components/ResultCards";
import type { Accionista, AuthSession } from "../../core/entities/index";

interface AccionistaSearchProps {
  session: AuthSession;
  onLogout: () => void;
}

// Caparazón de "potencial accionista" cuando el DPI no está en el sistema central.
// El backend completará estos datos a futuro.
function buildPotencial(dpi: string): Accionista {
  return {
    id: `pot-${dpi}`, dpi, registro: "—", nombre: "Posible Accionista",
    fechaNac: "—", estado: "Sin registro en sistema central", vence: "—",
    estadoCivil: "—", fecha: "—", correlativo: "1", genero: "—",
    acciones: "—", tipoAccion: "—", ultimaAsamblea: "—",
    avatarUrl: "", status: "potencial",
    promocionalEntregado: false, promocionalFecha: null, observaciones: "",
  };
}

export function AccionistaSearch({ session: _session, onLogout: _onLogout }: AccionistaSearchProps) {
  const [query, setQuery]       = useState("");
  const [dpiError, setDpiError] = useState("");
  const { state, buscar, reset } = useAccionista();

  const isLoading  = state.type === "loading";
  const isDpiValid = query.length === 13;

  const handleSearch = useCallback(async (dpi: string) => {
    if (isLoading) return; // evita consultas simultáneas
    const cleanDpi = dpi.replace(/\D/g, "");
    if (cleanDpi.length !== 13) {
      setDpiError("El DPI es obligatorio y debe contener exactamente 13 dígitos.");
      return;
    }
    setDpiError("");
    await buscar(cleanDpi);
  }, [buscar, isLoading]);

  const handleReset = () => {
    setQuery(""); setDpiError(""); reset();
  };

  return (
    <div style={{ fontFamily:"inherit", background:"var(--bt-bg-page)", minHeight:"calc(100vh - 68px)" }}>
      <PageHeader
        section="Accesos"
        title={<>Consulta de <span style={{ color: "var(--bt-action-primary)" }}>Accionista</span></>}
        actions={
          <button onClick={handleReset} style={{
            fontFamily:"inherit", fontSize:13, fontWeight:700,
            padding:"10px 20px", borderRadius:"var(--bt-radius-md)",
            background:"var(--bt-action-primary)", color:"#fff", border:"none",
            display:"flex", alignItems:"center", gap:8,
            boxShadow:"var(--bt-shadow-teal)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nueva Consulta
          </button>
        }
      />

      {/* Contenido */}
      <div style={{ padding:"32px 40px 56px", maxWidth:1180, margin:"0 auto" }}>

        {/* Tarjeta de búsqueda */}
        <div style={{ background:C.white, borderRadius:16, marginBottom:16,
          border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(10,22,40,0.06)",
          overflow:"hidden" }}>
          <SectionHeader title="Identificación del Accionista" />
          <div style={{ padding:"22px 26px" }}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1, position:"relative", display:"flex" }}>
                <input
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value.replace(/\D/g, "").slice(0, 13));
                    setDpiError("");
                  }}
                  onKeyDown={e => e.key === "Enter" && handleSearch(query)}
                  placeholder="Ingrese DPI de 13 dígitos"
                  aria-label="Buscar accionista"
                  inputMode="numeric"
                  maxLength={13}
                  disabled={isLoading}
                  style={{ flex:1, padding:"13px 44px 13px 16px", fontFamily:"inherit",
                    fontSize:16.5, fontWeight:600, letterSpacing:"0.02em",
                    border:`1px solid ${C.border}`,
                    borderRadius:10, background:C.white, color:C.g900, outline:"none",
                    opacity: isLoading ? 0.6 : 1,
                    boxShadow:"inset 0 1px 2px rgba(0,0,0,0.04)" }} />
                {query.length > 0 && !isLoading && (
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Limpiar"
                    title="Limpiar"
                    style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                      width:28, height:28, borderRadius:8, border:"none", cursor:"pointer",
                      background:C.g100, color:C.g500,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.6">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => handleSearch(query)}
                disabled={isLoading || !isDpiValid}
                style={{ fontFamily:"inherit", fontSize:15, fontWeight:700,
                  padding:"0 28px", borderRadius:10, border:"none",
                  background: isLoading || !isDpiValid ? C.g200 : C.teal,
                  color: isLoading || !isDpiValid ? C.g400 : "#fff",
                  cursor: isLoading || !isDpiValid ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", gap:8,
                  whiteSpace:"nowrap", transition:"background 0.2s",
                  boxShadow: isLoading || !isDpiValid ? "none" : `0 2px 6px ${C.teal}44` }}>
                {isLoading
                  ? <><BrandSpinner size={18}/> Consultando...</>
                  : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg> Consultar</>}
              </button>
            </div>
            <div style={{ fontSize:13.5, fontWeight:500, color:C.g500, marginTop:9 }}>
              El DPI es obligatorio y debe ingresarse sin espacios ni guiones.
            </div>
            {dpiError && (
              <div style={{ marginTop:9, fontSize:13.5, color:C.red, fontWeight:600 }}>
                {dpiError}
              </div>
            )}
          </div>
        </div>

        {/* Estado vacío */}
        {state.type === "idle" && (
          <div style={{ textAlign:"center", padding:"72px 24px",
            background:C.white, borderRadius:16, border:`1px solid ${C.border}`,
            boxShadow:"0 2px 8px rgba(10,22,40,0.06)" }}>
            <div style={{ fontSize:46, marginBottom:12, opacity:0.35 }}>🔎</div>
            <div style={{ fontSize:17, fontWeight:700, color:C.g500, marginBottom:7 }}>
              Listo para consultar
            </div>
            <div style={{ fontSize:14, fontWeight:500, color:C.g500, marginBottom:18 }}>
              Ingrese un DPI de 13 dígitos para iniciar la consulta.
            </div>
            <div style={{ display:"inline-flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
              {[
                { dpi:"2265780540101", label:"Actualizado" },
                { dpi:"1234567890101", label:"Desactualizado" },
                { dpi:"9999999999999", label:"Potencial" },
              ].map(ej => (
                <button key={ej.dpi} onClick={() => { setQuery(ej.dpi); handleSearch(ej.dpi); }}
                  style={{ fontFamily:"inherit", fontSize:12.5, fontWeight:600,
                    padding:"8px 14px", borderRadius:999, cursor:"pointer",
                    border:`1px solid ${C.border}`, background:C.g50, color:C.g500 }}>
                  {ej.label}: <strong style={{ color:C.g700 }}>{ej.dpi}</strong>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cargando */}
        {state.type === "loading" && (
          <div style={{ textAlign:"center", padding:"64px 24px",
            background:C.white, borderRadius:16, border:`1px solid ${C.border}`,
            boxShadow:"0 2px 8px rgba(10,22,40,0.06)" }}>
            <BrandSpinner size={88} />
            <div style={{ fontSize:15.5, fontWeight:700, color:C.g600, marginTop:14 }}>
              Consultando accionista...
            </div>
            <div style={{ fontSize:13.5, color:C.g400, marginTop:4 }}>
              Buscando el DPI en el sistema central.
            </div>
          </div>
        )}

        {/* Error */}
        {state.type === "error" && (
          <div style={{ padding:"20px 24px", background:C.redLt,
            border:`1px solid #FCA5A5`, borderRadius:16,
            color:C.red, fontSize:15, fontWeight:500 }}>
            ⚠ {state.message}
          </div>
        )}

        {/* Resultado */}
        {state.type === "found" && (
          <AccionistaResult key={state.data.dpi} data={state.data} />
        )}
        {state.type === "not_found" && (
          <AccionistaResult key={state.dpi} data={buildPotencial(state.dpi)} />
        )}
      </div>
    </div>
  );
}
