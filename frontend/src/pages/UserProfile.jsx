import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axios";

export default function UserProfile() {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/user/${user_id}/profile`).then((r) => setUser(r.data.data)).catch(() => setError("User not found"));
  }, [user_id]);

  if (error)
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: "#fca5a5" }}>
        <p className="text-lg">{error}</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3" style={{ color: "var(--text-secondary)" }}>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading profile...
        </div>
      </div>
    );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 mesh-bg">
      <div className="glass-card-static p-10 w-full max-w-sm text-center animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
        {/* Avatar */}
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.fullname}
            className="w-24 h-24 rounded-full mx-auto mb-5 object-cover"
            style={{ border: "3px solid var(--accent)", boxShadow: "0 0 20px var(--accent-glow)" }}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-pink))",
              color: "white",
              boxShadow: "0 0 20px var(--accent-glow)",
            }}
          >
            {user.fullname?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <h1 className="text-2xl font-bold text-white">{user.fullname}</h1>
        <p className="text-sm mt-1" style={{ color: "var(--accent-light)" }}>@{user.username}</p>
        <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
          Member since {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
        </p>

        <Link
          to="/private-group"
          className="btn-secondary inline-flex items-center gap-2 mt-8 text-sm no-underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
