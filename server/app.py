from flask import Flask
from flask_cors import CORS
from routes.tasks import tasks_bp
from routes.notes import notes_bp
from routes.reminders import reminders_bp

app = Flask(__name__)

# Configure CORS with more specific settings
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

app.register_blueprint(reminders_bp)
app.register_blueprint(notes_bp)
app.register_blueprint(tasks_bp)

if __name__ == "__main__":
    app.run(debug=True)