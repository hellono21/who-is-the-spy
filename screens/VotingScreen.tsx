
import React, { useState } from 'react';
import { Player, Role, Winner } from '../types';

interface VotingScreenProps {
  players: Player[];
  onEliminate: (playerId: number) => Winner;
  onGameEnd: (winner: Winner) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ players, onEliminate, onGameEnd }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [revealPlayer, setRevealPlayer] = useState<Player | null>(null);
  const [currentResult, setCurrentResult] = useState<Winner>(Winner.NONE);
  
  // Blank Guessing Phase State
  const [showBlankGuessing, setShowBlankGuessing] = useState(false);
  const [showCivilianWord, setShowCivilianWord] = useState(false);

  const activePlayers = players.filter(p => !p.isEliminated);
  const civilianWord = players.find(p => p.role === Role.CIVILIAN)?.word || "未知";

  const handlePlayerClick = (player: Player) => {
    if (player.isEliminated) return;
    setSelectedPlayer(player);
    setIsConfirming(true);
  };

  const confirmElimination = () => {
    if (selectedPlayer) {
      const result = onEliminate(selectedPlayer.id);
      setCurrentResult(result);
      setRevealPlayer(selectedPlayer);
      setIsConfirming(false);
      setSelectedPlayer(null);
    }
  };

  const closeReveal = () => {
    // If logic returns Winner.BLANK here, it means the conditions (Spy=0, Players<=2) are met.
    // We enter the Guessing Phase instead of ending the game immediately.
    if (currentResult === Winner.BLANK) {
        setShowBlankGuessing(true);
        setRevealPlayer(null);
    } else if (currentResult !== Winner.NONE) {
        onGameEnd(currentResult);
        setRevealPlayer(null);
        setCurrentResult(Winner.NONE);
    } else {
        setRevealPlayer(null);
        setCurrentResult(Winner.NONE);
    }
  };

  const handleBlankGuessResult = (success: boolean) => {
      // If Blank guesses right -> Blank Wins.
      // If Blank guesses wrong -> Civilian Wins.
      onGameEnd(success ? Winner.BLANK : Winner.CIVILIAN);
  };

  // Helper to get Role Display
  const getRoleDisplay = (role: Role) => {
    switch(role) {
      case Role.SPY: return { text: '卧底', color: 'text-spy', bg: 'bg-spy/20', border: 'border-spy' };
      case Role.BLANK: return { text: '白板', color: 'text-blank', bg: 'bg-blank/20', border: 'border-blank' };
      default: return { text: '平民', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary' };
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full max-w-md mx-auto bg-charcoal text-white overflow-hidden">
      <header className="flex items-center justify-between px-6 py-5 bg-charcoal/95 backdrop-blur-sm border-b border-white/5 z-10 pt-safe">
        <h1 className="text-lg font-bold tracking-wide text-white">投票处决</h1>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs text-gray-400">存活: {activePlayers.length}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar pb-safe">
        <p className="text-center text-gray-400 mb-6 text-sm">点击玩家头像进行票选出局</p>
        
        <div className="grid grid-cols-3 gap-4">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => handlePlayerClick(player)}
              disabled={player.isEliminated}
              className={`relative flex flex-col items-center gap-2 group ${player.isEliminated ? 'opacity-50 grayscale' : 'hover:scale-105 transition-transform'}`}
            >
              <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-all
                ${player.isEliminated 
                  ? 'bg-charcoal-element border-white/5' 
                  : 'bg-charcoal-surface border-white/10 group-hover:border-primary/50 group-hover:shadow-primary/20'
                }`}
              >
                {player.isEliminated ? (
                   <span className="material-symbols-outlined text-4xl text-gray-600">skull</span>
                ) : (
                   <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-white">person</span>
                )}
                
                <div className="absolute top-1 right-1 w-6 h-6 bg-charcoal rounded-full flex items-center justify-center border border-white/10">
                    <span className="text-[10px] font-bold text-gray-500">{player.id}</span>
                </div>
              </div>
              
              {player.isEliminated && (
                 <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleDisplay(player.role).bg} ${getRoleDisplay(player.role).color}`}>
                    {getRoleDisplay(player.role).text}
                 </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* Confirmation Modal */}
      {isConfirming && selectedPlayer && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="w-full bg-charcoal-surface rounded-3xl border border-white/10 p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-center text-white mb-2">确认放逐?</h3>
            <p className="text-center text-gray-400 mb-8">
              玩家 <span className="text-primary font-bold text-lg">{selectedPlayer.id}</span> 号将被淘汰并亮明身份。
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsConfirming(false)}
                className="flex-1 h-12 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5"
              >
                取消
              </button>
              <button 
                onClick={confirmElimination}
                className="flex-1 h-12 rounded-xl bg-red-500/90 text-white font-bold hover:bg-red-500 shadow-lg shadow-red-500/20"
              >
                确认出局
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Identity Reveal Modal */}
      {revealPlayer && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-charcoal p-6 animate-fade-in">
           <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
           
           <h2 className="text-gray-400 text-lg font-medium mb-8 uppercase tracking-widest">身份揭晓</h2>
           
           <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-[slideUp_0.5s_ease-out]
              ${getRoleDisplay(revealPlayer.role).border} ${getRoleDisplay(revealPlayer.role).bg}
           `}>
              <span className={`material-symbols-outlined text-6xl ${getRoleDisplay(revealPlayer.role).color}`}>
                {revealPlayer.role === Role.SPY ? 'visibility_off' : revealPlayer.role === Role.BLANK ? 'check_box_outline_blank' : 'person'}
              </span>
           </div>

           <h1 className="text-4xl font-black text-white mb-2">玩家 {revealPlayer.id}</h1>
           <p className={`text-2xl font-bold mb-12 ${getRoleDisplay(revealPlayer.role).color}`}>
              是 {getRoleDisplay(revealPlayer.role).text}
           </p>

           <button 
             onClick={closeReveal}
             className={`w-full max-w-xs h-14 font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2
                ${(currentResult !== Winner.NONE && currentResult !== Winner.BLANK) ? 'bg-primary text-charcoal hover:bg-primary-hover' : 'bg-white text-charcoal hover:bg-gray-200'}`}
           >
             {/* Note: Winner.BLANK here just means we are transitioning to Guessing Phase, not game over yet */}
             {(currentResult !== Winner.NONE && currentResult !== Winner.BLANK) ? (
                 <>
                   <span>查看战报</span>
                   <span className="material-symbols-outlined">emoji_events</span>
                 </>
             ) : (
                 <>
                   <span>继续</span>
                   <span className="material-symbols-outlined">play_arrow</span>
                 </>
             )}
           </button>
        </div>
      )}

      {/* Blank Guessing Phase Modal */}
      {showBlankGuessing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-6 animate-fade-in">
          <div className="w-full bg-charcoal-surface rounded-3xl border border-white/10 p-6 shadow-2xl animate-slide-up flex flex-col items-center text-center">
            
            <div className="w-16 h-16 rounded-full bg-blank/20 flex items-center justify-center mb-4 ring-2 ring-blank">
                <span className="material-symbols-outlined text-blank text-3xl">psychology_alt</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">白板逆袭时刻</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              卧底已出局，但白板存活。<br/>
              <span className="text-white font-bold">请白板玩家猜出平民词</span>，猜对即胜利！
            </p>

            <div className="w-full p-4 bg-charcoal rounded-xl border border-white/5 mb-6">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">平民词语</p>
                {showCivilianWord ? (
                    <h2 className="text-3xl font-bold text-primary animate-fade-in">{civilianWord}</h2>
                ) : (
                    <button 
                      onClick={() => setShowCivilianWord(true)}
                      className="text-sm text-gray-400 underline hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto py-2"
                    >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        <span>点击查看答案</span>
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => handleBlankGuessResult(true)}
                className="w-full h-14 rounded-xl bg-blank hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>猜对了 (白板胜)</span>
                <span className="material-symbols-outlined">check_circle</span>
              </button>
              <button 
                onClick={() => handleBlankGuessResult(false)}
                className="w-full h-14 rounded-xl bg-charcoal-element border border-white/10 hover:bg-white/5 text-gray-300 font-bold active:scale-[0.98] transition-all"
              >
                猜错了 (平民胜)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
