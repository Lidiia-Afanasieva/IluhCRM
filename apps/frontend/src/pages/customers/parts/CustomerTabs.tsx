import { Tabs, Tab } from "@mui/material";

export type CustomerTabKey = "history" | "quality" | "personalization" | "tasks";

type Props = {
  value: CustomerTabKey;
  onChange: (v: CustomerTabKey) => void;
};

export function CustomerTabs(props: Props) {
  return (
    <Tabs
      value={props.value}
      onChange={(_, v) => props.onChange(v)}
      variant="scrollable"
      scrollButtons="auto"
    >
      <Tab value="history" label="История" />
      <Tab value="quality" label="Качество" />
      <Tab value="personalization" label="Персонализация" />
      <Tab value="tasks" label="Задачи" />
    </Tabs>
  );
}