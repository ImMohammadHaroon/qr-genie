
## QR Genie

QR Genie is a **Vite + React + TypeScript** web app for generating QR codes (with a modern UI built using **shadcn/ui** + **Tailwind CSS**) and optional **Supabase** integration.

### Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- Supabase (`@supabase/supabase-js`)

### Project structure

```txt
.
├─ public/                 # static assets
├─ src/
│  ├─ components/          # UI + app components (QR generator, tabs, etc.)
│  ├─ integrations/
│  │  └─ supabase/         # supabase client + generated types
│  ├─ pages/               # routes/pages
│  ├─ lib/                 # shared utilities
│  ├─ main.tsx             # app entry
│  └─ App.tsx              # app root
└─ supabase/               # migrations + config
```

### Setup (local development)

Prerequisites: **Node.js 18+** and **npm**.

1) Install dependencies

```bash
npm install
```

2) Create your environment file

```bash
cp .env.example .env
```

3) Fill in `.env` values (from your Supabase project settings)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- (optional) `VITE_SUPABASE_PROJECT_ID`

4) Run the dev server

```bash
npm run dev
```

### Build & preview

```bash
npm run build
npm run preview
```

### Supabase “keep alive” workflow

This repo includes a GitHub Actions workflow at `.github/workflows/keep-alive.yml` that pings your Supabase REST endpoint daily.

- Add the GitHub secret **`SUPABASE_ANON_KEY`** in your repo settings
- Replace `<your-project-ref>` in the workflow URL with your Supabase project ref (the subdomain prefix)
