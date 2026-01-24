
import React, { useState } from 'react';
import { Player, Role } from '../types';

interface PassPlayScreenProps {
  player: Player;
  totalPlayers: number;
  onNext: () => void;
}

export const PassPlayScreen: React.FC<PassPlayScreenProps> = ({ player, totalPlayers, onNext }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => setIsRevealed(true);
  
  const handleNext = () => {
    setIsRevealed(false); // Reset state for next render/logic if needed, though parent likely remounts or changes props
    onNext();
  };

  if (!isRevealed) {
    // HIDDEN STATE (CARD BACK)
    return (
      <div className="flex flex-col h-full w-full max-w-md mx-auto bg-charcoal text-white overflow-hidden animate-fade-in">
        <div className="flex flex-col items-center justify-center w-full pt-16 animate-slide-up pt-safe">
          <h1 className="text-white tracking-tight text-[32px] font-extrabold leading-tight text-center drop-shadow-sm">
            玩家 {player.id}
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-normal pt-2 text-center max-w-xs">
            请查看你的词卡
          </p>
        </div>

        <div className="flex-grow flex items-center justify-center w-full py-8">
          <button 
            onClick={handleReveal}
            className="relative group cursor-pointer outline-none transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden card-pattern border-[8px] border-charcoal-element">
              <div className="absolute inset-3 border border-white/10 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="p-8 bg-black/20 backdrop-blur-sm rounded-full shadow-inner ring-1 ring-white/10">
                  <span className="material-symbols-outlined text-gray-500 !text-7xl">fingerprint</span>
                </div>
                <div className="absolute top-6 left-6 opacity-30">
                  <span className="material-symbols-outlined text-gray-500 !text-3xl">help</span>
                </div>
                <div className="absolute bottom-6 right-6 opacity-30 rotate-180">
                  <span className="material-symbols-outlined text-gray-500 !text-3xl">help</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </button>
        </div>

        <div className="w-full flex justify-center pb-12 md:pb-16 px-6 pb-safe">
          <button 
            onClick={handleReveal}
            className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-charcoal-surface text-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-charcoal-element transition-all duration-300 border border-white/10"
          >
            <span className="material-symbols-outlined animate-pulse" style={{ fontSize: '22px' }}>touch_app</span>
            <span className="text-sm font-bold tracking-widest uppercase">点击查看身份</span>
          </button>
        </div>
      </div>
    );
  }

  // REVEALED STATE (CARD FRONT)
  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-charcoal text-white overflow-hidden animate-fade-in">
      <header className="flex items-center justify-between p-4 pb-2 z-10 shrink-0 pt-safe">
        <div className="size-12 shrink-0"></div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          第 {player.id}/{totalPlayers} 位玩家
        </h2>
        <div className="size-12 shrink-0"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full px-6 py-4 relative z-0">
        <div className="w-full max-w-xs sm:max-w-sm bg-charcoal-surface rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden relative flex flex-col items-center transition-colors duration-300 min-h-[460px] ring-1 ring-white/10">
          <div className={`h-1.5 w-full absolute top-0 left-0 ${player.role === Role.BLANK ? 'bg-blank' : 'bg-primary'}`}></div>
          
          <div className="p-8 w-full flex flex-col items-center justify-center text-center flex-1 gap-8">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                {player.role === Role.BLANK ? '你的身份' : '秘密词语'}
              </p>
            </div>
            
            {player.role === Role.BLANK ? (
                <>
                    <div className="w-24 h-24 rounded-full bg-blank/10 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <span className="material-symbols-outlined text-blank text-5xl">person_off</span>
                    </div>
                    <h1 className="text-white font-sans text-4xl font-black tracking-tight leading-none drop-shadow-lg break-words max-w-full text-blank">
                       你是白板
                    </h1>
                </>
            ) : (
                <h1 className="text-white font-sans text-5xl sm:text-6xl font-black tracking-tight leading-none drop-shadow-lg py-4 break-words max-w-full">
                {player.word}
                </h1>
            )}
            
            <p className="text-gray-400 text-sm font-medium max-w-[220px] leading-relaxed">
               {player.role === Role.BLANK 
                 ? <>你没有词语<br/>请假装知道并隐藏身份！</>
                 : <>请仔细记住这个词语<br />不要让其他人看到！</>
               }
            </p>
          </div>
        </div>
      </main>

      <footer className="p-6 w-full flex justify-center shrink-0 pt-0 pb-safe">
        <button 
          onClick={handleNext}
          className="w-full max-w-sm group cursor-pointer flex items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-primary-hover text-charcoal text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 active:scale-[0.98] transition-all duration-200"
        >
          <span className="truncate mr-2">我记住了，传给下一位</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
