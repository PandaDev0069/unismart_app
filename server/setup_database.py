import sqlite3

def setup_database():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Create tasks table with timestamp
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            due_date TEXT  -- Store due dates for scheduling tasks
        )
    ''')

    # Create reminders table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            text TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    setup_database()
    print("✅ Database setup completed.")
