// ── PotencialForm — Consulta preliminar del posible accionista ───────────────
// Información disponible + relación con BANTRAB para un DPI sin registro central.
// Usa el hook useProspecto (mock) — listo para integración con backend.
import { useState } from "react";
import { useProspecto } from "../../../application/hooks/index";
import { C, Section, FormField, inputSx, Btn } from "../../../ui/components/index";

const SEL_OPTS = {
  tipoRelacion:     ["Empleado activo", "Ex empleado", "Familiar de empleado", "Externo interesado"],
  esClienteBantrab: ["Sí – Cuenta de ahorro", "Sí – Cuenta corriente", "Sí – Crédito activo", "No es cliente", "En proceso"],
  accionesPrevias:  ["No – primera vez", "Sí – Acciones ordinarias", "Sí – Acciones preferentes", "Desconoce"],
  fuenteReferencia: ["Referido por empleado", "Visita espontánea", "Convocatoria asamblea", "Medio digital"],
};

export function PotencialForm({ dpi }: { dpi: string }) {
  const { loading: saving, saved, error: saveError, crear } = useProspecto();
  const [form, setForm] = useState({
    nombre: "", telefono: "", email: "",
    tipoRelacion: "", esClienteBantrab: "", accionesPrevias: "",
    fuenteReferencia: "", instituciones: "", observaciones: "",
  });
  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const isSaved = !!saved;

  const handleSave = () =>
    crear({
      dpiConsultado: dpi, nombre: form.nombre, telefono: form.telefono, email: form.email,
      tipoRelacion: form.tipoRelacion, esClienteBantrab: form.esClienteBantrab,
      accionesPrevias: form.accionesPrevias, fuenteReferencia: form.fuenteReferencia,
      observaciones: [form.observaciones, form.instituciones].filter(Boolean).join(" | "),
    });

  return (
    <Section title="Consulta Preliminar — Relación con BANTRAB">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <FormField label="Nombre Completo" col="span 2">
          <input value={form.nombre} onChange={set("nombre")} disabled={isSaved}
            placeholder="Nombre del posible accionista" style={inputSx} />
        </FormField>
        <FormField label="Teléfono">
          <input value={form.telefono} onChange={set("telefono")} disabled={isSaved}
            placeholder="5555-1234" style={inputSx} />
        </FormField>
        <FormField label="Correo Electrónico" col="span 2">
          <input value={form.email} onChange={set("email")} type="email" disabled={isSaved}
            placeholder="correo@ejemplo.com" style={inputSx} />
        </FormField>
        <FormField label="Tipo de Relación">
          <select value={form.tipoRelacion} onChange={set("tipoRelacion")} disabled={isSaved} style={inputSx}>
            <option value="">Seleccionar...</option>
            {SEL_OPTS.tipoRelacion.map(o => <option key={o}>{o}</option>)}
          </select>
        </FormField>
        <FormField label="¿Es cliente BANTRAB?">
          <select value={form.esClienteBantrab} onChange={set("esClienteBantrab")} disabled={isSaved} style={inputSx}>
            <option value="">Seleccionar...</option>
            {SEL_OPTS.esClienteBantrab.map(o => <option key={o}>{o}</option>)}
          </select>
        </FormField>
        <FormField label="¿Acciones previas?">
          <select value={form.accionesPrevias} onChange={set("accionesPrevias")} disabled={isSaved} style={inputSx}>
            <option value="">Seleccionar...</option>
            {SEL_OPTS.accionesPrevias.map(o => <option key={o}>{o}</option>)}
          </select>
        </FormField>
        <FormField label="Fuente de Referencia" col="span 2">
          <select value={form.fuenteReferencia} onChange={set("fuenteReferencia")} disabled={isSaved} style={inputSx}>
            <option value="">Seleccionar...</option>
            {SEL_OPTS.fuenteReferencia.map(o => <option key={o}>{o}</option>)}
          </select>
        </FormField>
        <FormField label="Nombre de las Instituciones donde laboró entre los años 1966 a 1991" col="span 3">
          <textarea value={form.instituciones} onChange={set("instituciones")} disabled={isSaved}
            rows={2} placeholder="Ingrese el nombre de las instituciones..."
            style={{ ...inputSx, resize:"vertical", lineHeight:1.6 }} />
        </FormField>
        <FormField label="Observaciones" col="span 3">
          <textarea value={form.observaciones} onChange={set("observaciones")} disabled={isSaved}
            rows={2} placeholder="Notas del operador sobre el posible accionista..."
            style={{ ...inputSx, resize:"vertical", lineHeight:1.6 }} />
        </FormField>
      </div>

      <div style={{ marginTop:14, display:"flex", gap:10, alignItems:"center" }}>
        {!isSaved ? (
          <Btn variant="blue" size="sm" onClick={handleSave} disabled={saving || !form.nombre}>
            {saving ? "Guardando..." : (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg> Guardar Prospecto</>
            )}
          </Btn>
        ) : (
          <span style={{ fontSize:13.5, color:C.green, fontWeight:700 }}>✓ Prospecto guardado exitosamente</span>
        )}
        {saveError && <span style={{ fontSize:13.5, color:C.red, fontWeight:500 }}>⚠ {saveError}</span>}
      </div>
    </Section>
  );
}
