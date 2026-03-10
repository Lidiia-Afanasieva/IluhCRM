import { useMemo, useState } from "react";
import { Box, Button, Grid, Stack } from "@mui/material";
import type { CustomerDto } from "../../../api/dto/customers.dto";
import type { TaskListItemDto } from "../../../api/dto/tasksList.dto";
import { useTasks } from "../../../api/hooks/useTasks";
import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";
import { EmptyState } from "../../../components/common/EmptyState";
import { CreateTaskDialog } from "../../tasks/parts/CreateTaskDialog";
import { TaskEditorDialog } from "../../tasks/parts/TaskEditorDialog";
import { CustomerUpcomingTaskCard } from "./CustomerUpcomingTaskCard";
import { CustomerTasksTable } from "./CustomerTasksTable";

type Props = {
  customer: CustomerDto;
  allCustomers?: CustomerDto[];
};

export function CustomerTasksTab(props: Props) {
  const [openCreate, setOpenCreate] = useState(false);
  const [editTask, setEditTask] = useState<TaskListItemDto | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const query = useTasks({
    customerId: props.customer.id,
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const nextOpenTask = useMemo(() => {
    const openRows = rows.filter((x) => x.status === "open");
    if (openRows.length === 0) return null;

    return [...openRows].sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
      if (a.dueAt !== b.dueAt) return a.dueAt < b.dueAt ? -1 : 1;
      return b.priority - a.priority;
    })[0];
  }, [rows]);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Создать задачу
        </Button>
      </Stack>

      <CreateTaskDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        customers={props.allCustomers ?? [props.customer]}
        presetCustomerId={props.customer.id}
        presetCustomerName={props.customer.name}
      />

      <TaskEditorDialog
        open={openEdit}
        task={editTask}
        onClose={() => {
          setOpenEdit(false);
          setEditTask(null);
        }}
      />

      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? (
        <ErrorState title="Ошибка" description="Не удалось загрузить задачи клиента." />
      ) : null}

      {query.isSuccess && rows.length === 0 ? (
        <EmptyState title="Задач пока нет" description="Для этого клиента задачи ещё не созданы." />
      ) : null}

      {query.isSuccess && rows.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomerUpcomingTaskCard task={nextOpenTask} />
          </Grid>

          <Grid item xs={12}>
            <CustomerTasksTable
              rows={rows}
              onEdit={(row) => {
                setEditTask(row);
                setOpenEdit(true);
              }}
            />
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
}