import dayjs from "dayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import type { TaskListItemDto } from "../../../api/dto/tasksList.dto";
import type { TaskStatus } from "../../../api/dto/tasks.dto";
import { useUpdateTask } from "../../../api/hooks/useUpdateTask";

type Props = {
  open: boolean;
  task: TaskListItemDto | null;
  onClose: () => void;
};

const schema = z.object({
  status: z.enum(["open", "done", "canceled"]),
  dueAt: z.string().min(1, "Выбор даты обязателен"),
  priority: z
    .string()
    .min(1, "Введите приоритет")
    .refine((x) => {
      const n = Number(x);
      return Number.isFinite(n) && n >= 1 && n <= 10;
    }, "Допустимо 1..10"),
});

type FormValues = z.infer<typeof schema>;

function isoToLocalInput(iso: string) {
  return dayjs(iso).format("YYYY-MM-DDTHH:mm");
}

export function TaskEditorDialog(props: Props) {
  const mutation = useUpdateTask();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "open",
      dueAt: isoToLocalInput(new Date().toISOString()),
      priority: "3",
    },
  });

  const task = props.task;

  if (props.open && task) {
    const current = form.getValues();
    const needSync =
      current.status !== task.status ||
      current.dueAt !== isoToLocalInput(task.dueAt) ||
      current.priority !== String(task.priority);

    if (needSync) {
      form.reset({
        status: task.status as any,
        dueAt: isoToLocalInput(task.dueAt),
        priority: String(task.priority),
      });
    }
  }

  const onSubmit = form.handleSubmit(async (v) => {
    if (!task) return;

    await mutation.mutateAsync({
      taskId: task.id,
      body: {
        status: v.status as TaskStatus,
        dueAt: new Date(v.dueAt).toISOString(),
        priority: Number(v.priority),
      },
    });

    props.onClose();
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>Редактирование задачи</DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1.5 }} spacing={2}>
          <TextField
            label="Статус"
            select
            value={form.watch("status")}
            onChange={(e) => form.setValue("status", e.target.value as any)}
          >
            <MenuItem value="open">Открыта</MenuItem>
            <MenuItem value="done">Выполнена</MenuItem>
            <MenuItem value="canceled">Отменена</MenuItem>
          </TextField>

          <TextField
            label="Дедлайн"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            {...form.register("dueAt")}
            error={Boolean(form.formState.errors.dueAt)}
            helperText={form.formState.errors.dueAt?.message}
          />

          <TextField
            label="Приоритет (1..10)"
            inputMode="numeric"
            {...form.register("priority")}
            error={Boolean(form.formState.errors.priority)}
            helperText={form.formState.errors.priority?.message}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onClose}>Отмена</Button>
        <Button variant="contained" onClick={onSubmit} disabled={mutation.isPending}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}