import { z } from "zod";
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
  Typography,
} from "@mui/material";

import { useAddFeedback } from "../../../api/hooks/useQuality";

const schema = z.object({
  npsScore: z
    .string()
    .min(1, "Введите значение")
    .refine((x) => {
      const n = Number(x);
      return Number.isFinite(n) && n >= 0 && n <= 10;
    }, "Допустимо 0..10"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  customerId: string;
  open: boolean;
  onClose: () => void;
};

export function AddFeedbackDialog(props: Props) {
  const mutation = useAddFeedback(props.customerId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { npsScore: "" },
  });

  const onSubmit = form.handleSubmit(async (v) => {
    await mutation.mutateAsync({ npsScore: Number(v.npsScore) });
    props.onClose();
    form.reset({ npsScore: "" });
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить оценку</DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1.5 }} spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Оценка NPS используется как простой индикатор удовлетворенности (0..10).
          </Typography>

          <TextField
            label="NPS (0..10)"
            inputMode="numeric"
            {...form.register("npsScore")}
            error={Boolean(form.formState.errors.npsScore)}
            helperText={form.formState.errors.npsScore?.message}
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