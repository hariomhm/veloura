import config from "../config";

const getCookie = (name) => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : "";
};

export const getCsrfToken = () => getCookie("csrf_token");

export const apiRequest = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${config.apiBaseUrl}${path}`;
  const method = options.method || "GET";
  const headers = new Headers(options.headers || {});

  const isFormData = options.body instanceof FormData;
  const isJsonBody = options.body && !isFormData && typeof options.body !== "string";
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    body: isJsonBody ? JSON.stringify(options.body) : options.body,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let message = response.statusText || "Request failed";
    if (isJson) {
      const error = await response.json().catch(() => null);
      if (error?.message) message = error.message;
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return isJson ? response.json() : response.text();
};
