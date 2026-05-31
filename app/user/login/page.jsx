"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      // Replace with your actual login endpoint
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setApiError(data.message || "Invalid credentials");
        return;
      }
      router.push("/note");
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1.5px solid ${errors[name] ? "#EF4444" : focused === name ? "#FBBF24" : "#FDE68A"}`,
    background: focused === name ? "#fff" : "#FFFBEB",
    fontSize: 15,
    fontFamily: "'Syne', sans-serif",
    color: "#1C1917",
    outline: "none",
    transition: "all 0.2s",
    boxShadow: focused === name ? "0 0 0 3px rgba(251,191,36,0.18)" : "none",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFBEB",
      display: "flex",
      fontFamily: "'Syne', sans-serif",
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: "none",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
        background: "#1C1917",
        position: "relative",
        overflow: "hidden",
      }}
        className="left-panel"
      >
        {/* Decorative grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(251,191,36,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 64 }}>
            <div style={{ width: 36, height: 36, background: "#FBBF24", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📝</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#FEF3C7" }}>Notely</span>
          </Link>

          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 400, color: "#FEF3C7", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20 }}>
            Welcome<br /><em style={{ color: "#FBBF24" }}>back.</em>
          </h2>
          <p style={{ color: "#A8A29E", fontSize: 15, lineHeight: 1.7, marginBottom: 48 }}>
            Your notes are waiting. Pick up right where you left off.
          </p>

          {/* Testimonial card */}
          <div style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 16,
            padding: "24px 28px",
          }}>
            <p style={{ color: "#D6D3D1", fontSize: 15, lineHeight: 1.7, fontFamily: "'Fraunces', serif", fontStyle: "italic", marginBottom: 16 }}>
              "Notely changed how I capture my ideas. It's the first notes app I've actually stuck with."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#78350F" }}>A</div>
              <div>
                <div style={{ color: "#FEF3C7", fontSize: 13, fontWeight: 600 }}>Alex M.</div>
                <div style={{ color: "#78716C", fontSize: 12 }}>Product Designer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 5%",
        minWidth: 0,
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Mobile logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}>
            <div style={{ width: 30, height: 30, background: "#FBBF24", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📝</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#1C1917" }}>Notely</span>
          </Link>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 400, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>
              Sign in
            </h1>
            <p style={{ color: "#78716C", fontSize: 15 }}>
              Don't have an account?{" "}
              <Link href="/user/signup" style={{ color: "#F59E0B", fontWeight: 700, textDecoration: "none" }}>Sign up →</Link>
            </p>
          </div>

          {apiError && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 14,
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              ⚠ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403C", marginBottom: 7, letterSpacing: "0.02em" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={inputStyle("email")}
              />
              {errors.email && <p style={{ marginTop: 6, fontSize: 12, color: "#EF4444" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#44403C", letterSpacing: "0.02em" }}>PASSWORD</label>
                <a href="#" style={{ fontSize: 12, color: "#F59E0B", textDecoration: "none", fontWeight: 600 }}>Forgot?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  placeholder="••••••••"
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  style={{ ...inputStyle("password"), paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#A8A29E" }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <p style={{ marginTop: 6, fontSize: 12, color: "#EF4444" }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                background: loading ? "#FDE68A" : "#FBBF24",
                color: "#1C1917",
                border: "none",
                borderRadius: 13,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 16px rgba(251,191,36,0.4)",
                letterSpacing: "0.01em",
                marginTop: 4,
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #78350F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.6s linear infinite" }} />
                  Signing in…
                </span>
              ) : "Sign in →"}
            </button>
          </form>

          <div style={{ marginTop: 32, paddingTop: 28, borderTop: "1px solid #FDE68A", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#A8A29E" }}>
              By signing in, you agree to our{" "}
              <a href="#" style={{ color: "#F59E0B", textDecoration: "none" }}>Terms</a> and{" "}
              <a href="#" style={{ color: "#F59E0B", textDecoration: "none" }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width: 768px) { .left-panel { display: flex !important; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}