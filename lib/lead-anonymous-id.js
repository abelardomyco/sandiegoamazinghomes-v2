/**
 * Anonymous ID for lead events (save home, save search) when user is not logged in.
 * Persists in sessionStorage so it survives refresh in same tab. No PII.
 */
const STORAGE_KEY = "sdah_anon_id";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "anon_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 11);
}

export function getAnonymousId() {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateId();
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return generateId();
  }
}
