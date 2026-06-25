// ── AccesoPreferencias — Talla de playera + Alimentación ─────────────────────
// Secciones de captura del operador. Selección única por sección, en grid
// táctil. La persistencia se integrará con backend a futuro.
import { useState } from "react";
import type { ReactNode } from "react";
import { C, Section } from "../../../ui/components/index";
import type { TallaPlayera, TipoAlimentacion } from "../../../core/entities/index";

const TALLAS: TallaPlayera[] = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const ALIMENTACION: { value: TipoAlimentacion; icon: string }[] = [
  { value: "Normal",    icon: "🍔" },
  { value: "Saludable", icon: "🥗" },
  { value: "De dieta",  icon: "🥩" },
];

// ─── Íconos de encabezado ─────────────────────────────────────────────────────
const ShirtIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinejoin="round">
    <path d="M15.5 3 12 6 8.5 3 3 6l2.2 3.5L7 8.5V21h10V8.5l1.8 1L21 6z"/>
  </svg>
);
const FoodIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 3 0 0 0-5 3v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);

// ─── Celda seleccionable (grid, táctil) ───────────────────────────────────────
interface CellProps {
  active: boolean;
  onClick: () => void;
  lead?: ReactNode;     // emoji/ícono opcional
  compact?: boolean;
  children: ReactNode;
}
function SelectCell({ active, onClick, lead, compact = false, children }: CellProps) {
  const [hover, setHover] = useState(false);
  const border = active ? C.teal : (hover ? C.teal : C.g200);
  const bg     = active ? C.teal : (hover ? C.tealLt : C.white);
  const color  = active ? "#fff" : (hover ? C.tealDk : C.g700);

  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position:"relative", width:"100%", minHeight:compact ? 48 : 64, fontFamily:"inherit",
        fontSize:compact ? 14 : 16, fontWeight:active ? 800 : 700, cursor:"pointer",
        padding:compact ? "8px 10px" : "14px 12px", borderRadius:compact ? 10 : 14,
        transition:"all 0.16s ease",
        border:`1.5px solid ${border}`, background:bg, color,
        transform: active ? "translateY(-2px)" : "none",
        boxShadow: active ? `0 8px 18px ${C.teal}45, 0 0 0 3px ${C.teal}22` : "none",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:compact ? 2 : 5 }}>
      {active && (
        <span style={{ position:"absolute", top:7, right:8, display:"inline-flex" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      )}
      {lead && <span style={{ fontSize:compact ? 18 : 24, lineHeight:1 }}>{lead}</span>}
      {children}
    </button>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return <div style={{ fontSize:13.5, fontWeight:500, color:C.g500, marginTop:16 }}>{children}</div>;
}

// ─── Talla de playera ─────────────────────────────────────────────────────────
export function TallaSection({ value, onChange }: { value: TallaPlayera | null; onChange: (t: TallaPlayera) => void }) {
  return (
    <Section title="Talla de Playera" icon={ShirtIcon}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:8 }}>
        {TALLAS.map(t => (
          <SelectCell key={t} active={value === t} onClick={() => onChange(t)} lead="👕" compact>
            {t}
          </SelectCell>
        ))}
      </div>
      <Hint>Seleccione una única talla. La persistencia se realizará cuando el backend esté disponible.</Hint>
    </Section>
  );
}

// ─── Alimentación ─────────────────────────────────────────────────────────────
export function AlimentacionSection({ value, onChange }: { value: TipoAlimentacion | null; onChange: (a: TipoAlimentacion) => void }) {
  return (
    <Section title="Alimentación" icon={FoodIcon}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:12 }}>
        {ALIMENTACION.map(a => (
          <SelectCell key={a.value} active={value === a.value} onClick={() => onChange(a.value)} lead={a.icon}>
            {a.value}
          </SelectCell>
        ))}
      </div>
      <Hint>Seleccione una única opción. La persistencia se realizará cuando el backend esté disponible.</Hint>
    </Section>
  );
}
