# AyoZ

AyoZ is a modern React + Vite landing experience for a premium hospitality platform.
It showcases a zero-wait dining flow where guests can reserve, pre-order, prepay, and
trigger kitchen readiness based on live arrival timing.

The UI is built as a polished product demo with animated sections, a compact branded
loading screen, responsive layouts, and a lightweight simulated service flow.

## Highlights

- Premium responsive landing page for hotel and restaurant operations
- Pre-order and prepay dining concept explained through guided sections
- Interactive menu demo with add-to-cart behavior
- Simulated arrival alert flow with audio feedback
- Floating cart summary and dashboard-style revenue breakdown
- Framer Motion transitions and Tailwind CSS v4 styling
- Mobile, tablet, and desktop-focused presentation

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 4
- Framer Motion
- Cloudinary-hosted branding assets

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Create a production build

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Project Structure

```text
src/
  assets/                Static images
  components/
    sections/            Landing page sections
    ui/                  Shared UI building blocks
    FloatingCart.jsx     Sticky cart summary
    Navbar.jsx           Top navigation
    PageBackdrop.jsx     Global background effects
    StartupLoader.jsx    Initial branded loading screen
  data/
    siteContent.js       Main marketing/demo content
  utils/
    audio.js             Small audio helpers
    formatting.js        Formatting helpers
    motion.js            Motion helper values
  App.jsx                Main page composition
  index.css              Global styles and theme tokens
```

## Main Experience

The page is structured as a product story:

- `HeroSection` introduces the zero-wait dining concept
- `PlatformSection` explains the product value
- `MenuSection` simulates guest ordering
- `DashboardSection` shows payouts, taxes, and arrival alerts
- `JourneySection` explains the business flow step-by-step
- `InsightsSection` highlights analytics and operational benefits
- `DeviceSection` reinforces responsive readiness across screens

## Where To Edit

- Update business copy and demo data in `src/data/siteContent.js`
- Update the page flow in `src/App.jsx`
- Update branding or loader behavior in `src/components/StartupLoader.jsx`
- Update shared look and feel in `src/index.css`
- Update icons and manifest files in `public/`

## Notes

- This project currently uses static demo data and client-side interactions only.
- There is no backend, authentication, or live GPS integration in this version.
- The cart and alert system are presentation/demo features for the concept.

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` builds the app for production
- `npm run preview` previews the production build locally
- `npm run start` is an alias for the Vite dev server

## Future Improvements

- Connect real booking and payment APIs
- Replace mock arrival logic with live geolocation events
- Add admin authentication and hotel-level dashboards
- Store menu/catalog data in a CMS or backend service
- Add test coverage for interactive flows
