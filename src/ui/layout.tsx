import type { ReactNode } from "react";
import type { ThemeName } from "@bantrab/ui";
import { BantrabImagotypePng, BantrabLogoText } from "@bantrab/ui";

export type AccessModule = "casos" | "consulta";

interface TopBarProps {
  activeModule: AccessModule;
  onNavigate: (module: AccessModule) => void;
  usuario: string;
  onLogout: () => void;
  theme: ThemeName;
  onToggleTheme: () => void;
}

const NAV_ITEMS: Array<{ id: AccessModule; label: string }> = [
  { id: "casos", label: "Casos Especiales" },
  { id: "consulta", label: "Consulta Accionistas" },
];

export function TopBar({ activeModule, onNavigate, usuario, onLogout, theme, onToggleTheme }: TopBarProps) {
  return (
    <>
      <style>{`
        .bt-topbar {
          background: var(--bt-bg-surface);
          display: flex;
          align-items: stretch;
          height: 68px;
          border-bottom: 1px solid var(--bt-border);
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 1px 0 var(--bt-border), 0 2px 8px rgba(0,0,0,.04);
        }
        .bt-topbar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--bt-action-primary), var(--bt-color-cyan-04), transparent 80%);
        }
        .bt-topbar__logo {
          padding: 0 24px;
          display: flex;
          align-items: center;
          border-right: 1px solid var(--bt-border);
          flex-shrink: 0;
          gap: 10px;
        }
        .bt-topbar__brand-lockup {
          height: 46px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .bt-topbar__brand-mark {
          height: 42px;
          width: auto;
          display: block;
          flex-shrink: 0;
        }
        .bt-topbar__brand-text-frame {
          width: 112px;
          height: 46px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .bt-topbar__brand-text {
          position: absolute;
          width: 142px;
          height: 142px;
          max-width: none;
          left: -16px;
          top: -75px;
          display: block;
        }
        .bt-topbar__logo-divider {
          width: 1px;
          height: 18px;
          background: var(--bt-border-mid);
        }
        .bt-topbar__logo-module {
          font-size: 12px;
          font-weight: 600;
          color: var(--bt-text-secondary);
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .bt-topbar__nav {
          display: flex;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .bt-topbar__nav::-webkit-scrollbar { display: none; }
        .bt-topbar__tab {
          padding: 0 20px;
          display: flex;
          align-items: center;
          position: relative;
          font-size: 13px;
          font-weight: 500;
          color: var(--bt-text-secondary);
          white-space: nowrap;
          border: none;
          background: none;
          transition: color var(--bt-transition-fast), background-color var(--bt-transition-fast);
          border-bottom: 2px solid transparent;
        }
        .bt-topbar__tab:hover:not(.bt-topbar__tab--active) {
          color: var(--bt-action-primary);
          background: rgba(24, 179, 179, 0.04);
        }
        .bt-topbar__tab--active {
          color: var(--bt-action-primary);
          font-weight: 700;
          border-bottom-color: var(--bt-action-primary);
          background: rgba(24, 179, 179, 0.05);
        }
        .bt-topbar__tab-pill {
          padding: 4px 12px;
          background: var(--bt-color-cyan-01);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: var(--bt-color-cyan-09);
          border: 1px solid rgba(24,179,179,.2);
        }
        .bt-topbar__right {
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          border-left: 1px solid var(--bt-border);
        }
        .bt-topbar__user {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bt-topbar__avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--bt-action-primary), var(--bt-color-cyan-08));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #fff;
          border: 2px solid var(--bt-color-cyan-02);
          flex-shrink: 0;
        }
        .bt-topbar__username {
          font-size: 13px;
          font-weight: 600;
          color: var(--bt-text-primary);
        }
        .bt-topbar__theme-toggle {
          background: var(--bt-bg-surface);
          border: 1px solid var(--bt-border);
          border-radius: var(--bt-radius-md);
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--bt-transition-fast);
          color: var(--bt-text-primary);
        }
        .bt-topbar__theme-toggle:hover {
          border-color: var(--bt-action-primary);
          background: rgba(24, 179, 179, 0.05);
          transform: scale(1.05);
        }
        .bt-topbar__logout {
          font-size: 12px;
          font-weight: 600;
          color: var(--bt-text-secondary);
          padding: 5px 14px;
          border: 1px solid var(--bt-border-mid);
          border-radius: var(--bt-radius-sm);
          background: var(--bt-bg-surface);
          transition: all var(--bt-transition-fast);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .bt-topbar__logout:hover {
          border-color: var(--bt-status-error);
          color: var(--bt-status-error);
          background: var(--bt-status-error-bg);
        }
        @media (max-width: 760px) {
          .bt-topbar { height: auto; flex-wrap: wrap; }
          .bt-topbar__logo { width: 100%; height: 64px; }
          .bt-topbar__right { margin-left: auto; border-left: none; padding: 10px 16px; }
        }
      `}</style>
      <header className="bt-topbar">
        <div className="bt-topbar__logo">
          <div className="bt-topbar__brand-lockup" aria-label="Bantrab">
            <BantrabImagotypePng className="bt-topbar__brand-mark" />
            <span className="bt-topbar__brand-text-frame" aria-hidden="true">
              <BantrabLogoText className="bt-topbar__brand-text" data-darkreader-ignore />
            </span>
          </div>
          <div className="bt-topbar__logo-divider" />
          <span className="bt-topbar__logo-module">Accesos</span>
        </div>

        <nav className="bt-topbar__nav" aria-label="Navegacion principal">
          {NAV_ITEMS.map((item) => {
            const active = item.id === activeModule;
            return (
              <button
                key={item.id}
                className={`bt-topbar__tab${active ? " bt-topbar__tab--active" : ""}`}
                onClick={() => onNavigate(item.id)}
                aria-current={active ? "page" : undefined}
                type="button"
              >
                {active ? <span className="bt-topbar__tab-pill">{item.label}</span> : item.label}
              </button>
            );
          })}
        </nav>

        <div className="bt-topbar__right">
          <button
            className="bt-topbar__theme-toggle"
            type="button"
            onClick={onToggleTheme}
            title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
          >
            {theme === "light" ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            )}
          </button>
          <div className="bt-topbar__user">
            <div className="bt-topbar__avatar" aria-hidden="true">
              {(usuario?.[0] || "U").toUpperCase()}
            </div>
            <span className="bt-topbar__username">{usuario}</span>
          </div>
          <button className="bt-topbar__logout" type="button" onClick={onLogout}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>
      </header>
    </>
  );
}

