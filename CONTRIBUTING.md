# Contributing to AI Mystery Room

Thank you for your interest in contributing to **AI Mystery Room**! This guide outlines how to set up your local development environment, submit bug reports, and create pull requests.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- (Optional) **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- (Optional) **Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
Clone the repository and install both backend and frontend dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/AI_mystery_room.git
cd AI_mystery_room

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory (you can copy `server/.env.example`):
```bash
cp server/.env.example server/.env
```

Fill in your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_mystery_room
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
*(Note: If no Gemini API key is provided, the backend seamlessly engages its built-in procedural mystery engine for offline development.)*

### 4. Running the Application
Open two terminal windows:

- **Terminal 1 (Backend):**
  ```bash
  cd server
  npm run dev
  ```
- **Terminal 2 (Frontend):**
  ```bash
  cd client
  npm run dev
  ```

Visit `http://localhost:5173` to test the application.

---

## 🧪 Testing

Before submitting any code changes, ensure all tests pass:

```bash
# Run backend test suite
cd server
npm test

# Test frontend build
cd ../client
npm run build
```

---

## 🔀 Branching & Pull Request Process

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Follow clean code principles, preserve existing comments and docstrings.
3. Add tests in `server/test/` for any new endpoints or gameplay logic.
4. Verify that:
   - All tests pass (`npm test` in `server`)
   - The frontend builds without warnings (`npm run build` in `client`)
   - Secret keys (`.env`) are never committed
5. Commit using clear conventional commit messages (e.g. `feat: add sound effects`, `fix: handle edge case in hint deduction`).
6. Push to your fork and submit a Pull Request to `main`.
