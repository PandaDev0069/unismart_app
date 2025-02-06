from flask import Blueprint, request, jsonify
import sqlite3

notes_bp = Blueprint("notes", __name__)

def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Fetch all notes
@notes_bp.route("/api/get_notes", methods=["GET"])
def get_notes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notes ORDER BY created_at DESC")
        notes = cursor.fetchall()
        conn.close()

        notes_list = [{
            "id": row["id"], 
            "title": row["title"], 
            "content": row["content"], 
            "created_at": row["created_at"]
        } for row in notes]
        
        return jsonify({"notes": notes_list}), 200
    except Exception as e:
        print(f"Error in get_notes: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500
    

# Add a new note
@notes_bp.route("/api/add_note", methods=["POST"])
def add_note():
    try:
        data = request.json
        title = data.get("title")
        content = data.get("content")

        if not title or not content:
            return jsonify({"error": "Missing title or content"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO notes (title, content) VALUES (?, ?)", (title, content))
        conn.commit()
        new_note_id = cursor.lastrowid
        conn.close()

        return jsonify({"message": "Note added successfully", "id": new_note_id}), 201
    except Exception as e:
        print(f"Error in add_note: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500
    
# Edit a note
@notes_bp.route("/api/edit_note/<int:note_id>", methods=["PUT"])
def edit_note(note_id):
    try:
        data = request.json
        title = data.get("title")
        content = data.get("content")

        if not title or not content:
            return jsonify({"error": "Missing title or content"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE notes SET title = ?, content = ? WHERE id = ?",
            (title, content, note_id)
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Note updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a note
@notes_bp.route("/api/delete_note/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM notes WHERE id = ?", (note_id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Note Deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500