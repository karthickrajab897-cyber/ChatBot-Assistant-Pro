# ChatBot Assistant Pro

![Dashboard Screenshot](screenshots/1_Dashboard.png) <!-- 1. Dashboard Screenshot -->

## Project Overview
ChatBot Assistant Pro is a premium, portfolio-quality AI conversational web platform developed using Python, Flask, and a custom high-performance NLP intent-matching engine. 

Designed with modern SaaS aesthetics, this application closely mirrors the experience of top-tier AI assistants like ChatGPT, Gemini, and Microsoft Copilot. It boasts glassmorphism effects, a sophisticated statistics dashboard built with Chart.js, a dedicated Export Center, intelligent quick-action commands, theme persistence, and an expansive knowledge base covering topics from Python to Cloud Computing.

## Features
- **Professional Landing Experience**: Engaging loading screen, empty-state illustrations, animated typewriter effects, and floating gradient backgrounds.
- **Single Page Application (SPA)**: Seamless navigation between Chat, Analytics, and Export Center without page reloads.
- **Enhanced Chat Interface**: Right/left message bubbles, online status indicators, and detailed typing animations ("Assistant is typing...").
- **Smart Quick Actions**: Instantly query complex topics via beautifully styled cards.
- **Expansive Knowledge Base**: 150+ high-quality training pairs covering Python, ML, AI, Web Development, Databases, Cyber Security, Software Engineering, and Technical Interview Questions.
- **Analytics Dashboard (Chart.js)**: Visualize message trends, topic frequencies, session counts, and system metrics with responsive Pie and Bar charts.
- **Dedicated Export Center**: Download your conversation history as a formatted `.TXT` file, a structured `.JSON` file, or export your platform statistics.
- **Theme Management**: Professional Dark/Light mode switcher with LocalStorage persistence.
- **Real-time Search**: Search through previous messages with automatic text highlighting.
- **Responsive Architecture**: Fully mobile-optimized with an interactive sidebar.

![Chat Interface Screenshot](screenshots/2_ChatInterface.png) <!-- 2. Chat Interface Screenshot -->

## Technologies Used
- **Backend Core**: Python 3.14+, Flask, Werkzeug
- **AI/NLP Engine**: Custom Python sequence matching (Zero-dependency)
- **Frontend Architecture**: HTML5, CSS3, Vanilla JavaScript (SPA design)
- **Data Visualization**: Chart.js
- **Styling Frameworks**: Bootstrap 5, Font Awesome 6.4
- **Storage System**: Local JSON (`chat_history.json`, `stats.json`), Browser LocalStorage (Themes)

![Dark Theme Screenshot](screenshots/3_DarkTheme.png) <!-- 3. Dark Theme Screenshot -->

## Folder Structure
```text
ChatBot-Assistant-Pro/
│
├── app.py                 # Core Flask application and API routes
├── chatbot.py             # Custom NLP rule-based intelligence engine
├── dataset.json           # Expanded Knowledge Base (150+ QA Pairs)
├── requirements.txt       # Python Dependencies
├── chat_history.json      # Persistent Conversation Storage
├── stats.json             # Persistent Dashboard Analytics Storage
├── README.md              # Project Documentation
│
├── templates/
│   └── index.html         # Main SPA UI (Dashboard, Chat, Sidebar, Modals)
│
├── static/
│   ├── css/
│   │   └── style.css      # SaaS Styling, Animations, Theme Variables
│   │
│   ├── js/
│   │   └── app.js         # Client-side SPA Logic, Exports, Search, Stats
│   │
│   └── images/            # Static Assets
│
└── screenshots/           # Application Previews
```

## Installation Steps

1. Clone or download this repository to your local machine.
2. Open a terminal in the `ChatBot-Assistant-Pro` directory.
3. Install the required lightweight dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run Instructions

1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Open your web browser and navigate to:
   ```text
   http://localhost:5000
   ```

![Statistics Dashboard Screenshot](screenshots/4_StatisticsDashboard.png) <!-- 4. Statistics Dashboard Screenshot -->

## Internship Details

- **Intern Name**: Karthick Raja B
- **Organization**: CodeTech IT Solutions
- **Domain**: Python Programming
- **Project**: AI ChatBot Assistant

## Future Scope
- **Voice Recognition (Speech-to-Text)**
- **Text-to-Speech Output**
- **User Authentication & Multi-user Support**
- **Migration to PostgreSQL / MongoDB**
- **Integration with Generative LLMs (e.g., OpenAI API, Gemini API)**
