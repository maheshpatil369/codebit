function LineChart({ data }) {
  if (!data.length) {
    return <p className="text-sm text-gray-500">No analytics available.</p>;
  }

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const width = 320;
  const height = 140;
  const points = data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - (point.value / maxValue) * (height - 16) - 8;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(201,169,110,0.36)" />
            <stop offset="100%" stopColor="rgba(201,169,110,0)" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="rgba(201,169,110,0.9)" strokeWidth="3" points={points} />
        <polygon fill="url(#line-fill)" points={`0,${height} ${points} ${width},${height}`} />
        {data.map((point, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * width;
          const y = height - (point.value / maxValue) * (height - 16) - 8;
          return <circle key={point.label} cx={x} cy={y} r="4" fill="#f5deb3" />;
        })}
      </svg>
      <div className="mt-3 grid grid-cols-3 md:grid-cols-7 gap-2 text-xs text-gray-500">
        {data.map((point) => (
          <div key={point.label}>
            <p>{point.label}</p>
            <p className="text-gray-300 mt-1">{point.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  if (!data.length) {
    return <p className="text-sm text-gray-500">No analytics available.</p>;
  }

  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <div className="space-y-4">
      {data.map((point) => (
        <div key={point.label}>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">{point.label}</span>
            <span className="text-white">{point.value}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(38,38,47,0.9)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(point.value / maxValue) * 100}%`,
                background: "linear-gradient(90deg, var(--gold-600), #93c5fd)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  if (!data.length) {
    return <p className="text-sm text-gray-500">No analytics available.</p>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) {
    return <p className="text-sm text-gray-500">No analytics available.</p>;
  }

  let startAngle = 0;
  const colors = ["#d4a847", "#93c5fd", "#6ee7b7", "#fda4af"];

  const segments = data.map((item, index) => {
    const angle = (item.value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    const x1 = 60 + 42 * Math.cos(startAngle - Math.PI / 2);
    const y1 = 60 + 42 * Math.sin(startAngle - Math.PI / 2);
    const x2 = 60 + 42 * Math.cos(endAngle - Math.PI / 2);
    const y2 = 60 + 42 * Math.sin(endAngle - Math.PI / 2);
    const path = `M ${x1} ${y1} A 42 42 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    const segment = { ...item, path, color: colors[index % colors.length] };
    startAngle = endAngle;
    return segment;
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-36 h-36 flex-shrink-0">
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(38,38,47,0.9)" strokeWidth="16" />
        {segments.map((segment) => (
          <path
            key={segment.label}
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth="16"
            strokeLinecap="round"
          />
        ))}
        <text x="60" y="58" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="700">
          {total}
        </text>
        <text x="60" y="76" textAnchor="middle" fill="#9ca3af" fontSize="10">
          total
        </text>
      </svg>

      <div className="space-y-3 w-full">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: segment.color }} />
              <span className="text-gray-400">{segment.label}</span>
            </div>
            <span className="text-white">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartCard({ title, subtitle, data = [], type = "line", helper }) {
  const chartMap = {
    line: <LineChart data={data} />,
    bar: <BarChart data={data} />,
    donut: <DonutChart data={data} />,
  };

  return (
    <section className="card fade-up">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg text-white font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-400 mt-1">{subtitle}</p> : null}
        </div>
        {helper ? <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">{helper}</span> : null}
      </div>
      {chartMap[type] ?? chartMap.line}
    </section>
  );
}
