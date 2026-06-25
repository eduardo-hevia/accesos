// ── Mock Services — Infrastructure ───────────────────────────────────────────
// Used when VITE_USE_MOCK=true. No network calls.

import type { Accionista, Prospecto, AuthSession } from "../../core/entities/index";
import type {
  AccionistaService,
  AuthService,
  ProspectoService,
  ServiceResult,
} from "../../core/interfaces/index";

const delay = (ms = 700) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Seed data ────────────────────────────────────────────────────────────────
const MOCK_STORE = new Map<string, Accionista>([
  [
    "2265780540101",
    {
      id: "acc-001",
      dpi: "2265780540101",
      registro: "ACC-005821",
      nombre: "MENDOZA ARRIAGA CARLOS ROBERTO",
      fechaNac: "07/08/1978",
      estado: "21 – Alta Actualizado",
      vence: "31/05/2029",
      estadoCivil: "CASADO/A",
      fecha: "14/04/2026",
      correlativo: "2",
      genero: "MASCULINO",
      acciones: "142",
      tipoAccion: "Ordinaria",
      ultimaAsamblea: "Asamblea Ordinaria 2025",
      avatarUrl: "https://i.pravatar.cc/150?img=52",
      status: "actualizado",
      promocionalEntregado: false,
      promocionalFecha: null,
    },
  ],
  [
    "1234567890101",
    {
      id: "acc-002",
      dpi: "1234567890101",
      registro: "ACC-001087",
      nombre: "VÁSQUEZ MORALES PEDRO ANTONIO",
      fechaNac: "03/11/1948",
      estado: "10 – Alta Sin Actualizar",
      vence: "08/03/2023",
      estadoCivil: "VIUDO/A",
      fecha: "22/06/2021",
      correlativo: "8",
      genero: "MASCULINO",
      acciones: "320",
      tipoAccion: "Preferente",
      ultimaAsamblea: "Asamblea Ordinaria 2021",
      avatarUrl: "https://i.pravatar.cc/150?img=68",
      status: "desactualizado",
      promocionalEntregado: false,
      promocionalFecha: null,
    },
  ],
]);

// ─── MockAccionistaService ─────────────────────────────────────────────────────
export class MockAccionistaService implements AccionistaService {
  async buscar(dpi: string): Promise<ServiceResult<Accionista>> {
    await delay(1200); // visible para el spinner; el backend real definirá el tiempo
    const found = MOCK_STORE.get(dpi);
    if (!found) {
      return { ok: false, code: "NOT_FOUND", message: "Accionista no encontrado." };
    }
    return { ok: true, data: found };
  }

  async registrarPromocional(dpi: string, entregado: boolean): Promise<ServiceResult<Accionista>> {
    await delay(400);
    const current = MOCK_STORE.get(dpi);
    if (!current) return { ok: false, code: "NOT_FOUND", message: "Accionista no encontrado." };
    const updated: Accionista = {
      ...current,
      promocionalEntregado: entregado,
      promocionalFecha: entregado ? new Date().toISOString() : null,
    };
    MOCK_STORE.set(dpi, updated);
    return { ok: true, data: updated };
  }
}

// ─── MockProspectoService ──────────────────────────────────────────────────────
export class MockProspectoService implements ProspectoService {
  private store: Prospecto[] = [];

  async crear(data: Omit<Prospecto, "id" | "creadoEn" | "creadoPor">): Promise<ServiceResult<Prospecto>> {
    await delay(500);
    // Business rule: cannot create prospecto if DPI is an accionista
    if (MOCK_STORE.has(data.dpiConsultado)) {
      return { ok: false, code: "ALREADY_ACCIONISTA", message: "El DPI pertenece a un accionista registrado." };
    }
    const prospecto: Prospecto = {
      ...data,
      id: `prosp-${Date.now()}`,
      creadoEn: new Date().toISOString(),
      creadoPor: "mock-user",
    };
    this.store.push(prospecto);
    return { ok: true, data: prospecto };
  }
}

// ─── MockAuthService ───────────────────────────────────────────────────────────
const SESSION_KEY = "bantrab_session";

export class MockAuthService implements AuthService {
  async login(usuario: string, password: string): Promise<ServiceResult<AuthSession>> {
    await delay(400);
    const valid = (usuario === "supervisor" && password === "1234") ||
                  (usuario === "admin" && password === "admin123");
    if (!valid) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Credenciales incorrectas." };
    }
    const session: AuthSession = {
      token: `mock-token-${Date.now()}`,
      usuario,
      rol: usuario === "admin" ? "admin" : "supervisor",
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, data: session };
  }

  getSession(): AuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
