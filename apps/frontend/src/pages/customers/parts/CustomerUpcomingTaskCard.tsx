import dayjs from "dayjs";
import { Paper, Stack, Typography } from "@mui/material";
import type { TaskListItemDto } from "../../../api/dto/tasksList.dto";
import { TaskStatusChip } from "../../../components/common/TaskStatusChip";

type Props = {
  task: TaskListItemDto | null;
};

function fmt(dtIso: string) {
  return dayjs(dtIso).format("YYYY-MM-DD HH:mm");
}

export function CustomerUpcomingTaskCard(props: Props) {
  const task = props.task;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Ближайший follow-up
      </Typography>

      {!task ? (
        <Typography variant="body2" color="text.secondary">
          Активных задач нет.
        </Typography>
      ) : (
        <Stack spacing={1}>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {task.title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center" }}>
            <TaskStatusChip status={task.status} />
            <Typography variant="body2" color="text.secondary">
              Дедлайн: {fmt(task.dueAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Приоритет: {task.priority}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ответственный: {task.assignedTo}
            </Typography>
          </Stack>

          {task.isOverdue ? (
            <Typography variant="body2" color="error">
              Просрочено на {task.daysOverdue} дн.
            </Typography>
          ) : null}
        </Stack>
      )}
    </Paper>
  );
}