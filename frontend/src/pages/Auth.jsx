import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { useAuth } from "../utils/authContext";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ identifier: "", password: "", fullname: "", username: "", email: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/private-group", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      let res;
      if (mode === "register") {
        const { fullname, username, email, password } = form;
        const fd = new FormData();
        Object.entries({ fullname, username, email, password }).forEach(([k, v]) => fd.append(k, v));
        res = await api.post("/user/register", fd);
      } else {
        const identifier = form.identifier;
        res = await api.post("/user/login", { identifier, password: form.password });
      }
      login(res.data.data);
      navigate("/private-group");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-12 relative">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            top: "-10%",
            right: "10%",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, var(--accent-pink) 0%, transparent 70%)",
            bottom: "5%",
            left: "5%",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
        {/* Logo */}
        <Link to="/" className="block text-center mb-8 no-underline">
          <h1 className="text-3xl font-black gradient-text inline-block">FrameIT</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Your private memory vault
          </p>
        </Link>

        {/* Form Card */}
        <div className="glass-card-static p-8">
          <h2 className="text-2xl font-bold text-white mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            {mode === "login"
              ? "Sign in to access your circles"
              : "Start preserving your memories today"}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                  <input className="input-field" placeholder="John Doe" value={form.fullname} onChange={set("fullname")} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Username</label>
                  <input className="input-field" placeholder="johndoe" value={form.username} onChange={set("username")} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
                  <input className="input-field" type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} required />
                </div>
              </>
            )}

            {mode === "login" && (
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Email or Username</label>
                <input className="input-field" placeholder="Email or username" value={form.identifier} onChange={set("identifier")} required />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />
            </div>

            {error && (
              <div
                className="p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#fca5a5",
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              disabled={busy}
              className="btn-primary w-full py-4 text-base rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              {busy ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Please wait...
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={switchMode}
              className="text-sm font-semibold bg-transparent border-0 cursor-pointer transition-colors"
              style={{ color: "var(--accent-light)" }}
              onMouseEnter={(e) => (e.target.style.color = "#c4b5fd")}
              onMouseLeave={(e) => (e.target.style.color = "var(--accent-light)")}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs inline-flex items-center gap-1 transition-colors no-underline"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
