// ── CasoEspecialModal — Create / Edit ─────────────────────────────────────────
import { useState, useEffect } from "react";
import type { CasoEspecial, CasoEspecialFormData, EstadoPrecalificacion, TipoDocumento } from "../../../core/entities/CasoEspecial";
import { C } from "../../../ui/components/index";

const TIPOS_DOC: TipoDocumento[] = ["DPI", "Cédula", "Pasaporte"];
const ESTADOS: EstadoPrecalificacion[] = [
  "Denegado", "Fallecido", "Revocado",
  "Limitación Participación Asamblea",
  "Acciones Adquiridas Anómalamente",
];

interface ModalProps {
  mode: "crear" | "editar";
  caso?: CasoEspecial;
  saving: boolean;
  onSave: (data: CasoEspecialFormData) => Promise<boolean>;
  onClose: () => void;
}

const emptyForm = (): CasoEspecialFormData => ({
  tipDoc: "DPI", noDocumento: "", nombreCompleto: "",
  estadoPrecal: "Denegado", fechaDefuncion: "",
});

export function CasoEspecialModal({ mode, caso, saving, onSave, onClose }: ModalProps) {
  const [form, setForm] = useState<CasoEspecialFormData>(emptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof CasoEspecialFormData, string>>>({});

  useEffect(() => {
    if (mode === "editar" && caso) {
      setForm({
        tipDoc:         caso.tipDoc,
        noDocumento:    caso.noDocumento,
        nombreCompleto: caso.nombreCompleto,
        estadoPrecal:   caso.estadoPrecal,
        fechaDefuncion: caso.fechaDefuncion ?? "",
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [mode, caso]);

  const set = <K extends keyof CasoEspecialFormData>(k: K, v: CasoEspecialFormData[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.noDocumento.trim())    e.noDocumento    = "Requerido";
    if (!form.nombreCompleto.trim()) e.nombreCompleto = "Requerido";
    if (form.estadoPrecal === "Fallecido" && !form.fechaDefuncion)
      e.fechaDefuncion = "Fecha de defunción requerida para estado Fallecido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    const ok = await onSave(form);
    if (ok) onClose();
  }

  const iStyle: React.CSSProperties = {
    width:"100%", padding:"9px 12px",
    fontFamily:"inherit", fontSize:13,
    border:`1px solid ${C.border}`, borderRadius:8,
    background:C.g50, color:C.g900, outline:"none",
  };

  const labelSx: React.CSSProperties = {
    fontSize:10, fontWeight:700, color:C.g500,
    textTransform:"uppercase", letterSpacing:"0.08em",
    display:"block", marginBottom:5,
  };

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,0,0.45)", backdropFilter:"blur(2px)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{
        background:C.white, borderRadius:14, width:"100%", maxWidth:540,
        boxShadow:"0 20px 60px rgba(0,0,0,0.2)",
        border:`1px solid ${C.border}`, overflow:"hidden",
        animation:"fadeUp 0.25s cubic-bezier(.16,1,.3,1)",
      }}>
        {/* Header */}
        <div style={{
          padding:"18px 24px", borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background: mode === "crear" ? C.tealLt : "#EFF6FF",
        }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.g900 }}>
              {mode === "crear" ? "➕ Nuevo Registro" : "✏️ Editar Registro"}
            </div>
            <div style={{ fontSize:11, color:C.g500, marginTop:2 }}>
              Mantenimiento de Casos Especiales de Precalificación
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"transparent", border:"none", cursor:"pointer",
            fontSize:20, color:C.g400, lineHeight:1, padding:"2px 6px",
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          {/* Row 1 */}
          <div style={{ display:"grid", gridTemplateColumns:"140px 1fr", gap:12 }}>
            <div>
              <label style={labelSx}>Tipo</label>
              <select value={form.tipDoc} onChange={e => set("tipDoc", e.target.value as TipoDocumento)} style={iStyle}>
                {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelSx}>No. Documento</label>
              <input
                value={form.noDocumento}
                onChange={e => set("noDocumento", e.target.value)}
                placeholder="Ej. 2265780540101"
                style={{ ...iStyle, borderColor: errors.noDocumento ? C.red : C.border }}
              />
              {errors.noDocumento && <span style={{ fontSize:11, color:C.red }}>{errors.noDocumento}</span>}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label style={labelSx}>Nombre Completo</label>
            <input
              value={form.nombreCompleto}
              onChange={e => set("nombreCompleto", e.target.value)}
              placeholder="Apellidos y Nombres"
              style={{ ...iStyle, borderColor: errors.nombreCompleto ? C.red : C.border }}
            />
            {errors.nombreCompleto && <span style={{ fontSize:11, color:C.red }}>{errors.nombreCompleto}</span>}
          </div>

          {/* Estado */}
          <div>
            <label style={labelSx}>Estado de Precalificación</label>
            <select value={form.estadoPrecal} onChange={e => set("estadoPrecal", e.target.value as EstadoPrecalificacion)} style={iStyle}>
              {ESTADOS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Fecha defunción — solo si Fallecido */}
          {form.estadoPrecal === "Fallecido" && (
            <div>
              <label style={labelSx}>Fecha de Defunción</label>
              <input
                type="date" value={form.fechaDefuncion}
                onChange={e => set("fechaDefuncion", e.target.value)}
                style={{ ...iStyle, borderColor: errors.fechaDefuncion ? C.red : C.border }}
              />
              {errors.fechaDefuncion && <span style={{ fontSize:11, color:C.red }}>{errors.fechaDefuncion}</span>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding:"14px 24px", borderTop:`1px solid ${C.border}`,
          display:"flex", justifyContent:"flex-end", gap:10,
          background:C.g50,
        }}>
          <button onClick={onClose} style={{
            fontFamily:"inherit", fontSize:13, fontWeight:600,
            padding:"9px 20px", borderRadius:8,
            border:`1px solid ${C.border}`, background:C.white,
            color:C.g600, cursor:"pointer",
          }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={{
            fontFamily:"inherit", fontSize:13, fontWeight:600,
            padding:"9px 20px", borderRadius:8, border:"none",
            background: saving ? C.g300 : C.teal,
            color:"#fff", cursor: saving ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", gap:6,
            boxShadow: saving ? "none" : `0 2px 8px ${C.teal}44`,
          }}>
            {saving
              ? <><svg style={{ animation:"spin 0.8s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-18 0"/></svg> Guardando...</>
              : mode === "crear" ? "Guardar Registro" : "Actualizar Registro"}
          </button>
        </div>
      </div>
    </div>
  );
}
