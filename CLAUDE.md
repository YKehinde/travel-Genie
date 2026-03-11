# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Run production server
```

There is no test suite configured.

## Code Style

Enforced via Prettier (`.prettierrc`): no semicolons, single quotes, trailing commas, 2-space tabs.

## Architecture

**Travel Genie** is a Next.js 15 App Router application that takes a destination city as input, queries OpenRouter's GPT-3.5-turbo via a Next.js API route, and renders AI-generated activity recommendations with GetYourGuide affiliate links.

### Request Flow

1. User enters destination in `src/app/page.tsx` (client component)
2. TanStack Query mutation calls `src/app/lib/fetchPlaces.ts` (axios wrapper)
3. Request hits `src/app/api/places/route.ts` (POST `/api/places`)
4. API route calls OpenRouter with a prompt requesting 5 activities
5. Response markdown is processed by `src/app/lib/transformAiMarkdown.ts`, which replaces placeholder "Book now" links with GetYourGuide affiliate URLs built by `src/app/lib/generateGygLink.ts`
6. Rendered via `react-markdown` in the page

### Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main UI — search input, loading state, markdown results |
| `src/app/layout.tsx` | Root layout wrapping app with `QueryClientProvider` |
| `src/app/api/places/route.ts` | POST endpoint — builds prompt, calls OpenRouter, returns content |
| `src/app/lib/fetchPlaces.ts` | Client-side axios wrapper for the API route |
| `src/app/lib/transformAiMarkdown.ts` | Post-processes AI markdown to inject affiliate links |
| `src/app/lib/generateGygLink.ts` | Builds GetYourGuide affiliate search URLs |
| `src/app/globals.css` | Tailwind import + `.result-content` link styles |

### Environment Variables

`OPENROUTER_API_KEY` is required in `.env.local` for the API route to call OpenRouter.

### Path Alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json`).
