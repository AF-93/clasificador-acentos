import React, { useEffect, useState } from 'react';
import { AccentType } from '../types/index.js';
import { useGameStore } from '../store/game.store';
import { 
  WordDisplay, 
  AnswerButtons, 
  StatsDisplay, 
  ResultFeedback 
} from './game/index';
import { Button, LoadingSpinner, Card } from './ui';

export const Game: React.FC = () => {
  const {
    currentWord,
    stats,
    isLoading,
    gamePhase,
    lastAnswer,
    loadNewWord,
    submitAnswer,
    resetStats,
    nextQuestion,
    getAccuracyPercentage,
  } = useGameStore();
  
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Cargar primera palabra al montar el componente
    if (!currentWord && gamePhase === 'waiting') {
      handleLoadWord();
    }
  }, []);
  
  const handleLoadWord = async () => {
    try {
      setError(null);
      await loadNewWord();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando palabra');
    }
  };
  
  const handleAnswer = async (answer: AccentType) => {
    try {
      setError(null);
      await submitAnswer(answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando respuesta');
    }
  };
  
  const handleNext = () => {
    nextQuestion();
  };
  
  const handleReset = () => {
    resetStats();
    handleLoadWord();
  };
  
  // Renderizado condicional basado en el estado del juego
  const renderGameContent = () => {
    if (error) {
      return (
        <div className="card-fun text-center">
          <div className="text-8xl mb-4 animate-wiggle">😅</div>
          <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-error-400 to-error-600 bg-clip-text text-transparent">
            ¡Ups! Algo salió mal
          </h3>
          <div className="bg-gradient-to-r from-error-50 to-error-100 rounded-2xl p-4 mb-6">
            <p className="text-lg text-error-700 font-medium">{error}</p>
          </div>
          <button
            onClick={handleLoadWord}
            className="btn-primary text-xl"
          >
            🔄 ¡Intentar de nuevo!
          </button>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="card-fun text-center">
          <div className="text-8xl mb-6 animate-bounce-slow">🎲</div>
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-2xl font-bold text-fun-purple">
            🌟 Buscando una palabra genial... 🌟
          </p>
        </div>
      );
    }
    
    if (!currentWord) {
      return (
        <div className="card-fun text-center">
          <div className="text-8xl mb-6 animate-float">🎮</div>
          <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-fun-purple via-fun-pink to-fun-blue bg-clip-text text-transparent">
            ¡Bienvenido al Juego!
          </h3>
          <div className="bg-gradient-to-r from-fun-yellow/20 to-fun-orange/20 rounded-2xl p-6 mb-8">
            <p className="text-xl text-gray-700 font-bold mb-4">
              🎯 ¡Aprende jugando con las palabras!
            </p>
            <p className="text-lg text-gray-600">
              Identifica si las palabras son <span className="font-bold text-fun-pink">agudas</span>, 
              <span className="font-bold text-fun-blue"> graves</span> o 
              <span className="font-bold text-fun-purple"> esdrújulas</span>
            </p>
          </div>
          <button
            onClick={handleLoadWord}
            className="btn-primary text-2xl px-8 py-4"
          >
            🚀 ¡Comenzar a jugar! 🚀
          </button>
        </div>
      );
    }
    
    switch (gamePhase) {
      case 'answering':
        return (
          <>
            <WordDisplay word={currentWord.word} />
            <AnswerButtons
              onAnswer={handleAnswer}
              disabled={isLoading}
            />
          </>
        );
        
      case 'feedback':
        if (!lastAnswer) return null;
        
        return (
          <>
            <WordDisplay 
              word={currentWord.word} 
              syllables={currentWord.syllables}
              isRevealed={true}
            />
            <AnswerButtons
              onAnswer={() => {}}
              disabled={true}
              correctAnswer={currentWord.accentType}
              selectedAnswer={lastAnswer.selected}
              showResults={true}
            />
            <ResultFeedback
              isCorrect={lastAnswer.isCorrect}
              correctAnswer={currentWord.accentType}
              selectedAnswer={lastAnswer.selected}
              explanation={currentWord.explanation}
              onNext={handleNext}
            />
          </>
        );
        
      default:
        return (
          <Card className="text-center">
            <Button onClick={handleLoadWord} size="lg">
              Nueva palabra
            </Button>
          </Card>
        );
    }
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="emoji-big mb-4">🎯📚✨</div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-fun-purple via-fun-pink to-fun-blue bg-clip-text text-transparent animate-float">
            ¡Clasificador de Acentos!
          </h1>
          <p className="text-xl text-gray-700 font-semibold">
            🌟 ¡Aprende jugando con las palabras! 🌟
          </p>
        </div>
        
        {/* Estadísticas */}
        {stats.totalAnswered > 0 && (
          <div className="mb-8">
            <StatsDisplay 
              stats={stats} 
              accuracyPercentage={getAccuracyPercentage()} 
            />
          </div>
        )}
        
        {/* Contenido principal del juego */}
        <div className="space-y-6">
          {renderGameContent()}
        </div>
        
        {/* Controles adicionales */}
        {stats.totalAnswered > 0 && (
          <div className="mt-8 text-center space-y-4">
            <div className="bg-gradient-to-r from-fun-blue/10 to-fun-purple/10 rounded-2xl p-4">
              <button
                onClick={handleReset}
                className="btn-secondary mr-4 text-lg"
              >
                🔄 Reiniciar estadísticas
              </button>
              {gamePhase === 'waiting' && (
                <button
                  onClick={handleLoadWord}
                  className="btn-primary text-lg"
                >
                  ✨ Nueva palabra ✨
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};