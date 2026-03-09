import { Chip } from "@mui/material";
import type { TaskStatus } from "../../api/dto/tasks.dto";

type Props = {
  status: TaskStatus;
  size?: "small" | "medium";
};

function labelOf(s: TaskStatus) {
  if (s === "open") return "Открыта";
  if (s === "done") return "Выполнена";
  return "Отменена";
}

function colorOf(s: TaskStatus) {
  if (s === "open") return "warning";
  if (s === "done") return "success";
  return "default";
}

export function TaskStatusChip(props: Props) {
  return <Chip size={props.size ?? "small"} label={labelOf(props.status)} color={colorOf(props.status) as any} />;
}