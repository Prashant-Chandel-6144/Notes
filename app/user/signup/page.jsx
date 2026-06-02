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
  const score = checks.filter((c) => c.pass).length;
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 7 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background: i < score ? colors[score - 1] : "rgba(255,255,255,0.08)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {checks.map((c) => (
            <span
              key={c.label}
              style={{
                fontSize: "0.68rem",
                color: c.pass ? "#22c55e" : "rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 3,
                transition: "color 0.25s",
              }}
            >
              {c.pass ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: colors[score - 1] }}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(245,158,11,0.2)",
  borderRadius: 10,
  color: "#fef9ee",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "rgba(254,249,238,0.45)",
  marginBottom: 7,
};

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

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
      if (!res.ok) throw new Error(data.error || data.message || "Signup failed. Please try again.");
      router.push("/note");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: "♾️", text: "Unlimited notes — always free" },
    { icon: "⚡", text: "Blazing fast, under 100ms" },
    { icon: "🔒", text: "Your data, fully private" },
    { icon: "📊", text: "Writing analytics dashboard" },
    { icon: "🔍", text: "Full-text note search" },
    { icon: "🌓", text: "Beautiful dark & light themes" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0a05; }
        .field-input:focus {
          border-color: rgba(245,158,11,0.6) !important;
          background: rgba(245,158,11,0.06) !important;
        }
        .field-input::placeholder { color: rgba(254,249,238,0.2); }
        .submit-btn { transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(245,158,11,0.35); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .perk-row { transition: transform 0.2s; }
        .perk-row:hover { transform: translateX(4px); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .anim-0 { animation: fadeUp 0.5s ease both; }
        .anim-1 { animation: fadeUp 0.5s 0.1s ease both; }
        .anim-2 { animation: fadeUp 0.5s 0.2s ease both; }
        .panel-anim { animation: slideIn 0.6s 0.1s ease both; }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
        @media (max-width: 768px) { .right-panel { display: none !important; } .form-panel { padding: 32px 24px !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif", background: "#0d0a05" }}>

        {/* ── LEFT FORM PANEL ── */}
        <div
          className="form-panel"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 56px",
            position: "relative",
            background: "#0d0a05",
          }}
        >
          {/* Subtle glow */}
          <div style={{ position: "absolute", top: "30%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ position: "absolute", top: 28, left: 32 }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}>📝</div>
              <span style={{ fontFamily: "'DM Serif Display', serif", color: "#fef9ee", fontSize: "1.05rem" }}>Notely</span>
            </Link>
          </div>

          {/* Back */}
          <div style={{ position: "absolute", top: 34, right: 32 }}>
            <Link href="/" style={{ fontSize: "0.8rem", color: "rgba(254,249,238,0.35)", textDecoration: "none", letterSpacing: "0.02em" }}>← Back</Link>
          </div>

          <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
            <div className="anim-0">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 100, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", color: "#f59e0b", textTransform: "uppercase", marginBottom: 18 }}>
                ✦ Free forever
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", color: "#fef9ee", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 8 }}>
                Create your account
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(254,249,238,0.4)", marginBottom: 36 }}>
                Already have one?{" "}
                <Link href="/user/login" style={{ color: "#f59e0b", fontWeight: 600, textDecoration: "none" }}>Sign in →</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="anim-1" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, fontSize: "0.84rem", color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input
                    type="text" required
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="field-input"
                    style={{ ...inputStyle }}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input
                    type="text" required
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="field-input"
                    style={{ ...inputStyle }}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email" required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="field-input"
                  style={{ ...inputStyle }}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"} required
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="field-input"
                    style={{ ...inputStyle, paddingRight: 48 }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(254,249,238,0.35)", fontSize: "1rem", display: "flex", alignItems: "center" }}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                <StrengthMeter password={form.password} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
                style={{ width: "100%", padding: "14px", marginTop: 4, background: loading ? "rgba(245,158,11,0.5)" : "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", borderRadius: 10, color: "#1a0f00", fontSize: "0.92rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.01em" }}
              >
                {loading ? <span className="spinner" /> : "Create free account →"}
              </button>
            </form>

            <p className="anim-2" style={{ fontSize: "0.73rem", color: "rgba(254,249,238,0.25)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
              By creating an account you agree to our{" "}
              <a href="#" style={{ color: "#f59e0b", textDecoration: "none" }}>Terms</a> and{" "}
              <a href="#" style={{ color: "#f59e0b", textDecoration: "none" }}>Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="right-panel panel-anim"
          style={{ width: "42%", flexShrink: 0, background: "#110e06", borderLeft: "1px solid rgba(245,158,11,0.1)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: "15%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="float" style={{ fontSize: "2.8rem", marginBottom: 28 }}>📝</div>

            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", color: "#fef9ee", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 14 }}>
              Start capturing your<br />
              <em style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>best ideas today.</em>
            </h2>

            <p style={{ fontSize: "0.88rem", color: "rgba(254,249,238,0.4)", lineHeight: 1.8, marginBottom: 36, maxWidth: 320 }}>
              Everything you need to write, think, and remember — all in one place, completely free.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {perks.map((p, i) => (
                <div key={i} className="perk-row" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, flexShrink: 0, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.88rem" }}>{p.icon}</div>
                  <span style={{ fontSize: "0.86rem", color: "rgba(254,249,238,0.6)" }}>{p.text}</span>
                </div>
              ))}
            </div>

            {/* Mini note cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["💡", "New idea brewing"], ["📅", "Plan for tomorrow"], ["📚", "Reading notes"], ["✅", "Tasks: 5 done"]].map(([ic, tx], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.85rem" }}>{ic}</span>
                  <span style={{ fontSize: "0.73rem", color: "rgba(254,249,238,0.45)" }}>{tx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}