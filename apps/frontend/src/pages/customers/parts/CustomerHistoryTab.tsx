import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import type { UseQueryResult } from "@tanstack/react-query";

import type { InteractionDto } from "../../../api/dto/interactions.dto";
import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";
import { EmptyState } from "../../../components/common/EmptyState";
import { AddInteractionDialog } from "./AddInteractionDialog";

type Props = {
  customerId: string;
  query: UseQueryResult<InteractionDto[], unknown>;
};

function kindLabel(kind: InteractionDto["kind"]) {
  if (kind === "call") return "Звонок";
  if (kind === "email") return "Письмо";
  if (kind === "meeting") return "Встреча";
  return "Заметка";
}

function fmt(dt: string) {
  return dayjs(dt).format("YYYY-MM-DD HH:mm");
}

export function CustomerHistoryTab(props: Props) {
  const [open, setOpen] = useState(false);

  const items = useMemo(() => props.query.data ?? [], [props.query.data]);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          История взаимодействий
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Добавить взаимодействие
        </Button>
      </Stack>

      <AddInteractionDialog
        customerId={props.customerId}
        open={open}
        onClose={() => setOpen(false)}
      />

      {props.query.isLoading ? <LoadingState /> : null}
      {props.query.isError ? (
        <ErrorState title="Ошибка" description="Не удалось загрузить историю взаимодействий." />
      ) : null}

      {props.query.isSuccess && items.length === 0 ? (
        <EmptyState title="История пуста" description="Пока нет ни одного взаимодействия." />
      ) : null}

      {props.query.isSuccess && items.length > 0 ? (
        <Stack spacing={1.5}>
          {items.map((x) => (
            <Paper key={x.id} sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {kindLabel(x.kind)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {x.summary}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" color="text.secondary">
                    {fmt(x.occurredAt)}
                  </Typography>
                  <Divider sx={{ my: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {x.createdBy}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}