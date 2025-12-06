# Study Buddyy

A React-based intelligent study companion designed to gamify your learning process and keep you focused. Features a local AI Tutor (powered by Ollama), interactive study tools, and a beautiful Bento Grid Glassmorphism UI.

## ✨ Key Features

### 🤖 Local AI Tutor (Ollama)
- **Voice-Powered**: Talk to your AI tutor using the microphone.
- **Local Privacy**: Runs entirely on your machine using **Ollama** (supports `llama3.1`).
- **Contextual Help**: Ask about programming concepts, get motivation, or request a joke.
- **Smart Responses**: No API keys needed—just run your local model.

### 🍱 Bento Grid Dashboard
- **Modern Layout**: A structured, responsive grid layout for optimal organization.
- **Consistent Design**: Glassmorphism cards with consistent sizing and alignment.
- **Visual Clarity**: Timer, Stats, Tasks, and Quizzes arranged for easy access.

### ⏱️ Smart Focus Timer
- **Customizable Sessions**: Classic Pomodoro (25/5) or custom intervals.
- **Auto-Transitions**: Seamlessly switches between study and break modes.
- **Ambient Mode**: 
  - **Multiple Tracks**: Switch between "Rain" and "Ambient" soundscapes.
  - **Volume Control**: Adjustable background noise to drown out distractions.

### 🎮 Gamification & Progress
- **XP System**: Earn XP for every minute studied and task completed.
- **Level Up**: Progress through levels as you gain experience.
- **Streaks**: Track your daily study consistency.
- **Rewards**: Visual confetti celebrations for milestones.

### 📝 Task Management
- **Smart To-Do List**: Integrated task manager.
- **XP Rewards**: Earn bonus XP for completing planned tasks.

### 📚 Interactive Learning
- **Tech Quizzes**: Test your knowledge in JS, CSS, React, and DSA.
- **Curated Videos**: Access hand-picked coding tutorials directly in the app.

## 🛠️ Technology Stack
- **Core**: React.js + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **AI**: Local Ollama (LLaMA 3.1)
- **Audio**: Web Speech API

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [Ollama](https://ollama.com/) installed and running.

### 1. Setup Ollama
Ensure Ollama is installed and the model is pulled:
```bash
ollama pull llama3.1
```
Start Ollama with CORS enabled (required for browser access):
*Windows (PowerShell):*
```powershell
$env:OLLAMA_ORIGINS="*"; ollama serve
```
*Mac/Linux:*
```bash
OLLAMA_ORIGINS="*" ollama serve
```

### 2. Install App
Clone the repository and install dependencies:
```bash
git clone https://github.com/Skull-boy/StudyBuddyy.git
cd StudyBuddyy
npm install
```

### 3. Run
Start the development server:
```bash
npm run dev
```

## 📖 Usage Guide

1.  **Start Studying**: Click the play button or say "Start timer".
2.  **Ask AI**: Click the microphone icon and say "What is a React Hook?" or "I need motivation".
3.  **Change Atmosphere**: Use the Ambient player card to switch between Rain/Ambient sounds.
4.  **Level Up**: Watch your XP grow as you study and complete tasks.

## 🤝 Contributing
Contributions are welcome! Feel free to submit issues and enhancement requests.
