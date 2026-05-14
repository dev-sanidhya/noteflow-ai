# NoteFlow AI

An AI-powered note-taking workspace built with Next.js 14, Supabase, and Claude AI.

## Features

- **Markdown notes** - Write in markdown with full syntax support
- **AI summaries** - One-click AI analysis: summary, action items, and suggested title
- **Smart search** - Search across titles, content, and tags
- **Tags and categories** - Organize notes efficiently
- **Public sharing** - Share any note via a unique public link
- **Auto-save** - Notes auto-save with 1.5s debounce
- **Insights dashboard** - Track activity, tag usage, and AI usage stats

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Auth and Database**: Supabase (PostgreSQL + Row-Level Security)
- **AI**: Anthropic Claude (claude-haiku-4-5-20251001)
- **Styling**: Tailwind CSS (custom components only)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/dev-sanidhya/noteflow-ai
cd noteflow-ai
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL editor
3. Run the contents of `supabase/schema.sql`

This will create:
- `profiles` table (linked to auth.users)
- `notes` table with all fields
- Row-Level Security policies
- Auto-update triggers

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  app/
    (auth)/         - Login and signup pages
    (dashboard)/    - Protected app pages (notes, insights)
    api/            - API routes
    shared/         - Public note viewer
    page.tsx        - Landing page
  components/
    ui/             - Button, Input, Badge, Modal, Spinner
    layout/         - Sidebar, Header
    notes/          - NoteCard, NoteEditor, TagInput, SearchBar, AISummaryPanel
    insights/       - StatsCard, ActivityChart, TagCloud
  lib/
    supabase/       - Browser and server Supabase clients
    anthropic.ts    - AI summary generation
    utils.ts        - Utilities
  types/
    index.ts        - TypeScript types
  middleware.ts     - Auth route protection
supabase/
  schema.sql        - Database schema
```

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notes` | List user's notes (supports `q`, `tag`, `category`, `archived`, `sort` query params) |
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes/:id` | Get a single note |
| PATCH | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| POST | `/api/notes/:id/generate-summary` | Generate AI summary via Claude |
| POST | `/api/notes/:id/share` | Generate a public share link |
| GET | `/api/shared/:shareId` | Get a public note (no auth required) |
| GET | `/api/insights` | Get productivity stats |

## AI Summary

The AI feature uses Claude Haiku to analyze note content and return:
- A 2-3 sentence summary
- Extracted action items
- A suggested improved title

Each generation is counted and stored on the note. The result is persisted so it doesn't need to be regenerated on every page load.

## Database Schema

See `supabase/schema.sql` for the full schema. Key tables:

- `profiles` - User profiles (auto-created on signup via trigger)
- `notes` - All note data including AI fields and sharing

Row-Level Security ensures users can only access their own notes. Public notes are accessible via the `is_public = true` policy.
