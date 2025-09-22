# Stacknity Monorepo

A modern monorepo for Stacknity's multi-tenant platform, powered by Turborepo and Next.js 15+.

## 🏗️ Architecture

```
stacknity-monorepo/
├── apps/
│   ├── platform/           # Platform admin application (stacknity.com)
│   └── tenant/             # Tenant workspace application (*.stacknity.com)
├── packages/
│   ├── shared-ui/          # Shared UI components & design system
│   ├── shared-types/       # TypeScript type definitions
│   └── shared-utils/       # Common utilities & API clients
├── turbo.json              # Turborepo configuration
├── tsconfig.json           # TypeScript project references
└── package.json            # Workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
# Start all apps in development mode
npm run dev

# Start specific app
npx turbo dev --filter=platform
npx turbo dev --filter=tenant
```

### Building

```bash
# Build all apps and packages
npm run build

# Build specific app
npx turbo build --filter=platform
npx turbo build --filter=tenant
```

## 📦 Packages

### Shared UI (`packages/shared-ui`)

- Modern React components
- Design system with theming
- Accessible UI components
- CSS modules & styled components

### Shared Types (`packages/shared-types`)

- TypeScript definitions
- API response types
- Common interfaces

### Shared Utils (`packages/shared-utils`)

- API clients
- Utility functions
- Common helpers

## 🚢 Deployment (Vercel)

This monorepo is optimized for Vercel deployment:

1. **Platform App**: Deploy `apps/platform` → `stacknity.com`
2. **Tenant App**: Deploy `apps/tenant` → `*.stacknity.com`

### Vercel Configuration

Each app includes proper `vercel.json` configuration for:

- Turborepo builds
- Environment variables
- Domain routing

## 🔧 Development Tools

- **Turborepo**: High-performance build system
- **TypeScript**: Latest version with strict mode
- **Modern Next.js**: v15+ with latest features
- **Workspace**: npm workspaces for dependency management

## 📝 Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build all projects
- `npm run lint` - Lint all projects
- `npm run type-check` - TypeScript type checking
- `npm run clean` - Clean all build artifacts

### Extended Script Reference

For detailed explanations of every script (dev modes, package watching, production start, release flow), see [SCRIPTS.md](./SCRIPTS.md).

## 🤝 Contributing

This monorepo uses modern development practices:

- TypeScript strict mode
- Shared package dependencies
- Turborepo for efficient builds
- Vercel-optimized deployment
