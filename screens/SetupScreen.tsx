
import React, { useEffect } from 'react';
import { AppScreen, GameSettings } from '../types';
import { CATEGORIES, MAX_PLAYERS, MIN_PLAYERS } from '../constants';
import { Counter } from '../components/Counter';

interface SetupScreenProps {
  onNavigate: (screen: AppScreen) => void;
  settings: GameSettings;
  updateSettings: (updates: Partial<GameSettings>) => void;
  startGame: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onNavigate, settings, updateSettings, startGame }) => {
  const { totalPlayers, spyCount, blankCount, categoryName } = settings;

  // 推荐配置算法
  const getRecommendedConfig = (total: number) => {
    let spy = 1;
    let blank = 0;

    if (total <= 3) { spy = 1; blank = 0; }
    else if (total <= 4) { spy = 1; blank = 0; }
    else if (total <= 5) { spy = 1; blank = 1; }
    else if (total <= 6) { spy = 2; blank = 0; } // 6人局经典配置：2卧底
    else if (total <= 8) { spy = 2; blank = 1; } // 7-8人：2卧底1白板
    else if (total <= 10) { spy = 3; blank = 1; } // 9-10人：3卧底1白板
    else if (total <= 12) { spy = 3; blank = 2; } // 11-12人：3卧底2白板
    else { 
      // 13人以上自动按比例
      spy = Math.floor(total / 3.5); 
      blank = Math.floor(total / 5); 
    }

    return { spyCount: spy, blankCount: blank };
  };

  // 处理总人数变化，自动应用推荐配置
  const handleTotalPlayersChange = (val: number) => {
    const recommendation = getRecommendedConfig(val);
    updateSettings({ 
      totalPlayers: val, 
      ...recommendation 
    });
  };

  // 边界检查：确保手动修改其他选项时不会导致人数溢出
  useEffect(() => {
    const maxSpies = Math.max(1, Math.floor(totalPlayers / 2));
    let newSpy = spyCount;
    let newBlank = blankCount;
    let needsUpdate = false;

    // 卧底不能超过一半
    if (newSpy > maxSpies) {
      newSpy = maxSpies;
      needsUpdate = true;
    }

    // 卧底+白板必须小于总人数（至少留1个平民）
    if (newSpy + newBlank >= totalPlayers) {
      newBlank = Math.max(0, totalPlayers - newSpy - 1);
      needsUpdate = true;
    }
    
    // 如果白板还是太多导致无平民，再次消减卧底（极端情况）
    if (newSpy + newBlank >= totalPlayers) {
        newSpy = Math.max(1, totalPlayers - newBlank - 1);
        needsUpdate = true;
    }

    if (needsUpdate) {
      updateSettings({ spyCount: newSpy, blankCount: newBlank });
    }
  }, [totalPlayers, spyCount, blankCount, updateSettings]);

  const civCount = totalPlayers - spyCount - blankCount;

  return (
    <div className="relative flex h-full w-full flex-col max-w-md mx-auto bg-charcoal shadow-2xl overflow-hidden">
      <header className="flex items-center justify-center px-6 py-5 bg-charcoal/95 backdrop-blur-sm sticky top-0 z-10 shrink-0 border-b border-white/5 pt-safe">
        <h1 className="text-lg font-bold tracking-wide text-white">游戏设置</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-40 pt-4 no-scrollbar space-y-5">
        {/* Total Players */}
        <div className="p-6 bg-charcoal-surface rounded-3xl border border-white/5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold text-white tracking-tight">总人数</h2>
              <p className="text-sm text-gray-400">自动推荐卧底与白板人数</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_10px_-3px_rgba(56,189,248,0.3)]">
              <span className="material-symbols-outlined text-primary text-2xl">group</span>
            </div>
          </div>
          
          <Counter 
            value={totalPlayers} 
            min={MIN_PLAYERS} 
            max={MAX_PLAYERS} 
            onChange={handleTotalPlayersChange} 
          />
        </div>

        {/* Spy Count */}
        <div className="p-5 bg-charcoal-surface rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white">卧底人数</h2>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold opacity-80">潜伏者</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10">
              <span className="material-symbols-outlined text-red-400 text-xl">visibility_off</span>
            </div>
          </div>
          <Counter 
            value={spyCount} 
            min={1} 
            max={Math.floor(totalPlayers / 2)} 
            onChange={(val) => updateSettings({ spyCount: val })} 
          />
        </div>

        {/* Blank Count */}
        <div className="p-5 bg-charcoal-surface rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white">白板人数</h2>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold opacity-80">无词语</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10">
              <span className="material-symbols-outlined text-purple-400 text-xl">person_off</span>
            </div>
          </div>
          <Counter 
            value={blankCount} 
            min={0} 
            max={totalPlayers - spyCount - 1} 
            onChange={(val) => updateSettings({ blankCount: val })} 
          />
        </div>

        {/* Category Selector */}
        <div className="p-5 bg-charcoal-surface rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white">词库来源</h2>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold opacity-80">当前分类</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-primary text-xl">category</span>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate(AppScreen.CATEGORY)}
            className="w-full flex items-center justify-between bg-charcoal rounded-xl p-2 pr-4 border border-white/5 hover:border-primary/40 transition-all active:scale-[0.98] group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-lg bg-charcoal-element flex items-center justify-center border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-sm">
                <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">
                   {CATEGORIES.find(c => c.name === categoryName)?.icon || 'style'}
                </span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-white font-bold text-lg leading-none">{categoryName || '默认'}</span>
                <span className="text-xs text-gray-400 group-hover:text-primary transition-colors">点击切换</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-500 group-hover:text-white text-xl transition-colors relative z-10">arrow_forward_ios</span>
          </button>
        </div>

        {/* Status Chip */}
        <div className="mt-2 flex justify-center w-full pb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-charcoal-surface border border-white/10 shadow-lg backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            </span>
            <span className="text-sm font-medium text-gray-400">平民: <span className="text-white font-bold ml-1 text-base">{civCount}</span></span>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-charcoal via-charcoal to-transparent pt-16 z-20 pb-safe">
        <button 
          onClick={startGame}
          className="relative w-full bg-primary hover:bg-primary-hover text-charcoal font-bold text-lg h-16 rounded-2xl shadow-[0_0_20px_-5px_rgba(56,189,248,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2.5 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="z-10 tracking-wide">开始游戏</span>
          <span className="material-symbols-outlined text-[26px] z-10">play_arrow</span>
        </button>
      </div>
    </div>
  );
};
