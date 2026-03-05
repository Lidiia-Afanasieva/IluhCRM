import { Paper, Typography } from "@mui/material";
import { PageHeader } from "../../components/common/PageHeader";

export function PersonalizationPage() {
  return (
    <>
      <PageHeader
        title="Персонализация"
        subtitle="Далее появятся сегменты, правила и рекомендации для клиентов"
      />
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Заглушка страницы. Следующий шаг: таблица клиентов с рекомендациями и редактор правил.
        </Typography>
      </Paper>
    </>
  );
}