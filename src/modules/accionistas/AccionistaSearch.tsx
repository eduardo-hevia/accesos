// ── AccionistaSearch — Main Page ──────────────────────────────────────────────
import { useState, useCallback } from "react";
import { useAccionista, useProspecto } from "../../application/hooks/index";
import { Btn, C, SectionHeader, Spinner, Tag } from "../../ui/components/index";
import { CardActualizado, CardDesactualizado, CardPotencial } from "./components/ResultCards";
import { USE_MOCK } from "../../infrastructure/ServiceFactory";
import type { AuthSession } from "../../core/entities/index";

const DEMO_DPIS = {
  actualizado:    "2265780540101",
  desactualizado: "1234567890101",
  potencial:      "9876543210101",
} as const;

interface AccionistaSearchProps {
  session: AuthSession;
  onLogout: () => void;
}

export function AccionistaSearch({ session, onLogout }: AccionistaSearchProps) {
  const [query, setQuery]     = useState("");
  const [activePill, setActivePill] = useState<string>("");
  const [promoChecked, setPromoChecked] = useState(false);
  const [promoSaved, setPromoSaved]     = useState(false);

  const {
    state, buscar, reset,
    registrarPromocional, promoLoading, promoError,
  } = useAccionista();

  const { loading: prospectoSaving, saved: prospectoSaved,
          error: prospectoError, crear: crearProspecto, resetProspecto } = useProspecto();

  // ─── Search ───────────────────────────────────────────────────────────────
  const handleSearch = useCallback(async (dpi: string) => {
    if (!dpi.trim()) return;
    setPromoChecked(false);
    setPromoSaved(false);
    resetProspecto();
    await buscar(dpi.trim());
  }, [buscar, resetProspecto]);

  const handleDemoClick = (dpi: string) => {
    setQuery(dpi);
    setActivePill(dpi);
    handleSearch(dpi);
  };

  const handleReset = () => {
    setQuery(""); setActivePill(""); setPromoChecked(false); setPromoSaved(false);
    reset(); resetProspecto();
  };

  // ─── Promo ────────────────────────────────────────────────────────────────
  const handlePromoToggle = () => {
    if (!promoSaved) setPromoChecked(p => !p);
  };

  const handlePromoSave = async () => {
    if (state.type !== "found") return;
    const ok = await registrarPromocional(state.data.dpi, true);
    if (ok) { setPromoChecked(true); setPromoSaved(true); }
  };

  // ─── Prospecto ────────────────────────────────────────────────────────────
  const handleProspectoSave = useCallback(async (formData: Record<string, string>) => {
    return crearProspecto({
      dpiConsultado:    formData["dpiConsultado"] ?? "",
      nombre:           formData["nombre"] ?? "",
      telefono:         formData["telefono"] ?? "",
      email:            formData["email"] ?? "",
      tipoRelacion:     formData["tipoRelacion"] ?? "",
      esClienteBantrab: formData["esClienteBantrab"] ?? "",
      accionesPrevias:  formData["accionesPrevias"] ?? "",
      fuenteReferencia: formData["fuenteReferencia"] ?? "",
      observaciones:    formData["observaciones"] ?? "",
    });
  }, [crearProspecto]);

  // ─── Render ───────────────────────────────────────────────────────────────
  const isLoading = state.type === "loading";

  const promoProps = {
    promoChecked, promoSaved,
    promoLoading, promoError,
    onPromoToggle: handlePromoToggle,
    onPromoSave:   handlePromoSave,
  };

  return (
    <div style={{ fontFamily:"inherit", background:C.bg, minHeight:"100vh" }}>

      {/* Demo bar */}
      <div style={{ background:C.g900, padding:"9px 40px",
        display:"flex", alignItems:"center", gap:14, fontSize:11 }}>
        <span style={{ color:C.teal, fontWeight:700, letterSpacing:"0.06em" }}>DEMO</span>
        <span style={{ color:C.g500 }}>Escenario:</span>
        <div style={{ display:"flex", gap:7 }}>
          {Object.entries(DEMO_DPIS).map(([label, dpi]) => (
            <button key={dpi} onClick={() => handleDemoClick(dpi)} style={{
              fontFamily:"inherit", fontSize:10, fontWeight:600,
              padding:"4px 13px", borderRadius:999,
              border:`1px solid ${activePill===dpi ? C.teal : "rgba(255,255,255,0.18)"}`,
              background: activePill===dpi ? C.teal : "rgba(255,255,255,0.06)",
              color:"#fff", cursor:"pointer", letterSpacing:"0.04em",
              textTransform:"uppercase" as const, transition:"all 0.18s" }}>
              {label === "actualizado" ? "✓ Actualizado"
               : label === "desactualizado" ? "⚠ Desactualizado"
               : "◎ Potencial"}
            </button>
          ))}
        </div>
        {/* Mode indicator */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8,
          fontSize:10, color: USE_MOCK ? "#FCD34D" : C.teal, fontWeight:600 }}>
          {USE_MOCK ? "⚙ MOCK MODE" : "🌐 REAL API"}
        </div>
      </div>

      {/* Page header */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`,
        padding:"20px 40px 18px" }}>
        <div style={{ maxWidth:1060, margin:"0 auto" }}>
          <div style={{ fontSize:10, color:C.g400, letterSpacing:"0.1em",
            textTransform:"uppercase" as const, marginBottom:4 }}>
            Maestros de Asambleas · BANTRAB
          </div>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            <div>
              <h1 style={{ fontSize:26, fontWeight:700, color:C.g900, lineHeight:1.1, marginBottom:4 }}>
                Consulta de Accionistas
              </h1>
              <div style={{ fontSize:12, color:C.g400, marginBottom:10 }}>
                Módulo de identificación · 3 flujos de clasificación · Sin eliminación física
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Tag>ACCFRM0803</Tag>
                <Tag bg={C.g100} color={C.g500}>HU-61389</Tag>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontSize:12, color:C.g500 }}>
                {session.usuario} <span style={{ color:C.g400 }}>({session.rol})</span>
              </span>
              <button onClick={onLogout} style={{
                fontFamily:"inherit", fontSize:12, fontWeight:600,
                padding:"8px 16px", borderRadius:8,
                border:`1px solid ${C.border}`, background:C.white,
                color:C.g600, cursor:"pointer" }}>
                Cerrar sesión
              </button>
              <button onClick={handleReset} style={{
                fontFamily:"inherit", fontSize:13, fontWeight:600,
                padding:"10px 20px", borderRadius:8,
                background:C.teal, color:"#fff", border:"none",
                cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                boxShadow:`0 2px 8px ${C.teal}44` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nueva Consulta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding:"28px 40px", maxWidth:1060, margin:"0 auto" }}>

        {/* Search card */}
        <div style={{ background:C.white, borderRadius:10, marginBottom:20,
          border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
          overflow:"hidden" }}>
          <SectionHeader title="Identificación del Accionista" />
          <div style={{ padding:"18px 24px" }}>
            <div style={{ display:"flex", gap:10 }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleSearch(query)}
                placeholder="Ingrese DPI (13 dígitos) o código de accionista..."
                aria-label="Buscar accionista"
                style={{ flex:1, padding:"11px 16px", fontFamily:"inherit",
                  fontSize:14, fontWeight:500, border:`1px solid ${C.border}`,
                  borderRadius:8, background:C.white, color:C.g900, outline:"none",
                  boxShadow:"inset 0 1px 2px rgba(0,0,0,0.04)" }} />
              <button
                onClick={() => handleSearch(query)}
                disabled={isLoading || !query.trim()}
                style={{ fontFamily:"inherit", fontSize:13, fontWeight:600,
                  padding:"0 24px", borderRadius:8, border:"none",
                  background: isLoading||!query.trim() ? C.g200 : C.teal,
                  color: isLoading||!query.trim() ? C.g400 : "#fff",
                  cursor: isLoading||!query.trim() ? "not-allowed":"pointer",
                  display:"flex", alignItems:"center", gap:8,
                  whiteSpace:"nowrap" as const, transition:"background 0.2s",
                  boxShadow: isLoading||!query.trim() ? "none" : `0 2px 6px ${C.teal}44` }}>
                {isLoading
                  ? <><Spinner size={15} color={C.g400}/> Consultando...</>
                  : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg> Consultar</>}
              </button>
            </div>
            <div style={{ fontSize:11, color:C.g400, marginTop:8 }}>
              💡 También puede ingresar el código de accionista (ej. ACC-005821)
            </div>
          </div>
        </div>

        {/* Empty state */}
        {state.type === "idle" && (
          <div style={{ textAlign:"center", padding:"72px 0",
            background:C.white, borderRadius:10, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:44, marginBottom:12, opacity:0.35 }}>🔎</div>
            <div style={{ fontSize:15, fontWeight:600, color:C.g500, marginBottom:6 }}>
              Listo para consultar
            </div>
            <div style={{ fontSize:12, color:C.g400 }}>
              Ingrese un DPI o use los accesos rápidos de la barra DEMO
            </div>
          </div>
        )}

        {/* Error */}
        {state.type === "error" && (
          <div style={{ padding:"20px 24px", background:C.redLt,
            border:`1px solid #FCA5A5`, borderRadius:10,
            color:C.red, fontSize:14, fontWeight:500 }}>
            ⚠ {state.message}
          </div>
        )}

        {/* Results */}
        {state.type === "found" && state.data.status === "actualizado" && (
          <CardActualizado data={state.data} {...promoProps} />
        )}
        {state.type === "found" && state.data.status === "desactualizado" && (
          <CardDesactualizado data={state.data} {...promoProps} />
        )}
        {state.type === "not_found" && (
          <CardPotencial
            dpi={state.dpi}
            onSave={handleProspectoSave}
            saving={prospectoSaving}
            saved={!!prospectoSaved}
            saveError={prospectoError}
          />
        )}
      </div>
    </div>
  );
}
