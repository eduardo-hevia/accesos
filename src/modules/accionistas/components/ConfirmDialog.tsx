// ── ConfirmDialog — Modal de confirmación reutilizable ───────────────────────
// Componente genérico, controlado por props, listo para reutilizar en acciones
// críticas futuras (p. ej. "marcar la salida del accionista"). No incluye lógica
// de negocio: el consumidor decide qué hacer en onConfirm / onCancel.
import type { ReactNode } from "react";
import { C, Spinner } from "../../../ui/components/index";

export type ConfirmTone = "info" | "warning" | "danger";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  tone?: ConfirmTone;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TONE_CFG: Record<ConfirmTone, { accent: string; bg: string; icon: ReactNode }> = {
  info: {
    accent: C.teal, bg: C.tealLt,
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  },
  warning: {
    accent: C.gold, bg: C.goldLt,
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  danger: {
    accent: C.red, bg: C.redLt,
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  },
};

// Switch cerrado (evita acceso por bracket sobre el mapa) — consistente con VUL-fixes del módulo.
function getToneCfg(tone: ConfirmTone) {
  switch (tone) {
    case "info":    return TONE_CFG.info;
    case "warning": return TONE_CFG.warning;
    case "danger":  return TONE_CFG.danger;
  }
}

export function ConfirmDialog({
  open, title, message, tone = "info",
  confirmText = "Confirmar", cancelText = "Cancelar",
  loading = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  const cfg = getToneCfg(tone);

  return (
    <div
      role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget && !loading) onCancel(); }}
      style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.48)",
        backdropFilter:"blur(2px)", zIndex:1100, display:"flex",
        alignItems:"center", justifyContent:"center", padding:24 }}>

      <div className="animate-fadeUp" style={{ background:C.white, borderRadius:16,
        width:"100%", maxWidth:420, overflow:"hidden",
        border:`1px solid ${C.border}`, boxShadow:"0 24px 60px rgba(0,0,0,0.28)" }}>

        <div style={{ height:5, background:cfg.accent }} />

        <div style={{ padding:"26px 26px 22px", textAlign:"center" }}>
          <div style={{ width:62, height:62, borderRadius:"50%", margin:"0 auto 16px",
            background:cfg.bg, color:cfg.accent, display:"flex",
            alignItems:"center", justifyContent:"center",
            border:`1px solid ${cfg.accent}33` }}>
            {cfg.icon}
          </div>

          <div style={{ fontSize:18.5, fontWeight:800, color:C.g900,
            letterSpacing:"-0.01em", marginBottom:9 }}>
            {title}
          </div>
          <div style={{ fontSize:14.5, color:C.g500, fontWeight:500, lineHeight:1.6 }}>
            {message}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:22 }}>
            <button onClick={onConfirm} disabled={loading} style={{
              fontFamily:"inherit", fontSize:15, fontWeight:700, padding:"12px 18px",
              borderRadius:10, border:"none", color:"#fff",
              background: loading ? C.g300 : cfg.accent,
              cursor: loading ? "not-allowed" : "pointer",
              display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow: loading ? "none" : `0 4px 14px ${cfg.accent}44` }}>
              {loading ? <><Spinner size={15} color="#fff" /> Procesando...</> : confirmText}
            </button>
            <button onClick={onCancel} disabled={loading} style={{
              fontFamily:"inherit", fontSize:15, fontWeight:700, padding:"12px 18px",
              borderRadius:10, border:`1px solid ${C.border}`, background:C.white,
              color:C.g600, cursor: loading ? "not-allowed" : "pointer" }}>
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
