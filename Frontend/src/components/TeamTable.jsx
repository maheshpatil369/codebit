function formatDate(dateString) {
  return new Date(dateString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const roleTone = {
  Admin: "badge-high",
  "Legal Manager": "badge-medium",
  Analyst: "badge-info",
  Viewer: "badge-low",
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
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b last:border-0" style={{ borderColor: "rgba(38,38,47,0.8)" }}>
                <td className="py-4 text-white">{member.name}</td>
                <td className="py-4">
                  <span className={roleTone[member.role] ?? "badge-info"}>{member.role}</span>
                </td>
                <td className="py-4 text-gray-400">{member.email}</td>
                <td className="py-4 text-gray-500">{formatDate(member.lastActivity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
