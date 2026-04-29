import { API_BASE_URL } from '../config';

const TOKEN_KEY = 'admin_jwt';
const USERNAME_KEY = 'admin_username';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    let message = `Login failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch (_) { /* keep default */ }
    throw new Error(message);
  }
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USERNAME_KEY, data.username);
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

/**
 * Check that the stored token is still valid by calling /api/auth/me.
 * Clears local storage if the server rejects it.
 */
export async function verifyToken() {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      logout();
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

export async function changePassword(currentPassword, newPassword) {
  const res = await authFetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    let message = `Password change failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch (_) { /* keep default */ }
    throw new Error(message);
  }
  return res.json();
}

/**
 * fetch() wrapper that auto-attaches the JWT and clears local auth on 401.
 * Use this for any call to the backend from authenticated admin pages.
 */
export async function authFetch(input, init = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
  return res;
}
