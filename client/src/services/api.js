// ============================================================
// api.js — Centralized API Service Layer
// ============================================================
// WHY AN API LAYER?
//   Every component that needs data imports from here —
//   never directly calls fetch() or axios themselves.
//   Benefits:
//   1. Base URL lives in ONE place. Production deployment = 1 edit.
//   2. Auth headers (future JWT) added in ONE interceptor.
//   3. Error normalization in ONE place.
//   4. Easy to mock in tests: just mock this module.
// ============================================================

import axios from "axios";

// --- Axios Instance ---
// All requests inherit this base URL and default headers.
// Vite's proxy (vite.config.js) forwards /api/* to the Express
// server during development, so this works without CORS issues.
const api = axios.create({
  baseURL: "/api",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
// Runs before every outgoing request. Perfect place to attach
// auth tokens when you add authentication later.
api.interceptors.request.use(
  (config) => {
    // TODO: const token = localStorage.getItem('token');
    // TODO: if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
// Normalizes errors across the app. Components only see
// clean error messages, never raw Axios error objects.
api.interceptors.response.use(
  (response) => response.data, // Unwrap .data so callers get the payload directly
  (error) => {
    const message =
      error.response?.data?.error ||  // Our API's error message
      error.message ||                 // Axios network error
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ── Grind Post Endpoints ──────────────────────────────────
export const grindAPI = {
  // Fetch the paginated timeline feed
  // Options: { page, limit, tag }
  getAll: (options = {}) => {
    const params = new URLSearchParams(options).toString();
    return api.get(`/grind?${params}`);
  },

  // Aggregate stats (total days, unique topics, current day)
  getStats: () => api.get("/grind/stats"),

  // Single post by day number
  getByDay: (dayNumber) => api.get(`/grind/${dayNumber}`),

  // Create a new grind post
  create: (postData) => api.post("/grind", postData),

  // Update an existing post
  update: (dayNumber, postData) => api.patch(`/grind/${dayNumber}`, postData),
};

// ── Project Endpoints ─────────────────────────────────────
export const projectsAPI = {
  // Fetch all published projects, optionally filtered by category
  getAll: (category) => {
    const params = category ? `?category=${category}` : "";
    return api.get(`/projects${params}`);
  },
};

// ── Contact Endpoint ──────────────────────────────────────
export const contactAPI = {
  // Send a contact form submission
  send: (formData) => api.post("/contact", formData),
};