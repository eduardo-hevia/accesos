# BANTRAB Accionistas — Frontend

React 19 · Vite 6 · TypeScript strict · Clean Architecture · Sin RSC

## Requisitos

- Node.js ≥ 22.x (LTS "Jod")
- npm ≥ 10

## Setup rápido

```bash
cp .env.example .env   # ya configurado como mock por defecto
npm install
npm run dev            # http://localhost:5173
```

## Cambiar entre Mock y Backend Real

```bash
# .env
VITE_USE_MOCK=true   # datos locales, sin backend
VITE_USE_MOCK=false  # conecta a http://localhost:3001
```

> El switch opera en `src/infrastructure/ServiceFactory.ts`.
> No requiere cambios en componentes.

## Credenciales demo

| Usuario | Password |
|---------|----------|
| supervisor | 1234 |
| admin | admin123 |

## DPIs de prueba

| DPI | Flujo |
|-----|-------|
| `2265780540101` | ✓ Actualizado |
| `1234567890101` | ⚠ Desactualizado (adulto mayor) |
| Cualquier otro 13 dígitos | ◎ Potencial Accionista |

## Arquitectura

```
src/
├── core/
│   ├── entities/        # Tipos de dominio (Accionista, Prospecto, etc.)
│   └── interfaces/      # Service interfaces (puertos)
├── infrastructure/
│   ├── mock/            # MockAccionistaService, MockProspectoService
│   ├── api/             # ApiAccionistaService (fetch real)
│   └── ServiceFactory   # Switch VITE_USE_MOCK → inyecta implementación
├── application/
│   └── hooks/           # useAccionista, useAuth, useProspecto
├── ui/
│   ├── globals.css      # Design tokens CSS
│   └── components/      # Átomos: Btn, Tag, Card, DataCell, etc.
└── modules/
    └── accionistas/
        ├── LoginPage.tsx
        ├── AccionistaSearch.tsx
        └── components/
            ├── ClassificationPanel.tsx
            ├── PromoSection.tsx
            └── ResultCards.tsx (CardActualizado, CardDesactualizado, CardPotencial)
```

## Seguridad

- `react@^19.2.5` — **SIN React Server Components** → inmune a CVE-2025-55182 familia
- `vite@^6.3.5` — Sin `--host`, `server.fs.deny` configurado → mitiga CVE-2025-30208/31125
- `sourcemap: false` en build de producción
- JWT almacenado en `sessionStorage` (limpiado al cerrar pestaña)

## Reglas de negocio por flujo

| Flujo | Promo checkbox | Botón Guardar Promo | Formulario Prospecto |
|-------|---------------|---------------------|----------------------|
| Actualizado | ✅ Activo | ✅ Visible tras marcar | ❌ No aplica |
| Desactualizado | ✅ Activo | ✅ Visible tras marcar | ❌ No aplica |
| Potencial | 🚫 Bloqueado | 🚫 No disponible | ✅ Formulario completo |
