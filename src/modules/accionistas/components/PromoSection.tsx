// ── PromoSection — Entrega Promocional ───────────────────────────────────────
// Iteración 2: distribución más rica (icono + texto + acción/estado).
// Mantiene los mismos props/callbacks/comportamiento (la acción abre el modal).
import { C, Spinner } from "../../../ui/components/index";

interface PromoSectionProps {
  checked: boolean;
  saved: boolean;
  loading: boolean;
  error: string | null;
  onToggle: () => void;
  onSave: () => void;
  disabled?: boolean; // flujo desactualizado / potencial
  disabledTitle?: string;
  disabledDescription?: string;
}

export function PromoSection({
  checked: _checked, saved, loading, error, onToggle, onSave: _onSave, disabled = false,
  disabledTitle = "Registro de Promocional no disponible",
  disabledDescription = "El material promocional solo puede registrarse para accionistas encontrados en el sistema.",
}: PromoSectionProps) {

  // ── Estado deshabilitado ────────────────────────────────────────────────────
  if (disabled) {
    return (
      <div aria-disabled="true" style={{ border:`1.5px dashed ${C.g300}`, borderRadius:14,
        padding:"22px 24px", background:C.g50,
        display:"flex", alignItems:"center", gap:18, opacity:0.9 }}>
        <div style={{ width:54, height:54, borderRadius:14, background:C.g100,
          border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:24, flexShrink:0 }}>🚫</div>
        <div>
          <div style={{ fontSize:16.5, fontWeight:700, color:C.g600 }}>{disabledTitle}</div>
          <div style={{ fontSize:14, fontWeight:500, color:C.g600, marginTop:4, lineHeight:1.5 }}>{disabledDescription}</div>
        </div>
      </div>
    );
  }

  // ── Estado: entregado ─────────────────────────────────────────────────────────
  const isDone = saved;

  return (
    <div style={{ border:`1.5px solid ${isDone ? `${C.green}55` : C.border}`,
      borderRadius:14, overflow:"hidden",
      background: isDone ? C.greenLt : "linear-gradient(135deg, var(--white), var(--g50))",
      transition:"all 0.2s" }}>
      <div style={{ padding:"20px 24px", display:"flex", alignItems:"center", gap:18, flexWrap:"wrap" }}>

        {/* Icono */}
        <div style={{ width:56, height:56, borderRadius:16, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
          background: isDone ? C.green : C.tealLt,
          border: isDone ? "none" : `1px solid ${C.teal}33`,
          boxShadow: isDone ? `0 6px 16px ${C.green}40` : "none" }}>
          {isDone
            ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            : "🎁"}
        </div>

        {/* Texto */}
        <div style={{ flex:"1 1 240px", minWidth:0 }}>
          <div style={{ fontSize:17.5, fontWeight:800, color: isDone ? C.green : C.g900 }}>
            Entrega Promocional
          </div>
          <div style={{ fontSize:14, fontWeight:500, color:C.g600, marginTop:4, lineHeight:1.5 }}>
            {isDone
              ? `Material entregado y registrado el ${new Date().toLocaleDateString("es-GT")}.`
              : "Confirme que se entregó el material promocional al accionista."}
          </div>
        </div>

        {/* Acción / estado */}
        {isDone ? (
          <span style={{ background:"#fff", color:C.green, fontSize:12.5, fontWeight:800,
            padding:"9px 17px", borderRadius:999, border:`1px solid ${C.green}40`,
            letterSpacing:"0.05em", textTransform:"uppercase", flexShrink:0 }}>
            ✓ Entregado
          </span>
        ) : (
          <button type="button" onClick={onToggle} disabled={loading} style={{
            fontFamily:"inherit", fontSize:14.5, fontWeight:700, padding:"12px 24px",
            borderRadius:10, border:"none", color:"#fff",
            background: loading ? C.g300 : C.teal, cursor: loading ? "not-allowed" : "pointer",
            display:"inline-flex", alignItems:"center", gap:8, flexShrink:0,
            boxShadow: loading ? "none" : `0 4px 14px ${C.teal}40` }}>
            {loading
              ? <><Spinner size={14} color="#fff" /> Registrando...</>
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Registrar entrega</>}
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding:"10px 22px", background:C.redLt,
          fontSize:12, color:C.red, fontWeight:500, borderTop:`1px solid #FCA5A5` }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
