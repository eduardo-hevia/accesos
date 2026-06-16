// ── Result Cards — Flujos 1, 2 y 3 ───────────────────────────────────────────
import { useState } from "react";
import type { Accionista } from "../../../core/entities/index";
import {
  Btn, Card, DataCell, SectionHeader, StatCard, Tag, C, inputSx, FormField,
} from "../../../ui/components/index";
import { ClassificationPanel } from "./ClassificationPanel";
import { PromoSection } from "./PromoSection";

// ─── Shared avatar ────────────────────────────────────────────────────────────
function Avatar({ src, nombre, accent }: { src: string; nombre: string; accent: string }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <img src={src} alt={nombre}
        style={{ width:88, height:88, borderRadius:12, objectFit:"cover",
          border:`2.5px solid ${accent}`, boxShadow:`0 2px 12px ${accent}33` }}
        onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
    </div>
  );
}

// ─── Shared fields grid ───────────────────────────────────────────────────────
function FieldsGrid({ data, highlightVence = false }: { data: Accionista; highlightVence?: boolean }) {
  const fields = [
    { label:"REGISTRO",            value:data.registro },
    { label:"DPI",                 value:data.dpi },
    { label:"FECHA DE NACIMIENTO", value:data.fechaNac },
    { label:"ESTADO",              value:data.estado },
    { label:"VENCE",               value:data.vence, highlight:highlightVence },
    { label:"ESTADO CIVIL",        value:data.estadoCivil },
    { label:"FECHA ACTUALIZACIÓN", value:data.fecha },
    { label:"CORRELATIVO",         value:data.correlativo },
    { label:"GÉNERO",              value:data.genero },
  ];
  return (
    <div style={{ padding:"16px 24px", display:"grid",
      gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
      {fields.map(f => <DataCell key={f.label} {...f} />)}
    </div>
  );
}

// ─── Stat row (flujos 1 y 2) ──────────────────────────────────────────────────
function StatRow({ data }: { data: Accionista }) {
  const isDesact = data.status === "desactualizado";
  return (
    <div style={{ display:"flex", gap:12, marginBottom:20 }}>
      <StatCard
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
        iconBg={C.tealLt} value={data.acciones} label="Acciones" />
      <StatCard
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        iconBg={C.blueLt} value={data.correlativo} label="Correlativo" />
      <StatCard
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDesact?C.gold:C.teal} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
        iconBg={isDesact?C.goldLt:C.tealLt} value={data.tipoAccion} label="Tipo Acción" />
    </div>
  );
}

// ── Props for promo callbacks ─────────────────────────────────────────────────
interface PromoProps {
  promoChecked: boolean;
  promoSaved: boolean;
  promoLoading: boolean;
  promoError: string | null;
  onPromoToggle: () => void;
  onPromoSave: () => void;
}

// ─── CardActualizado ──────────────────────────────────────────────────────────
export function CardActualizado({ data, ...promo }: { data: Accionista } & PromoProps) {
  return (
    <>
      <StatRow data={data} />
      <Card accent={C.teal}>
        <div style={{ padding:"20px 24px 18px", background:"var(--status-success-panel)",
          borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", gap:18 }}>
          <Avatar src={data.avatarUrl} nombre={data.nombre} accent={C.teal} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
              <span style={{ fontSize:19, fontWeight:700, color:"var(--status-success-title)" }}>{data.nombre}</span>
              <Tag>Actualizado</Tag>
            </div>
            <div style={{ fontSize:12, color:"var(--status-success-muted)", marginBottom:14 }}>
              Registro: <strong style={{ color:C.g600 }}>{data.registro}</strong>
              &ensp;·&ensp;DPI: <strong style={{ color:C.g600 }}>{data.dpi}</strong>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Btn variant="primary" size="sm">🔒 Acreditar Asamblea</Btn>
              <Btn variant="ghost" size="sm">📄 Ver Expediente</Btn>
              <Btn variant="ghost" size="sm">🕐 Historial</Btn>
            </div>
          </div>
        </div>
        <SectionHeader title="Datos del Accionista" />
        <FieldsGrid data={data} />
        <SectionHeader title="Entrega Promocional" />
        <div style={{ padding:"14px 24px 18px" }}>
          <PromoSection checked={promo.promoChecked} saved={promo.promoSaved}
            loading={promo.promoLoading} error={promo.promoError}
            onToggle={promo.onPromoToggle} onSave={promo.onPromoSave} />
        </div>
        <ClassificationPanel status="actualizado" chips={[
          { label:"Acciones", value:data.acciones },
          { label:"Tipo", value:data.tipoAccion },
          { label:"Última asamblea", value:data.ultimaAsamblea },
        ]} />
      </Card>
    </>
  );
}

// ─── CardDesactualizado ───────────────────────────────────────────────────────
export function CardDesactualizado({ data, ...promo }: { data: Accionista } & PromoProps) {
  return (
    <>
      <StatRow data={data} />
      <Card accent={C.gold}>
        <div style={{ padding:"20px 24px 18px", background:"var(--status-warning-panel)",
          borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", gap:18 }}>
          <Avatar src={data.avatarUrl} nombre={data.nombre} accent={C.gold} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
              <span style={{ fontSize:19, fontWeight:700, color:"var(--status-warning-title)" }}>{data.nombre}</span>
              <Tag bg="#FEF3DC" color="#92400E">Desactualizado</Tag>
            </div>
            <div style={{ fontSize:12, color:C.g400, marginBottom:10 }}>
              Registro: <strong style={{ color:C.g600 }}>{data.registro}</strong>
              &ensp;·&ensp;DPI: <strong style={{ color:C.g600 }}>{data.dpi}</strong>
            </div>
            <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:C.goldLt,
              border:`1px solid ${C.goldBd}`, borderRadius:8, padding:"10px 14px", marginBottom:12,
              fontSize:12, color:"var(--status-warning-title)" }}>
              <svg style={{ flexShrink:0, marginTop:1 }} width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>DPI vencido el <strong>{data.vence}</strong>. Gestione actualización antes de la próxima asamblea.</span>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn variant="warning" size="sm">✏ Actualizar Expediente</Btn>
              <Btn variant="ghost" size="sm">📄 Ver Expediente</Btn>
            </div>
          </div>
        </div>
        <SectionHeader title="Datos del Accionista" />
        <FieldsGrid data={data} highlightVence />
        <SectionHeader title="Entrega Promocional" />
        <div style={{ padding:"14px 24px 18px" }}>
          <PromoSection checked={promo.promoChecked} saved={promo.promoSaved}
            loading={promo.promoLoading} error={promo.promoError}
            onToggle={promo.onPromoToggle} onSave={promo.onPromoSave} />
        </div>
        <ClassificationPanel status="desactualizado" chips={[
          { label:"Acciones", value:data.acciones },
          { label:"Tipo", value:data.tipoAccion },
          { label:"Última asamblea", value:data.ultimaAsamblea },
        ]} />
      </Card>
    </>
  );
}

// ─── CardPotencial ────────────────────────────────────────────────────────────
interface CardPotencialProps {
  dpi: string;
  onSave: (data: Record<string, string>) => Promise<boolean>;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
}

export function CardPotencial({ dpi, onSave, saving, saved, saveError }: CardPotencialProps) {
  const [form, setForm] = useState({
    nombre:"", telefono:"", email:"",
    tipoRelacion:"", esClienteBantrab:"", accionesPrevias:"",
    fuenteReferencia:"", observaciones:"",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const selOpts = {
    tipoRelacion:     ["Empleado activo","Ex empleado","Familiar de empleado","Externo interesado"],
    esClienteBantrab: ["Sí – Cuenta de ahorro","Sí – Cuenta corriente","Sí – Crédito activo","No es cliente","En proceso"],
    accionesPrevias:  ["No – primera vez","Sí – Acciones ordinarias","Sí – Acciones preferentes","Desconoce"],
    fuenteReferencia: ["Referido por empleado","Visita espontánea","Convocatoria asamblea","Medio digital"],
  };

  return (
    <Card accent={C.blue}>
      <div style={{ padding:"20px 24px 18px", background:"var(--status-info-panel)",
        borderBottom:"1px solid #BFDBFE", display:"flex", alignItems:"flex-start", gap:18 }}>
        <div style={{ width:88, height:88, borderRadius:12, flexShrink:0,
          background:"var(--status-info-avatar)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:34, border:`2.5px solid ${C.blue}`, boxShadow:`0 2px 12px ${C.blue}33` }}>🔍</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
            <span style={{ fontSize:19, fontWeight:700, color:"var(--status-info-title)" }}>Registro No Encontrado</span>
            <Tag bg={C.blueLt} color={C.blue}>Potencial Accionista</Tag>
          </div>
          <div style={{ fontSize:12, color:"#3B82F6", marginBottom:14 }}>
            DPI: <strong style={{ color:"var(--status-info-title)" }}>{dpi}</strong> — Sin registros en el sistema central
          </div>
        </div>
      </div>

      <SectionHeader title="Consulta Preliminar — Relación con BANTRAB" />
      <div style={{ padding:"16px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <FormField label="Nombre Completo" col="span 2">
            <input value={form.nombre} onChange={set("nombre")} disabled={saved}
              placeholder="Nombre del posible accionista" style={inputSx} />
          </FormField>
          <FormField label="Teléfono">
            <input value={form.telefono} onChange={set("telefono")} disabled={saved}
              placeholder="5555-1234" style={inputSx} />
          </FormField>
          <FormField label="Correo Electrónico" col="span 2">
            <input value={form.email} onChange={set("email")} type="email" disabled={saved}
              placeholder="correo@ejemplo.com" style={inputSx} />
          </FormField>
          <FormField label="Tipo de Relación">
            <select value={form.tipoRelacion} onChange={set("tipoRelacion")} disabled={saved} style={inputSx}>
              <option value="">Seleccionar...</option>
              {selOpts.tipoRelacion.map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="¿Es cliente BANTRAB?">
            <select value={form.esClienteBantrab} onChange={set("esClienteBantrab")} disabled={saved} style={inputSx}>
              <option value="">Seleccionar...</option>
              {selOpts.esClienteBantrab.map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="¿Acciones previas?">
            <select value={form.accionesPrevias} onChange={set("accionesPrevias")} disabled={saved} style={inputSx}>
              <option value="">Seleccionar...</option>
              {selOpts.accionesPrevias.map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="Fuente de Referencia" col="span 2">
            <select value={form.fuenteReferencia} onChange={set("fuenteReferencia")} disabled={saved} style={inputSx}>
              <option value="">Seleccionar...</option>
              {selOpts.fuenteReferencia.map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="Nombre de las Instituciones donde laboró entre los años 1966 a 1991" col="span 3">
            <textarea value={form.observaciones} onChange={set("observaciones")} disabled={saved}
              rows={2} placeholder="Ingrese el nombre de las instituciones..."
              style={{ ...inputSx, resize:"vertical" as const, lineHeight:1.6 }} />
          </FormField>
        </div>
        <div style={{ marginTop:14, display:"flex", gap:8, alignItems:"center" }}>
          {!saved ? (
            <Btn variant="blue" size="sm"
              onClick={() => onSave({ ...form, dpiConsultado: dpi })}
              disabled={saving || !form.nombre}>
              {saving
                ? "Guardando..."
                : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Guardar Prospecto</>}
            </Btn>
          ) : (
            <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>
              ✓ Prospecto guardado exitosamente
            </span>
          )}
          {saveError && (
            <span style={{ fontSize:12, color:C.red, fontWeight:500 }}>⚠ {saveError}</span>
          )}
        </div>
      </div>

      <SectionHeader title="Entrega Promocional" />
      <div style={{ padding:"14px 24px 18px" }}>
        <PromoSection checked={false} saved={false} loading={false} error={null}
          onToggle={() => {}} onSave={() => {}} disabled />
      </div>

      <ClassificationPanel status="potencial" chips={[
        { label:"Registro", value:"Pendiente" },
        { label:"Asamblea", value:"Sin historial" },
        { label:"Seguimiento", value:"Requerido" },
      ]} />
    </Card>
  );
}
