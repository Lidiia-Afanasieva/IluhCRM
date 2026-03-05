import { useQuery } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";
import { queryKeys } from "../queryKeys";

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: queryKeys.customerById(id),
    queryFn: () => customersService.byId(id),
    enabled: Boolean(id),
  });
}