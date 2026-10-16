import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { setBusy(false); setSubmitted(true); setForm({ name: "", email: "", subject: "", message: "" }); }, 1200);
  };

  const infoCards = [
    {
      icon: <svg style={{ width: 22, height: 22 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
      title: "Email Us", content: "support@frameit.app", sub: "We respond within 24 hours",
    },
    {
      icon: <svg style={{ width: 22, height: 22 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
      title: "Location", content: "India", sub: "SEPM Project Team",
    },
    {
      icon: <svg style={{ width: 22, height: 22 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: "Hours", content: "Mon – Sat, 9 AM – 6 PM", sub: "IST (Indian Standard Time)",
    },
  ];

  return (
    <div className="mesh-bg" style={{ minHeight: "100vh" }}>

      {/* ═══ Header ═══ */}
      <section style={{ paddingTop: 120, paddingBottom: 48, paddingLeft: 24, paddingRight: 24, textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <h1 className="animate-fade-in-up" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, marginBottom: 16, opacity: 0, animationDelay: "0.1s" }}>
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="animate-fade-in-up" style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-secondary)", opacity: 0, animationDelay: "0.2s" }}>
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ═══ Content Grid ═══ */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 32, alignItems: "start" }}>

          {/* Left — Info Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {infoCards.map((item, i) => (
              <div
                key={i}
                className="glass-card animate-fade-in-up"
                style={{ padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 16, opacity: 0, animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))",
                  border: "1px solid rgba(139,92,246,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent-light)",
                }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "white", marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ fontWeight: 600, color: "var(--accent-light)", fontSize: "0.9rem" }}>{item.content}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Form */}
          <div className="glass-card-static animate-fade-in-up" style={{ padding: 32, opacity: 0, animationDelay: "0.2s" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }} className="animate-fade-in">
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "white", marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ fontSize: "0.85rem" }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: 24 }}>Send us a message</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Your Name</label>
                    <input className="input-field" placeholder="John Doe" value={form.name} onChange={set("name")} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Email Address</label>
                    <input className="input-field" type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} required />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Subject</label>
                  <input className="input-field" placeholder="How can we help?" value={form.subject} onChange={set("subject")} required />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Message</label>
                  <textarea className="input-field" rows={5} placeholder="Tell us more..." value={form.message} onChange={set("message")} required style={{ resize: "vertical" }} />
                </div>

                <button type="submit" disabled={busy} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 14, gap: 8 }}>
                  {busy ? (
                    <>
                      <svg style={{ width: 18, height: 18 }} className="animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 900 }}>FrameIT</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>© {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[{ to: "/", label: "Home" }, { to: "/contact", label: "Contact" }, { to: "/auth", label: "Sign In" }].map((l) => (
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
