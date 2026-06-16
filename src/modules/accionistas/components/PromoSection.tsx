// ── PromoSection — Entrega Promocional ───────────────────────────────────────
import { C, Spinner } from "../../../ui/components/index";

interface PromoSectionProps {
  checked: boolean;
  saved: boolean;
  loading: boolean;
  error: string | null;
  onToggle: () => void;
  onSave: () => void;
  disabled?: boolean; // flow 3: potencial
  disabledTitle?: string;
  disabledDescription?: string;
}

export function PromoSection({
  checked, saved, loading, error, onToggle, onSave, disabled = false,
  disabledTitle = "Registro de Promocional no disponible",
  disabledDescription = "El material promocional solo puede registrarse para accionistas encontrados en el sistema.",
}: PromoSectionProps) {
  if (disabled) {
    return (
      <div aria-disabled="true" style={{ border:`1px dashed ${C.border}`, borderRadius:12,
        padding:"22px 24px", background:C.g50,
        display:"flex", alignItems:"center", gap:18, minHeight:98,
        opacity:0.86 }}>
        <div style={{ width:52, height:52, borderRadius:10, background:C.g100,
          border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:24, flexShrink:0 }}>🚫</div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:C.g600 }}>
            {disabledTitle}
          </div>
          <div style={{ fontSize:12, color:C.g500, marginTop:4, lineHeight:1.5 }}>
            {disabledDescription}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden",
      boxShadow:"var(--bt-shadow-xs)" }}>
      <div role="checkbox" aria-checked={checked || saved} aria-busy={loading} tabIndex={0}
        onClick={() => {
          if (saved || loading) return;
          if (checked) onSave();
          else onToggle();
        }}
        onKeyDown={e => {
          if ((e.key === " " || e.key === "Enter") && !saved && !loading) {
            e.preventDefault();
            if (checked) onSave();
            else onToggle();
          }
        }}
        style={{ padding:"22px 24px",
          background: saved ? C.greenLt : checked || loading ? C.tealLt : C.g50,
          display:"flex", alignItems:"center", gap:18, minHeight:100,
          cursor: saved || loading ? "default" : "pointer", transition:"background 0.2s" }}>

        {/* Checkbox visual */}
        <div style={{ width:30, height:30, borderRadius:8, flexShrink:0,
          border:`2px solid ${saved ? C.green : checked || loading ? C.teal : C.g300}`,
          background: saved ? C.green : checked || loading ? C.teal : C.white,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.2s" }}>
          {loading ? (
            <Spinner size={16} color="#fff" />
          ) : (checked || saved) && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>

        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:800,
            color: saved ? C.green : checked || loading ? C.tealDk : C.g700 }}>
            🎁 Entrega Promocional
          </div>
          <div style={{ fontSize:12, color:C.g500, marginTop:4 }}>
            {saved
              ? `✓ Registrado el ${new Date().toLocaleDateString("es-GT")}`
              : loading
              ? "Registrando entrega del material..."
              : checked
              ? "Falta confirmación: toque nuevamente para registrar la entrega"
              : "Confirmar que se entregó el material al accionista"}
          </div>
        </div>

        {saved ? (
          <span style={{ background:C.greenLt, color:C.green, fontSize:11,
            fontWeight:800, padding:"5px 12px", borderRadius:999,
            border:`1px solid ${C.green}33` }}>ENTREGADO</span>
        ) : checked && (
          <span style={{ background:C.tealPill, color:C.tealDk, fontSize:11,
            fontWeight:800, padding:"5px 12px", borderRadius:999,
            border:`1px solid ${C.teal}33` }}>CONFIRMAR</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding:"10px 18px", background:C.redLt,
          fontSize:12, color:C.red, fontWeight:500, borderTop:`1px solid #FCA5A5` }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
