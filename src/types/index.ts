// 学科类型
export type Subject = 'chinese' | 'math' | 'english';

// 游戏类型
export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  unlocked: boolean;
}

// 题目类型
export interface Question {
  id: string;
  type: 'choice' | 'fill' | 'drag';
  question: string;
  options?: string[];
  answer: string | string[];
  hint?: string;
}

// 学习进度
export interface Progress {
  subject: Subject;
  totalGames: number;
  completedGames: number;
  stars: number; // 总星星数
  level: number; // 当前关卡
  history: GameRecord[];
}

// 游戏记录
export interface GameRecord {
  gameId: string;
  score: number;
  stars: number;
  completedAt: string;
}

// 用户成就
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

// 知识点数据结构
export interface KnowledgePoint {
  id: string;
  title: string;
  description: string;
  games: Game[];
}
