
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import webbrowser
import threading
import os
from loguru import logger
import sys

# Log directory
LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

# Main channel log
logger.add(os.path.join(LOG_DIR, "main.log"), rotation="10 MB", retention="10 days", encoding="utf-8", enqueue=True, backtrace=True, diagnose=True)
# Console output
logger.add(sys.stdout, colorize=True, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")

logger.info("AetherLab main program started")

app = Flask(__name__, static_folder='../frontend/dist')
CORS(app)

# API example
@app.route('/api/model', methods=['POST'])
def model_api():
    # Independent module log
    logger.add(os.path.join(LOG_DIR, "model_api.log"), rotation="5 MB", retention="7 days", encoding="utf-8", enqueue=True)
    data = request.json
    logger.info(f"Received model request: {data}")
    # ...business logic...
    logger.success("Model computation finished")
    return jsonify({'msg': 'Model computation result', 'input': data})

# 前端路由兜底
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    def open_browser():
        webbrowser.open_new('http://127.0.0.1:8050/')
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        logger.info("Main program will open browser")
        threading.Timer(1, open_browser).start()
    logger.info(f"Main program starts Flask service, port 8050, debug={True}")
    app.run(port=8050, debug=True)
