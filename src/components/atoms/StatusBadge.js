import { Badge } from "react-bootstrap";

export default function StatusBadge({ estado }) {
  const completed = estado === "COMPLETADO" || estado === "OPERATIVA";
  const danger = estado === "AOG";
  return (
    <Badge
      bg={danger ? "danger" : completed ? "success" : "warning"}
      text={!danger && !completed ? "dark" : undefined}
    >
      {estado}
    </Badge>
  );
}
