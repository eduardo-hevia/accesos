// ── Real API Services — Infrastructure ───────────────────────────────────────
// Used when VITE_USE_MOCK=false. Calls Express backend.

import type { Accionista, ApiResponse, AuthSession, Prospecto } from "../../core/entities/index";
import type {
  AccionistaService,
  AuthService,
  ProspectoService,
  ServiceResult,
} from "../../core/interfaces/index";

const BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string)?.trim() || "";
const SESSION_KEY = "bantrab_session";

// ─── Fetch helper ─────────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ServiceResult<T>> {
  try {
    const session = getStoredSession();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(options.headers ?? {}),
    };

    const res = await fetch(`${BASE_URL}/api${path}`, { ...options, headers });
    const json = (await res.json()) as ApiResponse<T>;

    if (!res.ok || !json.ok) {
      return {
        ok: false,
        code: json.code ?? `HTTP_${res.status}`,
        message: json.message ?? "Error desconocido.",
      };
    }

    return { ok: true, data: json.data as T };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión.";
    return { ok: false, code: "NETWORK_ERROR", message };
  }
}

function getStoredSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

// ─── ApiAccionistaService ──────────────────────────────────────────────────────
export class ApiAccionistaService implements AccionistaService {
  async buscar(dpi: string): Promise<ServiceResult<Accionista>> {
    return apiFetch<Accionista>(`/accionistas/${encodeURIComponent(dpi)}`);
  }

  async registrarPromocional(dpi: string, entregado: boolean): Promise<ServiceResult<Accionista>> {
    return apiFetch<Accionista>(
      `/accionistas/${encodeURIComponent(dpi)}/promocional`,
      { method: "PATCH", body: JSON.stringify({ entregado }) }
    );
  }
}

// ─── ApiProspectoService ───────────────────────────────────────────────────────
export class ApiProspectoService implements ProspectoService {
  async crear(data: Omit<Prospecto, "id" | "creadoEn" | "creadoPor">): Promise<ServiceResult<Prospecto>> {
    return apiFetch<Prospecto>("/prospectos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// ─── ApiAuthService ────────────────────────────────────────────────────────────
export class ApiAuthService implements AuthService {
  async login(usuario: string, password: string): Promise<ServiceResult<AuthSession>> {
    const result = await apiFetch<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ usuario, password }),
    });
    if (result.ok) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
    }
    return result;
  }

  getSession(): AuthSession | null {
    return getStoredSession();
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
