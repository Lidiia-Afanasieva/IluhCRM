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

import { useCreateTask } from "../../../api/hooks/useCreateTask";
import type { CustomerDto } from "../../../api/dto/customers.dto";

const schema = z.object({
  customerId: z.string().min(1, "Выберите клиента"),
  title: z.string().min(3, "Слишком коротко"),
  dueAt: z.string().min(1, "Выберите дату"),
  priority: z
    .string()
    .min(1, "Введите приоритет")
    .refine((x) => {
      const n = Number(x);
      return Number.isFinite(n) && n >= 1 && n <= 10;
    }, "Допустимо 1..10"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;

  customers: CustomerDto[];
  presetCustomerId?: string;
  presetCustomerName?: string;
};

function toInputValue(dtIso: string) {
  return dayjs(dtIso).format("YYYY-MM-DDTHH:mm");
}

export function CreateTaskDialog(props: Props) {
  const mutation = useCreateTask();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: props.presetCustomerId ?? "",
      title: "",
      dueAt: toInputValue(new Date(Date.now() + 24 * 3600 * 1000).toISOString()),
      priority: "3",
    },
  });

  const onSubmit = form.handleSubmit(async (v) => {
    await mutation.mutateAsync({
      customerId: v.customerId,
      title: v.title,
      dueAt: new Date(v.dueAt).toISOString(),
      priority: Number(v.priority),
      status: "open",
      assignedTo: "Менеджер Ф5",
    });

    props.onClose();
    form.reset({
      customerId: props.presetCustomerId ?? "",
      title: "",
      dueAt: toInputValue(new Date(Date.now() + 24 * 3600 * 1000).toISOString()),
      priority: "3",
    });
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {props.presetCustomerName ? `Создать задачу: ${props.presetCustomerName}` : "Создать задачу"}
      </DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1.5 }} spacing={2}>
          <TextField
            label="Клиент"
            select
            value={form.watch("customerId")}
            onChange={(e) => form.setValue("customerId", e.target.value)}
            disabled={Boolean(props.presetCustomerId)}
            error={Boolean(form.formState.errors.customerId)}
            helperText={form.formState.errors.customerId?.message}
          >
            {props.customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Задача"
            multiline
            minRows={3}
            {...form.register("title")}
            error={Boolean(form.formState.errors.title)}
            helperText={form.formState.errors.title?.message}
          />

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
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}