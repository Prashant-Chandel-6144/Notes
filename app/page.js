"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Shared styles injected once ─────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #fdfaf4;
    --surface: #ffffff;
    --surface-alt: #fef9ee;
    --border: rgba(0,0,0,0.08);
    --border-subtle: rgba(0,0,0,0.05);
    --border-strong: rgba(245,158,11,0.25);
    --text-primary: #1a0f00;
    --text-secondary: #5c4a2a;
    --text-muted: #9a8060;
    --text-faint: #c4a97a;
    --accent: #f59e0b;
    --accent-glow: rgba(245,158,11,0.35);
    --accent-light: rgba(245,158,11,0.1);
    --amber-300: #fcd34d;
    --amber-400: #fbbf24;
    --amber-500: #f59e0b;
    --amber-700: #b45309;
    --danger: #ef4444;
    --danger-light: rgba(239,68,68,0.08);
    --success: #22c55e;
    --shadow-xs: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.1);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
    --shadow-xl: 0 20px 60px rgba(0,0,0,0.15);
    --shadow-accent: 0 4px 14px rgba(245,158,11,0.35);
  }

  html.dark {
    --bg: #0d0a05;
    --surface: #141008;
    --surface-alt: #1a1407;
    --border: rgba(255,255,255,0.07);
    --border-subtle: rgba(255,255,255,0.04);
    --border-strong: rgba(245,158,11,0.2);
    --text-primary: #fef9ee;
    --text-secondary: rgba(254,249,238,0.6);
    --text-muted: rgba(254,249,238,0.38);
    --text-faint: rgba(254,249,238,0.2);
    --accent-light: rgba(245,158,11,0.12);
    --shadow-xs: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.4);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.5);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.6);
    --shadow-xl: 0 20px 60px rgba(0,0,0,0.7);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text-primary); transition: background 0.3s, color 0.3s; }

  .serif { font-family: 'DM Serif Display', serif; }
  .gradient-text { background: linear-gradient(135deg, var(--amber-500), var(--amber-700)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 600; text-decoration: none; transition: all 0.18s; white-space: nowrap; }
  .btn-primary { background: linear-gradient(135deg, #f59e0b, #d97706); color: #1a0f00; box-shadow: var(--shadow-accent); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,158,11,0.45); }
  .btn-primary:active { transform: translateY(0); }
  .btn-outline { background: transparent; color: var(--text-primary); border: 1.5px solid var(--border-strong); }
  .btn-outline:hover { background: var(--accent-light); border-color: var(--accent); }
  .btn-ghost { background: transparent; color: var(--text-secondary); }
  .btn-ghost:hover { background: var(--accent-light); color: var(--text-primary); }

  /* Cards */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; transition: border-color 0.2s, box-shadow 0.2s; }
  .card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); }
  .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--border); }
  html.dark .glass { background: rgba(20,16,8,0.7); }

  /* Badge */
  .badge { display: inline-flex; align-items: center; gap: 7px; padding: 5px 14px; border-radius: 100px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
  .badge-amber { background: var(--accent-light); border: 1px solid var(--border-strong); color: var(--amber-700); }
  html.dark .badge-amber { color: var(--amber-400); }

  /* Theme toggle */
  .theme-toggle { width: 40px; height: 22px; border-radius: 11px; background: var(--border-strong); border: 1.5px solid var(--border-strong); cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .theme-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .theme-toggle.on { background: var(--amber-700); border-color: var(--amber-700); }
  .theme-toggle.on::after { transform: translateX(18px); }

  /* Animations */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideRight { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes float { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(0.8); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .anim-fade-up { animation: fadeUp 0.55s ease both; }
  .anim-slide-right { animation: slideRight 0.55s ease both; }
  .anim-float { animation: float 5s ease-in-out infinite; }
  .d-0 { animation-delay: 0s; } .d-1 { animation-delay: 0.08s; } .d-2 { animation-delay: 0.16s; }
  .d-3 { animation-delay: 0.24s; } .d-4 { animation-delay: 0.32s; } .d-5 { animation-delay: 0.4s; }

  .marquee-track { display: inline-flex; animation: marquee 22s linear infinite; }

  /* Nav */
  .nav-item { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: all 0.15s; }
  .nav-item:hover, .nav-item.active { background: var(--accent-light); color: var(--text-primary); }

  /* Feature card hover */
  .feat-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
  .feat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
`;

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar({ dark, setDark, scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px",
      background: scrolled ? (dark ? "rgba(13,10,5,0.88)" : "rgba(253,250,244,0.88)") : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition: "all 0.35s",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 14px rgba(245,158,11,0.35)", transition: "transform 0.2s" }}>📝</div>
        <span className="serif" style={{ fontSize: "1.2rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Notely</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <a href="#features" className="nav-item">Features</a>
        <a href="#how-it-works" className="nav-item">How it works</a>
        <a href="#testimonials" className="nav-item">Reviews</a>
        <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 6px" }} />
        <button onClick={() => setDark(!dark)} className={`theme-toggle${dark ? " on" : ""}`} aria-label="Toggle theme" />
        <Link href="/user/login" className="btn btn-outline" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>Sign in</Link>
        <Link href="/user/signup" className="btn btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>Get started →</Link>
      </div>
    </nav>
  );
}

/* ─── Float Card ─────────────────────────────────────────── */
function FloatCard({ emoji, text, subtext, delay }) {
  return (
    <div className="glass" style={{
      padding: "13px 16px", borderRadius: 14, maxWidth: 190,
      boxShadow: "var(--shadow-lg)",
      animation: `float ${4 + Math.random()}s ease-in-out ${delay}s infinite`,
    }}>
      <div style={{ fontSize: "1.25rem", marginBottom: 5 }}>{emoji}</div>
      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{text}</div>
      {subtext && <div style={{ fontSize: "0.67rem", color: "var(--text-muted)", marginTop: 3 }}>{subtext}</div>}
    </div>
  );
}

/* ─── Feature Card ─────────────────────────────────────── */
function FeatureCard({ icon, title, desc, index }) {
  return (
    <div className="card feat-card anim-fade-up" style={{ animationDelay: `${index * 0.07}s`, padding: "28px 26px", display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 90, height: 90, background: "radial-gradient(circle at top right, var(--accent-light), transparent 70%)" }} />
      <div style={{ width: 48, height: 48, background: "var(--accent-light)", border: "1px solid var(--border-strong)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>{icon}</div>
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 7 }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.68 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Step Card ────────────────────────────────────────── */
function StepCard({ num, title, desc, index }) {
  return (
    <div className="anim-fade-up" style={{ animationDelay: `${index * 0.09}s`, display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ width: 46, height: 46, flexShrink: 0, background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.95rem", color: "#1a0f00", boxShadow: "0 4px 14px rgba(245,158,11,0.35)" }}>{num}</div>
      <div style={{ paddingTop: 4 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.68 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Testimonial ─────────────────────────────────────── */
function Testimonial({ quote, name, role, avatar, index }) {
  return (
    <div className="card anim-fade-up" style={{ animationDelay: `${index * 0.1}s`, padding: "26px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ color: "#f59e0b", fontSize: "1.1rem", letterSpacing: 3 }}>★★★★★</div>
      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.75, fontStyle: "italic", flex: 1 }}>&ldquo;{quote}&rdquo;</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.88rem", fontWeight: 800, color: "#1a0f00" }}>{avatar}</div>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{name}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────── */
export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("notely-theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("notely-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const features = [
    { icon: "⚡", title: "Instant & blazing fast", desc: "Everything responds in under 100ms. Search, save, switch — all without any lag." },
    { icon: "🔍", title: "Full-text search", desc: "Find any note in seconds with powerful search across all titles and content." },
    { icon: "🌓", title: "Dark & light mode", desc: "A beautiful amber theme that looks stunning in both dark and light environments." },
    { icon: "🔒", title: "Private & secure", desc: "Your notes are yours. Stored securely, never shared or sold to third parties." },
    { icon: "♾️", title: "Unlimited notes", desc: "No paywalls, no note limits. Write as much as you need, completely free." },
    { icon: "📊", title: "Writing analytics", desc: "Track your writing streaks, word counts, and productivity patterns over time." },
  ];

  const steps = [
    { num: "01", title: "Create your account", desc: "Sign up in seconds — no credit card, no nonsense. Just an email and you're in." },
    { num: "02", title: "Start your first note", desc: "Click new note and start writing. The editor stays out of your way entirely." },
    { num: "03", title: "Organize & search", desc: "Find any note instantly with search, or sort by date and alphabetically." },
    { num: "04", title: "Track your progress", desc: "Visit the analytics page to see your writing habits and daily streaks." },
  ];

  const testimonials = [
    { quote: "Notely changed how I capture my ideas. It's the first notes app I've actually stuck with.", name: "Alex M.", role: "Product Designer", avatar: "A" },
    { quote: "The dark mode is gorgeous and the amber color theme is so easy on my eyes during late-night writing sessions.", name: "Sarah K.", role: "Novelist", avatar: "S" },
    { quote: "Finally an app that doesn't get in my way. Clean, fast, and actually free.", name: "Dev R.", role: "Software Engineer", avatar: "D" },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar dark={dark} setDark={setDark} scrolled={scrolled} />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "110px 24px 80px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        {/* Background glows */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 55% at 50% 10%, rgba(245,158,11,0.13) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Floating cards */}
        <div style={{ position: "absolute", top: "18%", right: "7%", zIndex: 2 }}><FloatCard emoji="💡" text="New product idea..." subtext="Just now" delay={0} /></div>
        <div style={{ position: "absolute", top: "38%", left: "4%", zIndex: 2 }}><FloatCard emoji="📋" text="Q3 meeting notes" subtext="Yesterday" delay={1.5} /></div>
        <div style={{ position: "absolute", bottom: "20%", right: "5%", zIndex: 2 }}><FloatCard emoji="✅" text="Tasks done: 7 / 8" subtext="Today" delay={0.8} /></div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
          <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 26 }}>
            <span style={{ width: 6, height: 6, background: "#f59e0b", borderRadius: "50%", animation: "pulse-dot 2s infinite", display: "inline-block" }} />
            Free forever — no subscription needed
          </div>

          <h1 className="serif anim-fade-up d-1" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 1.04, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: 28 }}>
            Your thoughts,{" "}
            <em className="gradient-text">finally</em>
            <br />
            <span style={{ fontWeight: 400 }}>organized.</span>
          </h1>

          <p className="anim-fade-up d-2" style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.78, maxWidth: 520, margin: "0 auto 42px" }}>
            A minimal, blazing-fast notes app. Capture ideas, organize thoughts, and never lose something important again.
          </p>

          <div className="anim-fade-up d-3" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <Link href="/user/signup" className="btn btn-primary" style={{ fontSize: "1rem", padding: "15px 34px" }}>Start writing free →</Link>
            <Link href="/user/login" className="btn btn-outline" style={{ fontSize: "1rem", padding: "15px 28px" }}>Sign in</Link>
          </div>

          {/* Stat row */}
          <div className="anim-fade-up d-4" style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ val: "10k+", label: "Notes written" }, { val: "< 100ms", label: "Response time" }, { val: "100%", label: "Free forever" }, { val: "∞", label: "Note capacity" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 30px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div className="serif gradient-text" style={{ fontSize: "2.1rem", lineHeight: 1.1 }}>{s.val}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "0.14em", zIndex: 1, animation: "float 3s ease-in-out infinite" }}>
          <span>SCROLL</span>
          <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom, var(--accent), transparent)" }} />
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", overflow: "hidden", padding: "12px 0", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex" }}>
          <div className="marquee-track">
            {Array(4).fill(["Capture ideas", "Stay organized", "Write freely", "Think clearly", "Save moments", "Build knowledge", "Find anything", "Never forget"].map(t => `${t} ✦`).join("   ")).map((chunk, ci) => (
              <span key={ci} style={{ fontWeight: 800, fontSize: "0.76rem", letterSpacing: "0.13em", color: "#1a0f00", textTransform: "uppercase", paddingRight: 56 }}>{chunk}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" style={{ maxWidth: 1180, margin: "0 auto", padding: "110px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 18 }}>Why Notely</div>
          <h2 className="serif anim-fade-up d-1" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 16 }}>
            Everything you need,{" "}<em className="gradient-text">nothing you don't.</em>
          </h2>
          <p className="anim-fade-up d-2" style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.72 }}>
            Notely strips away complexity. No bloat, no ads, no upsells — just a clean space to think.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" style={{ background: dark ? "linear-gradient(145deg,#0f0c06,#1a1407)" : "linear-gradient(145deg,#fffbeb,#fef3c7)", padding: "110px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 20 }}>How it works</div>
            <h2 className="serif anim-fade-up d-1" style={{ fontSize: "clamp(2rem, 4vw, 2.9rem)", letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 52, lineHeight: 1.13 }}>
              Up and writing<br /><em className="gradient-text">in under a minute.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 38 }}>
              {steps.map((s, i) => <StepCard key={i} {...s} index={i} />)}
            </div>
          </div>

          {/* App preview */}
          <div className="anim-fade-up d-2" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow-xl)" }}>
            <div style={{ background: dark ? "var(--surface-alt)" : "#fffbeb", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", opacity: 0.7 }} />
              <div style={{ flex: 1, height: 20, background: "var(--border)", borderRadius: 4, marginLeft: 8, opacity: 0.5 }} />
            </div>
            <div style={{ display: "flex", height: 330 }}>
              <div style={{ width: 168, background: dark ? "var(--surface-alt)" : "#fffbeb", borderRight: "1px solid var(--border)", padding: 12, display: "flex", flexDirection: "column", gap: 5 }}>
                {["Meeting Notes", "Book Ideas", "Daily Log", "Project Plan"].map((n, i) => (
                  <div key={i} style={{ padding: "8px 10px", borderRadius: 8, background: i === 0 ? "var(--accent-light)" : "transparent", borderLeft: `3px solid ${i === 0 ? "#f59e0b" : "transparent"}`, fontSize: "0.71rem", fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#d97706" : "var(--text-secondary)" }}>{n}</div>
                ))}
              </div>
              <div style={{ flex: 1, padding: "20px 24px" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>Meeting Notes</div>
                <div style={{ height: 2, background: "linear-gradient(to right, #f59e0b, transparent)", marginBottom: 14, opacity: 0.5 }} />
                {[95, 70, 65, 80].map((w, i) => (
                  <div key={i} style={{ height: 11, background: "var(--border)", borderRadius: 6, marginBottom: 8, width: `${w}%`, opacity: 0.65 }} />
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
                  <div style={{ padding: "4px 10px", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 100, fontSize: "0.62rem", color: "#d97706", fontWeight: 700 }}>AUTO-SAVED ✓</div>
                  <div style={{ padding: "4px 10px", background: "var(--border)", borderRadius: 100, fontSize: "0.62rem", color: "var(--text-muted)" }}>142 words</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section id="testimonials" style={{ maxWidth: 1180, margin: "0 auto", padding: "110px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 18 }}>Loved by writers</div>
          <h2 className="serif anim-fade-up d-1" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            What people are <em className="gradient-text">saying.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => <Testimonial key={i} {...t} index={i} />)}
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 130px" }}>
        <div style={{ background: "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)", borderRadius: 24, padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 24px 80px rgba(245,158,11,0.3)" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -100, left: -50, width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(rgba(0,0,0,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.4) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "2.8rem", marginBottom: 20 }}>🚀</div>
            <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#1a0f00", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>Ready to start writing?</h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(26,15,0,0.65)", maxWidth: 440, margin: "0 auto 38px", lineHeight: 1.72 }}>Join thousands of writers and thinkers already using Notely every day.</p>
            <Link href="/user/signup" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 42px", background: "#1a0f00", color: "#fcd34d", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", borderRadius: 12, textDecoration: "none", boxShadow: "0 6px 24px rgba(0,0,0,0.28)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.28)"; }}>
              Create free account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📝</div>
          <span className="serif" style={{ color: "var(--text-primary)", fontSize: "1rem" }}>Notely</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>© {new Date().getFullYear()} Notely. All rights reserved.</p>
        <div style={{ display: "flex", gap: 22 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = "#f59e0b"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}