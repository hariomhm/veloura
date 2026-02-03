# Veloura - Ecommerce Platform

Veloura is a full-featured ecommerce app built with React (Vite) and a Node/Express + MongoDB backend (MERN). Authentication uses JWT access + refresh rotation via HTTP-only cookies with optional Google SSO. Payments use Razorpay, and product images are uploaded locally via the API.

## Tech Stack

### Frontend
- **React 19** + **Vite**
- **Redux Toolkit** for state management
- **React Router** for routing
- **TailwindCSS** for styling
- **React Hook Form** for forms

### Backend
- **Node.js + Express** REST API
- **MongoDB + Mongoose** database
- **JWT** authentication (access + refresh rotation)
- **Multer** for local uploads

### Payments
- **Razorpay**

## Architecture Overview

- **Frontend**: React SPA
- **API**: Express REST endpoints
- **Database**: MongoDB
- **Auth**: HTTP-only cookies + refresh token rotation + CSRF protection
- **Uploads**: Local files served from `/uploads`

## Features

### User Features
- Product browsing, filtering, and search
- Cart management
- Wishlist
- Secure checkout with Razorpay
- Order history & tracking
- Profile management

### Admin Features
- Dashboard
- Product management (add/edit/delete)
- User management (roles, ban/unban)
- Order status updates

## Environment Variables

### Frontend (`.env`)
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXXXXXX
VITE_SITE_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=
```

### Backend (`server/.env`)
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/veloura
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
MAX_SESSIONS_PER_USER=1
COOKIE_DOMAIN=
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
CLIENT_ORIGIN=http://localhost:5173
SITE_URL=http://localhost:5173
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_MAX=10
CHECKOUT_TTL_MINUTES=15
GOOGLE_CLIENT_ID=
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

## Local Development

1) **Install dependencies**
```bash
npm install
cd server && npm install
```

2) **Set env files**
```bash
cp .env.example .env
cp server/.env.example server/.env
```

3) **Run dev servers**
```bash
npm run dev
cd server && npm run dev
```

## Deployment Notes

- **Frontend**: deploy the Vite build to Vercel/Netlify or any static host.
- **Backend**: deploy Express to Render, Railway, Fly.io, or a VPS.
- **Database**: use MongoDB Atlas or a managed MongoDB provider.
