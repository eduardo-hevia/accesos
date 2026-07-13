// ── CasoEspecial — Entidad de dominio ────────────────────────────────────────

export type TipoDocumento = "DPI";

export type EstadoPrecalificacion =
  | "Aprobado"
  | "Nuevo"
  | "Denegado"
  | "Acciones Anómalas"
  | "Revocado"
  | "Fallecido"
  | "Limitación Asamblea";

export interface CasoEspecial {
  readonly id: string;             // correlativo formateado 001, 002…
  readonly tipDoc: TipoDocumento;
  readonly noDocumento: string;
  readonly nombreCompleto: string;
  readonly estadoPrecal: EstadoPrecalificacion;
  readonly fechaDefuncion: string | null;  // null si no aplica
  readonly registrado: string;     // fecha DD/MM/YYYY
  readonly activo: boolean;        // soft-delete flag
}

export interface CasoEspecialFormData {
  tipDoc: TipoDocumento;
  noDocumento: string;
  nombreCompleto: string;
  estadoPrecal: EstadoPrecalificacion;
  fechaDefuncion: string;
}

export interface BitacoraMovimiento {
  readonly id: string;
  readonly accion: "CREAR" | "EDITAR" | "ELIMINAR" | "CARGA_MASIVA";
  readonly casoId: string;
  readonly descripcion: string;
  readonly usuario: string;
  readonly fecha: string;
}

// Stats derivados
export interface CasosStats {
  activos: number;
  porEstado: Record<EstadoPrecalificacion, number>;
  ultimaCarga: string | null;
}
