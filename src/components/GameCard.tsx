import React from 'react';
import { motion } from 'framer-motion';
import { Game } from '@/types';
import Stars from './Stars';

interface GameCardProps {
  game: Game;
  completed: boolean;
  stars: number;
  onClick: () => void;
  index: number;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  completed,
  stars,
  onClick,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 cursor-pointer
        transition-all duration-300
        ${completed 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' 
          : 'bg-white border-2 border-gray-100 hover:border-blue-200'
        }
        shadow-sm hover:shadow-lg
      `}
      onClick={onClick}
    >
      {/* 游戏图标 */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{game.icon}</div>
        {completed && (
          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            已完成
          </div>
        )}
      </div>

      {/* 游戏信息 */}
      <h4 className="text-lg font-bold text-gray-800 mb-2">{game.title}</h4>
      <p className="text-sm text-gray-600 mb-4">{game.description}</p>

      {/* 评分 */}
      <div className="flex items-center justify-between">
        <Stars rating={stars} size={18} />
        <div className="text-xs text-gray-500">
          {game.questions.length} 题
        </div>
      </div>

      {/* 装饰 */}
      {completed && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full -mr-8 -mt-8 opacity-50" />
      )}
    </motion.div>
  );
};

export default GameCard;
