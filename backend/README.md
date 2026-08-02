# URL Shortener Backend

A Node.js and Express backend for the URL shortener project. It exposes API routes for shortening URLs, redirecting short links, fetching details, and returning basic analytics.

## Features

- URL shortening with optional custom short codes
- Redirect support for short links
- Analytics and detail responses for stored links
- Validation and rate limiting
- Local JSON storage fallback for development and demo use

## Tech Stack

- Runtime: Node.js 18+
- Framework: Express.js
- Validation: Joi
- Security: Helmet, CORS, express-rate-limit
- Documentation: Swagger
- Testing: Jest, Supertest

## Project Structure

```text
backend/
├── config/
├── constants/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── tests/
├── utils/
├── data/
├── index.js
└── package.json
```

## Installation

```bash
cd backend
npm install
```

## Running the Server

```bash
npm run dev
```

The server will run on http://localhost:3000.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create a short URL |
| GET | `/api/urls` | Get stored URLs |
| GET | `/api/details/:shortUrl` | Get URL details |
| GET | `/api/analytics/:shortUrl` | Get URL analytics |
| GET | `/:shortUrl` | Redirect to the original URL |
| GET | `/health` | Health check |

## Environment Variables

You can optionally use the following values:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Notes

- The project currently uses a local JSON file for storage so it can run without needing a MongoDB account.
- If you later connect a real database, the API structure can remain the same.

## License

ISC License
