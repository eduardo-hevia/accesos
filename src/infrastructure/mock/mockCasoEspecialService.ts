// ── MockCasoEspecialService — Infrastructure ──────────────────────────────────
import type { CasoEspecial, CasoEspecialFormData, BitacoraMovimiento } from "../../core/entities/CasoEspecial";
import type { CasoEspecialService } from "../../core/interfaces/CasoEspecialService";
import type { ServiceResult } from "../../core/interfaces/index";

const delay = (ms = 500) => new Promise<void>(r => setTimeout(r, ms));

const fmt = (n: number) => String(n).padStart(3, "0");

// ── Seed data (refleja la imagen exactamente) ─────────────────────────────────
let STORE: CasoEspecial[] = [
  {
    id: "001", tipDoc: "DPI", noDocumento: "2265780540101",
    nombreCompleto: "MENDOZA ARRIAGA CARLOS ROBERTO",
    estadoPrecal: "Denegado", fechaDefuncion: null,
    registrado: "10/04/2026", activo: true,
  },
  {
    id: "002", tipDoc: "DPI", noDocumento: "1234567890101",
    nombreCompleto: "LOPEZ PÉREZ MARÍA ELENA",
    estadoPrecal: "Fallecido", fechaDefuncion: "12/01/2025",
    registrado: "11/04/2026", activo: true,
  },
  {
    id: "003", tipDoc: "Cédula", noDocumento: "9876543",
    nombreCompleto: "HERRERA CASTILLO JUAN ANTONIO",
    estadoPrecal: "Revocado", fechaDefuncion: null,
    registrado: "11/04/2026", activo: true,
  },
  {
    id: "004", tipDoc: "DPI", noDocumento: "3344556670202",
    nombreCompleto: "RUIZ MORALES ANA PATRICIA",
    estadoPrecal: "Limitación Participación Asamblea", fechaDefuncion: null,
    registrado: "12/04/2026", activo: true,
  },
  {
    id: "005", tipDoc: "DPI", noDocumento: "5566778890303",
    nombreCompleto: "GARCÍA LÓPEZ PEDRO PABLO",
    estadoPrecal: "Acciones Adquiridas Anómalamente", fechaDefuncion: null,
    registrado: "13/04/2026", activo: true,
  },
];

let BITACORA: BitacoraMovimiento[] = [];
let nextId = STORE.length + 1;

function now() {
  return new Date().toLocaleDateString("es-GT");
}

export class MockCasoEspecialService implements CasoEspecialService {
  async listar(): Promise<ServiceResult<CasoEspecial[]>> {
    await delay(400);
    return { ok: true, data: STORE.filter(c => c.activo) };
  }

  async crear(data: CasoEspecialFormData, usuario: string): Promise<ServiceResult<CasoEspecial>> {
    await delay(500);
    const nuevo: CasoEspecial = {
      id: fmt(nextId++),
      tipDoc: data.tipDoc,
      noDocumento: data.noDocumento,
      nombreCompleto: data.nombreCompleto.toUpperCase(),
      estadoPrecal: data.estadoPrecal,
      fechaDefuncion: data.fechaDefuncion || null,
      registrado: now(),
      activo: true,
    };
    STORE = [...STORE, nuevo];
    BITACORA = [{
      id: crypto.randomUUID(),
      accion: "CREAR",
      casoId: nuevo.id,
      descripcion: `Registro creado: ${nuevo.nombreCompleto} — ${nuevo.estadoPrecal}`,
      usuario,
      fecha: new Date().toISOString(),
    }, ...BITACORA];
    return { ok: true, data: nuevo };
  }

  async editar(id: string, data: Partial<CasoEspecialFormData>, usuario: string): Promise<ServiceResult<CasoEspecial>> {
    await delay(400);
    const idx = STORE.findIndex(c => c.id === id);
    if (idx < 0) return { ok: false, code: "NOT_FOUND", message: "Caso no encontrado." };
    const prev = STORE[idx]!;
    const updated: CasoEspecial = {
      ...prev,
      tipDoc:         data.tipDoc         ?? prev.tipDoc,
      noDocumento:    data.noDocumento    ?? prev.noDocumento,
      nombreCompleto: data.nombreCompleto ? data.nombreCompleto.toUpperCase() : prev.nombreCompleto,
      estadoPrecal:   data.estadoPrecal   ?? prev.estadoPrecal,
      fechaDefuncion: data.fechaDefuncion !== undefined ? (data.fechaDefuncion || null) : prev.fechaDefuncion,
    };
    STORE = STORE.map((c, i) => i === idx ? updated : c);
    BITACORA = [{
      id: crypto.randomUUID(),
      accion: "EDITAR",
      casoId: id,
      descripcion: `Registro editado: ${updated.nombreCompleto} — ${updated.estadoPrecal}`,
      usuario,
      fecha: new Date().toISOString(),
    }, ...BITACORA];
    return { ok: true, data: updated };
  }

  async eliminar(id: string, usuario: string): Promise<ServiceResult<void>> {
    await delay(350);
    const idx = STORE.findIndex(c => c.id === id);
    if (idx < 0) return { ok: false, code: "NOT_FOUND", message: "Caso no encontrado." };
    const caso = STORE[idx]!;
    STORE = STORE.map((c, i) => i === idx ? { ...c, activo: false } : c);
    BITACORA = [{
      id: crypto.randomUUID(),
      accion: "ELIMINAR",
      casoId: id,
      descripcion: `Registro eliminado (soft): ${caso.nombreCompleto}`,
      usuario,
      fecha: new Date().toISOString(),
    }, ...BITACORA];
    return { ok: true, data: undefined };
  }

  async cargaMasiva(filas: CasoEspecialFormData[], usuario: string): Promise<ServiceResult<{ insertados: number; errores: number }>> {
    await delay(900);
    let insertados = 0;
    let errores = 0;
    for (const fila of filas) {
      if (!fila.noDocumento || !fila.nombreCompleto) { errores++; continue; }
      STORE = [...STORE, {
        id: fmt(nextId++),
        tipDoc: fila.tipDoc,
        noDocumento: fila.noDocumento,
        nombreCompleto: fila.nombreCompleto.toUpperCase(),
        estadoPrecal: fila.estadoPrecal,
        fechaDefuncion: fila.fechaDefuncion || null,
        registrado: now(),
        activo: true,
      }];
      insertados++;
    }
    BITACORA = [{
      id: crypto.randomUUID(),
      accion: "CARGA_MASIVA",
      casoId: "-",
      descripcion: `Carga masiva: ${insertados} insertados, ${errores} errores`,
      usuario,
      fecha: new Date().toISOString(),
    }, ...BITACORA];
    return { ok: true, data: { insertados, errores } };
  }

  async getBitacora(): Promise<ServiceResult<BitacoraMovimiento[]>> {
    await delay(200);
    return { ok: true, data: BITACORA };
  }
}
