// utils/format.js
// Shared formatting and validation helpers.

export function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function isValidName(name) {
  return /^[a-zA-Z\s'-]{1,50}$/.test(name);
}

export function initials(first, last) {
  return `${(first || "?")[0]}${(last || "")[0]}`.toUpperCase();
}
