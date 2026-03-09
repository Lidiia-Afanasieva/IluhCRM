export const queryKeys = {
  me: ["me"] as const,

  customers: (params: unknown) => ["customers", params] as const,
  customerById: (id: string) => ["customer", id] as const,

  interactions: (customerId: string) => ["interactions", customerId] as const,

  quality: (customerId: string) => ["quality", customerId] as const,
  personalization: (customerId: string) => ["personalization", customerId] as const,

  tasks: (params: unknown) => ["tasks", params] as const,
  qualityDashboard: (params: unknown) => ["metrics", "quality", params] as const,
};