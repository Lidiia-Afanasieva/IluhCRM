import { Paper, Typography } from "@mui/material";
import { PageHeader } from "../../components/common/PageHeader";

export function TasksPage() {
  return (
    <>
      <PageHeader
        title="Задачи"
        subtitle="Далее появятся задачи follow-up, статусы, сроки и приоритеты"
      />
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Заглушка страницы. Следующий шаг: таблица задач с фильтрами и сменой статуса.
        </Typography>
      </Paper>
    </>
  );
}