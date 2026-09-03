import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import "../css/Notes.css";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem("sahaya_notes");
      return savedNotes ? JSON.parse(savedNotes) : [
        {
          id: 1,
          content: "Today was a gentle step forward. I practiced deep breathing for 5 minutes when I felt overwhelmed.",
          date: new Date().toLocaleDateString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeNote, setActiveNote] = useState(notes[0]?.id || null);
  const [currentNote, setCurrentNote] = useState(notes[0]?.content || "");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("sahaya_notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      content: "",
      date: new Date().toLocaleDateString()
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    setCurrentNote("");
    setSaveStatus("");
  };

  const saveCurrentNote = () => {
    if (!activeNote) return;
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === activeNote
          ? { ...note, content: currentNote, date: new Date().toLocaleDateString() }
          : note
      )
    );
    setSaveStatus("Saved to your private journal 🌿");
    setTimeout(() => setSaveStatus(""), 2500);
  };

  const deleteNote = (id) => {
    const updated = notes.filter((note) => note.id !== id);
    setNotes(updated);
    if (updated.length > 0) {
      setActiveNote(updated[0].id);
      setCurrentNote(updated[0].content);
    } else {
      setActiveNote(null);
      setCurrentNote("");
    }
    setSaveStatus("");
  };

  const handleNoteClick = (note) => {
    setActiveNote(note.id);
    setCurrentNote(note.content);
    setSaveStatus("");
  };

  return (
    <>
      <Nav />
      <div className="journal-page-wrapper">
        <div className="journal-container">
          {/* Sidebar */}
          <aside className="journal-sidebar">
            <div className="journal-sidebar-header">
              <h2 className="journal-sidebar-title">My Reflections</h2>
              <button onClick={createNewNote} className="journal-new-btn">
                + New Entry
              </button>
            </div>

            {notes.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", textAlign: "center", marginTop: "40px" }}>
                No entries yet. Click "+ New Entry" to begin writing.
              </p>
            ) : (
              <ul className="journal-notes-list">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className={`journal-note-item ${note.id === activeNote ? "active" : ""}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <p className="journal-note-preview">
                      {note.content ? note.content.slice(0, 32) + "..." : "Untitled Reflection"}
                    </p>
                    <p className="journal-note-date">{note.date || "Today"}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Main Editor */}
          <main className="journal-editor-card">
            {activeNote ? (
              <>
                <div className="journal-editor-header">
                  <div>
                    <h1 className="journal-editor-title">Private Journal Entry</h1>
                    {saveStatus && (
                      <span style={{ fontSize: "0.82rem", color: "var(--color-primary)", fontWeight: 600 }}>
                        {saveStatus}
                      </span>
                    )}
                  </div>
                  <div className="journal-editor-actions">
                    <button onClick={saveCurrentNote} className="journal-save-btn">
                      <span>💾</span> Save Note
                    </button>
                    <button onClick={() => deleteNote(activeNote)} className="journal-delete-btn" title="Delete note">
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>

                <textarea
                  className="journal-textarea"
                  value={currentNote}
                  onChange={(e) => {
                    setCurrentNote(e.target.value);
                    setSaveStatus("");
                  }}
                  placeholder="Express your thoughts freely. What is on your mind today? Take your time..."
                />
              </>
            ) : (
              <div className="journal-empty-placeholder">
                <span style={{ fontSize: "3rem", marginBottom: "12px" }}>📖</span>
                <h3 style={{ margin: "0 0 8px 0", color: "var(--color-text-main)" }}>
                  Your Mindful Sanctuary
                </h3>
                <p style={{ margin: "0 0 20px 0", maxWidth: "380px" }}>
                  Writing down thoughts untangles complex emotions. Select an entry from the left or create a new one.
                </p>
                <button onClick={createNewNote} className="journal-new-btn" style={{ padding: "10px 24px" }}>
                  Start a New Entry
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </>
  );
};

export default Notes;
