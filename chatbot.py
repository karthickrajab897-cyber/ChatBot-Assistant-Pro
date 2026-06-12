import json
import random
import re
from difflib import SequenceMatcher

class CustomNLPBot:
    def __init__(self, dataset_path="dataset.json"):
        self.dataset_path = dataset_path
        self.intents = []
        self.load_data()

    def load_data(self):
        try:
            with open(self.dataset_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                self.intents = data.get('intents', [])
        except FileNotFoundError:
            print(f"Error: {self.dataset_path} not found.")
            self.intents = []

    def clean_text(self, text):
        # Remove punctuation and convert to lowercase for better matching
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        return text

    def get_similarity(self, a, b):
        return SequenceMatcher(None, a, b).ratio()

    def get_response(self, user_input):
        if not user_input or not user_input.strip():
            return "Please say something."

        cleaned_input = self.clean_text(user_input)
        
        best_match_intent = None
        highest_similarity = 0.0

        for intent in self.intents:
            for pattern in intent['patterns']:
                cleaned_pattern = self.clean_text(pattern)
                similarity = self.get_similarity(cleaned_input, cleaned_pattern)
                
                # Check for exact substring match (e.g., if user types "python" and pattern is "python")
                if cleaned_pattern in cleaned_input.split() and len(cleaned_pattern) > 3:
                    similarity += 0.4 # Boost score for direct keyword matches
                
                if similarity > highest_similarity:
                    highest_similarity = similarity
                    best_match_intent = intent

        # Threshold for understanding
        if highest_similarity > 0.5 and best_match_intent:
            return random.choice(best_match_intent['responses']), best_match_intent['tag']
        else:
            return "I'm not quite sure I understand. Could you rephrase that? I can help with questions about Python, AI, ML, or this internship project.", "unknown"

# Initialize a global instance for the app to use
chatbot_engine = CustomNLPBot()

def get_bot_response(message):
    return chatbot_engine.get_response(message)
