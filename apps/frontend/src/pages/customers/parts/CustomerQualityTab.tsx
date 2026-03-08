import { useMemo, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { UseQueryResult } from "@tanstack/react-query";

import type { QualityDto } from "../../../api/dto/quality.dto";
import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";
import { AddFeedbackDialog } from "./AddFeedbackDialog";

type Props = {
  customerId: string;
  query: UseQueryResult<QualityDto, unknown>;
};

function npsLabel(nps: number | null) {
  if (nps === null) return "нет";
  return String(nps);
}

export function CustomerQualityTab(props: Props) {
  const [open, setOpen] = useState(false);

  const q = useMemo(() => props.query.data, [props.query.data]);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Качество обслуживания
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Добавить оценку
        </Button>
      </Stack>

      <AddFeedbackDialog
        customerId={props.customerId}
        open={open}
        onClose={() => setOpen(false)}
      />

      {props.query.isLoading ? <LoadingState /> : null}
      {props.query.isError ? (
        <ErrorState title="Ошибка" description="Не удалось загрузить метрики качества." />
      ) : null}

      {props.query.isSuccess && q ? (
        <Stack spacing={1.5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              KPI
            </Typography>

            <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Среднее время первого ответа (сек): {q.firstResponseSecondsAvg}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Просроченные задачи: {q.overdueTasksCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Количество взаимодействий: {q.interactionsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NPS: {npsLabel(q.npsScore)}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      ) : null}
    </Box>
  );
}