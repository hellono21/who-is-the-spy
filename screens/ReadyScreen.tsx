
import React from 'react';
import { AppScreen } from '../types';

interface ReadyScreenProps {
  onStartVoting: () => void;
  onRestart: () => void;
}

export const ReadyScreen: React.FC<ReadyScreenProps> = ({ onStartVoting, onRestart }) => {
  return (
    <div className="relative flex flex-col h-full w-full max-w-md mx-auto bg-charcoal text-white overflow-hidden animate-fade-in">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
       
       <main className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-md mx-auto z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary rounded-full blur-xl animate-pulse opacity-20"></div>
            <div className="relative w-24 h-24 rounded-full bg-charcoal-surface border border-white/10 flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-primary text-[48px]">check_circle</span>
            </div>
          </div>
          
          <div className="space-y-4 text-center">
            <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight px-2">
                词卡发放完毕！
            </h1>
            <div className="space-y-1">
              <p className="text-gray-400 text-base font-normal leading-relaxed">
                  卧底身份已隐藏
              </p>
              <p className="text-white/90 text-base font-medium leading-relaxed">
                  请按顺序描述，准备投票
              </p>
            </div>
          </div>
       </main>

       <footer className="w-full max-w-md mx-auto px-4 pb-8 pt-4 space-y-3 z-10 pb-safe">
        <div className="flex">
          <button 
            onClick={onStartVoting}
            className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary hover:bg-primary-hover transition-colors text-charcoal text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20 group relative"
          >
            <span className="material-symbols-outlined mr-2 text-[20px] opacity-80 group-hover:opacity-100">how_to_vote</span>
            <span className="truncate">开始发言与投票</span>
          </button>
        </div>
        <div className="flex">
          <button 
            onClick={onRestart}
            className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-charcoal-element hover:bg-white/10 transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] border border-white/5 group"
          >
            <span className="material-symbols-outlined mr-2 text-[20px] text-gray-400 group-hover:text-white transition-colors">replay</span>
            <span className="truncate">重新开局</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
