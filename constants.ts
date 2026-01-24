import { Category, WordPair } from './types';

export const DEFAULT_WORD_PAIRS: WordPair[] = [
  { civilian: "苹果", spy: "橙子" },
  { civilian: "可口可乐", spy: "百事可乐" },
  { civilian: "麦当劳", spy: "肯德基" },
  { civilian: "微信", spy: "QQ" },
  { civilian: "牛肉面", spy: "炸酱面" },
];

export const CATEGORIES: Category[] = [
  { id: 'default', name: '默认', icon: 'style', description: '经典随机词库' },
  { id: 'food', name: '美食', icon: 'restaurant', description: '吃货必选' },
  { id: 'kids', name: '儿童', icon: 'smart_toy', description: '简单有趣' },
  { id: 'tech', name: '科技', icon: 'devices', description: '数码爱好者' },
  { id: 'entertainment', name: '娱乐', icon: 'movie', description: '电影明星' },
];

export const MAX_PLAYERS = 20;
export const MIN_PLAYERS = 3;