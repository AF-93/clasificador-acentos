import React from 'react';
import { AccentType, ACCENT_TYPES } from '../../types/index.js';

interface AnswerButtonsProps {
  onAnswer: (type: AccentType) => void;
  disabled?: boolean;
  correctAnswer?: AccentType;
  selectedAnswer?: AccentType;
  showResults?: boolean;
}

export const AnswerButtons: React.FC<AnswerButtonsProps> = ({
  onAnswer,
  disabled = false,
  correctAnswer,
  selectedAnswer,
  showResults = false,
}) => {
  const getButtonClasses = (type: AccentType) => {
    const baseClasses = "answer-btn h-24 md:h-28 flex flex-col items-center justify-center text-white font-black text-xl rounded-3xl border-4 border-white/30 relative overflow-hidden";
    
    if (!showResults) {
      switch (type) {
        case 'aguda':
          return `${baseClasses} answer-btn-aguda`;
        case 'grave':
          return `${baseClasses} answer-btn-grave`;
        case 'esdrujula':
          return `${baseClasses} answer-btn-esdrujula`;
      }
    }
    
    if (type === correctAnswer) {
      return `${baseClasses} bg-gradient-to-br from-success-400 to-success-600 ring-4 ring-success-300`;
    }
    if (type === selectedAnswer && type !== correctAnswer) {
      return `${baseClasses} bg-gradient-to-br from-error-400 to-error-600 ring-4 ring-error-300`;
    }
    return `${baseClasses} bg-gradient-to-br from-gray-300 to-gray-400 opacity-60`;
  };

  const getEmoji = (type: AccentType) => {
    if (showResults) {
      if (type === correctAnswer) return '✅';
      if (type === selectedAnswer && type !== correctAnswer) return '❌';
      return '⚪';
    }
    
    switch (type) {
      case 'aguda': return '🚀';
      case 'grave': return '🏠';
      case 'esdrujula': return '🎪';
      default: return '🎯';
    }
  };
  
  const options: AccentType[] = ['aguda', 'grave', 'esdrujula'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {options.map((type) => (
        <button
          key={type}
          disabled={disabled}
          onClick={() => onAnswer(type)}
          className={getButtonClasses(type)}
        >
          <div className="text-4xl mb-2">
            {getEmoji(type)}
          </div>
          <span className="text-2xl font-black mb-1">
            {ACCENT_TYPES[type].label}
          </span>
          <span className="text-sm font-semibold opacity-90">
            {ACCENT_TYPES[type].description}
          </span>
          
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>
      ))}
    </div>
  );
};