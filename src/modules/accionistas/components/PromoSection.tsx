// ── PromoSection — Entrega Promocional ───────────────────────────────────────
import { Btn, C, Spinner } from "../../../ui/components/index";

interface PromoSectionProps {
  checked: boolean;
  saved: boolean;
  loading: boolean;
  error: string | null;
  onToggle: () => void;
  onSave: () => void;
  disabled?: boolean; // flow 3: potencial
}

export function PromoSection({
  checked, saved, loading, error, onToggle, onSave, disabled = false,
}: PromoSectionProps) {
  // ── Blocked state (flujo 3 — potencial) ──────────────────────────────────
  if (disabled) {
    return (
      <div style={{ border:`1px dashed ${C.border}`, borderRadius:10,
        padding:"16px 18px", background:C.g50,
        display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:38, height:38, borderRadius:8, background:C.g100,
          border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:18, flexShrink:0 }}>🚫</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:C.g500 }}>
            Registro de Promocional no disponible
          </div>
          <div style={{ fontSize:11, color:C.g400, marginTop:2 }}>
            El material promocional solo puede registrarse para accionistas encontrados en el sistema.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
      {/* Toggle row */}
      <div role="checkbox" aria-checked={checked} tabIndex={0}
        onClick={() => !saved && onToggle()}
        onKeyDown={e => e.key === " " && !saved && onToggle()}
        style={{ padding:"14px 18px",
          background: saved ? C.greenLt : checked ? C.tealLt : C.g50,
          display:"flex", alignItems:"center", gap:12,
          cursor: saved ? "default" : "pointer", transition:"background 0.2s",
          borderBottom: (checked || saved) ? `1px solid ${C.border}` : "none" }}>

        {/* Checkbox visual */}
        <div style={{ width:20, height:20, borderRadius:5, flexShrink:0,
          border:`2px solid ${saved ? C.green : checked ? C.teal : C.g300}`,
          background: saved ? C.green : checked ? C.teal : C.white,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.2s" }}>
          {(checked || saved) && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>

        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600,
            color: saved ? C.green : checked ? C.tealDk : C.g700 }}>
            🎁 Material Promocional Entregado
          </div>
          <div style={{ fontSize:11, color:C.g400, marginTop:2 }}>
            {saved
              ? `✓ Registrado el ${new Date().toLocaleDateString("es-GT")}`
              : checked
              ? "Presione Guardar Promocional para confirmar"
              : "Marque cuando entregue el material al accionista"}
          </div>
        </div>

        {saved && (
          <span style={{ background:C.greenLt, color:C.green, fontSize:10,
            fontWeight:700, padding:"3px 10px", borderRadius:999,
            border:`1px solid ${C.green}33` }}>ENTREGADO</span>
        )}
      </div>

      {/* Action row — visible when checked but not yet saved */}
      {checked && !saved && (
        <div className="animate-slideDown" style={{ padding:"12px 18px", background:C.white,
          display:"flex", alignItems:"center", gap:10 }}>
          <Btn variant="success" size="sm" onClick={onSave} disabled={loading}>
            {loading
              ? <><Spinner size={12} color="#fff"/> Guardando...</>
              : <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Guardar Promocional
                </>}
          </Btn>
          <Btn variant="ghost" size="sm" onClick={onToggle} disabled={loading}>
            Cancelar
          </Btn>
          <span style={{ fontSize:11, color:C.g400, marginLeft:4 }}>
            Se registrará la fecha y hora actual
          </span>
        </div>
      )}

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
