"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── Helpers ──────────────────────────────────────────────── */
function wordCount(text) {
  return (text || "").trim() ? (text || "").trim().split(/\s+/).filter(Boolean).length : 0;
}
function charCount(text) { return (text || "").length; }

/* ─── Stat Card ────────────────────────────────────────────── */
function StatCard({ icon, value, label, sub, accent = false, delay = "0s" }) {
  return (
    <div className="stat-card anim-fade-up" style={{ animationDelay: delay }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40,
          background: accent ? "var(--accent)" : "var(--accent-light)",
          border: `1px solid ${accent ? "transparent" : "var(--border-strong)"}`,
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem",
          color: accent ? "#1a0f00" : "auto",
          flexShrink: 0,
        }}>{icon}</div>
      </div>
      <div className="serif" style={{
        fontSize: "2.2rem", lineHeight: 1,
        background: "linear-gradient(135deg, var(--amber-500), var(--amber-700))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 6,
      }}>{value}</div>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

/* ─── Bar Chart ────────────────────────────────────────────── */
function BarChart({ data, title, sub }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="card" style={{ padding: "22px 24px" }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
        {sub && <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: 3 }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
            <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
              <div
                className="bar-fill"
                style={{
                  width: "100%",
                  height: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0)}%`,
                  background: d.today
                    ? "var(--accent)"
                    : "linear-gradient(180deg, var(--accent-glow), var(--border-strong))",
                  borderRadius: "4px 4px 0 0",
                  minHeight: d.value > 0 ? 4 : 0,
                  position: "relative",
                  overflow: "visible",
                }}
                data-tip={`${d.value}`}
              >
                {d.value > 0 && (
                  <div style={{
                    position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                    fontSize: "0.62rem", fontWeight: 700, color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}>{d.value}</div>
                )}
              </div>
            </div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-faint)", textAlign: "center" }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Activity Grid (GitHub-style) ────────────────────────── */
function ActivityGrid({ notes }) {
  const weeks = 13;
  const days = 7;
  const now = new Date();
  const cells = [];

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < days; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toISOString().slice(0, 10);
      const count = notes.filter(n => (n.createdAt || n.updatedAt || "").slice(0, 10) === dateStr).length;
      cells.push({ date: dateStr, count, label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) });
    }
  }

  const getColor = (count) => {
    if (count === 0) return "var(--border-subtle)";
    if (count === 1) return "rgba(245,158,11,0.25)";
    if (count === 2) return "rgba(245,158,11,0.50)";
    if (count === 3) return "rgba(245,158,11,0.75)";
    return "var(--accent)";
  };

  return (
    <div className="card" style={{ padding: "22px 24px" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>Writing activity</h3>
        <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: 3 }}>Notes created per day over the past 13 weeks</p>
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {Array.from({ length: days }).map((_, d) => {
              const cell = cells[w * days + d];
              return (
                <div
                  key={d}
                  data-tip={cell ? `${cell.count} note${cell.count !== 1 ? "s" : ""} on ${cell.label}` : ""}
                  style={{
                    width: 13, height: 13,
                    borderRadius: 3,
                    background: cell ? getColor(cell.count) : "var(--border-subtle)",
                    cursor: "default",
                    transition: "transform 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.25)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "flex-end" }}>
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Less</span>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: getColor(i) }} />
        ))}
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>More</span>
      </div>
    </div>
  );
}

/* ─── Top Notes List ───────────────────────────────────────── */
function TopNotesList({ notes }) {
  const sorted = [...notes].sort((a, b) => wordCount(b.content) - wordCount(a.content)).slice(0, 5);
  return (
    <div className="card" style={{ padding: "22px 24px" }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Longest notes</h3>
      {sorted.length === 0 ? (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No notes yet</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((note, i) => {
            const wc = wordCount(note.content);
            const pct = wc / Math.max(wordCount(sorted[0]?.content), 1);
            return (
              <div key={note._id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "70%" }}>
                    {note.title || "Untitled"}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", flexShrink: 0 }}>{wc} words</div>
                </div>
                <div style={{ height: 4, background: "var(--border-subtle)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct * 100}%`, background: "var(--accent)", borderRadius: 2, transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Streak display ────────────────────────────────────────── */
function getStreakData(notes) {
  const days = new Set(notes.map(n => (n.createdAt || n.updatedAt || "").slice(0, 10)));
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const s = d.toISOString().slice(0, 10);
    if (days.has(s)) streak++;
    else break;
  }
  return streak;
}

/* ─── Recent Notes ──────────────────────────────────────────── */
function RecentNotes({ notes }) {
  const recent = [...notes]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  return (
    <div className="card" style={{ padding: "22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>Recent activity</h3>
        <Link href="/note" style={{ fontSize: "0.76rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
      </div>
      {recent.length === 0 ? (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No notes yet</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {recent.map(note => (
            <Link key={note._id} href="/note" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.12s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--accent-light)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {note.title || "Untitled"}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {wordCount(note.content)} words
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", flexShrink: 0, marginLeft: 12 }}>
                {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Analytics ─────────────────────────────────────────── */
export default function AnalyticsPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("notely-theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("notely-theme", dark ? "dark" : "light");
  }, [dark]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/note");
      if (res.status === 401) { router.push("/user/login"); return; }
      if (!res.ok) return;
      const data = await res.json();
      setNotes(data.notes || data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  /* ── Compute stats ─────────────────────────────────────────── */
  const totalNotes = notes.length;
  const totalWords = notes.reduce((a, n) => a + wordCount(n.content), 0);
  const totalChars = notes.reduce((a, n) => a + charCount(n.content), 0);
  const avgWords = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;
  const streak = getStreakData(notes);
  const longestNote = notes.reduce((max, n) => wordCount(n.content) > wordCount(max?.content) ? n : max, notes[0]);

  /* ── Last 7 days bar chart ─────────────────────────────────── */
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const count = notes.filter(n => (n.createdAt || n.updatedAt || "").slice(0, 10) === dateStr).length;
    const isToday = i === 6;
    return {
      label: i === 6 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
      value: count,
      today: isToday,
    };
  });

  /* ── Last 4 weeks ──────────────────────────────────────────── */
  const last4Weeks = Array.from({ length: 4 }).map((_, i) => {
    const start = new Date(); start.setDate(start.getDate() - (3 - i) * 7 - 6);
    const end = new Date(); end.setDate(end.getDate() - (3 - i) * 7);
    const count = notes.filter(n => {
      const d = new Date(n.createdAt || n.updatedAt || 0);
      return d >= start && d <= end;
    }).length;
    return { label: `W${i + 1}`, value: count, today: i === 3 };
  });

  /* ── Month breakdown ───────────────────────────────────────── */
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth(); const y = d.getFullYear();
    const count = notes.filter(n => {
      const nd = new Date(n.createdAt || n.updatedAt || 0);
      return nd.getMonth() === m && nd.getFullYear() === y;
    }).length;
    return { label: d.toLocaleDateString("en-US", { month: "short" }), value: count, today: i === 5 };
  });

  const handleLogout = async () => {
    try { await fetch("/api/user/logout", { method: "POST" }); } catch { }
    router.push("/user/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* ══ TOP NAVBAR ══════════════════════════════════════════ */}
      <header style={{
        height: 54, flexShrink: 0,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: 10,
        position: "sticky", top: 0, zIndex: 20,
        boxShadow: "var(--shadow-xs)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginRight: 4 }}>
          <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: "var(--shadow-accent)" }}>📝</div>
          <span className="serif" style={{ color: "var(--text-primary)", fontSize: "1rem" }}>Notely</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/note" className="nav-item" style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
            <span className="nav-icon">📝</span> Notes
          </Link>
          <Link href="/analytics" className="nav-item active" style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
            <span className="nav-icon">📊</span> Analytics
          </Link>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => setDark(!dark)}
          className={`theme-toggle${dark ? " on" : ""}`}
          aria-label="Toggle theme"
        />

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--accent)", border: "none",
              cursor: "pointer", fontWeight: 800, fontSize: "0.82rem",
              color: "#1a0f00", fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--shadow-accent)",
            }}
          >U</button>
          {userMenuOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setUserMenuOpen(false)} />
              <div className="anim-scale-in" style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 6, minWidth: 160,
                boxShadow: "var(--shadow-lg)", zIndex: 50,
              }}>
                <div
                  onClick={handleLogout}
                  style={{ padding: "9px 14px", borderRadius: 8, fontSize: "0.85rem", color: "var(--danger)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--danger-light)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >Sign out</div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ PAGE BODY ════════════════════════════════════════════ */}
      <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "32px 24px" }}>

        {/* Page header */}
        <div className="anim-fade-up d-0" style={{ marginBottom: 32 }}>
          <h1 className="serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 6 }}>
            Writing analytics
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Track your writing habits, streaks, and progress over time.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.65s linear infinite" }} />
          </div>
        ) : (
          <>
            {/* ── Stat grid ───────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              <StatCard icon="📝" value={totalNotes} label="Total notes" sub="All time" delay="0s" accent />
              <StatCard icon="✍️" value={totalWords.toLocaleString()} label="Total words" sub="Across all notes" delay="0.06s" />
              <StatCard icon="📊" value={avgWords} label="Avg. words/note" sub="Per note average" delay="0.12s" />
              <StatCard icon="🔥" value={`${streak}d`} label="Current streak" sub={streak > 0 ? "Keep it up!" : "Write today to start"} delay="0.18s" />
              <StatCard icon="⭐" value={longestNote ? (wordCount(longestNote.content) + "w") : "—"} label="Longest note" sub={longestNote?.title || "—"} delay="0.24s" />
              <StatCard icon="💬" value={totalChars.toLocaleString()} label="Characters" sub="All content" delay="0.30s" />
            </div>

            {/* ── Charts row ──────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
              <BarChart data={last7} title="Notes per day" sub="Last 7 days" />
              <BarChart data={last4Weeks} title="Notes per week" sub="Last 4 weeks" />
              <BarChart data={last6Months} title="Notes per month" sub="Last 6 months" />
            </div>

            {/* ── Activity grid ───────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <ActivityGrid notes={notes} />
            </div>

            {/* ── Bottom row ──────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <TopNotesList notes={notes} />
              <RecentNotes notes={notes} />
            </div>

            {/* CTA if no notes */}
            {totalNotes === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 16 }}>
                  Your analytics will appear here once you start writing.
                </p>
                <Link href="/note" className="btn btn-primary" style={{ padding: "11px 26px" }}>
                  Write your first note →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}