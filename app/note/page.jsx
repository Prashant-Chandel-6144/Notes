"use client";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function wordCount(str) {
  if (!str?.trim()) return 0;
  return str.trim().split(/\s+/).length;
}

function NoteCard({ note, isActive, onSelect, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(note)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isActive ? "#1C1917" : hovered ? "#FEF9EE" : "#fff",
        border: `1.5px solid ${isActive ? "#FBBF24" : hovered ? "#FDE68A" : "#F5F0E8"}`,
        borderRadius: 16,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        boxShadow: isActive ? "0 4px 20px rgba(251,191,36,0.2)" : hovered ? "0 2px 12px rgba(120,53,15,0.06)" : "none",
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{
          margin: 0, flex: 1,
          fontSize: 14,
          fontWeight: 600,
          color: isActive ? "#FEF3C7" : "#1C1917",
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1.3,
          wordBreak: "break-word",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {note.title || "Untitled"}
        </h3>
        <button
          onClick={e => { e.stopPropagation(); onDelete(note._id); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: isActive ? "rgba(251,191,36,0.6)" : "#D1C4A8",
            fontSize: 16, padding: "0 2px", flexShrink: 0, lineHeight: 1,
            borderRadius: 4, transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = isActive ? "#FBBF24" : "#EF4444"}
          onMouseLeave={e => e.currentTarget.style.color = isActive ? "rgba(251,191,36,0.6)" : "#D1C4A8"}
        >×</button>
      </div>
      <p style={{
        margin: "6px 0 0",
        fontSize: 12,
        color: isActive ? "#A8A29E" : "#9CA3AF",
        lineHeight: 1.5,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        wordBreak: "break-word",
      }}>
        {note.description || "No content…"}
      </p>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 10,
      }}>
        <span style={{ fontSize: 11, color: isActive ? "rgba(251,191,36,0.5)" : "#D1C4A8", fontFamily: "monospace" }}>
          {timeAgo(note.updatedAt || note.createdAt)}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700,
          background: isActive ? "rgba(251,191,36,0.15)" : "#FEF3C7",
          color: isActive ? "#FBBF24" : "#B45309",
          padding: "2px 8px", borderRadius: 100,
          letterSpacing: "0.03em",
        }}>
          {wordCount(note.description)}w
        </span>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState("idle"); // idle | view | edit | new
  const [form, setForm] = useState({ title: "", description: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const titleRef = useRef(null);
  const textareaRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/note");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      showToast("Could not load notes", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleNew = () => {
    setActive(null);
    setForm({ title: "", description: "" });
    setMode("new");
    setTimeout(() => titleRef.current?.focus(), 50);
  };

  const handleSelect = (note) => {
    setActive(note);
    setForm({ title: note.title || "", description: note.description || "" });
    setMode("view");
  };

  const handleEdit = () => {
    setMode("edit");
    setTimeout(() => titleRef.current?.focus(), 50);
  };

  const handleSave = async () => {
    if (!form.title.trim() && !form.description.trim()) return;
    setIsSaving(true);
    try {
      if (mode === "new") {
        const res = await fetch("/api/note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title, description: form.description }),
        });
        const created = await res.json();
        setNotes(p => [created, ...p]);
        setActive(created);
        showToast("Note created ✦");
      } else if (mode === "edit" && active) {
        await fetch(`/api/note/${active._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title, description: form.description }),
        });
        const updated = { ...active, ...form, updatedAt: new Date().toISOString() };
        setNotes(p => p.map(n => n._id === active._id ? updated : n));
        setActive(updated);
        showToast("Saved ✦");
      }
      setMode("view");
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete(null);
    try {
      await fetch(`/api/note/${id}`, { method: "DELETE" });
      const updated = notes.filter(n => n._id !== id);
      setNotes(updated);
      if (active?._id === id) { setActive(updated[0] || null); setMode(updated[0] ? "view" : "idle"); if (updated[0]) setForm({ title: updated[0].title || "", description: updated[0].description || "" }); }
      showToast("Deleted");
    } catch { showToast("Delete failed", "error"); }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); if (mode === "edit" || mode === "new") handleSave(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") { e.preventDefault(); handleNew(); }
      if (e.key === "Escape") { if (mode === "edit") setMode("view"); if (mode === "new") { setMode("idle"); setActive(null); } }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, form, active]);

  const sorted = [...notes]
    .filter(n => n.title?.toLowerCase().includes(search.toLowerCase()) || n.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === "az") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  const editable = mode === "edit" || mode === "new";
  const stats = { total: notes.length, words: notes.reduce((acc, n) => acc + wordCount(n.description), 0) };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#FFFBEB", fontFamily: "'Syne', sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 300 : 0,
        minWidth: sidebarOpen ? 280 : 0,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        borderRight: "1.5px solid #FDE68A",
        display: "flex",
        flexDirection: "column",
        background: "#FFFBEB",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #FEF3C7" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
              <div style={{ width: 28, height: 28, background: "#FBBF24", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📝</div>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "#1C1917" }}>Notely</span>
            </Link>
            <button
              onClick={handleNew}
              title="New note (⌘N)"
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: "#FBBF24", border: "none", cursor: "pointer",
                fontSize: 20, color: "#1C1917", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 300, lineHeight: 1, transition: "all 0.15s",
                boxShadow: "0 2px 8px rgba(251,191,36,0.4)",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >+</button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 10 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#D97706" }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes…"
              style={{
                width: "100%", padding: "9px 12px 9px 30px", borderRadius: 10,
                border: "1px solid #FDE68A", background: "#FEF9EE",
                fontSize: 13, color: "#1C1917", outline: "none", boxSizing: "border-box",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#A8A29E" }}>×</button>
            )}
          </div>

          {/* Sort + stats row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 600,
              color: "#B45309", background: "transparent", border: "none", cursor: "pointer", outline: "none", letterSpacing: "0.04em",
            }}>
              <option value="newest">NEWEST</option>
              <option value="oldest">OLDEST</option>
              <option value="az">A → Z</option>
            </select>
            <span style={{ fontSize: 11, color: "#D97706" }}>{sorted.length} note{sorted.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Note list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          {isLoading ? (
            <div style={{ textAlign: "center", paddingTop: 48, color: "#D97706" }}>
              <div style={{ width: 24, height: 24, border: "2px solid #FDE68A", borderTopColor: "#FBBF24", borderRadius: "50%", animation: "spin-slow 0.7s linear infinite", margin: "0 auto 10px" }} />
              <p style={{ fontSize: 13 }}>Loading…</p>
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 48, color: "#D97706" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📝</div>
              <p style={{ fontSize: 13, color: "#A8A29E" }}>{search ? "Nothing found" : "No notes yet"}</p>
              {!search && <button onClick={handleNew} style={{ marginTop: 12, fontSize: 13, color: "#F59E0B", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>+ Create first note</button>}
            </div>
          ) : (
            sorted.map((note, i) => (
              <NoteCard key={note._id} note={note} isActive={active?._id === note._id} onSelect={handleSelect} onDelete={id => setConfirmDelete(id)} index={i} />
            ))
          )}
        </div>

        {/* Sidebar footer stats */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #FEF3C7", display: "flex", gap: 16 }}>
          {[["📝", stats.total, "notes"], ["✍", stats.words, "words"]].map(([icon, val, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 13 }}>{icon}</span>
              <span style={{ fontSize: 12, color: "#78350F", fontWeight: 700 }}>{val}</span>
              <span style={{ fontSize: 12, color: "#A8A29E" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: 56, borderBottom: "1px solid #FEF3C7",
          display: "flex", alignItems: "center", padding: "0 24px",
          justifyContent: "space-between", gap: 12, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#A8A29E", padding: "4px 6px", borderRadius: 7, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEF3C7"; e.currentTarget.style.color = "#F59E0B"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#A8A29E"; }}
              title="Toggle sidebar"
            >☰</button>

            {active && mode === "view" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#A8A29E" }}>
                <span>Notes</span>
                <span>/</span>
                <span style={{ color: "#78350F", fontWeight: 600 }}>{active.title || "Untitled"}</span>
              </div>
            )}
            {(mode === "new" || mode === "edit") && (
              <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#F59E0B", borderRadius: "50%", animation: "blink 1.5s ease infinite" }} />
                {mode === "new" ? "New note" : "Editing"}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {editable && (
              <>
                <button onClick={() => { setMode(active ? "view" : "idle"); if (!active) setForm({ title: "", description: "" }); }}
                  style={{ padding: "7px 16px", background: "transparent", border: "1px solid #FDE68A", borderRadius: 9, fontSize: 13, fontFamily: "'Syne', sans-serif", color: "#78716C", cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving}
                  style={{ padding: "7px 20px", background: "#FBBF24", border: "none", borderRadius: 9, fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#1C1917", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 2px 10px rgba(251,191,36,0.35)" }}>
                  {isSaving ? "Saving…" : "Save  ⌘S"}
                </button>
              </>
            )}
            {mode === "view" && active && (
              <button onClick={handleEdit}
                style={{ padding: "7px 18px", background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 9, fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#B45309", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FBBF24"}
                onMouseLeave={e => e.currentTarget.style.background = "#FEF3C7"}
              >Edit</button>
            )}
          </div>
        </div>

        {/* Editor / Viewer / Empty */}
        {(editable || mode === "view") && (
          <div style={{ flex: 1, overflowY: "auto", padding: "clamp(24px, 5%, 48px) clamp(24px, 8%, 96px)" }}>
            {editable ? (
              <>
                <input
                  ref={titleRef}
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Note title…"
                  style={{
                    width: "100%", background: "transparent", border: "none", outline: "none",
                    fontFamily: "'Fraunces', serif",
                    fontSize: "clamp(26px, 4vw, 38px)",
                    fontWeight: 400,
                    color: "#1C1917", lineHeight: 1.15,
                    borderBottom: "2px solid #FEF3C7",
                    paddingBottom: 16, marginBottom: 24,
                    letterSpacing: "-0.5px",
                  }}
                />
                <textarea
                  ref={textareaRef}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Start writing…"
                  style={{
                    width: "100%", background: "transparent", border: "none", outline: "none", resize: "none",
                    fontFamily: "'Fraunces', serif",
                    fontSize: 17, color: "#374151", lineHeight: 1.85,
                    minHeight: "calc(100vh - 300px)",
                  }}
                />
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #FEF3C7", display: "flex", gap: 20, fontSize: 12, color: "#D1C4A8" }}>
                  <span>{wordCount(form.description)} words</span>
                  <span>{form.description?.length || 0} chars</span>
                </div>
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, color: "#1C1917", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 12, wordBreak: "break-word" }}>
                  {active?.title || "Untitled"}
                </h1>
                <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#A8A29E", fontFamily: "monospace" }}>
                    {active?.updatedAt ? `Updated ${timeAgo(active.updatedAt)}` : active?.createdAt ? `Created ${timeAgo(active.createdAt)}` : ""}
                  </span>
                  <span style={{ fontSize: 12, color: "#A8A29E" }}>·</span>
                  <span style={{ fontSize: 12, color: "#A8A29E" }}>{wordCount(active?.description)} words</span>
                </div>
                {active?.description ? (
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: "#374151", lineHeight: 1.85, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {active.description}
                  </div>
                ) : (
                  <p style={{ color: "#D1C4A8", fontStyle: "italic", fontFamily: "'Fraunces', serif", fontSize: 17 }}>
                    No content. Click Edit to start writing.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {mode === "idle" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, background: "#FEF3C7", border: "1.5px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📝</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: "#1C1917", letterSpacing: "-0.5px" }}>Your notes</h2>
            <p style={{ fontSize: 14, color: "#78716C", textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>
              Select a note from the sidebar or create a new one to get started.
            </p>
            <button onClick={handleNew} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#FBBF24", border: "none", borderRadius: 12,
              padding: "12px 28px", fontSize: 14, fontWeight: 700, color: "#1C1917",
              cursor: "pointer", fontFamily: "'Syne', sans-serif",
              boxShadow: "0 4px 16px rgba(251,191,36,0.4)", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              + New note  <span style={{ fontSize: 12, opacity: 0.6 }}>⌘N</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(28,25,23,0.6)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)", animation: "fadeIn 0.15s ease",
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "32px 36px",
            maxWidth: 380, width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.2s ease",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12, textAlign: "center" }}>🗑</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#1C1917", textAlign: "center", marginBottom: 8, fontWeight: 400 }}>Delete note?</h3>
            <p style={{ color: "#78716C", textAlign: "center", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              This action cannot be undone. The note will be permanently removed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{
                flex: 1, padding: "11px", background: "transparent", border: "1.5px solid #FDE68A",
                borderRadius: 11, fontSize: 14, fontFamily: "'Syne', sans-serif", fontWeight: 600,
                cursor: "pointer", color: "#78716C",
              }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{
                flex: 1, padding: "11px", background: "#EF4444", border: "none",
                borderRadius: 11, fontSize: 14, fontFamily: "'Syne', sans-serif", fontWeight: 700,
                cursor: "pointer", color: "#fff",
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 300,
          background: toast.type === "error" ? "#FEF2F2" : "#1C1917",
          color: toast.type === "error" ? "#DC2626" : "#FEF3C7",
          border: `1px solid ${toast.type === "error" ? "#FECACA" : "#FBBF24"}`,
          borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          animation: "fadeUp 0.2s ease",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ color: toast.type === "error" ? "#EF4444" : "#FBBF24", fontSize: 14 }}>
            {toast.type === "error" ? "⚠" : "✦"}
          </span>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        input::placeholder, textarea::placeholder { color: #D1C4A8; font-family: 'Fraunces', serif; font-style: italic; }
      `}</style>
    </div>
  );
}