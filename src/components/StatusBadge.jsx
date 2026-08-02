import { getDepartmentColor } from "../utils/format";
import "./StatusBadge.css";

export default function StatusBadge({ department }) {
  const { text } = getDepartmentColor(department);
  return (
    <span className="status-badge" style={{ color: text }}>
      {department}
    </span>
  );
}