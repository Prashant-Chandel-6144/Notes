"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function StrengthMeter({ password }) {
  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Symbol", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: i < score ? colors[score - 1] : "var(--border-subtle)",
            transition: "background 0.25s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontSize: "0.68rem", color: c.pass ? "var(--success)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
              {c.pass ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: colors[score - 1] }}>{labels[score - 1]}</span>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notely-theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("notely-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Signup failed. Please try again.");
      router.push("/note");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: "♾️", text: "Unlimited notes — always free" },
    { icon: "🌓", text: "Dark & light amber theme" },
    { icon: "⚡", text: "Blazing fast, under 100ms" },
    { icon: "🔒", text: "Your data, fully private" },
    { icon: "📊", text: "Writing analytics dashboard" },
    { icon: "🔍", text: "Full-text note search" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
      {/* ── LEFT FORM PANEL ─────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 48px",
        position: "relative",
      }}>
        {/* Top controls */}
        <div style={{ position: "absolute", top: 28, left: 28 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📝</div>
            <span className="serif" style={{ color: "var(--text-primary)", fontSize: "1rem" }}>Notely</span>
          </Link>
        </div>
        <div style={{ position: "absolute", top: 28, right: 28, display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/" style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none" }}>← Back</Link>
          <button
            onClick={() => setDark(!dark)}
            className={`theme-toggle${dark ? " on" : ""}`}
            aria-label="Toggle theme"
          />
        </div>

        <div style={{ width: "100%", maxWidth: 440 }}>
          <div className="anim-fade-up d-0">
            <h2 className="serif" style={{ fontSize: "2rem", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 8 }}>Create account</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 36 }}>
              Already have one?{" "}
              <Link href="/user/login" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="anim-fade-up d-1" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && (
              <div style={{
                padding: "12px 16px",
                background: "var(--danger-light)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10,
                fontSize: "0.85rem", color: "var(--danger)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="input-label">First name</label>
                <input
                  type="text" required
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="input"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="input-label">Last name</label>
                <input
                  type="text" required
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="input"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Email address</label>
              <input
                type="email" required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} required
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input"
                  style={{ paddingRight: 46 }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", fontSize: "1rem",
                    display: "flex", alignItems: "center",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <StrengthMeter password={form.password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "0.95rem", marginTop: 4, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1 }}
            >
              {loading ? <span className="spinner" /> : "Create free account →"}
            </button>
          </form>

          <p className="anim-fade-up d-2" style={{ fontSize: "0.76rem", color: "var(--text-muted)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
            By creating an account, you agree to our{" "}
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Terms of Service</a> and{" "}
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* ── RIGHT DARK PANEL ────────────────────────────────── */}
      <div
        className="dark-panel noise"
        style={{
          width: "42%", flexShrink: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "60px 52px",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="anim-float" style={{ fontSize: "3rem", marginBottom: 24 }}>📝</div>

          <h2 className="serif anim-slide-right d-0" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#fef9ee", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
            Start capturing your<br />
            <em className="gradient-text">best ideas today.</em>
          </h2>

          <p className="anim-slide-right d-1" style={{ fontSize: "0.92rem", color: "rgba(254,249,238,0.50)", lineHeight: 1.75, marginBottom: 36, maxWidth: 340 }}>
            Everything you need to write, think, and remember — all in one place, completely free.
          </p>

          <div className="anim-slide-right d-2" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {perks.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 30, height: 30, flexShrink: 0,
                  background: "rgba(245,158,11,0.14)",
                  border: "1px solid rgba(245,158,11,0.22)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.9rem",
                }}>{p.icon}</div>
                <span style={{ fontSize: "0.88rem", color: "rgba(254,249,238,0.70)" }}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Mini note cards */}
          <div className="anim-slide-right d-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 36 }}>
            {[
              ["💡", "New idea brewing"],
              ["📅", "Plan for tomorrow"],
              ["📚", "Reading notes"],
              ["✅", "Tasks: 5 done"],
            ].map(([ic, tx], i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.055)",
                border: "1px solid rgba(245,158,11,0.14)",
                borderRadius: 10, padding: "10px 12px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>{ic}</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(254,249,238,0.58)" }}>{tx}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          div[style*="width: 42%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}