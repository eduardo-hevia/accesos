// ── CasoEspecial — Entidad de dominio ────────────────────────────────────────

export type TipoDocumento = "DPI" | "Cédula" | "Pasaporte";

export type EstadoPrecalificacion =
  | "Denegado"
  | "Fallecido"
  | "Revocado"
  | "Limitación Participación Asamblea"
  | "Acciones Adquiridas Anómalamente";

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
  denegados: number;
  fallecidos: number;
  ultimaCarga: string | null;
}
