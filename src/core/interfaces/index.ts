// ── Service Interfaces — Ports ────────────────────────────────────────────────
// Application layer depends on these. Infrastructure implements them.

import type { Accionista, Prospecto, AuthSession } from "../entities/index";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

export interface AccionistaService {
  buscar(dpi: string): Promise<ServiceResult<Accionista>>;
  registrarPromocional(dpi: string, entregado: boolean): Promise<ServiceResult<Accionista>>;
}

export interface ProspectoService {
  crear(data: Omit<Prospecto, "id" | "creadoEn" | "creadoPor">): Promise<ServiceResult<Prospecto>>;
}

export interface AuthService {
  login(usuario: string, password: string): Promise<ServiceResult<AuthSession>>;
  getSession(): AuthSession | null;
  clearSession(): void;
}
