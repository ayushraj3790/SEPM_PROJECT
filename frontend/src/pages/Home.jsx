import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* ── Animated floating particles ── */
const FloatingParticle = ({ delay, size, x, y, duration }) => (
  <div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `linear-gradient(135deg, var(--accent), var(--accent-pink))`,
      animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      filter: "blur(1px)",
      opacity: 0.15,
    }}
  />
);

const particles = [
  { delay: 0, size: 6, x: 10, y: 20, duration: 4 },
  { delay: 1.2, size: 8, x: 80, y: 15, duration: 5 },
  { delay: 0.5, size: 5, x: 50, y: 70, duration: 3.5 },
  { delay: 2, size: 10, x: 25, y: 50, duration: 6 },
  { delay: 0.8, size: 4, x: 70, y: 80, duration: 4.5 },
  { delay: 1.5, size: 7, x: 90, y: 40, duration: 5.5 },
];

/* ── Feature Card ── */
const FeatureCard = ({ icon, title, description, delay }) => (
  <div
    className="glass-card animate-fade-in-up"
    style={{ padding: "32px 28px", textAlign: "center", animationDelay: `${delay}s`, opacity: 0 }}
  >
    <div
      style={{
        width: 64, height: 64, margin: "0 auto 20px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))",
        border: "1px solid rgba(139,92,246,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, transition: "transform 0.3s",
      }}
    >
      {icon}
    </div>
    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: 10 }}>{title}</h3>
    <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>{description}</p>
  </div>
);

export default function Home() {
  return (
    <div className="mesh-bg" style={{ minHeight: "100vh", overflow: "hidden" }}>

      {/* ════════ Hero Section ════════ */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
        {/* Particles */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%", opacity: 0.06,
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            top: "5%", left: "-10%",
          }} />
          <div style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%", opacity: 0.04,
            background: "radial-gradient(circle, var(--accent-pink) 0%, transparent 70%)",
            bottom: "10%", right: "-5%",
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          {/* Badge */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 18px", borderRadius: 999,
              border: "1px solid var(--border-accent)",
              background: "rgba(139,92,246,0.08)",
              marginBottom: 28, opacity: 0, animationDelay: "0.1s",
            }}
          >
            <span className="notification-dot" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-light)" }}>
              Your memories, beautifully preserved
            </span>
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-in-up"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, opacity: 0, animationDelay: "0.2s" }}
          >
            Frame Your<br />
            <span className="gradient-text">Precious Moments</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up"
            style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.7, opacity: 0, animationDelay: "0.35s" }}
          >
            Create private circles with family and friends. Share photos, videos,
            and stories in a safe, intimate space — away from the noise of social media.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up"
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, opacity: 0, animationDelay: "0.5s" }}
          >
            <Link to="/auth" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 32px", borderRadius: 16, gap: 8 }}>
              Get Started Free
              <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-secondary" style={{ fontSize: "1rem", padding: "14px 32px", borderRadius: 16 }}>
              Contact Us
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up"
            style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 56, opacity: 0, animationDelay: "0.65s" }}
          >
            {[
              { value: "10K+", label: "Active Users" },
              { value: "50K+", label: "Memories Shared" },
              { value: "99.9%", label: "Uptime" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 900 }}>{s.value}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 500, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Features ════════ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="animate-fade-in-up" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, marginBottom: 12, opacity: 0 }}>
            Everything you need to <span className="gradient-text">preserve memories</span>
          </h2>
          <p className="animate-fade-in-up" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", opacity: 0, animationDelay: "0.1s" }}>
            FrameIT gives your closest circles a private space to share, relive, and cherish moments.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <FeatureCard icon="🔒" title="Private Circles" description="Create invite-only groups for family, friends, or special communities. Only members can see what's shared." delay={0.1} />
          <FeatureCard icon="📸" title="Rich Stories" description="Share text, photos, and videos. Every story is a capsule of memories your group can revisit anytime." delay={0.2} />
          <FeatureCard icon="🔗" title="Easy Invitations" description="Invite people with a simple code. No complicated setup — just share the code and they're in." delay={0.3} />
        </div>
      </section>

      {/* ════════ How it works ════════ */}
      <section style={{ padding: "80px 24px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(139,92,246,0.04) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 className="animate-fade-in-up" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, textAlign: "center", marginBottom: 56, opacity: 0 }}>
            How it <span className="gradient-text">works</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
            {[
              { step: "01", title: "Create a Circle", desc: "Sign up and create your first private group in seconds." },
              { step: "02", title: "Invite Members", desc: "Share the unique invite code with your family or friends." },
              { step: "03", title: "Share Memories", desc: "Post stories with text, photos, and videos for your circle." },
            ].map((item, i) => (
              <div key={i} className="animate-fade-in-up" style={{ textAlign: "center", opacity: 0, animationDelay: `${i * 0.15}s` }}>
                <div className="gradient-text" style={{ fontSize: "3rem", fontWeight: 900, marginBottom: 12 }}>{item.step}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA Banner ════════ */}
      <section style={{ padding: "80px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div
          className="glass-card animate-fade-in-up"
          style={{ padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden", opacity: 0 }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none", background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: 16 }}>
              Ready to start <span className="gradient-text">framing</span>?
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: "0.95rem" }}>
              Join thousands of families preserving their most precious moments.
            </p>
            <Link to="/auth" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 36px", borderRadius: 16, gap: 8 }}>
              Create Your Circle
              <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ Footer ════════ */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 900 }}>FrameIT</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>© {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { to: "/", label: "Home" },
              { to: "/contact", label: "Contact" },
              { to: "/auth", label: "Sign In" },
            ].map((l) => (
              <Link key={l.to} to={l.to} style={{ fontSize: "0.8rem", color: "var(--text-muted)", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = "white"}
                onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
