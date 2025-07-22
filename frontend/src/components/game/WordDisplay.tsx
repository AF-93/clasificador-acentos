import React from 'react';

interface WordDisplayProps {
  word: string;
  syllables?: string[];
  isRevealed?: boolean;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({ 
  word, 
  syllables, 
  isRevealed = false 
}) => {
  return (
    <div className="card-fun text-center">
      <div className="mb-6">
        <div className="text-4xl mb-4">
          {isRevealed ? '🎉' : '🤔'}
        </div>
        
        <h2 className="word-display mb-4">
          {word}
        </h2>
        
        {isRevealed && syllables && (
          <div className="bg-gradient-to-r from-fun-blue/20 to-fun-purple/20 rounded-2xl p-4 mb-4">
            <div className="text-2xl font-bold text-fun-purple mb-2">
              🔤 Sílabas:
            </div>
            <div className="text-3xl font-black text-fun-blue">
              {syllables.join(' - ')}
            </div>
          </div>
        )}
      </div>
      
      {!isRevealed && (
        <div className="bg-gradient-to-r from-fun-yellow/20 to-fun-orange/20 rounded-2xl p-4">
          <p className="text-xl font-bold text-gray-700">
            🎯 ¿Cómo se clasifica esta palabra?
          </p>
          <p className="text-lg text-gray-600 mt-2">
            ¡Elige la respuesta correcta! 👇
          </p>
        </div>
      )}
    </div>
  );
};