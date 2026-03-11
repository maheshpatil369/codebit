const tones = {
  gold: {
    glow: "rgba(201,169,110,0.16)",
    border: "rgba(201,169,110,0.28)",
    text: "var(--gold-400)",
  },
  blue: {
    glow: "rgba(96,165,250,0.16)",
    border: "rgba(96,165,250,0.24)",
    text: "#93c5fd",
  },
  emerald: {
    glow: "rgba(16,185,129,0.16)",
    border: "rgba(16,185,129,0.24)",
    text: "#6ee7b7",
  },
  rose: {
    glow: "rgba(244,63,94,0.16)",
    border: "rgba(244,63,94,0.24)",
    text: "#fda4af",
  },
};

export default function StatCard({ label, value, icon, helper, trend, tone = "gold" }) {
  const palette = tones[tone] ?? tones.gold;

  return (
    <div
      className="card relative overflow-hidden fade-up"
      style={{
        background: "linear-gradient(180deg, rgba(28,28,36,0.96), rgba(17,17,21,0.96))",
        borderColor: palette.border,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-20"
        style={{ background: `radial-gradient(circle at top, ${palette.glow}, transparent 72%)` }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
          {helper ? <p className="mt-2 text-sm text-gray-400">{helper}</p> : null}
        </div>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg"
          style={{ background: palette.glow, color: palette.text, border: `1px solid ${palette.border}` }}
        >
          {icon}
        </div>
      </div>
      {trend ? <p className="relative mt-5 text-xs" style={{ color: palette.text }}>{trend}</p> : null}
    </div>
  );
}
