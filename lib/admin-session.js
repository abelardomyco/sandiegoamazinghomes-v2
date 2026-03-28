/**
 * Signed admin session cookie (HMAC-SHA256). Works in Node API routes and Edge middleware (Web Crypto).
 * Set ADMIN_SESSION_SECRET (long random) and ADMIN_DASHBOARD_PASSWORD in production.
 */

const COOKIE_NAME = "sdah_admin";
const enc = new TextEncoder();

async function importHmacKey(secret) {
  const raw = await crypto.subtle.digest("SHA-256", enc.encode(secret || "change-admin-session-secret"));
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function bytesToB64(buf) {
  const u8 = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
  return typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(u8).toString("base64");
}

function b64ToBytes(b64) {
  const bin = typeof atob !== "undefined" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/**
 * @param {string} secret
 * @returns {Promise<string>}
 */
async function createSignedAdminCookie(secret) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payloadJson = JSON.stringify({ exp });
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payloadJson));
  return `${bytesToB64(enc.encode(payloadJson))}.${bytesToB64(sig)}`;
}

/**
 * @param {string | undefined} value
 * @param {string} secret
 * @returns {Promise<boolean>}
 */
async function verifySignedAdminCookie(value, secret) {
  if (!value || typeof value !== "string" || !value.includes(".")) return false;
  const dot = value.indexOf(".");
  const pB64 = value.slice(0, dot);
  const sB64 = value.slice(dot + 1);
  try {
    const payloadJson = new TextDecoder().decode(b64ToBytes(pB64));
    const { exp } = JSON.parse(payloadJson);
    if (typeof exp !== "number" || Date.now() > exp) return false;
    const key = await importHmacKey(secret);
    const sig = b64ToBytes(sB64);
    return crypto.subtle.verify("HMAC", key, sig, enc.encode(payloadJson));
  } catch {
    return false;
  }
}

export { COOKIE_NAME, createSignedAdminCookie, verifySignedAdminCookie };
