from flask import Blueprint, request, jsonify
import sqlite3

tasks_bp = Blueprint("tasks", __name__)

def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@tasks_bp.route("/api/add_task", methods=["POST"])
def add_task():
    try:
        data = request.json
        task_text = data.get("text")
        due_date = data.get("due_date")
        # Standardize priority case
        priority = data.get("priority", "Medium")
        if priority:
            priority = priority.title()  # Converts to Title Case (e.g., "high" -> "High")
        
        # Validate priority
        if priority not in ["High", "Medium", "Low"]:
            priority = "Medium"  # Default if invalid

        if not task_text or not due_date:
            return jsonify({"error": "Missing fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO tasks (text, due_date, priority) VALUES (?, ?, ?)", 
            (task_text, due_date, priority)
        )
        conn.commit()
        new_task_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "message": "Task added successfully", 
            "id": new_task_id,
            "priority": priority
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get tasks with filters
@tasks_bp.route("/api/get_tasks", methods=["GET"])
@tasks_bp.route("/api/get_tasks/<date>", methods=["GET"])
def get_tasks(date=None):
    try:
        if not date:
            date = request.args.get("date")
        priority = request.args.get("priority")
        completed = request.args.get("completed")

        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT * FROM tasks WHERE 1=1
        """
        params = []

        if date:
            query += " AND date(due_date) = date(?)"
            params.append(date)
        if priority:
            query += " AND priority = ?"
            params.append(priority)
        if completed is not None:
            query += " AND completed = ?"
            params.append(int(completed))

        # Add ORDER BY clause for priority
        query += """ 
            ORDER BY 
                CASE priority
                    WHEN 'High' THEN 1
                    WHEN 'Medium' THEN 2
                    WHEN 'Low' THEN 3
                END,
                due_date ASC
        """

        cursor.execute(query, params)
        tasks = cursor.fetchall()
        conn.close()

        return jsonify({
            "tasks": [{
                "id": row["id"],
                "text": row["text"],
                "due_date": row["due_date"],
                "completed": bool(row["completed"]),
                "priority": row["priority"]
            } for row in tasks]
        }), 200

    except Exception as e:
        print(f"Error in get_tasks: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500


# Update a task (toggle completion)
@tasks_bp.route("/api/update_task/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # First get current completion status
        cursor.execute("SELECT completed FROM tasks WHERE id = ?", (task_id,))
        current_status = cursor.fetchone()["completed"]
        # Toggle the status
        new_status = 1 if current_status == 0 else 0
        cursor.execute("UPDATE tasks SET completed = ? WHERE id = ?", (new_status, task_id))
        conn.commit()
        conn.close()
        return jsonify({
            'success': True, 
            'completed': new_status,
            'taskId': task_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Edit a task
@tasks_bp.route("/api/edit_task/<int:task_id>", methods=["PUT"])
def edit_task(task_id):
    try:
        data = request.get_json()
        new_text = data.get("text")
        new_priority = data.get("priority")
        if not new_text or not new_priority:
            return jsonify({"error": "Missing fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE tasks SET text = ? , priority = ? WHERE id = ?", (new_text, new_priority, task_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Task updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete task
@tasks_bp.route("/api/delete_task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
