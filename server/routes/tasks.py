from flask import Blueprint, request, jsonify
import sqlite3

tasks_bp = Blueprint("tasks", __name__)

def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Add new task
@tasks_bp.route("/api/add_task", methods=["POST"])
def add_task():
    try:
        data = request.json
        task_text = data.get("text")
        due_date = data.get("due_date")  # Get due date from frontend

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tasks (text, due_date) VALUES (?, ?)", (task_text, due_date))
        conn.commit()
        new_task_id = cursor.lastrowid
        conn.close()

        return jsonify({"message": "Task added successfully", "id": new_task_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get tasks
@tasks_bp.route("/api/get_tasks", methods=["GET"])
def get_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks")
        tasks = cursor.fetchall()
        conn.close()

        tasks_list = [{"id": row["id"], "text": row["text"], "due_date": row["due_date"]} for row in tasks]
        return jsonify({"tasks": tasks_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete task
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
