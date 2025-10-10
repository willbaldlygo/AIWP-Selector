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
  - Timer control (countdown, audio triggers, timer completion handling)
  - Winner removal workflow (delayed until timer completes or is reset)
  - Audio preloading and playback for three sound effects

- **components/Wheel.tsx** - SVG-based spinning wheel with:
  - Dynamic segment generation based on participant count
  - Custom font sizing algorithm that adapts labels to segment size
  - Canvas-based text measurement for precise label fitting
  - CSS transitions for smooth 4-second spin animation

- **components/Timer.tsx** - Countdown timer display with start/reset controls

- **components/WinnerModal.tsx** - Modal overlay shown after wheel selection with:
  - Conditional display switching between initial winner announcement and timer display
  - Timer integration that shows countdown prominently for video call visibility
  - Persistent timer display at 0:00 until manual reset or 10-second auto-close

- **components/NamesPanel.tsx** - Side panel for editing participant names

### State Management

All state is managed in App.tsx using React hooks:

**Winner Selection Flow:**
- Winner is selected when wheel stops spinning
- Winner's name and segment REMAIN on the wheel until timer completes or is reset
- `pendingRemovalWinner` state tracks the selected winner awaiting removal
- Winner is only removed from wheel when:
  - The 60-second timer reaches 0:00 and completes, OR
  - The timer is manually reset by the user, OR
  - 10 seconds elapse after timer completion (auto-cleanup)

**Timer Behavior:**
- `timerStarted` flag tracks whether timer has been initiated for current winner
- `isTimerActive` tracks whether countdown is currently running
- Timer triggers audio at 10 seconds (countdown) and 0 seconds (finish bell)
- Modal displays timer prominently when started, remains visible at 0:00
- Auto-reset timeout closes modal and removes winner 10 seconds after reaching zero

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

### Winner Removal Workflow

IMPORTANT: Winners are NOT removed immediately upon selection. The workflow is:
1. Wheel spins and selects a winner
2. Winner's segment remains visible on the wheel
3. Modal appears with winner announcement
4. User starts 60-second timer (or closes modal to keep winner on wheel)
5. Timer counts down and is displayed in the modal
6. When timer reaches 0:00:
   - Timer display remains visible in modal showing "Time's Up!"
   - Winner segment still visible on wheel
7. Winner is removed ONLY when:
   - User clicks "Reset Timer" button, OR
   - 10 seconds pass after timer completion
8. Modal closes and wheel is ready for next round

This delayed removal ensures the winner remains visible throughout the entire selection and timing process, making it clear who was selected during video calls.

### Modal Display Logic

The WinnerModal component uses `timerStarted` (not `isTimerActive`) to determine which view to show:
- **Before timer starts:** Shows winner name, "Start 60s Timer" and "Close" buttons
- **After timer starts:** Shows timer display with countdown, progress bar, and controls
- **Timer display persists:** Even when timer stops at 0:00, the timer display remains visible with "Time's Up!" header until reset or auto-close

This prevents the modal from flashing back to the initial view when the timer completes, maintaining visibility for video calls.

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

## Recent Changes

### Winner Retention & Timer Integration (October 2025)
- Modified winner selection to keep participants on wheel until timer completes
- Integrated timer display into winner modal for better visibility during video calls
- Removed "Add Name Back to Wheel" button (Close button keeps winner on wheel)
- Added `pendingRemovalWinner` and `timerStarted` state management
- Timer display now persists at 0:00 until manual reset or 10-second auto-close
- Winner removal now synchronized with modal closure for clean UX
