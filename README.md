<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-00e5ff?style=for-the-badge&labelColor=0a0a0f" alt="Version"/>
<img src="https://img.shields.io/badge/status-live-00ff88?style=for-the-badge&labelColor=0a0a0f" alt="Status"/>
<img src="https://img.shields.io/badge/license-MIT-a78bfa?style=for-the-badge&labelColor=0a0a0f" alt="License"/>
<img src="https://img.shields.io/badge/node.js-18%2B-339933?style=for-the-badge&logo=node.js&labelColor=0a0a0f" alt="Node"/>
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&labelColor=0a0a0f" alt="MongoDB"/>

<br/><br/>

```
 █████╗ ███████╗████████╗██╗  ██╗███████╗██████╗      ██████╗ ███████╗
██╔══██╗██╔════╝╚══██╔══╝██║  ██║██╔════╝██╔══██╗    ██╔═══██╗██╔════╝
███████║█████╗     ██║   ███████║█████╗  ██████╔╝    ██║   ██║███████╗
██╔══██║██╔══╝     ██║   ██╔══██║██╔══╝  ██╔══██╗    ██║   ██║╚════██║
██║  ██║███████╗   ██║   ██║  ██║███████╗██║  ██║    ╚██████╔╝███████║
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚══════╝
```

### **Real-Time Global Space Dashboard**
*Access high-fidelity orbital telemetry, coordinate deep space observation,*
*and monitor near-earth objects through our advanced neural command interface.*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-space--aether--os.vercel.app-00e5ff?style=for-the-badge)](https://space-aether-os.vercel.app/aether_os.html)
[![Backend API](https://img.shields.io/badge/⚙️_BACKEND_API-spaceaetheros.onrender.com-a78bfa?style=for-the-badge)](https://spaceaetheros.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/📁_GITHUB-TECH--SUGATA/SpaceAetherOS-ffffff?style=for-the-badge&logo=github&logoColor=white&labelColor=0a0a0f)](https://github.com/TECH-SUGATA/SpaceAetherOS)

<br/>

</div>

---

## ✦ Table of Contents

- [Overview](#-overview)
- [Live Deployment](#-live-deployment)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Socket.io Events](#-socketio-events)
- [Deployment Guide](#-deployment-guide)
- [Free Services Used](#-free-services-used)
- [License](#-license)

---

## ✦ Overview

**AetherOS** is a full-stack SaaS space-tech command platform built with a futuristic glassmorphism UI. It delivers live orbital data, AI-powered space assistance, SpaceX launch tracking, NASA imagery, and near-earth object monitoring — all in real time.

> *"All systems nominal. Orbital trajectory stable."*

---

## ✦ Live Deployment

| Service | Platform | URL |
|---|---|---|
| 🌐 Frontend | Vercel | [space-aether-os.vercel.app](https://space-aether-os.vercel.app/aether_os.html) |
| ⚙️ Backend API | Render | [spaceaetheros.onrender.com](https://spaceaetheros.onrender.com) |
| 🗄️ Database | MongoDB Atlas | Cluster0 — Singapore |
| 📁 Source Code | GitHub | [TECH-SUGATA/SpaceAetherOS](https://github.com/TECH-SUGATA/SpaceAetherOS) |

> ⚠️ **Note:** The backend runs on Render's free tier and may take **30–50 seconds** to wake up after inactivity.

---

## ✦ Features

### 🛸 Core Modules

| Module | Description |
|---|---|
| 🌍 **Live ISS Tracker** | Real-time ISS position via Socket.io — updates every 5 seconds |
| 🚀 **SpaceX Launch Center** | Upcoming & past launches with live countdown timers |
| 🔭 **NASA Gallery** | Astronomy Picture of the Day, Mars Rover photos, deep space imagery |
| ☄️ **Asteroid Monitor** | Near-Earth Object tracking with threat level classifications |
| 🤖 **AI Oracle** | Gemini-powered space assistant chatbot with voice waveform UI |
| 🔐 **Auth System** | JWT authentication + Firebase Google OAuth login |
| 📊 **Command Dashboard** | KPI cards, analytics, saved missions, and favorite launches |
| 🔔 **Live Notifications** | Real-time alerts delivered via Socket.io |
| 📰 **Space News Feed** | Latest space news from the Spaceflight News API |

### 🎨 UI/UX Highlights

- Futuristic glassmorphism design with animated cosmic background
- Tri-color accent palette — Cyan / Violet / Pink
- Fully responsive — Mobile · Tablet · Laptop · Desktop · Ultra-wide
- Animated orbital rings, nebula blobs, twinkling star fields
- HUD corner decorations, aurora gradient strips, scanline effects
- Mobile bottom navigation, collapsible sidebar, adaptive layouts

---

## ✦ Tech Stack

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)

### APIs & Services
![NASA](https://img.shields.io/badge/NASA_API-0B3D91?style=flat-square&logo=nasa&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)
![SpaceX](https://img.shields.io/badge/SpaceX_API-005288?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

---

## ✦ Project Structure

```
SpaceAetherOS/
│
├── 📁 frontend/
│   ├── aether_os.html          ← Main SPA (Landing → Login → Dashboard)
│   ├── space_dashboard.html    ← React + Three.js 3D Earth Dashboard
│   └── index.html              ← Redirect entry point
│
├── 📁 backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js              ← Express app configuration
│       ├── server.js           ← HTTP + Socket.io server entry
│       │
│       ├── 📁 config/
│       │   ├── db.js           ← MongoDB Atlas connection
│       │   └── firebase.js     ← Firebase Admin SDK setup
│       │
│       ├── 📁 controllers/
│       │   ├── authController.js
│       │   ├── nasaController.js
│       │   ├── spacexController.js
│       │   ├── issController.js
│       │   ├── newsController.js
│       │   ├── chatbotController.js
│       │   └── dashboardController.js
│       │
│       ├── 📁 routes/
│       │   ├── auth.js
│       │   ├── nasa.js
│       │   ├── spacex.js
│       │   ├── iss.js
│       │   ├── news.js
│       │   ├── chatbot.js
│       │   └── dashboard.js
│       │
│       ├── 📁 models/
│       │   ├── User.js
│       │   ├── FavoriteLaunch.js
│       │   ├── SavedMission.js
│       │   ├── Notification.js
│       │   ├── ChatHistory.js
│       │   └── UserActivity.js
│       │
│       ├── 📁 middleware/
│       │   ├── auth.js         ← JWT verification
│       │   ├── errorHandler.js
│       │   ├── rateLimiter.js
│       │   └── validate.js
│       │
│       ├── 📁 services/
│       │   ├── authService.js
│       │   ├── nasaService.js
│       │   ├── spacexService.js
│       │   ├── issService.js
│       │   ├── newsService.js
│       │   └── chatbotService.js
│       │
│       ├── 📁 sockets/
│       │   └── socketHandler.js  ← Live ISS tracking (5s interval)
│       │
│       ├── 📁 jobs/
│       │   └── cronJobs.js       ← Auto cache refresh
│       │
│       └── 📁 utils/
│           ├── cache.js
│           ├── jwt.js
│           └── apiResponse.js
│
├── 📄 render.yaml              ← Render.com deployment config
├── 📄 .gitignore
└── 📄 README.md
```

---

## ✦ Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- MongoDB Atlas account (free)
- NASA API key (free)
- Google Gemini API key (free)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/TECH-SUGATA/SpaceAetherOS.git
cd SpaceAetherOS

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# 4. Start the backend server
npm run dev
# Server starts at http://localhost:5000

# 5. Open the frontend
# Open frontend/aether_os.html in your browser
# Or use VS Code Live Server for best experience
```

---

## ✦ Environment Variables

Copy `backend/.env.example` → `backend/.env` and fill in all values:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/aetheros

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# NASA API — get free key at api.nasa.gov
NASA_API_KEY=DEMO_KEY

# Google Gemini AI — get free key at aistudio.google.com
GEMINI_API_KEY=AIzaSy...

# Firebase (optional — for Google login)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Frontend URL (for CORS)
FRONTEND_URL=https://space-aether-os.vercel.app
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ Yes | Minimum 32 character random string |
| `NASA_API_KEY` | ✅ Yes | Use `DEMO_KEY` for testing |
| `GEMINI_API_KEY` | ⭐ Recommended | AI Oracle chatbot responses |
| `FIREBASE_*` | 🔵 Optional | Required only for Google OAuth login |
| `FRONTEND_URL` | ✅ Yes | Your deployed frontend URL for CORS |

---

## ✦ API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Email/password login |
| `POST` | `/api/auth/google` | ❌ | Firebase Google OAuth |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `POST` | `/api/auth/logout` | ✅ | Logout and invalidate token |

### NASA Data
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/nasa/apod` | ❌ | Astronomy Picture of the Day |
| `GET` | `/api/nasa/mars` | ❌ | Mars Rover photos |
| `GET` | `/api/nasa/asteroids` | ❌ | Near-Earth Objects |
| `GET` | `/api/nasa/images?q={query}` | ❌ | NASA image library search |

### SpaceX
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/spacex/upcoming` | ❌ | Upcoming launches |
| `GET` | `/api/spacex/past` | ❌ | Past launches |
| `GET` | `/api/spacex/rockets` | ❌ | Rocket details |
| `GET` | `/api/spacex/stats` | ❌ | Launch statistics |

### ISS Tracking
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/iss/position` | ❌ | Live ISS coordinates |
| `GET` | `/api/iss/crew` | ❌ | Current crew roster |
| `GET` | `/api/iss/pass?lat=28&lon=77` | ❌ | Pass times for location |

### Dashboard & User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | ❌ | Full dashboard data |
| `GET` | `/api/dashboard/user` | ✅ | Personalized dashboard |
| `POST` | `/api/dashboard/favorites` | ✅ | Bookmark a launch |
| `POST` | `/api/dashboard/missions` | ✅ | Save a mission |
| `GET` | `/api/dashboard/notifications` | ✅ | User notifications |
| `POST` | `/api/chatbot` | ❌ | AI Oracle message |
| `GET` | `/api/news` | ❌ | Latest space news |

---

## ✦ Socket.io Events

```javascript
const socket = io('https://spaceaetheros.onrender.com');

// Live ISS Position (updates every 5 seconds)
socket.emit('subscribe:iss');
socket.on('iss:update', ({ latitude, longitude, altitude, velocity }) => {
  console.log(`ISS → Lat: ${latitude}, Lon: ${longitude}`);
});

// SpaceX Launch Updates
socket.emit('subscribe:launches');
socket.on('launch:update', (launchData) => {
  console.log(launchData);
});

// User Notifications (requires auth)
socket.emit('subscribe:notifications', { userId: 'USER_ID' });
socket.on('notification:new', (notification) => {
  console.log(notification.message);
});
```

---

## ✦ Deployment Guide

### Backend → Render.com

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your `TECH-SUGATA/SpaceAetherOS` GitHub repository
3. Configure the service:

| Setting | Value |
|---|---|
| **Name** | aetheros-backend |
| **Region** | Singapore |
| **Runtime** | Node |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Plan** | Free |

4. Add all environment variables from the table above
5. Click **Deploy Web Service** ✅

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `TECH-SUGATA/SpaceAetherOS` from GitHub
3. Set **Root Directory** to `frontend`
4. Set **Framework Preset** to `Other`
5. Click **Deploy** ✅

### Database → MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free **M0 cluster** (512MB storage)
3. Create database user and whitelist `0.0.0.0/0` for Render access
4. Copy connection string → add to `MONGODB_URI` environment variable ✅

---

## ✦ Free Services Used

| Service | Purpose | Free Tier |
|---|---|---|
| [MongoDB Atlas](https://mongodb.com/cloud/atlas) | Database | 512MB forever |
| [Render.com](https://render.com) | Backend hosting | 750 hrs/month |
| [Vercel](https://vercel.com) | Frontend hosting | Unlimited |
| [NASA API](https://api.nasa.gov) | Space data | 1,000 req/hour |
| [SpaceX API](https://github.com/r-spacex/SpaceX-API) | Launch data | Unlimited |
| [Google Gemini](https://aistudio.google.com) | AI chatbot | 15 RPM free |
| [Firebase Auth](https://firebase.google.com) | Google login | 50k users/month |
| [Spaceflight News](https://spaceflightnewsapi.net) | Space news | Unlimited |

---

## ✦ Security

- All API keys stored as environment variables — never hardcoded
- JWT tokens with expiration for session management
- bcrypt password hashing (12 salt rounds)
- Helmet.js HTTP security headers
- Express rate limiting to prevent abuse
- CORS configured to allow only the frontend URL
- MongoDB input sanitization via express-validator

---

## ✦ License

```
MIT License — Copyright (c) 2026 TECH-SUGATA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, and/or
sell copies of the software, subject to the standard MIT license conditions.
```

---

<div align="center">

**Built with ❤️ by [TECH-SUGATA](https://github.com/TECH-SUGATA)**

⭐ If you found this project helpful, please consider giving it a star!

[![GitHub stars](https://img.shields.io/github/stars/TECH-SUGATA/SpaceAetherOS?style=social)](https://github.com/TECH-SUGATA/SpaceAetherOS)

```
█████╗ ██╗     ██╗         ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗███████╗
██╔══██╗██║     ██║         ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║██╔════╝
███████║██║     ██║         ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║███████╗
██╔══██║██║     ██║         ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║╚════██║
██║  ██║███████╗███████╗    ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║███████║
╚═╝  ╚═╝╚══════╝╚══════╝    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝
```

*"All systems nominal. Orbital trajectory stable."*

</div>
