export type QualityDto = {
  firstResponseSecondsAvg: number;
  overdueTasksCount: number;
  interactionsCount: number;
  npsScore: number | null;
};

export type AddFeedbackRequest = {
  npsScore: number;
};