import type { MeResponse } from "../dto/auth.dto";
import type { CustomerDto } from "../dto/customers.dto";
import type { InteractionDto } from "../dto/interactions.dto";
import type { QualityDto } from "../dto/quality.dto";
import type { PersonalizationDto } from "../dto/personalization.dto";

export type MockDb = {
  me: MeResponse;
  token: string;

  customers: CustomerDto[];
  interactions: InteractionDto[];
  quality: Record<string, QualityDto>;
  personalization: Record<string, PersonalizationDto>;
};