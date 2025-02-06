import React, { useState, useEffect } from 'react';
import { getNotes, addNote, deleteNote, editNote } from '../API';
import ReactMarkdown from 'react-markdown';
import './Notes.css';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: "", content: "" });
    const [editingNote, setEditingNote] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await getNotes();
            if (response && response.notes) {
                setNotes(response.notes);
            }
        } catch (err) {
            setError("Failed to fetch notes");
            console.error(err);
        }
    };

    const handleAddNote = async () => {
        try {
            if (!newNote.title || !newNote.content) return;
            const response = await addNote(newNote);
            if (response && response.id) {
                setNotes([...notes, { ...newNote, id: response.id }]);
                setNewNote({ title: "", content: "" });
            }
        } catch (err) {
            setError("Failed to add note");
            console.error(err);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            setError("Failed to delete note");
            console.error(err);
        }
    };

    const handleEditNote = async (id) => {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        setEditingNote(id);
        setNewNote({ title: note.title, content: note.content });
    };

    const handleSaveEdit = async () => {
        try {
            await editNote(editingNote, newNote);
            setNotes(notes.map(note => 
                note.id === editingNote 
                    ? { ...note, ...newNote }
                    : note
            ));
            resetForm();
        } catch (err) {
            setError("Failed to edit note");
            console.error(err);
        }
    };

    const resetForm = () => {
        setNewNote({ title: "", content: "" });
        setEditingNote(null);
    };

    return (
        <div className="notes-container">
            <h2>📓 Notes</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="note-input">
                <input
                    type="text"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <textarea
                    placeholder="Write your note here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
                <div className="note-input-buttons">
                    {editingNote ? (
                        <>
                            <button onClick={handleSaveEdit}>Save Note</button>
                            <button onClick={resetForm} className="cancel-btn">Cancel</button>
                        </>
                    ) : (
                        <button onClick={handleAddNote}>Add Note</button>
                    )}
                </div>
            </div>

            <div className="notes-list">
                {notes.map((note) => (
                    <div key={note.id} className="note-card">
                        <h3>{note.title}</h3>
                        <ReactMarkdown>{note.content}</ReactMarkdown>
                        <div className="note-actions">
                            <button onClick={() => handleEditNote(note.id)}>Edit</button>
                            <button 
                                onClick={() => handleDeleteNote(note.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;