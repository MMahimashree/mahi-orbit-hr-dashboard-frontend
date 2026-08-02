import { useEffect, useState } from "react";
import employeeService from "../services/employeeService";
import { formatCurrency } from "../utils/format";
import useCountUp from "../hooks/useCountUp";
import "./DashboardCards.css";

function StatCard({ label, value, format, accent, icon, loading }) {
  const animated = useCountUp(typeof value === "number" ? value : 0);
  const display = loading
    ? "—"
    : format
    ? format(animated)
    : Math.round(animated).toLocaleString();

  return (
    <div className="stat-card glass" style={{ "--accent": accent }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <span className="stat-value mono">{display}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

export default function DashboardCards({ employees, refreshKey }) {
  const [count, setCount] = useState(null);
  const [aboveAverage, setAboveAverage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([employeeService.getCount(), employeeService.getAboveAverage()])
      .then(([countRes, aboveAvgRes]) => {
        if (cancelled) return;
        setCount(countRes.data);
        setAboveAverage(aboveAvgRes.data.length);
      })
      .catch((err) => console.error("Failed to load dashboard stats:", err));

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const loading = count === null || aboveAverage === null;
  const departmentCount = new Set(employees.map((e) => e.department)).size;
  const avgSalary =
    employees.length > 0
      ? employees.reduce((sum, e) => sum + Number(e.salary || 0), 0) / employees.length
      : 0;
  return (
    <section className="dashboard-cards">
      <StatCard
        label="Total Employees"
        value={count}
        accent="var(--blue)"
        icon="👥"
        loading={loading}
      />
      <StatCard
        label="Departments"
        value={departmentCount}
        accent="var(--gold)"
        icon="🏢"
        loading={false}
      />
      <StatCard
        label="Average Salary"
        value={avgSalary}
        format={formatCurrency}
        accent="var(--success)"
        icon="💰"
        loading={employees.length === 0}
      />
      <StatCard
        label="Above Average"
        value={aboveAverage}
        accent="var(--warning)"
        icon="📈"
        loading={loading}
      />
    </section>
  );
}