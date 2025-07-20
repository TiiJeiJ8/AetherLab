#TODO App.py____ Backend starts here

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)

# API 示例：数学建模接口
@app.route('/api/model', methods=['POST'])
def model_api():
    data = request.json
    # 这里可以做数学建模相关计算
    result = {'msg': '模型计算结果', 'input': data}
    return jsonify(result)

# 静态资源托管
@app.route('/<path:path>')
def static_proxy(path):
    # 如果请求的是静态文件，则直接返回
    file_path = os.path.join(app.static_folder, path)
    if os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    # 其它所有路由都返回index.html（history路由回退）
    return send_from_directory(app.static_folder, 'index.html')

# 首页也返回index.html
@app.route('/')
def root():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8050, debug=True)
