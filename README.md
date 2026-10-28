# Expense Tracker — Frontend

A clean, modern expense tracking dashboard built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui**. Connect it to any FastAPI backend that exposes the routes described in [API Contract](#-api-contract).

---

## 📸 Overview

- 🔐 **Authentication** — register, login, JWT-based session
- 💸 **Transactions** — create, update, delete income / expense entries
- 🔎 **Filtering** — by type, category, and amount range
- 📊 **Dashboard stats** — balance, income, expenses, transaction count
- 🎨 **Modern UI** — shadcn/ui components, polished typography, subtle motion
- ✅ **Confirmations** — every destructive action is guarded by a modal

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI components | [shadcn/ui](https://ui.shadcn.com/) (Radix-based) |
| Icons | [lucide-react](https://lucide.dev/) |
| State | React `useState` + localStorage |
| HTTP | Native `fetch` (wrapped in `lib/api.ts`) |

---

## 📦 Requirements

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- Backend running at `http://localhost:8000` (see [Backend](#-backend-requirements))

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url> expense-tracker-frontend
cd expense-tracker-frontend
npm install
```

### 2. Create `.env`

Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

`.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_TOKEN_KEY=expense_tracker_token
VITE_USER_KEY=expense_tracker_user
```

> All Vite client-side variables **must** start with `VITE_`.

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

### 4. Build for production

```bash
npm run build
npm run preview
```

The production bundle is emitted to `dist/`.

---

## 🗂️ Project Structure

```
expense-tracker-frontend/
├── src/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── alert.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   └── table.tsx
│   │   ├── AuthScreen.tsx            # login / register split-view
│   │   ├── ConfirmDialog.tsx         # reusable confirmation modal
│   │   ├── Dashboard.tsx             # main app shell + stats
│   │   ├── FilterBar.tsx             # transaction filtering
│   │   ├── TransactionForm.tsx       # create / edit form
│   │   └── TransactionTable.tsx      # list + row actions
│   ├── lib/
│   │   ├── api.ts                    # fetch wrapper + all API calls
│   │   ├── auth.ts                   # user session helpers
│   │   └── utils.ts                  # cn() helper for shadcn
│   ├── types/
│   │   └── index.ts                  # shared TypeScript types
│   ├── App.tsx                       # routing between auth/dashboard
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Tailwind import
│   └── vite-env.d.ts                 # typed import.meta.env
├── public/
├── .env                              # local secrets (git-ignored)
├── .env.example                      # template for teammates
├── components.json                   # shadcn config
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Base URL of the FastAPI backend |
| `VITE_TOKEN_KEY` | ✅ | localStorage key for the JWT |
| `VITE_USER_KEY` | ✅ | localStorage key for the user object |

**Rules**
- Never commit `.env` — only `.env.example`.
- Values in `.env` are **bundled into the client** at build time. Never put secrets here.
- Changing `.env` requires restarting `npm run dev`.

---

## 🧭 App Flow

```
┌────────────────┐    valid token?    ┌─────────────┐
│   App mounts   ├───────────yes─────▶│  Dashboard  │
└────────┬───────┘                    └─────┬───────┘
         │ no                               │
         ▼                                  │ Sign out
┌────────────────┐                          │
│  AuthScreen    │◀─────────────────────────┘
│  (login/reg)   │
└────────┬───────┘
         │ successful login → save token + user
         ▼
    Dashboard (loads transactions)
```

- **On mount** — reads `localStorage` once to determine if a session exists.
- **Login** — calls `POST /auth/login`, saves the JWT under `VITE_TOKEN_KEY`.
- **Any `401`** — `api.ts` clears storage automatically and throws `"Session expired"`.
- **Sign out** — confirmation modal → clears storage → back to `AuthScreen`.

---

## 🔗 API Contract

The frontend expects these routes on `VITE_API_BASE_URL`:

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/` | ❌ | Health check |
| `POST` | `/auth/register` | ❌ | `{ username, email, password }` |
| `POST` | `/auth/login` | ❌ | `application/x-www-form-urlencoded` (`username`, `password`) → `{ access_token, token_type }` |
| `GET` | `/transactions/` | ✅ | List current user's transactions |
| `POST` | `/transactions/` | ✅ | Create a transaction |
| `PUT` | `/transactions/{id}` | ✅ | Update a transaction |
| `DELETE` | `/transactions/{id}` | ✅ | Delete a transaction |
| `GET` | `/transactions/filter` | ✅ | Query: `type`, `category`, `minimum_amount`, `maximum_amount` |

**Transaction shape**

```json
{
  "id": 1,
  "title": "Monthly Salary",
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2026-10-26",
  "owner_id": 1
}
```

`type` must be either `"income"` or `"expense"`. `amount` must be positive.

---

## 🧪 Backend Requirements

Your FastAPI backend **must**:

1. Enable CORS for the Vite dev server:

   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

   > `add_middleware` must be called **before** `app.include_router(...)`, otherwise preflight `OPTIONS` requests return `405`.

2. Use **OAuth2PasswordRequestForm** on `/auth/login` — the frontend sends `application/x-www-form-urlencoded`.

3. Return a JWT on login with `sub = username`.

4. Enforce ownership on `/transactions/*` routes (each user only sees their own transactions).

---

## 🖱️ Using the App

1. **Register** with a username, email and password.
2. **Sign in** — you'll land on the dashboard.
3. **Add a transaction** — fill in the form at the top of the dashboard.
4. **Edit** — click **Edit** on any row to load it into the form.
5. **Delete** — click **Delete**; a confirmation modal appears.
6. **Filter** — use the sidebar filters to narrow the list.
7. **Sign out** — top-right button; confirmation modal prevents accidental logout.

---

## 🧯 Troubleshooting

### `Failed to fetch` in the browser

- Backend not running → start `uvicorn app.main:app --reload` on port `8000`.
- CORS not configured → see [Backend Requirements](#-backend-requirements).
- Wrong URL → check `VITE_API_BASE_URL` in `.env` and **restart** the dev server.

### `405 Method Not Allowed` on `OPTIONS /auth/register`

The CORS middleware is either missing or added **after** `app.include_router(...)`. Move `add_middleware` above the route includes.

### `Session expired. Please log in again.`

Any `401` from the API triggers automatic logout. Re-sign in.

### `VITE_API_BASE_URL is not set`

`.env` file missing or the dev server wasn't restarted after editing it.

### TypeScript error on `import.meta.env.*`

`src/vite-env.d.ts` is missing the `ImportMetaEnv` interface. Add:

```ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TOKEN_KEY: string;
  readonly VITE_USER_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### `Cannot find module '@/…'`

Path alias misconfigured. `vite.config.ts` **and** `tsconfig.app.json` must both declare:

```json
"paths": { "@/*": ["./src/*"] }
```

### `react-hooks/set-state-in-effect` warning

Don't call `setState` synchronously inside `useEffect` just to sync state from props. Use lazy `useState(() => ...)` or a `key` prop instead.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🎨 Adding More shadcn Components

```bash
npx shadcn@latest add <component-name>
```

Examples:

```bash
npx shadcn@latest add toast
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
```

To see the full list: https://ui.shadcn.com/docs/components

---

## 🔐 Security Notes

- **JWT stored in `localStorage`** — vulnerable to XSS. For production, consider `httpOnly` cookies.
- **`.env` is not secret** — anything in it is bundled into the client. Never put API secrets here.
- **Only HTTPS in production** — configure your host to redirect HTTP → HTTPS.
- **Validate on the server** — client-side validation is a UX nicety, not a security boundary.

---

## 🤝 Contributing

1. Fork the repo.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Commit: `git commit -m "feat: add X"`.
4. Push and open a PR.

Please keep PRs focused and include a short description of the change.

---

## 📄 License

MIT — see [`LICENSE`](./LICENSE).

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
- [Radix UI](https://www.radix-ui.com/) for the accessible primitives
- [Vite](https://vitejs.dev/) for the fast dev experience