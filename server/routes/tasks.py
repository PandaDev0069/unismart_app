from flask import Blueprint, request, jsonify
import sqlite3

tasks_bp = Blueprint("tasks", __name__)  # Ensure this line exists

# Database setup
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Save tasks to database at the end of session
@tasks_bp.route("/api/save_tasks", methods=["POST"])
def save_tasks():
    try:
        data = request.json
        tasks = data.get("tasks", [])

        conn = get_db_connection()
        cursor = conn.cursor()


        # Insert new tasks withpout deleting old ones
        for task in tasks:
            cursor.execute("INSERT OR IGNORE INTO tasks (id, text) VALUES (?, ?)", (task["id"], task["text"]))

        conn.commit()
        conn.close()
        return jsonify({"message": "Tasks saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Load tasks from database at the start of session
@tasks_bp.route("/api/load_tasks", methods=["GET"])
def get_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks")
        tasks = cursor.fetchall()
        conn.close()

        # Convert database rows to JSON
        tasks_list = [{"id": row["id"], "text": row["text"]} for row in tasks]

        return jsonify({"tasks": tasks_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500