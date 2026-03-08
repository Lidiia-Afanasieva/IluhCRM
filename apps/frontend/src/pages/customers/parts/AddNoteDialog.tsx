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
} from "@mui/material";

import { useAddNote } from "../../../api/hooks/usePersonalization";

const schema = z.object({
  text: z.string().min(3, "Слишком коротко"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  customerId: string;
  open: boolean;
  onClose: () => void;
};

export function AddNoteDialog(props: Props) {
  const mutation = useAddNote(props.customerId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  });

  const onSubmit = form.handleSubmit(async (v) => {
    await mutation.mutateAsync({ text: v.text });
    props.onClose();
    form.reset({ text: "" });
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить заметку</DialogTitle>

      <DialogContent>
        <Stack sx={{ pt: 1.5 }} spacing={2}>
          <TextField
            label="Текст"
            multiline
            minRows={4}
            {...form.register("text")}
            error={Boolean(form.formState.errors.text)}
            helperText={form.formState.errors.text?.message}
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