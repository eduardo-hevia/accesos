// ── ConfirmDialog — Soft-delete ───────────────────────────────────────────────
import { C } from "../../../ui/components/index";

interface ConfirmDialogProps {
  nombre: string;
  saving: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ nombre, saving, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,0,0.45)", backdropFilter:"blur(2px)",
      zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:C.white, borderRadius:12, width:"100%", maxWidth:400,
        boxShadow:"0 20px 60px rgba(0,0,0,0.2)", border:`1px solid ${C.border}`,
        overflow:"hidden", animation:"fadeUp 0.2s ease",
      }}>
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ fontSize:36, marginBottom:12, textAlign:"center" }}>🗑️</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.g900, textAlign:"center", marginBottom:8 }}>
            Eliminar Registro
          </div>
          <div style={{ fontSize:13, color:C.g600, textAlign:"center", lineHeight:1.6 }}>
            ¿Confirma eliminar el caso de <strong>{nombre}</strong>?
            <br />
            <span style={{ fontSize:11, color:C.g400 }}>
              El registro se marcará como inactivo (soft-delete). No se eliminará físicamente.
            </span>
          </div>
        </div>
        <div style={{
          padding:"20px 24px", display:"flex", gap:10, justifyContent:"center",
        }}>
          <button onClick={onClose} style={{
            fontFamily:"inherit", fontSize:13, fontWeight:600,
            padding:"9px 22px", borderRadius:8,
            border:`1px solid ${C.border}`, background:C.white,
            color:C.g600, cursor:"pointer",
          }}>Cancelar</button>
          <button onClick={onConfirm} disabled={saving} style={{
            fontFamily:"inherit", fontSize:13, fontWeight:600,
            padding:"9px 22px", borderRadius:8, border:"none",
            background: saving ? C.g300 : C.red,
            color:"#fff", cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
