import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";
import { saveAuth } from "../services/auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = await adminLogin(username, password);
      saveAuth(auth);
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
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

        body { background: var(--dark-900); }

        .login-root {
          min-height: 100vh;
          background: var(--dark-900);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ambient glow bg */
        .login-root::before {
          content: '';
          position: absolute;
          top: -200px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(181,147,90,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* grid lines */
        .login-root::after {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }

        .card {
          background: var(--dark-800);
          border: 1px solid var(--dark-500);
          border-radius: 20px;
          padding: 48px 40px;
          width: 400px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.6s ease both;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.05);
        }

        .logo-wrap {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 36px;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: var(--gold-500);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          color: var(--text-primary);
        }
        .logo-badge {
          font-size: 10px; font-weight: 500;
          background: rgba(201,169,110,0.12);
          color: var(--gold-400);
          border: 1px solid rgba(201,169,110,0.2);
          border-radius: 100px;
          padding: 2px 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-left: 4px;
        }

        .heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }
        .subheading {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 32px;
          font-weight: 300;
        }

        .field { margin-bottom: 16px; }
        .label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .input-wrap {
          position: relative;
        }
        .input-wrap .icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 15px; opacity: 0.5; pointer-events: none;
        }
        .input-wrap input {
          width: 100%;
          background: var(--dark-700);
          border: 1px solid var(--dark-500);
          border-radius: 10px;
          padding: 12px 44px 12px 40px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--text-primary);
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .input-wrap input::placeholder { color: var(--text-muted); }
        .input-wrap input:focus {
          border-color: var(--gold-500);
          box-shadow: 0 0 0 3px rgba(181,147,90,0.12);
        }
        .toggle-pass {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 14px; opacity: 0.4;
          transition: opacity 0.2s;
          color: var(--text-primary);
        }
        .toggle-pass:hover { opacity: 0.8; }

        .error-box {
          display: flex; align-items: center; gap: 8px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 18px;
          font-size: 13px;
          color: #f87171;
          animation: shake 0.4s ease;
        }

        .submit-btn {
          width: 100%; margin-top: 8px;
          background: var(--gold-500);
          color: white;
          border: none; border-radius: 10px;
          padding: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.02em;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--gold-600);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(181,147,90,0.3);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .divider {
          border: none;
          border-top: 1px solid var(--dark-500);
          margin: 28px 0 20px;
        }

        .hint {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.6;
        }
        .hint span {
          display: inline-flex; align-items: center; gap: 4px;
          background: var(--dark-700);
          border: 1px solid var(--dark-500);
          border-radius: 6px;
          padding: 1px 7px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: var(--text-secondary);
        }
      `}</style>

      <div className="login-root">
        <div className="card">
          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">⚖️</div>
            <span className="logo-text">Lex</span>
            <span className="logo-badge">Admin</span>
          </div>

          <h1 className="heading">Welcome back</h1>
          <p className="subheading">Sign in to access the admin dashboard</p>

          {/* Error */}
          {error && (
            <div className="error-box">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="label">Admin ID</label>
              <div className="input-wrap">
                <span className="icon">👤</span>
                <input
                  type="text"
                  placeholder="Enter admin ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="input-wrap">
                <span className="icon">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <><div className="spinner" /> Signing in...</>
              ) : (
                <>Sign In →</>
              )}
            </button>
          </form>

          <hr className="divider" />
          <p className="hint">
            Demo credentials &nbsp;·&nbsp; ID: <span>admin</span> &nbsp; Pass: <span>1234</span>
          </p>
        </div>
      </div>
    </>
  );
}
