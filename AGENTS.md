<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GIZA 86 Clothes Store - Agent Architecture & Modern Next.js Guidelines

This document provides non-negotiable architectural mandates, coding patterns, and verification standards for all AI agents working on this repository. Follow these rules to avoid breaking modernized Next.js App Router patterns, type safety, and domain-specific conventions.

---

## 1. Absolute Golden Rules (Never Break or Regress)

1. **Keep Server Components by Default ("Move Client Components to the Leaves"):**
   - Never add `"use client"` to the top of `page.tsx` or `layout.tsx` unless there is an inescapable requirement.
   - Any page needing `generateMetadata()` or `export const metadata` **MUST remain a Server Component**.
   - Client interactivity (`useState`, `useEffect`, event handlers, Zustand cart store) must be encapsulated inside leaf components under `src/components/store/` or `src/components/admin/`.

2. **Never Regress to Hard Page Reloads:**
   - **STRICTLY FORBIDDEN:** Calling `window.location.reload()`, `window.location.href = ...`, or using native `<a>` tags for internal navigation.
   - **REQUIRED:** Use Next.js `<Link>` from `next/link` with automatic prefetching. Use `useRouter()` from `next/navigation` for imperative navigation, and `router.refresh()` for revalidation.

3. **Preserve Tiered Error Handling & Crash Boundaries:**
   - **`src/app/global-error.tsx`** is mandatory. It catches root layout crashes. It **MUST** define its own `<html>` and `<body>` tags, provide a retry action (`reset()`), display error digests, and offer a pre-filled WhatsApp emergency report link.
   - **`src/app/error.tsx`** and **`src/app/admin/error.tsx`** are scoped boundaries. They are `"use client"` components with session preservation and retry capabilities. Never delete or bypass them.

4. **Preserve Visual Not-Found Hierarchies (`not-found.tsx`):**
   - Root (`src/app/not-found.tsx`) features Arabic 404 illustrations, quick search jump bar, and category jump shortcuts.
   - When a resource is missing in a Server Component (e.g. invalid product slug or order ID), invoke `notFound()` from `next/navigation`.

5. **Preserve Streaming Loading Skeletons (`loading.tsx`):**
   - `src/app/loading.tsx` (storefront product grid skeleton) and `src/app/admin/loading.tsx` (admin metrics & table skeleton) must be maintained to provide instant visual feedback during Server Component streaming.

6. **Egyptian Market Specifics:**
   - Currency is strictly formatted in Egyptian Pounds (`ج.م` / EGP).
   - Dynamic shipping rates for all 27 Egyptian governorates.
   - Egyptian phone number validation (11 digits starting with `010`, `011`, `012`, or `015`).
   - Payment methods supported: Cash on Delivery (COD), InstaPay, Vodafone Cash, and Cards/Meeza.

7. **Authentication & Database Standards:**
   - Use **Better Auth** (`better-auth`) for authentication with Drizzle ORM PostgreSQL adapter.
   - Use **Neon Serverless PostgreSQL** via `@neondatabase/serverless` and `drizzle-orm/neon-http`.
   - All migrations pushed via `pnpm drizzle-kit push`.

---

## 2. Verification Protocol (Required Before Completing Any Task)

Every agent completing modifications in this repository **MUST** execute and pass these checks:

1. **TypeScript Verification:**
   ```bash
   pnpm tsc --noEmit
   ```
   *Expected: Exit Code 0 (0 type errors).*

2. **Next.js Production Build:**
   ```bash
   pnpm build
   ```
   *Expected: Exit Code 0 across all routes without Turbopack compilation errors.*

3. **Git Cleanliness:**
   ```bash
   git status -s
   ```
   *Ensure no unintended files, broken paths, or missing imports exist.*

4. **Communication Standard:**
   - All user explanations must be written in **English**.
   - All file and symbol references must use clickable markdown links with `file:///` and forward slashes.
