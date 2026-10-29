# AI Mystery Room — Technical Specification (SPEC.md)

## 1. Project Requirements

### 1.1 Project Overview & Problem Statement
**AI Mystery Room** is an interactive, AI-powered mystery-solving web application. Traditional murder mystery and detective games are static, pre-scripted, and suffer from zero replay value once the narrative is solved. AI Mystery Room solves this by leveraging Google's Gemini generative AI model to dynamically orchestrate unique, logically coherent, and atmospheric detective cases on demand. Players enter custom premises (or choose pre-configured themes), select a difficulty tier, and immerse themselves in investigating suspects, discovering hidden clues, requesting strategic hints, and deducing the culprit.

### 1.2 Target Users & Expected User Experience
- **Target Audience:** Puzzle enthusiasts, detective fiction fans, casual gamers, educators, and AI technology showcases.
- **User Experience (UX):** A sleek, modern "noir meets cyber-sleuth" dark interface. Smooth transitions, card-based suspect dossiers, interactive clue reveals, soundscapes/visual tension, and clear scoring feedback. Mobile-responsive, accessible, and fast.

### 1.3 Core Features & Optional Enhancements
#### Core Features:
1. **Dynamic Case Generation:** Prompt-driven mystery synthesis powered by Gemini with strict Zod schema validation.
2. **Difficulty Tiers:**
   - **Easy:** 3 Suspects, 5 Clues, 2 Hints (Base: 100 pts)
   - **Medium:** 4 Suspects, 7 Clues, 3 Hints (Base: 150 pts)
   - **Hard:** 5 Suspects, 9 Clues, 3 Hints (Base: 200 pts)
3. **Interactive Investigation Room:**
   - Narrative story briefing and crime scene breakdown.
   - Suspect dossiers with alibis, motives, and background details.
   - Interactive clue discovery system (discover clues one by one).
   - Progressive hint delivery with score penalty notifications.
4. **Accusation System:**
   - Formal suspect indictment interface with mandatory player reasoning.
5. **Verdict & Score Calculation:**
   - Backend-validated verdict (guilty or wrongful accusation).
   - Dynamic score computation: Base Points + (Discovered Clues × 5) − (Hints Used × 10), bounded at a minimum of 0.
   - Full post-verdict debriefing: culprit confession, motive analysis, and forensic clue breakdown.
6. **Anti-Cheat Security Architecture:**
   - Culprit identity, true alibi verdicts, and final solution are strictly sequestered on the backend database and excluded from all active game API payloads until an accusation is formally recorded.
7. **Persistence:**
   - MongoDB case storage with Mongoose models, supporting resuming cases or reviewing past completed investigations.

#### Enhancements:
- Preset mystery themes (e.g., Victorian Manor, Cyberpunk Neo-Tokyo, Luxury Yacht Heist).
- Detective Rank tiering system based on final score (Master Detective, Senior Inspector, Sleuth, Novice).
- Clue discovery visual indicators and interactive inspection modal.
- Copyable case share links to challenge friends with identical mystery seeds.

### 1.4 Technology Stack
- **Frontend:**
  - React 18 (SPA)
  - Vite (Build Tool & Dev Server)
  - Tailwind CSS (Atmospheric UI Styling)
  - Lucide React (Icons)
  - React Router DOM v6 (Routing)
  - Axios (HTTP Client)
- **Backend:**
  - Node.js Runtime
  - Express.js (REST API Server)
  - MongoDB & Mongoose (Document Database & ODM)
  - `@google/genai` / `@google/generative-ai` (Google Gemini API integration)
  - Zod (Runtime Schema Validation for AI responses and API requests)
  - dotenv (Environment Configuration)
  - cors (Cross-Origin Resource Sharing)
- **Deployment:**
  - Frontend: Vercel / Netlify / Static hosting
  - Backend: Render / Railway / Node.js host
  - Database: MongoDB Atlas (with local MongoDB or in-memory fallback for local dev)

### 1.5 Project Limitations & Deliverables
- **Limitations:** Gemini API latency (~2-5 seconds for full case generation); API quotas handled gracefully with fallbacks and informative loading spinners.
- **Deliverables:**
  - `SPEC.md`: Exhaustive architectural blueprint.
  - `client/`: Complete frontend React application.
  - `server/`: Complete backend Express API service.
  - `README.md`: Setup, installation, environment variables, API documentation, and deployment guidelines.

---

## 2. User Flow

