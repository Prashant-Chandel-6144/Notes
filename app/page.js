"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Theme Toggle ─────────────────────────────────────── */
function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className={`theme-toggle${dark ? " on" : ""}`}
      aria-label="Toggle dark mode"
      title={dark ? "Switch to light" : "Switch to dark"}
    />
  );
}

/* ─── Navbar ───────────────────────────────────────────── */
function Navbar({ dark, setDark, scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav
      className={scrolled ? "glass" : ""}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "0 32px" : "0 32px",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all 0.3s",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, background: "var(--accent)", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, boxShadow: "var(--shadow-accent)",
          transition: "transform 0.2s",
        }}>📝</div>
        <span className="serif" style={{ fontSize: "1.25rem", color: "var(--text-primary)", fontWeight: 400, letterSpacing: "-0.01em" }}>
          Notely
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <a href="#features" className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>Features</a>
        <a href="#how-it-works" className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>How it works</a>
        <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
        <ThemeToggle dark={dark} setDark={setDark} />
        <Link href="/user/login" className="btn btn-outline" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>Sign in</Link>
        <Link href="/user/signup" className="btn btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
          Get started <span style={{ opacity: 0.7 }}>→</span>
        </Link>
      </div>
    </nav>
  );
}

/* ─── Floating note card ───────────────────────────────── */
function FloatCard({ emoji, text, subtext, style }) {
  return (
    <div className="glass card" style={{
      padding: "12px 16px", borderRadius: 12,
      maxWidth: 200, position: "absolute",
      boxShadow: "var(--shadow-md)",
      ...style,
    }}>
      <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{text}</div>
      {subtext && <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 3 }}>{subtext}</div>}
    </div>
  );
}

