"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Login failed. Please check your credentials.");
      router.push("/note");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "var(--bg)",
    }}>
      {/* ── LEFT DARK PANEL ─────────────────────────────────── */}
      <div
        className="dark-panel noise"
        style={{
          width: "44%", flexShrink: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "25%", left: "20%", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(251,191,36,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, background: "var(--amber-500)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 16px rgba(245,158,11,0.35)" }}>📝</div>
            <span className="serif" style={{ color: "#fef9ee", fontSize: "1.2rem" }}>Notely</span>
          </Link>
        </div>

        {/* Hero copy */}
        <div className="anim-fade-up" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px",
            background: "rgba(245,158,11,0.14)",
            border: "1px solid rgba(245,158,11,0.28)",
            borderRadius: 100,
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
            color: "var(--amber-300)", textTransform: "uppercase",
            marginBottom: 18,
          }}>
            ✦ Welcome back
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#fef9ee", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18 }}>
            Your notes<br />
            <em className="gradient-text">are waiting.</em>
          </h1>
          <p style={{ fontSize: "0.92rem", color: "rgba(254,249,238,0.50)", lineHeight: 1.75, maxWidth: 340 }}>
            Sign in and pick up right where you left off. All your ideas, thoughts, and plans — right here.
          </p>
        </div>

        {/* Testimonial card */}
        <div className="anim-fade-up" style={{
          position: "relative", zIndex: 1,
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(245,158,11,0.18)",
          borderRadius: 14, padding: "20px 22px",
        }}>
          <div style={{ color: "var(--amber-400)", fontSize: "0.9rem", letterSpacing: 2, marginBottom: 10 }}>★★★★★</div>
          <p style={{ fontSize: "0.87rem", color: "rgba(254,249,238,0.70)", lineHeight: 1.65, fontStyle: "italic", marginBottom: 14 }}>
            &ldquo;Notely changed how I capture my ideas. It's the first notes app I've actually stuck with.&rdquo;
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--amber-400), var(--amber-700))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", fontWeight: 700, color: "#1a0f00" }}>A</div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fef9ee" }}>Alex M.</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(254,249,238,0.40)" }}>Product Designer</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 48px",
        position: "relative",
        background: "var(--bg)",
      }}>
        {/* Top controls */}
        <div style={{ position: "absolute", top: 28, right: 28, display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/" style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            ← Back
          </Link>
          <button
            onClick={() => setDark(!dark)}
            className={`theme-toggle${dark ? " on" : ""}`}
            aria-label="Toggle theme"
          />
        </div>

        <div style={{ width: "100%", maxWidth: 420 }}>
          <div className="anim-fade-up d-0">
            <h2 className="serif" style={{ fontSize: "2rem", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 8 }}>Sign in</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 36 }}>
              No account?{" "}
              <Link href="/user/signup" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Create one →</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="anim-fade-up d-1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Error */}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label className="input-label" style={{ margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: "0.78rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input"
                  style={{ paddingRight: 46 }}
                  autoComplete="current-password"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "0.95rem", marginTop: 4, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1 }}
            >
              {loading ? <span className="spinner" /> : "Sign in →"}
            </button>
          </form>

          <p className="anim-fade-up d-2" style={{ fontSize: "0.76rem", color: "var(--text-muted)", textAlign: "center", marginTop: 22, lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Terms</a> and{" "}
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          div[style*="width: 44%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}