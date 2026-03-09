import type { MockDb } from "./types";

const nowIso = () => new Date().toISOString();
const isoPlusDays = (days: number) => new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();

export const db: MockDb = {
  me: {
    id: "u1",
    email: "manager@f5.local",
    fullName: "Менеджер Ф5",
    role: "manager",
  },
  token: "mock-token",

  sla: {
    firstResponseTargetSeconds: 7200,
  },

  customers: [
    {
      id: "c1",
      name: "ООО СеверСтрой",
      segment: "B2B",
      stage: "in_work",
      ownerName: "Менеджер Ф5",
      lastInteractionAt: nowIso(),
      nextActionDueAt: isoPlusDays(1),
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
      lastInteractionAt: isoPlusDays(-3),
      nextActionDueAt: isoPlusDays(2),
    },
    {
      id: "c4",
      name: "ООО ЛайтСофт",
      segment: "SMB",
      stage: "in_work",
      ownerName: "Менеджер Ф5",
      lastInteractionAt: isoPlusDays(-1),
      nextActionDueAt: isoPlusDays(-1),
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
      occurredAt: isoPlusDays(-2),
      summary: "Отправлено КП. Ожидается обратная связь.",
      createdBy: "Менеджер Ф5",
    },
    {
      id: "i3",
      customerId: "c4",
      kind: "meeting",
      occurredAt: isoPlusDays(-1),
      summary: "Встреча. Подтверждены ключевые боли, согласован черновик плана работ.",
      createdBy: "Менеджер Ф5",
    },
  ],

  tasks: [
    {
      id: "t1",
      customerId: "c1",
      title: "Отправить резюме встречи и список вопросов",
      status: "open",
      dueAt: isoPlusDays(-2),
      priority: 3,
      assignedTo: "Менеджер Ф5",
    },
    {
      id: "t2",
      customerId: "c1",
      title: "Назначить демо",
      status: "open",
      dueAt: isoPlusDays(1),
      priority: 2,
      assignedTo: "Менеджер Ф5",
    },
    {
      id: "t3",
      customerId: "c2",
      title: "Первичное касание и квалификация",
      status: "open",
      dueAt: isoPlusDays(-1),
      priority: 4,
      assignedTo: "Менеджер Ф5",
    },
    {
      id: "t4",
      customerId: "c3",
      title: "Напоминание по КП",
      status: "open",
      dueAt: isoPlusDays(-5),
      priority: 5,
      assignedTo: "Менеджер Ф5",
    },
    {
      id: "t5",
      customerId: "c3",
      title: "Подготовить демо-сценарий",
      status: "done",
      dueAt: isoPlusDays(-1),
      priority: 2,
      assignedTo: "Менеджер Ф5",
    },
    {
      id: "t6",
      customerId: "c4",
      title: "Согласовать следующий шаг с ЛПР",
      status: "open",
      dueAt: isoPlusDays(-1),
      priority: 4,
      assignedTo: "Менеджер Ф5",
    },
  ],

  quality: {
    c1: { firstResponseSecondsAvg: 5400, overdueTasksCount: 1, interactionsCount: 4, npsScore: 8 },
    c2: { firstResponseSecondsAvg: 0, overdueTasksCount: 0, interactionsCount: 0, npsScore: null },
    c3: { firstResponseSecondsAvg: 9000, overdueTasksCount: 0, interactionsCount: 2, npsScore: 9 },
    c4: { firstResponseSecondsAvg: 3600, overdueTasksCount: 2, interactionsCount: 3, npsScore: 7 },
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
    c4: {
      segment: "SMB",
      recommendedTemplate: "Скрипт работы с возражениями",
      nextBestAction: "Уточнить сроки и критерии принятия решения",
      reason: "Есть просрочка по следующему шагу",
    },
  },
};