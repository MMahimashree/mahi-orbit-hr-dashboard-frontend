import StatusBadge from "./StatusBadge";
import { formatCurrency, highlightMatch } from "../utils/format";
import useCountUp from "../hooks/useCountUp";
import "./EmployeeTable.css";

function AnimatedSalary({ value }) {
  const animated = useCountUp(value, 700);
  return <>{formatCurrency(animated)}</>;
}

function SkeletonRows({ count = 5 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="skeleton-row">
      <td><div className="skeleton-bar" style={{ width: "36px" }} /></td>
      <td><div className="skeleton-bar" style={{ width: "150px" }} /></td>
      <td><div className="skeleton-bar" style={{ width: "90px" }} /></td>
      <td><div className="skeleton-bar" style={{ width: "80px" }} /></td>
      <td></td>
    </tr>
  ));
}

function SkeletonCards({ count = 4 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div className="employee-card skeleton-card" key={i}>
      <div className="skeleton-bar" style={{ width: "60%", height: "16px" }} />
      <div className="skeleton-bar" style={{ width: "40%", height: "12px", marginTop: "10px" }} />
    </div>
  ));
}

export default function EmployeeTable({
  employees,
  loading,
  onEdit,
  onDeleteRequest,
  highlightId,
  removingId,
  salaryChange,
  searchQuery,
  onAddClick,
}) {
  const isEmpty = !loading && employees.length === 0;

  const rowStyle = (id, i) => {
    const style = { animationDelay: `${i * 40}ms` };
    if (removingId === id) {
      style.opacity = 0;
      style.transform = "translateX(24px)";
    }
    if (highlightId === id) {
      style.background = "var(--blue-soft)";
    }
    return style;
  };

  const SalaryChip = ({ id }) => {
    if (!salaryChange || salaryChange.id !== id) return null;
    const up = salaryChange.delta >= 0;
    return (
      <span className={`salary-chip ${up ? "up" : "down"}`}>
        {up ? "↑" : "↓"} {formatCurrency(Math.abs(salaryChange.delta))}
      </span>
    );
  };

  return (
    <div className="table-wrap glass">
      {isEmpty ? (
        <div className="table-state">
          <div className="table-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="table-state-title">No employees found</span>
          <span className="table-state-sub">Add your first employee to get started.</span>
          {onAddClick && (
            <button className="add-btn" style={{ marginTop: "16px" }} onClick={onAddClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Add Employee
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : (
                employees.map((emp, i) => (
                  <tr key={emp.id} className="row-in" style={rowStyle(emp.id, i)}>
                    <td className="mono id-cell">#{emp.id}</td>
                    <td>
                      <div className="name-cell">
                        <div className="name-avatar">{emp.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                          <div className="row-name">{highlightMatch(emp.name, searchQuery)}</div>
                          <div className="row-subid mono">Employee #{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><StatusBadge department={emp.department} /></td>
                    <td className="mono salary-cell">
                      <AnimatedSalary value={emp.salary} />
                      <SalaryChip id={emp.id} />
                    </td>
                    <td className="actions-col">
                      <button className="icon-btn edit" onClick={() => onEdit(emp)} title="Edit employee">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button className="icon-btn delete" onClick={() => onDeleteRequest(emp)} title="Delete employee">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="employee-cards">
            {loading ? (
              <SkeletonCards />
            ) : (
              employees.map((emp, i) => (
                <div className="employee-card row-in" key={emp.id} style={rowStyle(emp.id, i)}>
                  <div className="employee-card-top">
                    <div className="name-cell">
                      <div className="name-avatar">{emp.name?.charAt(0)?.toUpperCase()}</div>
                      <div>
                        <div className="card-name">{highlightMatch(emp.name, searchQuery)}</div>
                        <div className="card-id mono">#{emp.id}</div>
                      </div>
                    </div>
                    <StatusBadge department={emp.department} />
                  </div>
                  <div className="employee-card-bottom">
                    <span className="card-salary mono">
                      <AnimatedSalary value={emp.salary} />
                      <SalaryChip id={emp.id} />
                    </span>
                    <div className="card-actions">
                      <button className="icon-btn edit" onClick={() => onEdit(emp)} title="Edit employee">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button className="icon-btn delete" onClick={() => onDeleteRequest(emp)} title="Delete employee">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}