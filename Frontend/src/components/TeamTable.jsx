function formatDate(dateString) {
  if (!dateString) return "Unavailable";

  return new Date(dateString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const roleTone = {
  admin: "badge-high",
  "legal manager": "badge-medium",
  analyst: "badge-info",
  viewer: "badge-low",
};

const statusTone = {
  active: "badge-info",
  invited: "badge-medium",
  suspended: "badge-high",
  inactive: "badge-low",
};

export default function TeamTable({ members = [] }) {
  return (
    <section className="card fade-up overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg text-white font-semibold">Team Management</h2>
          <p className="text-sm text-gray-400 mt-1">Company admins and collaborators with recent activity.</p>
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">{members.length} members</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b" style={{ borderColor: "var(--dark-500)" }}>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Documents Analyzed</th>
              <th className="pb-3 font-medium">Last Active</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.length ? (
              members.map((member) => {
                const roleKey = String(member.role ?? "").toLowerCase();
                const statusKey = String(member.status ?? "").toLowerCase();

                return (
                  <tr key={member.id ?? member.email ?? member.name} className="border-b last:border-0" style={{ borderColor: "rgba(38,38,47,0.8)" }}>
                    <td className="py-4 text-white">{member.name ?? "Unknown"}</td>
                    <td className="py-4 text-gray-400">{member.email ?? "Unavailable"}</td>
                    <td className="py-4">
                      <span className={roleTone[roleKey] ?? "badge-info"}>{member.role ?? "Unknown"}</span>
                    </td>
                    <td className="py-4 text-gray-300">{member.documentsAnalyzed ?? 0}</td>
                    <td className="py-4 text-gray-500">{formatDate(member.lastActive)}</td>
                    <td className="py-4">
                      <span className={statusTone[statusKey] ?? "badge-low"}>{member.status ?? "Unknown"}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
