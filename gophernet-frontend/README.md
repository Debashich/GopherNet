# GopherNet Frontend

GopherNet Frontend is the user interface for the GopherNet platform, providing a modern, responsive, and interactive experience for real-time event management. Built with React and TypeScript, it connects seamlessly to the backend to deliver live updates, secure authentication, and intuitive event visualization.

---

## Why GopherNet Frontend?

Users expect real-time feedback, easy navigation, and a visually appealing interface when managing or participating in events. GopherNet Frontend addresses these needs by offering a fast, accessible, and feature-rich web application that brings the power of the backend to end users.

---

## What Does It Do?

- **Live Event Dashboard:** Displays real-time events as they are published, with instant updates via WebSocket.
- **Timeline Visualization:** Allows users to browse, filter, and explore events in a timeline format.
- **Authentication:** Supports secure login for different user roles (admin/user) using JWT tokens.
- **Event Management:** Enables users to view, join, and interact with events.
- **Responsive Design:** Ensures usability across devices with a mobile-friendly, modern UI.

---

## How Does It Work?

- **React & TypeScript:** Provides a robust, type-safe foundation for building scalable UI components.
- **WebSocket Integration:** Connects to the backend for real-time event streaming and updates.
- **REST API Consumption:** Fetches event data, authentication, and user info from the backend.
- **State Management:** Uses React hooks for managing authentication state, event lists, and UI interactions.
- **TailwindCSS:** Delivers a consistent, customizable, and responsive design system.
- **Vite:** Powers fast development and optimized builds for production deployment.
- **Nginx (optional):** Can be used to serve static files and proxy API/WebSocket requests in production.

---

## Key Components & Their Essence

- **Pages (`pages/`):** Main views like Home and Sign In, handling routing and layout.
- **Components (`components/`):** Reusable UI elements such as Navbar, Hero, EventCard, and Footer.
- **Hooks (`hooks/`):** Custom React hooks for fetching and managing event data.
- **Auth (`auth.ts`):** Manages JWT tokens and user roles in local storage.
- **Styles (`styles.css`):** TailwindCSS-based styling for a modern look and feel.
- **Config Files:** Vite, Tailwind, and TypeScript configs for streamlined development.

---

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## Why These Technologies?

- **React & TypeScript:** For building maintainable, scalable, and type-safe user interfaces.
- **TailwindCSS:** For rapid, utility-first styling and responsive design.
- **Vite:** For lightning-fast development and optimized production builds.
- **WebSocket:** For real-time, low-latency updates from the backend.
- **Nginx:** For efficient static file serving and proxying in production environments.

---

## License

MIT License

---