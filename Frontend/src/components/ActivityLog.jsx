const eventStyles = {
  upload: "badge-info",
  query: "badge-medium",
  report: "badge-low",
  risk: "badge-high",
  success: "badge-info",
  warning: "badge-medium",
  error: "badge-high",
  default: "badge-info",
};

function formatDate(dateString) {
  if (!dateString) return "Unavailable";

  return new Date(dateString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ActivityLog({ title = "Recent Activity", subtitle, items = [] }) {
  return (
    <section className="card fade-up overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg text-white font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-400 mt-1">{subtitle}</p> : null}
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">{items.length} events</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b" style={{ borderColor: "var(--dark-500)" }}>
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Action</th>
              <th className="pb-3 font-medium">Resource</th>
              <th className="pb-3 font-medium">Timestamp</th>
              <th className="pb-3 font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item, index) => {
                const typeKey = String(item.type ?? "").toLowerCase();

                return (
                  <tr key={item.id ?? `${item.user}-${item.action}-${index}`} className="border-b last:border-0" style={{ borderColor: "rgba(38,38,47,0.8)" }}>
                    <td className="py-4 text-white">{item.user ?? "Unknown"}</td>
                    <td className="py-4 text-gray-300">{item.action ?? "Unknown"}</td>
                    <td className="py-4 text-gray-400">{item.resource ?? "Not specified"}</td>
                    <td className="py-4 text-gray-500">{formatDate(item.timestamp)}</td>
                    <td className="py-4">
                      <span className={eventStyles[typeKey] ?? eventStyles.default}>{item.type ?? "default"}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No activity recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
