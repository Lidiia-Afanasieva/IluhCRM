export type PersonalizationDto = {
  segment: string | null;
  recommendedTemplate: string | null;
  nextBestAction: string | null;
  reason: string | null;
};

export type AddNoteRequest = {
  text: string;
};

export type AddNextActionRequest = {
  nextActionDueAt: string;
  nextBestAction: string;
};