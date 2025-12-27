# GopherNet

GopherNet is a real-time event management platform that enables users to publish, discover, and join events with instant updates and secure authentication. Built with a modern full stack Go for the backend and React/TypeScript for the frontend. GopherNet is designed for scalability, reliability, and a seamless user experience.

---

## Features

- **Real-Time Event Streaming:** Instantly publish and receive event updates via REST and WebSocket APIs.
- **Timeline Visualization:** View and filter events in a dynamic, interactive timeline.
- **Role-Based Authentication:** Secure access for admins and users with JWT-based authentication.
- **Scalable Architecture:** Deployable with Docker and Nginx for production-ready performance.
- **Modern UI:** Responsive frontend built with React, TypeScript, TailwindCSS, and Vite.

---

## Tech Stack

- **Backend:** Go, MySQL, JWT, Gorilla WebSocket
- **Frontend:** React, TypeScript, TailwindCSS, Vite
- **DevOps:** Docker, Nginx
- **Other:** REST APIs, WebSocket, Role-based access

---

## Use Cases

- Live event dashboards for organizations or communities
- Real-time notifications and activity feeds
- Collaborative scheduling and event management

---

## Getting Started

### Prerequisites

- Go (>=1.25)
- Node.js (>=18)
- MySQL (or use in-memory store for development)
- Docker (optional, for containerized deployment)

### Backend Setup

```bash
cd gophernet-backend
cp .env.example .env
go run main.go
```

### Frontend Setup

```bash
cd gophernet-frontend
npm install
npm run dev
```

### Docker Deployment

You can use Docker Compose or individual Dockerfiles for backend and frontend for easy deployment. (WIP)

---

## Project Structure

```
gophernet-backend/    # Go backend (REST, WebSocket, Auth, MySQL)
gophernet-frontend/   # React frontend (UI, Auth, Timeline)
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

## License

This project is licensed under the MIT License.
