# 🎮 Vue Tetris Demo

**Live Demo:** [andrei-leonichev-tetris.vercel.app](https://andrei-leonichev-tetris.vercel.app/)

---

## 🧩 Overview

This is a **classic Tetris clone** built with **Vue 3**, **TypeScript**, and **Vite**.  
The project demonstrates logic for figure movement, rotation, line clearing, and collision detection,  
with a minimal backend implemented on **Express** and **Firebase Realtime Database**.

All game logic, UI, and interactions were implemented manually.

---

## 🛠 Tech Stack

### Frontend
- **Vue 3 (Composition API + TypeScript)**
- **Pinia** — game state management (board, active piece, score)
- **Vite** — dev/build tool
- **FontAwesome** — icons
- **SCSS / CSS Grid** — layout and design

### Backend
- **Express** — lightweight server for Firebase integration
- **Firebase Realtime Database** — stores simple player data (e.g. scores)
- Configured via local `serviceAccountKey.json` (not included in repo)

---

## 🧱 Tetromino Logic

The game includes the 7 classic **Tetris shapes** (I, O, T, J, L, S, Z).  
Each is defined as a matrix of `1`s and `0`s, representing filled and empty cells.  
Each shape includes multiple rotation states stored in an array.

Example:

```js
const element = [
  [
    [0,1,0],
    [1,1,0],
    [0,1,0],
  ],
  [
    [0,1,0],
    [1,1,1],
    [0,0,0]
  ],
  [
    [0,1,0],
    [0,1,1],
    [0,1,0]
  ],
  [
    [0,0,0],
    [1,1,1],
    [0,1,0]
  ]
];

export default element;
```

Each shape file exports its own rotation array.

---

## 🧩 Core Components

- **Field.vue** — main grid composed of `Column` and `Element` components  
- **Column.vue** — vertical slice of the playfield  
- **Element.vue** — individual cell, dynamically rendered as filled or empty  
- **Control areas** — visual mobile UI for arrows and rotation (via touch events)  
- **SubField.vue** — overlay with keyboard/touch instructions  
- **Pinia store** — manages the game state, field matrix, and controls

---

## ⚙️ Project Structure

```
vue-tetris-demo/
│
├── client/
│   ├── api/
│   │   ├── server.js              # Express + Firebase backend
│   │   └── serviceAccountKey.json # Firebase admin key (ignored)
│   │
│   ├── src/
│   │   ├── assets/                # Images & styles
│   │   ├── components/            # Vue components (Field, Column, Element...)
│   │   ├── config/                # Tetromino definitions & enums
│   │   ├── stores/                # Pinia store
│   │   ├── utills/                # Key event helpers
│   │   └── views/                 # Main Tetris view
│   │
│   ├── App.vue
│   ├── main.ts
│   └── index.html
│
├── .gitignore
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

> Requires Node.js 18+

### 1️⃣ Clone the repository

```bash
git clone https://github.com/leonichevAndrei/vue-tetris-demo
cd vue-tetris-demo/client
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run locally

```bash
npm start
```

This starts:
- the **Vite** dev server (frontend)
- the **Express + Firebase** backend (`api/server.js`)

Then open:  
👉 http://localhost:5173

---

## 🔒 Firebase Setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database**
3. Download the service account key and place it as:  
   `client/api/serviceAccountKey.json`
4. Make sure `.gitignore` includes it:
   ```
   api/serviceAccountKey.json
   ```

---

## 🌐 Deployment (Vercel)

The project is deployed on **Vercel**, serving the built `dist/` directory.  
During deployment, `node_modules` may need to remain in the repo to ensure compatibility.  
The backend connects directly to Firebase for persistent data.

---

## 🧩 Possible Improvements

- Move Firebase configuration into environment variables (`.env`)
- Load settings dynamically from Firebase or Firestore
- Add leaderboard and persistent high scores
- Improve rotation transitions and difficulty curve

---

## 👨‍💻 Author

**Andrei Leonichev**  
Full-Stack JavaScript / TypeScript Developer  
📍 Israel | Remote  
[LinkedIn](https://linkedin.com/in/andrei-leonichev)

---

## 🏷 License

MIT — free for learning and portfolio use.
