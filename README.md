# 🚀 AetherOS — Real-Time Global Space Dashboard

> A futuristic, full-stack SaaS space-tech command platform with live orbital telemetry, SpaceX launches, NASA imagery, AI assistant, and asteroid monitoring.

![AetherOS](https://img.shields.io/badge/AetherOS-v1.0.0-00e5ff?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)

---

## 📁 Project Structure

```
aetheros/
├── frontend/
│   ├── aether_os.html        ← Main multi-page SPA (Landing → Login → Dashboard)
│   └── space_dashboard.html  ← Full React + Three.js dashboard
│
├── backend/
│   ├── src/
│   │   ├── config/           ← DB & Firebase config
│   │   ├── controllers/      ← Route handlers
│   │   ├── routes/           ← Express routes
│   │   ├── models/           ← Mongoose schemas
│   │   ├── middleware/       ← Auth, rate limit, validation
│   │   ├── services/         ← Business logic & API integrations
│   │   ├── sockets/          ← Socket.io live tracking
│   │   ├── jobs/             ← Cron jobs (cache refresh)
│   │   ├── utils/            ← Helpers (cache, JWT, responses)
│   │   ├── app.js            ← Express app
│   │   └── server.js         ← HTTP + Socket.io server
│   ├── .env.example
│   └── package.json
│
├── render.yaml               ← Render.com deployment config
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/aetheros.git
cd aetheros
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### 3. Open Frontend

Open `frontend/aether_os.html` directly in your browser — **no build step needed**.

Or use Live Server in VS Code for best experience.

---

## 🔑 Environment Variables

Copy `backend/.env.example` → `backend/.env` and fill in:

| Variable | Description | Where to get |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | [mongodb.com/atlas](https://mongodb.com/cloud/atlas) |
| `JWT_SECRET` | Random string (min 32 chars) | Generate yourself |
| `NASA_API_KEY` | NASA API key (`DEMO_KEY` works for testing) | [api.nasa.gov](https://api.nasa.gov) |
| `GEMINI_API_KEY` | Google Gemini AI key | [aistudio.google.com](https://aistudio.google.com) |
| `FIREBASE_PROJECT_ID` | Firebase project ID | [console.firebase.google.com](https://console.firebase.google.com) |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | Firebase Console → Settings → Service Accounts |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Firebase Console → Settings → Service Accounts |

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Email/password login |
| `POST` | `/api/auth/google` | ❌ | Firebase Google login |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `GET` | `/api/nasa/apod` | ❌ | Astronomy Picture of the Day |
| `GET` | `/api/nasa/mars` | ❌ | Mars Rover photos |
| `GET` | `/api/nasa/asteroids` | ❌ | Near-Earth Objects |
| `GET` | `/api/nasa/images?q=galaxy` | ❌ | NASA Image Library |
| `GET` | `/api/spacex/upcoming` | ❌ | Upcoming SpaceX launches |
| `GET` | `/api/spacex/past` | ❌ | Past launches |
| `GET` | `/api/spacex/rockets` | ❌ | Rocket details |
| `GET` | `/api/spacex/stats` | ❌ | Launch statistics |
| `GET` | `/api/iss/position` | ❌ | Live ISS coordinates |
| `GET` | `/api/iss/crew` | ❌ | Current ISS crew |
| `GET` | `/api/iss/pass?lat=28&lon=77` | ❌ | Pass times for location |
| `GET` | `/api/news` | ❌ | Latest space news |
| `POST` | `/api/chatbot` | ❌ | AI Oracle message |
| `GET` | `/api/dashboard/summary` | ❌ | Full dashboard data |
| `GET` | `/api/dashboard/user` | ✅ | User dashboard |
| `POST` | `/api/dashboard/favorites` | ✅ | Bookmark a launch |
| `POST` | `/api/dashboard/missions` | ✅ | Save a mission |
| `GET` | `/api/dashboard/notifications` | ✅ | User notifications |

---

## 🔌 Socket.io Events

```javascript
// Connect
const socket = io('http://localhost:5000');

// Subscribe to live ISS tracking
socket.emit('subscribe:iss');
socket.on('iss:update', (position) => {
  console.log(position.latitude, position.longitude);
});

// Subscribe to launch updates
socket.emit('subscribe:launches');

// Subscribe to notifications (after login)
socket.emit('subscribe:notifications', { userId: 'USER_ID' });
socket.on('notification:new', (notif) => console.log(notif));
```

---

## 🚀 Deployment

### Backend → Render.com (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. **Build Command:** `cd backend && npm install`
5. **Start Command:** `cd backend && npm start`
6. Add all environment variables in Render dashboard
7. Deploy ✅

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Deploy ✅ (static HTML, no build needed)

### Database → MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Get connection string → add to `MONGODB_URI`

---

## 🛠 Tech Stack

**Frontend:** HTML5, CSS3, Tailwind CSS, React 18, Three.js, Chart.js, Material Symbols

**Backend:** Node.js 18+, Express.js, MongoDB Atlas, Mongoose, Socket.io, JWT, bcryptjs, Firebase Admin

**APIs:** NASA API, SpaceX API, Open Notify (ISS), Spaceflight News API, Google Gemini AI

**Security:** Helmet.js, express-rate-limit, CORS, express-validator, bcrypt

---

## 📦 Free Services Used

| Service | Purpose | Free Tier |
|---|---|---|
| MongoDB Atlas | Database | 512MB forever |
| Render.com | Backend hosting | 750 hrs/month |
| Vercel | Frontend hosting | Unlimited |
| NASA API | Space data | Unlimited (DEMO_KEY) |
| SpaceX API | Launch data | Unlimited |
| Gemini API | AI chatbot | 15 RPM free |
| Firebase Auth | Google login | 50k users/month |

---

## 🎯 Features

- 🌍 **Live ISS Tracking** — Real-time position via Socket.io (updates every 5s)
- 🚀 **SpaceX Launches** — Upcoming missions with countdown timers
- 🔭 **NASA Gallery** — APOD, Mars Rover, deep space imagery
- ☄️ **Asteroid Monitor** — NEO tracking with threat levels
- 🤖 **AI Oracle** — Gemini-powered space assistant chatbot
- 🔐 **Auth System** — JWT + Firebase Google login
- 📊 **Dashboard** — Analytics, favorites, saved missions
- 🔔 **Notifications** — Real-time alerts via Socket.io
- ⚡ **Cron Jobs** — Automatic cache refresh for all APIs
- 🎨 **Responsive UI** — Mobile, tablet, desktop, ultra-wide

---

## 📄 License

MIT License — Free to use for portfolios, hackathons, and startup projects.

---

Made with ❤️ by the AetherOS Team | *"All systems nominal. Orbital trajectory stable."*
