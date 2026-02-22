# NYC Benefits Screener

A Next.js web app that helps New York City residents check their eligibility for Fair Fares NYC and 40+ other benefits programs. It walks users through a short screening questionnaire and returns personalized results powered by the [NYC Benefits Screening API](https://screeningapidocs.cityofnewyork.us).

## Features

- **Multi-step screening flow** — collects age, residency, transit benefits, SNAP/Cash Assistance status, and household income
- **NYC Benefits Screening API integration** — screens against 40+ city, state, and federal programs in real time
- **Local eligibility fallback** — if the API is unavailable, Fair Fares eligibility is determined using local logic (145% FPL thresholds)
- **Personalized results** — shows Fair Fares qualification status with enrollment instructions, plus a list of other programs the user may qualify for

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [TypeScript](https://www.typescriptlang.org) 5

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```
SCREENING_API_URL=https://sandbox.screeningapi.cityofnewyork.us
SCREENING_API_USERNAME=your_username
SCREENING_API_PASSWORD=your_password
```

You can request sandbox credentials from the [NYC Benefits Screening API docs](https://screeningapidocs.cityofnewyork.us/getting-started).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  page.tsx                 # Landing page
  screening/page.tsx       # Multi-step screening flow
  results/page.tsx         # Eligibility results display
  api/screen/route.ts      # Server-side API route (POST)
components/
  ProgressBar.tsx          # Step progress indicator
  StepAge.tsx              # Age input step
  StepResidency.tsx        # Borough selection step
  StepTransitBenefits.tsx  # Existing transit benefits step
  StepSnapCash.tsx         # SNAP/Cash Assistance step
  StepIncome.tsx           # Household size & income step
lib/
  types.ts                 # Shared TypeScript types
  eligibility.ts           # Local Fair Fares eligibility logic (fallback)
  screening-api.ts         # NYC Benefits Screening API client
```

## How It Works

1. The user completes the screening questionnaire in `app/screening/page.tsx`
2. On the final step, the client POSTs to `/api/screen` with the user's data
3. The server-side route authenticates with the NYC Screening API, submits the household data, and returns eligible programs
4. The results page displays Fair Fares eligibility (with enrollment links) and lists any additional programs the user may qualify for
5. If the API call fails, the app falls back to local eligibility logic so the user always gets a result
