const API_BASE = "/api"; // Change if backend runs on a different domain

// Helper to always add JWT
function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Handle expired/invalid tokens globally
function handleAuthError(status) {
  if (status === 401 || status === 403) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-auth";
    return true;
  }
  return false;
}

// ===== GET =====
export async function apiGet(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (handleAuthError(res.status)) return null;
  return res.json();
}

// ===== POST (protected or public) =====
export async function apiPost(url, body, needsAuth = false) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(needsAuth ? getAuthHeaders() : {}),
    },
    body: JSON.stringify(body),
  });

  if (handleAuthError(res.status)) return null;
  return res.json();
}

// ===== PUT =====
export async function apiPut(url, body) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (handleAuthError(res.status)) return null;
  return res.json();
}

// ===== Admin Auth Shortcuts =====
export function adminRegister(data) {
  return apiPost("/admin/register", data); // public
}

export function adminVerifyOtp(data) {
  return apiPost("/admin/verify-otp", data); // public
}

export function adminLogin(data) {
  return apiPost("/admin/login", data); // public
}
