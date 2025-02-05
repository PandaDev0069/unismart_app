import sqlite3

def setup_database():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Create tasks table with timestamp
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            due_date TEXT NOT NULL,
            completed INTEGER DEFAULT 0 CHECK (completed IN (0, 1))

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

def populate_database():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Populate the 'todos' table with 10 different entries
    todo_entries = [
        ("Complete CS50 assignment", "2025-02-10", 0),
        ("Review Japanese vocabulary", "2025-02-11", 0),
        ("Work on AI assistant feature", "2025-02-12", 0),
        ("Fix bugs in UniSmart Hub", "2025-02-13", 0),
        ("Watch a tutorial on Flask", "2025-02-14", 0),
        ("Complete a programming challenge", "2025-02-15", 0),
        ("Refactor UniSmart UI", "2025-02-16", 0),
        ("Study SQL optimization techniques", "2025-02-17", 0),
        ("Prepare for upcoming university", "2025-02-18", 0),
        ("Write a blog post about learning React", "2025-02-19", 0),
    ]

    cursor.executemany("INSERT INTO tasks (text, due_date, completed) VALUES (?, ?, ?)", todo_entries)

    # Populate the 'reminders' table with 10 different reminders
    reminder_entries = [
        ("2025-02-10", "09:00", "Morning workout"),
        ("2025-02-10", "12:00", "Prepare lunch"),
        ("2025-02-10", "17:00", "Start work shift"),
        ("2025-02-11", "10:00", "Practice typing"),
        ("2025-02-11", "14:00", "Study Japanese"),
        ("2025-02-11", "16:00", "Review Flask docs"),
        ("2025-02-12", "08:30", "Plan AI assistant features"),
        ("2025-02-12", "13:00", "Work on UniSmart Hub"),
        ("2025-02-13", "18:00", "Join online coding session"),
        ("2025-02-14", "20:00", "Watch a tech podcast"),
    ]

    cursor.executemany("INSERT INTO reminders (date, time, text) VALUES (?, ?, ?)", reminder_entries)

    # Commit changes and close connection
    conn.commit()
    conn.close()

    # Confirm the insertion is complete
    print("Database has been populated with sample data.")



if __name__ == "__main__":
    setup_database()
    populate_database()
    print("✅ Database setup completed.")
