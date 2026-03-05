import type { MockDb } from "./types";

const nowIso = () => new Date().toISOString();

export const db: MockDb = {
  me: {
    id: "u1",
    email: "manager@f5.local",
    fullName: "Менеджер Ф5",
    role: "manager",
  },
  token: "mock-token",

  customers: [
    {
      id: "c1",
      name: "ООО СеверСтрой",
      segment: "B2B",
      stage: "in_work",
      ownerName: "Менеджер Ф5",
      lastInteractionAt: nowIso(),
      nextActionDueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "c2",
      name: "ИП Кузнецов",
      segment: "SMB",
      stage: "lead",
      ownerName: "Менеджер Ф5",
      lastInteractionAt: null,
      nextActionDueAt: null,
    },
    {
      id: "c3",
      name: "АО Интеграл",
      segment: "Enterprise",
      stage: "proposal",
      ownerName: "Менеджер Ф5",
      lastInteractionAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      nextActionDueAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    },
  ],

  interactions: [
    {
      id: "i1",
      customerId: "c1",
      kind: "call",
      occurredAt: nowIso(),
      summary: "Созвон по уточнению требований. Зафиксирован следующий шаг.",
      createdBy: "Менеджер Ф5",
    },
    {
      id: "i2",
      customerId: "c3",
      kind: "email",
      occurredAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      summary: "Отправлено КП. Ожидается обратная связь.",
      createdBy: "Менеджер Ф5",
    },
  ],

  quality: {
    c1: { firstResponseSecondsAvg: 5400, overdueTasksCount: 1, interactionsCount: 4, npsScore: 8 },
    c2: { firstResponseSecondsAvg: 0, overdueTasksCount: 0, interactionsCount: 0, npsScore: null },
    c3: { firstResponseSecondsAvg: 7200, overdueTasksCount: 0, interactionsCount: 2, npsScore: 9 },
  },

  personalization: {
    c1: {
      segment: "B2B",
      recommendedTemplate: "Скрипт уточнения требований",
      nextBestAction: "Подготовить список вопросов и назначить встречу",
      reason: "Стадия in_work и недавний контакт",
    },
    c2: {
      segment: "SMB",
      recommendedTemplate: "Первичное касание лид",
      nextBestAction: "Позвонить и квалифицировать потребность",
      reason: "Нет взаимодействий, стадия lead",
    },
    c3: {
      segment: "Enterprise",
      recommendedTemplate: "Дожим после КП",
      nextBestAction: "Напомнить о КП и предложить демо",
      reason: "Стадия proposal, контакт 2-3 дня назад",
    },
  },
};