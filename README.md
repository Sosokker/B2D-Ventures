[![Build CI](https://github.com/Sosokker/B2D-Ventures/actions/workflows/build.yml/badge.svg)](https://github.com/Sosokker/B2D-Ventures/actions/workflows/build.yml)
[![Eslint CI](https://github.com/Sosokker/B2D-Ventures/actions/workflows/eslint.yml/badge.svg)](https://github.com/Sosokker/B2D-Ventures/actions/workflows/eslint.yml)
[![Playwright Tests](https://github.com/Sosokker/B2D-Ventures/actions/workflows/playwright.yml/badge.svg)](https://github.com/Sosokker/B2D-Ventures/actions/workflows/playwright.yml)
# B2D-Ventures

## About

B2D Ventures is a fund raising platform

## Installation

List of external services you need before initialize the project
- [Supabase](https://supabase.com/)
  - [Google OAuth2](https://developers.google.com/identity/protocols/oauth2) : Use with supabase authentication
- [Stripe](https://stripe.com/en-th)

1. Create .env to store environment variable
```bash
cp .env.example .env
// Add tokens to .env
```

2. Install dependecies and start server
```
npm install
npm run dev
```


## Project Structure

```
public/             Static assets
src/
├─ app/             Contains core application files, routing, and page components
│  ├─ api/          API route handlers
│  ├─ globals.css   Shadcn/ui theming
├─ components/ 	    Reusable UI components for building the interface
│  ├─ ui/           Shadcn/ui components
├─ lib/             Utility functions and service libraries
│  ├─ data/         Data-fetching logic or helper functions for handling data (Supabase queries)
│  ├─ stripe/ 	    Configuration code related to Stripe payment integration.
│  ├─ supabase/     Utilities for Supabase integration (database, authentication, etc.).
├─ types/ 	    Infers types from Supabase and includes interfaces
├─ middleware.ts    Custom middleware for processing each request
tests/ 	            Playwright tests for end-to-end testing of the application
```

## Contributor

1.  Nantawat Sukrisunt | [Nantawat6510545543](https://github.com/Nantawat6510545543)
2.  Naytitorn Chaovirachot  | [CondricNay](https://github.com/CondricNay)
3.  Sirin Puenggun | [sosokker](https://github.com/Sosokker)
4.  Pattadon Loyprasert | [GGWPXXXX](https://github.com/GGWPXXXX)
