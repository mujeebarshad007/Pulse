export default function Loading() {
  return (
    <div className="p-state-preview" role="status">
      <h1>Loading your workspace…</h1>
      <div className="p-skeleton-grid" aria-busy="true">
        {[1, 2, 3].map((n) => (
          <div className="p-skeleton" key={n} />
        ))}
      </div>
    </div>
  );
}
