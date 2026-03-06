# Spin & Time Selector

![Spin & Time Selector wheel](./Wheel.png)

Spin & Time Selector is a React + TypeScript browser app for choosing a random person from a list and then giving them a visible 60-second speaking timer.

## What It Does

- Lets you paste or type one participant name per line.
- Spins a wheel to choose a winner at random.
- Plays audio when the wheel starts, when the timer reaches 10 seconds, and when time runs out.
- Keeps the selected winner on the wheel while their 60-second timer runs.
- Removes the winner only when the timer is reset or 10 seconds pass after `0:00`.

## Requirements

- Node.js 20 or newer
- npm
- A modern desktop browser

## Download And Run

1. Clone the repository:

   ```bash
   git clone https://github.com/willbaldlygo/AIWP-Selector.git
   cd AIWP-Selector
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL shown in the terminal, usually [http://localhost:5151](http://localhost:5151).

## macOS Quick Launch

If you want the app to open straight away in Google Chrome on macOS, use either of these:

```bash
npm run dev:chrome
```

Or double-click [`Launch Spin & Time.command`](./Launch%20Spin%20%26%20Time.command).

## How To Use The App

1. Click `Manage Names`.
2. Enter one name per line and choose `Update Wheel`.
3. Click `SPIN THE WHEEL`.
4. When a winner appears, click `Start 60s Timer`.
5. Let the timer finish, or click `Reset Timer` to end the round early.
6. Use `Reset Wheel` to restore the full original list.

## Available Scripts

- `npm run dev` starts the Vite dev server.
- `npm run dev:chrome` starts the dev server and opens Google Chrome on macOS.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.

## Project Structure

- `App.tsx` manages participants, wheel state, timer state, and audio playback.
- `components/Wheel.tsx` renders the SVG spinning wheel and label layout.
- `components/WinnerModal.tsx` shows the winner and the timer overlay.
- `components/Timer.tsx` renders the always-visible timer card.
- `components/NamesPanel.tsx` handles editing the participant list.

## Deployment

The repository includes [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) for GitHub Pages deployment from `main`.

To deploy manually:

1. Push your changes to `main`.
2. Open the repository `Settings` on GitHub.
3. In `Pages`, set the source to `GitHub Actions`.
4. The workflow will build the app and publish the contents of `dist/`.

## Notes

- No environment variables are required.
- The app currently loads Tailwind’s browser build from the official CDN in `index.html`.
