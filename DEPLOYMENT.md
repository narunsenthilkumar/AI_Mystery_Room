# 🚀 Complete Deployment Guide: AI Mystery Room

This guide walks you through deploying **AI Mystery Room** from your local machine to live production websites, as required by the project specifications.

---

## 📋 Overview of Recommended Architecture

As recommended in the project guide:
- **Frontend Host**: [Vercel](https://vercel.com/) (or [Netlify](https://www.netlify.com/))
- **Backend Host**: [Render](https://render.com/) (or [Railway](https://railway.app/))
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free Tier M0)
- **AI Engine**: [Google AI Studio (Gemini API)](https://aistudio.google.com/)

---

## Step 1: Push Your Code to GitHub

1. If you haven't already created a GitHub repository, go to [github.com/new](https://github.com/new) and create a repository named `AI_mystery_room`.
2. In your terminal, link your local repository and push:
   ```bash
   cd /home/juno/Documents/AI_mystery_room

   # Add your remote URL (replace YOUR-USERNAME with your GitHub handle)
   git remote add origin https://github.com/YOUR-USERNAME/AI_mystery_room.git

   # Push to main
   git push -u origin main
   ```

---

## Step 2: Set Up Free Cloud MongoDB Atlas

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Create a new project and select **Free Shared Cluster (M0)**.
3. In **Security Quickstart**:
   - Create a database user (e.g. `mystery_admin`) and a secure password.
   - Under **IP Access List**, click **Allow Access from Anywhere** (`0.0.0.0/0`) so your cloud backend can connect.
4. Click **Connect** → **Drivers (Node.js)**.
5. Copy your connection string:
   ```
   mongodb+srv://mystery_admin:<password>@cluster0.abcde.mongodb.net/ai_mystery_room?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your actual password).*

---

## Step 3: Get Your Free Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** → **Create API key in new project**.
4. Copy the generated API key.

---

## Step 4: Deploy Backend API to Render

1. Log in to [Render](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository `AI_mystery_room`.
4. Configure the Web Service settings:
   - **Name**: `ai-mystery-room-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **Advanced** and add the following **Environment Variables**:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode |
   | `PORT` | `5000` | Render default port |
   | `MONGODB_URI` | `mongodb+srv://...` | Your Atlas connection string |
   | `GEMINI_API_KEY` | `AIzaSy...` | Your Gemini API Key |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` | *(Add after Step 5, or leave `*` initially)* |

6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public backend URL, e.g.:
   `https://ai-mystery-room-api.onrender.com`
   *(Test it in your browser at `https://ai-mystery-room-api.onrender.com/api/health` — it should return status: "healthy")*.

---

## Step 5: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository `AI_mystery_room`.
4. In the project setup screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://ai-mystery-room-api.onrender.com/api` |
   *(Point this to your deployed Render backend from Step 4 with `/api` at the end).*
6. Click **Deploy**.
7. Vercel will build and provide your live frontend URL, e.g.:
   `https://ai-mystery-room.vercel.app`

*(Optional: Go back to Render → Environment Variables and update `CLIENT_URL` with this Vercel URL to restrict CORS).*

---

## ⚡ Alternative: Deploy Frontend to Netlify

If you prefer Netlify:
1. Go to [Netlify](https://app.netlify.com/) and click **Add new site** → **Import an existing project**.
2. Connect your GitHub repository.
3. Netlify will automatically detect `netlify.toml`:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. Under **Site configuration** → **Environment variables**, add:
   - `VITE_API_URL`: `https://ai-mystery-room-api.onrender.com/api`
5. Click **Deploy site**.

---

## 🚢 Alternative: All-in-One Deployment (Single URL)

If you prefer to deploy frontend and backend together on a single free Render service:
1. In Render, select **New +** → **Web Service**.
2. Root directory: leave blank (project root).
3. Build command:
   ```bash
   cd client && npm install && npm run build && cd ../server && npm install
   ```
4. Start command:
   ```bash
   cd server && npm start
   ```
5. Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: your Atlas URI
   - `GEMINI_API_KEY`: your Gemini API key
6. Because `server/src/index.js` is already coded to serve `client/dist` statically in production, visiting your Render URL directly serves the React app and handles `/api/*` endpoints seamlessly on the same domain with no CORS configuration needed!

---

## 🧪 Post-Deployment Verification Checklist

Before submitting your project:
- [ ] Open the live website URL.
- [ ] Create a new mystery with a custom premise (e.g., "The stolen diamond at the gala").
- [ ] Test on **Easy**, **Medium**, and **Hard** difficulty levels.
- [ ] Inspect crime scene clues and check that $+5\text{ pts}$ is awarded per discovered clue.
- [ ] Request a hint and confirm $-10\text{ pts}$ penalty applies.
- [ ] File formal charges against a suspect with investigative reasoning.
- [ ] Verify the verdict banner, score docket, detective rank, culprit confession, and forensic walkthrough render properly.
- [ ] Click "Investigate Another Mystery" to confirm the replay loop works.

---

## 📬 Final Submission Details

Once live:
1. **GitHub Repository**: Submit your public repository URL.
2. **Live Website URL**: Submit your live Vercel / Render deployment link.
3. Submit via the official form: **[Project Submission Link](https://bit.ly/ai-mystery-room-sub-form)**
4. Deadline: **2nd November, 11:59 PM**
