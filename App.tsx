
import React, { useState } from 'react';
import { AppScreen, GameSettings, Player, Winner } from './types';
import { DEFAULT_WORD_PAIRS } from './constants';
import { initializeGame, checkWinCondition } from './utils/gameLogic';
import { generateWordPair } from './services/geminiService';
import { SetupScreen } from './screens/SetupScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { PassPlayScreen } from './screens/PassPlayScreen';
import { ReadyScreen } from './screens/ReadyScreen';
import { ResultScreen } from './screens/ResultScreen';
import { VotingScreen } from './screens/VotingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SETUP);
  
  // Game Configuration State
  const [settings, setSettings] = useState<GameSettings>({
    totalPlayers: 6,
    spyCount: 1,
    blankCount: 0,
    wordPair: DEFAULT_WORD_PAIRS[0],
    categoryName: '默认',
    categoryId: 'default',
  });

  // Game Runtime State
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameWinner, setGameWinner] = useState<Winner>(Winner.NONE);

  const updateSettings = (updates: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const startGame = async () => {
    let finalSettings = { ...settings };

    // If not Manual mode, generate a fresh word pair for this round
    if (settings.categoryId !== 'manual') {
      try {
        const newPair = await generateWordPair(
          settings.categoryId, 
          settings.categoryName, 
          settings.customWordBank
        );
        finalSettings.wordPair = newPair;
        // Update state so the new word persists if we check settings later
        setSettings(finalSettings);
      } catch (error) {
        console.error("Failed to generate new word pair:", error);
        // Fallback to existing word pair if generation fails
      }
    }

    const newPlayers = initializeGame(finalSettings);
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setGameWinner(Winner.NONE);
    setCurrentScreen(AppScreen.PASS_PLAY);
  };

  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      setCurrentScreen(AppScreen.READY);
    }
  };

  const restartSameSettings = () => {
    startGame();
  };

  const newGame = () => {
    setCurrentScreen(AppScreen.SETUP);
  };

  const handleEliminatePlayer = (playerId: number): Winner => {
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, isEliminated: true, isRevealed: true } : p
    );
    setPlayers(updatedPlayers);
    
    // Check Result - Return it so VotingScreen knows if game ended
    const result = checkWinCondition(updatedPlayers);
    if (result !== Winner.NONE) {
        setGameWinner(result);
    }
    return result;
  };

  return (
    <div className="w-full h-safe-screen bg-[#121212] flex justify-center overflow-hidden">
      {currentScreen === AppScreen.SETUP && (
        <SetupScreen 
          onNavigate={setCurrentScreen} 
          settings={settings} 
          updateSettings={updateSettings} 
          startGame={startGame}
        />
      )}
      
      {currentScreen === AppScreen.CATEGORY && (
        <CategoryScreen 
          onNavigate={setCurrentScreen} 
          updateSettings={updateSettings} 
        />
      )}

      {currentScreen === AppScreen.PASS_PLAY && players.length > 0 && (
        <PassPlayScreen 
          player={players[currentPlayerIndex]} 
          totalPlayers={settings.totalPlayers} 
          onNext={handleNextPlayer} 
        />
      )}

      {currentScreen === AppScreen.READY && (
        <ReadyScreen 
          onStartVoting={() => setCurrentScreen(AppScreen.VOTING)} 
          onRestart={restartSameSettings} 
        />
      )}

      {currentScreen === AppScreen.VOTING && (
        <VotingScreen
          players={players}
          onEliminate={handleEliminatePlayer}
          onGameEnd={(winner) => {
            setGameWinner(winner);
            setCurrentScreen(AppScreen.RESULT);
          }}
        />
      )}

      {currentScreen === AppScreen.RESULT && (
        <ResultScreen 
          players={players} 
          winner={gameWinner}
          onPlayAgain={restartSameSettings} 
          onNewGame={newGame} 
        />
      )}
    </div>
  );
}
