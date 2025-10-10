# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript single-page application for random participant selection with an integrated timer. It features a "wheel of fortune" style spinner with audio feedback and a countdown timer. The app was originally generated via Google AI Studio and is deployable as a standalone web application.

## Development Commands

- **Install dependencies:** `npm install`
- **Run development server:** `npm run dev`
  - Automatically opens in Chrome at http://localhost:5151
  - Runs with Vite dev server and hot module replacement
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`

## Architecture

### Component Structure

The app follows a standard React component hierarchy:

- **App.tsx** - Main application container that manages global state including:
  - Participant list management (allNames, participants, winner states)
  - Wheel spinning logic (rotation, animation, winner selection)
  - Timer control (countdown, audio triggers)
  - Audio preloading and playback for three sound effects

- **components/Wheel.tsx** - SVG-based spinning wheel with:
  - Dynamic segment generation based on participant count
  - Custom font sizing algorithm that adapts labels to segment size
  - Canvas-based text measurement for precise label fitting
  - CSS transitions for smooth 4-second spin animation

- **components/Timer.tsx** - Countdown timer display with start/reset controls

- **components/WinnerModal.tsx** - Modal overlay shown after wheel selection

- **components/NamesPanel.tsx** - Side panel for editing participant names

### State Management

All state is managed in App.tsx using React hooks:
- Winner selection automatically removes participant from the wheel
- Last winner can be re-added to the participant pool
- Timer triggers audio at 10 seconds (countdown) and 0 seconds (finish bell)
- Auto-reset timeout clears timer 10 seconds after reaching zero

### Audio System

Three audio clips are preloaded on mount and played via refs:
- `Wheel_Start.wav` - Plays when spin begins
- `Countdown.wav` - Plays at 10 seconds remaining
- `Finish_Bell.wav` - Plays when timer reaches zero

Audio playback uses try/catch to handle browser autoplay restrictions gracefully.

### Styling

- Uses utility-first CSS with Tailwind-like class names
- Custom responsive grid layout in `index.css` that switches to vertical stack on mobile
- Wheel uses CSS transforms for rotation animation
- Font rendering uses `paintOrder: 'stroke'` for text outlines on wheel labels

## Key Implementation Details

### Wheel Rotation Logic

The wheel uses a precise rotation calculation to ensure the pointer (top triangle) points to the selected winner:
1. Calculates segment angle based on participant count
2. Generates random target index
3. Computes rotation to align that segment with the top pointer
4. Adds 3-6 extra full rotations for dramatic effect
5. Uses CSS `transition-transform` with 4000ms duration

### Font Sizing Algorithm

The Wheel component includes sophisticated font sizing (`computeLabelFontPx`) that:
- Measures text width using Canvas API
- Constrains font size by both radial space and arc length
- Applies minimum (11px) and maximum (1.2x base) bounds
- Truncates names over 20 characters when font hits minimum size

### Path Alias

TypeScript and Vite are configured with `@/*` alias pointing to the project root for cleaner imports.

## Environment

The app references `GEMINI_API_KEY` in vite.config but the current implementation doesn't actually use the Gemini API. The environment setup appears to be a remnant from the AI Studio template.

## Testing

No test framework is currently configured. Manual testing can be performed using `npm run dev`.
