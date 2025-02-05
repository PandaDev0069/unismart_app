from flask import Flask
from flask_cors import CORS
from routes.tasks import tasks_bp
from routes.reminders import reminders_bp

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow all API requests

app.register_blueprint(reminders_bp)
app.register_blueprint(tasks_bp)

if __name__ == "__main__":
    app.run(debug=True)