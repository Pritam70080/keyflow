# Keyflow

Keyflow is a focused typing trainer built with Next.js. It helps users practice speed and accuracy with a clean interface, live WPM and accuracy stats, a visual keyboard, and local progress tracking.

## Live demo

- Deployed app: https://keyflow-brown.vercel.app/
- GitHub repository: https://github.com/Pritam70080/keyflow

## What I used to build the app

This project is built with:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router
- Zustand for local state and preferences
- Recharts for progress visualization
- Lucide React for icons
- Motion for small UI animations
- Base UI for button primitives

## Fonts used

The app uses Google fonts through Next.js font optimization:

- Montserrat for general interface text
- Roboto Mono for metrics, numbers, and typing details

These are configured in [app/layout.tsx](app/layout.tsx).

## Project overview

Keyflow is designed to feel calm and minimal while still providing useful feedback during typing sessions. Users can:

- start a typing session instantly
- switch difficulty and duration
- see live WPM, accuracy, and raw speed
- use a visual keyboard and keyboard input tracking
- keep history locally in the browser
- review learning progress over time

## Routes

- `/` — main typing practice screen with live testing experience
- `/about` — product overview and app explanation
- `/progress` — saved session history and performance averages

## How to clone the project

```bash
git clone https://github.com/Pritam70080/keyflow.git
cd keyflow
```

## How to run the app locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser at:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
npm run start
```

## Scripts

```bash
npm run dev    # run the app in development mode
npm run build  # create a production build
npm run start  # serve the production build
npm run lint   # run ESLint checks
```

## Notes

- Progress and preferences are stored locally in the browser.
- The app does not require an account to start typing.
- The design is intentionally minimal and mobile-friendly.

## Recommended next ideas

- add downloadable stats/history export
- add daily streak tracking
- add custom practice passages
- add sound themes and stronger personalization options
