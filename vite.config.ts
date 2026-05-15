import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
// Security: NO server.host exposed. CVE-2025-30208 / CVE-2025-31125 mitigated.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = (env.VITE_API_BASE_URL as string)?.trim() || "http://localhost:3001";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@core":    resolve(__dirname, "src/core"),
        "@infra":   resolve(__dirname, "src/infrastructure"),
        "@app":     resolve(__dirname, "src/application"),
        "@ui":      resolve(__dirname, "src/ui"),
        "@modules": resolve(__dirname, "src/modules"),
      },
    },
    server: {
      port: 5173,
      // NEVER set host: true — CVE-2025-30208 / CVE-2025-31125 mitigation
      fs: {
        // Restrict file serving to project root only
        allow: ["."],
        deny: [".env", ".env.*", "*.{pem,key,crt}", "node_modules/.cache"],
      },
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: "es2022",
      sourcemap: false, // Never expose sourcemaps in production builds
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
  };
});
