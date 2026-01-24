
import React from 'react';
import { Player, Role, Winner } from '../types';

interface ResultScreenProps {
  players: Player[];
  winner: Winner;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ players, winner, onPlayAgain, onNewGame }) => {
  
  const getWinnerText = () => {
    switch (winner) {
        case Winner.CIVILIAN: 
          return { title: '平民胜利', sub: '所有卧底已被找出', color: 'text-primary', bg: 'bg-primary/10' };
        case Winner.SPY: 
          return { title: '卧底胜利', sub: '卧底人数已占优势', color: 'text-spy', bg: 'bg-spy/10' };
        case Winner.BLANK: 
          return { title: '白板胜利', sub: '幸存并猜出平民词', color: 'text-blank', bg: 'bg-blank/10' };
        default: 
          return { title: '游戏结束', sub: '查看结果', color: 'text-white', bg: 'bg-white/10' };
    }
  };

  const style = getWinnerText();

  return (
    <div className="relative flex h-full w-full flex-col max-w-md mx-auto bg-charcoal text-white overflow-hidden animate-fade-in">
      <div className={`flex-none pt-10 px-6 pb-8 z-10 border-b border-white/5 ${style.bg} pt-safe`}>
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className={`text-4xl font-black tracking-tight uppercase drop-shadow-lg ${style.color}`}>
             {style.title}
          </h1>
          <p className="text-sm font-bold text-white/60 uppercase tracking-widest">
             {style.sub}
          </p>
        </div>
      </div>

      <div className="flex-none px-6 pt-6 pb-2 flex justify-between text-xs font-bold text-gray-600 uppercase tracking-widest">
        <span>玩家 / 身份</span>
        <span>词语</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 no-scrollbar">
        {players.map((player) => (
            <div 
              key={player.id} 
              className={`flex items-center justify-between p-4 rounded-lg bg-charcoal-surface ${
                player.role === Role.SPY ? 'ring-1 ring-inset ring-spy/30' : 
                player.role === Role.BLANK ? 'ring-1 ring-inset ring-blank/30' : ''
              } ${player.isEliminated ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 ${player.isEliminated ? 'bg-charcoal-element text-gray-500' : 'bg-white/10 text-white'}`}>
                    <span className="text-xs font-bold">{player.id}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className={`text-xs font-bold uppercase tracking-wide ${
                        player.role === Role.SPY ? 'text-spy' : 
                        player.role === Role.BLANK ? 'text-blank' : 'text-gray-400'
                    }`}>
                        {player.role === Role.CIVILIAN ? '平民' : player.role === Role.SPY ? '卧底' : '白板'}
                    </span>
                 </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${player.role === Role.SPY ? 'text-spy' : 'text-gray-300'}`}>
                    {player.word || <span className="text-gray-500 italic">无</span>}
                </span>
                {player.isEliminated && <span className="text-[10px] text-red-500 ml-2 font-bold uppercase">出局</span>}
              </div>
            </div>
        ))}
      </div>

      <div className="flex-none p-6 pb-8 bg-charcoal border-t border-white/5 z-20 pb-safe">
        <div className="flex flex-col gap-3">
          <button 
            onClick={onPlayAgain}
            className="w-full h-12 flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-charcoal active:scale-[0.98] transition-transform duration-200 shadow-neon"
          >
            <span className="font-bold tracking-wide uppercase text-sm">再来一局</span>
          </button>
          <button 
            onClick={onNewGame}
            className="w-full h-12 flex items-center justify-center rounded-lg bg-transparent border border-gray-700 hover:bg-white/5 active:scale-[0.98] transition-transform duration-200"
          >
            <span className="text-gray-300 font-bold tracking-wide uppercase text-sm">返回设置</span>
          </button>
        </div>
      </div>
    </div>
  );
};
