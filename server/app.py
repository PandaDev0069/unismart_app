import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS

# Add the server directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config
from routes.tasks import tasks_bp
from routes.notes import notes_bp
from routes.reminders import reminders_bp
from routes.file_upload import file_upload_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Updated CORS configuration
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://localhost:3001"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "supports_credentials": True
        }
    })

    # Ensure upload directory exists
    upload_dir = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    # Add route to serve uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # Register blueprints
    app.register_blueprint(tasks_bp)
    app.register_blueprint(notes_bp)
    app.register_blueprint(reminders_bp)
    app.register_blueprint(file_upload_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)