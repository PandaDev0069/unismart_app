from flask import Flask, jsonify
from flask_cors import CORS
from routes.tasks import tasks_bp

app = Flask(__name__)
CORS(app)  # Allows React to access Flask

app.register_blueprint(tasks_bp)

if __name__ == "__main__":
    app.run(debug=True)
