import { useMemo, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { UseQueryResult } from "@tanstack/react-query";

import type { PersonalizationDto } from "../../../api/dto/personalization.dto";
import type { CustomerDto } from "../../../api/dto/customers.dto";
import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";

import { AddNoteDialog } from "./AddNoteDialog";
import { AddNextActionDialog } from "./AddNextActionDialog";
import { CreateTaskDialog } from "../../tasks/parts/CreateTaskDialog";

type Props = {
  customerId: string;
  customer?: CustomerDto;
  allCustomers?: CustomerDto[];
  query: UseQueryResult<PersonalizationDto, unknown>;
};

function valueOrDash(v: string | null) {
  return v ? v : "нет";
}

export function CustomerPersonalTab(props: Props) {
  const [openNote, setOpenNote] = useState(false);
  const [openNext, setOpenNext] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  const p = useMemo(() => props.query.data, [props.query.data]);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1, flexWrap: "wrap" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Персонализация
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setOpenNote(true)}>
            Добавить заметку
          </Button>
          <Button variant="outlined" onClick={() => setOpenTask(true)}>
            Создать follow-up
          </Button>
          <Button variant="contained" onClick={() => setOpenNext(true)}>
            Назначить следующий шаг
          </Button>
        </Stack>
      </Stack>

      <AddNoteDialog
        customerId={props.customerId}
        open={openNote}
        onClose={() => setOpenNote(false)}
      />

      <AddNextActionDialog
        customerId={props.customerId}
        open={openNext}
        onClose={() => setOpenNext(false)}
      />

      <CreateTaskDialog
        open={openTask}
        onClose={() => setOpenTask(false)}
        customers={props.allCustomers ?? (props.customer ? [props.customer] : [])}
        presetCustomerId={props.customerId}
        presetCustomerName={props.customer?.name}
      />

      {props.query.isLoading ? <LoadingState /> : null}
      {props.query.isError ? (
        <ErrorState title="Ошибка" description="Не удалось загрузить данные персонализации." />
      ) : null}

      {props.query.isSuccess && p ? (
        <Stack spacing={1.5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Рекомендации
            </Typography>

            <Stack spacing={0.8} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Сегмент: {valueOrDash(p.segment)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Рекомендуемый шаблон: {valueOrDash(p.recommendedTemplate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Следующее действие: {valueOrDash(p.nextBestAction)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Причина: {valueOrDash(p.reason)}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      ) : null}
    </Box>
  );
}