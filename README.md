# SmartChef AI – Personalized Cooking Planner (Serverless Edition)

> **"Your AI-powered daily cooking planner."**  
> Developed for the Google PromptWars Warmup Hackathon.

SmartChef AI is a premium, serverless AI application that runs completely in the browser. It generates highly-personalized daily meal plans (Breakfast, Lunch, Dinner) based on user financial constraints, available pantry items, fitness goals, and cooking preferences. 

By running 100% client-side, the app is extremely lightweight, requires zero backend servers to run, and can be hosted instantly on Vercel, Netlify, or GitHub Pages.

---

## 🌟 Key Features

- ⚡ **Direct Groq Integration**: Connects directly from the browser to the **Groq Cloud API** using the `llama-3.3-70b-versatile` model, utilizing JSON-mode formatting.
- 🛠️ **Client-Side Zod Validation**: Automatically validates LLM json output structures on the client to ensure 100% type safety and consistent layouts.
- 💸 **Budget-First Optimization**: Evaluates grocery costs dynamically. If ingredients exceed the daily budget, it swaps items out for more economical local alternatives, explaining the optimization details to the user.
- 📦 **Pantry Inventory Match**: Deducts already available home ingredients from the grocery list, showing savings calculations in real time.
- 🥗 **Goal-Oriented Health Scoring**: Ranks daily meals (0-100) based on fitness goals (weight loss, muscle gain) and diet selections, providing granular calorie, protein, and sodium breakdowns.
- ⏳ **Chronological Cooking Timeline**: Maps step-by-step prep tasks dynamically so the user knows exactly when to chop, boil, and cook.
- 🔄 **Ingredient Substitutions & Leftovers**: Recommends 3-alternative lists for allergens and creates secondary recipes utilizing predicted leftovers.
- 🌍 **Sustainability Index**: Evaluates the carbon/eco footprint of the food items on a 1-5 star scale.
- 💡 **Demo Fallback Mode**: Instantly falls back to a high-fidelity mock data generator if no API key is specified, allowing judges to test the full app immediately.

---

## 🏗️ Folder Structure

```text
google-prompwar-warmup-challenge/
├── frontend/
│   ├── src/
│   │   ├── components/      # Form inputs & Glassmorphism SaaS cards
│   │   ├── hooks/           # TanStack custom query hooks
│   │   ├── services/        # Client API handler & Mock data generator
│   │   ├── schemas/         # Zod schemas for client-side validation
│   │   ├── types/           # Request/response typescript models
│   │   ├── index.css        # Tailwind directives and customized Glass variables
│   │   ├── App.tsx          # Dashboard page assembly
│   │   └── main.tsx         # React bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── index.html
├── package.json             # Root workspace runner
└── README.md                # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **NPM**: `v9+`
- **Groq API Key** (Optional): Obtain one from [Groq Console](https://console.groq.com/)

---

### Step 1: Install Dependencies

From the root directory, run:
```bash
npm run install:all
```
*(or manually: `cd frontend && npm install --legacy-peer-deps`)*

---

### Step 2: Configure Environment Variables

The app comes preconfigured with a fallback key, but you can set your own Groq API Key by creating or editing `frontend/.env`:
```env
VITE_GROQ_API_KEY=gsk_yourActualKeyHere
```

---

### Step 3: Run the Application

Start the development server from the root directory:
```bash
npm run dev
```
*The React application will boot up at [http://localhost:5173](http://localhost:5173).*
