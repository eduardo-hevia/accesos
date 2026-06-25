// ── AccionistaPanel — Panel centralizado del accionista (3 estados) ───────────
// Reúne toda la información del accionista en un solo panel, al estilo del
// encabezado de `frontacc`. Estados: actualizado · desactualizado · potencial.
// Iteración 2: correlativo como punto focal, fondo más suave, jerarquía clara.
import type { ReactNode } from "react";
import { C } from "../../../ui/components/index";
import type { Accionista, AccionistaStatus } from "../../../core/entities/index";

// ─── Config por estado ────────────────────────────────────────────────────────
interface StatusCfg {
  bar: string;        // barra superior suave
  accent: string;     // acento vívido (borde foto, degradado correlativo)
  accentDk: string;   // acento oscuro (badge — texto blanco accesible)
  panelBg: string;    // fondo muy suave del encabezado
  label: string;      // texto del badge
  tipo: string;       // tipo cerca del correlativo
  prefix: string;     // prefijo del correlativo
  icon: ReactNode;
}

const STATUS: Record<AccionistaStatus, StatusCfg> = {
  actualizado: {
    bar: "var(--access-bar-actualizado)",
    accent: "var(--access-accent-actualizado)",
    accentDk: "var(--access-accent-actualizado-dk)",
    panelBg: "var(--access-soft-actualizado)",
    label: "Actualizado", tipo: "Accionista Actualizado", prefix: "AC",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  },
  desactualizado: {
    bar: "var(--access-bar-desactualizado)",
    accent: "var(--access-accent-desactualizado)",
    accentDk: "var(--access-accent-desactualizado-dk)",
    panelBg: "var(--access-soft-desactualizado)",
    label: "Desactualizado", tipo: "Accionista Desactualizado", prefix: "ACD",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  potencial: {
    bar: "var(--access-bar-potencial)",
    accent: "var(--access-accent-potencial)",
    accentDk: "var(--access-accent-potencial-dk)",
    panelBg: "var(--access-soft-potencial)",
    label: "Potencial", tipo: "Accionista Potencial", prefix: "ACP",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>,
  },
};

function getStatus(s: AccionistaStatus): StatusCfg {
  switch (s) {
    case "actualizado":    return STATUS.actualizado;
    case "desactualizado": return STATUS.desactualizado;
    case "potencial":      return STATUS.potencial;
  }
}

// ─── Avatar grande ────────────────────────────────────────────────────────────
function Avatar({ src, nombre, accent }: { src: string; nombre: string; accent: string }) {
  const base = {
    width:170, height:170, borderRadius:24, flexShrink:0, alignSelf:"center",
    border:`3px solid ${accent}`, boxShadow:`0 8px 24px ${accent}33`,
  } as const;
  if (!src) {
    return (
      <div style={{ ...base, background:C.g100,
        display:"flex", alignItems:"center", justifyContent:"center", color:accent }}>
        <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    );
  }
  return (
    <img src={src} alt={nombre} style={{ ...base, objectFit:"cover" }}
      onError={e => { (e.target as HTMLImageElement).style.visibility = "hidden"; }} />
  );
}

// ─── Badge de estado (consistente en los 3 estados) ───────────────────────────
function StatusBadge({ accent, icon, label }: { accent: string; icon: ReactNode; label: string }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6,
      fontSize:12.5, fontWeight:800, letterSpacing:"0.06em", textTransform:"uppercase",
      padding:"7px 15px", borderRadius:999, color:"#fff", background:accent,
      boxShadow:`0 3px 10px ${accent}45`, whiteSpace:"nowrap" }}>
      {icon} {label}
    </span>
  );
}

// ─── Celda de dato ────────────────────────────────────────────────────────────
function Cell({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, minWidth:0 }}>
      <span style={{ fontSize:11, fontWeight:600, color:C.g400,
        textTransform:"uppercase", letterSpacing:"0.12em" }}>{label}</span>
      <span style={{ fontSize:18.5, fontWeight:700, lineHeight:1.25,
        color: highlight ? C.red : C.g900, wordBreak:"break-word", letterSpacing:"-0.01em" }}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Bloque del Correlativo (punto focal) ─────────────────────────────────────
