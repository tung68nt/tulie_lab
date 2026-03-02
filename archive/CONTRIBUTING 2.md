# Contributing Guide

Welcome to the project! This document outlines the architectural guidelines and file organization standards to ensure the codebase remains maintainable and scalable.

## 1. Feature-Based Architecture

We are moving towards a **Feature-based** folder structure. This means all code related to a specific domain feature (e.g., LMS, Shop, Authentication) should be grouped together rather than split by technical layer.

### Client Structure (`client/src`)

-   **`features/`**: The Core. Contains all business logic and feature-specific UI.
    -   `features/lms/`: Learning Management System logic.
    -   `features/shop/`: E-commerce logic.
    -   `features/auth/`: Authentication logic.
    -   *(Internal Structure of a Feature)*:
        -   `components/`: UI components specific to this feature.
        -   `hooks/`: Custom hooks (State, Logic).
        -   `api/`: API calls and server interactions.
        -   `types/`: TypeScript interfaces/types.
        -   `utils/`: Helper functions specific to this feature.

-   **`app/`**: **Routing Only (No Logic)**.
    -   Contains Next.js App Router files (`page.tsx`, `layout.tsx`, `route.ts`).
    -   **Rule**: `page.tsx` should only import the Feature Container from `@features/...` and render it. No business logic (useEffect/useState) allowed here unless trivial.

-   **`components/`**: **Shared UI Only (Design System)**.
    -   Reusable, dumb UI components (Buttons, Inputs, Modals) that are feature-agnostic.
    -   Do not put feature-specific components here.

-   **`lib/`**: **Configuration & Global Utilities**.
    -   Third-party library configs (Axios, Dayjs, Zod).
    -   Global helpers (date formatting, cn utility).

### Server Structure (`server/src`)

-   **`modules/`**: Feature modules (similar to Client `features`).
    -   `modules/lms/`, `modules/shop/`.
    -   **Pattern**: Controller -> Service -> Repository.

---

## 2. Naming Conventions

### Handlers & Folders
-   **Folders**: `kebab-case` (e.g., `user-profile`, `order-history`).
-   **Route Groups**: `(kebab-case)` (e.g., `(auth)`, `(lms)`).

### Files
-   **React Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`, `SubmitButton.tsx`).
-   **Hooks**: `camelCase.ts` (start with `use`, e.g., `useAuth.ts`, `useOutsideClick.ts`).
-   **Utilities/Functions**: `camelCase.ts` (e.g., `formatting.ts`, `validation.ts`) or `kebab-case.ts`.
-   **Types/Interfaces**: `PascalCase.ts` with explicit suffix (e.g., `User.types.ts`) or just `types.ts` inside a feature folder.

### Code
-   **component**: `PascalCase`.
-   **function/variable**: `camelCase`.
-   **constant**: `SCREAMING_SNAKE_CASE`.
-   **interface/type**: `PascalCase` (Prefix `I` is **deprecated**; use `Props` suffix for components, e.g., `ButtonProps`).

---

## 3. Import Rules

-   **Absolute Imports**: Always use Path Aliases (`@/...`) instead of relative paths (`../../../`).
-   **Aliases**:
    -   `@features/*` -> `client/src/features/*` (Future)
    -   `@components/*` -> `client/src/components/*`
    -   `@lib/*` -> `client/src/lib/*`
    -   `@/app/*` -> `client/src/app/*`

---

## 4. Separation of Concerns (SoC) - The "Golden Rules"

-   **UI vs Logic**: separate `view` from `logic`.
    -   ❌ Don't write 100 lines of `useEffect` inside a JSX component.
    -   ✅ Move logic to a custom hook (e.g., `useCourseData`) and return only the data needed for rendering.
-   **API Calls**:
    -   ❌ Don't use `fetch` or `axios` directly in components.
    -   ✅ Create an API service file (e.g., `features/lms/api/course.api.ts`) and call it from a hook or service.

---

## 5. Deployment & Git

-   **Commit Messages**: Use Conventional Commits.
    -   `feat: add new course list`
    -   `fix: resolve login timeout`
    -   `refactor: move utils to features/lms`
    -   `chore: update dependencies`
