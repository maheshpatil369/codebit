const eventStyles = {
  upload: "badge-info",
  query: "badge-medium",
  report: "badge-low",
  risk: "badge-high",
  default: "badge-info",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ActivityLog({ title = "Recent Activity", subtitle, items = [] }) {
  return (
    <section className="card fade-up">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg text-white font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-400 mt-1">{subtitle}</p> : null}
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">{items.length} events</span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.76)" }}
          >
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={eventStyles[item.type] ?? eventStyles.default}>{item.action}</span>
                <p className="text-sm text-white">{item.detail}</p>
              </div>
              {item.actor ? <p className="text-xs text-gray-500 mt-2">{item.actor}</p> : null}
            </div>
            <p className="text-xs text-gray-500 whitespace-nowrap">{formatDate(item.timestamp)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
