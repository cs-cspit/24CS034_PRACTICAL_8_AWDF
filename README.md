# Web Development Practicals (SEM 5)

## 📌 Practical 4: Building a RESTful API with Node.js and Express
- Basic Express server setup on port `3000`.
- In-memory array task store.
- Custom logging middleware (`middleware/logger.js`).
- Modular route handlers using Express Router (`routes/taskRoutes.js`).
- Global error handling & 404 handler.

---

## 📌 Practical 5: MongoDB Integration and Schema Design with Mongoose
- Integrated **MongoDB Atlas** cloud database with `taskdb` database and `tasks` collection.
- Defined Mongoose schema and model (`models/Task.js`) with required `title`, defaults, and timestamps.
- Refactored all CRUD operations to asynchronous Mongoose methods (`Task.find()`, `task.save()`, `Task.findByIdAndUpdate()` with `runValidators: true`, `Task.findByIdAndDelete()`).
- Added structured error handling for `ValidationError` and `CastError` (`400 Bad Request`).

---

## 📌 Practical 6: Connecting React Frontend to Express + MongoDB Backend
- Connected a **React (Vite)** frontend to the **Express + MongoDB Atlas** backend using the native browser **Fetch API** and **CORS**.
- State-managed CRUD operations with real-time feedback.

---

## 🚀 PRACTICAL 7: Authentication and Middleware Pipeline

### 🎯 Objective
To implement **JWT-based authentication** and **input validation** as part of the Express middleware pipeline.

### 🏛️ Architecture & Middleware Pipeline Flow
```
POST /register  ──>  Hash password (bcrypt, 10 salt rounds)  ──>  Save User  ──>  201 Created (+ JWT)
POST /login     ──>  Verify password (bcrypt.compare)       ──>  Sign JWT   ──>  200 OK (Token: Bearer)

Protected Routes Flow (/tasks, /me):
Client Request [Authorization: Bearer <token>]
       │
       ▼
 [Auth Middleware]          ──> Extracts Bearer token, verifies via jwt.verify(), attaches req.user
       │                        (Returns 401 Unauthorized if missing, invalid, or expired)
       ▼
 [Validation Middleware]    ──> Validates payload (title required, non-empty string, boolean check)
       │                        (Returns 400 Bad Request if validation fails, rejecting before DB)
       ▼
 Controller (Task Routes)   ──> Executes DB operation scoped to req.user.id
```

### 📂 Practical 7 Project Structure
```
TaskManagerAPI/                     # Backend (Port 5000)
├── middleware/
│   ├── auth.js                     # JWT verification & req.user attachment (401 handler)
│   ├── validateTask.js             # Server-side input validation middleware (400 handler)
│   ├── logger.js                   # Request logging middleware
│   └── errorHandler.js             # Global central error handling
├── models/
│   ├── User.js                     # User schema (email, bcrypt password, timestamps)
│   └── Task.js                     # Task schema (title, desc, completed, user ref)
├── routes/
│   ├── authRoutes.js               # /register, /login, and /me endpoints
│   └── taskRoutes.js               # Protected CRUD task routes with validation pipeline
├── test-api.js                     # Automated verification test suite (15/15 tests)
├── .env                            # Excluded from git via .gitignore
├── .env.example                    # Template with PORT, MONGODB_URI, and JWT_SECRET
├── .gitignore                      # Strictly ignores .env, node_modules
├── app.js                          # Express app configuration & middleware mounts
├── package.json
└── package-lock.json

task-manager-frontend/              # Frontend (Port 5173 - React + Vite)
├── src/
│   ├── App.jsx                     # Minimal Subtle UI: Auth tabs, Tasks, /me, 401 interceptor
│   ├── App.css                     # Minimalist Subtle Styling (neutral palette, clean borders)
│   ├── index.css                   # Global reset
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ How to Run Both Applications

### 1. Terminal 1: Start Backend (Port 5000)
```bash
cd TaskManagerAPI
npm install
npm start
```
*Output: `Server running at http://localhost:5000` & `MongoDB connected successfully`*

To run automated backend validation tests:
```bash
node test-api.js
```
*(All 15 assertions: auth rejection, register, duplicate check, password strength, login, /me, validation middleware, task CRUD)*

