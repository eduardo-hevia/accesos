// ── Application Hooks — Use case orchestration ────────────────────────────────

import { useState, useCallback } from "react";
import type { Accionista, AuthSession, Prospecto } from "../../core/entities/index";
import {
  accionistaService,
  prospectoService,
  authService,
} from "../../infrastructure/ServiceFactory";

// ─── useAuth ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(() =>
    authService.getSession()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (usuario: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await authService.login(usuario, password);
    setLoading(false);
    if (result.ok) {
      setSession(result.data);
    } else {
      setError(result.message);
    }
    return result.ok;
  }, []);

  const logout = useCallback(() => {
    authService.clearSession();
    setSession(null);
  }, []);

  return { session, loading, error, login, logout };
}

// ─── useAccionista ────────────────────────────────────────────────────────────
export type SearchState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "found"; data: Accionista }
  | { type: "not_found"; dpi: string }
  | { type: "error"; message: string };

export function useAccionista() {
  const [state, setState] = useState<SearchState>({ type: "idle" });
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const buscar = useCallback(async (dpi: string) => {
    if (!dpi.trim()) return;
    setState({ type: "loading" });
    const result = await accionistaService.buscar(dpi.trim());
    if (result.ok) {
      setState({ type: "found", data: result.data });
    } else if (result.code === "NOT_FOUND") {
      setState({ type: "not_found", dpi: dpi.trim() });
    } else {
      setState({ type: "error", message: result.message });
    }
  }, []);

  const registrarPromocional = useCallback(
    async (dpi: string, entregado: boolean) => {
      setPromoLoading(true);
      setPromoError(null);
      const result = await accionistaService.registrarPromocional(dpi, entregado);
      setPromoLoading(false);
      if (result.ok) {
        setState({ type: "found", data: result.data });
      } else {
        setPromoError(result.message);
      }
      return result.ok;
    },
    []
  );

  const reset = useCallback(() => {
    setState({ type: "idle" });
    setPromoError(null);
  }, []);

  return { state, buscar, reset, registrarPromocional, promoLoading, promoError };
}

// ─── useProspecto ─────────────────────────────────────────────────────────────
export function useProspecto() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Prospecto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crear = useCallback(
    async (data: Omit<Prospecto, "id" | "creadoEn" | "creadoPor">) => {
      setLoading(true);
      setError(null);
      const result = await prospectoService.crear(data);
      setLoading(false);
      if (result.ok) {
        setSaved(result.data);
      } else {
        setError(result.message);
      }
      return result.ok;
    },
    []
  );

  const resetProspecto = useCallback(() => {
    setSaved(null);
    setError(null);
  }, []);

  return { loading, saved, error, crear, resetProspecto };
}
