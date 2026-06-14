import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Stars from '@/components/Stars';
import { useStore } from '@/store/useStore';
import { chineseData } from '@/data/chinese';
import { mathData } from '@/data/math';
import { englishData } from '@/data/english';
import { Subject, Question } from '@/types';

const subjectDataMap = {
  chinese: chineseData,
  math: mathData,
  english: englishData,
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { subject, gameId } = useParams<{ subject: string; gameId: string }>();
  const { updateProgress } = useStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const data = subjectDataMap[subject as Subject];
  
  // 找到当前游戏
  const game = data.flatMap(kp => kp.games).find(g => g.id === gameId);
  const questions = game?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!game) {
      navigate(`/${subject}`);
    }
  }, [game, navigate, subject]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || gameEnded) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 10);
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // 游戏结束
        const stars = calculateStars(score + (correct ? 10 : 0), questions.length);
        updateProgress(subject as Subject, gameId!, score + (correct ? 10 : 0), stars);
        setGameEnded(true);
      }
    }, 1000);
  };

  const calculateStars = (finalScore: number, totalQuestions: number) => {
    const percentage = (finalScore / (totalQuestions * 10)) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  if (!game || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">游戏加载中...</p>
          <button
            onClick={() => navigate(`/${subject}`)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  if (gameEnded) {
    const finalScore = score;
    const stars = calculateStars(finalScore, questions.length);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">太棒了！</h2>
          <p className="text-gray-600 mb-6">你完成了 {game.title}</p>

          <div className="mb-6">
            <Stars rating={stars} size={40} />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {finalScore}
            </div>
            <div className="text-gray-600">获得分数</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">
                {questions.filter((_, i) => i < currentQuestionIndex + 1).length}
              </div>
              <div className="text-sm text-gray-600">总题数</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((finalScore / (questions.length * 10)) * 100)}%
              </div>
              <div className="text-sm text-gray-600">正确率</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/${subject}`)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              返回
            </button>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setGameEnded(false);
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              再玩一次
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/${subject}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>退出</span>
          </button>

          <div className="text-lg font-bold text-gray-800">
            {game.title}
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>题目 {currentQuestionIndex + 1} / {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* 题目卡片 */}
        <motion.div
          key={currentQuestion.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-xl mb-6"
        >
          <div className="text-4xl mb-4">{game.icon}</div>
          
          <div className="text-xl md:text-2xl text-gray-800 text-center mb-8 leading-relaxed whitespace-pre-line">
            {currentQuestion.question}
          </div>

          {/* 选项 */}
          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                  whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!!selectedAnswer}
                  className={`
                    relative p-4 rounded-2xl text-lg font-semibold transition-all
                    ${selectedAnswer === option
                      ? isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : selectedAnswer
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-700 hover:from-blue-100 hover:to-purple-100'
                    }
                  `}
                >
                  <span className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}

                  {selectedAnswer === option && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isCorrect ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <XCircle className="w-8 h-8" />
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}

          {/* 反馈动画 */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`
                  absolute inset-0 flex items-center justify-center rounded-3xl
                  ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}
                `}
              >
                <div className="text-9xl">
                  {isCorrect ? '✅' : '❌'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 提示 */}
        {currentQuestion.hint && !selectedAnswer && (
          <div className="text-center text-gray-500 text-sm">
            💡 提示：{currentQuestion.hint}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
