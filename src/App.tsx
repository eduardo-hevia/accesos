// ── App Root — with module navigation ────────────────────────────────────────
import { useState } from "react";
import { ThemeProvider } from "@bantrab/ui";
import type { ThemeName } from "@bantrab/ui";
import { useAuth } from "./application/hooks/index";
import { LoginPage } from "./modules/accionistas/LoginPage";
import { AccionistaSearch } from "./modules/accionistas/AccionistaSearch";
import { CasosEspecialesPage } from "./modules/accionistas/CasosEspecialesPage";
import { TopBar } from "./ui/layout";

type ActiveModule = "consulta" | "casos";

export default function App() {
  const { session, loading, error, login, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>("casos");
  const [theme, setTheme] = useState<ThemeName>("light");

  const toggleTheme = () => setTheme((current) => current === "light" ? "dark" : "light");

  if (!session) {
    return <LoginPage onLogin={login} loading={loading} error={error} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bt-bg-page)" }}>
        <TopBar
          activeModule={activeModule}
          onNavigate={setActiveModule}
          usuario={session.usuario}
          onLogout={logout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {activeModule === "consulta" && (
          <AccionistaSearch session={session} onLogout={logout} />
        )}
        {activeModule === "casos" && (
          <CasosEspecialesPage session={session} onLogout={logout} />
        )}
      </div>
    </ThemeProvider>
  );
}
