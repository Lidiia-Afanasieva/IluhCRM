import dayjs from "dayjs";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import type { CustomerDto } from "../../../api/dto/customers.dto";

type Props = {
  customer: CustomerDto;
};

function fmt(dt: string | null) {
  if (!dt) return "нет";
  return dayjs(dt).format("YYYY-MM-DD HH:mm");
}

export function CustomerHeader(props: Props) {
  const c = props.customer;

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {c.name}
        </Typography>
        <Chip size="small" label={`Стадия: ${c.stage}`} />
        <Chip size="small" label={c.segment ? `Сегмент: ${c.segment}` : "Сегмент: не задан"} />
        <Chip size="small" label={`Ответственный: ${c.ownerName}`} />
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
        <Typography variant="body2" color="text.secondary">
          Последний контакт: {fmt(c.lastInteractionAt)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Следующий шаг до: {fmt(c.nextActionDueAt)}
        </Typography>
      </Stack>
    </Box>
  );
}