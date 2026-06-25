// ── Atomic UI Components ──────────────────────────────────────────────────────
import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from "react";

// ─── Design tokens (mirrors globals.css) ─────────────────────────────────────
export const C = {
  teal:"var(--teal)", tealDk:"var(--teal-dk)", tealLt:"var(--teal-lt)", tealPill:"var(--teal-pill)",
  gold:"var(--gold)", goldLt:"var(--gold-lt)", goldBd:"var(--gold-bd)",
  green:"var(--green)", greenLt:"var(--green-lt)",
  red:"var(--red)", redLt:"var(--red-lt)",
  blue:"var(--blue)", blueLt:"var(--blue-lt)",
  bg:"var(--bg)", white:"var(--white)", border:"var(--border)",
  g50:"var(--g50)", g100:"var(--g100)", g200:"var(--g200)", g300:"var(--g300)",
  g400:"var(--g400)", g500:"var(--g500)", g600:"var(--g600)", g700:"var(--g700)", g900:"var(--g900)",
} as const;

// ─── Tag / Badge ──────────────────────────────────────────────────────────────
interface TagProps { children: ReactNode; bg?: string; color?: string; }
export function Tag({ children, bg = "var(--tag-default-bg)", color = "var(--tag-default-text)" }: TagProps) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:700,
      letterSpacing:"0.06em", padding:"3px 10px", borderRadius:999, background:bg, color,
      border:"1px solid var(--tag-default-border)", textTransform:"uppercase" as const }}>
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
type BtnVariant = "primary"|"warning"|"blue"|"ghost"|"success"|"danger"|"dark";

// VUL-002 FIX: explicit switch instead of BTN_STYLES[variant] — no prototype injection surface
function getBtnStyle(v: BtnVariant): CSSProperties {
  switch (v) {
    case "primary": return { background:C.teal,  color:"#fff", border:"none", boxShadow:`0 1px 4px ${C.teal}44` };
    case "warning": return { background:C.gold,  color:"#fff", border:"none" };
    case "blue":    return { background:C.blue,  color:"#fff", border:"none" };
    case "ghost":   return { background:"transparent", color:C.g600, border:`1px solid ${C.border}` };
    case "success": return { background:C.green, color:"#fff", border:"none", boxShadow:`0 1px 4px ${C.green}44` };
    case "danger":  return { background:C.red,   color:"#fff", border:"none" };
    case "dark":    return { background:C.g900,  color:"#fff", border:"none" };
  }
}
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant; size?: "sm"|"md"; children: ReactNode;
}
const BTN_STYLES: Record<BtnVariant, CSSProperties> = {
  primary: { background:C.teal,  color:"#fff", border:"none", boxShadow:`0 1px 4px ${C.teal}44` },
  warning: { background:C.gold,  color:"#fff", border:"none" },
  blue:    { background:C.blue,  color:"#fff", border:"none" },
  ghost:   { background:"transparent", color:C.g600, border:`1px solid ${C.border}` },
  success: { background:C.green, color:"#fff", border:"none", boxShadow:`0 1px 4px ${C.green}44` },
  danger:  { background:C.red,   color:"#fff", border:"none" },
  dark:    { background:C.g900,  color:"#fff", border:"none" },
};
export function Btn({ variant="primary", size="md", children, disabled, style, ...rest }: BtnProps) {
  const base: CSSProperties = {
    fontFamily:"inherit", fontSize: size==="sm"?12.5:14, fontWeight:600,
    padding: size==="sm"?"8px 16px":"11px 22px",
    borderRadius:8, cursor: disabled?"not-allowed":"pointer",
    display:"inline-flex", alignItems:"center", gap:6,
    transition:"opacity .15s, transform .1s", letterSpacing:"0.01em",
    // VUL-002 FIX: closed switch lookup — eliminates bracket-notation prototype injection surface.
    ...(disabled
      ? { background:C.g200, color:C.g400, border:"none", boxShadow:"none" }
      : getBtnStyle(variant)),
    ...style,
  };
  return (
    <button disabled={disabled} style={base}
      onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.opacity="0.82"; }}
      onMouseLeave={e=>{ e.currentTarget.style.opacity="1"; }}
      onMouseDown={e=>{ if(!disabled) e.currentTarget.style.transform="scale(0.97)"; }}
      onMouseUp={e=>{ e.currentTarget.style.transform="scale(1)"; }}
      {...rest}>{children}</button>
  );
}

