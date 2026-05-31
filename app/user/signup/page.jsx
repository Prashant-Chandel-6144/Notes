"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function PasswordStrength({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const score = getStrength();
  const label = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][score];
  const color = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"][score];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? color : "#FDE68A",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</p>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fname: "", lname: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const [step, setStep] = useState(1);

  const validate = () => {
    const e = {};
    if (!form.fname.trim()) e.fname = "First name required";
    if (!form.lname.trim()) e.lname = "Last name required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setApiError(data.message || "Could not create account.");
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

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#44403C",
    marginBottom: 7,
    letterSpacing: "0.02em",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEB", display: "flex", fontFamily: "'Syne', sans-serif" }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: "none",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        background: "#FBBF24",
        position: "relative",
        overflow: "hidden",
      }} className="left-panel">
        {/* Noise texture overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.5 }} />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", position: "relative", zIndex: 1 }}>
          <div style={{ width: 36, height: 36, background: "#1C1917", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📝</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#1C1917", fontWeight: 400 }}>Notely</span>
        </Link>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 44,
            fontWeight: 400,
            color: "#1C1917",
            lineHeight: 1.0,
            letterSpacing: "-1.5px",
            marginBottom: 20,
          }}>
            Think it.<br />Write it.<br /><em>Keep it.</em>
          </h2>
          <p style={{ color: "#78350F", fontSize: 15, lineHeight: 1.7, maxWidth: 300 }}>
            Join thousands of thinkers who trust Notely to capture every idea, thought, and plan.
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Feature checklist */}
          {["Unlimited notes for free", "Instant search & organize", "Secure & always available", "Clean, distraction-free UI"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "#1C1917",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: "#FBBF24", fontSize: 11, fontWeight: 700 }}>✓</span>
              </div>
              <span style={{ fontSize: 14, color: "#1C1917", fontWeight: 500 }}>{item}</span>
            </div>
          ))}
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
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}>
            <div style={{ width: 30, height: 30, background: "#FBBF24", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📝</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#1C1917" }}>Notely</span>
          </Link>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 400, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>
              Create account
            </h1>
            <p style={{ color: "#78716C", fontSize: 15 }}>
              Already have one?{" "}
              <Link href="/user/login" style={{ color: "#F59E0B", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
            </p>
          </div>

          {apiError && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12,
              padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#DC2626",
            }}>
              ⚠ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>FIRST NAME</label>
                <input
                  value={form.fname}
                  placeholder="Jane"
                  onChange={e => setForm(p => ({ ...p, fname: e.target.value }))}
                  onFocus={() => setFocused("fname")}
                  onBlur={() => setFocused("")}
                  style={inputStyle("fname")}
                />
                {errors.fname && <p style={{ marginTop: 5, fontSize: 11, color: "#EF4444" }}>{errors.fname}</p>}
              </div>
              <div>
                <label style={labelStyle}>LAST NAME</label>
                <input
                  value={form.lname}
                  placeholder="Doe"
                  onChange={e => setForm(p => ({ ...p, lname: e.target.value }))}
                  onFocus={() => setFocused("lname")}
                  onBlur={() => setFocused("")}
                  style={inputStyle("lname")}
                />
                {errors.lname && <p style={{ marginTop: 5, fontSize: 11, color: "#EF4444" }}>{errors.lname}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={inputStyle("email")}
              />
              {errors.email && <p style={{ marginTop: 5, fontSize: 12, color: "#EF4444" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  placeholder="Min. 6 characters"
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
              <PasswordStrength password={form.password} />
              {errors.password && <p style={{ marginTop: 5, fontSize: 12, color: "#EF4444" }}>{errors.password}</p>}
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
                marginTop: 4,
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #78350F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.6s linear infinite" }} />
                  Creating your account…
                </span>
              ) : "Create account →"}
            </button>
          </form>

          <p style={{ marginTop: 24, fontSize: 12, color: "#A8A29E", textAlign: "center", lineHeight: 1.6 }}>
            By creating an account, you agree to our{" "}
            <a href="#" style={{ color: "#F59E0B", textDecoration: "none" }}>Terms of Service</a>{" "}
            and{" "}
            <a href="#" style={{ color: "#F59E0B", textDecoration: "none" }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      <style>{`
        @media(min-width: 768px) { .left-panel { display: flex !important; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}