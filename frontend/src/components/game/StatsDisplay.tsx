import React from 'react';
import { GameStats } from '../../types/index.js';

interface StatsDisplayProps {
  stats: GameStats;
  accuracyPercentage: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ 
  stats, 
  accuracyPercentage 
}) => {
  return (
    <div className="card-fun">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📊</div>
        <h3 className="text-2xl font-black bg-gradient-to-r from-fun-purple to-fun-pink bg-clip-text text-transparent">
          ¡Tus Estadísticas!
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-black text-success-600 mb-1">
            {stats.correct}
          </div>
          <div className="text-sm font-bold text-gray-700">Correctas</div>
        </div>
        
        <div className="stats-card text-center">
          <div className="text-3xl mb-2">❌</div>
          <div className="text-3xl font-black text-error-600 mb-1">
            {stats.incorrect}
          </div>
          <div className="text-sm font-bold text-gray-700">Incorrectas</div>
        </div>
        
        <div className="stats-card text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-3xl font-black text-fun-orange mb-1">
            {stats.streak}
          </div>
          <div className="text-sm font-bold text-gray-700">Racha</div>
        </div>
        
        <div className="stats-card text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-black text-fun-purple mb-1">
            {accuracyPercentage}%
          </div>
          <div className="text-sm font-bold text-gray-700">Precisión</div>
        </div>
      </div>
      
      {stats.streak >= 3 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-fun-yellow/20 via-fun-orange/20 to-fun-pink/20 border-2 border-fun-orange/30 rounded-2xl text-center">
          <div className="text-4xl mb-2">🌟</div>
          <span className="rainbow-text">
            ¡INCREÍBLE! Racha de {stats.streak} respuestas correctas!
          </span>
          <div className="text-2xl mt-2">🎉🎊✨</div>
        </div>
      )}
      
      {stats.streak >= 5 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-fun-purple/20 to-fun-pink/20 border-2 border-fun-purple/30 rounded-2xl text-center">
          <div className="text-5xl mb-2">👑</div>
          <span className="text-2xl font-black text-fun-purple">
            ¡ERES UN CAMPEÓN DE LOS ACENTOS!
          </span>
        </div>
      )}
    </div>
  );
};