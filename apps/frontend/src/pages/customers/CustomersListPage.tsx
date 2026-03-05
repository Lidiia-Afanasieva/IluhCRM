import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import { PageHeader } from "../../components/common/PageHeader";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";

import { useCustomers } from "../../api/hooks/useCustomers";
import type { CustomerDto } from "../../api/dto/customers.dto";
import { CustomersFiltersBar, type CustomersFilters } from "./parts/CustomersFiltersBar";

export function CustomersListPage() {
  const nav = useNavigate();
  const [filters, setFilters] = useState<CustomersFilters>({ q: "", stage: "" });

  const query = useCustomers({ q: filters.q, stage: filters.stage });

  const columns: GridColDef<CustomerDto>[] = useMemo(() => {
    return [
      { field: "name", headerName: "Клиент", flex: 1, minWidth: 240 },
      { field: "segment", headerName: "Сегмент", width: 140 },
      { field: "stage", headerName: "Стадия", width: 140 },
      { field: "ownerName", headerName: "Ответственный", width: 180 },
      { field: "lastInteractionAt", headerName: "Последний контакт", width: 180 },
      { field: "nextActionDueAt", headerName: "Следующий шаг до", width: 180 },
    ];
  }, []);

  return (
    <>
      <PageHeader
        title="Клиенты"
        subtitle="Список клиентов с фильтрами. Переход в карточку клиента по клику на строку."
      />

      <CustomersFiltersBar value={filters} onChange={setFilters} />

      <Paper sx={{ height: 560 }}>
        {query.isLoading ? <LoadingState /> : null}
        {query.isError ? (
          <ErrorState title="Ошибка загрузки" description="Не удалось загрузить список клиентов." />
        ) : null}

        {query.isSuccess && query.data.length === 0 ? (
          <EmptyState title="Нет данных" description="По выбранным фильтрам клиентов не найдено." />
        ) : null}

        {query.isSuccess && query.data.length > 0 ? (
          <DataGrid
            rows={query.data}
            columns={columns}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
            onRowClick={(p) => nav(`/customers/${p.row.id}`)}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
          />
        ) : null}
      </Paper>
    </>
  );
}