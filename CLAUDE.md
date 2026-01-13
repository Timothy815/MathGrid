# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server on port 3000
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment

Set `GEMINI_API_KEY` in `.env.local` (referenced in vite.config.ts but not currently used by the app).

## Architecture

**MathGrid Worksheet Generator** - A React/TypeScript app that generates printable math worksheets with configurable arithmetic problems.

### Core Flow

1. `App.tsx` holds the main `WorksheetConfig` state and renders the worksheet preview
2. `Controls.tsx` is a sidebar component that modifies the config (operation type, digit counts, fact families, etc.)
3. When config changes, `generateProblems()` in `services/mathUtils.ts` creates an array of `MathProblem` objects
4. `ProblemRenderer.tsx` renders each problem in vertical math format (or long division format for division)
5. `GridDigit.tsx` renders individual digit cells for the grid layout

### Key Types (`types.ts`)

- `Operation` enum: Addition, Subtraction, Multiplication, Division
- `WorksheetConfig`: All configuration options (operation, count, digit ranges, fact families, remainders, seed)
- `MathProblem`: Individual problem with id, type, top, and bottom numbers

### Layout System

`App.tsx` dynamically calculates grid layout based on operation type and digit counts:
- Division and multi-digit multiplication get fewer problems per page (2-3 columns)
- Simple operations get 4x4 grids (16 per page)
- Problems auto-paginate with `chunk()` helper

### Printing

`handlePrint()` in `App.tsx` opens a new window with the worksheet HTML, including Tailwind CSS and custom print styles, then triggers `window.print()`.

### Styling

Uses Tailwind CSS (loaded via CDN in index.html and print window). Fonts: JetBrains Mono for numbers, Nunito for UI.