// Muestra el correlativo con prefijo según el tipo de accionista (AC / ACD / ACP)
// y el tipo de accionista justo debajo. El backend generará el número real.
function CorrelativoBlock({ value, accent, accentDk, prefix, tipo }:
  { value: string; accent: string; accentDk: string; prefix: string; tipo: string }) {

  const hasValue = !!value && value !== "—";
  const code = hasValue ? `${prefix}-${value}` : prefix;

  return (
    <div style={{ flexShrink:0, alignSelf:"stretch", width:244, minWidth:244,
      position:"relative", overflow:"hidden", borderRadius:22, padding:"24px 22px",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      background:`linear-gradient(150deg, ${accent}, ${accentDk})`,
      boxShadow:`0 20px 48px ${accent}70, inset 0 1px 0 rgba(255,255,255,0.12)` }}>
      <div style={{ position:"absolute", top:-50, right:-50, width:160, height:160,
        borderRadius:"50%", background:"rgba(255,255,255,0.16)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-40, left:-40, width:120, height:120,
        borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }} />

      <span style={{ fontSize:12.5, fontWeight:800, letterSpacing:"0.22em",
        textTransform:"uppercase", position:"relative", color:"rgba(255,255,255,0.9)" }}>
        Correlativo
      </span>
      <span style={{ fontSize:"clamp(46px, 6vw, 64px)", fontWeight:800,
        lineHeight:0.95, marginTop:8, letterSpacing:"-0.035em", position:"relative",
        color:"#fff", whiteSpace:"nowrap", fontVariantNumeric:"tabular-nums",
        textShadow:"0 3px 16px rgba(0,0,0,0.22)" }}>
        {code}
      </span>
      <span style={{ fontSize:13.5, fontWeight:800, marginTop:12, textAlign:"center",
        position:"relative", color:"#fff", letterSpacing:"0.01em" }}>
        {tipo}
      </span>
    </div>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────
export function AccionistaPanel({ data }: { data: Accionista }) {
  const cfg = getStatus(data.status);
  const isDesact = data.status === "desactualizado";

  const cells = [
    { label: "REGISTRO",       value: data.registro },
    { label: "DPI",            value: data.dpi },
    { label: "FECHA NAC.",     value: data.fechaNac },
    { label: "GÉNERO",         value: data.genero },
    { label: "ESTADO CIVIL",   value: data.estadoCivil },
    { label: "ESTADO",         value: data.estado },
    { label: "VENCE DPI",      value: data.vence, highlight: isDesact },
    { label: "ACTUALIZACIÓN",  value: data.fecha },
  ];

  return (
    <div className="animate-fadeUp" style={{ background:C.white, borderRadius:18,
      overflow:"hidden", border:`1px solid ${C.border}`,
      boxShadow:"0 6px 22px rgba(10,22,40,0.08)", marginBottom:16 }}>

      {/* Barra superior suave por estado */}
      <div style={{ height:6, background:cfg.bar }} />

      {/* Encabezado: foto + nombre/grilla + correlativo */}
      <div style={{ background:cfg.panelBg, padding:"28px 30px",
        display:"flex", gap:30, alignItems:"stretch", flexWrap:"wrap" }}>

        <Avatar src={data.avatarUrl} nombre={data.nombre} accent={cfg.accent} />

        <div style={{ flex:"1 1 340px", minWidth:0, display:"flex", flexDirection:"column",
          justifyContent:"center", gap:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <h2 style={{ fontSize:33, fontWeight:800, color:"var(--access-name)", margin:0,
              letterSpacing:"-0.025em", lineHeight:1.05 }}>
              {data.nombre}
            </h2>
            <StatusBadge accent={cfg.accentDk} icon={cfg.icon} label={cfg.label} />
          </div>

          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(155px, 1fr))",
            gap:"22px 36px" }}>
            {cells.map(c => <Cell key={c.label} {...c} />)}
          </div>
        </div>

        <CorrelativoBlock value={data.correlativo} accent={cfg.accent} accentDk={cfg.accentDk}
          prefix={cfg.prefix} tipo={cfg.tipo} />
      </div>

      {/* Aviso de desactualización */}
      {isDesact && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:11,
          background:C.goldLt, borderTop:`1px solid ${C.border}`,
          padding:"15px 30px", color:"var(--status-warning-title)", fontSize:14.5, fontWeight:500 }}>
          <svg style={{ flexShrink:0, marginTop:1 }} width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>
            <strong>El accionista debe actualizar su información antes de continuar.</strong>{" "}
            La validación de actualización llegará desde el backend.
          </span>
        </div>
      )}
    </div>
  );
}
