import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--dark-900)' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }}
      />

      {/* Card */}
      <div className="fade-up relative z-10 flex flex-col items-center text-center max-w-lg px-6">
        {/* Logo mark */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-8 glow-gold"
          style={{
            background: 'linear-gradient(135deg, #c9a96e, #e2c47a)',
            color: '#0d0d0f',
            fontFamily: 'Cormorant Garamond, serif',
          }}
        >
          L
        </div>

        <p className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-3">
          Legal AI Platform
        </p>

        <h1
          className="text-5xl font-semibold text-gradient mb-4 leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          LexNova Admin
        </h1>

        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          Monitor user activity, review AI query logs, and manage your legal intelligence platform from one unified dashboard.
        </p>

        <Link to="/admin-login">
          <button className="btn-gold text-base px-8 py-3">
            Admin Login →
          </button>
        </Link>

        <p className="text-xs text-gray-600 mt-6">Restricted access · Authorized personnel only</p>
      </div>

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--dark-500) 1px, transparent 1px), linear-gradient(90deg, var(--dark-500) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}