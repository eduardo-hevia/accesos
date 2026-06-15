// ── CasosEspecialesPage — Mantenimiento de Casos Especiales ───────────────────
import { useState, useMemo } from "react";
import type { CasoEspecial, CasoEspecialFormData, EstadoPrecalificacion } from "../../core/entities/CasoEspecial";
import { useCasosEspeciales } from "../../application/hooks/useCasosEspeciales";
import { CasoEspecialModal } from "./components/CasoEspecialModal";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { HeaderStatCard, IcoBan, IcoCheck, IcoDate, IcoUsers, PageHeader } from "../../ui/layout";
import type { AuthSession } from "../../core/entities/index";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  teal:"var(--teal)", tealDk:"var(--teal-dk)", tealLt:"var(--teal-lt)", tealPill:"var(--teal-pill)",
  gold:"var(--gold)", goldLt:"var(--gold-lt)",
  red:"var(--red)",  redLt:"var(--red-lt)",
  blue:"var(--blue)", blueLt:"var(--blue-lt)",
  green:"var(--green)",greenLt:"var(--green-lt)",
  purple:"#7C3AED",purpleLt:"#F5F3FF",
  bg:"var(--bg)", white:"var(--white)", border:"var(--border)",
  g50:"var(--g50)", g100:"var(--g100)", g200:"var(--g200)",
  g300:"var(--g300)", g400:"var(--g400)", g500:"var(--g500)",
  g600:"var(--g600)", g700:"var(--g700)", g900:"var(--g900)",
} as const;

// ── Estado badge config ───────────────────────────────────────────────────────
const ESTADO_CFG: Record<EstadoPrecalificacion, { bg: string; color: string; dot: string }> = {
  "Denegado":                          { bg:"var(--red-lt)", color:"var(--red)", dot:"var(--red)" },
  "Fallecido":                         { bg:"var(--g100)", color:"var(--g700)", dot:"var(--g400)" },
  "Revocado":                          { bg:"rgba(124,58,237,.16)", color:"#A78BFA", dot:"#8B5CF6" },
  "Limitación Participación Asamblea": { bg:"var(--teal-pill)", color:"var(--teal-dk)", dot:"var(--teal)" },
  "Acciones Adquiridas Anómalamente":  { bg:"var(--gold-lt)", color:"var(--gold)", dot:"var(--gold)" },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: EstadoPrecalificacion }) {
  const cfg = ESTADO_CFG[estado];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      fontSize:11, fontWeight:600,
      padding:"3px 10px", borderRadius:999,
      background:cfg.bg, color:cfg.color,
      whiteSpace:"nowrap" as const,
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, flexShrink:0, display:"inline-block" }} />
      {estado}
    </span>
  );
}

function TipDocBadge({ tipo }: { tipo: string }) {
  const isDP = tipo === "DPI";
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999,
      background: isDP ? "var(--badge-teal-bg)" : C.goldLt,
      color: isDP ? "var(--badge-teal-text)" : C.gold,
      letterSpacing:"0.04em",
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background: isDP ? C.teal : C.gold, display:"inline-block" }} />
      {tipo}
    </span>
  );
}

function IdBadge({ id }: { id: string }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:6,
      background:"var(--badge-id-bg)", color:"var(--badge-id-text)", fontVariantNumeric:"tabular-nums",
    }}>{id}</span>
  );
}

function StatCard({ icon, iconBg, value, label, bold }: {
  icon: React.ReactNode; iconBg: string; value: string; label: string; bold?: boolean;
}) {
  return (
    <div style={{
      background:C.white, border:`1px solid ${C.border}`, borderRadius:12,
      padding:"18px 22px", display:"flex", alignItems:"center", gap:16, flex:1,
      boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
    }}>
      <div style={{
        width:46, height:46, borderRadius:12, background:iconBg,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: bold ? 22 : 28, fontWeight:800, color:C.g900, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:10, fontWeight:700, color:C.g400, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginTop:4 }}>{label}</div>
      </div>
    </div>
  );
}

function IconBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button title={title} onClick={onClick} style={{
      width:32, height:32, borderRadius:7,
      border:`1px solid ${C.border}`, background:C.white,
      cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center",
      color:C.g500, transition:"all 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background=C.g100; e.currentTarget.style.color=C.g900; }}
      onMouseLeave={e => { e.currentTarget.style.background=C.white; e.currentTarget.style.color=C.g500; }}
    >{children}</button>
  );
}