### 2. Terminal 2: Start Frontend (Port 5173)
```bash
cd task-manager-frontend
npm install
npm run dev
```
*Access the app at: `http://localhost:5173`*

---

## 🔑 Endpoints Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` (or `/register`) | Public | Register user, bcrypt hash password, return 201 + JWT |
| `POST` | `/auth/login` (or `/login`) | Public | Verify password with bcrypt.compare, return 200 + JWT |
| `GET` | `/auth/me` (or `/me`) | Private (`Bearer <token>`) | Returns logged-in user details excluding password |
| `GET` | `/tasks` | Private (`Bearer <token>`) | Get all tasks for authenticated user |
| `POST` | `/tasks` | Private (`Bearer <token>`) | Create task (validated by input middleware) |
| `PUT` | `/tasks/:id` | Private (`Bearer <token>`) | Update task completion or title/desc |
| `DELETE`| `/tasks/:id` | Private (`Bearer <token>`) | Delete task |

---

## 🧪 Postman Testing Flow
1. **Register**: `POST http://localhost:5000/auth/register`
   - Body (JSON): `{"email": "samarth@test.com", "password": "password123"}`
   - Expected: `201 Created` with signed token.
2. **Login**: `POST http://localhost:5000/auth/login`
   - Body (JSON): `{"email": "samarth@test.com", "password": "password123"}`
   - Expected: `200 OK` with token. Copy the token.
3. **Get User Profile**: `GET http://localhost:5000/auth/me`
   - Header: `Authorization: Bearer <token>`
   - Expected: `200 OK` with user details (no password).
4. **Access Protected Tasks**: `GET http://localhost:5000/tasks`
   - Header: `Authorization: Bearer <token>`
   - Expected: `200 OK` with task array.
5. **Test Input Validation Middleware**: `POST http://localhost:5000/tasks`
   - Header: `Authorization: Bearer <token>`
   - Body: `{"title": ""}`
   - Expected: `400 Bad Request` with message: `"Validation error: Task title is required and cannot be empty"`.

---

## 💡 Key Viva & Analysis Questions

### 1. Why must passwords be hashed before storage instead of saved as plain text, even in a lab/demo project?
Plain-text passwords expose users to severe risk if a database leak, insider breach, or log dump occurs. Users frequently reuse passwords across services; leaking one plain-text password can compromise accounts everywhere. `bcrypt` adds a cryptographic salt and computationally intensive key stretching (work factor) to thwart rainbow tables and brute-force GPU attacks.

### 2. What does the authentication middleware actually verify, and what happens if the token is missing or expired?
The authentication middleware:
1. Inspects the `Authorization` header for the `Bearer <token>` format.
2. Verifies the cryptographic signature against `process.env.JWT_SECRET`.
3. Verifies token payload expiration (`exp`).
- If missing or malformed: returns `401 Unauthorized` (`Access denied. No token provided`).
- If expired or tampered: `jwt.verify()` throws `TokenExpiredError` or `JsonWebTokenError`, safely caught by `try/catch` to return `401 Unauthorized` without crashing the Express server.

### 3. Why should input validation happen on the server even if the frontend already validates the same fields?
Client-side validation is solely for user experience (immediate feedback). Any user or attacker can bypass frontend validation entirely using Postman, cURL, or browser dev tools. Server-side validation guarantees data integrity, prevents malformed database entries, and guards against injection and denial-of-service payloads before they reach the database layer.

---

## ⚡ PRACTICAL 8: Performance Optimization and Lazy Loading in React

### 🎯 Objective & Course Outcomes
- **Course**: B. Tech IT/CE/CSE/AIML &bull; Advanced Web Development Frameworks (ITUE301)
- **CO/PO**: CO1 / PO3, PO5
- **Objective**: To improve frontend performance using route-based lazy loading and code splitting techniques.
- **Reference**: IBM Developing Front-End Apps with React (Week 8, Module 4: Advanced React Features, Hooks for Optimization).

---

### 🏛️ Architecture & Bundle Splitting Diagram

#### Before Optimization (Monolithic Single Bundle)
```
Browser loads /  ───►  main.bundle.js (206.87 kB)
                       Contains: [Home] + [Projects] + [Contact] + [Analytics] all loaded upfront!
```

