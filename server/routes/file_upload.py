import os
import magic
import sqlite3
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt", "png", "jpg", "jpeg"}

file_upload_bp = Blueprint('file_upload', __name__)

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Upload file
@file_upload_bp.route("/api/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]
        if file.filename == "" or not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400
        
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Save file metadata in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO files (filename, filepath) VALUES (?, ?)", (filename, file_path))
        conn.commit()
        conn.close()

        return jsonify({"message": "File uploaded successfully", "filename": filename}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch all uploaded files
@file_upload_bp.route("/api/get_files", methods=["GET"])
def get_files():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM files ORDER BY id DESC")
        files = cursor.fetchall()
        conn.close()

        response = jsonify({
            "files": [{
                "id": row["id"], 
                "filename": row["filename"], 
                "category": row["category"]
            } for row in files]
        })
        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete file
@file_upload_bp.route("/api/delete_files/<int:file_id>", methods=["DELETE"])
def delete_file(file_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT filepath FROM files WHERE id = ?", (file_id,))
        file = cursor.fetchone()

        if file:
            os.remove(file["filepath"])  # Delete file from server
            cursor.execute("DELETE FROM files WHERE id = ?", (file_id,))
            conn.commit()
            conn.close()
            return jsonify({"message": "File deleted successfully"}), 200
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500