// ── Carga Masiva — parse CSV/demo ─────────────────────────────────────────────
function parseCsvDemo(): CasoEspecialFormData[] {
  return [
    { tipDoc:"DPI", noDocumento:"9988776655443", nombreCompleto:"CHAN BATZ ROSA LINDA", estadoPrecal:"Denegado", fechaDefuncion:"" },
    { tipDoc:"Cédula", noDocumento:"1122334", nombreCompleto:"AJÚ SALAZAR MARIO", estadoPrecal:"Revocado", fechaDefuncion:"" },
  ];
}

// ── Export to CSV ─────────────────────────────────────────────────────────────
function exportExcel(casos: CasoEspecial[]) {
  const header = ["ID","Tipo Doc","No. Documento","Nombre Completo","Estado Precal.","Fecha Defunción","Registrado"];
  const rows = casos.map(c => [
    c.id, c.tipDoc, c.noDocumento, c.nombreCompleto,
    c.estadoPrecal, c.fechaDefuncion ?? "–", c.registrado,
  ]);
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "casos-especiales.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ── Main Page ─────────────────────────────────────────────────────────────────
interface CasosEspecialesPageProps { session: AuthSession; onLogout: () => void; }

type ModalState =
  | { type: "closed" }
  | { type: "crear" }
  | { type: "editar"; caso: CasoEspecial }
  | { type: "eliminar"; caso: CasoEspecial };

const TODOS_ESTADOS = "Todos los estados";
const CAMPOS_BUSQUEDA = ["DPI y Cédula", "Nombre", "No. Documento"];

export function CasosEspecialesPage({ session }: CasosEspecialesPageProps) {
  const {
    casos, bitacora, stats, loading, saving,
    error, success, crear, editar, eliminar, cargaMasiva, clearFeedback,
  } = useCasosEspeciales(session.usuario);

  const [modal,        setModal]        = useState<ModalState>({ type:"closed" });
  const [busqueda,     setBusqueda]     = useState("");
  const [filtroEstado, setFiltroEstado] = useState(TODOS_ESTADOS);
  const [campoBusq,    setCampoBusq]    = useState(CAMPOS_BUSQUEDA[0]!);
  const [cargando,     setCargando]     = useState(false);

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let rows = casos;
    if (filtroEstado !== TODOS_ESTADOS)
      rows = rows.filter(c => c.estadoPrecal === filtroEstado);
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      rows = rows.filter(c => {
        switch (campoBusq) {
          case "Nombre":       return c.nombreCompleto.toLowerCase().includes(q);
          case "No. Documento":return c.noDocumento.includes(q);
          default:             return c.noDocumento.includes(q) || c.nombreCompleto.toLowerCase().includes(q);
        }
      });
    }
    return rows;
  }, [casos, filtroEstado, busqueda, campoBusq]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleSave(data: CasoEspecialFormData) {
    if (modal.type === "crear") return crear(data);
    if (modal.type === "editar") return editar(modal.caso.id, data);
    return false;
  }

  async function handleEliminar() {
    if (modal.type !== "eliminar") return;
    const ok = await eliminar(modal.caso.id);
    if (ok) setModal({ type:"closed" });
  }

  async function handleCargaMasiva() {
    setCargando(true);
    const filas = parseCsvDemo();   // en producción: parsear archivo real
    await cargaMasiva(filas);
    setCargando(false);
  }

  // ── iStyles ───────────────────────────────────────────────────────────────
  const filterInputSx: React.CSSProperties = {
    padding:"8px 12px", fontFamily:"inherit", fontSize:12,
    border:`1px solid ${C.border}`, borderRadius:8,
    background:C.white, color:C.g900, outline:"none",
    height:36,
  };

  const colHd: React.CSSProperties = {
    padding:"10px 14px", fontSize:10, fontWeight:700,
    color:C.g500, textTransform:"uppercase" as const, letterSpacing:"0.08em",
    textAlign:"left" as const, borderBottom:`1.5px solid ${C.border}`,
    whiteSpace:"nowrap" as const, background:C.white,
  };

  const cell: React.CSSProperties = {
    padding:"12px 14px", fontSize:13, color:C.g700,
    borderBottom:`1px solid ${C.g100}`, verticalAlign:"middle" as const,
  };

  return (
    <div style={{ fontFamily:"var(--font-sans)", background:"var(--bt-bg-page)", minHeight:"calc(100vh - 68px)" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        * { box-sizing:border-box; }
        input:focus,select:focus{ outline:none; border-color:${C.teal}!important; box-shadow:0 0 0 3px ${C.teal}22; }
      `}</style>

      <PageHeader
        section="Casos Especiales"
        title={<>Mantenimiento de <span style={{ color:"var(--bt-action-primary)" }}>Casos Especiales</span></>}
        actions={
          <>
            <button onClick={handleCargaMasiva} disabled={cargando} style={{
              fontFamily:"inherit", fontSize:13, fontWeight:600, padding:"9px 18px",
              borderRadius:"var(--bt-radius-md)", border:"1px solid var(--bt-border-mid)", background:"var(--bt-bg-surface)",
              color:"var(--bt-text-secondary)", display:"flex", alignItems:"center", gap:7,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {cargando ? "Cargando..." : "Carga Masiva"}
            </button>
            <button onClick={() => { clearFeedback(); setModal({ type:"crear" }); }} style={{
              fontFamily:"inherit", fontSize:13, fontWeight:700, padding:"9px 18px",
              borderRadius:"var(--bt-radius-md)", border:"none", background:"var(--bt-action-primary)", color:"#fff",
              display:"flex", alignItems:"center", gap:7,
              boxShadow:"var(--bt-shadow-teal)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nuevo Registro
            </button>
          </>
        }
        stats={
          <>
            <HeaderStatCard value={loading ? "..." : String(stats.activos)} label="Casos Activos" accent="var(--bt-action-primary)" icon={<IcoUsers color="var(--bt-action-primary)" />} />
            <HeaderStatCard value={loading ? "..." : String(stats.denegados)} label="Denegados" accent="var(--bt-status-error)" icon={<IcoBan color="var(--bt-status-error)" />} />
            <HeaderStatCard value={loading ? "..." : String(stats.fallecidos)} label="Fallecidos" accent="var(--bt-status-warning)" icon={<IcoCheck color="var(--bt-status-warning)" />} />
            <HeaderStatCard value={loading ? "..." : (stats.ultimaCarga ?? "—")} label="Última Carga" accent="var(--bt-status-info)" icon={<IcoDate color="var(--bt-status-info)" />} />
          </>
        }
      />

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"28px 40px" }}>

        {/* Feedback */}
        {(success || error) && (
          <div style={{
            marginBottom:16, padding:"12px 16px", borderRadius:10,
            background: success ? C.greenLt : C.redLt,
            border:`1px solid ${success ? "#86EFAC" : "#FCA5A5"}`,
            fontSize:13, color: success ? C.green : C.red, fontWeight:500,
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span>{success ?? error}</span>
            <button onClick={clearFeedback} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:16, color:"inherit" }}>✕</button>
          </div>
        )}

        {/* ── Table card ─────────────────────────────────────────────────────── */}
        <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden" }}>

          {/* Table toolbar */}
          <div style={{
            padding:"14px 20px", display:"flex", alignItems:"center",
            justifyContent:"space-between", gap:12, borderBottom:`1px solid ${C.border}`,
          }}>
            {/* Title */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:4, height:18, background:C.teal, borderRadius:2 }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span style={{ fontSize:13, fontWeight:700, color:C.g700, letterSpacing:"0.04em" }}>Registros</span>
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:10, alignItems:"center", flex:1, justifyContent:"flex-end" }}>
              {/* Search */}
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar…"
                  style={{ ...filterInputSx, paddingLeft:30, width:180 }}
                />
              </div>
              {/* Estado filter */}
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                style={{ ...filterInputSx, width:180 }}>
                <option>{TODOS_ESTADOS}</option>
                {Object.keys(ESTADO_CFG).map(e => <option key={e}>{e}</option>)}
              </select>
              {/* Campo filter */}
              <select value={campoBusq} onChange={e => setCampoBusq(e.target.value)}
                style={{ ...filterInputSx, width:140 }}>
                {CAMPOS_BUSQUEDA.map(c => <option key={c}>{c}</option>)}
              </select>
              {/* Excel export */}
              <button onClick={() => exportExcel(filtered)} style={{
                fontFamily:"inherit", fontSize:12, fontWeight:600,
                padding:"7px 14px", borderRadius:8,
                border:`1px solid ${C.border}`, background:C.white,
                color:C.g600, cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                height:36,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  {[
                    ["ID",              "80px"],
                    ["Tipo Doc.",       "100px"],
                    ["No. Documento",   "160px"],
                    ["Nombre Completo", "auto"],
                    ["Estado Precal.",  "220px"],
                    ["Fecha Defunción", "140px"],
                    ["Registrado",      "120px"],
                    ["Acciones",        "90px"],
                  ].map(([label, w]) => (
                    <th key={label} style={{ ...colHd, width:w }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={8} style={{ ...cell, textAlign:"center", padding:"48px 0", color:C.g400 }}>
                    <svg style={{ animation:"spin 0.8s linear infinite", marginBottom:8 }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-18 0"/></svg>
                    <br />Cargando registros…
                  </td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ ...cell, textAlign:"center", padding:"48px 0", color:C.g400 }}>
                    Sin registros para mostrar.
                  </td></tr>
                )}
                {!loading && filtered.map((caso, i) => (
                  <tr key={caso.id}
                    style={{ background: i % 2 === 0 ? C.white : C.g50 }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.tealLt)}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? C.white : C.g50)}
                  >
                    <td style={cell}><IdBadge id={caso.id} /></td>
                    <td style={cell}><TipDocBadge tipo={caso.tipDoc} /></td>
                    <td style={{ ...cell, fontVariantNumeric:"tabular-nums", fontWeight:500 }}>{caso.noDocumento}</td>
                    <td style={{ ...cell, fontWeight:600 }}>{caso.nombreCompleto}</td>
                    <td style={cell}><EstadoBadge estado={caso.estadoPrecal} /></td>
                    <td style={{ ...cell, color:C.g500 }}>{caso.fechaDefuncion ?? "–"}</td>
                    <td style={{ ...cell, color:C.g500 }}>{caso.registrado}</td>
                    <td style={{ ...cell, textAlign:"right" as const }}>
                      <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                        <IconBtn title="Editar" onClick={() => { clearFeedback(); setModal({ type:"editar", caso }); }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </IconBtn>
                        <IconBtn title="Eliminar (soft)" onClick={() => { clearFeedback(); setModal({ type:"eliminar", caso }); }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {!loading && (
            <div style={{
              padding:"10px 20px", borderTop:`1px solid ${C.border}`,
              fontSize:12, color:C.g400,
            }}>
              Mostrando {filtered.length} registro(s)
              {filtered.length !== casos.length && ` de ${casos.length} totales`}
            </div>
          )}
        </div>

        {/* ── Bitácora de Auditoría ─────────────────────────────────────────── */}
        <div style={{
          marginTop:24, background:C.white, borderRadius:12,
          border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
          overflow:"hidden",
        }}>
          <div style={{
            padding:"14px 20px", display:"flex", alignItems:"center",
            justifyContent:"space-between", borderBottom:`1px solid ${C.border}`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:4, height:18, background:C.teal, borderRadius:2 }} />
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span style={{ fontSize:13, fontWeight:700, color:C.g700 }}>Bitácora de Auditoría</span>
            </div>
            <button
              onClick={() => exportExcel(casos)}
              style={{
                fontFamily:"inherit", fontSize:12, fontWeight:600,
                padding:"7px 14px", borderRadius:8,
                border:`1px solid ${C.border}`, background:C.white,
                color:C.g600, cursor:"pointer", display:"flex", alignItems:"center", gap:6,
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Exportar
            </button>
          </div>

          {bitacora.length === 0 ? (
            <div style={{ padding:"40px 0", textAlign:"center", color:C.g400, fontSize:13 }}>
              Sin movimientos registrados.
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>
                    {["Acción","Caso","Descripción","Usuario","Fecha"].map(h => (
                      <th key={h} style={colHd}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bitacora.map((mov, i) => (
                    <tr key={mov.id} style={{ background: i % 2 === 0 ? C.white : C.g50 }}>
                      <td style={cell}>
                        <span style={{
                          fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999,
                          background:
                            mov.accion === "CREAR" ? C.greenLt :
                            mov.accion === "ELIMINAR" ? C.redLt :
                            mov.accion === "CARGA_MASIVA" ? C.blueLt : C.goldLt,
                          color:
                            mov.accion === "CREAR" ? C.green :
                            mov.accion === "ELIMINAR" ? C.red :
                            mov.accion === "CARGA_MASIVA" ? C.blue : C.gold,
                        }}>{mov.accion}</span>
                      </td>
                      <td style={{ ...cell, fontFamily:"monospace" }}>{mov.casoId}</td>
                      <td style={cell}>{mov.descripcion}</td>
                      <td style={{ ...cell, color:C.g500 }}>{mov.usuario}</td>
                      <td style={{ ...cell, color:C.g500, whiteSpace:"nowrap" as const }}>
                        {new Date(mov.fecha).toLocaleString("es-GT")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {(modal.type === "crear" || modal.type === "editar") && (
        <CasoEspecialModal
          mode={modal.type}
          caso={modal.type === "editar" ? modal.caso : undefined}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModal({ type:"closed" })}
        />
      )}
      {modal.type === "eliminar" && (
        <ConfirmDialog
          nombre={modal.caso.nombreCompleto}
          saving={saving}
          onConfirm={handleEliminar}
          onClose={() => setModal({ type:"closed" })}
        />
      )}
    </div>
  );
}