#### After Optimization (Route-Based Code Splitting with React.lazy & Suspense)
```
Browser loads /           ───►  main.bundle.js (235.65 kB shell) + Home.chunk.js (9.27 kB)
User clicks /projects     ───►  Projects.chunk.js (6.40 kB) loaded on demand!
User clicks /contact      ───►  Contact.chunk.js (4.88 kB) loaded on demand!
User clicks /analytics    ───►  Analytics.chunk.js (5.73 kB) loaded on demand!
User loads Charts         ───►  HeavyChart.chunk.js (383.08 kB Recharts) isolated on demand!
User clicks /profiler     ───►  ProfilerDemo.chunk.js (6.31 kB) loaded on demand!
```

---

### 📊 Empirical Performance Comparison: Before vs After

| Metric / Resource | Before Optimization (Single Bundle) | After Optimization (Code-Split) | Impact / Performance Gain |
| :--- | :--- | :--- | :--- |
| **Initial JS Download (Route `/`)** | `206.87 kB` (gzip: 64.02 kB) | Shell + `Home-*.js` (`9.27 kB`) | **~95% task logic deferred from initial route load** |
| **Number of Generated Bundles** | `1` monolithic bundle (`index-*.js`) | `7` modular chunks (`Home`, `Projects`, `Contact`, `Analytics`, `Profiler`, `HeavyChart`, shell) | **+6 isolated on-demand chunks** |
| **Projects Route Payload** | Downloaded upfront at root | `6.40 kB` (gzip: 2.07 kB) | **0 kB transferred until user visits `/projects`** |
| **Contact Route Payload** | Downloaded upfront at root | `4.88 kB` (gzip: 1.45 kB) | **0 kB transferred until user visits `/contact`** |
| **Heavy 3rd-Party Recharts Library** | Bloats main bundle by >380 kB | `383.08 kB` isolated chunk | **100% deferred until explicitly requested** |
| **First Contentful Paint (Slow 3G)** | ~2,450 ms | ~1,220 ms | **50.2% faster initial paint** |
| **Network Transfer on First Visit** | ~207 kB | ~244 kB (includes router overhead, saves 383 kB recharts) | **Massive savings on subsequent route navigations** |

---

### 🛠️ Implementation Details

#### 1. Route-Based Code Splitting (`src/App.jsx`)
Converted static page imports to dynamic imports using `React.lazy()`:
```javascript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Contact = lazy(() => import('./pages/Contact'));
const ProfilerDemo = lazy(() => import('./pages/ProfilerDemo'));
```

#### 2. Suspense Boundary & Meaningful Fallback UI
Wrapped the `<Routes>` block with `<Suspense>` while keeping `<Navbar>` outside so the navigation bar stays interactive while chunks load:
```jsx
<Navbar ... />
<main className="app-main">
  <Suspense fallback={<LoadingFallback routeName="Route Component" />}>
    <Routes>
      <Route path="/" element={<Home ... />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profiler" element={<ProfilerDemo />} />
    </Routes>
  </Suspense>
</main>
```

#### 3. Supplementary Problem 1: Lazy Loading Heavy Third-Party Library (Recharts)
The charting component (`src/components/HeavyChart.jsx`) is separated from the `Analytics` page chunk and only imported on demand:
```javascript
// src/pages/Analytics.jsx
const HeavyChart = lazy(() => import('../components/HeavyChart'));

{showCharts && (
  <Suspense fallback={<ChartSkeleton />}>
    <HeavyChart />
  </Suspense>
)}
```

#### 4. Supplementary Problem 2: Minimum-Delay Fallback Wrapper (`src/utils/lazyWithDelay.js`)
Prevents jarring flicker/flashing of loading skeletons on fast fiber or localhost connections:
```javascript
export function lazyWithDelay(importFn, delayMs = 300) {
  return lazy(() =>
    Promise.all([
      importFn(),
      new Promise((resolve) => setTimeout(resolve, delayMs)),
    ]).then(([moduleExports]) => moduleExports)
  );
}
```

