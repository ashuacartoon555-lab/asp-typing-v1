import { useState, useCallback, useEffect, useRef } from 'react';
import { wordBanks } from '@/data/wordBanks';

interface Enemy {
  id: number;
  word: string;
  x: number;
  health: number;
}

export const useKeyboardWarriorGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [castleHealth, setCastleHealth] = useState(100);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('keyboardWarriorHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const enemyIdRef = useRef(0);

  const getRandomWord = useCallback(() => {
    const difficulty = wave <= 3 ? 'easy' : wave <= 6 ? 'medium' : 'hard';
    const words = wordBanks[difficulty];
    return words[Math.floor(Math.random() * words.length)];
  }, [wave]);

  const spawnEnemy = useCallback(() => {
    const newEnemy: Enemy = {
      id: enemyIdRef.current++,
      word: getRandomWord(),
      x: 100,
      health: 1
    };
    setEnemies(prev => [...prev, newEnemy]);
  }, [getRandomWord]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setWave(1);
    setCastleHealth(100);
    setEnemies([]);
    setInputValue('');
    setEnemiesDefeated(0);
    enemyIdRef.current = 0;
  }, []);

  const endGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(true);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('keyboardWarriorHighScore', score.toString());
    }

    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
  }, [score, highScore]);

  const handleInput = useCallback((value: string) => {
    setInputValue(value);
    
    const trimmedValue = value.trim().toLowerCase();
    const matchedIndex = enemies.findIndex(e => e.word.toLowerCase() === trimmedValue);
    
    if (matchedIndex !== -1) {
      const matchedEnemy = enemies[matchedIndex];
      const pointsEarned = matchedEnemy.word.length * 15 * wave;
      
      setScore(prev => prev + pointsEarned);
      setEnemiesDefeated(prev => prev + 1);
      setEnemies(prev => prev.filter(e => e.id !== matchedEnemy.id));
      setInputValue('');

      if ((enemiesDefeated + 1) % 8 === 0) {
        setWave(prev => Math.min(prev + 1, 10));
      }
    }
  }, [enemies, wave, enemiesDefeated]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setEnemies(prev => {
        const updated = prev.map(enemy => ({
          ...enemy,
          x: enemy.x - (0.5 + wave * 0.1)
        }));

        const attacking = updated.filter(e => e.x <= 10);
        if (attacking.length > 0) {
          setCastleHealth(h => {
            const newHealth = h - attacking.length * 10;
            if (newHealth <= 0) {
              endGame();
            }
            return Math.max(0, newHealth);
          });
        }

        return updated.filter(e => e.x > 10);
      });
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, wave, endGame]);

  // Spawn enemies
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = Math.max(3000 - (wave * 200), 1000);
    
    spawnRef.current = setInterval(spawnEnemy, spawnInterval);
    spawnEnemy();

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameStarted, gameOver, wave, spawnEnemy]);

  const resetGame = useCallback(() => {
    setGameOver(false);
    setGameStarted(false);
  }, []);

  return {
    gameStarted,
    gameOver,
    score,
    wave,
    castleHealth,
    enemies,
    inputValue,
    enemiesDefeated,
    highScore,
    startGame,
    endGame,
    resetGame,
    handleInput
  };
};
