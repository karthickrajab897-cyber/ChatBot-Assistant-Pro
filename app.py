import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_file
from chatbot import get_bot_response
import json

app = Flask(__name__)
HISTORY_FILE = 'chat_history.json'
STATS_FILE = 'stats.json'

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []

def save_history(history):
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=4)

def load_stats():
    if os.path.exists(STATS_FILE):
        try:
            with open(STATS_FILE, 'r', encoding='utf-8') as f:
                stats = json.load(f)
                if "topic_frequencies" not in stats:
                    stats["topic_frequencies"] = {}
                return stats
        except json.JSONDecodeError:
            pass
    return {
        "export_count": 0,
        "total_sessions": 1,
        "topic_frequencies": {}
    }

def save_stats(stats):
    with open(STATS_FILE, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=4)

# Increment session on load
app_stats = load_stats()
app_stats["total_sessions"] += 1
save_stats(app_stats)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get", methods=["POST"])
def get_bot_response_route():
    try:
        user_text = request.json.get('msg')
        if not user_text:
            return jsonify({"error": "Empty message"}), 400
        
        bot_response, intent_tag = get_bot_response(user_text)
        
        # Save to history
        history = load_history()
        timestamp = datetime.now().strftime("%I:%M %p")
        date_str = datetime.now().strftime("%Y-%m-%d")
        
        message_data = {
            "user_msg": user_text,
            "bot_msg": bot_response,
            "timestamp": timestamp,
            "date": date_str
        }
        history.append(message_data)
        save_history(history)
        
        # Update stats
        stats = load_stats()
        if intent_tag and intent_tag != "unknown":
            stats["topic_frequencies"][intent_tag] = stats["topic_frequencies"].get(intent_tag, 0) + 1
            save_stats(stats)
        
        return jsonify({
            "response": bot_response,
            "timestamp": timestamp
        })
    except Exception as e:
        print(f"Error processing message: {e}")
        return jsonify({"error": "An internal error occurred"}), 500

@app.route("/history", methods=["GET"])
def get_history():
    return jsonify(load_history())

@app.route("/clear", methods=["POST"])
def clear_history():
    save_history([])
    return jsonify({"status": "success"})

@app.route("/stats", methods=["GET"])
def get_stats():
    history = load_history()
    stats = load_stats()
    
    total_questions = len(history)
    total_responses = len(history)
    total_messages = total_questions + total_responses
    
    # Calculate most asked topic
    most_asked = "None"
    frequencies = stats.get("topic_frequencies", {})
    if frequencies:
        most_asked = max(frequencies, key=frequencies.get)
        most_asked = most_asked.replace("_", " ").title()

    # Calculate trends by date
    trends = {}
    for msg in history:
        date = msg.get("date", "Unknown")
        if date != "Unknown":
            trends[date] = trends.get(date, 0) + 2 # 1 user + 1 bot msg

    # Format trends for chart.js
    trend_labels = list(trends.keys())[-7:] # Last 7 days
    trend_data = [trends[d] for d in trend_labels]

    # Format topics for chart.js
    sorted_topics = sorted(frequencies.items(), key=lambda item: item[1], reverse=True)[:5] # Top 5
    topic_labels = [k.replace("_", " ").title() for k, v in sorted_topics]
    topic_data = [v for k, v in sorted_topics]

    return jsonify({
        "total_messages": total_messages,
        "total_questions": total_questions,
        "total_responses": total_responses,
        "total_sessions": stats["total_sessions"],
        "export_count": stats["export_count"],
        "last_active": datetime.now().strftime("%I:%M %p"),
        "most_asked_topic": most_asked,
        "trend_labels": trend_labels,
        "trend_data": trend_data,
        "topic_labels": topic_labels,
        "topic_data": topic_data
    })

@app.route("/export/<format>", methods=["GET"])
def export_history(format):
    history = load_history()
    stats = load_stats()
    
    stats["export_count"] += 1
    save_stats(stats)

    if format == "json":
        export_file = 'export_chat.json'
        with open(export_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=4)
        return send_file(export_file, as_attachment=True)
    elif format == "stats":
        export_file = 'export_stats.json'
        stats_to_export = {
            "total_messages": len(history) * 2,
            "sessions": stats["total_sessions"],
            "topic_frequencies": stats.get("topic_frequencies", {})
        }
        with open(export_file, 'w', encoding='utf-8') as f:
            json.dump(stats_to_export, f, indent=4)
        return send_file(export_file, as_attachment=True)
    else:
        export_file = 'export_chat.txt'
        with open(export_file, 'w', encoding='utf-8') as f:
            f.write("ChatBot Assistant Pro - Conversation History\n")
            f.write("="*45 + "\n\n")
            for idx, chat in enumerate(history, 1):
                f.write(f"[{chat['timestamp']}] User: {chat['user_msg']}\n")
                f.write(f"[{chat['timestamp']}] Bot: {chat['bot_msg']}\n")
                f.write("-" * 30 + "\n")
        return send_file(export_file, as_attachment=True)

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