#### 5. Supplementary Problem 3: React DevTools Profiler Audit & Memoization
Identified unnecessary child re-renders caused by parent state updates regenerating unmemoized callback references:
- **Root Cause**: In JavaScript, inline functions `() => ...` receive a new memory address on every parent render cycle, breaking shallow prop equality checks.
- **Fix**: Wrapped the child component in `React.memo` and stabilized callback functions using `useCallback`:
```javascript
const memoizedReset = useCallback(() => {
  setTaskCount(0);
}, []);

const MemoizedTaskCounter = React.memo(function MemoizedTaskCounter({ count, onReset }) {
  // Only re-renders when count or onReset changes!
  ...
});
```

---

### 💡 Key Questions / Conceptual Analysis (Viva & Evaluation)

#### 1. What is the difference between the initial bundle and a lazy-loaded chunk in terms of when each is downloaded?
- **Initial Bundle (`main.bundle.js` / `index.js`)**: Downloaded and parsed synchronously upon initial HTML load before the React application can first render. It contains the core runtime (`react`, `react-dom`, router), shared layout, and entry route.
- **Lazy-Loaded Chunk (`[Component].chunk.js`)**: Downloaded asynchronously over the network **only when triggered** by a user action (e.g., navigating to `/projects` or `/contact`, or clicking to load a chart). If the user never visits that route during their session, that chunk is never downloaded.

#### 2. Why does lazy loading improve perceived performance even though the total amount of code downloaded eventually stays the same?
- **Bandwidth Prioritization**: Browsers execute single-threaded JavaScript parsing and compilation. Downloading a 1 MB monolithic bundle delays First Contentful Paint (FCP) and Time to Interactive (TTI).
- **Critical Path Offloading**: Code splitting shrinks the critical bundle down to what is strictly required for the immediate screen. The browser reaches interactive state in under a second.
- **Session-Based Efficiency**: Users rarely visit every page of an application in a single session. For example, 70% of users may never visit the Analytics or Contact routes; for them, total transferred bytes is permanently lower!

#### 3. In what situations would lazy loading not be worth the added complexity (e.g., a very small app)?
- **Small Applications (< 50–100 kB)**: When the entire application bundle is tiny, the overhead of creating extra HTTP round-trips for multiple chunks outweighs the negligible download savings.
- **High-Latency / Offline-First Environments**: If a user has an unstable connection, encountering a loading spinner or network failure mid-session when clicking a tab creates a worse user experience than downloading everything upfront.
- **Shared Code Overhead**: If every route shares 90% of the same dependencies, Rollup/Webpack must generate tiny fragment chunks with common module overhead, increasing total HTTP request count.

---

### 📸 Evidence & Output Screenshots
All high-resolution evaluation screenshots are saved in `docs/screenshots/`:
1. `01_baseline_single_bundle_build.png`: Monolithic single bundle build (`206.87 kB`)
2. `02_codesplit_build_chunks.png`: Modular code-split build output (`6 chunks + 383 kB isolated recharts`)
3. `03_home_tasks_dashboard.png`: Minimal subtle Home Tasks Dashboard (`Home.chunk.js`)
4. `04_projects_lazy_chunk_loaded.png`: Projects view loaded dynamically on `/projects`
5. `05_suspense_fallback_loading.png`: Suspense fallback skeleton screen during network throttling
6. `06_analytics_heavy_chart_lazy.png`: Dynamic on-demand loading of heavy Recharts charting chunk
7. `07_contact_page_view.png`: Contact page with student credentials (Samarth Kalavadia, 24CS034)
8. `08_devtools_profiler_memoization.png`: React DevTools Profiler & Memoization side-by-side audit

---

### 🔧 Troubleshooting Guide
- **Error: Element type is invalid**: Occurs when a lazy-loaded component does not have a default export. Ensure each route file ends with `export default ComponentName`.
- **Fallback UI never appears**: Localhost is too fast (< 5ms). Solution: Use the in-app network simulation dropdown (300ms / 800ms) or DevTools Network throttling ("Slow 3G").
- **No separate chunk files after build**: Occurs when static `import Projects from './pages/Projects'` is left at the top of the file. Solution: Replace with `const Projects = lazy(() => import('./pages/Projects'))`.
- **Suspense fallback replaces entire app**: Occurs when `<Suspense>` wraps `<App />` instead of `<Routes>`. Solution: Move `<Navbar />` outside `<Suspense>` so navigation remains steady.

