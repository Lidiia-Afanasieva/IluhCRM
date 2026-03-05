import { httpRequest } from "../httpClient";
import type { CustomerDto } from "../dto/customers.dto";

export type CustomersQuery = {
  q?: string;
  stage?: string;
};

export const customersService = {
  async list(params: CustomersQuery): Promise<CustomerDto[]> {
    const res = await httpRequest<CustomerDto[]>({
      method: "GET",
      path: "/customers",
      query: params,
    });
    return res.data;
  },

  async byId(id: string): Promise<CustomerDto> {
    const res = await httpRequest<CustomerDto>({
      method: "GET",
      path: `/customers/${id}`,
    });
    return res.data;
  },
};