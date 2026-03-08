export type QualityDashboardQuery = {
  from?: string; // ISO date: "2026-03-01"
  to?: string; // ISO date: "2026-03-06"
  ownerId?: string;
  stage?: string;
};

export type QualityDashboardDto = {
  period: {
    from: string; // ISO date
    to: string; // ISO date
  };

  sla: {
    firstResponseTargetSeconds: number;
    firstResponseActualAvgSeconds: number;
    withinSlaPercent: number; // 0..100
  };

  kpi: {
    firstResponseSecondsAvg: number;
    overdueTasksCount: number;
    interactionsCount: number;
    npsAvg: number | null;
  };

  overdueTasks: Array<{
    id: string;
    customerId: string;
    customerName: string;
    title: string;
    status: "open" | "done" | "canceled";
    dueAt: string; // ISO datetime
    priority: number;
    assignedTo: string;
    daysOverdue: number;
  }>;
};