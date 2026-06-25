// ── AccionistaResult — Resultado de la consulta (vista unificada) ─────────────
// Compone: panel centralizado + (potencial) consulta preliminar + secciones de
// captura (talla, alimentación) + entrega promocional + acción de salida.
// Los modales de confirmación reutilizan <ConfirmDialog/>. Sin lógica de backend.
// El padre monta uno por accionista (key={data.dpi}) para reiniciar el estado.
import { useState } from "react";
import type { Accionista, TallaPlayera, TipoAlimentacion } from "../../../core/entities/index";
import { C, Section } from "../../../ui/components/index";
import { AccionistaPanel } from "./AccionistaPanel";
import { TallaSection, AlimentacionSection } from "./AccesoPreferencias";
import { ConfirmDialog } from "./ConfirmDialog";
import { PromoSection } from "./PromoSection";
import { PotencialForm } from "./PotencialForm";

export function AccionistaResult({ data }: { data: Accionista }) {
  const [talla, setTalla] = useState<TallaPlayera | null>(null);
  const [alimentacion, setAlimentacion] = useState<TipoAlimentacion | null>(null);

  // Entrega promocional (mock) — confirmada mediante modal en estado actualizado.
  const [promoSaved, setPromoSaved] = useState(false);
  const [confirmPromo, setConfirmPromo] = useState(false);
  const [confirmSalida, setConfirmSalida] = useState(false);

  const isActualizado   = data.status === "actualizado";
  const isDesactualizado = data.status === "desactualizado";
  const isPotencial     = data.status === "potencial";

  return (
    <>
      <AccionistaPanel data={data} />

      {/* Información disponible del posible accionista */}
      {isPotencial && <PotencialForm dpi={data.dpi} />}

      {/* Talla y alimentación: solo accionistas reales (no potenciales) */}
      {!isPotencial && (
        <>
          <TallaSection value={talla} onChange={setTalla} />
          <AlimentacionSection value={alimentacion} onChange={setAlimentacion} />
        </>
      )}

      {/* Entrega Promocional */}
      {isActualizado && (
        <Section title="Entrega Promocional">
          <PromoSection
            checked={false} saved={promoSaved} loading={false} error={null}
            onToggle={() => setConfirmPromo(true)} onSave={() => setConfirmPromo(true)} />
        </Section>
      )}
      {isDesactualizado && (
        <Section title="Entrega Promocional">
          <PromoSection
            checked={false} saved={false} loading={false} error={null}
            onToggle={() => {}} onSave={() => {}}
            disabled
            disabledTitle="Material promocional no disponible"
            disabledDescription="El expediente está desactualizado. Actualice los datos antes de registrar la entrega promocional." />
        </Section>
      )}

      {/* Acción final — barra de cierre del proceso. Modal reutilizable; sin backend. */}
      <div style={{ marginTop:4, background:"linear-gradient(135deg, var(--white), var(--g50))",
        border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 24px",
        boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:18, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, minWidth:0 }}>
          <div style={{ width:46, height:46, borderRadius:12, flexShrink:0, background:C.goldLt,
            border:`1px solid ${C.gold}33`, display:"flex", alignItems:"center", justifyContent:"center", color:C.gold }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:16.5, fontWeight:800, color:C.g900 }}>Finalizar atención</div>
            <div style={{ fontSize:14, fontWeight:500, color:C.g600, marginTop:2 }}>
              Marque la salida cuando el accionista haya sido atendido.
            </div>
          </div>
        </div>
        <button type="button" onClick={() => setConfirmSalida(true)} style={{
          fontFamily:"inherit", fontSize:15.5, fontWeight:700, padding:"13px 26px",
          borderRadius:11, cursor:"pointer", border:"none", color:"#fff", background:C.gold,
          display:"inline-flex", alignItems:"center", gap:8, flexShrink:0,
          boxShadow:`0 5px 16px ${C.gold}45` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Marcar Salida del Accionista
        </button>
      </div>

      {/* Modal — confirmar entrega promocional (actualizado) */}
      <ConfirmDialog
        open={confirmPromo}
        tone="info"
        title="Confirmar entrega promocional"
        message={<>¿Confirma que se entregó el material promocional a <strong>{data.nombre}</strong>?</>}
        confirmText="Sí, registrar entrega"
        cancelText="Cancelar"
        onConfirm={() => { setPromoSaved(true); setConfirmPromo(false); }}
        onCancel={() => setConfirmPromo(false)}
      />

      {/* Modal — marcar salida del accionista */}
      <ConfirmDialog
        open={confirmSalida}
        tone="warning"
        title="Marcar salida del accionista"
        message={<>¿Está seguro de marcar la salida de <strong>{data.nombre}</strong>? Esta acción se integrará con el backend próximamente.</>}
        confirmText="Sí, marcar salida"
        cancelText="Cancelar"
        onConfirm={() => setConfirmSalida(false)}
        onCancel={() => setConfirmSalida(false)}
      />
    </>
  );
}
