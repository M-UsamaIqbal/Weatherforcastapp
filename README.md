# Weather Forecast App

A responsive weather dashboard built with Next.js. Search any city (or use your
current location) to see live conditions and a multi-day forecast, and save your
favorite cities for quick access.

🔗 **Live demo:** https://weatherforcastapp-six.vercel.app

## Features

- **City search** — look up current weather by city name.
- **Current-location weather** — uses the browser Geolocation API on first load.
- **5-day forecast** — daily temperature and conditions with weather icons.
- **Favorite cities** — save/remove favorites, persisted in `localStorage`.
- **Local time & date** — shows the searched location's local date, offset by its timezone.
- **Responsive UI** — mobile-first layout styled with Tailwind CSS.

## Tech stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router) + React 18
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [react-icons](https://react-icons.github.io/react-icons/)
- **Data:** [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather + 5-day Forecast)

## Screenshots

> _Screenshots pending — add images to a `screenshots/` folder and reference them here._

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and add your OpenWeatherMap API key:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY` | Your OpenWeatherMap API key. Exposed to the browser, so restrict it to the free weather endpoints. |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run the linter |

## Notes

- The API key is read from `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY`. Never commit a real
  key — keep it in `.env.local` (git-ignored).
