import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calculator, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import GameCard from '@/components/GameCard';
import ProgressBar from '@/components/ProgressBar';
import { useStore } from '@/store/useStore';
import { chineseData } from '@/data/chinese';
import { mathData } from '@/data/math';
import { englishData } from '@/data/english';
import { Subject, KnowledgePoint } from '@/types';

const subjectConfig = {
  chinese: {
    title: '语文',
    subtitle: '人教版 · 三年级上册',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-orange-500',
    data: chineseData,
  },
  math: {
    title: '数学',
    subtitle: '人教版 · 三年级上册',
    icon: <Calculator className="w-8 h-8" />,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-500',
    data: mathData,
  },
  english: {
    title: '英语',
    subtitle: '广州版 · 三年级上册',
    icon: <Languages className="w-8 h-8" />,
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500',
    data: englishData,
  },
};

const SubjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const { progress } = useStore();

  const config = subjectConfig[subject as Subject];
  
  if (!config) {
    return <div>学科不存在</div>;
  }

  const data = config.data as KnowledgePoint[];
  const subjectProgress = progress[subject as Subject];

  const totalGames = data.reduce((sum, kp) => sum + kp.games.length, 0);

  const getGameRecord = (gameId: string) => {
    const record = subjectProgress.history.find(r => r.gameId === gameId);
    return record || { stars: 0, score: 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg">返回首页</span>
          </button>

          <div className={`bg-gradient-to-r ${config.color} rounded-3xl p-6 mb-8 text-white shadow-lg`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-4 rounded-2xl">
                {config.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
                <p className="text-white/90">{config.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{subjectProgress.completedGames}</div>
                <div className="text-sm text-white/80">已完成</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{totalGames}</div>
                <div className="text-sm text-white/80">总游戏</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{subjectProgress.stars}</div>
                <div className="text-sm text-white/80">获得星星</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">
                  {totalGames > 0 ? Math.round((subjectProgress.completedGames / totalGames) * 100) : 0}%
                </div>
                <div className="text-sm text-white/80">完成率</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 知识点列表 */}
        <div className="space-y-8">
          {data.map((knowledgePoint, kpIndex) => (
            <motion.div
              key={knowledgePoint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: kpIndex * 0.1 }}
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {knowledgePoint.icon} {knowledgePoint.title}
                </h2>
                <p className="text-gray-600">{knowledgePoint.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {knowledgePoint.games.map((game, gameIndex) => {
                  const record = getGameRecord(game.id);
                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      completed={record.stars > 0}
                      stars={record.stars}
                      onClick={() => navigate(`/game/${subject}/${game.id}`)}
                      index={gameIndex}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/')}
            className="bg-white text-gray-700 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            返回学科选择
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SubjectPage;
