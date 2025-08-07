import json
from difflib import get_close_matches

def load_qa_data(filepath="qa_data.json"):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def find_best_answer(user_question, qa_data):
    # Get all known questions
    questions = [item['question'] for item in qa_data]

    # Find the closest match
    matches = get_close_matches(user_question.lower(), [q.lower() for q in questions], n=1, cutoff=0.4)

    if matches:
        matched_question = matches[0]
        for item in qa_data:
            if item['question'].lower() == matched_question:
                return item['answer']
    return "Sorry, I couldn't understand your question."