interface PageHeaderProps {
  title: ReactNode;
  section: string;
  actions?: ReactNode;
  stats?: ReactNode;
}

export function PageHeader({ title, section, actions, stats }: PageHeaderProps) {
  return (
    <div style={{
      background: "linear-gradient(160deg, var(--bt-bg-surface) 0%, var(--bt-bg-alt) 100%)",
      padding: "24px 32px 28px",
      borderBottom: "1px solid var(--bt-border)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: -80,
        right: -80,
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(24,179,179,.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--bt-text-muted)",
          letterSpacing: ".1em",
          textTransform: "uppercase",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--bt-text-secondary)", textTransform: "none", letterSpacing: 0 }}>Bantrab</span>
          <span>›</span>
          <span>{section}</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: stats ? 24 : 0 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--bt-text-primary)", margin: 0, letterSpacing: "-.03em", lineHeight: 1.1 }}>
            {title}
          </h1>
          {actions && <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>{actions}</div>}
        </div>

        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {stats}
          </div>
        )}
      </div>
    </div>
  );
}

interface HeaderStatCardProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  accent: string;
}

export function HeaderStatCard({ value, label, icon, accent }: HeaderStatCardProps) {
  return (
    <div style={{
      background: "var(--bt-bg-surface)",
      border: "1.5px solid var(--bt-border)",
      borderRadius: "var(--bt-radius-lg)",
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      position: "relative",
      overflow: "hidden",
      boxShadow: "var(--bt-shadow-xs)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: .7 }} />
      <div style={{ width: 46, height: 46, borderRadius: 12, background: `${accent}15`, border: `1px solid ${accent}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--bt-text-primary)", lineHeight: 1.05, letterSpacing: "-.02em" }}>{value}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--bt-stat-label)", letterSpacing: ".08em", marginTop: 3, textTransform: "uppercase" }}>{label}</div>
      </div>
    </div>
  );
}

export function IcoUsers({ color = "currentColor" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
}
export function IcoCheck({ color = "currentColor" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
export function IcoBan({ color = "currentColor" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;
}
export function IcoDate({ color = "currentColor" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
