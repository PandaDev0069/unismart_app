import sqlite3
from flask import Blueprint, request, jsonify

calendar_bp = Blueprint("calendar", __name__)

def  get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Route to fetch all events
@calendar_bp.route("/api/get_events", methods=["GET"])
def get_events():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()
        conn.close()

        return jsonify({"events": [{"id": row["id"], "title": row["title"], "start": row["start"]} for row in events]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to add a new event
@calendar_bp.route("/api/add-event", methods=["POST"])
def add_event():
    try:
        data = request.json
        title = data["title"]
        date = data["date"]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO events (title, start) VALUES (?, ?)", (title, date))
        conn.commit()
        conn.close()

        return jsonify({"message": "Event added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

