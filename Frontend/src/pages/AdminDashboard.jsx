import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8000";

// ─── API helpers (read-only – GET + health only) ───────────────────────────────
async function fetchHealth() {
  const r = await fetch(`${BASE_URL}/health`);
  if (!r.ok) throw new Error(`Health check failed (${r.status})`);
  return r.json();
}
async function fetchDocumentTypes() {
  const r = await fetch(`${BASE_URL}/api/v1/document-types`);
  if (!r.ok) throw new Error(`Document types failed (${r.status})`);
  return r.json();
}
async function fetchRoot() {
  const r = await fetch(`${BASE_URL}/`);
  if (!r.ok) throw new Error(`Root failed (${r.status})`);
  return r.json();
}

// ─── Tiny sub-components ───────────────────────────────────────────────────────

function StatusDot({ ok }) {
  return (
    <span style={{
      display: "inline-block",
      width: 8, height: 8, borderRadius: "50%",
      background: ok ? "#4ade80" : "#f87171",
      boxShadow: ok ? "0 0 6px #4ade8088" : "0 0 6px #f8717188",
      animation: ok ? "pulse 2s ease infinite" : "none",
      flexShrink: 0,
    }} />
  );
}

function StatCard({ label, value, icon, color, sub, loading }) {
  return (
    <div style={{
      background: "var(--dark-800)",
      border: "1px solid var(--dark-500)",
      borderRadius: 16,
      padding: "22px 20px",
      display: "flex", flexDirection: "column", gap: 12,
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-500)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--dark-500)"; e.currentTarget.style.transform = ""; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 500 }}>
          {label}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: color || "rgba(201,169,110,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>{icon}</div>
      </div>
      {loading ? (
        <div style={{ height: 28, width: "55%", borderRadius: 6, background: "var(--dark-600)", animation: "shimmer 1.5s ease infinite" }} />
      ) : (
        <p style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: "'Cormorant Garamond', serif" }}>
          {value}
        </p>
      )}
      {sub && <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</p>}
    </div>
  );
}

function Skeleton({ w = "100%", h = 14 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background: "var(--dark-600)",
      animation: "shimmer 1.5s ease infinite",
    }} />
  );
}

