export type InteractionKind = "call" | "email" | "meeting" | "note";

export type InteractionDto = {
  id: string;
  customerId: string;
  kind: InteractionKind;
  occurredAt: string;
  summary: string;
  createdBy: string;
};

export type CreateInteractionRequest = {
  kind: InteractionKind;
  occurredAt: string;
  summary: string;
};