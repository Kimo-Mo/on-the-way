# Implementation Plan: Architecture Setup & Core Layout

**Branch**: `master` | **Date**: 2026-06-14 | **Spec**: [specs/001-arch-setup-core-layout/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-arch-setup-core-layout/spec.md`

## Summary
Initialize the core application architecture and layout for the "On The Way" Admin Dashboard. This includes setting up the global Axios client with interceptors, integrating React Query, and building the primary Layout component featuring a responsive Sidebar (with Mobile Drawer) and Header (with Notifications and Profile dropdowns).

## Technical Context

**Language/Version**: TypeScript 6.0+  
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS 4, Shadcn UI, React Router 7, TanStack React Query 5, Axios, Lucide React.  
**Storage**: N/A for Phase 1.  
**Testing**: NEEDS CLARIFICATION (Test runner not yet initialized in package.json).  
**Target Platform**: Web (Admin Dashboard).
**Project Type**: Web Application.  
**Performance Goals**: Layout initialization < 2s, Dropdown interaction < 200ms.  
**Constraints**: Responsive layout (Mobile Drawer for Sidebar), Strict TypeScript, Shadcn UI consistency.  
**Scale/Scope**: Foundation for all management modules (Users, Reports, Providers, etc.).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: PASS. Plan uses strict TypeScript and Shadcn UI.
- **Data and State**: PASS. Plan includes setting up Axios client and React Query provider.
- **Testing**: PASS. Vitest with React Testing Library selected as the test runner in Research Phase.
- **UX Consistency**: PASS. Plan leverages Shadcn/Tailwind for Sidebar/Header.
- **Performance**: PASS. Standard React/Vite/Shadcn setup is optimized for admin dashboard needs.

## Project Structure

### Documentation (this feature)

```text
specs/001-arch-setup-core-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── index.ts
│   └── ui/              # Shadcn components (Button, Sheet, DropdownMenu, etc.)
├── lib/
│   ├── axios.ts         # Global Axios instance
│   └── utils.ts
├── providers/
│   ├── QueryProvider.tsx
│   └── index.ts
└── assets/
```

**Structure Decision**: Single project web application structure as initialized.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
