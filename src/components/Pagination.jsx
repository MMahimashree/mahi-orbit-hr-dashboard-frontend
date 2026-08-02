import "./Pagination.css";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  // Show a condensed window around the current page for large sets
  const visible = pages.filter(
    (p) => p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1
  );

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ◀
      </button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showGap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {showGap && <span className="page-gap">…</span>}
            <button
              className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p + 1}
            </button>
          </span>
        );
      })}

      <button
        className="page-btn"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        ▶
      </button>
    </div>
  );
}