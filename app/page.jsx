"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MARQUEE_WORDS = ["Capture ideas", "Stay organized", "Write freely", "Think clearly", "Save moments", "Build knowledge", "Stay focused", "Never forget"];

function FloatingNote({ style, delay, children }) {
  return (
    <div style={{
      position: "absolute",
      background: "#fff",
      border: "1.5px solid #FDE68A",
      borderRadius: 16,
      padding: "14px 18px",
      boxShadow: "0 8px 32px rgba(120,53,15,0.1)",
      fontSize: 13,
      color: "#44403C",
      fontFamily: "'Syne', sans-serif",
      maxWidth: 200,
      lineHeight: 1.5,
      pointerEvents: "none",
      userSelect: "none",
      ...style,
      animation: `${style.animName || "noteFloat1"} ${style.duration || "4s"} ease-in-out infinite`,
      animationDelay: delay || "0s",
    }}>
      <div style={{ width: 24, height: 3, background: "#FBBF24", borderRadius: 2, marginBottom: 8 }} />
      {children}
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fade-up"
      style={{
        animationDelay: delay,
        background: hovered ? "#FBBF24" : "#fff",
        border: "1.5px solid",
        borderColor: hovered ? "#F59E0B" : "#FDE68A",
        borderRadius: 20,
        padding: "28px 26px",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 40px rgba(251,191,36,0.3)" : "0 2px 8px rgba(120,53,15,0.04)",
        cursor: "default",
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        background: hovered ? "rgba(255,255,255,0.35)" : "#FFFBEB",
        border: `1.5px solid ${hovered ? "rgba(255,255,255,0.5)" : "#FDE68A"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        marginBottom: 18,
        transition: "all 0.25s",
      }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 20,
        fontWeight: 500,
        color: hovered ? "#1C1917" : "#1C1917",
        marginBottom: 8,
        lineHeight: 1.2,
      }}>{title}</h3>
      <p style={{
        fontSize: 14,
        color: hovered ? "#78350F" : "#78716C",
        lineHeight: 1.65,
        transition: "color 0.25s",
      }}>{desc}</p>
    </div>
  );
}

function StatBadge({ number, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 40,
        fontWeight: 500,
        color: "#1C1917",
        lineHeight: 1,
      }}>{number}</div>
      <div style={{ fontSize: 13, color: "#78716C", marginTop: 4, fontFamily: "'Syne', sans-serif" }}>{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEB", overflowX: "hidden" }}>
      {/* Cursor glow */}
      <div style={{
        position: "fixed",
        left: cursorPos.x - 150,
        top: cursorPos.y - 150,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
        transition: "left 0.1s, top 0.1s",
      }} />

      {/* Navbar */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 5%",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(255,251,235,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #FDE68A" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: "#FBBF24",
            borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>📝</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: "#1C1917" }}>Notely</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/user/login" style={{
            padding: "8px 20px",
            fontSize: 14,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            color: "#78350F",
            textDecoration: "none",
            borderRadius: 10,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#FEF3C7"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >Log in</Link>
          <Link href="/user/signup" style={{
            padding: "8px 22px",
            fontSize: 14,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            color: "#1C1917",
            textDecoration: "none",
            background: "#FBBF24",
            borderRadius: 10,
            transition: "all 0.15s",
            boxShadow: "0 2px 8px rgba(251,191,36,0.4)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F59E0B"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(251,191,36,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#FBBF24"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(251,191,36,0.4)"; }}
          >Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 5% 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, #FDE68A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.35,
        }} />

        {/* Floating notes */}
        <FloatingNote style={{ top: "18%", left: "8%", animName: "noteFloat1", duration: "5s" }} delay="0s">
          Meeting at 3pm — bring the deck
        </FloatingNote>
        <FloatingNote style={{ top: "25%", right: "7%", animName: "noteFloat2", duration: "4.5s" }} delay="0.8s">
          🎯 Launch checklist<br/>
          <span style={{ color: "#FBBF24" }}>✓</span> Design  <span style={{ color: "#FBBF24" }}>✓</span> Build
        </FloatingNote>
        <FloatingNote style={{ bottom: "22%", left: "10%", animName: "noteFloat3", duration: "6s" }} delay="1.2s">
          "The best ideas come at the worst times"
        </FloatingNote>
        <FloatingNote style={{ bottom: "18%", right: "9%", animName: "noteFloat1", duration: "5.5s" }} delay="0.4s">
          📚 Books to read<br/>Atomic Habits...
        </FloatingNote>

        {/* Hero content */}
        <div style={{ textAlign: "center", maxWidth: 720, position: "relative", zIndex: 1 }}>
          <div className="animate-fade-up" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #FDE68A",
            borderRadius: 100,
            padding: "6px 16px 6px 8px",
            marginBottom: 32,
            boxShadow: "0 2px 12px rgba(251,191,36,0.2)",
          }}>
            <span style={{ background: "#FBBF24", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 700, color: "#78350F", letterSpacing: "0.05em" }}>NEW</span>
            <span style={{ fontSize: 13, color: "#78350F", fontFamily: "'Syne', sans-serif" }}>Notes that think with you →</span>
          </div>

          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 400,
            lineHeight: 1.0,
            color: "#1C1917",
            marginBottom: 24,
            letterSpacing: "-2px",
          }}>
            Your thoughts,
            <br />
            <em style={{ color: "#F59E0B", fontStyle: "italic" }}>finally organized.</em>
          </h1>

          <p className="animate-fade-up delay-200" style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "#78716C",
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}>
            A minimal, blazing-fast notes app. Capture ideas, organize your thoughts,
            and never lose an important thought again.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/user/signup" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#FBBF24",
              color: "#1C1917",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 14,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(251,191,36,0.45)",
              transition: "all 0.2s",
              border: "2px solid #F59E0B",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(251,191,36,0.45)"; }}
            >
              Start for free →
            </Link>
            <Link href="/note" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff",
              color: "#1C1917",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 14,
              textDecoration: "none",
              border: "1.5px solid #FDE68A",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.background = "#FFFBEB"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#FDE68A"; e.currentTarget.style.background = "#fff"; }}
            >
              View notes
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{
        overflow: "hidden",
        borderTop: "1.5px solid #FDE68A",
        borderBottom: "1.5px solid #FDE68A",
        background: "#FBBF24",
        padding: "14px 0",
      }}>
        <div style={{
          display: "flex",
          gap: 0,
          animation: "marquee 18s linear infinite",
          width: "max-content",
        }}>
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i} style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 18,
              fontStyle: "italic",
              color: "#78350F",
              whiteSpace: "nowrap",
              padding: "0 32px",
            }}>
              {w} <span style={{ color: "#F59E0B", marginLeft: 16 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section style={{ padding: "64px 5%", display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "flex",
          gap: "clamp(32px, 6vw, 80px)",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "40px clamp(32px, 6vw, 80px)",
          background: "#fff",
          borderRadius: 24,
          border: "1.5px solid #FDE68A",
          boxShadow: "0 4px 24px rgba(120,53,15,0.06)",
        }}>
          <StatBadge number="10k+" label="notes written" />
          <div style={{ width: 1, background: "#FDE68A" }} />
          <StatBadge number="2s" label="avg load time" />
          <div style={{ width: 1, background: "#FDE68A" }} />
          <StatBadge number="100%" label="free to use" />
          <div style={{ width: 1, background: "#FDE68A" }} />
          <StatBadge number="∞" label="notes capacity" />
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "32px 5% 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(36px, 5vw, 54px)",
            fontWeight: 400,
            color: "#1C1917",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            marginBottom: 16,
          }}>Everything you need,<br /><em style={{ color: "#F59E0B" }}>nothing you don't.</em></h2>
          <p style={{ fontSize: 16, color: "#78716C", maxWidth: 480, margin: "0 auto" }}>
            Notely is built for people who think. Simple, fast, and distraction-free.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
        }}>
          <FeatureCard delay="0.1s" icon="⚡" title="Blazing fast" desc="Instant search, instant saves. Everything responds in under 100ms." />
          <FeatureCard delay="0.2s" icon="🎨" title="Beautiful UI" desc="Carefully crafted interface that makes writing a pleasure, not a chore." />
          <FeatureCard delay="0.3s" icon="🔒" title="Secure & private" desc="Your notes are yours. Encrypted and stored safely with zero third-party access." />
          <FeatureCard delay="0.4s" icon="🔍" title="Smart search" desc="Find any note in seconds. Full-text search across all your content." />
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "40px 5% 100px",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: 680,
          margin: "0 auto",
          background: "#1C1917",
          borderRadius: 28,
          padding: "64px 48px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(251,191,36,0.12)" }} />
          <div style={{ position: "absolute", bottom: -60, left: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(251,191,36,0.07)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: 40 }}>🚀</span>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 400,
              color: "#FEF3C7",
              lineHeight: 1.2,
              margin: "20px 0 16px",
              letterSpacing: "-1px",
            }}>
              Ready to start writing?
            </h2>
            <p style={{ color: "#A8A29E", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
              Join thousands of writers, students, and thinkers already using Notely.
            </p>
            <Link href="/user/signup" style={{
              display: "inline-block",
              background: "#FBBF24",
              color: "#1C1917",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 36px",
              borderRadius: 14,
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(251,191,36,0.4)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(251,191,36,0.4)"; }}
            >
              Create free account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1.5px solid #FDE68A",
        padding: "24px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, background: "#FBBF24", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📝</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#1C1917" }}>Notely</span>
        </div>
        <p style={{ fontSize: 13, color: "#A8A29E" }}>© 2025 Notely. All rights reserved.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: "#78716C", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
              onMouseLeave={e => e.currentTarget.style.color = "#78716C"}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
