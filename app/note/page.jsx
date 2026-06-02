"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── Helpers ─────────────────────────────────────────────── */
function wordCount(text) {
  return (text || "").trim() ? (text || "").trim().split(/\s+/).filter(Boolean).length : 0;
}
function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function excerpt(text, len = 90) {
  if (!text) return "No content yet…";
  const clean = text.replace(/\n+/g, " ").trim();
  return clean.length > len ? clean.slice(0, len) + "…" : clean;
}

/* ─── Global CSS ───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #fdfaf4; --surface: #ffffff; --surface-alt: #fef9ee;
    --border: rgba(0,0,0,0.08); --border-subtle: rgba(0,0,0,0.05); --border-strong: rgba(245,158,11,0.25);
    --text-primary: #1a0f00; --text-secondary: #5c4a2a; --text-muted: #9a8060; --text-faint: #c4a97a;
    --accent: #f59e0b; --accent-light: rgba(245,158,11,0.1); --accent-glow: rgba(245,158,11,0.35);
    --amber-300: #fcd34d; --amber-400: #fbbf24; --amber-500: #f59e0b; --amber-700: #b45309;
    --danger: #ef4444; --danger-light: rgba(239,68,68,0.08); --success: #22c55e;
    --shadow-xs: 0 1px 3px rgba(0,0,0,0.06); --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.1); --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
    --shadow-accent: 0 4px 14px rgba(245,158,11,0.35);
  }
  html.dark {
    --bg: #0d0a05; --surface: #141008; --surface-alt: #1a1407;
    --border: rgba(255,255,255,0.07); --border-subtle: rgba(255,255,255,0.04); --border-strong: rgba(245,158,11,0.2);
    --text-primary: #fef9ee; --text-secondary: rgba(254,249,238,0.6); --text-muted: rgba(254,249,238,0.38); --text-faint: rgba(254,249,238,0.2);
    --accent-light: rgba(245,158,11,0.12);
    --shadow-xs: 0 1px 3px rgba(0,0,0,0.3); --shadow-sm: 0 2px 8px rgba(0,0,0,0.4); --shadow-md: 0 4px 20px rgba(0,0,0,0.5);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text-primary); }
  .serif { font-family: 'DM Serif Display', serif; }
  .gradient-text { background: linear-gradient(135deg,#f59e0b,#d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  .btn { display: inline-flex; align-items: center; gap: 6px; border: none; cursor: pointer; border-radius: 10px; font-family: 'DM Sans',sans-serif; font-weight: 600; text-decoration: none; transition: all 0.18s; }
  .btn-primary { background: linear-gradient(135deg,#f59e0b,#d97706); color: #1a0f00; box-shadow: 0 4px 14px rgba(245,158,11,0.35); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(245,158,11,0.45); }
  .btn-ghost { background: transparent; color: var(--text-secondary); }
  .btn-ghost:hover { background: var(--accent-light); color: var(--text-primary); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; }
  .nav-item { display:inline-flex; align-items:center; gap:6px; padding:7px 13px; border-radius:8px; font-size:0.83rem; font-weight:500; color:var(--text-secondary); text-decoration:none; transition:all 0.15s; }
  .nav-item:hover, .nav-item.active { background:var(--accent-light); color:var(--text-primary); }

  .theme-toggle { width:40px; height:22px; border-radius:11px; background:var(--border-strong); border:1.5px solid var(--border-strong); cursor:pointer; position:relative; transition:background 0.2s; flex-shrink:0; }
  .theme-toggle::after { content:''; position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%; background:var(--accent); transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 1px 4px rgba(0,0,0,0.2); }
  .theme-toggle.on { background:var(--amber-700); border-color:var(--amber-700); }
  .theme-toggle.on::after { transform:translateX(18px); }

  .note-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; cursor:pointer; transition:all 0.18s; position:relative; overflow:hidden; display:flex; flex-direction:column; gap:10px; }
  .note-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#f59e0b,#d97706); opacity:0; transition:opacity 0.2s; }
  .note-card:hover { border-color:var(--border-strong); box-shadow:var(--shadow-md); transform:translateY(-2px); }
  .note-card:hover::before { opacity:1; }
  .note-card.selected { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-light); }
  .note-card.selected::before { opacity:1; }

  .input { width:100%; padding:11px 14px; background:var(--surface); border:1.5px solid var(--border); border-radius:10px; color:var(--text-primary); font-family:'DM Sans',sans-serif; font-size:0.9rem; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
  .input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-light); }
  .input::placeholder { color:var(--text-faint); }

  .editor-title { width:100%; background:transparent; border:none; outline:none; font-family:'DM Serif Display',serif; font-size:clamp(1.5rem,3vw,2rem); color:var(--text-primary); padding:0; }
  .editor-body { width:100%; flex:1; background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:0.95rem; line-height:1.8; color:var(--text-secondary); resize:none; padding:0; }
  .editor-body::placeholder { color:var(--text-faint); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  @keyframes spin { to{transform:rotate(360deg)} }

  .anim-fade-up { animation:fadeUp 0.4s ease both; }
  .anim-scale-in { animation:scaleIn 0.2s ease both; }

  ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:3px; }

  .sort-btn { padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:600; border:1.5px solid var(--border); background:var(--surface); color:var(--text-secondary); cursor:pointer; transition:all 0.15s; }
  .sort-btn.active, .sort-btn:hover { background:var(--accent-light); border-color:var(--accent); color:var(--text-primary); }

  .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:60px 20px; text-align:center; }
  .delete-btn { opacity:0; transition:opacity 0.15s; position:absolute; top:14px; right:14px; width:28px; height:28px; border-radius:8px; background:var(--danger-light); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:0.85rem; }
  .note-card:hover .delete-btn { opacity:1; }
`;

/* ─── Confirm Dialog ─────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="card anim-scale-in" style={{ padding: "28px 32px", maxWidth: 360, width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Delete note?</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={{ padding: "9px 22px", borderRadius: 9, border: "1.5px solid var(--border)", background: "transparent", color: "var(--text-primary)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "var(--danger)", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export default function NotesPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated"); // updated | created | alpha
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // note id
  const [user, setUser] = useState(null);
  const saveTimer = useRef(null);
  const bodyRef = useRef(null);

  /* ── Theme ─────────────────────────────────────────────── */
  useEffect(() => {
    const saved = localStorage.getItem("notely-theme");
    if (saved === "dark") setDark(true);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("notely-theme", dark ? "dark" : "light");
  }, [dark]);

  /* ── Fetch notes & user ─────────────────────────────────── */
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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) { const d = await res.json(); setUser(d.user || d); }
      } catch {}
    })();
  }, []);

  /* ── Selected note ──────────────────────────────────────── */
  const selected = notes.find(n => n._id === selectedId) || null;

  /* ── Auto-save ──────────────────────────────────────────── */
  const scheduleSave = useCallback((id, title, content) => {
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch(`/api/note/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        setNotes(prev => prev.map(n => n._id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n));
      } catch {}
      setSaving(false);
    }, 700);
  }, []);

  const updateField = (field, value) => {
    if (!selected) return;
    setNotes(prev => prev.map(n => n._id === selected._id ? { ...n, [field]: value } : n));
    scheduleSave(selected._id, field === "title" ? value : selected.title, field === "content" ? value : selected.content);
  };

  /* ── Create note ────────────────────────────────────────── */
  const createNote = async () => {
    try {
      const res = await fetch("/api/note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Untitled note", content: "" }) });
      if (!res.ok) return;
      const data = await res.json();
      const newNote = data.note || data;
      setNotes(prev => [newNote, ...prev]);
      setSelectedId(newNote._id);
      setTimeout(() => bodyRef.current?.focus(), 80);
    } catch (e) { console.error(e); }
  };

  /* ── Delete note ────────────────────────────────────────── */
  const deleteNote = async (id) => {
    try {
      await fetch(`/api/note/${id}`, { method: "DELETE" });
      setNotes(prev => prev.filter(n => n._id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch {}
    setConfirmDelete(null);
  };

  /* ── Logout ─────────────────────────────────────────────── */
  const handleLogout = async () => {
    try { await fetch("/api/user/logout", { method: "POST" }); } catch {}
    router.push("/user/login");
  };

  /* ── Filter & sort ──────────────────────────────────────── */
  const filtered = notes
    .filter(n => {
      const q = search.toLowerCase();
      return !q || (n.title || "").toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "alpha") return (a.title || "").localeCompare(b.title || "");
      if (sort === "created") return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

  const initials = user ? `${(user.fname || user.firstName || "U")[0]}${(user.lname || user.lastName || "")[0] || ""}`.toUpperCase() : "U";

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {confirmDelete && (
        <ConfirmDialog
          message="This will permanently delete the note. This action cannot be undone."
          onConfirm={() => deleteNote(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

        {/* ══ NAVBAR ═══════════════════════════════════════════ */}
        <header style={{ height: 56, flexShrink: 0, background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 20px", gap: 10, position: "sticky", top: 0, zIndex: 20, boxShadow: "var(--shadow-xs)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginRight: 4 }}>
            <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 3px 10px rgba(245,158,11,0.3)" }}>📝</div>
            <span className="serif" style={{ color: "var(--text-primary)", fontSize: "1rem" }}>Notely</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/note" className="nav-item active"><span>📝</span> Notes</Link>
            <Link href="/analytics" className="nav-item"><span>📊</span> Analytics</Link>
          </div>

          <div style={{ flex: 1 }} />

          {/* Save indicator */}
          {saving && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <div style={{ width: 14, height: 14, border: "2px solid var(--border-strong)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
              Saving…
            </div>
          )}

          <button onClick={() => setDark(!dark)} className={`theme-toggle${dark ? " on" : ""}`} aria-label="Toggle theme" />

          {/* User avatar */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setUserMenuOpen(o => !o)} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.82rem", color: "#1a0f00", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(245,158,11,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
              {initials}
            </button>
            {userMenuOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setUserMenuOpen(false)} />
                <div className="anim-scale-in" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 6, minWidth: 170, boxShadow: "var(--shadow-lg)", zIndex: 50 }}>
                  {user && <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{user.fname || user.firstName} {user.lname || user.lastName}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{user.email}</div>
                  </div>}
                  <Link href="/analytics" style={{ display: "block", padding: "9px 14px", borderRadius: 8, fontSize: "0.84rem", color: "var(--text-secondary)", textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--accent-light)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    📊 Analytics
                  </Link>
                  <div onClick={handleLogout} style={{ padding: "9px 14px", borderRadius: 8, fontSize: "0.84rem", color: "var(--danger)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--danger-light)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    Sign out
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ══ BODY ═════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 56px)" }}>

          {/* ── SIDEBAR ────────────────────────────────────────── */}
          <aside style={{ width: 300, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--surface-alt)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Sidebar header */}
            <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {filtered.length} note{filtered.length !== 1 ? "s" : ""}
                </span>
                <button onClick={createNote} className="btn btn-primary" style={{ padding: "7px 14px", fontSize: "0.8rem", gap: 5 }}>
                  <span style={{ fontSize: "1rem", lineHeight: 1 }}>+</span> New
                </button>
              </div>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", color: "var(--text-muted)", pointerEvents: "none" }}>🔍</span>
                <input
                  className="input"
                  style={{ paddingLeft: 32, fontSize: "0.85rem" }}
                  placeholder="Search notes…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {/* Sort buttons */}
              <div style={{ display: "flex", gap: 5 }}>
                {[["updated", "Recent"], ["created", "Created"], ["alpha", "A–Z"]].map(([val, label]) => (
                  <button key={val} className={`sort-btn${sort === val ? " active" : ""}`} onClick={() => setSort(val)}>{label}</button>
                ))}
              </div>
            </div>

            {/* Notes list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.65s linear infinite" }} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: "2.4rem" }}>📝</div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{search ? "No notes match your search." : "No notes yet. Create your first one!"}</p>
                  {!search && <button onClick={createNote} className="btn btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>New note →</button>}
                </div>
              ) : (
                filtered.map((note, i) => (
                  <div
                    key={note._id}
                    className={`note-card anim-fade-up${selectedId === note._id ? " selected" : ""}`}
                    style={{ animationDelay: `${i * 0.04}s`, marginBottom: 8 }}
                    onClick={() => setSelectedId(note._id)}
                  >
                    <button className="delete-btn" onClick={e => { e.stopPropagation(); setConfirmDelete(note._id); }} title="Delete note">🗑️</button>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingRight: 24 }}>
                      {note.title || "Untitled"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {excerpt(note.content)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{timeAgo(note.updatedAt || note.createdAt)}</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{wordCount(note.content)} words</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* ── EDITOR ─────────────────────────────────────────── */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
            {selected ? (
              <>
                {/* Editor toolbar */}
                <div style={{ padding: "14px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 12, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <span>{wordCount(selected.content).toLocaleString()} words</span>
                    <span>·</span>
                    <span>{(selected.content || "").length.toLocaleString()} chars</span>
                    <span>·</span>
                    <span>Updated {timeAgo(selected.updatedAt || selected.createdAt)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {saving ? (
                      <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 12, height: 12, border: "2px solid var(--border-strong)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> Saving…
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.74rem", color: "var(--success)" }}>✓ Saved</span>
                    )}
                    <button onClick={() => setConfirmDelete(selected._id)} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid rgba(239,68,68,0.25)", background: "transparent", color: "var(--danger)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Delete</button>
                  </div>
                </div>

                {/* Title + Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "36px 48px 60px", maxWidth: 820, width: "100%", margin: "0 auto" }}>
                  <input
                    className="editor-title"
                    placeholder="Untitled note"
                    value={selected.title || ""}
                    onChange={e => updateField("title", e.target.value)}
                  />
                  <div style={{ height: 1, background: "linear-gradient(to right, var(--accent), transparent)", opacity: 0.35, margin: "16px 0 24px" }} />
                  <textarea
                    ref={bodyRef}
                    className="editor-body"
                    placeholder="Start writing… your thoughts are safe here."
                    value={selected.content || ""}
                    onChange={e => updateField("content", e.target.value)}
                    style={{ minHeight: "60vh" }}
                  />
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ flex: 1 }}>
                <div style={{ fontSize: "4rem", animation: "float 4s ease-in-out infinite" }}>📝</div>
                <h2 className="serif" style={{ fontSize: "1.6rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Select a note to edit</h2>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", maxWidth: 300 }}>Choose a note from the sidebar, or create a new one to get started.</p>
                <button onClick={createNote} className="btn btn-primary" style={{ padding: "11px 26px", fontSize: "0.9rem" }}>Create new note →</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}