```
[ Landing Page (Home) ]
         │
         ▼
[ Create Mystery Page ] ─── (Enter premise / select difficulty)
         │
         ▼
[ Backend: Gemini API + Zod Validation ] ─── (Generates & saves case, redacts solution)
         │
         ▼
[ Investigation Room ] ◄────────────────────────────────────────┐
   │             │                                              │
   ├─ Discover   ├─ Request Hint (penalizes score)             │
   │  Clues (+5) └─ Review Suspect Dossiers & Crime Scene      │
   │                                                            │
   ▼                                                            │
[ Accusation Chamber ] ─── (Change mind?) ──────────────────────┘
         │
         ▼
[ Submit Accusation (Suspect ID + Detective Rationale) ]
         │
         ▼
[ Backend Evaluation & Scoring Engine ]
         │
         ▼
[ Results & Resolution Debriefing ]
   ├─ Verdict (Solved / Unsolved)
   ├─ Score Breakdown & Detective Rank
   ├─ Culprit Confession & Motive Reveal
   ├─ Full Evidence & Clue Explanation
   └─ "Investigate Another Mystery" CTA
```

### Step-by-Step Flow:
1. **Landing:** User arrives at the homepage, introduced to the game rules, scoring mechanics, and a "Start New Case" button.
2. **Setup:** User selects or inputs a mystery premise (or clicks a sample prompt) and picks a difficulty level (Easy, Medium, Hard).
3. **Generation:** Frontend displays an animated case generation status while the backend queries Gemini, validates the JSON output via Zod, persists the full case to MongoDB, and returns the public/investigation view.
4. **Investigation:**
   - User reads the background narrative and crime scene details.
   - User reviews suspects (portraits, occupations, alibis, initial motives).
   - User clicks undiscovered clues to inspect and discover them (earning +5 points per clue).
   - User can reveal hints sequentially if stuck (costing 10 points per hint).
5. **Accusation:** User enters the accusation page, selects the primary suspect, types their deductive reasoning, and submits the accusation.
6. **Verdict & Score:** The backend evaluates the accusation, records the timestamp and rationale, marks the case completed, calculates the score, and returns the unredacted solution.
7. **Debriefing:** The user reviews their rank, score breakdown, the true narrative, the culprit's motive and confession, and can restart or explore other cases.

---

## 3. UI and Page Specifications

### 3.1 Design System & Aesthetic
- **Color Palette:**
  - Backgrounds: Dark slate & obsidian (`#0b0f19`, `#111827`, `#1f2937`)
  - Accents: Amber/Gold (`#f59e0b`, `#fbbf24`), Crimson/Blood Red (`#ef4444`), Emerald/Verify (`#10b981`), Cyber Cyan (`#06b6d4`)
  - Text: Slate-100 for primary headings, Slate-300 for body, Slate-400 for metadata
- **Typography:** Modern clean sans-serif (Inter / System) with stylized mono/serif accents for case files.

### 3.2 Page Specifications

#### 1. Home Page (`/`)
- **Header:** Brand logo "AI Mystery Room", navigation links, status badge.
- **Hero Section:** Tagline "Step into the shoes of a master detective", brief description, "Create Case" CTA button.
- **Feature Cards:** Explaining the 3 Pillars: "AI-Generated Plots", "Forensic Clues & Suspects", "Fair Scoring & Real Deductions".
- **Difficulty Preview:** Comparative breakdown of Easy, Medium, and Hard mechanics.
- **Recent Solved Cases Section:** Quick showcase of community-solved cases.

#### 2. Create Mystery Page (`/create`)
- **Premise Input:** Multi-line text field with placeholder inspiration (e.g. *"A billionaire tech founder is found poisoned inside an airtight server room during a product launch"*).
- **Preset Quick-Select Chips:** Victorian Manor Murder, Cyberpunk High-Rise Theft, Orient Express Vanishing, Ancient Museum Relic Curse.
- **Difficulty Selector:** 3 interactive cards with badges:
  - Easy: 3 Suspects, 5 Clues, 2 Hints (Base 100 pts)
  - Medium: 4 Suspects, 7 Clues, 3 Hints (Base 150 pts)
  - Hard: 5 Suspects, 9 Clues, 3 Hints (Base 200 pts)
- **Submit Button:** "Generate Case Dossier" with loading state and pulsing animation indicating AI synthesis.
- **Error Banner:** Displays helpful messages if API rate limits or network issues occur.

