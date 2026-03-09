import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";

import { PageHeader } from "../../components/common/PageHeader";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";

import { useTasks } from "../../api/hooks/useTasks";
import { useCustomers } from "../../api/hooks/useCustomers";
import type { TaskListItemDto } from "../../api/dto/tasksList.dto";

import { TasksFiltersBar, type TasksFiltersValue } from "./parts/TasksFiltersBar";
import { TasksTable } from "./parts/TasksTable";
import { TaskEditorDialog } from "./parts/TaskEditorDialog";
import { CreateTaskDialog } from "./parts/CreateTaskDialog";

function defaultFilters(): TasksFiltersValue {
  const to = dayjs().format("YYYY-MM-DD");
  const from = dayjs().subtract(14, "day").format("YYYY-MM-DD");
  return {
    period: { from, to },
    status: "",
    overdue: "",
  };
}

export function TasksPage() {
  const [filters, setFilters] = useState<TasksFiltersValue>(() => defaultFilters());

  const [edit, setEdit] = useState<TaskListItemDto | null>(null);
  const [openEditor, setOpenEditor] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const params = useMemo(() => {
    return {
      from: filters.period.from,
      to: filters.period.to,
      status: filters.status ? (filters.status as any) : undefined,
      overdue:
        filters.overdue === "true" ? true : filters.overdue === "false" ? false : undefined,
    };
  }, [filters]);

  const query = useTasks(params);
  const customersQuery = useCustomers({});

  const subtitle = useMemo(() => {
    const status = filters.status ? `Статус: ${filters.status}` : "Статус: все";
    const overdue =
      filters.overdue === "true"
        ? "Просрочка: только просроченные"
        : filters.overdue === "false"
          ? "Просрочка: только не просроченные"
          : "Просрочка: все";
    return `Период: ${filters.period.from} .. ${filters.period.to}. ${status}. ${overdue}.`;
  }, [filters]);

  return (
    <>
      <PageHeader title="Задачи" subtitle={subtitle} />

      <TasksFiltersBar value={filters} onChange={setFilters} />

      <Stack direction="row" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Создать задачу
        </Button>
      </Stack>

      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState title="Ошибка" description="Не удалось загрузить задачи." /> : null}

      {query.isSuccess && query.data.length === 0 ? (
        <EmptyState title="Нет задач" description="По выбранным фильтрам задачи не найдены." />
      ) : null}

      {query.isSuccess && query.data.length > 0 ? (
        <Box>
          <TasksTable
            rows={query.data}
            onEdit={(row) => {
              setEdit(row);
              setOpenEditor(true);
            }}
          />
        </Box>
      ) : null}

      <TaskEditorDialog
        open={openEditor}
        task={edit}
        onClose={() => {
          setOpenEditor(false);
          setEdit(null);
        }}
      />

      <CreateTaskDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        customers={customersQuery.data ?? []}
      />
    </>
  );
}