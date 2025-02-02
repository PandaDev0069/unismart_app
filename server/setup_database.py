import sqlite3

def create_table():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()


    # Create tasks table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY ,
            text TEXT NOT NULL
        )
    """)

    # Create events table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            start TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_table()
    print("Database and tasks table created successfully!")
