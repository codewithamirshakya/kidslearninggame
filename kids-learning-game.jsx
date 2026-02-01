import React, { useState, useEffect } from 'react';

const questions = {
    math: [
        { q: "What is 24 × 5?", options: ["100", "120", "125", "110"], answer: 1 },
        { q: "If you have 156 apples and give away 78, how many are left?", options: ["78", "88", "68", "98"], answer: 0 },
        { q: "What is 1/2 + 1/4?", options: ["2/6", "1/6", "3/4", "2/4"], answer: 2 },
        { q: "Round 4,567 to the nearest hundred", options: ["4,500", "4,600", "4,560", "5,000"], answer: 1 },
        { q: "What is 144 ÷ 12?", options: ["11", "13", "12", "14"], answer: 2 },
        { q: "A rectangle has length 8cm and width 5cm. What's its area?", options: ["13 cm²", "26 cm²", "40 cm²", "45 cm²"], answer: 2 },
        { q: "What comes next: 2, 6, 18, 54, __?", options: ["108", "162", "72", "216"], answer: 1 },
        { q: "How many minutes are in 2.5 hours?", options: ["120", "130", "150", "180"], answer: 2 },
    ],
    science: [
        { q: "What planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2 },
        { q: "What do plants need to make their own food?", options: ["Only water", "Sunlight, water & CO₂", "Only soil", "Only air"], answer: 1 },
        { q: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Brain", "Skin"], answer: 3 },
        { q: "What type of animal is a frog?", options: ["Reptile", "Mammal", "Amphibian", "Fish"], answer: 2 },
        { q: "What causes day and night on Earth?", options: ["Moon's orbit", "Earth's rotation", "Sun moving", "Clouds"], answer: 1 },
        { q: "Which gas do we breathe out?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: 2 },
        { q: "How many bones does an adult human have?", options: ["106", "206", "306", "156"], answer: 1 },
        { q: "What is water made of?", options: ["Oxygen only", "Hydrogen only", "Hydrogen & Oxygen", "Carbon & Oxygen"], answer: 2 },
    ],
    english: [
        { q: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Child"], answer: 1 },
        { q: "Which word is a verb?", options: ["Happy", "Quickly", "Jump", "Beautiful"], answer: 2 },
        { q: "Find the synonym of 'big':", options: ["Small", "Tiny", "Large", "Little"], answer: 2 },
        { q: "What is the opposite of 'ancient'?", options: ["Old", "Modern", "Historic", "Past"], answer: 1 },
        { q: "Which sentence is correct?", options: ["She go to school", "She goes to school", "She going school", "She gone school"], answer: 1 },
        { q: "What type of noun is 'happiness'?", options: ["Proper noun", "Common noun", "Abstract noun", "Collective noun"], answer: 2 },
        { q: "'The cat sat on the mat.' What is the subject?", options: ["sat", "mat", "cat", "on"], answer: 2 },
        { q: "Which word has a silent letter?", options: ["Jump", "Knight", "Stand", "Lamp"], answer: 1 },
    ],
    gk: [
        { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
        { q: "What is the capital of France?", options: ["London", "Berlin", "Madrid", "Paris"], answer: 3 },
        { q: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2 },
        { q: "How many days are in a leap year?", options: ["364", "365", "366", "367"], answer: 2 },
        { q: "Who invented the light bulb?", options: ["Newton", "Einstein", "Edison", "Tesla"], answer: 2 },
        { q: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Horse", "Tiger"], answer: 1 },
        { q: "Which country has the most people?", options: ["USA", "India", "China", "Russia"], answer: 1 },
        { q: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], answer: 2 },
    ]
};

const subjectEmojis = {
    math: "🔢",
    science: "🔬",
    english: "📚",
    gk: "🌍"
};

const subjectColors = {
    math: "from-blue-400 to-blue-600",
    science: "from-green-400 to-green-600",
    english: "from-purple-400 to-purple-600",
    gk: "from-orange-400 to-orange-600"
};

export default function KidsLearningGame() {
    const [screen, setScreen] = useState('welcome');
    const [playerName, setPlayerName] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameQuestions, setGameQuestions] = useState([]);
    const [stars, setStars] = useState([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const newStars = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
            size: Math.random() * 10 + 5
        }));
        setStars(newStars);
    }, []);

    const startGame = (subject) => {
        const shuffled = [...questions[subject]].sort(() => Math.random() - 0.5).slice(0, 5);
        setGameQuestions(shuffled);
        setSelectedSubject(subject);
        setCurrentQuestion(0);
        setScore(0);
        setStreak(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScreen('game');
    };

    const handleAnswer = (index) => {
        if (showResult) return;

        setSelectedAnswer(index);
        const correct = index === gameQuestions[currentQuestion].answer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            const bonus = streak >= 2 ? 5 : 0;
            setScore(s => s + 10 + bonus);
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < gameQuestions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setTotalScore(t => t + score);
            setScreen('results');
        }
    };

    const getStarRating = () => {
        const percentage = (score / 50) * 100;
        if (percentage >= 90) return 3;
        if (percentage >= 60) return 2;
        if (percentage >= 40) return 1;
        return 0;
    };

    const getMessage = () => {
        const stars = getStarRating();
        if (stars === 3) return "🎉 Outstanding! You're a superstar!";
        if (stars === 2) return "👏 Great job! Keep learning!";
        if (stars === 1) return "👍 Good effort! Practice more!";
        return "💪 Don't give up! Try again!";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 overflow-hidden relative">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="absolute text-yellow-300 animate-pulse"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        fontSize: `${star.size}px`,
                        animationDelay: `${star.delay}s`
                    }}
                >
                    ✦
                </div>
            ))}

            <div className="max-w-2xl mx-auto relative z-10">

                {screen === 'welcome' && (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4 animate-bounce">🎮</div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            Brain Quest
                        </h1>
                        <p className="text-xl text-pink-200 mb-8">Learn & Play!</p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
                            <label className="text-white text-lg block mb-3">What's your name, explorer?</label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name..."
                                className="w-full px-6 py-4 rounded-2xl text-xl text-center bg-white/90 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-4 focus:ring-pink-400"
                                maxLength={15}
                            />
                        </div>

                        <button
                            onClick={() => playerName.trim() && setScreen('subjects')}
                            disabled={!playerName.trim()}
                            className={`px-12 py-4 rounded-full text-xl font-bold transition-all transform hover:scale-105 ${playerName.trim()
                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                }`}
                        >
                            Let's Go! 🚀
                        </button>
                    </div>
                )}

                {screen === 'subjects' && (
                    <div className="py-6">
                        <div className="text-center mb-8">
                            <p className="text-pink-200 text-lg">Welcome back,</p>
                            <h2 className="text-3xl font-bold text-white">{playerName}! 👋</h2>
                            <p className="text-yellow-300 mt-2">⭐ Total Stars: {totalScore}</p>
                        </div>

                        <h3 className="text-2xl text-white text-center mb-6">Choose Your Adventure!</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(questions).map(([subject, _]) => (
                                <button
                                    key={subject}
                                    onClick={() => startGame(subject)}
                                    className={`bg-gradient-to-br ${subjectColors[subject]} p-6 rounded-3xl transform hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
                                >
                                    <div className="text-5xl mb-2">{subjectEmojis[subject]}</div>
                                    <div className="text-white font-bold text-lg capitalize">{subject === 'gk' ? 'General Knowledge' : subject}</div>
                                    <div className="text-white/70 text-sm">5 Questions</div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                            <h4 className="text-white font-bold mb-2">🎯 How to Play:</h4>
                            <ul className="text-pink-200 text-sm space-y-1">
                                <li>• Answer 5 questions in each subject</li>
                                <li>• Earn 10 points for each correct answer</li>
                                <li>• Get 3 in a row for bonus points! 🔥</li>
                                <li>• Collect stars and become a champion!</li>
                            </ul>
                        </div>
                    </div>
                )}

                {screen === 'game' && gameQuestions.length > 0 && (
                    <div className="py-4">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setScreen('subjects')}
                                className="text-white/70 hover:text-white"
                            >
                                ← Back
                            </button>
                            <div className="flex items-center gap-4">
                                {streak >= 2 && (
                                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                                        🔥 {streak} streak!
                                    </span>
                                )}
                                <span className="text-yellow-300 font-bold">⭐ {score}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-6">
                            {gameQuestions.map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-3 rounded-full transition-all ${i < currentQuestion
                                            ? 'bg-green-400'
                                            : i === currentQuestion
                                                ? `bg-gradient-to-r ${subjectColors[selectedSubject]}`
                                                : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className={`bg-gradient-to-br ${subjectColors[selectedSubject]} rounded-3xl p-1 mb-6`}>
                            <div className="bg-white/95 rounded-3xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl">{subjectEmojis[selectedSubject]}</span>
                                    <span className="text-purple-600 font-medium capitalize">
                                        {selectedSubject === 'gk' ? 'General Knowledge' : selectedSubject}
                                    </span>
                                    <span className="ml-auto text-gray-500">
                                        Q{currentQuestion + 1}/5
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-gray-800 mb-6">
                                    {gameQuestions[currentQuestion].q}
                                </h2>

                                <div className="space-y-3">
                                    {gameQuestions[currentQuestion].options.map((option, index) => {
                                        let buttonClass = "w-full p-4 rounded-2xl text-left font-medium transition-all ";

                                        if (showResult) {
                                            if (index === gameQuestions[currentQuestion].answer) {
                                                buttonClass += "bg-green-500 text-white scale-105";
                                            } else if (index === selectedAnswer && !isCorrect) {
                                                buttonClass += "bg-red-500 text-white";
                                            } else {
                                                buttonClass += "bg-gray-100 text-gray-400";
                                            }
                                        } else {
                                            buttonClass += "bg-gray-100 hover:bg-purple-100 text-gray-700 hover:scale-102 active:scale-98";
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswer(index)}
                                                disabled={showResult}
                                                className={buttonClass}
                                            >
                                                <span className="inline-block w-8 h-8 rounded-full bg-white/50 text-center mr-3">
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                {option}
                                                {showResult && index === gameQuestions[currentQuestion].answer && (
                                                    <span className="float-right">✓</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {showResult && (
                            <div className={`text-center p-4 rounded-2xl mb-4 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}>
                                <p className="text-white text-xl font-bold mb-2">
                                    {isCorrect ? '🎉 Correct!' : '😅 Oops!'}
                                </p>
                                {!isCorrect && (
                                    <p className="text-pink-200">
                                        The answer is: {gameQuestions[currentQuestion].options[gameQuestions[currentQuestion].answer]}
                                    </p>
                                )}
                                {isCorrect && streak >= 2 && (
                                    <p className="text-yellow-300">+5 bonus points! 🔥</p>
                                )}
                            </div>
                        )}

                        {showResult && (
                            <button
                                onClick={nextQuestion}
                                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
                            >
                                {currentQuestion < gameQuestions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
                            </button>
                        )}
                    </div>
                )}

                {screen === 'results' && (
                    <div className="py-8 text-center">
                        <div className="text-6xl mb-4">
                            {getStarRating() === 3 ? '🏆' : getStarRating() === 2 ? '🥈' : getStarRating() === 1 ? '🥉' : '💪'}
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                        <p className="text-pink-200 text-lg mb-6">{getMessage()}</p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
                            <div className="text-5xl mb-2">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < getStarRating() ? 'text-yellow-400' : 'text-gray-500'}>
                                        ⭐
                                    </span>
                                ))}
                            </div>

                            <div className="text-4xl font-bold text-white mb-2">{score}/50</div>
                            <div className="text-pink-200">points earned</div>

                            <div className="mt-4 pt-4 border-t border-white/20">
                                <span className="text-yellow-300 font-bold">Total Score: {totalScore} ⭐</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => startGame(selectedSubject)}
                                className="flex-1 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
                            >
                                🔄 Try Again
                            </button>
                            <button
                                onClick={() => setScreen('subjects')}
                                className="flex-1 py-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
                            >
                                📚 New Subject
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
