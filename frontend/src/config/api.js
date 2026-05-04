/**
 * API base URL for fetch calls.
 * - Development (Vite): defaults to http://localhost:3000
 * - Production build: empty string = same origin when the Express app serves `frontend/dist`
 * - Or set VITE_API_URL to your API origin (e.g. https://api.example.com) when frontend and API are on different hosts.
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw.replace(/\/+$/, "");
  }
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }
  return "";
}
