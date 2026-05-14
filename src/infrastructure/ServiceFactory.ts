// ── ServiceFactory — Mock / Real Switch ──────────────────────────────────────
// Single decision point. Components never import services directly.

import { MockAccionistaService, MockProspectoService, MockAuthService } from "./mock/mockServices";
import { ApiAccionistaService, ApiProspectoService, ApiAuthService } from "./api/apiServices";
import type { AccionistaService, AuthService, ProspectoService } from "../core/interfaces/index";

const USE_MOCK = (import.meta.env["VITE_USE_MOCK"] as string) === "true";

export const accionistaService: AccionistaService = USE_MOCK
  ? new MockAccionistaService()
  : new ApiAccionistaService();

export const prospectoService: ProspectoService = USE_MOCK
  ? new MockProspectoService()
  : new ApiProspectoService();

export const authService: AuthService = USE_MOCK
  ? new MockAuthService()
  : new ApiAuthService();

export { USE_MOCK };
