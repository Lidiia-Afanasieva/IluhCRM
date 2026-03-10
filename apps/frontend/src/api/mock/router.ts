import dayjs from "dayjs";
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

function readStr(x: unknown): string | undefined {
  if (x === undefined || x === null) return undefined;
  const s = String(x).trim();
  return s.length ? s : undefined;
}

function readBool(x: unknown): boolean | undefined {
  if (x === undefined || x === null) return undefined;
  if (x === true || x === "true" || x === 1 || x === "1") return true;
  if (x === false || x === "false" || x === 0 || x === "0") return false;
  return undefined;
}

function defaultPeriod() {
  const to = dayjs().format("YYYY-MM-DD");
  const from = dayjs().subtract(6, "day").format("YYYY-MM-DD");
  return { from, to };
}

function inDateRange(iso: string, from: string, to: string): boolean {
  const d = dayjs(iso);
  const f = dayjs(from, "YYYY-MM-DD").startOf("day");
  const t = dayjs(to, "YYYY-MM-DD").endOf("day");
  return (d.isAfter(f) || d.isSame(f)) && (d.isBefore(t) || d.isSame(t));
}

function buildTaskListItem(task: {
  id: string;
  customerId: string;
  title: string;
  status: "open" | "done" | "canceled";
  dueAt: string;
  priority: number;
  assignedTo: string;
}) {
  const now = dayjs();
  const due = dayjs(task.dueAt);
  const isOverdue = task.status === "open" && due.isBefore(now);
  const daysOverdue = isOverdue ? Math.max(0, Math.floor(now.diff(due, "day", true))) : 0;

  const customerName = db.customers.find((c) => c.id === task.customerId)?.name ?? task.customerId;

  return {
    id: task.id,
    customerId: task.customerId,
    customerName,
    title: task.title,
    status: task.status,
    dueAt: task.dueAt,
    priority: task.priority,
    assignedTo: task.assignedTo,
    isOverdue,
    daysOverdue,
  };
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
      const q = (readStr(req.query?.q)?.toLowerCase() ?? "").trim();
      const stage = readStr(req.query?.stage);

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
    return requireAuth(req, () =>
      ok(
        (db.quality[customerId] ?? {
          firstResponseSecondsAvg: 0,
          overdueTasksCount: 0,
          interactionsCount: 0,
          npsScore: null,
        }) as any
      )
    );
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
    return requireAuth(req, () =>
      ok(
        (db.personalization[customerId] ?? {
          segment: null,
          recommendedTemplate: null,
          nextBestAction: null,
          reason: null,
        }) as any
      )
    );
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

  if (
    customerId &&
    req.path === `/customers/${customerId}/personalization/next-action` &&
    req.method === "POST"
  ) {
    return requireAuth(req, () => {
      const body = req.body as any;
      const current = db.personalization[customerId] ?? {
        segment: null,
        recommendedTemplate: null,
        nextBestAction: null,
        reason: null,
      };
      const updated = { ...current, nextBestAction: String(body.nextBestAction || "") };
      db.personalization[customerId] = updated;

      const cust = db.customers.find((x) => x.id === customerId);
      if (cust) cust.nextActionDueAt = String(body.nextActionDueAt || null);

      return ok(updated as any);
    });
  }

  if (req.path === "/tasks" && req.method === "GET") {
    return requireAuth(req, () => {
      const status = readStr(req.query?.status) as any;
      const overdue = readBool(req.query?.overdue);
      const customerIdQ = readStr(req.query?.customerId);
      const assignedUserId = readStr(req.query?.assignedUserId);
      const fromQ = readStr(req.query?.from);
      const toQ = readStr(req.query?.to);

      const now = dayjs();

      let rows = [...db.tasks];

      if (status) rows = rows.filter((x) => x.status === status);
      if (customerIdQ) rows = rows.filter((x) => x.customerId === customerIdQ);
      if (assignedUserId) rows = rows.filter(() => db.me.id === assignedUserId);

      if (fromQ && toQ) {
        rows = rows.filter((x) => inDateRange(x.dueAt, fromQ, toQ));
      }

      if (overdue === true) {
        rows = rows.filter((x) => x.status === "open" && dayjs(x.dueAt).isBefore(now));
      }
      if (overdue === false) {
        rows = rows.filter((x) => !(x.status === "open" && dayjs(x.dueAt).isBefore(now)));
      }

      const list = rows.map(buildTaskListItem);

      list.sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
        if (a.dueAt !== b.dueAt) return a.dueAt < b.dueAt ? -1 : 1;
        return b.priority - a.priority;
      });

      return ok(list as any);
    });
  }

  if (req.path === "/tasks" && req.method === "POST") {
    return requireAuth(req, () => {
      const body = req.body as any;

      const created = {
        id: `t${db.tasks.length + 1}`,
        customerId: String(body.customerId),
        title: String(body.title),
        status: body.status ?? "open",
        dueAt: String(body.dueAt),
        priority: Number(body.priority ?? 3),
        assignedTo: String(body.assignedTo ?? db.me.fullName),
      };

      db.tasks.push(created);

      const cust = db.customers.find((x) => x.id === created.customerId);
      if (cust) cust.nextActionDueAt = created.dueAt;

      return ok(buildTaskListItem(created) as any);
    });
  }

  const taskId = parseId(req.path, "/tasks/");
  if (taskId && req.method === "PATCH" && req.path === `/tasks/${taskId}`) {
    return requireAuth(req, () => {
      const body = req.body as any;
      const idx = db.tasks.findIndex((t) => t.id === taskId);
      if (idx < 0) return { status: 404, data: ({} as any) };

      const current = db.tasks[idx];
      const next = {
        ...current,
        status: body.status ?? current.status,
        dueAt: body.dueAt ?? current.dueAt,
        priority: body.priority ?? current.priority,
      };

      db.tasks[idx] = next;

      const cust = db.customers.find((x) => x.id === next.customerId);
      if (cust && next.status === "open") {
        cust.nextActionDueAt = next.dueAt;
      }

      return ok(buildTaskListItem(next) as any);
    });
  }

  if (req.path === "/metrics/quality" && req.method === "GET") {
    return requireAuth(req, () => {
      const ownerId = readStr(req.query?.ownerId);
      const stage = readStr(req.query?.stage);
      const fromQ = readStr(req.query?.from);
      const toQ = readStr(req.query?.to);

      const period = fromQ && toQ ? { from: fromQ, to: toQ } : defaultPeriod();
      const now = dayjs();

      let customers = [...db.customers];
      if (stage) customers = customers.filter((c) => c.stage === stage);
      if (ownerId) customers = customers.filter(() => db.me.id === ownerId);

      const customerIdSet = new Set(customers.map((c) => c.id));
      const customerNameById = new Map(customers.map((c) => [c.id, c.name] as const));

      const interactions = db.interactions.filter(
        (x) => customerIdSet.has(x.customerId) && inDateRange(x.occurredAt, period.from, period.to)
      );

      const firstRespValues = customers
        .map((c) => db.quality[c.id]?.firstResponseSecondsAvg ?? 0)
        .filter((v) => Number.isFinite(v) && v > 0);

      const firstResponseSecondsAvg =
        firstRespValues.length > 0
          ? Math.round(firstRespValues.reduce((a, b) => a + b, 0) / firstRespValues.length)
          : 0;

      const npsValues = customers
        .map((c) => db.quality[c.id]?.npsScore ?? null)
        .filter((v): v is number => v !== null && Number.isFinite(v));

      const npsAvg =
        npsValues.length > 0
          ? Math.round((npsValues.reduce((a, b) => a + b, 0) / npsValues.length) * 10) / 10
          : null;

      const overdueRows = db.tasks
        .filter((t) => customerIdSet.has(t.customerId))
        .filter((t) => t.status === "open" && dayjs(t.dueAt).isBefore(now))
        .map((t) => {
          const due = dayjs(t.dueAt);
          const daysOverdue = Math.max(0, Math.floor(now.diff(due, "day", true)));
          return {
            id: t.id,
            customerId: t.customerId,
            customerName: customerNameById.get(t.customerId) ?? t.customerId,
            title: t.title,
            status: t.status,
            dueAt: t.dueAt,
            priority: t.priority,
            assignedTo: t.assignedTo,
            daysOverdue,
          };
        })
        .sort((a, b) =>
          a.daysOverdue === b.daysOverdue ? b.priority - a.priority : b.daysOverdue - a.daysOverdue
        );

      return ok({
        period: { from: period.from, to: period.to },
        sla: {
          firstResponseTargetSeconds: db.sla.firstResponseTargetSeconds,
          firstResponseActualAvgSeconds: firstResponseSecondsAvg,
          withinSlaPercent:
            firstRespValues.length > 0
              ? Math.round(
                  (firstRespValues.filter((v) => v <= db.sla.firstResponseTargetSeconds).length /
                    firstRespValues.length) *
                    100
                )
              : 0,
        },
        kpi: {
          firstResponseSecondsAvg,
          overdueTasksCount: overdueRows.length,
          interactionsCount: interactions.length,
          npsAvg,
        },
        overdueTasks: overdueRows,
      } as any);
    });
  }

  return { status: 404, data: ({} as any) };
}