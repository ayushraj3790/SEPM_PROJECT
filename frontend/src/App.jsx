import { Outlet, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./utils/authContext";
import api from "./utils/axios";

export function Protected({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

/* ── Floating Navbar for public pages ── */
export function PublicNavbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
      padding: "0 24px",
      background: "rgba(10, 10, 26, 0.85)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="gradient-text" style={{ fontSize: "1.3rem", fontWeight: 900 }}>FrameIT</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { to: "/", label: "Home" },
            { to: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: "0.85rem", fontWeight: 500, padding: "8px 14px", borderRadius: 10,
                color: isActive(link.to) ? "var(--accent-light)" : "var(--text-secondary)",
                background: isActive(link.to) ? "rgba(139,92,246,0.1)" : "transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isActive(link.to)) e.target.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { if (!isActive(link.to)) e.target.style.color = "var(--text-secondary)"; }}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <Link to="/private-group" className="btn-primary" style={{ marginLeft: 12, padding: "8px 20px", fontSize: "0.8rem", gap: 6 }}>
              Dashboard
              <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ marginLeft: 12, padding: "8px 20px", fontSize: "0.8rem" }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ── App Layout for authenticated pages ── */
export default function App() {
  const { isAuthenticated, auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post("/user/logout"); } catch { /* token may already be invalid */ }
    logout();
    navigate("/auth");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Dashboard header */}
      <header style={{
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10, 10, 26, 0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
        flexShrink: 0,
      }}>
        <Link to="/private-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 900 }}>FrameIT</span>
        </Link>

        {isAuthenticated && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link to="/" style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-muted)", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}
            >Home</Link>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--accent-pink))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: "white",
              }}>
                {auth?.user?.fullname?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)" }}>
                {auth?.user?.fullname}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                fontSize: "0.75rem", fontWeight: 500, padding: "6px 14px", borderRadius: 8,
                color: "var(--text-muted)", background: "transparent",
                border: "1px solid var(--border-subtle)", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#fca5a5";
                e.target.style.borderColor = "rgba(239,68,68,0.3)";
                e.target.style.background = "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--text-muted)";
                e.target.style.borderColor = "var(--border-subtle)";
                e.target.style.background = "transparent";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </main>
    </div>
  );
}
