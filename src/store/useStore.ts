import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, Progress, Achievement } from '@/types';

interface AppState {
  // 学习进度
  progress: {
    chinese: Progress;
    math: Progress;
    english: Progress;
  };
  
  // 当前选中的学科
  currentSubject: Subject | null;
  
  // 成就
  achievements: Achievement[];
  
  // 方法
  setCurrentSubject: (subject: Subject | null) => void;
  updateProgress: (subject: Subject, gameId: string, score: number, stars: number) => void;
  unlockGame: (subject: Subject, gameId: string) => void;
  checkAchievements: () => void;
  resetProgress: () => void;
}

const initialProgress: Progress = {
  subject: 'chinese',
  totalGames: 0,
  completedGames: 0,
  stars: 0,
  level: 1,
  history: [],
};

const initialAchievements: Achievement[] = [
  { id: 'first_game', title: '初次冒险', description: '完成第一个游戏', icon: '🎮', unlocked: false },
  { id: 'chinese_master', title: '语文小达人', description: '完成所有语文游戏', icon: '📚', unlocked: false },
  { id: 'math_master', title: '数学小天才', description: '完成所有数学游戏', icon: '🧮', unlocked: false },
  { id: 'english_master', title: '英语小能手', description: '完成所有英语游戏', icon: '🌟', unlocked: false },
  { id: 'star_collector', title: '星星收集者', description: '收集50颗星星', icon: '⭐', unlocked: false },
  { id: 'all_rounder', title: '全能小冠军', description: '完成所有学科', icon: '🏆', unlocked: false },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      progress: {
        chinese: { ...initialProgress, subject: 'chinese' },
        math: { ...initialProgress, subject: 'math' },
        english: { ...initialProgress, subject: 'english' },
      },
      currentSubject: null,
      achievements: initialAchievements,

      setCurrentSubject: (subject) => set({ currentSubject: subject }),

      updateProgress: (subject, gameId, score, stars) => {
        set((state) => {
          const subjectProgress = state.progress[subject];
          const existingRecord = subjectProgress.history.find(r => r.gameId === gameId);
          
          const newHistory = existingRecord
            ? subjectProgress.history.map(r => 
                r.gameId === gameId && stars > r.stars 
                  ? { ...r, score, stars, completedAt: new Date().toISOString() }
                  : r
              )
            : [...subjectProgress.history, { gameId, score, stars, completedAt: new Date().toISOString() }];

          const completedGames = newHistory.length;
          const totalStars = newHistory.reduce((sum, r) => sum + r.stars, 0);

          return {
            progress: {
              ...state.progress,
              [subject]: {
                ...subjectProgress,
                totalGames: Math.max(subjectProgress.totalGames, completedGames),
                completedGames,
                stars: totalStars,
                history: newHistory,
              },
            },
          };
        });
        
        // 检查成就
        get().checkAchievements();
      },

      unlockGame: (subject, gameId) => {
        // 游戏解锁逻辑可以根据需要实现
        console.log(`Unlocked game ${gameId} for ${subject}`);
      },

      checkAchievements: () => {
        const state = get();
        const { chinese, math, english } = state.progress;
        
        const achievements = [...state.achievements];
        
        // 检查每个成就
        const checkAndUnlock = (id: string, condition: boolean) => {
          const achievement = achievements.find(a => a.id === id);
          if (achievement && condition && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
          }
        };

        // 初次冒险
        checkAndUnlock('first_game', 
          chinese.completedGames > 0 || math.completedGames > 0 || english.completedGames > 0
        );

        // 语文小达人
        checkAndUnlock('chinese_master', chinese.completedGames >= 5);

        // 数学小天才
        checkAndUnlock('math_master', math.completedGames >= 6);

        // 英语小能手
        checkAndUnlock('english_master', english.completedGames >= 6);

        // 星星收集者
        checkAndUnlock('star_collector', chinese.stars + math.stars + english.stars >= 50);

        // 全能小冠军
        checkAndUnlock('all_rounder', 
          chinese.completedGames >= 5 && 
          math.completedGames >= 6 && 
          english.completedGames >= 6
        );

        set({ achievements });
      },

      resetProgress: () => set({
        progress: {
          chinese: { ...initialProgress, subject: 'chinese' },
          math: { ...initialProgress, subject: 'math' },
          english: { ...initialProgress, subject: 'english' },
        },
        achievements: initialAchievements,
      }),
    }),
    {
      name: 'grade3-learning-storage',
    }
  )
);
