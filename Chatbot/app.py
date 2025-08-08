from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import load_qa_data, find_best_answer

app = Flask(__name__)
CORS(app, supports_credentials=True)

qa_data = load_qa_data()

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")
    answer = find_best_answer(question, qa_data)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)
