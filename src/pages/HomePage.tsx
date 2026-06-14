import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, Languages, Trophy, Star, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import SubjectCard from '@/components/SubjectCard';
import ProgressBar from '@/components/ProgressBar';
import { useStore } from '@/store/useStore';
import { chineseData } from '@/data/chinese';
import { mathData } from '@/data/math';
import { englishData } from '@/data/english';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, achievements } = useStore();

  const totalGames = chineseData.reduce((sum, kp) => sum + kp.games.length, 0) +
                     mathData.reduce((sum, kp) => sum + kp.games.length, 0) +
                     englishData.reduce((sum, kp) => sum + kp.games.length, 0);

  const completedGames = progress.chinese.completedGames + 
                        progress.math.completedGames + 
                        progress.english.completedGames;

  const totalStars = progress.chinese.stars + progress.math.stars + progress.english.stars;

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const handleSubjectClick = (subject: 'chinese' | 'math' | 'english') => {
    navigate(`/${subject}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎮 三年级学习乐园 🎮
          </h1>
          <p className="text-gray-600 text-lg">
            在游戏中学习，在快乐中成长！
          </p>
        </motion.div>

        {/* 学习进度总览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 mb-8 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            我的学习进度
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 总进度 */}
            <div className="col-span-1 md:col-span-4 mb-4">
              <ProgressBar 
                progress={(completedGames / totalGames) * 100}
                showLabel={true}
                height={12}
              />
            </div>

            {/* 统计卡片 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span className="text-sm text-gray-600">已完成游戏</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {completedGames}/{totalGames}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-yellow-600" />
                <span className="text-sm text-gray-600">获得星星</span>
              </div>
              <div className="text-3xl font-bold text-yellow-600">
                {totalStars} ⭐
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                <span className="text-sm text-gray-600">获得成就</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {unlockedAchievements}/{achievements.length}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="w-6 h-6 text-green-600" />
                <span className="text-sm text-gray-600">总学习时间</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                持续中 🏃
              </div>
            </div>
          </div>
        </motion.div>

        {/* 学科选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            选择你的学科
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SubjectCard
              subject="chinese"
              title="语文"
              description="人教版 · 拼音、汉字、词语"
              icon={<BookOpen className="w-8 h-8" />}
              progress={(progress.chinese.completedGames / 
                chineseData.reduce((sum, kp) => sum + kp.games.length, 0)) * 100}
              totalGames={progress.chinese.completedGames}
              onClick={() => handleSubjectClick('chinese')}
            />
            
            <SubjectCard
              subject="math"
              title="数学"
              description="人教版 · 计算、测量、图形"
              icon={<Calculator className="w-8 h-8" />}
              progress={(progress.math.completedGames / 
                mathData.reduce((sum, kp) => sum + kp.games.length, 0)) * 100}
              totalGames={progress.math.completedGames}
              onClick={() => handleSubjectClick('math')}
            />
            
            <SubjectCard
              subject="english"
              title="英语"
              description="广州版 · 问候、数字、颜色"
              icon={<Languages className="w-8 h-8" />}
              progress={(progress.english.completedGames / 
                englishData.reduce((sum, kp) => sum + kp.games.length, 0)) * 100}
              totalGames={progress.english.completedGames}
              onClick={() => handleSubjectClick('english')}
            />
          </div>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-gray-400 text-sm"
        >
          <p>💡 提示：每天学习一点，进步一大步！</p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
