// ── Classification Panel ──────────────────────────────────────────────────────
import type { ReactNode } from "react";
import { C } from "../../../ui/components/index";

interface ChipData { label: string; value: string; }

interface ClassificationPanelProps {
  status: "actualizado" | "desactualizado" | "potencial";
  chips?: ChipData[];
}

const PANEL_CFG = {
  actualizado: {
    accent: C.teal, bg: C.tealLt, badgeBg: C.tealPill, badgeColor: C.tealDk,
    label: "ACTUALIZADO",
    msg: "Accionista con expediente completo y datos vigentes. Apto para participar en la próxima asamblea ordinaria sin restricciones.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  desactualizado: {
    accent: C.gold, bg: C.goldLt, badgeBg: "#FEF3DC", badgeColor: "#92400E",
    label: "DESACTUALIZADO",
    msg: "El DPI ha vencido y los datos no han sido verificados. Requiere gestión de expediente urgente antes de la próxima asamblea.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  potencial: {
    accent: C.blue, bg: C.blueLt, badgeBg: "#DBEAFE", badgeColor: "#1E40AF",
    label: "POTENCIAL ACCIONISTA",
    msg: "El DPI consultado no se encuentra en el registro. Complete la información preliminar y guárdelo como prospecto para seguimiento posterior.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
} as const;

// VUL-001 FIX: Pure function lookup — avoids variable bracket access on const map.
// status is a closed discriminated union; exhaustive switch eliminates prototype injection surface.
function getPanelCfg(status: ClassificationPanelProps["status"]) {
  switch (status) {
    case "actualizado":    return PANEL_CFG.actualizado;
    case "desactualizado": return PANEL_CFG.desactualizado;
    case "potencial":      return PANEL_CFG.potencial;
  }
}

export function ClassificationPanel({ status, chips }: ClassificationPanelProps) {
  const cfg = getPanelCfg(status);

  return (
    <div style={{ background:cfg.bg, borderTop:`3px solid ${cfg.accent}`,
      padding:"20px 24px 22px", display:"flex", alignItems:"flex-start", gap:20 }}>

      {/* Big badge */}
      <div style={{ flexShrink:0, background:cfg.badgeBg,
        border:`1px solid ${cfg.accent}33`, borderRadius:12,
        padding:"16px 20px", display:"flex", flexDirection:"column",
        alignItems:"center", gap:8, minWidth:136 }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:cfg.accent,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 4px 14px ${cfg.accent}44` }}>
          {cfg.icon as ReactNode}
        </div>
        <div style={{ fontSize:10, fontWeight:800, color:cfg.badgeColor,
          textTransform:"uppercase" as const, letterSpacing:"0.09em",
          textAlign:"center" as const, lineHeight:1.4 }}>
          {cfg.label}
        </div>
        <div style={{ fontSize:9, color:cfg.accent, fontWeight:700,
          background:`${cfg.accent}18`, padding:"2px 8px", borderRadius:999,
          letterSpacing:"0.06em", textTransform:"uppercase" as const }}>
          Clasificación
        </div>
      </div>

      {/* Message + chips */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.g400,
          textTransform:"uppercase" as const, letterSpacing:"0.1em" }}>
          Estado del expediente
        </div>
        <div style={{ fontSize:13, color:C.g700, lineHeight:1.7, fontWeight:500,
          background:C.white, border:`1px solid ${cfg.accent}22`,
          borderRadius:8, padding:"12px 14px" }}>
          {cfg.msg}
        </div>
        {chips && chips.length > 0 && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const }}>
            {chips.map(c => (
              <div key={c.label} style={{ background:C.white, border:`1px solid ${C.border}`,
                borderRadius:7, padding:"5px 12px",
                display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:9, color:C.g400, fontWeight:700,
                  textTransform:"uppercase" as const }}>{c.label}:</span>
                <span style={{ fontSize:12, color:C.g700, fontWeight:600 }}>{c.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