function SectionHeader({ title, sub, badge }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: "1px solid var(--dark-500)",
    }}>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{sub}</p>}
      </div>
      {badge != null && (
        <span style={{
          fontSize: 11, padding: "3px 10px", borderRadius: 100,
          background: "rgba(201,169,110,0.1)",
          color: "var(--gold-400)",
          border: "1px solid rgba(201,169,110,0.2)",
        }}>{badge}</span>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();

  // guard
  useEffect(() => {
    if (!localStorage.getItem("adminLoggedIn")) navigate("/admin-login");
  }, [navigate]);

  const [health, setHealth]   = useState(null);
  const [docTypes, setDocTypes] = useState(null);
  const [appInfo, setAppInfo]  = useState(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [h, dt, ai] = await Promise.all([fetchHealth(), fetchDocumentTypes(), fetchRoot()]);
      setHealth(h);
      setDocTypes(dt);
      setAppInfo(ai);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Derived counts
  const totalCategories = docTypes ? Object.keys(docTypes).length : 0;
  const totalDocTypes   = docTypes ? Object.values(docTypes).flat().length : 0;

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --dark-900: #0f0d0a;
          --dark-800: #161310;
          --dark-700: #1f1b16;
          --dark-600: #2a2520;
          --dark-500: #3a342c;
          --gold-400: #c9a96e;
          --gold-500: #b5935a;
          --gold-600: #9a7a48;
          --text-primary: #f0ebe4;
          --text-secondary: #9a8a78;
          --text-muted: #5a5040;
        }

        body { background: var(--dark-900); font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; } 50% { opacity:0.4; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-color: var(--dark-600); }
          50%  { background-color: var(--dark-500); }
          100% { background-color: var(--dark-600); }
        }

        .dashboard-root {
          display: flex; flex-direction: column;
          height: 100vh; overflow: hidden;
          background: var(--dark-900);
        }

        /* ── Navbar ── */
        .navbar {
          height: 60px;
          background: var(--dark-800);
          border-bottom: 1px solid var(--dark-500);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px;
          flex-shrink: 0;
          z-index: 10;
        }
        .nav-left { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 34px; height: 34px;
          background: var(--gold-500); border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600;
          color: var(--text-primary);
        }
        .admin-badge {
          font-size: 10px; font-weight: 500;
          background: rgba(201,169,110,0.12);
          color: var(--gold-400);
          border: 1px solid rgba(201,169,110,0.2);
          border-radius: 100px;
          padding: 2px 8px;
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        .nav-right { display: flex; align-items: center; gap: 12px; }
        .refresh-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--dark-700);
          border: 1px solid var(--dark-500);
          border-radius: 8px;
          padding: 7px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }
        .refresh-btn:hover { border-color: var(--gold-500); color: var(--text-primary); }
        .logout-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 7px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: #f87171;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.14); }

        /* ── Layout ── */
        .body-wrap {
          display: flex; flex: 1; overflow: hidden;
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 220px; flex-shrink: 0;
          background: var(--dark-800);
          border-right: 1px solid var(--dark-500);
          padding: 20px 12px;
          display: flex; flex-direction: column; gap: 4px;
          overflow-y: auto;
        }
        .sidebar-section {
          font-size: 10px; font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 10px 10px 6px;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 9px;
          font-size: 13px; color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .nav-item:hover  { background: var(--dark-700); color: var(--text-primary); }
        .nav-item.active {
          background: rgba(181,147,90,0.12);
          color: var(--gold-400);
          border: 1px solid rgba(181,147,90,0.15);
        }
        .nav-icon { font-size: 15px; flex-shrink: 0; }

        /* ── Main ── */
        .main {
          flex: 1; overflow-y: auto;
          padding: 28px;
          display: flex; flex-direction: column; gap: 24px;
        }

        /* ── Cards ── */
        .panel {
          background: var(--dark-800);
          border: 1px solid var(--dark-500);
          border-radius: 16px;
          overflow: hidden;
          animation: fadeUp 0.5s ease both;
        }

        .panel-body { padding: 20px; }

        /* health info row */
        .info-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--dark-600);
          font-size: 13px;
        }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .info-key { color: var(--text-secondary); font-weight: 400; }
        .info-val {
          color: var(--text-primary); font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }

        /* doc types grid */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          padding: 20px;
        }
        .cat-card {
          background: var(--dark-700);
          border: 1px solid var(--dark-600);
          border-radius: 12px;
          padding: 14px 16px;
          transition: border-color 0.2s, transform 0.2s;
          cursor: default;
        }
        .cat-card:hover { border-color: var(--gold-500); transform: translateY(-2px); }
        .cat-name {
          font-size: 13px; font-weight: 500;
          color: var(--text-primary); margin-bottom: 6px;
          text-transform: capitalize;
        }
        .cat-count {
          display: inline-flex; align-items: center;
          background: rgba(201,169,110,0.1);
          color: var(--gold-400);
          font-size: 11px; padding: 2px 8px; border-radius: 100px;
          border: 1px solid rgba(201,169,110,0.15);
          margin-bottom: 10px;
        }
        .doc-pill {
          display: inline-block;
          font-size: 10px; color: var(--text-muted);
          background: var(--dark-600);
          border-radius: 4px;
          padding: 2px 6px; margin: 2px 2px 0 0;
          line-height: 1.6;
        }

        /* error */
        .error-bar {
          display: flex; align-items: center; gap: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 13px; color: #f87171;
          animation: fadeUp 0.4s ease;
        }

        /* endpoint table */
        .ep-row {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 20px;
          border-bottom: 1px solid var(--dark-600);
          font-size: 12px;
        }
        .ep-row:last-child { border-bottom: none; }
        .method {
          font-size: 10px; font-weight: 700;
          padding: 2px 7px; border-radius: 4px;
          letter-spacing: 0.06em; flex-shrink: 0;
        }
        .get  { background: rgba(74,210,149,0.12); color: #4ad295; border: 1px solid rgba(74,210,149,0.2); }
        .post { background: rgba(96,165,250,0.12); color: #60a5fa; border: 1px solid rgba(96,165,250,0.2); }
        .ep-path { color: var(--text-primary); font-family: 'Courier New', monospace; }
        .ep-desc { color: var(--text-muted); margin-left: auto; text-align: right; }

        .spinner-sm {
          width: 14px; height: 14px;
          border: 2px solid rgba(201,169,110,0.2);
          border-top-color: var(--gold-400);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--dark-500); border-radius: 3px; }
      `}</style>

      <div className="dashboard-root">
        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="nav-left">
            <div className="logo-icon">⚖️</div>
            <span className="logo-name">Lex</span>
            <span className="admin-badge">Admin</span>
          </div>
          <div className="nav-right">
            {lastRefresh && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Updated {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            <button className="refresh-btn" onClick={load} disabled={loading}>
              {loading ? <span className="spinner-sm" /> : "↻"} Refresh
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              ⎋ Logout
            </button>
          </div>
        </nav>

        <div className="body-wrap">
          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-section">Overview</div>
            <div className="nav-item active">
              <span className="nav-icon">📊</span> Dashboard
            </div>
            <div className="nav-item">
              <span className="nav-icon">🩺</span> System Health
            </div>

            <div className="sidebar-section" style={{ marginTop: 8 }}>Platform</div>
            <div className="nav-item">
              <span className="nav-icon">📄</span> Document Types
            </div>
            <div className="nav-item">
              <span className="nav-icon">🤖</span> AI Endpoints
            </div>
            <div className="nav-item">
              <span className="nav-icon">⚖️</span> Legal Chatbot
            </div>
            <div className="nav-item">
              <span className="nav-icon">🌐</span> Translation
            </div>

            <div className="sidebar-section" style={{ marginTop: 8 }}>System</div>
            <div className="nav-item">
              <span className="nav-icon">📋</span> API Docs
            </div>
            <div className="nav-item">
              <span className="nav-icon">📁</span> Logs
            </div>

            <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--dark-500)" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                Legal AI Backend<br />
                <span style={{ color: "var(--gold-400)" }}>
                  {appInfo?.version ?? "—"}
                </span>
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="main">
            {/* Page header */}
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30, fontWeight: 700,
                background: "linear-gradient(135deg, #c9a96e, #f0ebe4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}>Dashboard</h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Read-only overview of the Lexnova Legal AI platform
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="error-bar">
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div>
                  <p style={{ fontWeight: 500 }}>Could not reach backend</p>
                  <p style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{error} — make sure the server is running on {BASE_URL}</p>
                </div>
                <button onClick={load} style={{
                  marginLeft: "auto", background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#f87171", borderRadius: 7,
                  padding: "5px 12px", cursor: "pointer",
                  fontFamily: "DM Sans", fontSize: 12,
                }}>Retry</button>
              </div>
            )}

            {/* ── Stat Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, animation: "fadeUp 0.5s 0.05s ease both" }}>
              <StatCard
                label="Backend Status"
                value={loading ? "—" : (health?.status === "healthy" ? "Healthy" : "Degraded")}
                icon="🩺"
                color={health?.status === "healthy" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)"}
                loading={loading}
              />
              <StatCard
                label="Ollama LLM"
                value={loading ? "—" : (health?.ollama === "connected" ? "Connected" : "Offline")}
                icon="🤖"
                color="rgba(96,165,250,0.1)"
                sub={health?.model ?? ""}
                loading={loading}
              />
              <StatCard
                label="Doc Categories"
                value={loading ? "—" : totalCategories}
                icon="📂"
                color="rgba(201,169,110,0.1)"
                sub="Supported types"
                loading={loading}
              />
              <StatCard
                label="Document Templates"
                value={loading ? "—" : totalDocTypes}
                icon="📄"
                color="rgba(167,139,250,0.1)"
                sub="Across all categories"
                loading={loading}
              />
            </div>

            {/* ── Two column row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeUp 0.5s 0.1s ease both" }}>

              {/* Health Info */}
              <div className="panel">
                <SectionHeader title="System Health" sub="Live from /health endpoint" />
                <div className="panel-body">
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[...Array(4)].map((_, i) => <Skeleton key={i} h={16} w={`${70 + i * 5}%`} />)}
                    </div>
                  ) : health ? (
                    <>
                      <div className="info-row">
                        <span className="info-key">Status</span>
                        <span className="info-val">
                          <StatusDot ok={health.status === "healthy"} />
                          {health.status}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-key">Ollama</span>
                        <span className="info-val">
                          <StatusDot ok={health.ollama === "connected"} />
                          {health.ollama}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-key">Ollama URL</span>
                        <span className="info-val" style={{ fontFamily: "monospace", fontSize: 12 }}>
                          {health.ollama_url}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-key">Model</span>
                        <span className="info-val" style={{ fontFamily: "monospace", fontSize: 12 }}>
                          {health.model}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No data available</p>
                  )}
                </div>
              </div>

              {/* App Info */}
              <div className="panel">
                <SectionHeader title="Application Info" sub="From / root endpoint" />
                <div className="panel-body">
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[...Array(4)].map((_, i) => <Skeleton key={i} h={16} w={`${65 + i * 7}%`} />)}
                    </div>
                  ) : appInfo ? (
                    <>
                      <div className="info-row">
                        <span className="info-key">Name</span>
                        <span className="info-val">{appInfo.name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-key">Version</span>
                        <span className="info-val">
                          <span style={{
                            background: "rgba(201,169,110,0.1)", color: "var(--gold-400)",
                            border: "1px solid rgba(201,169,110,0.2)",
                            borderRadius: 100, padding: "1px 8px", fontSize: 11,
                          }}>v{appInfo.version}</span>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-key">Status</span>
                        <span className="info-val">
                          <StatusDot ok={appInfo.status === "running"} />
                          {appInfo.status}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-key">API Docs</span>
                        <a href={`${BASE_URL}/docs`} target="_blank" rel="noreferrer"
                          style={{ color: "var(--gold-400)", fontSize: 12, textDecoration: "none" }}>
                          {BASE_URL}/docs ↗
                        </a>
                      </div>
                    </>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── API Endpoints Overview ── */}
            <div className="panel" style={{ animation: "fadeUp 0.5s 0.15s ease both" }}>
              <SectionHeader title="API Endpoints" sub="All available routes — read-only view" badge="12 routes" />
              {[
                { method: "GET",  path: "/",                                      desc: "App info & version" },
                { method: "GET",  path: "/health",                                desc: "Ollama + server health" },
                { method: "GET",  path: "/api/v1/document-types",                 desc: "List all document categories" },
                { method: "POST", path: "/api/v1/upload-document",                desc: "Upload & process PDF/DOCX" },
                { method: "GET",  path: "/api/v1/analyze-stream/{document_id}",   desc: "SSE — summary, risk, fairness, safety" },
                { method: "GET",  path: "/api/v1/document-summary/{document_id}", desc: "Plain-language summary" },
                { method: "GET",  path: "/api/v1/risk-analysis/{document_id}",    desc: "Red flags & risk score" },
                { method: "GET",  path: "/api/v1/clause-fairness/{document_id}",  desc: "Clause fairness rating" },
                { method: "GET",  path: "/api/v1/safety-score/{document_id}",     desc: "Overall safety score (0–100)" },
                { method: "POST", path: "/api/v1/chat-with-document",             desc: "RAG Q&A on a document" },
                { method: "POST", path: "/api/v1/legal-chat",                     desc: "General legal chatbot" },
                { method: "POST", path: "/api/v1/translate",                      desc: "Multi-language translation" },
              ].map((ep, i) => (
                <div className="ep-row" key={i}>
                  <span className={`method ${ep.method.toLowerCase()}`}>{ep.method}</span>
                  <span className="ep-path">{ep.path}</span>
                  <span className="ep-desc">{ep.desc}</span>
                </div>
              ))}
            </div>

            {/* ── Document Categories ── */}
            <div className="panel" style={{ animation: "fadeUp 0.5s 0.2s ease both" }}>
              <SectionHeader
                title="Supported Document Categories"
                sub="From /api/v1/document-types"
                badge={loading ? "…" : `${totalCategories} categories · ${totalDocTypes} types`}
              />
              {loading ? (
                <div className="cat-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                      background: "var(--dark-700)", borderRadius: 12,
                      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
                    }}>
                      <Skeleton h={14} w="60%" />
                      <Skeleton h={10} w="40%" />
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <Skeleton h={18} w={60} /><Skeleton h={18} w={80} /><Skeleton h={18} w={70} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : docTypes ? (
                <div className="cat-grid">
                  {Object.entries(docTypes).map(([cat, types]) => (
                    <div className="cat-card" key={cat}>
                      <div className="cat-name">{cat.replace(/_/g, " ")}</div>
                      <div className="cat-count">{types.length} types</div>
                      <div>
                        {types.map(t => (
                          <span className="doc-pill" key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 24, color: "var(--text-muted)", fontSize: 13 }}>
                  No categories loaded
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </>
  );
}