#### 3. Investigation Room Page (`/case/:id`)
- **HUD Bar:**
  - Case Title & Difficulty Badge.
  - Score Preview widget.
  - Clues Discovered Counter (e.g. `3 / 7 Discovered`).
  - Hints Remaining Counter.
  - Quick action button: "Proceed to Accusation".
- **Tabbed or Sectional Layout:**
  - **Dossier & Crime Scene Tab:** The story setup, victim bio, timestamp, scene description, forensic overview.
  - **Suspects Grid:** Interactive suspect dossier cards displaying name, occupation, alibi, relation to victim, and motive notes.
  - **Clues Board:** Cards with locked/unlocked state. Clicking an undiscovered clue triggers discovery, updates the score, and displays forensic details.
  - **Hints Drawer/Accordion:** Locked hints with warning: "Revealing this hint deducts 10 points. Are you sure?"
- **Bottom Navigation:** Sticky dock with "Make Accusation" CTA.

#### 4. Accusation Page (`/case/:id/accuse`)
- **Case Summary:** Quick reminder of crime scene and victim.
- **Suspect Lineup:** Selectable suspect radio cards with avatar, name, and role.
- **Detective's Rationale:** Required textarea for the player's hypothesis: *"Why do you suspect this person? What evidence implicates them?"*
- **Final Warning Modal / Confirmation:** "This is your final indictment. The case file will close upon submission."
- **Submit Button:** "File Formal Charges".

#### 5. Results Page (`/case/:id/result`)
- **Verdict Banner:**
  - Solved: Green glowing banner with "CASE CRACKED: SUSPECT APPREHENDED".
  - Unsolved: Crimson alert banner with "WRONGFUL ACCUSATION: THE REAL CULPRIT ESCAPED".
- **Score Card:**
  - Base Points (by difficulty)
  - Discovered Clues Bonus (+5 per clue)
  - Hints Penalty (-10 per hint)
  - **Total Score** (min 0)
  - Detective Rank Badge (Master Detective ≥ 160 pts, Senior Inspector ≥ 120 pts, Sleuth ≥ 80 pts, Trainee < 80 pts)
- **Confession & Truth:** Full narrative breakdown of how the crime transpired, the true motive, and the alibi flaws.
- **Evidence Review:** Summary of all clues showing how each connected to the culprit or served as red herrings.
- **Action Buttons:** "Investigate Another Mystery", "Review Case File".

---

## 4. Backend and Database Design

### 4.1 Architecture & Security Rules
1. **Culprit Isolation:** The true culprit ID, culprit name, confession, motive, and solution explanation are stored with `{ select: false }` or explicitly stripped by the API layer during active gameplay.
2. **Backend Authority:** All score calculations, clue discovery registrations, hint reveals, and verdict checks are executed on the server. The client cannot forge or tamper with the final score.
3. **Validation First:** All incoming client requests and Gemini responses are validated against rigorous Zod schemas.

### 4.2 Database Schemas (Mongoose)

```javascript
// Suspect Subschema
const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  isCulprit: { type: Boolean, default: false } // Hidden during investigation
});

// Clue Subschema
const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  isDiscovered: { type: Boolean, default: false },
  discoveredAt: { type: Date }
});

// Hint Subschema
const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  order: { type: Number, required: true },
  text: { type: String, required: true },
  isRevealed: { type: Boolean, default: false },
  revealedAt: { type: Date }
});

// Solution Subschema
const SolutionSchema = new mongoose.Schema({
  culpritId: { type: String, required: true },
  culpritName: { type: String, required: true },
  motive: { type: String, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

// Main Case Schema
const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  story: { type: String, required: true },
  victim: {
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  crimeScene: {
    location: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true }
  },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],
  solution: SolutionSchema, // Guarded field
  playerProgress: {
    discoveredClues: [{ type: String }],
    hintsUsed: { type: Number, default: 0 },
    accusation: {
      suspectId: { type: String },
      rationale: { type: String },
      accusedAt: { type: Date }
    },
    isSolved: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
  }
}, { timestamps: true });
```

### 4.3 REST API Endpoints

