// utils/api.js
// Shared API config and auth helper — import this instead of
// redefining API/authHeaders in every component.

export const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}
