import { useQuery } from "@tanstack/react-query";
import { customersService, type CustomersQuery } from "../services/customers.service";
import { queryKeys } from "../queryKeys";

export function useCustomers(params: CustomersQuery) {
  return useQuery({
    queryKey: queryKeys.customers(params),
    queryFn: () => customersService.list(params),
  });
}