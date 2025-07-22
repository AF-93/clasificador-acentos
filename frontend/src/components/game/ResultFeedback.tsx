import React from 'react';
import { AccentType, ACCENT_TYPES } from '../../types/index.js';

interface ResultFeedbackProps {
  isCorrect: boolean;
  correctAnswer: AccentType;
  selectedAnswer: AccentType;
  explanation: string;
  onNext: () => void;
}

export const ResultFeedback: React.FC<ResultFeedbackProps> = ({
  isCorrect,
  correctAnswer,
  selectedAnswer,
  explanation,
  onNext,
}) => {
  const correctMessages = [
    "¡FANTÁSTICO! 🌟",
    "¡INCREÍBLE! 🎉",
    "¡EXCELENTE! ✨",
    "¡GENIAL! 🚀",
    "¡PERFECTO! 👏"
  ];
  
  const incorrectMessages = [
    "¡No te preocupes! 💪",
    "¡Sigue intentando! 🌈",
    "¡Casi lo tienes! 🎯",
    "¡Aprende y mejora! 📚",
    "¡La próxima será! ⭐"
  ];
  
  const randomMessage = isCorrect 
    ? correctMessages[Math.floor(Math.random() * correctMessages.length)]
    : incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];

  return (
    <div className={`card-fun ${isCorrect ? 'celebration' : ''}`}>
      <div className="text-center mb-6">
        <div className={`text-8xl mb-4 ${isCorrect ? 'animate-bounce-slow' : 'animate-wiggle'}`}>
          {isCorrect ? '🎉' : '🤗'}
        </div>
        
        <h3 className={`text-4xl font-black mb-4 ${
          isCorrect 
            ? 'bg-gradient-to-r from-success-400 to-success-600 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-error-400 to-error-600 bg-clip-text text-transparent'
        }`}>
          {randomMessage}
        </h3>
        
        {!isCorrect && (
          <div className="bg-gradient-to-r from-fun-blue/20 to-fun-purple/20 rounded-2xl p-4 mb-4">
            <div className="text-lg font-bold text-gray-700 mb-2">
              🎯 Tu respuesta: <span className="text-error-600 text-xl">{ACCENT_TYPES[selectedAnswer].label}</span>
            </div>
            <div className="text-lg font-bold text-gray-700">
              ✅ Respuesta correcta: <span className="text-success-600 text-xl">{ACCENT_TYPES[correctAnswer].label}</span>
            </div>
          </div>
        )}
        
        {isCorrect && (
          <div className="text-6xl mb-4">
            🌟✨🎊✨🌟
          </div>
        )}
      </div>
      
      <div className="mb-8 p-6 bg-gradient-to-br from-fun-yellow/10 via-fun-orange/10 to-fun-pink/10 rounded-3xl border-2 border-fun-orange/20">
        <div className="flex items-center justify-center mb-4">
          <div className="text-3xl mr-2">🧠</div>
          <h4 className="text-2xl font-black text-fun-purple">¡Aprende más!</h4>
          <div className="text-3xl ml-2">📖</div>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed font-medium">{explanation}</p>
      </div>
      
      <div className="text-center">
        <button
          onClick={onNext}
          className="btn-primary text-2xl px-8 py-4 relative overflow-hidden group"
        >
          <span className="relative z-10">
            🚀 ¡Siguiente palabra! 🚀
          </span>
          
          {/* Efecto de confeti */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-2 left-4 text-yellow-300 animate-bounce">✨</div>
            <div className="absolute top-3 right-6 text-pink-300 animate-bounce delay-100">🌟</div>
            <div className="absolute bottom-2 left-8 text-blue-300 animate-bounce delay-200">💫</div>
            <div className="absolute bottom-3 right-4 text-purple-300 animate-bounce delay-300">⭐</div>
          </div>
        </button>
      </div>
      
      {isCorrect && (
        <div className="mt-6 text-center">
          <div className="text-4xl animate-float">
            🎈🎁🎈
          </div>
        </div>
      )}
    </div>
  );
};