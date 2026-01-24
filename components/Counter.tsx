import React from 'react';

interface CounterProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const Counter: React.FC<CounterProps> = ({ value, min, max, onChange, disabled = false }) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={`flex items-center justify-between bg-charcoal rounded-xl p-1.5 border border-white/5 ${disabled ? 'opacity-50' : ''}`}>
      <button 
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">remove</span>
      </button>
      
      <div className="flex-1 flex justify-center">
        <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
      </div>
      
      <button 
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};