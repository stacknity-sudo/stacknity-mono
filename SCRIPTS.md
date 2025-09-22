# Script Reference

Authoritative guide to the workspace scripts: what they do, when to use them, and common scenarios.

## Legend

- ✅ Safe for day‑to‑day
- 🐢 Slower / full rebuild
- ⚙️ Internal / orchestration

---

## Core Lifecycle

| Script                         | Purpose                                                                 | When to Use                                       |
| ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------- |
| `pnpm run build`               | Builds shared packages sequentially, then both apps via Turborepo       | Pre-prod, CI, before `start:*`                    |
| `pnpm run build:packages:only` | Builds only `@stacknity/shared-*` libraries (CJS+ESM+d.ts) sequentially | After changing shared libs if not using a watcher |
| `pnpm run build:platform`      | Builds shared packages then the `platform` app only                     | App-specific CI/preview                           |
| `pnpm run build:tenant`        | Same but for `tenant`                                                   | App-specific CI/preview                           |

---

## Development (Apps)

| Script                     | Purpose                                                       | Notes                                     |
| -------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| `pnpm dev:platform:direct` | Runs Next.js Turbopack dev locally for `platform` only        | Fastest startup; no dependency auto-build |
| `pnpm dev:tenant:direct`   | Same for `tenant`                                             | Use with watcher for shared packages      |
| `pnpm dev:platform`        | Turbo-managed dev (future: can add upstream build dependency) | Good if you enable `dependsOn` later      |
| `pnpm dev:tenant`          | Turbo-managed dev for tenant                                  | Same caveats                              |
| `pnpm dev`                 | Turbo dev for whatever tasks are configured globally          | Not currently auto-building deps          |

---

## Development (Shared Packages)

| Script              | Purpose                                | When to Run                                         |
| ------------------- | -------------------------------------- | --------------------------------------------------- |
| `pnpm dev:packages` | Runs `tsup --watch` in all shared libs | Keep this running if you actively edit `packages/*` |

Without this watcher: editing a shared package requires either `pnpm run build:packages:only` or a full `pnpm run build` to refresh `dist/` artifacts.

---

## Production Runtime

| Script                | Purpose                                            | Notes             |
| --------------------- | -------------------------------------------------- | ----------------- |
| `pnpm start:platform` | Starts `platform` in production mode (after build) | Uses `next start` |
| `pnpm start:tenant`   | Starts `tenant` in production mode (after build)   | Same              |

Change port (bash): `PORT=4000 pnpm start:tenant`
PowerShell: `$env:PORT=4000; pnpm start:tenant`

---

## Quality & Maintenance

| Script            | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| `pnpm lint`       | Runs lint tasks via Turbo                          |
| `pnpm type-check` | TypeScript check only                              |
| `pnpm test`       | Placeholder (no tests defined yet)                 |
| `pnpm clean`      | Clears build caches (`.next`, `dist`, Turbo cache) |
| `pnpm format`     | Prettier formatting across workspace               |

---

## Release / Versioning

| Script                  | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `pnpm changeset`        | Create a changeset (if/when publishing)            |
| `pnpm version-packages` | Apply version bumps per changesets                 |
| `pnpm release`          | Builds filtered stack and publishes via Changesets |

---

## Typical Workflows

### 1. Develop a Feature in `platform` Only

```bash
pnpm dev:platform:direct
```

### 2. Edit Shared UI + See Changes in `platform`

```bash
pnpm dev:packages      # Terminal A
pnpm dev:platform:direct   # Terminal B
```

### 3. Quick Rebuild After Shared Changes (no watcher)

```bash
pnpm run build:packages:only
```

### 4. Full Production Simulation

```bash
pnpm run build
pnpm start:platform
```

### 5. Build Only `tenant` for a Preview

```bash
pnpm run build:tenant
pnpm start:tenant
```

---

## FAQ

**Q: Do I need to run `dev:packages` every time?**  
Only if you are editing shared packages and want instant reflection. For app-only work, skip it.

**Q: Why not auto-build shared packages in dev?**  
We opted for faster startup. We can enable `dependsOn` in `turbo.json` later if desired.

**Q: Why both CJS and ESM?**  
Ensures compatibility with environments still expecting `require` while Next.js and modern tooling use ESM.

**Q: What generates d.ts files?**  
`tsup` with `dts: true` in each shared package config.

---

## Next Possible Improvements

- Add `dev:platform:stack` script that concurrently runs package watcher + platform dev.
- Enable `dependsOn: ["^build"]` for `dev` in `turbo.json` if automatic initial builds are preferred.
- Add test setup (Vitest or Jest) and real test tasks.
- Add `eslint` + `@typescript-eslint` config for packages individually.

---

Feel free to ask if you want any of the improvements applied automatically.
