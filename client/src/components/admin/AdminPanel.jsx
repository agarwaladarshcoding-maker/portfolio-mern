import { useState, useEffect } from "react";
import "./AdminPanel.css";

// ── Simple password check ──────────────────────────────────
var ADMIN_PASSWORD = "adarsh2026";

// ── API helper ─────────────────────────────────────────────
async function apiFetch(url, options) {
  var res = await fetch(url, options);
  var text = await res.text();
  if (!text) return { success: true, data: null };
  try { return JSON.parse(text); }
  catch(e) { return { success: false, error: text }; }
}

// ── Tabs ───────────────────────────────────────────────────
var TABS = ["GRIND", "PROJECTS", "NOW", "INBOX"];

export default function AdminPanel() {
  var [authed,  setAuthed]  = useState(sessionStorage.getItem("admin_authed") === "1");
  var [pw,      setPw]      = useState("");
  var [pwErr,   setPwErr]   = useState("");
  var [tab,     setTab]     = useState("GRIND");

  function login() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
    } else {
      setPwErr("Wrong password");
    }
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__box">
          <div className="admin-login__logo">
            <em>A</em>darsh<span>.</span>
          </div>
          <div className="admin-login__label">ADMIN ACCESS</div>
          <input
            className="admin-input"
            type="password"
            placeholder="Password"
            value={pw}
            onChange={function(e) { setPw(e.target.value); setPwErr(""); }}
            onKeyDown={function(e) { if (e.key === "Enter") login(); }}
            autoFocus
          />
          {pwErr && <div className="admin-error">{pwErr}</div>}
          <button className="admin-btn admin-btn--primary" onClick={login}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin__topbar">
        <div className="admin__topbar-inner">
          <a href="/" className="admin__back">← Site</a>
          <div className="admin__tabs">
            {TABS.map(function(t) {
              return (
                <button
                  key={t}
                  className={"admin__tab " + (tab === t ? "admin__tab--active" : "")}
                  onClick={function() { setTab(t); }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <button
            className="admin__logout"
            onClick={function() {
              sessionStorage.removeItem("admin_authed");
              setAuthed(false);
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin__body">
        {tab === "GRIND"    && <GrindTab />}
        {tab === "PROJECTS" && <ProjectsTab />}
        {tab === "NOW"      && <NowTab />}
        {tab === "INBOX"    && <InboxTab />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// GRIND TAB
// ══════════════════════════════════════════════════════════
function GrindTab() {
  var [posts,   setPosts]   = useState([]);
  var [loading, setLoading] = useState(true);
  var [editing, setEditing] = useState(null);
  var [form,    setForm]    = useState(emptyGrind());
  var [msg,     setMsg]     = useState("");

  function emptyGrind() {
    return { title:"", content:"", dayNumber:"", tags:"", linkedInUrl:"", isPublished: false };
  }

  function load() {
    setLoading(true);
    apiFetch("/api/grind?limit=50&page=1")
      .then(function(d) { setPosts(d.data || []); })
      .finally(function() { setLoading(false); });
  }

  useEffect(load, []);

  function startEdit(post) {
    setEditing(post._id);
    setForm({
      title:       post.title || "",
      content:     post.content || "",
      dayNumber:   post.dayNumber || "",
      tags:        Array.isArray(post.tags) ? post.tags.join(", ") : "",
      linkedInUrl: post.linkedInUrl || "",
      isPublished: post.isPublished || false,
    });
  }

  function startNew() {
    setEditing("new");
    setForm(emptyGrind());
  }

  async function save() {
    var body = {
      title:       form.title,
      content:     form.content,
      dayNumber:   parseInt(form.dayNumber) || 0,
      tags:        form.tags.split(",").map(function(t) { return t.trim(); }).filter(Boolean),
      linkedInUrl: form.linkedInUrl,
      isPublished: form.isPublished,
    };
    var url    = editing === "new" ? "/api/grind" : "/api/grind/" + editing;
    var method = editing === "new" ? "POST" : "PATCH";
    var d = await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (d.success) { setMsg("Saved."); setEditing(null); load(); }
    else setMsg("Error: " + d.error);
  }

  async function del(id) {
    if (!confirm("Delete this post?")) return;
    var d = await apiFetch("/api/grind/" + id, { method: "DELETE" });
    if (d.success) { setMsg("Deleted."); load(); }
    else setMsg("Error: " + d.error);
  }

  if (editing) {
    return (
      <div className="admin__panel">
        <div className="admin__panel-header">
          <h2 className="admin__panel-title">
            {editing === "new" ? "New Entry" : "Edit Entry"}
          </h2>
          <button className="admin__btn-ghost" onClick={function() { setEditing(null); }}>
            Cancel
          </button>
        </div>
        {msg && <div className="admin__msg">{msg}</div>}
        <div className="admin__form">
          <AdminField label="Day Number">
            <input className="admin-input" type="number" value={form.dayNumber}
              onChange={function(e) { setForm(Object.assign({}, form, { dayNumber: e.target.value })); }} />
          </AdminField>
          <AdminField label="Title">
            <input className="admin-input" value={form.title}
              onChange={function(e) { setForm(Object.assign({}, form, { title: e.target.value })); }} />
          </AdminField>
          <AdminField label="Content (markdown supported)">
            <textarea className="admin-textarea" rows={14} value={form.content}
              onChange={function(e) { setForm(Object.assign({}, form, { content: e.target.value })); }} />
          </AdminField>
          <AdminField label="Tags (comma separated)">
            <input className="admin-input" value={form.tags}
              onChange={function(e) { setForm(Object.assign({}, form, { tags: e.target.value })); }} />
          </AdminField>
          <AdminField label="LinkedIn URL">
            <input className="admin-input" value={form.linkedInUrl}
              onChange={function(e) { setForm(Object.assign({}, form, { linkedInUrl: e.target.value })); }} />
          </AdminField>
          <label className="admin__toggle">
            <input type="checkbox" checked={form.isPublished}
              onChange={function(e) { setForm(Object.assign({}, form, { isPublished: e.target.checked })); }} />
            <span>Published</span>
          </label>
          <button className="admin-btn admin-btn--primary" onClick={save}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin__panel">
      <div className="admin__panel-header">
        <h2 className="admin__panel-title">Grind Log</h2>
        <button className="admin-btn admin-btn--primary" onClick={startNew}>+ New Entry</button>
      </div>
      {msg && <div className="admin__msg">{msg}</div>}
      {loading ? <div className="admin__loading">Loading…</div> : (
        <div className="admin__list">
          {posts.map(function(post) {
            return (
              <div key={post._id} className="admin__item">
                <div className="admin__item-left">
                  <span className="admin__item-num">Day {post.dayNumber}</span>
                  <span className="admin__item-title">{post.title}</span>
                  <span className={"admin__item-badge " + (post.isPublished ? "admin__item-badge--green" : "admin__item-badge--red")}>
                    {post.isPublished ? "published" : "draft"}
                  </span>
                </div>
                <div className="admin__item-actions">
                  <button className="admin__btn-ghost" onClick={function() { startEdit(post); }}>Edit</button>
                  <button className="admin__btn-danger" onClick={function() { del(post._id); }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PROJECTS TAB
// ══════════════════════════════════════════════════════════
function ProjectsTab() {
  var [projects, setProjects] = useState([]);
  var [loading,  setLoading]  = useState(true);
  var [editing,  setEditing]  = useState(null);
  var [form,     setForm]     = useState(emptyProject());
  var [msg,      setMsg]      = useState("");

  function emptyProject() {
    return {
      title: "", description: "", longDescription: "",
      techStack: "", githubUrl: "", liveUrl: "", order: 0,
    };
  }

  function load() {
    setLoading(true);
    apiFetch("/api/projects")
      .then(function(d) { setProjects(d.data || []); })
      .finally(function() { setLoading(false); });
  }

  useEffect(load, []);

  function startEdit(project) {
    setEditing(project._id);
    setForm({
      title:           project.title || "",
      description:     project.description || "",
      longDescription: project.longDescription || "",
      techStack:       Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
      githubUrl:       project.githubUrl || "",
      liveUrl:         project.liveUrl || "",
      order:           project.order || 0,
    });
  }

  function startNew() {
    setEditing("new");
    setForm(emptyProject());
  }

  async function save() {
    var body = {
      title:           form.title,
      description:     form.description,
      longDescription: form.longDescription,
      techStack:       form.techStack.split(",").map(function(t) { return t.trim(); }).filter(Boolean),
      githubUrl:       form.githubUrl,
      liveUrl:         form.liveUrl,
      order:           parseInt(form.order) || 0,
    };
    var url    = editing === "new" ? "/api/projects" : "/api/projects/" + editing;
    var method = editing === "new" ? "POST" : "PATCH";
    var d = await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (d.success) { setMsg("Saved."); setEditing(null); load(); }
    else setMsg("Error: " + d.error);
  }

  async function del(id) {
    if (!confirm("Delete this project?")) return;
    var d = await apiFetch("/api/projects/" + id, { method: "DELETE" });
    if (d.success) { setMsg("Deleted."); load(); }
    else setMsg("Error: " + d.error);
  }

  if (editing) {
    return (
      <div className="admin__panel">
        <div className="admin__panel-header">
          <h2 className="admin__panel-title">
            {editing === "new" ? "New Project" : "Edit Project"}
          </h2>
          <button className="admin__btn-ghost" onClick={function() { setEditing(null); }}>Cancel</button>
        </div>
        {msg && <div className="admin__msg">{msg}</div>}
        <div className="admin__form">
          <AdminField label="Order (lower = appears first)">
            <input className="admin-input" type="number" value={form.order}
              onChange={function(e) { setForm(Object.assign({}, form, { order: e.target.value })); }} />
          </AdminField>
          <AdminField label="Title">
            <input className="admin-input" value={form.title}
              onChange={function(e) { setForm(Object.assign({}, form, { title: e.target.value })); }} />
          </AdminField>
          <AdminField label="Short description (shown on cards)">
            <textarea className="admin-textarea" rows={3} value={form.description}
              onChange={function(e) { setForm(Object.assign({}, form, { description: e.target.value })); }} />
          </AdminField>
          <AdminField label="Full write-up (markdown — shown on project page)">
            <textarea className="admin-textarea" rows={14} value={form.longDescription}
              onChange={function(e) { setForm(Object.assign({}, form, { longDescription: e.target.value })); }}
              placeholder={"## What it does\n\n## The problem\n\n## My approach\n\n## What I learned"} />
          </AdminField>
          <AdminField label="Tech stack (comma separated)">
            <input className="admin-input" value={form.techStack}
              onChange={function(e) { setForm(Object.assign({}, form, { techStack: e.target.value })); }}
              placeholder="Python, C++, React, MongoDB" />
          </AdminField>
          <AdminField label="GitHub URL">
            <input className="admin-input" value={form.githubUrl}
              onChange={function(e) { setForm(Object.assign({}, form, { githubUrl: e.target.value })); }} />
          </AdminField>
          <AdminField label="Live URL (optional)">
            <input className="admin-input" value={form.liveUrl}
              onChange={function(e) { setForm(Object.assign({}, form, { liveUrl: e.target.value })); }} />
          </AdminField>
          <button className="admin-btn admin-btn--primary" onClick={save}>Save Project</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin__panel">
      <div className="admin__panel-header">
        <h2 className="admin__panel-title">Projects</h2>
        <button className="admin-btn admin-btn--primary" onClick={startNew}>+ New Project</button>
      </div>
      {msg && <div className="admin__msg">{msg}</div>}
      {loading ? <div className="admin__loading">Loading…</div> : (
        <div className="admin__list">
          {projects.length === 0 && (
            <div className="admin__empty">No projects yet. Add your first one.</div>
          )}
          {projects.map(function(p) {
            return (
              <div key={p._id} className="admin__item">
                <div className="admin__item-left">
                  <span className="admin__item-num">#{p.order || 0}</span>
                  <span className="admin__item-title">{p.title}</span>
                  {p.techStack && p.techStack.length > 0 && (
                    <span className="admin__item-sub">
                      {p.techStack.slice(0, 3).join(" · ")}
                    </span>
                  )}
                </div>
                <div className="admin__item-actions">
                  <button className="admin__btn-ghost" onClick={function() { startEdit(p); }}>Edit</button>
                  <button className="admin__btn-danger" onClick={function() { del(p._id); }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// NOW TAB — edits the NowConfig document in DB
// ══════════════════════════════════════════════════════════
function NowTab() {
  var [form, setForm] = useState({
    location:   "Mumbai, India",
    building:   "",
    learning:   "",
    reading:    "",
    thinking:   "",
    instagram:  "",
    lastUpdated: "",
  });
  var [loading, setLoading] = useState(true);
  var [msg,     setMsg]     = useState("");

  useEffect(function() {
    apiFetch("/api/now")
      .then(function(d) {
        if (d.success && d.data) {
          setForm({
            location:    d.data.location    || "Mumbai, India",
            building:    Array.isArray(d.data.building)
              ? d.data.building.map(function(b) { return b.title + " | " + (b.detail || ""); }).join("\n")
              : "",
            learning:    Array.isArray(d.data.learning)  ? d.data.learning.join("\n")  : "",
            reading:     Array.isArray(d.data.reading)
              ? d.data.reading.map(function(b) { return b.title + " by " + b.author; }).join("\n")
              : "",
            thinking:    d.data.thinking    || "",
            instagram:   d.data.instagram   || "",
            lastUpdated: d.data.lastUpdated || "",
          });
        }
      })
      .finally(function() { setLoading(false); });
  }, []);

  async function save() {
    var body = {
      location:    form.location,
      lastUpdated: form.lastUpdated,
      instagram:   form.instagram,
      thinking:    form.thinking,
      building: form.building.split("\n").filter(Boolean).map(function(line) {
        var parts = line.split("|");
        return { title: parts[0].trim(), detail: (parts[1] || "").trim() };
      }),
      learning: form.learning.split("\n").filter(Boolean).map(function(l) { return l.trim(); }),
      reading: form.reading.split("\n").filter(Boolean).map(function(line) {
        var parts = line.split(" by ");
        return { title: parts[0].trim(), author: (parts[1] || "").trim() };
      }),
    };

    var d = await apiFetch("/api/now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (d.success) setMsg("Saved.");
    else setMsg("Error: " + d.error);
  }

  if (loading) return <div className="admin__panel"><div className="admin__loading">Loading…</div></div>;

  return (
    <div className="admin__panel">
      <div className="admin__panel-header">
        <h2 className="admin__panel-title">Now Page</h2>
        <button className="admin-btn admin-btn--primary" onClick={save}>Save</button>
      </div>
      {msg && <div className="admin__msg">{msg}</div>}

      <div className="admin__form">
        <div className="admin__now-hint">
          Changes here update your <a href="/now" target="_blank" className="admin__link">/now page ↗</a>
        </div>

        <AdminField label="Location">
          <input className="admin-input" value={form.location}
            onChange={function(e) { setForm(Object.assign({}, form, { location: e.target.value })); }} />
        </AdminField>

        <AdminField label="Last updated (e.g. March 2026)">
          <input className="admin-input" value={form.lastUpdated}
            onChange={function(e) { setForm(Object.assign({}, form, { lastUpdated: e.target.value })); }} />
        </AdminField>

        <AdminField label="Currently building — one per line, format: Title | Detail">
          <textarea className="admin-textarea" rows={5} value={form.building}
            onChange={function(e) { setForm(Object.assign({}, form, { building: e.target.value })); }}
            placeholder={"Algo trading engine in C++ | Zero-allocation order book\nThis portfolio | Shipping it daily"} />
        </AdminField>

        <AdminField label="Currently learning — one item per line">
          <textarea className="admin-textarea" rows={5} value={form.learning}
            onChange={function(e) { setForm(Object.assign({}, form, { learning: e.target.value })); }}
            placeholder={"Stochastic calculus\nCUDA programming\nReinforcement learning"} />
        </AdminField>

        <AdminField label="Currently reading — one per line, format: Title by Author">
          <textarea className="admin-textarea" rows={4} value={form.reading}
            onChange={function(e) { setForm(Object.assign({}, form, { reading: e.target.value })); }}
            placeholder={"Advances in Financial ML by Marcos López de Prado\nThe Man from the Future by Ananyo Bhattacharya"} />
        </AdminField>

        <AdminField label="Currently thinking about">
          <textarea className="admin-textarea" rows={5} value={form.thinking}
            onChange={function(e) { setForm(Object.assign({}, form, { thinking: e.target.value })); }} />
        </AdminField>

        <AdminField label="Instagram handle (without @)">
          <input className="admin-input" value={form.instagram}
            onChange={function(e) { setForm(Object.assign({}, form, { instagram: e.target.value })); }} />
        </AdminField>

        <button className="admin-btn admin-btn--primary" onClick={save}>Save Now Page</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// INBOX TAB
// ══════════════════════════════════════════════════════════
function InboxTab() {
  var [messages, setMessages] = useState([]);
  var [loading,  setLoading]  = useState(true);
  var [msg,      setMsg]      = useState("");

  useEffect(function() {
    setLoading(true);
    apiFetch("/api/contact")
      .then(function(d) { setMessages(d.data || []); })
      .finally(function() { setLoading(false); });
  }, []);

  async function del(id) {
    if (!confirm("Delete this message?")) return;
    var d = await apiFetch("/api/contact/" + id, { method: "DELETE" });
    if (d.success) {
      setMsg("Deleted.");
      setMessages(function(prev) { return prev.filter(function(m) { return m._id !== id; }); });
    }
  }

  return (
    <div className="admin__panel">
      <div className="admin__panel-header">
        <h2 className="admin__panel-title">Inbox</h2>
      </div>
      {msg && <div className="admin__msg">{msg}</div>}
      {loading ? <div className="admin__loading">Loading…</div> : (
        <div className="admin__list">
          {messages.length === 0 && <div className="admin__empty">No messages yet.</div>}
          {messages.map(function(m) {
            return (
              <div key={m._id} className="admin__item admin__item--message">
                <div className="admin__item-left">
                  <span className="admin__item-title">{m.name}</span>
                  <span className="admin__item-sub">{m.email}</span>
                  <p className="admin__item-body">{m.message}</p>
                </div>
                <button className="admin__btn-danger" onClick={function() { del(m._id); }}>
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Shared field wrapper ───────────────────────────────────
function AdminField(props) {
  return (
    <div className="admin__field">
      <label className="admin__field-label">{props.label}</label>
      {props.children}
    </div>
  );
}