/* ─── Feature card ─────────────────────────────────────── */
function FeatureCard({ icon, title, desc, index }) {
  return (
    <div
      className={`card anim-fade-up d-${index}`}
      style={{
        padding: "28px 24px",
        display: "flex", flexDirection: "column", gap: 14,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: "radial-gradient(circle at top right, var(--accent-light), transparent 70%)",
      }} />
      <div style={{
        width: 46, height: 46,
        background: "var(--accent-light)",
        border: "1px solid var(--border-strong)",
        borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem",
      }}>{icon}</div>
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Step card ────────────────────────────────────────── */
function StepCard({ num, title, desc, index }) {
  return (
    <div className={`anim-fade-up d-${index}`} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{
        width: 44, height: 44, flexShrink: 0,
        background: "var(--accent)",
        borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: "1rem", color: "#1a0f00",
        boxShadow: "var(--shadow-accent)",
      }}>{num}</div>
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Testimonial ──────────────────────────────────────── */
function Testimonial({ quote, name, role, avatar, index }) {
  return (
    <div className={`card anim-fade-up d-${index}`} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ color: "var(--accent)", fontSize: "1.3rem", letterSpacing: 2 }}>★★★★★</div>
      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic" }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, var(--amber-400), var(--amber-700))`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.85rem", fontWeight: 700, color: "#1a0f00",
        }}>{avatar}</div>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{name}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Landing ─────────────────────────────────────── */
export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

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
    { quote: "The dark mode is gorgeous and the amber color theme is so easy on my eyes during late night writing sessions.", name: "Sarah K.", role: "Novelist", avatar: "S" },
    { quote: "Finally an app that doesn't get in my way. Clean, fast, and actually free.", name: "Dev R.", role: "Software Engineer", avatar: "D" },
  ];

  return (
    <>
      <Navbar dark={dark} setDark={setDark} scrolled={scrolled} />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "100px 24px 80px",
          position: "relative", overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Background mesh */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: dark
            ? "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(251,191,36,0.10) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(245,158,11,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "10%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Floating decorative notes */}
        <FloatCard
          emoji="💡" text="New product idea..." subtext="Just now"
          style={{ top: "18%", right: "8%", animationDelay: "0s", animation: "float 5s ease-in-out infinite" }}
        />
        <FloatCard
          emoji="📋" text="Q3 meeting notes" subtext="Yesterday"
          style={{ top: "40%", left: "4%", animationDelay: "1.5s", animation: "float 6s ease-in-out 1.5s infinite" }}
        />
        <FloatCard
          emoji="✅" text="Tasks done: 7/8" subtext="Today"
          style={{ bottom: "22%", right: "5%", animationDelay: "0.8s", animation: "float 4.5s ease-in-out 0.8s infinite" }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", animation: "pulse-dot 2s infinite" }} />
            Free & open — no subscription needed
          </div>

          <h1
            className="serif anim-fade-up d-1"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: 28,
            }}
          >
            Your thoughts,{" "}
            <em className="gradient-text" style={{ fontStyle: "italic" }}>
              finally
            </em>
            <br />
            <span style={{ fontWeight: 400 }}>organized.</span>
          </h1>

          <p className="anim-fade-up d-2" style={{
            fontSize: "1.15rem", color: "var(--text-secondary)",
            lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px",
          }}>
            A minimal, blazing-fast notes app. Capture ideas, organize thoughts,
            and never lose something important again.
          </p>

          <div className="anim-fade-up d-3" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/user/signup" className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
              Start writing free →
            </Link>
            <Link href="/user/login" className="btn btn-outline" style={{ fontSize: "1rem", padding: "14px 28px" }}>
              Sign in
            </Link>
          </div>

          {/* Stat row */}
          <div className="anim-fade-up d-4" style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { val: "10k+", label: "Notes written" },
              { val: "< 100ms", label: "Response time" },
              { val: "100%", label: "Free forever" },
              { val: "∞", label: "Note capacity" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 28px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div className="serif gradient-text" style={{ fontSize: "2rem", lineHeight: 1.1 }}>{s.val}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="anim-float" style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          color: "var(--text-muted)", fontSize: "0.68rem", letterSpacing: "0.12em",
          zIndex: 1,
        }}>
          <span>SCROLL</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, var(--accent), transparent)" }} />
        </div>
      </section>

      {/* ── MARQUEE ────────────────────────────────────────────── */}
      <div style={{
        background: "var(--accent)", overflow: "hidden",
        padding: "11px 0", whiteSpace: "nowrap",
      }}>
        <div className="marquee-track" style={{ display: "flex", gap: 0 }}>
          {Array(2).fill(
            ["Capture ideas", "Stay organized", "Write freely", "Think clearly",
             "Save moments", "Build knowledge", "Find anything", "Never forget"]
              .map(t => `${t} ✦`).join("   ")
          ).map((chunk, ci) => (
            <span key={ci} style={{
              fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.12em",
              color: "#1a0f00", textTransform: "uppercase", paddingRight: 48,
            }}>{chunk}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 16 }}>Why Notely</div>
          <h2 className="serif anim-fade-up d-1" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 16 }}>
            Everything you need,{" "}
            <em className="gradient-text">nothing you don't.</em>
          </h2>
          <p className="anim-fade-up d-2" style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Notely strips away complexity. No bloat, no ads, no upsells — just a clean space to think.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {features.map((f, i) => <FeatureCard key={i} {...f} index={i % 6} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" style={{
        background: dark
          ? "linear-gradient(145deg, #0f0d06 0%, #1a1608 100%)"
          : "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
        padding: "100px 24px",
      }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 20 }}>How it works</div>
            <h2 className="serif anim-fade-up d-1" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 48, lineHeight: 1.15 }}>
              Up and writing<br />
              <em className="gradient-text">in under a minute.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {steps.map((s, i) => <StepCard key={i} {...s} index={i} />)}
            </div>
          </div>
          {/* App preview card */}
          <div className="anim-slide-right d-2" style={{
            background: dark ? "var(--surface)" : "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "var(--shadow-xl)",
          }}>
            {/* Mock topbar */}
            <div style={{
              background: dark ? "var(--surface-alt)" : "#fffbeb",
              borderBottom: "1px solid var(--border)",
              padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", opacity: 0.6 }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", opacity: 0.6 }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", opacity: 0.6 }} />
              <div style={{ flex: 1, height: 20, background: "var(--border)", borderRadius: 4, marginLeft: 8, opacity: 0.5 }} />
            </div>
            {/* Mock editor */}
            <div style={{ display: "flex", height: 320 }}>
              <div style={{ width: 160, background: dark ? "var(--surface-alt)" : "#fffbeb", borderRight: "1px solid var(--border)", padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {["Meeting Notes", "Book Ideas", "Daily Log", "Project Plan"].map((n, i) => (
                  <div key={i} style={{
                    padding: "8px 10px",
                    borderRadius: 7,
                    background: i === 0 ? "var(--accent-light)" : "transparent",
                    borderLeft: `3px solid ${i === 0 ? "var(--accent)" : "transparent"}`,
                    fontSize: "0.72rem",
                    fontWeight: i === 0 ? 700 : 500,
                    color: i === 0 ? "var(--accent)" : "var(--text-secondary)",
                  }}>{n}</div>
                ))}
              </div>
              <div style={{ flex: 1, padding: "20px 24px" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Meeting Notes</div>
                <div style={{ height: 2, background: "linear-gradient(to right, var(--accent), transparent)", marginBottom: 16, opacity: 0.5 }} />
                {["Discussed Q3 targets with the team...", "— Increase social budget by 20%", "— Launch product v2.1 by July", "Action: Schedule follow-up Friday"].map((line, i) => (
                  <div key={i} style={{ height: 12, background: "var(--border)", borderRadius: 6, marginBottom: 8, width: `${[95,70,65,80][i]}%`, opacity: 0.7 }} />
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
                  <div style={{ padding: "4px 10px", background: "var(--accent-light)", border: "1px solid var(--border-strong)", borderRadius: 100, fontSize: "0.65rem", color: "var(--amber-700)", fontWeight: 700 }}>AUTO-SAVED ✓</div>
                  <div style={{ padding: "4px 10px", background: "var(--border)", borderRadius: 100, fontSize: "0.65rem", color: "var(--text-muted)" }}>142 words</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="badge badge-amber anim-fade-up d-0" style={{ marginBottom: 16 }}>Loved by writers</div>
          <h2 className="serif anim-fade-up d-1" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            What people are <em className="gradient-text">saying.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => <Testimonial key={i} {...t} index={i} />)}
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{
          background: "linear-gradient(135deg, var(--amber-500) 0%, var(--amber-700) 100%)",
          borderRadius: 24, padding: "72px 48px", textAlign: "center",
          position: "relative", overflow: "hidden",
          boxShadow: "var(--shadow-xl)",
        }}>
          {/* Circles */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -100, left: -50, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          {/* Grid pattern */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "2.8rem", marginBottom: 20 }}>🚀</div>
            <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#1a0f00", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
              Ready to start writing?
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(26,15,0,0.65)", maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>
              Join thousands of writers and thinkers already using Notely every day.
            </p>
            <Link href="/user/signup" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px",
              background: "#1a0f00",
              color: "var(--amber-300)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: "1rem",
              borderRadius: 12, textDecoration: "none",
              boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              transition: "all 0.2s",
            }}>
              Create free account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
        maxWidth: 1160, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📝</div>
          <span className="serif" style={{ color: "var(--text-primary)", fontSize: "1rem" }}>Notely</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>© 2025 Notely. All rights reserved.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = "var(--accent)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}