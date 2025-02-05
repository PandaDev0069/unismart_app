from flask import Blueprint, request, jsonify
import sqlite3

reminders_bp = Blueprint("reminders", __name__)

# Database connection
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Get reminders for a specific date
@reminders_bp.route("/api/get_reminders/<date>", methods=["GET"])
def get_reminders(date):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM reminders WHERE date=?", (date,))
        reminders = {row["time"]: row["text"] for row in cursor.fetchall()}
        conn.close()
        print(f"Reminders for {date}: {reminders}")  # Debugging statement
        return jsonify({"reminders": reminders}), 200
    except Exception as e:
        print(f"Error fetching reminders: {e}")  # Debugging statement
        return jsonify({"error": str(e)}), 500

# Add a reminder
@reminders_bp.route("/api/add_reminder", methods=["POST"])
def add_reminder():
    try:
        data = request.get_json()
        time = data.get("time")
        text = data.get("text")
        date = data.get("date")

        if not time or not text or not date:
            return jsonify({"error": "Missing fields"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO reminders (date, time, text) VALUES (?, ?, ?)", (date, time, text))
        conn.commit()
        conn.close()

        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a reminder
@reminders_bp.route("/api/delete_reminder/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM reminders WHERE id = ?", (reminder_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
