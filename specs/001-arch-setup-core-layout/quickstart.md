# Quickstart: Architecture Setup & Core Layout

## Prerequisites
- Node.js installed.
- `.env` file created in root with `VITE_API_BASE_URL=http://localhost:5000/api`.

## Setup
1. **Install dependencies**:
   ```bash
   npm install axios vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react-swc -D
   ```
2. **Initialize Vitest**:
   Create `vitest.config.ts` or update `vite.config.ts` to include test configuration.

## Development
- **Run dev server**: `npm run dev`
- **Run tests**: `npm test`
- **Lint code**: `npm run lint`

## Architecture Highlights
- **Axios**: Located in `src/lib/axios.ts`.
- **Layout**: Main components in `src/components/layouts/`.
- **Providers**: `QueryProvider.tsx` wraps the application in `src/main.tsx`.
