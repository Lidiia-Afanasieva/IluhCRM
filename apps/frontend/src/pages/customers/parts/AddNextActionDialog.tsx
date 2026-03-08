import { z } from "zod";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import { useSetNextAction } from "../../../api/hooks/usePersonalization";

const schema = z.object({
  nextActionDueAt: z.string().min(1, "Выберите дату"),
  nextBestAction: z.string().min(3, "Слишком коротко"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  customerId: string;
  open: boolean;
  onClose: () => void;
};

function toInputValue(dtIso: string) {
  return dayjs(dtIso).format("YYYY-MM-DDTHH:mm");
}

export function AddNextActionDialog(props: Props) {
  const mutation = useSetNextAction(props.customerId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nextActionDueAt: toInputValue(new Date(Date.now() + 24 * 3600 * 1000).toISOString()),
      nextBestAction: "",
    },
  });

  const onSubmit = form.handleSubmit(async (v) => {
    await mutation.mutateAsync({
      nextActionDueAt: new Date(v.nextActionDueAt).toISOString(),
      nextBestAction: v.nextBestAction,
    });
    props.onClose();
    form.reset({
      nextActionDueAt: toInputValue(new Date(Date.now() + 24 * 3600 * 1000).toISOString()),
      nextBestAction: "",
    });
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>Назначить следующий шаг</DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1.5 }} spacing={2}>
          <TextField
            label="Срок (дата и время)"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            {...form.register("nextActionDueAt")}
            error={Boolean(form.formState.errors.nextActionDueAt)}
            helperText={form.formState.errors.nextActionDueAt?.message}
          />

          <TextField
            label="Следующее действие"
            multiline
            minRows={3}
            {...form.register("nextBestAction")}
            error={Boolean(form.formState.errors.nextBestAction)}
            helperText={form.formState.errors.nextBestAction?.message}
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