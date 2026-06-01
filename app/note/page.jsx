"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── Helpers ──────────────────────────────────────────────── */
function fmtDate(d) {
  const date = new Date(d);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

/* ─── Note Card ────────────────────────────────────────────── */
function NoteCard({ note, active, onClick, onDelete }) {
  const [hovering, setHovering] = useState(false);
  const preview = (note.content || "").replace(/\n+/g, " ").trim().slice(0, 80) || "No content…";
  const wc = wordCount(note.content || "");

  return (
    <div
      className={`note-card${active ? " active" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ marginBottom: 6 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, gap: 6 }}>
        <h4 style={{
          fontSize: "0.83rem", fontWeight: 700, color: "var(--text-primary)",
          lineHeight: 1.3, flex: 1, overflow: "hidden",
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
        }}>
          {note.title || "Untitled Note"}
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          {hovering && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(note._id); }}
              style={{
                width: 20, height: 20, borderRadius: 4,
                border: "none", background: "var(--danger-light)",
                color: "var(--danger)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem",
              }}
            >✕</button>
          )}
          <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{fmtDate(note.updatedAt || note.createdAt)}</span>
        </div>
      </div>
      <p style={{
        fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>{preview}</p>
      {wc > 0 && (
        <div style={{ marginTop: 6, fontSize: "0.65rem", color: "var(--text-faint)" }}>
          {wc} word{wc !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

/* ─── Empty Editor State ───────────────────────────────────── */
function EmptyEditor({ onCreate }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 48, textAlign: "center",
    }}>
      <div className="anim-float" style={{ fontSize: "4rem", marginBottom: 20 }}>📝</div>
      <h3 className="serif" style={{ fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: 10 }}>
        Select a note to edit
      </h3>
      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 280, marginBottom: 28 }}>
        Pick a note from the sidebar, or create a new one to get started.
      </p>
      <button onClick={onCreate} className="btn btn-primary" style={{ padding: "11px 26px" }}>
        + New note
      </button>
    </div>
  );
}

/* ─── Main Dashboard ───────────────────────────────────────── */
export default function NotesPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // noteId to confirm
  const saveTimerRef = useRef(null);
  const editorRef = useRef(null);

  /* ── Theme ───────────────────────────────────────────────── */
  useEffect(() => {
    const saved = localStorage.getItem("notely-theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("notely-theme", dark ? "dark" : "light");
  }, [dark]);

  /* ── Fetch notes ─────────────────────────────────────────── */
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/note");
      if (res.status === 401) { router.push("/user/login"); return; }
      if (!res.ok) return;
      const data = await res.json();
      setNotes(data.notes || data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  /* ── Auto-save ────────────────────────────────────────────── */
  const scheduleAutoSave = useCallback(() => {
    if (!activeNote) return;
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaving(true);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/note/${activeNote._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        setNotes(prev => prev.map(n =>
          n._id === activeNote._id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
        ));
        setSaved(true);
      } catch (e) { /* silent */ }
      setSaving(false);
    }, 900);
  }, [activeNote, title, content]);

  const handleTitleChange = e => {
    setTitle(e.target.value);
    scheduleAutoSave();
  };
  const handleContentChange = e => {
    setContent(e.target.value);
    scheduleAutoSave();
  };

  /* ── Select note ──────────────────────────────────────────── */
  const selectNote = note => {
    setActiveNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setSaved(false);
    setDeleteConfirm(null);
    setTimeout(() => editorRef.current?.focus(), 80);
  };

  /* ── Create note ──────────────────────────────────────────── */
  const createNote = async () => {
    try {
      const res = await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const newNote = data.note || data;
      setNotes(prev => [newNote, ...prev]);
      selectNote(newNote);
    } catch (e) { console.error(e); }
  };

  /* ── Delete note ──────────────────────────────────────────── */
  const deleteNote = async (id) => {
    try {
      await fetch(`/api/note/${id}`, { method: "DELETE" });
      setNotes(prev => prev.filter(n => n._id !== id));
      if (activeNote?._id === id) {
        setActiveNote(null); setTitle(""); setContent("");
      }
      setDeleteConfirm(null);
    } catch (e) { console.error(e); }
  };

  const handleDeleteClick = (id) => {
    if (deleteConfirm === id) {
      deleteNote(id);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  /* ── Logout ────────────────────────────────────────────────── */
  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", { method: "POST" });
    } catch (e) { /* ignore */ }
    router.push("/user/login");
  };

  /* ── Filtered / sorted notes ──────────────────────────────── */
  const filtered = notes
    .filter(n =>
      (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.content || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      if (sort === "oldest") return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
      return (a.title || "").localeCompare(b.title || "");
    });

  const totalWords = notes.reduce((acc, n) => acc + wordCount(n.content || ""), 0);
  const activeWC = wordCount(content);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", overflow: "hidden" }}>

      {/* ══ TOP NAVBAR ══════════════════════════════════════════ */}
      <header style={{
        height: 54, flexShrink: 0,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        padding: "0 14px", gap: 10,
        position: "relative", zIndex: 20,
        boxShadow: "var(--shadow-xs)",
      }}>
        {/* Sidebar toggle */}
        <button
          className="btn btn-icon"
          onClick={() => setSidebarOpen(s => !s)}
          title="Toggle sidebar"
          style={{ fontSize: "0.9rem" }}
        >
          ☰
        </button>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginRight: 4 }}>
          <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: "var(--shadow-accent)" }}>📝</div>
          <span className="serif" style={{ color: "var(--text-primary)", fontSize: "1rem" }}>Notely</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 4 }}>
          <Link href="/note" className="nav-item active" style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
            <span className="nav-icon">📝</span> Notes
          </Link>
          <Link href="/analytics" className="nav-item" style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
            <span className="nav-icon">📊</span> Analytics
          </Link>
        </div>

        {/* Spacer + stats */}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 12px",
            background: "var(--accent-light)",
            border: "1px solid var(--border-strong)",
            borderRadius: 100,
            fontSize: "0.75rem",
          }}>
            <span>📝</span>
            <span style={{ fontWeight: 700, color: "var(--amber-700)" }}>{notes.length}</span>
            <span style={{ color: "var(--text-muted)" }}>notes</span>
            <span style={{ color: "var(--border-strong)", margin: "0 2px" }}>·</span>
            <span>✍️</span>
            <span style={{ fontWeight: 700, color: "var(--amber-700)" }}>{totalWords.toLocaleString()}</span>
            <span style={{ color: "var(--text-muted)" }}>words</span>
          </div>

          {/* Save indicator */}
          <div style={{ fontSize: "0.75rem", minWidth: 70, textAlign: "center" }}>
            {saving && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)" }}>
                <span style={{ width: 11, height: 11, border: "1.5px solid var(--border-strong)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.65s linear infinite", display: "inline-block" }} />
                Saving
              </span>
            )}
            {!saving && saved && (
              <span style={{ color: "var(--success)", fontWeight: 600 }}>✓ Saved</span>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className={`theme-toggle${dark ? " on" : ""}`}
            aria-label="Toggle theme"
          />

          {/* New note */}
          <button onClick={createNote} className="btn btn-primary" style={{ padding: "7px 16px", fontSize: "0.82rem" }}>
            + New
          </button>

          {/* User avatar */}
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
                  borderRadius: 12, padding: 6, minWidth: 170,
                  boxShadow: "var(--shadow-lg)", zIndex: 50,
                }}>
                  {["Profile", "Settings"].map(item => (
                    <div key={item} style={{
                      padding: "9px 14px", borderRadius: 8,
                      fontSize: "0.85rem", color: "var(--text-secondary)",
                      cursor: "pointer", transition: "background 0.12s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--accent-light)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >{item}</div>
                  ))}
                  <div style={{ height: 1, background: "var(--border)", margin: "5px 0" }} />
                  <div
                    onClick={handleLogout}
                    style={{
                      padding: "9px 14px", borderRadius: 8,
                      fontSize: "0.85rem", color: "var(--danger)",
                      cursor: "pointer", transition: "background 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--danger-light)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >Sign out</div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══ BODY ════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── SIDEBAR ───────────────────────────────────────── */}
        <aside style={{
          width: sidebarOpen ? 272 : 0,
          overflow: "hidden",
          flexShrink: 0,
          transition: "width 0.22s cubic-bezier(0.22,1,0.36,1)",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ width: 272, height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Search + sort */}
            <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ position: "relative", marginBottom: 8 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", color: "var(--text-muted)", pointerEvents: "none" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search notes…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 32, fontSize: "0.82rem", padding: "8px 10px 8px 30px" }}
                />
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {[["newest", "Newest"], ["oldest", "Oldest"], ["alpha", "A → Z"]].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSort(key)}
                    style={{
                      flex: 1, padding: "5px 4px",
                      fontSize: "0.7rem", fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      background: sort === key ? "var(--accent)" : "var(--surface-alt)",
                      color: sort === key ? "#1a0f00" : "var(--text-muted)",
                      border: `1px solid ${sort === key ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 6, cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div style={{
              padding: "6px 14px",
              fontSize: "0.7rem", color: "var(--text-faint)",
              borderBottom: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between",
            }}>
              <span>{filtered.length} note{filtered.length !== 1 ? "s" : ""}</span>
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700 }}>Clear</button>}
            </div>

            {/* Notes list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
              {loading ? (
                <div style={{ padding: "40px 0", textAlign: "center" }}>
                  <div style={{ width: 22, height: 22, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.65s linear infinite", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Loading…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "40px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 10 }}>{search ? "🔍" : "📭"}</div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 14 }}>
                    {search ? "No notes match your search" : "No notes yet"}
                  </p>
                  {!search && (
                    <button onClick={createNote} className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "7px 16px" }}>
                      + First note
                    </button>
                  )}
                </div>
              ) : (
                filtered.map(note => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    active={activeNote?._id === note._id}
                    onClick={() => selectNote(note)}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </div>

            {/* Sidebar footer */}
            <div style={{ padding: "10px 10px", borderTop: "1px solid var(--border)" }}>
              <button onClick={createNote} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "9px", fontSize: "0.82rem" }}>
                + New note <span style={{ opacity: 0.5, fontSize: "0.7rem", marginLeft: 4 }}>⌘N</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ── EDITOR ────────────────────────────────────────── */}
        <main style={{
          flex: 1, display: "flex", flexDirection: "column",
          overflow: "hidden", background: "var(--bg-alt)",
        }}>
          {activeNote ? (
            <>
              {/* Editor toolbar */}
              <div style={{
                height: 44, flexShrink: 0,
                background: "var(--surface)",
                borderBottom: "1px solid var(--border)",
                padding: "0 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "var(--shadow-xs)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  <span>{activeWC} words</span>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <span>{content.length} chars</span>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <span>
                    Last edited {fmtDate(activeNote.updatedAt || activeNote.createdAt)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {deleteConfirm === activeNote._id ? (
                    <>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Are you sure?</span>
                      <button
                        onClick={() => deleteNote(activeNote._id)}
                        style={{ padding: "4px 12px", background: "var(--danger)", border: "none", borderRadius: 6, fontSize: "0.75rem", color: "#fff", cursor: "pointer", fontWeight: 700 }}
                      >Delete</button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="btn btn-ghost"
                        style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                      >Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(activeNote._id)}
                      className="btn btn-danger"
                      style={{ fontSize: "0.76rem" }}
                    >🗑 Delete</button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div style={{ padding: "32px 48px 0", flexShrink: 0 }}>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Note title…"
                  className="serif"
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    outline: "none", fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    fontWeight: 400, color: "var(--text-primary)",
                    letterSpacing: "-0.02em", lineHeight: 1.2,
                    caretColor: "var(--accent)",
                  }}
                />
                <div style={{
                  height: 2,
                  background: "linear-gradient(to right, var(--accent), transparent)",
                  marginTop: 14, opacity: 0.5,
                }} />
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflow: "hidden", padding: "20px 48px 32px", display: "flex", flexDirection: "column" }}>
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder={"Start writing…\n\nYour thoughts are worth capturing."}
                  style={{
                    flex: 1, width: "100%",
                    background: "transparent", border: "none",
                    outline: "none", resize: "none",
                    fontSize: "1rem", color: "var(--text-secondary)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.85,
                    caretColor: "var(--accent)",
                  }}
                />
              </div>
            </>
          ) : (
            <EmptyEditor onCreate={createNote} />
          )}
        </main>
      </div>
    </div>
  );
}