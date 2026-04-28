// API Configuration
// In development (npm start): hits the Spring Boot backend on localhost:8080
// In production (Docker): uses /api which is proxied by nginx to the backend container
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:8080/api';
