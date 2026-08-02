# URL Shortener App

A full-stack URL shortener application built with React for the frontend and Node.js/Express for the backend. It allows users to shorten long URLs, redirect short links, and view basic link information through a simple API-driven experience.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Deployment Notes](#deployment-notes)
- [License](#license)

## Features

- ✅ URL shortening from long URLs
- ✅ Redirect support for generated short links
- ✅ Basic link metadata and analytics response
- ✅ Responsive React-based UI
- ✅ Backend API with validation and rate limiting
- ✅ Local demo-friendly storage fallback so the app runs without a MongoDB account

## Technology Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express.js
- Joi for validation
- Helmet, CORS, express-rate-limit
- Swagger for API documentation

### Storage

- MongoDB support is intended for production use
- The current local setup uses a JSON file fallback for demo and development purposes

## Project Structure

```text
Uniform_Resource_Locator_Application/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── data/
│   └── index.js
├── react-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd react-frontend
npm install
```

## Running the App

### Start the backend

```bash
cd backend
npm run dev
```

### Start the frontend

```bash
cd react-frontend
npm run dev -- --host 0.0.0.0
```

### Open the app

- Frontend: http://localhost:5173/
- Backend API: http://localhost:3000/
- API Docs: http://localhost:3000/api-docs/

## API Endpoints

### URL Shortening

- POST /api/shorten

### URL Listing and Details

- GET /api/urls
- GET /api/details/:shortUrl
- GET /api/analytics/:shortUrl

### Redirect

- GET /:shortUrl

## Deployment Notes

The current project is set up for local development and demo use. For production deployment, you can later connect the backend to a real database and host the frontend separately.

## License

This project is licensed under the MIT License.
