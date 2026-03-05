import type { HttpResponse } from "../httpClient";
import { db } from "./db";

type MockReq = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  token: string | null;
};

function unauthorized<T>(): HttpResponse<T> {
  return { status: 401, data: ({} as T) };
}

function ok<T>(data: T): HttpResponse<T> {
  return { status: 200, data };
}

function parseId(path: string, prefix: string): string | null {
  if (!path.startsWith(prefix)) return null;
  const rest = path.slice(prefix.length);
  const parts = rest.split("/").filter(Boolean);
  return parts.length > 0 ? parts[0] : null;
}

function requireAuth<T>(req: MockReq, handler: () => HttpResponse<T>): HttpResponse<T> {
  if (!req.token) return unauthorized<T>();
  if (req.token !== db.token) return unauthorized<T>();
  return handler();
}

export async function mockRouter<T>(req: MockReq): Promise<HttpResponse<T>> {
  await new Promise((r) => setTimeout(r, 120));

  if (req.path === "/auth/login" && req.method === "POST") {
    return ok({ token: db.token } as any);
  }

  if (req.path === "/auth/me" && req.method === "GET") {
    return requireAuth(req, () => ok(db.me as any));
  }

  if (req.path === "/customers" && req.method === "GET") {
    return requireAuth(req, () => {
      const q = String(req.query?.q ?? "").toLowerCase().trim();
      const stage = String(req.query?.stage ?? "").trim();

      let rows = [...db.customers];
      if (q) rows = rows.filter((x) => x.name.toLowerCase().includes(q));
      if (stage) rows = rows.filter((x) => x.stage === stage);

      return ok(rows as any);
    });
  }

  const customerId = parseId(req.path, "/customers/");
  if (customerId && req.method === "GET" && req.path === `/customers/${customerId}`) {
    return requireAuth(req, () => {
      const item = db.customers.find((x) => x.id === customerId);
      if (!item) return { status: 404, data: ({} as any) };
      return ok(item as any);
    });
  }

  if (customerId && req.path === `/customers/${customerId}/interactions` && req.method === "GET") {
    return requireAuth(req, () => {
      const items = db.interactions
        .filter((x) => x.customerId === customerId)
        .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));
      return ok(items as any);
    });
  }

  if (customerId && req.path === `/customers/${customerId}/interactions` && req.method === "POST") {
    return requireAuth(req, () => {
      const body = req.body as any;
      const id = `i${db.interactions.length + 1}`;
      const created = {
        id,
        customerId,
        kind: body.kind,
        occurredAt: body.occurredAt,
        summary: body.summary,
        createdBy: db.me.fullName,
      };
      db.interactions.push(created);

      const cust = db.customers.find((x) => x.id === customerId);
      if (cust) cust.lastInteractionAt = created.occurredAt;

      return ok(created as any);
    });
  }

  if (customerId && req.path === `/customers/${customerId}/quality` && req.method === "GET") {
    return requireAuth(req, () => ok((db.quality[customerId] ?? {
      firstResponseSecondsAvg: 0,
      overdueTasksCount: 0,
      interactionsCount: 0,
      npsScore: null,
    }) as any));
  }

  if (customerId && req.path === `/customers/${customerId}/quality/feedback` && req.method === "POST") {
    return requireAuth(req, () => {
      const body = req.body as any;
      const current = db.quality[customerId] ?? {
        firstResponseSecondsAvg: 0,
        overdueTasksCount: 0,
        interactionsCount: 0,
        npsScore: null,
      };
      const updated = { ...current, npsScore: Number(body.npsScore) };
      db.quality[customerId] = updated;
      return ok(updated as any);
    });
  }

  if (customerId && req.path === `/customers/${customerId}/personalization` && req.method === "GET") {
    return requireAuth(req, () => ok((db.personalization[customerId] ?? {
      segment: null,
      recommendedTemplate: null,
      nextBestAction: null,
      reason: null,
    }) as any));
  }

  if (customerId && req.path === `/customers/${customerId}/personalization/note` && req.method === "POST") {
    return requireAuth(req, () => {
      const body = req.body as any;
      const current = db.personalization[customerId] ?? {
        segment: null,
        recommendedTemplate: null,
        nextBestAction: null,
        reason: null,
      };
      const updated = { ...current, reason: String(body.text || "") };
      db.personalization[customerId] = updated;
      return ok(updated as any);
    });
  }

  if (customerId && req.path === `/customers/${customerId}/personalization/next-action` && req.method === "POST") {
    return requireAuth(req, () => {
      const body = req.body as any;
      const current = db.personalization[customerId] ?? {
        segment: null,
        recommendedTemplate: null,
        nextBestAction: null,
        reason: null,
      };
      const updated = {
        ...current,
        nextBestAction: String(body.nextBestAction || ""),
      };
      db.personalization[customerId] = updated;

      const cust = db.customers.find((x) => x.id === customerId);
      if (cust) cust.nextActionDueAt = String(body.nextActionDueAt || null);

      return ok(updated as any);
    });
  }

  return { status: 404, data: ({} as any) };
}