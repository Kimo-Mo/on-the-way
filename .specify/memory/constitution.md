<!--
Sync Impact Report
Version change: 1.0.0 -> 2.0.0
Modified principles:
- Renamed: III. Testing Is Required -> REMOVED
- Renumbered: IV. Consistent Admin User Experience -> III. Consistent Admin User Experience
- Renumbered: V. Performance Budgets Are Product Requirements -> IV. Performance Budgets Are Product Requirements
Added sections:
- None
Removed sections:
- Principle III: Testing Is Required
Templates requiring updates:
- ✅ updated: .specify/templates/plan-template.md
- ✅ updated: .specify/templates/spec-template.md
- ✅ updated: .specify/templates/tasks-template.md
Follow-up TODOs:
- Update existing feature plans and tasks to reflect the removal of testing requirements.
-->
# On The Way Admin Dashboard Constitution

## Core Principles

### I. Type-Safe, Maintainable Code
All production code MUST be written in strict TypeScript with explicit interfaces or
types for API responses, route params, form values, domain entities, and component
props. Components MUST be functional React components, kept small enough to review
and reuse, and organized around clear admin workflows. Shared logic MUST move into
custom hooks or focused utilities only when it removes real duplication or clarifies
ownership. `any`, broad casts, and untyped external data are prohibited unless the
feature plan documents why runtime validation cannot provide a safer boundary.

Rationale: This dashboard controls users, reports, service providers, moderation,
notifications, and analytics. Type gaps or oversized components make admin mistakes
more likely and slow down future feature work.

### II. Data and State Discipline
Server data MUST be fetched and mutated through TanStack React Query custom hooks,
backed by the shared Axios client once available. Components MUST NOT use `useEffect`
for API fetching. Forms MUST use React Hook Form with Zod validation for submitted
data. Client state MUST stay local unless it is shared across routes or sessions; use
Zustand only for deliberate global UI or session state. API errors, loading states,
empty states, and authorization failures MUST be represented explicitly in the UI.

Rationale: Admin screens depend on reliable, inspectable data flows. Consistent data
ownership prevents duplicated fetch logic, stale views, and hidden failure modes.

### III. Consistent Admin User Experience
New UI MUST use Tailwind CSS utilities and the existing Shadcn/Radix component
patterns for buttons, dialogs, tables, forms, menus, tabs, and accessible primitives.
Screens MUST follow a restrained admin-dashboard style optimized for scanning,
filtering, comparison, repeated actions, and clear status changes. Interactive
controls MUST include accessible names, keyboard behavior, visible focus states, and
clear disabled/loading states. Responsive layouts MUST preserve task completion on
smaller screens without overlapping text, clipped controls, or hidden critical
actions.

Rationale: Administrators need predictable, efficient workflows across users,
reports, providers, moderation, notifications, analytics, and settings.

### IV. Performance Budgets Are Product Requirements
Feature plans MUST define measurable performance goals for user-facing flows. Default
budgets are: route-level code splitting for heavy views, no avoidable duplicate API
requests, paginated or virtualized lists for large tables, memoized expensive chart or
map transforms, and production builds that do not introduce unexplained bundle growth.
Map, chart, and table screens MUST keep interactions responsive under expected data
volume by using server-side pagination/filtering or documented client-side limits.

Rationale: Admins must react quickly to road reports and help requests. Slow tables,
charts, or maps directly reduce operational effectiveness.

## Technology and Architecture Constraints

The project standard stack is React with Vite, strict TypeScript, Tailwind CSS,
Shadcn UI and Radix UI, React Router, TanStack React Query, Axios, React Hook Form,
Zod, Recharts, and Lucide React. Feature plans MUST justify any new runtime
dependency by explaining the user need, maintenance cost, bundle impact, and why the
existing stack is insufficient.

Routing, API access, validation schemas, and domain types MUST be placed in
predictable feature or shared locations documented by the implementation plan. Shared
Axios configuration MUST centralize base URL handling, auth headers, and 401 handling.
Mock data MUST be easy to remove when live .NET backend endpoints are connected and
MUST NOT leak into production behavior.

## Delivery Workflow and Quality Gates

Each feature specification MUST describe independently testable admin user journeys,
acceptance scenarios, edge cases, measurable success criteria, UX consistency
requirements, and performance expectations. Each implementation plan MUST pass the
Constitution Check before research and again after design.

Each task list MUST include setup or maintenance tasks for linting, type checking,
accessibility, responsive UI verification, and performance validation when the
feature touches UI or remote data. Tasks MUST be grouped by independently deliverable
user story, and each story MUST include its own verification path.

Pull requests or equivalent reviews MUST verify:

- TypeScript strictness and explicit domain/API typing.
- React Query, Axios, React Hook Form, and Zod usage where applicable.
- Shadcn/Radix/Tailwind consistency and accessibility behavior.
- Performance budget compliance for the affected screens.

## Governance

This constitution supersedes conflicting project notes, generated plans, templates,
and ad hoc implementation preferences. Amendments require a documented change to this
file, a semantic version bump, a Sync Impact Report, and updates to dependent
templates or guidance files in the same change.

Versioning policy:

- MAJOR: Removes or redefines a principle or governance rule in a way that changes
  required behavior.
- MINOR: Adds a principle, section, required quality gate, or materially expands
  existing guidance.
- PATCH: Clarifies wording, fixes errors, or updates references without changing
  required behavior.

Compliance is reviewed during feature planning, task generation, code review, and
final validation. Any approved exception MUST be recorded in the feature plan with
the reason, owner, risk, and follow-up date.

**Version**: 2.0.0 | **Ratified**: 2026-06-14 | **Last Amended**: 2026-06-14
