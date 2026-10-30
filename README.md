# 🕵️‍♂️ AI Mystery Room

An interactive, AI-powered mystery-solving web application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB & Mongoose**, and **Google Gemini API**.

Players investigate custom or preset crime scenes, interrogate suspect dossiers, discover hidden forensic clues, request hints, and submit formal accusations to apprehend the culprit.

---

## 🌟 Key Features

- **Dynamic AI Mystery Generation:** Uses Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`) to procedurally author coherent, suspenseful detective narratives based on custom premises.
- **Strict Runtime Zod Validation:** All AI outputs are validated against schema rules to ensure balanced clues, valid motives, and logical coherence.
- **3 Balanced Difficulty Tiers:**
  - **Easy:** 3 Suspects, 5 Clues, 2 Hints (Base: 100 pts)
  - **Medium:** 4 Suspects, 7 Clues, 3 Hints (Base: 150 pts)
  - **Hard:** 5 Suspects, 9 Clues, 3 Hints (Base: 200 pts)
- **Anti-Cheat Security Architecture:** The true culprit identity, motive, and solution explanation are strictly sequestered on the backend database and excluded from all active investigation API responses.
- **Interactive Forensic Investigation:** Discover clues one by one, inspecting forensic evidence at specific scene locations (+5 bonus points per discovered clue).
- **Graduated Hint Guidance:** Request hints from senior inspectors with a score penalty (-10 points per hint).
- **Accusation Chamber:** Formal indictment interface requiring the detective to name the suspect and provide investigative rationale.
- **Fair Scoring Engine & Detective Rankings:**
  - Base Points (100 / 150 / 200 pts if correct, 0 if wrong)
  - Clue Bonus (+5 pts per discovered clue)
  - Hint Penalty (-10 pts per hint used)
  - Minimum total score bounded at 0
  - Detective Rank Tiers: **Master Detective** (≥ 160 pts), **Senior Inspector** (≥ 120 pts), **Investigative Sleuth** (≥ 70 pts), **Rookie Detective** (< 70 pts).
- **Comprehensive Resolution Debriefing:** Displays the full culprit confession, true motive, and a walkthrough of how every clue connects to the solution.
- **Resilient Database Layer:** Automatically connects to MongoDB Atlas or local MongoDB; includes an intelligent in-memory fallback for immediate zero-config testing.

---

## 🏗️ Architecture & Tech Stack

```
AI_mystery_room/
├── SPEC.md                  # Comprehensive Technical Specification
├── README.md                # Project documentation & run guide
├── package.json             # Root monorepo commands
├── client/                  # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer
│   │   ├── pages/           # Home, CreateCase, Investigation, Accusation, Result
│   │   ├── services/api.js  # Axios API client
│   │   ├── App.jsx          # Router & layout
│   │   ├── main.jsx         # Entrypoint
│   │   └── index.css        # Tailwind styles & noir theme
│   ├── tailwind.config.js   # Custom dark noir palette
│   └── vite.config.js       # Vite build & proxy config
└── server/                  # Node.js + Express backend
    ├── src/
    │   ├── config/db.js     # MongoDB connection with in-memory fallback
    │   ├── controllers/     # Case controllers (create, discover, hint, accuse)
    │   ├── models/Case.js   # Mongoose document schema
    │   ├── routes/          # REST API endpoints
    │   ├── schemas/         # Zod schemas for validation
    │   ├── services/        # Gemini API service & Case repository
    │   └── index.js         # Express server & static serving
    ├── test/api.test.js     # Automated API & lifecycle tests
    ├── .env                 # Environment variables
    └── .env.example         # Environment template
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- (Optional) MongoDB connection string or local MongoDB instance
- (Optional) Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Install Dependencies
```bash
# In server directory:
cd server
npm install

# In client directory:
cd ../client
npm install
```

### 2. Configure Environment Variables
In `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_mystery_room
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
> *Note:* If no `GEMINI_API_KEY` is provided, the server seamlessly engages its built-in procedural mystery engine so you can test all features and difficulty levels immediately!

### 3. Run Backend & Frontend in Development Mode
In terminal 1 (Backend):
```bash
cd server
npm run dev
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

Run the automated backend test suite covering health checks, mystery generation across difficulty tiers, anti-cheat sanitization, clue discovery, hint penalties, and accusation scoring:

```bash
cd server
npm test
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend health check |
| `GET` | `/api/cases` | List recent mystery cases |
| `POST` | `/api/cases` | Generate a new mystery (hides culprit & solution) |
| `GET` | `/api/cases/:id` | Fetch case dossier (sanitized for active games) |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Examine forensic clue (+5 pts) |
| `POST` | `/api/cases/:id/hints` | Request next hint (-10 pts) |
| `POST` | `/api/cases/:id/accuse` | Submit formal accusation & calculate score |
| `GET` | `/api/cases/:id/result` | Retrieve full resolution (only if case completed) |

### Sample `POST /api/cases` Request
```json
{
  "premise": "A rare emerald is stolen from the penthouse vault during a masquerade ball.",
  "difficulty": "medium"
}
```

### Sample `POST /api/cases/:id/accuse` Request
```json
{
  "suspectId": "suspect_1",
  "rationale": "Traces of glass cutter dust were found on their gloves, and their alibi contradicted the ballroom security log."
}
```

---

## 🛡️ Anti-Cheat & Security Features
1. **Server-Side Solution Privacy:** The `solution` object and `isCulprit` flags are never sent over the network to the frontend while a case is in progress.
2. **Hidden Clue Descriptions:** Undiscovered clue descriptions remain concealed on the backend until the player explicitly uses the "Inspect Evidence" action.
3. **Immutable Scoring:** Score points cannot be modified by client tampering; every calculation occurs on the Express backend upon accusation.

---

## 🌐 Deployment Instructions

### Backend (Render / Railway / Fly.io)
1. Set the root directory to `server/`.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `CLIENT_URL`: Your deployed frontend URL.

### Frontend (Vercel / Netlify)
1. Set root directory to `client/`.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://your-api.onrender.com/api`).

---

## 📋 Project Submission Info
- **Project Submission Link:** [https://bit.ly/ai-mystery-room-sub-form](https://bit.ly/ai-mystery-room-sub-form)
- **Project Deadline:** 2nd November, 11:59 PM
- **Spec Sheet Blueprint:** [SPEC.md](file:///home/juno/Documents/AI_mystery_room/SPEC.md)

