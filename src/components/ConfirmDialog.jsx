import "./ConfirmDialog.css";

export default function ConfirmDialog({ employee, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog glass" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">⚠</div>
        <h3>Delete Employee</h3>
        <p>
          Are you sure you want to delete <strong>{employee.name}</strong>? This
          action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}