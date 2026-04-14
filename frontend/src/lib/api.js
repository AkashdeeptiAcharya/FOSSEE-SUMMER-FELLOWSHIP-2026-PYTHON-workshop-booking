const API_ROOT = "/workshop/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const api = {
  getSession: () => request("/session/"),
  login: (payload) =>
    request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () =>
    request("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  register: (payload) =>
    request("/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getWorkshopTypes: () => request("/workshop-types/"),
  getDashboard: () => request("/workshops/"),
  getWorkshop: (id) => request(`/workshops/${id}/`),
  addComment: (id, payload) =>
    request(`/workshops/${id}/comments/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  acceptWorkshop: (id) =>
    request(`/workshops/${id}/accept/`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  changeWorkshopDate: (id, date) =>
    request(`/workshops/${id}/change-date/`, {
      method: "POST",
      body: JSON.stringify({ date }),
    }),
  proposeWorkshop: (payload) =>
    request("/propose/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getProfile: () => request("/profile/"),
  updateProfile: (payload) =>
    request("/profile/update/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getPublicStats: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    );
    return request(`/public-stats/${query.toString() ? `?${query.toString()}` : ""}`);
  },
};
