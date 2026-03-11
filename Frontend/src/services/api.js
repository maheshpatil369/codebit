export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const API = API_BASE_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

export const adminLogin = async (username, password) => {
  const res = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }
  return res.json(); // { access_token: "..." }
};

export const getDashboardData = async () => {
  const res = await fetch(`${API}/dashboard`, { headers: authHeaders() });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/admin-login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
};

async function getJson(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`Request failed for ${path} (${res.status})`);
  }
  return res.json();
}

export const getUserDashboard = async () => getJson("/api/user/dashboard");

export const getCompanyDashboard = async () => getJson("/api/company/dashboard");

export const getCompanyTeam = async () => getJson("/api/company/team");

export const getCompanyActivity = async () => getJson("/api/company/activity");
