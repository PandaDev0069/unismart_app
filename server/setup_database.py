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

    # Create events table with proper timestamp
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            start TEXT NOT NULL  -- Store events with full datetime format
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    setup_database()
    print("✅ Database setup completed.")
