// ── useCasosEspeciales — Application Hook ─────────────────────────────────────
import { useState, useCallback, useEffect } from "react";
import type { CasoEspecial, CasoEspecialFormData, BitacoraMovimiento, CasosStats } from "../../core/entities/CasoEspecial";
import { MockCasoEspecialService } from "../../infrastructure/mock/mockCasoEspecialService";

// Singleton (swap for ApiCasoEspecialService when VITE_USE_MOCK=false)
const svc = new MockCasoEspecialService();

function computeStats(casos: CasoEspecial[]): CasosStats {
  const activos  = casos.filter(c => c.activo).length;
  const denegados = casos.filter(c => c.activo && c.estadoPrecal === "Denegado").length;
  const fallecidos = casos.filter(c => c.activo && c.estadoPrecal === "Fallecido").length;
  const dates = casos.filter(c => c.activo).map(c => c.registrado);
  const ultimaCarga = dates.length
    ? dates.reduce((a, b) => (new Date(a.split("/").reverse().join("-")) > new Date(b.split("/").reverse().join("-")) ? a : b))
    : null;
  return { activos, denegados, fallecidos, ultimaCarga };
}

export function useCasosEspeciales(usuario: string) {
  const [casos,    setCasos]    = useState<CasoEspecial[]>([]);
  const [bitacora, setBitacora] = useState<BitacoraMovimiento[]>([]);
  const [stats,    setStats]    = useState<CasosStats>({ activos:0, denegados:0, fallecidos:0, ultimaCarga:null });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState<string | null>(null);

  // Helper: reload list + bitacora
  const reload = useCallback(async () => {
    setLoading(true);
    const [listRes, bitRes] = await Promise.all([svc.listar(), svc.getBitacora()]);
    if (listRes.ok) { setCasos(listRes.data); setStats(computeStats(listRes.data)); }
    if (bitRes.ok)  setBitacora(bitRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const crear = useCallback(async (data: CasoEspecialFormData) => {
    setSaving(true); setError(null); setSuccess(null);
    const res = await svc.crear(data, usuario);
    setSaving(false);
    if (res.ok) { setSuccess("Registro creado correctamente."); await reload(); }
    else setError(res.message);
    return res.ok;
  }, [usuario, reload]);

  const editar = useCallback(async (id: string, data: Partial<CasoEspecialFormData>) => {
    setSaving(true); setError(null); setSuccess(null);
    const res = await svc.editar(id, data, usuario);
    setSaving(false);
    if (res.ok) { setSuccess("Registro actualizado."); await reload(); }
    else setError(res.message);
    return res.ok;
  }, [usuario, reload]);

  const eliminar = useCallback(async (id: string) => {
    setSaving(true); setError(null); setSuccess(null);
    const res = await svc.eliminar(id, usuario);
    setSaving(false);
    if (res.ok) { setSuccess("Registro eliminado."); await reload(); }
    else setError(res.message);
    return res.ok;
  }, [usuario, reload]);

  const cargaMasiva = useCallback(async (filas: CasoEspecialFormData[]) => {
    setSaving(true); setError(null); setSuccess(null);
    const res = await svc.cargaMasiva(filas, usuario);
    setSaving(false);
    if (res.ok) { setSuccess(`Carga masiva: ${res.data.insertados} insertados, ${res.data.errores} errores.`); await reload(); }
    else setError(res.message);
    return res.ok;
  }, [usuario, reload]);

  const clearFeedback = useCallback(() => { setError(null); setSuccess(null); }, []);

  return { casos, bitacora, stats, loading, saving, error, success, crear, editar, eliminar, cargaMasiva, clearFeedback };
}
