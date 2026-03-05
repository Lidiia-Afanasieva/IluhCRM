import { getToken } from "../lib/auth/tokenStorage";
import { mockRouter } from "./mock/router";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type HttpRequest = {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
};

export type HttpResponse<T> = {
  status: number;
  data: T;
};

function buildQuery(query?: HttpRequest["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

function apiMode(): "mock" | "real" {
  const mode = (import.meta as any).env?.VITE_API_MODE;
  return mode === "real" ? "real" : "mock";
}

export async function httpRequest<T>(req: HttpRequest): Promise<HttpResponse<T>> {
  const token = getToken();
  const mode = apiMode();

  if (mode === "mock") {
    return mockRouter<T>({
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      token,
    });
  }

  const url = `/api${req.path}${buildQuery(req.query)}`;
  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: req.body ? JSON.stringify(req.body) : undefined,
  });

  const data = (await res.json()) as T;
  return { status: res.status, data };
}