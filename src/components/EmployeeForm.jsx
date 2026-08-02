import { useState } from "react";
import "./EmployeeForm.css";

export default function EmployeeForm({
  employee,
  departments,
  onSubmit,
  onClose,
}) {
  const isEdit = Boolean(employee);

  const [form, setForm] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    department: employee?.department || "",
    salary: employee?.salary ?? "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = "Name is required";
    }

    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Enter a valid email";
    }

    if (!form.department.trim()) {
      next.department = "Department is required";
    }

    if (form.salary === "" || Number(form.salary) <= 0) {
      next.salary = "Enter a valid salary";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...(isEdit ? { id: employee.id } : {}),
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      salary: Number(form.salary),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{isEdit ? "Edit Employee" : "Add Employee"}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* NAME */}

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className={errors.name ? "error" : ""}
            />

            {errors.name && (
              <span className="field-error">
                {errors.name}
              </span>
            )}
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="rahul@gmail.com"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className={errors.email ? "error" : ""}
            />

            {errors.email && (
              <span className="field-error">
                {errors.email}
              </span>
            )}
          </div>

          {/* DEPARTMENT */}

          <div className="form-group">
            <label>Department</label>

            <input
              type="text"
              list="department-options"
              placeholder="Software Development"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
              className={errors.department ? "error" : ""}
            />

            <datalist id="department-options">
              {departments.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>

            {errors.department && (
              <span className="field-error">
                {errors.department}
              </span>
            )}
          </div>

          {/* SALARY */}

          <div className="form-group">
            <label>Salary</label>

            <input
              type="number"
              min="1"
              placeholder="75000"
              value={form.salary}
              onChange={(e) =>
                setForm({
                  ...form,
                  salary: e.target.value,
                })
              }
              className={errors.salary ? "error" : ""}
            />

            {errors.salary && (
              <span className="field-error">
                {errors.salary}
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              {isEdit ? "Save Changes" : "Add Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}