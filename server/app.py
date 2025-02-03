from flask import Flask
from flask_cors import CORS
from routes.calendar_routes import calendar_bp
from routes.reminders import reminders_bp


app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow all API requests

app.register_blueprint(calendar_bp)
app.register_blueprint(reminders_bp)


if __name__ == "__main__":
    app.run(debug=True)