| Method | Endpoint | Description | Public Payload / Redactions |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/cases` | Generate a new mystery with Gemini | Excludes `solution`, redacts `isCulprit` |
| `GET` | `/api/cases/:id` | Fetch active case state | Excludes `solution`, redacts `isCulprit`, conceals undiscovered clue descriptions |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Discover a clue & add points | Returns revealed clue content & updated progress |
| `POST` | `/api/cases/:id/hints` | Request next hint & apply score penalty | Returns newly revealed hint text & hint counter |
| `POST` | `/api/cases/:id/accuse` | Submit accusation & conclude game | Computes verdict, records score, returns full solution |
| `GET` | `/api/cases/:id/result` | Retrieve full result & solution | Only accessible if case `status === 'completed'` |
| `GET` | `/api/cases` | List recent cases | Returns titles, difficulty, status, and completion dates |

---

## 5. AI Behavior and Scoring Rules

### 5.1 Difficulty Specifications Matrix

| Difficulty Level | Suspect Count | Clue Count | Hint Count | Base Score | Clue Bonus | Hint Penalty |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Easy** | 3 | 5 | 2 | 100 | +5 per clue | -10 per hint |
| **Medium** | 4 | 7 | 3 | 150 | +5 per clue | -10 per hint |
| **Hard** | 5 | 9 | 3 | 200 | +5 per clue | -10 per hint |

### 5.2 Gemini Prompt Design & Zod Schema
The backend issues a structured JSON system prompt to Gemini enforcing:
1. **Logical Consistency:** The clues must unequivocally point to one culprit while offering realistic red herrings for the innocent suspects.
2. **Exact Schema Compliance:** Validated at runtime using Zod before any database write:

```typescript
const CaseGenerationSchema = z.object({
  title: z.string().min(5),
  story: z.string().min(50),
  victim: z.object({
    name: z.string(),
    description: z.string()
  }),
  crimeScene: z.object({
    location: z.string(),
    time: z.string(),
    description: z.string()
  }),
  suspects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    description: z.string(),
    alibi: z.string(),
    motive: z.string(),
    isCulprit: z.boolean()
  })),
  clues: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string()
  })),
  hints: z.array(z.object({
    id: z.string(),
    order: z.number(),
    text: z.string()
  })),
  solution: z.object({
    culpritId: z.string(),
    culpritName: z.string(),
    motive: z.string(),
    explanation: z.string()
  })
});
```

### 5.3 Scoring Formula
Upon accusation submission, the backend evaluates:
$$\text{Base Score} = \begin{cases} 
100 & \text{if Easy and Accusation Correct} \\
150 & \text{if Medium and Accusation Correct} \\
200 & \text{if Hard and Accusation Correct} \\
0 & \text{if Accusation Incorrect}
\end{cases}$$

$$\text{Clue Bonus} = \text{Discovered Clues Count} \times 5$$
$$\text{Hint Penalty} = \text{Revealed Hints Count} \times 10$$
$$\text{Final Score} = \max\left(0, \text{Base Score} + \text{Clue Bonus} - \text{Hint Penalty}\right)$$

### 5.4 Detective Ranking Tiers
- **Master Detective:** Score $\ge 160$
- **Senior Inspector:** $120 \le \text{Score} < 160$
- **Investigator / Sleuth:** $70 \le \text{Score} < 120$
- **Rookie / Patrol Deputy:** $\text{Score} < 70$

---

## 6. Acceptance Criteria

1. **Case Generation:**
   - [x] Supports Easy, Medium, and Hard difficulty levels.
   - [x] Generates correct suspect count (3, 4, 5), clue count (5, 7, 9), and hint count (2, 3, 3).
   - [x] Returns custom cases based on user-provided premises or default presets.
2. **Security & Anti-Cheat:**
   - [x] Active case retrieval does not reveal `solution` or `isCulprit` flags in network requests.
   - [x] Client cannot cheat by inspecting DOM or Network tabs before submitting an accusation.
3. **Gameplay Mechanics:**
   - [x] Clues can be discovered, updating the score (+5 pts) and UI in real-time.
   - [x] Hints can be requested sequentially, applying the -10 pt penalty with user confirmation.
   - [x] Accusation submission requires suspect selection and deductive rationale.
4. **Scoring & Debriefing:**
   - [x] Correct accusation awards difficulty base points.
   - [x] Incorrect accusation awards 0 base points (bonuses and penalties still factored).
   - [x] Total score is bounded at minimum 0.
   - [x] Post-accusation results reveal culprit, motive, confession, and forensic walkthrough.
5. **Reliability & Error Handling:**
   - [x] Graceful fallback if Gemini API is unreachable or rate-limited.
   - [x] Clear loading spinners and error banners for network or server issues.
   - [x] Responsive layout across mobile, tablet, and desktop viewports.
