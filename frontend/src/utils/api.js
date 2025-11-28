// utils/api.js

const DEV = process.env.NODE_ENV === "development";

export const API_BASE = DEV
  ? "http://localhost:5000"
  : "https://investment-site-x6tr.onrender.com";

// Simple wrapper for GET requests
export async function apiGet(path) {
  const res = await fetch(API_BASE + path, { cache: "no-store" });
  return res.json();
}

// Simple wrapper for POST requests
export async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

// Wrapper for file uploads (FormData)
export async function apiUpload(path, formData) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
