// ── CasoEspecial Service Interface — Port ─────────────────────────────────────
import type { CasoEspecial, CasoEspecialFormData, BitacoraMovimiento } from "../entities/CasoEspecial";
import type { ServiceResult } from "./index";

export interface CasoEspecialService {
  listar(): Promise<ServiceResult<CasoEspecial[]>>;
  crear(data: CasoEspecialFormData, usuario: string): Promise<ServiceResult<CasoEspecial>>;
  editar(id: string, data: Partial<CasoEspecialFormData>, usuario: string): Promise<ServiceResult<CasoEspecial>>;
  eliminar(id: string, usuario: string): Promise<ServiceResult<void>>;   // soft-delete
  cargaMasiva(filas: CasoEspecialFormData[], usuario: string): Promise<ServiceResult<{ insertados: number; errores: number }>>;
  getBitacora(): Promise<ServiceResult<BitacoraMovimiento[]>>;
}
