// ── AccionistaSearch — Main Page ──────────────────────────────────────────────
import { useState, useCallback } from "react";
import { useAccionista, useProspecto } from "../../application/hooks/index";
import { C, SectionHeader, Spinner } from "../../ui/components/index";
import { HeaderStatCard, IcoBan, IcoCheck, IcoUsers, PageHeader } from "../../ui/layout";
import { CardActualizado, CardDesactualizado, CardPotencial } from "./components/ResultCards";
import type { AuthSession } from "../../core/entities/index";

interface AccionistaSearchProps {
  session: AuthSession;
  onLogout: () => void;
}

export function AccionistaSearch({ session, onLogout }: AccionistaSearchProps) {
  const [query, setQuery]     = useState("");
  const [dpiError, setDpiError] = useState("");
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
    const cleanDpi = dpi.replace(/\D/g, "");
    if (cleanDpi.length !== 13) {
      setDpiError("El DPI es obligatorio y debe contener exactamente 13 dígitos.");
      return;
    }
    setDpiError("");
    setPromoChecked(false);
    setPromoSaved(false);
    resetProspecto();
    await buscar(cleanDpi);
  }, [buscar, resetProspecto]);

  const handleReset = () => {
    setQuery(""); setDpiError(""); setPromoChecked(false); setPromoSaved(false);
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
  const isDpiValid = query.length === 13;

  const promoProps = {
    promoChecked, promoSaved,
    promoLoading, promoError,
    onPromoToggle: handlePromoToggle,
    onPromoSave:   handlePromoSave,
  };

  return (
    <div style={{ fontFamily:"inherit", background:"var(--bt-bg-page)", minHeight:"calc(100vh - 68px)" }}>
      <PageHeader
        section="Accionistas"
        title={<>Consulta de <span style={{ color: "var(--bt-action-primary)" }}>Accionistas</span></>}
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
        stats={
          <>
            <HeaderStatCard
              value={state.type === "found" && state.data.status === "actualizado" ? 1 : 0}
              label="Actualizados"
              accent="var(--bt-action-primary)"
              icon={<IcoCheck color="var(--bt-action-primary)" />}
            />
            <HeaderStatCard
              value={state.type === "found" && state.data.status === "desactualizado" ? 1 : 0}
              label="Desactualizados"
              accent="var(--bt-status-warning)"
              icon={<IcoBan color="var(--bt-status-warning)" />}
            />
            <HeaderStatCard
              value={state.type === "not_found" ? 1 : 0}
              label="Potenciales"
              accent="var(--bt-status-info)"
              icon={<IcoUsers color="var(--bt-status-info)" />}
            />
          </>
        }
      />

      {/* Main content */}
      <div style={{ padding:"28px 40px", maxWidth:1280, margin:"0 auto" }}>

        {/* Search card */}
        <div style={{ background:C.white, borderRadius:10, marginBottom:20,
          border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
          overflow:"hidden" }}>
          <SectionHeader title="Identificación del Accionista" />
          <div style={{ padding:"18px 24px" }}>
            <div style={{ display:"flex", gap:10 }}>
              <input
                value={query}
                onChange={e => {
                  setQuery(e.target.value.replace(/\D/g, "").slice(0, 13));
                  setDpiError("");
                }}
                onKeyDown={e => e.key==="Enter" && handleSearch(query)}
                placeholder="Ingrese DPI de 13 dígitos"
                aria-label="Buscar accionista"
                inputMode="numeric"
                maxLength={13}
                style={{ flex:1, padding:"11px 16px", fontFamily:"inherit",
                  fontSize:14, fontWeight:500, border:`1px solid ${C.border}`,
                  borderRadius:8, background:C.white, color:C.g900, outline:"none",
                  boxShadow:"inset 0 1px 2px rgba(0,0,0,0.04)" }} />
              <button
                onClick={() => handleSearch(query)}
                disabled={isLoading || query.length !== 13}
                style={{ fontFamily:"inherit", fontSize:13, fontWeight:600,
                  padding:"0 24px", borderRadius:8, border:"none",
                  background: isLoading||!isDpiValid ? C.g200 : C.teal,
                  color: isLoading||!isDpiValid ? C.g400 : "#fff",
                  cursor: isLoading||!isDpiValid ? "not-allowed":"pointer",
                  display:"flex", alignItems:"center", gap:8,
                  whiteSpace:"nowrap" as const, transition:"background 0.2s",
                  boxShadow: isLoading||!isDpiValid ? "none" : `0 2px 6px ${C.teal}44` }}>
                {isLoading
                  ? <><Spinner size={15} color={C.g400}/> Consultando...</>
                  : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg> Consultar</>}
              </button>
            </div>
            <div style={{ fontSize:11, color:C.g400, marginTop:8 }}>
              El DPI es obligatorio y debe ingresarse sin espacios ni guiones.
            </div>
            {dpiError && (
              <div style={{ marginTop:8, fontSize:12, color:C.red, fontWeight:600 }}>
                {dpiError}
              </div>
            )}
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
              Ingrese un DPI de 13 dígitos para iniciar la consulta.
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
