import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Paper } from "@mui/material";

import { PageHeader } from "../../components/common/PageHeader";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";

import { useCustomerById } from "../../api/hooks/useCustomerById";
import { useInteractions } from "../../api/hooks/useInteractions";
import { useQuality } from "../../api/hooks/useQuality";
import { usePersonalization } from "../../api/hooks/usePersonalization";
import { useCustomers } from "../../api/hooks/useCustomers";

import { CustomerHeader } from "./parts/CustomerHeader";
import { CustomerTabs, type CustomerTabKey } from "./parts/CustomerTabs";
import { CustomerHistoryTab } from "./parts/CustomerHistoryTab";
import { CustomerQualityTab } from "./parts/CustomerQualityTab";
import { CustomerPersonalTab } from "./parts/CustomerPersonalTab";
import { CustomerTasksTab } from "./parts/CustomerTasksTab";

export function CustomerDetailsPage() {
  const nav = useNavigate();
  const params = useParams();
  const id = String(params.id ?? "");

  const [tab, setTab] = useState<CustomerTabKey>("history");

  const customerQuery = useCustomerById(id);
  const allCustomersQuery = useCustomers({});
  const interactionsQuery = useInteractions(id);
  const qualityQuery = useQuality(id);
  const personalizationQuery = usePersonalization(id);

  const subtitle = useMemo(() => {
    if (!customerQuery.data) return "Карточка клиента: история, качество, персонализация, задачи";
    const x = customerQuery.data;
    const seg = x.segment ? `Сегмент: ${x.segment}` : "Сегмент: не задан";
    return `${seg}. Стадия: ${x.stage}. Ответственный: ${x.ownerName}`;
  }, [customerQuery.data]);

  return (
    <>
      <PageHeader title="Карточка клиента" subtitle={subtitle} />

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => nav("/customers")}>
          Назад к списку
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        {customerQuery.isLoading ? <LoadingState /> : null}
        {customerQuery.isError ? (
          <ErrorState title="Ошибка" description="Не удалось загрузить данные клиента." />
        ) : null}

        {customerQuery.isSuccess ? <CustomerHeader customer={customerQuery.data} /> : null}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <CustomerTabs value={tab} onChange={setTab} />

        <Box sx={{ pt: 2 }}>
          {tab === "history" ? (
            <CustomerHistoryTab
              customerId={id}
              customer={customerQuery.data}
              allCustomers={allCustomersQuery.data}
              query={interactionsQuery}
            />
          ) : null}

          {tab === "quality" ? (
            <CustomerQualityTab customerId={id} query={qualityQuery} />
          ) : null}

          {tab === "personalization" ? (
            <CustomerPersonalTab
              customerId={id}
              customer={customerQuery.data}
              allCustomers={allCustomersQuery.data}
              query={personalizationQuery}
            />
          ) : null}

          {tab === "tasks" && customerQuery.data ? (
            <CustomerTasksTab
              customer={customerQuery.data}
              allCustomers={allCustomersQuery.data}
            />
          ) : null}
        </Box>
      </Paper>
    </>
  );
}