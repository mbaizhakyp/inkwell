// client/src/lib/auth.js
//
// Minimal token + current-user storage. The stored user is for display
// only — since Lecture 15 the server takes identity from the bearer token
// (requireAuth), never from anything the client sends.

const TOKEN_KEY = "inkwell_access_token";
const USER_KEY = "inkwell_user";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
