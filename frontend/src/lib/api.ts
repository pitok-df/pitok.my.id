// Central API client — cookie-based auth (httpOnly `session` dari Buntok)
// Semua fetch pakai `credentials: "include"` agar cookie terkirim.
// Base URL dari env: NEXT_PUBLIC_BACKEND_URL untuk client, BACKEND_URL untuk server (SSR).

const getBaseUrl = () => {
  // Client
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  }
  // Server (SSR / Server Components)
  return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
};

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

async function request<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const { params, headers, ...init } = options;

  let finalUrl = url;
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
          return acc;
        },
        {} as Record<string, string>,
      ),
    ).toString();
    if (qs) finalUrl += `?${qs}`;
  }

  const res = await fetch(finalUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    credentials: "include", // kirim cookie `session`
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? text;
    } catch {
      // text bukan JSON
    }
    throw new Error(message || `Request failed ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null as T;

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json = await res.json();
    // Buntok envelope: { success, data } atau data langsung
    if (
      json &&
      typeof json === "object" &&
      "data" in json &&
      "success" in json
    ) {
      return json.data as T;
    }
    return json as T;
  }
  return (await res.text()) as unknown as T;
}

// Raw FormData upload (multipart) — tetap kirim cookie
async function uploadRequest<T>(path: string, formData: FormData): Promise<T> {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
    // jangan set Content-Type — browser set boundary otomatis
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? text;
    } catch {}
    throw new Error(message || `Upload failed ${res.status}`);
  }
  const json = await res.json();
  if (json && typeof json === "object" && "data" in json) return json.data as T;
  return json as T;
}

export const api = {
  // Auth — cookie httpOnly `session` diset via Set-Cookie header
  auth: {
    login: (body: { email: string; password: string }) =>
      request<{ token?: string }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    logout: () => request("/api/v1/auth/logout", { method: "POST" }),
    me: () => request("/api/v1/auth/me"),
  },

  // Singleton resources
  hero: {
    get: () =>
      request<import("@/data/db").ContentData["hero"] & { id: string }>(
        "/api/v1/hero",
      ),
    update: (body: unknown) =>
      request("/api/v1/hero", { method: "PUT", body: JSON.stringify(body) }),
  },
  about: {
    get: () =>
      request<{ bio: string; facts: { value: string; label: string }[] }>(
        "/api/v1/about",
      ),
    update: (body: unknown) =>
      request("/api/v1/about", { method: "PUT", body: JSON.stringify(body) }),
  },
  profile: {
    get: () => request("/api/v1/profile"),
    update: (body: unknown) =>
      request("/api/v1/profile", { method: "PUT", body: JSON.stringify(body) }),
  },
  contact: {
    get: () => request("/api/v1/contact"),
    update: (body: unknown) =>
      request("/api/v1/contact", { method: "PUT", body: JSON.stringify(body) }),
  },
  siteMeta: {
    get: () => request("/api/v1/site-meta"),
    update: (body: unknown) =>
      request("/api/v1/site-meta", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
  workspace: {
    get: () => request("/api/v1/workspace-setup"),
    update: (body: unknown) =>
      request("/api/v1/workspace-setup", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },

  // Collections
  experiences: {
    list: () => request("/api/v1/experiences"),
    create: (body: unknown) =>
      request("/api/v1/experiences", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: unknown) =>
      request(`/api/v1/experiences/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/api/v1/experiences/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request("/api/v1/experiences/reorder", {
        method: "PUT",
        body: JSON.stringify({ orderedIds }),
      }),
  },
  educations: {
    list: () => request("/api/v1/educations"),
    create: (body: unknown) =>
      request("/api/v1/educations", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: unknown) =>
      request(`/api/v1/educations/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/api/v1/educations/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request("/api/v1/educations/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
  },
  services: {
    list: () => request("/api/v1/services"),
    create: (body: unknown) =>
      request("/api/v1/services", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: unknown) =>
      request(`/api/v1/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/api/v1/services/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request("/api/v1/services/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
  },
  skills: {
    list: () => request("/api/v1/skills"),
    create: (body: unknown) =>
      request("/api/v1/skills", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request(`/api/v1/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/api/v1/skills/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request("/api/v1/skills/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
  },
  projects: {
    list: () => request("/api/v1/projects"),
    create: (body: unknown) =>
      request("/api/v1/projects", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: unknown) =>
      request(`/api/v1/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/api/v1/projects/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request("/api/v1/projects/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
  },
  gallery: {
    list: () => request("/api/v1/gallery"),
    create: (body: unknown) =>
      request("/api/v1/gallery", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: unknown) =>
      request(`/api/v1/gallery/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/api/v1/gallery/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request("/api/v1/gallery/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
  },
  certificates: {
    list: () => request("/api/v1/certificates"),
    create: (body: unknown) =>
      request("/api/v1/certificates", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: unknown) =>
      request(`/api/v1/certificates/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/api/v1/certificates/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request("/api/v1/certificates/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
  },

  // Guestbook / Topics (public)
  topics: {
    list: () => request("/api/v1/topics"),
    create: (body: { title: string; description: string; creator: string }) =>
      request("/api/v1/topics", { method: "POST", body: JSON.stringify(body) }),
    reply: (
      topicId: string,
      body: { name: string; message: string; replyTo?: string | null },
    ) =>
      request(`/api/v1/topics/${topicId}/replies`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  messages: {
    list: () => request("/api/v1/messages"),
    create: (body: { name: string; message: string }) =>
      request("/api/v1/messages", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  // Upload — multipart, field: gallery | project | certificate — max 5MB, verifyMagicBytes
  upload: {
    gallery: (file: File) => {
      const fd = new FormData();
      fd.append("gallery", file);
      return uploadRequest<{
        files: { url: string; name: string; ext: string }[];
      }>("/api/v1/upload", fd);
    },
    project: (file: File) => {
      const fd = new FormData();
      fd.append("project", file);
      return uploadRequest<{
        files: { url: string; name: string; ext: string }[];
      }>("/api/v1/upload", fd);
    },
    certificate: (file: File) => {
      const fd = new FormData();
      fd.append("certificate", file);
      return uploadRequest<{
        files: { url: string; name: string; ext: string }[];
      }>("/api/v1/upload", fd);
    },
    raw: (formData: FormData) => uploadRequest("/api/v1/upload", formData),
  },
};

export type Api = typeof api;
