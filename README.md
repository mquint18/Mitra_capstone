# Mitra

**Your neighborhood, connected.**

## Overview

Mitra is a full stack web application that connects residents with trusted local businesses. Residents can search for services, book appointments, and get help figuring out what kind of task they're dealing with using an AI advisor. Businesses can register, build a public listing, manage their availability on a calendar, and respond to booking requests from a dedicated dashboard.

The project was built as a capstone to demonstrate a complete MERN stack application with dual authentication, role based access control, a live booking system, and a third party AI integration.

## Tech Stack

**Frontend**

- React (Vite)
- React Router
- Custom CSS (no UI framework)

**Backend**

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

**AI**

- Anthropic API (Claude) for the AI job advisor feature

**Hosting**

- Render (frontend static site and backend web service)
- MongoDB Atlas (database)

## Key Features

- **Dual account types.** Separate registration and login flows for residents and businesses, each with their own dashboard and permissions.
- **Business search.** Residents can search and filter businesses by name, category, or keyword using MongoDB full text search, without needing to be logged in.
- **Booking system.** Residents can request an appointment with a business. Businesses can confirm, decline, or mark bookings complete. Residents can cancel their own bookings. Access is enforced so users can only act on their own bookings.
- **Business dashboard.** Businesses manage their listing, set weekly availability and time slots on an interactive calendar, and review incoming booking requests.
- **Resident dashboard.** Residents view upcoming and past bookings, browse nearby businesses, and manage their profile.
- **Admin panel.** A protected admin view for managing all businesses, residents, and bookings in the system.
- **Role based access control.** JWT based authentication with role checks on both the frontend (protected routes) and backend (middleware) to ensure residents, businesses, and admins can only access what they're supposed to.
- **Automated tests.** A smoke test suite and a full booking lifecycle test suite that exercise the API's validation, authentication, and authorization logic end to end.

## AI-Powered Feature: Ask Mitra

Mitra includes an AI advisor, powered by Claude, that helps residents figure out what a household task actually involves before they decide to hire a professional or do it themselves.

A resident describes a task in plain language (for example, _"I need to trim a large tree"_) and selects their experience level (Beginner, Intermediate, or Professional). The backend sends this information to the Claude API with a structured prompt, and Claude returns a Markdown formatted assessment covering:

- Difficulty level
- Tools required
- Estimated time
- Safety concerns
- A recommendation on whether to DIY or hire a professional
- An approximate cost range

This is presented back to the resident in a formatted response inside the app. The feature is informational only. Mitra's Terms of Service page includes a dedicated section clarifying that AI responses are not a substitute for advice from a licensed professional, particularly for anything involving electrical, gas, or structural work.

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm
- A MongoDB Atlas account (or local MongoDB instance)
- An Anthropic API key

### Clone the repository

```bash
git clone https://github.com/mquint18/Mitra_capstone.git
cd Mitra_capstone
```

### Install dependencies

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

## Running the Backend

```bash
cd Backend
node server.js
```

The backend runs on `http://localhost:5001` by default (configurable via the `PORT` environment variable). Confirm it's running by visiting `http://localhost:5001/test`, which should return:

```json
{ "message": "Server is working!" }
```

## Running the Frontend

```bash
cd Frontend
npm run dev
```

The frontend runs on `http://localhost:5173` by default. Open that URL in your browser once both the frontend and backend are running.

## Environment Variables

Each app has its own environment file. Neither `.env` file is committed to the repository, create them locally using the values below.

### Backend — `Backend/.env`

```
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=a-long-random-secret-string
ANTHROPIC_API_KEY=your-anthropic-api-key
CLIENT_URL=http://localhost:5173
PORT=5001
```

| Variable            | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `MONGO_URI`         | Connection string for your MongoDB Atlas cluster               |
| `JWT_SECRET`        | Secret used to sign and verify JWTs. Use a long, random string |
| `ANTHROPIC_API_KEY` | API key for the Claude API, used by the AI advisor feature     |
| `CLIENT_URL`        | The frontend's URL, used to configure CORS                     |
| `PORT`              | Port the Express server listens on (defaults to 5001 if unset) |

### Frontend — `Frontend/.env` or `Frontend/.env.production`

```
VITE_API_URL=http://localhost:5001
```

| Variable       | Description                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Base URL the frontend uses for all API requests. Set to your local backend during development, and to your deployed backend URL in production |

## Deployment

- **Frontend:** [https://mitra-project.onrender.com](https://mitra-project.onrender.com)
- **Backend API:** [https://mitra-backend-djc8.onrender.com](https://mitra-backend-djc8.onrender.com)

Both are deployed on Render as separate services from the same repository, with the frontend built as a static site (`npm run build`, published from `dist`) and the backend running as a Node web service (`node server.js`).

## How AI Was Used During Development

Beyond the AI advisor feature described above, AI assistance (Claude, via Claude.ai) was used throughout the development of this project as a coding and debugging partner. It was used to:

- Scaffold React components, Express routes, and Mongoose models based on the app's requirements
- Debug deployment issues across the move from local development to Vercel and then to Render, including CORS configuration, environment variable handling, ES module errors, and client side routing on a static host
- Refactor duplicated code (shared API config, formatting helpers, and a reusable logo component) into shared utility files
- Write an automated test suite covering authentication, authorization, and the full booking lifecycle, which was then run against the live backend to verify correctness
- Draft and revise page copy, including the About, Privacy, and Terms of Service pages
- Review and fix CSS scoping issues where global selectors in one page's stylesheet were unintentionally affecting other pages

All AI generated code was reviewed, tested, and adjusted before being committed. The 32 passing automated tests in the `tests/` directory were used as a checkpoint throughout development to confirm that AI assisted changes did not break existing functionality.