// ─── DataCell ─────────────────────────────────────────────────────────────────
interface DataCellProps { label: string; value: string; highlight?: boolean; }
export function DataCell({ label, value, highlight=false }: DataCellProps) {
  return (
    <div style={{ background:C.g50, border:`1px solid ${highlight?"#FCA5A5":C.border}`,
      borderRadius:8, padding:"11px 16px" }}>
      <div style={{ fontSize:9, fontWeight:700, color:C.g400, textTransform:"uppercase",
        letterSpacing:"0.1em", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:600, color: highlight?C.red:C.g700 }}>{value}</div>
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps { title: string; right?: ReactNode; icon?: ReactNode; }
export function SectionHeader({ title, right, icon }: SectionHeaderProps) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"12px 24px", borderBottom:`1px solid ${C.border}`, background:C.white }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:4, height:20, background:C.teal, borderRadius:2 }} />
        {icon && <span style={{ display:"inline-flex", color:C.teal }}>{icon}</span>}
        <span style={{ fontSize:13, fontWeight:700, color:C.g700,
          textTransform:"uppercase", letterSpacing:"0.07em" }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
interface StatCardProps { icon: ReactNode; iconBg: string; value: string; label: string; }
export function StatCard({ icon, iconBg, value, label }: StatCardProps) {
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10,
      padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flex:1,
      boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ width:42, height:42, borderRadius:10, background:iconBg,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:22, fontWeight:700, color:C.g900, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:10, fontWeight:700, color:C.g400, textTransform:"uppercase",
          letterSpacing:"0.08em", marginTop:3 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size=16, color=C.white }: { size?: number; color?: string }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
}

// ─── BrandSpinner (molinete Bantrab — spinner.gif de @bantrab/ui) ──────────────
export function BrandSpinner({ size=48 }: { size?: number }) {
  return (
    <img src="/spinner.gif" alt="Cargando" width={size} height={size}
      style={{ display:"inline-block", objectFit:"contain", verticalAlign:"middle" }} />
  );
}

// ─── Section (tarjeta con encabezado, estilo del módulo) ──────────────────────
export function Section({ title, right, icon, children }: { title: string; right?: ReactNode; icon?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ background:C.white, borderRadius:16, overflow:"hidden",
      border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(10,22,40,0.06)",
      marginBottom:16 }}>
      <SectionHeader title={title} right={right} icon={icon} />
      <div style={{ padding:"20px 26px" }}>{children}</div>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
interface CardProps { children: ReactNode; accent: string; }
export function Card({ children, accent }: CardProps) {
  return (
    <div className="animate-fadeUp" style={{ background:C.white, borderRadius:14,
      overflow:"hidden", border:`1px solid ${C.border}`,
      boxShadow:"0 2px 8px rgba(0,0,0,0.07)", borderTop:`3px solid ${accent}`,
      marginBottom:24 }}>{children}</div>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────
interface FormFieldProps { label: string; children: ReactNode; col?: string; }
export function FormField({ label, children, col }: FormFieldProps) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5,
      gridColumn: col ?? undefined }}>
      <label style={{ fontSize:11.5, fontWeight:700, color:C.g500,
        textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</label>
      {children}
    </div>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────
export const inputSx: CSSProperties = {
  padding:"11px 14px", fontFamily:"inherit", fontSize:14,
  border:`1px solid #E4E7EC`, borderRadius:8,
  background:"#F9FAFB", color:"#111827", outline:"none", width:"100%",
};
