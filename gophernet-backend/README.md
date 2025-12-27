# GopherNet Backend

GopherNet Backend is the core service powering real-time event publishing, delivery, and management for the GopherNet platform. Designed for reliability and extensibility, it provides REST and WebSocket APIs for event-driven applications, supporting secure authentication, scheduling, and scalable data storage.

---

## Why GopherNet Backend?

Modern applications require real-time communication, robust event handling, and secure access control. GopherNet Backend addresses these needs by offering a flexible, production-ready broker for event management, suitable for dashboards, notification systems, and collaborative tools.

---

## What Does It Do?

- **Event Publishing:** Accepts and stores events via REST API, supporting both immediate and scheduled delivery.
- **Real-Time Delivery:** Broadcasts events to subscribers instantly using WebSocket connections.
- **Role-Based Authentication:** Secures sensitive endpoints with JWT-based authentication and role checks (admin/user).
- **Event Timeline:** Provides APIs to fetch and visualize event history, supporting filtering and timeline grouping.
- **Pluggable Storage:** Supports both in-memory and MySQL-backed storage for flexibility in development and production.

---

## How Does It Work?

- **Go-Powered Server:** Built with Go for high concurrency and performance.
- **REST & WebSocket APIs:** Exposes endpoints for publishing, subscribing, and managing events.
- **Broker Pattern:** Central broker manages event distribution and client subscriptions.
- **JWT Authentication:** Uses JSON Web Tokens to authenticate users and enforce role-based access.
- **Scheduler:** Background scheduler handles delayed/scheduled events, ensuring timely delivery.
- **MySQL Integration:** Persists events in a relational database for durability and querying; in-memory store available for testing.
- **Middleware:** Implements CORS and authentication middleware for secure, cross-origin access.

---

## Key Components & Their Essence

- **Broker (`broker.go`):** Manages event flow, subscriptions, and real-time broadcasting.
- **Store Layer (`store/`):** Abstracts data storage, supporting both memory and MySQL backends.
- **Authentication (`auth.go`):** Handles login, JWT issuance, and user roles.
- **Handlers (`handlers.go`):** Implements REST endpoints for event publishing, subscription, and management.
- **Middleware (`middleware.go`):** Secures endpoints and manages cross-origin requests.
- **Schema (`sql/schema.sql`):** Defines the MySQL schema for persistent event storage.

---

## Getting Started

1. **Configure Environment:**
   - Copy `.env.example` to `.env` and set your MySQL DSN, JWT secret, and allowed origins.

2. **Run the Server:**
   ```bash
   go run main.go
   ```

3. **API Endpoints:**
   - `POST /login` – Authenticate and receive JWT
   - `POST /publish` – Publish new event (admin only)
   - `GET /events` – Fetch recent events
   - `GET /subscribe` – WebSocket endpoint for real-time updates

---

## Why These Technologies?

- **Go:** Chosen for its performance, concurrency model, and suitability for networked services.
- **MySQL:** Provides reliable, scalable storage for event data.
- **WebSocket (Gorilla):** Enables low-latency, real-time event delivery to clients.
- **JWT:** Ensures secure, stateless authentication and role management.
- **Modular Design:** Store abstraction allows easy switching between in-memory and persistent storage.

---

## License

MIT License

---