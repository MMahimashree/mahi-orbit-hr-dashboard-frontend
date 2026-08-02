import { useState, useEffect } from "react";
import "./Toolbar.css";

export default function Toolbar({
  departments,
  filters,
  onFilterChange,
  onAddClick,
}) {
  const [salaryInput, setSalaryInput] = useState(filters.minSalary || "");

  // Debounce salary input so we don't fire a request on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => {
      onFilterChange({ ...filters, minSalary: salaryInput });
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salaryInput]);

  return (
    <div className="toolbar glass">
      <div className="toolbar-filters">
        <select
          value={filters.department}
          onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min salary"
          value={salaryInput}
          onChange={(e) => setSalaryInput(e.target.value)}
          className="salary-input"
        />

        <button
          className={`sort-toggle ${filters.sortBySalary ? "active" : ""}`}
          onClick={() => onFilterChange({ ...filters, sortBySalary: !filters.sortBySalary })}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Sort by Salary
        </button>

        {(filters.department || filters.minSalary || filters.sortBySalary) && (
          <button
            className="clear-filters"
            onClick={() => {
              setSalaryInput("");
              onFilterChange({ department: "", minSalary: "", sortBySalary: false });
            }}
          >
            Clear
          </button>
        )}
      </div>

      <button className="add-btn" onClick={onAddClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        Add Employee
      </button>
    </div>
  );
}