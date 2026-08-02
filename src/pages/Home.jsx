import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import DepartmentChart from "../components/DepartmentChart";
import Toolbar from "../components/Toolbar";
import EmployeeTable from "../components/EmployeeTable";
import Pagination from "../components/Pagination";
import EmployeeForm from "../components/EmployeeForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import employeeService from "../services/employeeService";
import Footer from "../components/Footer";

import "./Home.css";

const PAGE_SIZE = 5;

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ department: "", minSalary: "", sortBySalary: false });
  const [departments, setDepartments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [formTarget, setFormTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [salaryChange, setSalaryChange] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // Full dataset — powers department dropdown, dashboard stats, and chart
  useEffect(() => {
    employeeService
      .getAll()
      .then((res) => {
        setAllEmployees(res.data);
        setDepartments([...new Set(res.data.map((e) => e.department))]);
      })
      .catch(() => {});
  }, [refreshKey]);

  // Paginated / filtered list — powers the table
  useEffect(() => {
    let cancelled = false;

    const usingServerPage =
      !filters.department && !filters.minSalary && !filters.sortBySalary && !searchQuery;

    async function load() {
      try {
        let content, pages;
if (usingServerPage) {
    const res = await employeeService.getAll();

    const data = res.data;

    pages = Math.ceil(data.length / PAGE_SIZE);

    content = data.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE
    );
} else {
          let res;
          if (filters.department) res = await employeeService.getByDepartment(filters.department);
          else if (filters.minSalary) res = await employeeService.getAboveSalary(filters.minSalary);
          else if (filters.sortBySalary) res = await employeeService.getSortedBySalary();
          else res = await employeeService.getAll();

          let data = res.data;

          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(
              (e) =>
                e.name?.toLowerCase().includes(q) ||
                e.department?.toLowerCase().includes(q) ||
                String(e.id).includes(q)
            );
          }

          if (filters.sortBySalary && filters.department) {
            data = [...data].sort((a, b) => b.salary - a.salary);
          }

          pages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
          content = data.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
        }

        if (!cancelled) {
          setEmployees(content);
          setTotalPages(pages);
        }
      } catch (err) {
        console.error("Failed to load employees:", err);
        if (!cancelled) showToast("Could not load employees from the server", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [filters, searchQuery, page, refreshKey, showToast]);

  // Auto-clear the add/edit highlight
  useEffect(() => {
    if (!highlightId) return;
    const t = setTimeout(() => setHighlightId(null), 1600);
    return () => clearTimeout(t);
  }, [highlightId]);

  // Auto-clear the salary change chip
  useEffect(() => {
    if (!salaryChange) return;
    const t = setTimeout(() => setSalaryChange(null), 2400);
    return () => clearTimeout(t);
  }, [salaryChange]);

  const handleFilterChange = (next) => {
    setLoading(true);
    setFilters(next);
    setPage(0);
  };

  const handleSearch = (q) => {
    setLoading(true);
    setSearchQuery(q);
    setPage(0);
  };

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (data.id) {
        const previous =
          employees.find((e) => e.id === data.id) ||
          allEmployees.find((e) => e.id === data.id);

        await employeeService.update(data.id, data);
        showToast("Employee updated successfully");

        if (previous && Number(data.salary) !== Number(previous.salary)) {
          setSalaryChange({ id: data.id, delta: Number(data.salary) - Number(previous.salary) });
        }
        setHighlightId(data.id);
      } else {
        const res = await employeeService.create(data);
        showToast("Employee added successfully");
        setHighlightId(res.data.id);
      }
      setFormTarget(null);
      setLoading(true);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const handleConfirmDelete = () => {
    const id = deleteTarget.id;
    setDeleteTarget(null);
    setRemovingId(id);

    // Let the collapse animation play before the row actually leaves
    setTimeout(async () => {
      try {
        await employeeService.remove(id);
        showToast("Employee deleted");
        setLoading(true);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error(err);
        showToast("Failed to delete employee", "error");
      } finally {
        setRemovingId(null);
      }
    }, 320);
  };
return (
  <div className="app">
    <div className="fade-section" style={{ animationDelay: "0ms" }}>
      <Navbar onSearch={handleSearch} />
    </div>
    <div className="fade-section" style={{ animationDelay: "80ms" }}>
      <DashboardCards employees={allEmployees} refreshKey={refreshKey} />
    </div>
    <div className="fade-section" style={{ animationDelay: "160ms" }}>
      <DepartmentChart employees={allEmployees} />
    </div>
    <div className="fade-section" style={{ animationDelay: "240ms" }}>
      <Toolbar
        departments={departments}
        filters={filters}
        onFilterChange={handleFilterChange}
        onAddClick={() => setFormTarget({})}
      />
    </div>
    <div className="fade-section" style={{ animationDelay: "320ms" }}>
      <EmployeeTable
  employees={employees}
  loading={loading}
  onEdit={setFormTarget}
  onDeleteRequest={setDeleteTarget}
  highlightId={highlightId}
  removingId={removingId}
  salaryChange={salaryChange}
  searchQuery={searchQuery}
  onAddClick={() => setFormTarget({})}
/>
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>

    {formTarget !== null && (
      <EmployeeForm
        key={formTarget.id ?? "new"}
        employee={formTarget.id ? formTarget : null}
        departments={departments}
        onSubmit={handleFormSubmit}
        onClose={() => setFormTarget(null)}
      />
    )}

    {deleteTarget && (
      <ConfirmDialog
        employee={deleteTarget}
        loading={false}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    )}

    <Toast toasts={toasts} />
    <Footer />
  </div>
);
}