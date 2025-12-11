# EduSmart

EduSmart is a full-stack learning management experience built with a React (Vite + TypeScript) frontend and a Node/Express + MongoDB backend. It supports distinct student, tutor, and admin roles, AI-assisted study tools, hackathon management, and rich course/material workflows.

## Repository Structure

```
edusmartfinal/
├── README.md                  # You are here
└── edusmartapp/
    ├── src/...                # Frontend (React + Vite)
    ├── edusmart-backend/      # Backend (Node + Express + MongoDB)
    └── package.json           # Frontend package definition
```

> Note: The backend lives inside `edusmartapp/edusmart-backend`. All backend commands should be run from that directory.

## Prerequisites

- Node.js 18+
- npm 9+
- A running MongoDB instance
- (Optional) Cohere API key for AI chat and quiz generation

## Environment Variables

### Backend (`edusmartapp/edusmart-backend/.env`)

Create a `.env` file based on the template below:

```bash
MONGO_URI=mongodb://localhost:27017/edusmart
JWT_SECRET=replace_with_secure_random_string
PORT=3001
COHERE_API_KEY=your_cohere_key_optional
```

The backend will auto-provision a default admin (phone `9791761907`, password `Qwerty@1212`) if none exists.

### Frontend (`edusmartapp/.env.local`)

```bash
VITE_API_URL=http://localhost:3001/api
```

## Installation & Local Development

### 1. Install dependencies

```bash
# From the edusmartapp/ directory (frontend)
npm install

# From the edusmartapp/edusmart-backend/ directory (backend)
npm install
```

### 2. Run the backend

```bash
cd edusmartapp/edusmart-backend
npm run dev   # or npm start for non-watch mode
```

The server listens on `http://localhost:3001` and exposes REST endpoints under `/api/*`. File uploads are served from `/uploads`.

### 3. Run the frontend

```bash
cd edusmartapp
npm run dev
```

The Vite dev server defaults to `http://localhost:5173`. It proxies API calls to the backend via `VITE_API_URL`.

### 4. Log in

- **Admin:** Phone `9791761907`, password `Qwerty@1212`
- Tutors and students authenticate with the credentials stored in MongoDB (use the admin UI to provision accounts).

## Key Features

- **Role-based dashboards** for students, tutors, and admins
- **Course management** with tutor-led creation, editing, and material upload/delete
- **Hackathon management** with announcements and result publishing
- **AI Study tools** powered by Cohere (chat & quiz generation)
- **Book requests, notifications, and messaging** between tutors and admins

## Useful Commands

```bash
# Lint / type-check (frontend)
npm run lint
npm run build

# Backend linting (if configured)
npm run lint
```

## Troubleshooting

- Seeing `Cannot GET /` on the backend? This is expected; use `/api/...` endpoints instead.
- Material deletion requires a backend restart after changes to route handlers.
- Ensure MongoDB is reachable at `MONGO_URI`; otherwise the backend will exit at startup.

## Contributing

1. Fork the repository and create a feature branch.
2. Make changes adhering to existing TypeScript linting and formatting rules.
3. Provide descriptive commit messages and, when possible, add/update tests.
4. Open a pull request summarizing your changes and testing.

## License

This project is proprietary to the EduSmart team. Consult project owners before redistribution.