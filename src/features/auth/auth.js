// src/features/auth/auth.js
export const AUTH_KEY = "auth";

export function setAuth(data) {
  try {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
    // optional convenience
    sessionStorage.setItem("role", data?.role ?? "");
  } catch (err) {
    console.error("Failed to write auth to sessionStorage", err);
  }
}

export function getAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse auth from sessionStorage", err);
    return null;
  }
}

export function clearAuth() {
  try {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem("role");
  } catch (err) {
    console.error("Failed to clear auth from sessionStorage", err);
  }
}
