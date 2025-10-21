# 🎮 Vue 3 Tetris Demo (TypeScript)

**Live Demo:** https://andrei-leonichev-tetris.vercel.app/

A modern **Tetris** clone built with **Vue 3 (script setup + TypeScript)** and **Pinia**.  
Responsive field, keyboard & touch controls, scoring, line clearing, speed growth, and a clean game loop.

---

## ✨ Features

- **Vue 3 + TypeScript** Composition API (`script setup`)
- **Pinia** store for game state
- **Responsive field size** via custom hook (`useDimensionsChange`)
- **Keyboard controls** with key-repeat (interval timers)
- **Touch controls** for mobile
- Game mechanics: spawn / move / rotate, collision checks, line clearing, scoring, speed increase, game-over overlay
- Small **Express** API scaffold (see `api/`) for local dev or future persistence

---

## 🧱 Tech Stack

- **Vue 3**, **TypeScript**, **Pinia**, **Vue Router**
- **Vite** for dev/build
- **Express** (optional dev API)
- **Prettier** (+ `prettier-plugin-vue`) for formatting

---

## 🚀 Getting Started

> Requires **Node 18+**

### 1) Install
```bash
npm install
```

### 2) Run (frontend only)
```bash
npm run dev        # starts Vite dev server
```
Open the printed URL (usually `http://localhost:5173`).

### 3) Run frontend **and** local API together
```bash
npm start          # runs "start-server" (Express) and "dev" in parallel
```
- Frontend: Vite dev server
- API: `node api/server.js`

### 4) Build & Preview
```bash
npm run build      # build to /dist
npm run preview    # serve built files locally
```
Optional alternative static servers:
```bash
npm run serve             # serve -s dist -l 3500
npm run http-server:dist  # http-server dist
```

### 5) Lint / Format
```bash
npm run format
```

---

## 📁 Project Structure (key parts)

```
client/                     # (root of this package)
  api/                      # optional Express API (start with npm run start-server)
  public/
  src/
    assets/
      elements/             # tetromino shapes & rotations (all-elms)
    components/
      field/
        Field.vue
        TouchControls.vue
        ControlsInfo.vue
        GameOver.vue
      settings/
        ControlPanel.vue
    config/
      tetris.enums.ts       # appStateEnum, gameStateEnum, field/element types
    stores/
      tetris.ts             # Pinia store (game state, speeds, frames, actions)
    utills/
      key.events.utills.ts  # keyboard handling (keydown/keyup + intervals)
      hooks.utills.ts       # useDimensionsChange (responsive field)
      common.utills.ts      # isTouchDevice(), isMobileDevice()
    views/ (or root views)
    App.vue
    main.ts
  index.html
  vite.config.ts
```

---

## 🎹 Controls

**Desktop**
- ← / → — move
- ↓ — soft drop
- **Space** — rotate
- **Ctrl** — toggle/pause (app state)

*(Movement key repeat handled via intervals in `key.events.utills.ts`.)*

**Mobile**
- On-screen **TouchControls**
- Device detection via `isTouchDevice()`

---

## 🧠 Core Game Logic (overview)

- **Matrix rendering** (`renderFieldMatrix`) merges tetromino with field, detects: collision, invalid position/rotation, **game over**
- **Line clearing**: `getCleaningStateByStaticMatrix` → `renderCleanedFieldMatrix` → `combineStaticMatrixPartsInOne`
- **Scoring / speed**: `calculateScorePoints`, `calculateFallingSpeed`, `getMillisecondsByFPS`
- **Random spawning**: `getRandomElementId`, `getRandomFromX`

On mount, store may fetch top score data:
```ts
onMounted(() => tetrisStore.fetchTopScoreDataAsync())
```

---

## 🛠 Possible Improvements

- Hard drop / hold piece / next queue
- Animations & sound for line clear
- Persist settings & leaderboard (localStorage or API in `api/`)
- Tests for matrix/rotation utilities

---

## 📝 License

MIT — free to use and modify.
