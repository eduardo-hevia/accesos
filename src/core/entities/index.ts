// ── Core Entities — Frontend mirror of backend domain ────────────────────────
// No framework deps. Pure TypeScript interfaces.

export type AccionistaStatus = "actualizado" | "desactualizado" | "potencial";

export interface Accionista {
  readonly id: string;
  readonly dpi: string;
  readonly registro: string;
  readonly nombre: string;
  readonly fechaNac: string;
  readonly estado: string;
  readonly vence: string;
  readonly estadoCivil: string;
  readonly fecha: string;
  readonly correlativo: string;
  readonly genero: string;
  readonly acciones: string;
  readonly tipoAccion: string;
  readonly ultimaAsamblea: string;
  readonly avatarUrl: string;
  readonly status: AccionistaStatus;
  readonly promocionalEntregado: boolean;
  readonly promocionalFecha: string | null;
  // Solo aplica al estado "potencial". El backend completará estos datos a futuro.
  readonly observaciones?: string;
}

// ── Capturas del operador durante el acceso ──────────────────────────────────
// Preparado para futura persistencia en backend (talla / alimentación).
export type TallaPlayera = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL";
export type TipoAlimentacion = "Normal" | "Saludable" | "De dieta";

export interface PreferenciasAcceso {
  readonly talla: TallaPlayera | null;
  readonly alimentacion: TipoAlimentacion | null;
}

export interface Prospecto {
  readonly id: string;
  readonly dpiConsultado: string;
  readonly nombre: string;
  readonly telefono: string;
  readonly email: string;
  readonly tipoRelacion: string;
  readonly esClienteBantrab: string;
  readonly accionesPrevias: string;
  readonly fuenteReferencia: string;
  readonly observaciones: string;
  readonly creadoEn: string;
  readonly creadoPor: string;
}

export interface AuthSession {
  readonly token: string;
  readonly usuario: string;
  readonly rol: string;
}

// API response envelope
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  code?: string;
  message?: string;
}
