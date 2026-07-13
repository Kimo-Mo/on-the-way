# 🚦 On The Way - Admin Control Panel

> **A comprehensive, real-time dashboard for managing the "On The Way" ecosystem.**

The **On The Way - Admin Control Panel** is an enterprise-grade administrative dashboard designed to provide seamless oversight, live incident tracking, and powerful moderation capabilities. Built with scalability and performance in mind, this control panel empowers administrators to govern user interactions, monitor real-time map activity, and broadcast system-wide announcements instantly.

---

## ✨ Key Features

- **🔐 Advanced Authentication:** Features robust JWT-based authentication paired with an advanced Refresh Token queue logic via Axios interceptors, alongside seamless Google OAuth integration.
- **🗺️ Real-Time Dashboard:** Incorporates highly interactive Leaflet maps mapping live coordinates for immediate incident response, paired with Recharts for visualizing user distribution and growth metrics.
- **👥 Comprehensive User Management:** Full CRUD capabilities for user administration, strict role assignment workflows guarded by confirmation modals, and secure Admin registration functionalities.
- **🚨 Incident & Help Requests:** Streamlined moderation workflows featuring Optimistic UI updates, ensuring that status transitions (e.g., Open → Solved → Closed) reflect instantly without network latency flicker.
- **📢 System Notifications:** A dedicated communications hub capable of executing both immediate broadcast announcements and precisely scheduled push notifications to targeted user roles.
- **🛠️ Custom Hooks & Utilities:** Engineered with highly reusable abstractions, including a dynamic client-side pagination hook and a globally standardized API response wrapper.

---

## 🛠️ Tech Stack & Libraries

This project is engineered using modern, strictly typed web technologies to ensure a pristine and maintainable codebase.

**Core & Architecture**
- ⚛️ **React 19**
- 📘 **TypeScript (~6.0, Strict Mode)**
- ⚡ **Vite**

**State Management & Data Fetching**
- 🐻 **Zustand** (Global Client State)
- 🔄 **React Query (@tanstack/react-query v5)** (Server State & Caching)
- 📡 **Axios** (API Client with Interceptors)

**UI & Styling**
- 🎨 **Tailwind CSS v4**
- 🧩 **Shadcn UI & Radix UI** (Accessible Component Primitives)
- ❇️ **Lucide React** (Iconography)

**Forms & Validation**
- 📝 **React Hook Form**
- 🛡️ **Zod** (Schema Validation)

**Data Visualization & Mapping**
- 🗺️ **React Leaflet**
- 📊 **Recharts**

**Routing & Navigation**
- 🛣️ **React Router v7**

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd on-the-way
\`\`\`

### 2. Install Dependencies
Make sure you have Node.js installed, then run:
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the root of the project and populate it with the required keys:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
\`\`\`

### 4. Run the Development Server
Launch the application using Vite:
\`\`\`bash
npm run dev
\`\`\`
The application will usually be available at `http://localhost:5173`.

---

## 📁 Folder Structure Overview

\`\`\`text
on-the-way/
├── public/                 # Static assets (images, icons, etc.)
├── src/                    
│   ├── components/         # Reusable UI components (Auth, Dashboard, Maps, Shadcn UI)
│   ├── hooks/              # Custom React Hooks (useAuth, useUsers, useReports)
│   ├── lib/                # Library configurations (Axios instances, utils)
│   ├── pages/              # Primary route views (Dashboard, Login, User Details)
│   ├── providers/          # Global Context Providers (Theme, Query)
│   ├── store/              # Zustand global state stores
│   ├── types/              # Strict TypeScript interfaces and Zod schemas
│   ├── App.tsx             # Application routing mapping
│   └── main.tsx            # React application entry point
├── specs/                  # Project specifications and requirement documents
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript compiler configuration
└── vite.config.ts          # Vite bundler configuration
\`\`\`

---

## 👨‍💻 Author & Credits

Designed and engineered by **Kareem Mohamed**
*Front-End Web Developer | Final Year Student at Faculty of Computers and Information, Zagazig University*

Dedicated to creating fluid, highly responsive, and meticulously typed user interfaces.
