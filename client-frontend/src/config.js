// Centralised API configuration for the public site.
//
// Three modes:
//   1. Vite dev server (`npm start`)         -> http://localhost:8080
//   2. Production build, no env var (Docker) -> '' so requests go through nginx (`/api`, `/uploads`)
//   3. Production build, env var set (Netlify)
//      VITE_API_BASE_URL=https://api.acces-spre-succes.ro -> that origin

const fromEnv = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

let root;
if (fromEnv) {
  root = fromEnv;
} else if (import.meta.env.PROD) {
  root = '';
} else {
  root = 'http://localhost:8080';
}

export const BACKEND_URL = root;
export const API_BASE_URL = `${root}/api`;
export const STRIPE_SERVER_URL = `${root}/api/stripe`;
