import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Brain, Video, Play, Pause, RotateCcw } from 'lucide-react';

export default function StudyReminderApp() {
  const [studyTime, setStudyTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isStudying, setIsStudying] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const quizQuestions = [
    {
      question: "What does 'const' keyword do in JavaScript?",
      options: [
        "Creates a variable that can be reassigned",
        "Creates a variable that cannot be reassigned",
        "Creates a function",
        "Deletes a variable"
      ],
      correct: 1
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1
    },
    {
      question: "Which data structure uses LIFO (Last In First Out)?",
      options: ["Queue", "Array", "Stack", "Tree"],
      correct: 2
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets"
      ],
      correct: 1
    },
    {
      question: "What is a REST API?",
      options: [
        "A sleeping program interface",
        "An architectural style for web services",
        "A type of database",
        "A programming language"
      ],
      correct: 1
    }
  ];

  const demoVideos = [
    { title: "JavaScript Basics", topic: "Variables, Functions, and Scope", url: "https://www.youtube.com/results?search_query=javascript+basics+tutorial" },
    { title: "Data Structures", topic: "Arrays, Stacks, Queues, Trees", url: "https://www.youtube.com/results?search_query=data+structures+tutorial" },
    { title: "Algorithms", topic: "Sorting, Searching, Recursion", url: "https://www.youtube.com/results?search_query=algorithms+tutorial" },
    { title: "Web Development", topic: "HTML, CSS, JavaScript", url: "https://www.youtube.com/results?search_query=web+development+tutorial" },
    { title: "React Fundamentals", topic: "Components, Props, State, Hooks", url: "https://www.youtube.com/results?search_query=react+tutorial" }
  ];

  useEffect(() => {
    let interval;
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev - 1);
      }, 1000);
    } else if (currentTime === 0) {
      setIsRunning(false);
      if (isStudying) {
        alert("⏰ Time for a break! You've been studying hard. Take 5 minutes to rest.");
        setIsStudying(false);
        setCurrentTime(breakTime);
      } else {
        alert("✨ Break's over! Ready to get back to studying?");
        setIsStudying(true);
        setCurrentTime(studyTime);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime, isStudying, studyTime, breakTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(isStudying ? studyTime : breakTime);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      alert(`Quiz Complete! Your score: ${quizScore + (selectedAnswer === quizQuestions[currentQuestion].correct ? 1 : 0)}/${quizQuestions.length}`);
      setShowQuiz(false);
      setCurrentQuestion(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Hexagon Grid */}
        <div className="absolute inset-0" style={{ background: `
          linear-gradient(120deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 50%, rgba(236, 72, 153, 0.03) 100%),
          repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(99, 102, 241, 0.05) 40px, rgba(99, 102, 241, 0.05) 80px)
        `}} />

        {/* Study Icons */}
        {[...Array(15)].map((_, i) => {
          const icons = [
            { Icon: BookOpen, color: 'rgba(99, 102, 241, 0.2)' },  // Books - Indigo
            { Icon: Code, color: 'rgba(168, 85, 247, 0.2)' },      // Code - Purple
            { Icon: PenTool, color: 'rgba(236, 72, 153, 0.2)' },   // Notes - Pink
            { Icon: Database, color: 'rgba(99, 102, 241, 0.2)' },  // Learning - Indigo
            { Icon: Star, color: 'rgba(168, 85, 247, 0.2)' }       // Achievement - Purple
          ];
          const { Icon, color } = icons[i % icons.length];
          const size = 30 + Math.random() * 20;
          const left = `${Math.random() * 100}%`;
          const delay = i * -3;
          const duration = 15 + Math.random() * 10;

          return (
            <div
              key={i}
              className="absolute transform hover:scale-150 transition-transform duration-300"
              style={{
                left,
                top: `${Math.random() * 100}%`,
                animation: `float ${duration}s infinite ease-in-out`,
                animationDelay: `${delay}s`,
                color: color,
                filter: 'blur(0.5px)',
                zIndex: 0
              }}
            >
              <Icon size={size} />
            </div>
          );
        })}

        {/* Glowing Orbs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full blur-xl opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 100}px`,
              height: `${100 + Math.random() * 100}px`,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(168, 85, 247, 0.4)'
              } 0%, transparent 70%)`,
              animation: `glow ${10 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${i * -2}s`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1); 
          }
          50% { 
            transform: translateY(-30px) rotate(10deg) scale(1.1);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:bg-white/90 transition-all duration-300">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300">
            📚 Programming Study Buddy
          </h1>

        {/* Timer Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            {isStudying ? (
              <Clock className="w-8 h-8 text-indigo-600 mr-3" />
            ) : (
              <Coffee className="w-8 h-8 text-green-600 mr-3" />
            )}
            <h2 className="text-2xl font-semibold text-gray-800">
              {isStudying ? "Study Time" : "Break Time"}
            </h2>
          </div>

          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-indigo-600 mb-4">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-600">
              {isStudying ? "Focus on your programming!" : "Relax and recharge"}
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={handleStartPause}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Time (minutes)
              </label>
              <input
                type="number"
                value={studyTime / 60}
                onChange={(e) => {
                  const mins = parseInt(e.target.value) || 25;
                  setStudyTime(mins * 60);
                  if (isStudying) setCurrentTime(mins * 60);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Break Time (minutes)
              </label>
              <input
                type="number"
                value={breakTime / 60}
                onChange={(e) => {
                  const mins = parseInt(e.target.value) || 5;
                  setBreakTime(mins * 60);
                  if (!isStudying) setCurrentTime(mins * 60);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => {
              setShowQuiz(!showQuiz);
              setShowVideos(false);
            }}
            className="bg-purple-600 text-white px-6 py-4 rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Brain className="w-6 h-6" />
            <span className="font-semibold">Take a Quiz</span>
          </button>
          <button
            onClick={() => {
              setShowVideos(!showVideos);
              setShowQuiz(false);
            }}
            className="bg-pink-600 text-white px-6 py-4 rounded-xl hover:bg-pink-700 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Video className="w-6 h-6" />
            <span className="font-semibold">Demo Videos</span>
          </button>
        </div>

        {/* Quiz Section */}
        {showQuiz && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-900">Programming Quiz</h3>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium text-gray-800 mb-4">
                {quizQuestions[currentQuestion].question}
              </p>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                      selectedAnswer === index
                        ? showResult
                          ? index === quizQuestions[currentQuestion].correct
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-purple-500 bg-purple-50"
                        : showResult && index === quizQuestions[currentQuestion].correct
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-purple-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <>
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </button>
                  <button
                    onClick={handleRestartQuiz}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    Restart Quiz
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 text-center text-gray-600">
              Score: {quizScore}/{quizQuestions.length}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {showVideos && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-pink-900 mb-6">Demo Videos</h3>
            <div className="space-y-4">
              {demoVideos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border-2 border-gray-200 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition"
                >
                  <div className="flex items-start gap-4">
                    <Video className="w-6 h-6 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{video.title}</h4>
                      <p className="text-sm text-gray-600">{video.topic}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}