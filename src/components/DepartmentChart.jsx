import { useEffect, useState } from "react";
import { getDepartmentColor, formatCurrency } from "../utils/format";
import "./DepartmentChart.css";

export default function DepartmentChart({ employees }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!employees.length) return null;
 
  const byDept = {};
 employees.forEach((e) => {
  

  if (!byDept[e.department]) byDept[e.department] = [];
  byDept[e.department].push(Number(e.salary || 0));
});



  const stats = Object.entries(byDept)
    .map(([department, salaries]) => ({
      department,
      avg: salaries.reduce((a, b) => a + b, 0) / salaries.length,
      count: salaries.length,
    }))
    .sort((a, b) => b.avg - a.avg);
    console.table(stats);

  const max = Math.max(...stats.map((s) => s.avg), 1);

  return (
    <section className="dept-chart glass">
      <div className="dept-chart-header">
        <h3>Average Salary by Department</h3>
        <span className="dept-chart-sub">{stats.length} departments</span>
      </div>

      <div className="dept-chart-bars">
        {stats.map((s, i) => {
          const { text } = getDepartmentColor(s.department);
          const width = (s.avg / max) * 100;
          return (
            <div className="dept-bar-row" key={s.department}>
              <div className="dept-bar-label">
                <span className="dept-bar-dot" style={{ background: text }} />
                <span>{s.department}</span>
                <span className="dept-bar-count">{s.count}</span>
              </div>
              <div className="dept-bar-track">
                <div
                  className="dept-bar-fill"
                  style={{
                    width: mounted ? `${width}%` : "0%",
                    background: text,
                    transitionDelay: `${i * 70}ms`,
                  }}
                />
              </div>
              <span className="dept-bar-value mono">{formatCurrency(s.avg)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}