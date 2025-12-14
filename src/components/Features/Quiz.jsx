import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, RefreshCw, ArrowRight, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { generateQuizQuestions } from '../../services/ollama';

const INITIAL_QUESTIONS = [
    {
        question: "What does 'const' keyword do in JavaScript?",
        options: [
            "Creates a variable that can be reassigned",
            "Creates a variable that cannot be reassigned",
            "Creates a function",
            "Deletes a variable"
        ],
        correct: 1
    }
];

export default function Quiz() {
    // Game States: 'menu' | 'loading' | 'quiz' | 'result'
    const [gameMode, setGameMode] = useState('menu');
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);
    const [debugStatus, setDebugStatus] = useState({ checked: false, ok: false, message: '' });

    // Auto-check connection on mount
    React.useEffect(() => {
        const check = async () => {
            try {
                const { checkConnection } = await import('../../services/ollama');
                const result = await checkConnection();
                if (result.ok) {
                    setDebugStatus({ checked: true, ok: true, message: 'Ollama Connected ✅' });
                } else {
                    setDebugStatus({ checked: true, ok: false, message: 'Ollama Connection Failed ❌' });
                }
            } catch (e) {
                setDebugStatus({ checked: true, ok: false, message: 'Connection Error ❌' });
            }
        };
        check();
    }, []);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setGameMode('loading');
        setError(null);

        try {
            // Re-verify connection before generating
            const { checkConnection } = await import('../../services/ollama');
            const conn = await checkConnection();
            if (!conn.ok) {
                throw new Error(`Connection Failed: ${conn.error || 'Server unreachable'}. Is Ollama running?`);
            }

            const newQuestions = await generateQuizQuestions(topic);
            if (newQuestions && newQuestions.length > 0) {
                setQuestions(newQuestions);
                setGameMode('quiz');
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                throw new Error("No questions generated (Empty response)");
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            setGameMode('menu');
        }
    };

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        setShowResult(true);
        if (index === questions[currentQuestion].correct) {
            setScore(s => s + 1);
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#4ade80', '#22c55e']
            });
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setGameMode('result');
            if (score > questions.length / 2) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setGameMode('quiz');
    };

    const returnToMenu = () => {
        setGameMode('menu');
        setTopic('');
        setScore(0);
        setCurrentQuestion(0);
    };

    // --- RENDER: MENU ---
    if (gameMode === 'menu') {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                    <Brain className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Quiz Generator</h2>
                <div className={`text-xs px-2 py-1 rounded-full mb-4 inline-flex items-center gap-1 ${debugStatus.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <div className={`w-2 h-2 rounded-full ${debugStatus.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                    {debugStatus.checked ? debugStatus.message : 'Checking endpoint...'}
                </div>
                <p className="text-gray-600 mb-8 max-w-md">
                    Enter any topic, subject, or concept, and I'll generate a custom quiz for you instantly.
                </p>

                <form onSubmit={handleGenerateQuiz} className="w-full max-w-md space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Quantum Physics, French Revolution, React Hooks..."
                            className="w-full px-6 py-4 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg outline-none"
                        />
                        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 pointer-events-none" />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm bg-red-50 py-2 px-4 rounded-lg">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={!topic.trim()}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Generate Quiz
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        );
    }

    // --- RENDER: LOADING ---
    if (gameMode === 'loading') {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 h-full flex flex-col items-center justify-center text-center">
                <div className="relative mb-8 w-24 h-24">
                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner Ring */}
                    <motion.div
                        className="absolute inset-2 border-4 border-purple-100 border-b-purple-500 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Center Icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className="w-8 h-8 text-indigo-500" />
                    </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Quiz...</h3>
                <p className="text-gray-500 max-w-[80%] mx-auto">
                    Consulting the AI knowledge base about <span className="text-indigo-600 font-medium">"{topic}"</span>
                </p>
            </div>
        );
    }

    // --- RENDER: RESULT ---
    if (gameMode === 'result') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 text-center h-full flex flex-col items-center justify-center"
            >
                <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
                    <p className="text-gray-600">You scored {score} out of {questions.length}</p>
                </div>

                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-8 max-w-xs">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / questions.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={restartQuiz}
                        className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all font-medium"
                    >
                        Retry Same Quiz
                    </button>
                    <button
                        onClick={returnToMenu}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                    >
                        <RefreshCw className="w-5 h-5" />
                        New Topic
                    </button>
                </div>
            </motion.div>
        );
    }

    // --- RENDER: PLAYING ---
    const question = questions[currentQuestion];

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={returnToMenu}
                    className="text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                    <BookOpen className="w-4 h-4" />
                    {topic || 'Quiz'}
                </button>
                <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100">
                    {currentQuestion + 1} / {questions.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
                    {question.question}
                </h4>

                <div className="space-y-3">
                    {question.options.map((option, idx) => {
                        let stateStyle = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                        if (showResult) {
                            if (idx === question.correct) stateStyle = "border-green-500 bg-green-50 text-green-700";
                            else if (idx === selectedAnswer) stateStyle = "border-red-500 bg-red-50 text-red-700";
                            else stateStyle = "border-gray-100 opacity-50";
                        }

                        return (
                            <button
                                key={idx}
                                disabled={showResult}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${stateStyle} ${selectedAnswer === idx ? 'ring-2 ring-indigo-200' : ''}`}
                            >
                                <span className="font-medium">{option}</span>
                                {showResult && idx === question.correct && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {showResult && idx === selectedAnswer && idx !== question.correct && <XCircle className="w-5 h-5 text-red-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 h-12 flex items-end justify-end">
                <AnimatePresence>
                    {showResult && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={nextQuestion}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function Trophy(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
