from flask import Blueprint, request, jsonify
import sqlite3

tasks_bp = Blueprint("tasks", __name__)  # Ensure this line exists

# Database setup
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Save tasks to database at the end of session
@tasks_bp.route("/api/save_tasks", methods=["POST", "OPTIONS"])
def save_tasks():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight request success"}), 200  # Handle preflight request

    try:
        data = request.json
        tasks = data.get("tasks", [])

        conn = get_db_connection()
        cursor = conn.cursor()

        for task in tasks:
            cursor.execute("INSERT OR IGNORE INTO tasks (id, text) VALUES (?, ?)", (task["id"], task["text"]))

        conn.commit()
        conn.close()
        return jsonify({"message": "Tasks saved successfully"}), 200
    except Exception as e:
        print("❌ Error saving tasks:", e)
        return jsonify({"error": str(e)}), 500



# Load tasks from database at the start of session
@tasks_bp.route("/api/get_tasks", methods=["GET"])
def get_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks")
        tasks = cursor.fetchall()
        conn.close()

        tasks_list = [{"id": row["id"], "text": row["text"]} for row in tasks]

        print("✅ API Response:", tasks_list)  # Debugging log
        return jsonify({"tasks": tasks_list}), 200
    except Exception as e:
        print("❌ API Error:", e)  # Debugging log
        return jsonify({"error": str(e)}), 500


    

@tasks_bp.route("/api/delete_task/<int:id>", methods=["DELETE"])
def delete_task(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM tasks WHERE id=?", (id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
