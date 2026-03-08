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
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";

import { useAddInteraction } from "../../../api/hooks/useInteractions";
import type { InteractionKind } from "../../../api/dto/interactions.dto";

const schema = z.object({
  kind: z.enum(["call", "email", "meeting", "note"]),
  occurredAt: z.string().min(1),
  summary: z.string().min(3, "Слишком коротко"),
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

export function AddInteractionDialog(props: Props) {
  const mutation = useAddInteraction(props.customerId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: "call",
      occurredAt: toInputValue(new Date().toISOString()),
      summary: "",
    },
  });

  const onSubmit = form.handleSubmit(async (v) => {
    await mutation.mutateAsync({
      kind: v.kind as InteractionKind,
      occurredAt: new Date(v.occurredAt).toISOString(),
      summary: v.summary,
    });
    props.onClose();
    form.reset({
      kind: "call",
      occurredAt: toInputValue(new Date().toISOString()),
      summary: "",
    });
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить взаимодействие</DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1.5 }} spacing={2}>
          <TextField
            label="Тип"
            select
            value={form.watch("kind")}
            onChange={(e) => form.setValue("kind", e.target.value as any)}
          >
            <MenuItem value="call">Звонок</MenuItem>
            <MenuItem value="email">Письмо</MenuItem>
            <MenuItem value="meeting">Встреча</MenuItem>
            <MenuItem value="note">Заметка</MenuItem>
          </TextField>

          <TextField
            label="Дата и время"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            {...form.register("occurredAt")}
            error={Boolean(form.formState.errors.occurredAt)}
            helperText={form.formState.errors.occurredAt?.message}
          />

          <TextField
            label="Краткое описание"
            multiline
            minRows={3}
            {...form.register("summary")}
            error={Boolean(form.formState.errors.summary)}
            helperText={form.formState.errors.summary?.message}
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