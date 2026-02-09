import { useState, useEffect } from 'react';

interface WeakSpot {
  character: string;
  errors: number;
  attempts: number;
  accuracy: number;
}

interface WeakWord {
  word: string;
  errors: number;
  attempts: number;
  avgTime: number;
}

interface WeakSpotAnalysis {
  weakCharacters: WeakSpot[];
  weakWords: WeakWord[];
  totalErrors: number;
  mostProblematicKey: string;
  improvementSuggestion: string;
}

export const useWeakSpotAnalysis = () => {
  const [analysis, setAnalysis] = useState<WeakSpotAnalysis | null>(null);

  const analyzeTypingData = (inputValue: string, promptText: string, errors: number) => {
    const characterErrors: Record<string, { errors: number; attempts: number }> = {};
    const wordErrors: Record<string, { errors: number; attempts: number; totalTime: number }> = {};

    // Analyze character-by-character
    for (let i = 0; i < inputValue.length; i++) {
      const typed = inputValue[i];
      const expected = promptText[i];
      
      if (!characterErrors[expected]) {
        characterErrors[expected] = { errors: 0, attempts: 0 };
      }
      
      characterErrors[expected].attempts++;
      
      if (typed !== expected) {
        characterErrors[expected].errors++;
      }
    }

    // Analyze word-by-word
    const promptWords = promptText.split(' ');
    const typedWords = inputValue.split(' ');
    
    promptWords.forEach((word, index) => {
      if (typedWords[index]) {
        if (!wordErrors[word]) {
          wordErrors[word] = { errors: 0, attempts: 0, totalTime: 0 };
        }
        
        wordErrors[word].attempts++;
        
        // Check if word was typed incorrectly
        if (typedWords[index] !== word) {
          wordErrors[word].errors++;
        }
      }
    });

    // Calculate weak spots
    const weakCharacters: WeakSpot[] = Object.entries(characterErrors)
      .map(([char, data]) => ({
        character: char,
        errors: data.errors,
        attempts: data.attempts,
        accuracy: ((data.attempts - data.errors) / data.attempts) * 100
      }))
      .filter(spot => spot.errors > 0)
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 10);

    const weakWords: WeakWord[] = Object.entries(wordErrors)
      .map(([word, data]) => ({
        word,
        errors: data.errors,
        attempts: data.attempts,
        avgTime: data.totalTime / data.attempts
      }))
      .filter(spot => spot.errors > 0)
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 10);

    const mostProblematic = weakCharacters[0]?.character || '';
    const suggestion = generateSuggestion(weakCharacters, weakWords);

    const result: WeakSpotAnalysis = {
      weakCharacters,
      weakWords,
      totalErrors: errors,
      mostProblematicKey: mostProblematic,
      improvementSuggestion: suggestion
    };

    setAnalysis(result);
    
    // Save to localStorage for historical tracking
    saveToHistory(result);
    
    return result;
  };

  const generateSuggestion = (chars: WeakSpot[], words: WeakWord[]): string => {
    if (chars.length === 0) return "Great job! No significant weak spots detected.";
    
    const topChar = chars[0].character;
    const topWord = words[0]?.word;
    
    if (chars[0].errors > 5) {
      return `Focus on practicing the '${topChar}' key. Try typing exercises with this character repeatedly.`;
    } else if (topWord && words[0].errors > 3) {
      return `Practice typing "${topWord}" slowly and accurately. This word is causing most errors.`;
    } else {
      return `Overall good performance! Minor improvements on '${topChar}' will boost accuracy.`;
    }
  };

  const saveToHistory = (analysis: WeakSpotAnalysis) => {
    const history = JSON.parse(localStorage.getItem('weakSpotHistory') || '[]');
    history.push({
      timestamp: Date.now(),
      analysis
    });
    
    // Keep only last 30 analyses
    if (history.length > 30) {
      history.shift();
    }
    
    localStorage.setItem('weakSpotHistory', JSON.stringify(history));
  };

  const getWeakSpotHistory = () => {
    return JSON.parse(localStorage.getItem('weakSpotHistory') || '[]');
  };

  const getCustomPracticeText = (): string => {
    if (!analysis || analysis.weakWords.length === 0) {
      return "Practice makes perfect! Keep typing to identify your weak spots.";
    }

    // Generate practice text focused on weak words
    const weakWords = analysis.weakWords.slice(0, 5).map(w => w.word);
    const practiceText = weakWords.join(' ').repeat(3);
    
    return practiceText;
  };

  return {
    analysis,
    analyzeTypingData,
    getWeakSpotHistory,
    getCustomPracticeText
  };
};
