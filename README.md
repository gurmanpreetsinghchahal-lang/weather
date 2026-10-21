# Atmosphere — Modern Real-Time Weather Web Application

Atmosphere is a high-performance, responsive, and visually immersive weather web application engineered with **React 19**, **Material UI (MUI)**, **Tailwind CSS**, and the official **OpenWeatherMap REST API**. It pairs meteorological telemetry with dynamic atmospheric visuals, glassmorphism cards, and zero-pill typographic discipline.

---

## 🌟 Key Features

1. **Real-Time Weather Intelligence**:
   - Live temperature, feels-like, daily highs & lows.
   - Descriptive condition summaries and dynamic SVG weather glyphs.
   - Local time calculated from UTC offset.
   - Sunrise and sunset times with relative countdowns and visual solar trajectory arc.
   - Contextual clothing and outdoor activity advisor based on temperature, rain probability, and wind.

2. **8 Atmospheric Telemetry Metrics**:
   - Perceived temperature (Feels Like).
   - Relative humidity & computed dew point.
   - Wind speed (with instant switch between km/h, mph, and m/s) and cardinal direction compass heading.
   - Atmospheric barometric pressure in hPa with trend indication.
   - Optical visibility distance with clarity descriptors.
   - Cloud coverage percentage.
   - Cardinal wind direction with heading degrees.
   - Air Quality Index (AQI 1–5 European/US EPA standard) with pollutant breakdown (PM2.5, PM10, O₃, NO₂, SO₂, CO).

3. **Hourly & Extended 5-Day Forecasts**:
   - **Hourly Forecast**: Horizontally scrollable strip displaying upcoming conditions in 3-hour increments, temperature, precipitation chance (POP %), and wind.
   - **5-Day Outlook**: Daily temperature range bars with relative temperature spectrum, expected weather conditions, and rain probability.

4. **Interactive City Search & Geocoding**:
   - Debounced search bar with geocoding suggestions (`/geo/1.0/direct`).
   - Keyboard shortcut: press `/` to instantly focus search.
   - Geolocation integration: one-click GPS detection via browser `navigator.geolocation`.
   - Pinned favorites & quick-select major world cities.

5. **Client-Side Unit Toggles & Zero API Latency**:
   - Toggle seamlessly between **Celsius (°C)** and **Fahrenheit (°F)** with zero redundant network requests.
   - Toggle between **km/h**, **mph**, and **m/s** for wind metrics.
   - Preference saved automatically to `localStorage`.

6. **Dynamic Atmospheric Theming**:
   - Dashboard background and lighting automatically adapt based on local daytime/nighttime and meteorological conditions (Clear, Clouds, Rain, Thunderstorm, Snow, Mist).

7. **Resilient Architecture & API Key Management**:
   - In-app API Key modal with live verification test.
   - Supports both environment variable (`VITE_OPENWEATHER_API_KEY`) and browser `localStorage`.
   - Curated high-accuracy fallback stations for instant out-of-the-box exploration without mandatory immediate key setup.

---

## 🛠️ Technology Stack

- **React 19** — Functional components, custom hooks (`useWeather`), memoized callbacks.
- **Material UI (MUI v6)** — Accessible components, typography, design tokens, and CSS baseline.
- **Tailwind CSS v4** — High-performance utility styling, glassmorphism, responsive grid layouts.
- **Lucide Icons** — Consistent SVG weather glyphs and UI icons.
- **Vite 8** — Fast bundler and development server.
- **Fetch API & Async/Await** — Native modern asynchronous HTTP requests with `AbortController` cancellation.

---

## 📡 OpenWeatherMap API Endpoints Used

The application coordinates the following endpoints:

| Feature | Endpoint | Description |
| :--- | :--- | :--- |
| **Current Weather** | `GET /data/2.5/weather` | Current temperature, feels like, humidity, pressure, wind, visibility, clouds, sunrise/sunset, and local timezone offset. |
| **Forecast** | `GET /data/2.5/forecast` | 5-day / 3-hour forecast intervals normalized into hourly projections and daily aggregates with precipitation probability (`pop`). |
| **Air Pollution** | `GET /data/2.5/air_pollution` | Air Quality Index (AQI 1-5) and concentration of pollutants (PM2.5, PM10, O₃, NO₂, SO₂, CO). |
| **Geocoding** | `GET /geo/1.0/direct` | City autocomplete suggestions and coordinate disambiguation. |

---

## 🔑 How to Obtain an OpenWeatherMap API Key

1. Visit [OpenWeatherMap Sign Up](https://home.openweathermap.org/users/sign_up) and register for a free account.
2. Go to your **API Keys** tab in the dashboard.
3. Copy your default 32-character API key.
4. *Important Note*: Newly created OpenWeather keys take **10 to 30 minutes** to activate across their global caching servers.
5. You can enter the key directly in the app via the **API Key Setup** button in the top navigation, or configure your `.env` file.

---

## 🚀 Getting Started

### 1. Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```bash
VITE_OPENWEATHER_API_KEY="your_actual_32_character_api_key"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be running on `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

This compiles optimized production assets into the `dist/` directory.

---

## 📂 Architecture & Component Structure

```text
src/
├── components/
│   ├── AirQualityCard.tsx    # AQI gauge and pollutant breakdown
│   ├── ApiKeyModal.tsx       # Live key tester and setup guidance
│   ├── CurrentWeather.tsx    # Hero card with temperature and advisor
│   ├── ErrorMessage.tsx      # Graceful error alerts and recovery picks
│   ├── FavoritesBar.tsx      # Pinned city quick-access bar
│   ├── FiveDayForecast.tsx   # 5-day outlook with temperature bars
│   ├── Header.tsx            # Wordmark, unit toggles, and status
│   ├── HourlyForecast.tsx    # Horizontally scrollable 3h forecast cards
│   ├── LoadingSkeleton.tsx   # Animated glassmorphism placeholders
│   ├── SearchBar.tsx         # Geocoded search with keyboard shortcut
│   ├── SunTracker.tsx        # Solar arc path and daylight counter
│   ├── WeatherIcon.tsx       # Dynamic SVG weather glyphs
│   └── WeatherMetrics.tsx    # 8 atmospheric telemetry metric cards
├── hooks/
│   └── useWeather.ts         # Centralized state management & controller
├── services/
│   └── weatherService.ts     # OpenWeather REST API client & normalizer
├── theme/
│   └── theme.ts              # Material UI theme tokens and typography
├── types/
│   └── weather.ts            # Strongly typed OpenWeather & UI models
├── utils/
│   └── weatherUtils.ts       # Conversions, solar math, and theming
├── App.tsx                   # Main dashboard view
├── index.css                 # Global CSS and custom scrollbars
└── main.tsx                  # Application entry point
```

---

## 🔒 Security & Best Practices

- API credentials are never committed to version control (`.env*` excluded in `.gitignore`).
- All user requests use `AbortController` to cancel stale in-flight fetches when rapidly typing or switching locations.
- `response.ok` checks ensure network and HTTP errors are cleanly caught and presented in the UI without crashing the dashboard.
