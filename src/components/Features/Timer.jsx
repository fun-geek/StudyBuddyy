import React from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { motion } from 'framer-motion';

export default function Timer() {
    const {
        currentTime, isRunning, isStudying,
        setIsRunning, setStudyTime, setBreakTime,
        studyTime, breakTime, formatTime,
        setIsStudying, setCurrentTime
    } = useStudy();

    const progress = isStudying
        ? ((studyTime - currentTime) / studyTime) * 100
        : ((breakTime - currentTime) / breakTime) * 100;

    const handleReset = () => {
        setIsRunning(false);
        setCurrentTime(isStudying ? studyTime : breakTime);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden h-full flex flex-col justify-between"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <motion.div
                    className={`h-full ${isStudying ? 'bg-indigo-500' : 'bg-green-500'}`}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex flex-col items-center justify-center py-8">
                <div className="flex items-center gap-3 mb-8 bg-gray-100/50 p-2 rounded-full">
                    <button
                        onClick={() => {
                            setIsStudying(true);
                            setIsRunning(false);
                            setCurrentTime(studyTime);
                        }}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all ${isStudying
                            ? 'bg-white text-indigo-600 shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Brain className="w-4 h-4" />
                        Focus
                    </button>
                    <button
                        onClick={() => {
                            setIsStudying(false);
                            setIsRunning(false);
                            setCurrentTime(breakTime);
                        }}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all ${!isStudying
                            ? 'bg-white text-green-600 shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Coffee className="w-4 h-4" />
                        Break
                    </button>
                </div>

                <div className="relative mb-12 group">
                    <div className={`text-8xl font-black tracking-tighter tabular-nums transition-colors duration-500 ${isStudying ? 'text-indigo-900' : 'text-green-900'
                        }`}>
                        {formatTime(currentTime)}
                    </div>
                    <div className="absolute -bottom-6 left-0 w-full text-center text-gray-400 font-medium uppercase tracking-widest text-sm">
                        {isRunning ? 'Running' : 'Paused'}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsRunning(!isRunning)}
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isStudying
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                            }`}
                    >
                        {isRunning ? (
                            <Pause className="w-8 h-8 fill-current" />
                        ) : (
                            <Play className="w-8 h-8 fill-current ml-1" />
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="w-14 h-14 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
