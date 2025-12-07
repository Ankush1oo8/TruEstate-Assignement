const Pagination = ({ page, totalPages, total, onChange }) => {
  const pages = [];
  const maxButtons = 6;
  const start = Math.max(1, Math.min(page - 2, totalPages - maxButtons + 1));
  const end = Math.min(totalPages, start + maxButtons - 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div className="surface pagination">
      <div className="footer-meta">
        Showing page {page} of {totalPages} — {total} records
      </div>
      <div className="page-buttons">
        <button className="btn ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`btn page ${p === page ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="btn ghost"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
