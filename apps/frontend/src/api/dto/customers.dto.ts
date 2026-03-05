export type CustomerStage = "lead" | "in_work" | "proposal" | "won" | "lost";

export type CustomerDto = {
  id: string;
  name: string;
  segment: string | null;
  stage: CustomerStage;
  ownerName: string;
  lastInteractionAt: string | null;
  nextActionDueAt: string | null;
};