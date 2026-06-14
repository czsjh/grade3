import React from 'react';
import { BookOpen, Calculator, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { Subject } from '@/types';

interface SubjectCardProps {
  subject: Subject;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  totalGames: number;
  onClick: () => void;
}

const colorMap = {
  chinese: 'from-orange-400 to-red-500',
  math: 'from-green-400 to-emerald-500',
  english: 'from-purple-400 to-pink-500',
};

const iconBgMap = {
  chinese: 'bg-orange-100 text-orange-600',
  math: 'bg-green-100 text-green-600',
  english: 'bg-purple-100 text-purple-600',
};

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  title,
  description,
  icon,
  progress,
  totalGames,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${colorMap[subject]} shadow-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl ${iconBgMap[subject]} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 text-sm mb-4">{description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-white text-sm">
            <span>学习进度</span>
            <span>{totalGames} 个游戏</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              className="h-full bg-white rounded-full"
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
      
      {/* 装饰元素 */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
    </motion.div>
  );
};

export default SubjectCard;
