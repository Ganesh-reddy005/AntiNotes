# AntiNotes Frontend Codebase Notes

## Project Structure
- **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Design system**: `mistral-*` color tokens (navy, orange, sand, yellow, bg)
- **Animation**: `framer-motion` (`motion`, `AnimatePresence`)
- **Icons**: `lucide-react`
- **Editor**: `@monaco-editor/react` (dynamically imported, no SSR)

## Key Routes
| Route | File | Description |
|-------|------|-------------|
| `/problems` | `app/(protected)/problems/page.tsx` | Problem browser |
| `/problems/[slug]` | `app/(protected)/problems/[slug]/page.tsx` | Problem solve page (Monaco editor) |
| `/tutor/[session_id]` | `app/(protected)/tutor/[session_id]/page.tsx` | Full-page tutor chat |
| `/dashboard` | `app/(protected)/dashboard/...` | Dashboard |
| `/revision` | `app/(protected)/revision/...` | Revision tracker |

## API Layer (`lib/api.ts`)
Key exported APIs:
- `problemsApi.get(slug)` → `{ data: Problem }`
- `reviewApi.submit({ problem_slug, code, language })` → `{ data: Review }`
- `sessionApi.create(slug)` → `{ data: { id: string } }`
- `tutorApi.ask({ problem_slug, user_message, history, session_id? })` → `{ data: { reply: string } }`
- `userApi.profile()` → `{ data: { primary_language: string, ... } }`

## Types
```ts
interface Problem { slug: string; title: string; difficulty: string; description: string; tags: string[]; starter_code?: string; }
interface Review { score: number; thinking_style: string; detailed_feedback: string; strengths: string[]; weaknesses: string[]; concept_gaps: string[]; }
interface Message { role: "user" | "assistant"; content: string; }
```

## Problem Solve Page (`/problems/[slug]/page.tsx`)
- State: `problem`, `code`, `language`, `submitting`, `review`, `error`, `loading`
- `openTutor()`: previously navigated to `/tutor/{session_id}` (now → floating window)
- **`ReviewPanel`** component: shows score, feedback, strengths/weaknesses, concept gaps. Has "Ask AI Tutor" button that calls `onTutor()`
- Top bar has a small "Ask AI" button also calling `openTutor()`
- Layout: `h-screen flex flex-col`, top bar, main (problem desc left + Monaco right), bottom review panel

## Tutor Chat Logic (`/tutor/[session_id]/page.tsx`)
- State: `problem`, `messages`, `input`, `thinking`
- `send()`: calls `tutorApi.ask()` with last 6 messages as history
- Has full-page layout with header, optional problem card, messages area, input bar

## Floating Tutor Window Plan
- Create `components/FloatingTutor.tsx` - self-contained chat widget
- State stored in parent (`/problems/[slug]/page.tsx`) so it persists across open/close
- Props: `problemSlug`, `sessionId`, `isOpen`, `onClose`, `messages`, `setMessages`
- Features: draggable, minimizable, resizable (fixed to bottom-right corner)
- Does NOT navigate away - inline API calls to `tutorApi.ask()`

## Layout & Protected Routes
- `app/(protected)/layout.tsx`: wraps all protected pages (auth guard + sidebar)
- `app/layout.tsx`: root layout

## Design Tokens (Tailwind)
- `bg-mistral-bg`: page background
- `bg-mistral-navy` / `text-mistral-navy`: primary dark color
- `text-mistral-orange` / `bg-mistral-orange`: accent orange
- `bg-mistral-yellow` / `text-mistral-yellow`: highlight yellow
- `bg-mistral-sand`: subtle sand color
- Shadow pattern: `shadow-[3px_3px_0px_0px_#f97316]` (orange offset shadow)
- Font: `font-mono` (JetBrains Mono) for code/labels, `font-serif` for headings, `font-sans` for body
