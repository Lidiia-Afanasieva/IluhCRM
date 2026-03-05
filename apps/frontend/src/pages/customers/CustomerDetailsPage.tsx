import { Paper, Typography } from "@mui/material";
import { PageHeader } from "../../components/common/PageHeader";

export function CustomerDetailsPage() {
  return (
    <>
      <PageHeader
        title="Карточка клиента"
        subtitle="Далее появятся профиль, история взаимодействий, качество и персонализация"
      />
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Заглушка страницы. Следующий шаг: вкладки «История», «Качество», «Персонализация».
        </Typography>
      </Paper>
    </>
  );
}