import { useState, useCallback, useRef, useEffect } from 'react';
import { useSound } from '@/contexts/SoundContext';
import { storageManager } from '@/lib/storageManager';
import { 
  wordBanks, 
  hinglishWordBanks, 
  sentenceTemplates, 
  programmingSnippets, 
  numberSequences, 
  paragraphTemplates, 
  motivationalMessages 
} from '@/data/wordBanks';
import { 
  fetchQuotesApi, 
  fetchThreeLinesApi, 
  fetchBaconIpsumApi,
  fetchProgrammingQuotesApi,
  fetchCombinedTextApi,
  fetchRandomWordsApi,
  fetchDatamuseWordsApi,
  fetchNumbersApi,
  fetchInfiniteTextApi,
  fetchQuotableRandomApi,
  fetchWikipediaSummaryApi,
  fetchNumbersTriviaApi,
  fetchProgrammingReadmeApi
} from '@/services/typingTestApi';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';
export type TestMode = 'words' | 'sentences' | 'paragraph' | 'numbers' | 'quotes' | 'programming' | 'infinite';
export type Language = 'english' | 'hinglish';

interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeTaken: number;
  date: string;
}

interface UseTypingTestReturn {
  promptText: string;
  inputValue: string;
  currentTime: number;
  totalTime: number;
  wpm: number;
  accuracy: number;
  errors: number;
  testStarted: boolean;
  testReady: boolean;
  testCompleted: boolean;
  difficulty: Difficulty;
  testMode: TestMode;
  language: Language;
  progress: number;
  result: TestResult | null;
  motivation: { emoji: string; text: string } | null;
  customText: string;
  infiniteMode: boolean;
  setInputValue: (value: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTotalTime: (time: number) => void;
  setCustomText: (text: string) => void;
  setTestMode: (mode: TestMode) => void;
  setLanguage: (lang: Language) => void;
  setInfiniteMode: (enabled: boolean) => void;
  startTest: () => void;
  resetTest: () => void;
  finishTest: () => void;
  loadNewPrompt: () => void;
  getCharClasses: () => { char: string; className: string }[];
}

const FALLBACK_QUOTES = [
  "Practice makes perfect. Typing speed improves with consistency and dedication.",
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
  "Success is not final, failure is not fatal. It is the courage to continue that counts.",
  "Technology is best when it brings people together and helps them achieve their goals.",
  "Every expert was once a beginner. Keep practicing and you will improve your typing skills.",
  "The only way to do great work is to love what you do and never give up on your dreams.",
  "Speed and accuracy come with practice. Focus on accuracy first, then speed will follow.",
  "Learning to type fast is a valuable skill that will benefit you throughout your career.",
];

export function useTypingTest(): UseTypingTestReturn {
  // Initialize with default text to prevent empty state
  const [promptText, setPromptText] = useState(FALLBACK_QUOTES[0] + ' ' + FALLBACK_QUOTES[1] + ' ' + FALLBACK_QUOTES[2]);
  const [inputValue, setInputValueState] = useState('');
  const [currentTime, setCurrentTime] = useState(30);
  const [totalTime, setTotalTimeState] = useState(30);
  const [testStarted, setTestStarted] = useState(false);
  const [testReady, setTestReady] = useState(false); // Ready state after Start Test button clicked
  const [testCompleted, setTestCompleted] = useState(false);
  const [difficulty, setDifficultyState] = useState<Difficulty>('easy');
  const [testMode, setTestMode] = useState<TestMode>('words');
  const [language, setLanguage] = useState<Language>('english');
  const [result, setResult] = useState<TestResult | null>(null);
  const [motivation, setMotivation] = useState<{ emoji: string; text: string } | null>(null);
  const [customText, setCustomText] = useState('');
  const [infiniteMode, setInfiniteMode] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputValueRef = useRef<string>('');
  const promptTextRef = useRef<string>('');
  const isLoadingRef = useRef<boolean>(false);
  const lastLoadPositionRef = useRef<number>(0);

  const { playSound } = useSound();

  // Keep refs in sync
  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  useEffect(() => {
    promptTextRef.current = promptText;
  }, [promptText]);

  // Fetch quotes from API using the new API service
  const fetchQuotesFromAPI = useCallback(async (): Promise<string> => {
    try {
      const result = await fetchQuotesApi(10);
      return result.text;
    } catch (error) {
      console.log("API error, using fallback text");
      // Return random fallback quotes
      const shuffled = [...FALLBACK_QUOTES].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 4).join(" ");
    }
  }, []);

  // Load exactly 3 lines of text for typing test
  const loadThreeLinesText = useCallback(async (): Promise<string> => {
    try {
      const result = await fetchThreeLinesApi();
      return result.fullText;
    } catch (error) {
      console.log("3-lines API error, using fallback");
      const shuffled = [...FALLBACK_QUOTES].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 2).join(" ");
    }
  }, []);

  // Generate text based on mode, difficulty, and language
  const generatePrompt = useCallback((diff: Difficulty, time: number, custom: string, mode: TestMode, lang: Language) => {
    if (diff === 'custom' && custom.trim()) {
      return custom.trim();
    }
    
    // HARD DIFFICULTY: Mix of numbers, sentences, quotes, programming, and paragraphs
    if (diff === 'hard' && mode === 'words') {
      const mixedContent: string[] = [];
      
      // Add numbers (20% of content)
      const numSequences = numberSequences.slice(0, 3);
      mixedContent.push(...numSequences);
      
      // Add sentences (25% of content)
      const sentences = sentenceTemplates[lang] || sentenceTemplates.english;
      const selectedSentences = sentences.slice(0, 3).sort(() => Math.random() - 0.5);
      mixedContent.push(...selectedSentences);
      
      // Add programming snippets (20% of content) - only for English
      if (lang === 'english') {
        const snippets = programmingSnippets.slice(0, 3).sort(() => Math.random() - 0.5);
        mixedContent.push(...snippets);
      }
      
      // Add quotes (20% of content)
      if (lang === 'english') {
        const quotes = FALLBACK_QUOTES.slice(0, 2).sort(() => Math.random() - 0.5);
        mixedContent.push(...quotes);
      } else {
        const moreSentences = sentences.slice(3, 5);
        mixedContent.push(...moreSentences);
      }
      
      // Add paragraph content (15% of content)
      const paragraphs = paragraphTemplates[lang] || paragraphTemplates.english;
      const paragraphSnippet = paragraphs[0] ? paragraphs[0].split('.').slice(0, 2).join('.') + '.' : '';
      if (paragraphSnippet) mixedContent.push(paragraphSnippet);
      
      // Shuffle and join
      const shuffled = mixedContent.sort(() => Math.random() - 0.5);
      return shuffled.join(' ');
    }
    
    // Get word bank based on language and difficulty
    const getWordBank = () => {
      const diffKey = diff === 'custom' || diff === 'hard' ? 'easy' : diff;
      switch (lang) {
        case 'hinglish': return hinglishWordBanks[diffKey] || hinglishWordBanks.easy;
        default: return wordBanks[diffKey] || wordBanks.easy;
      }
    };
    
    // Generate based on test mode
    switch (mode) {
      case 'numbers': {
        // Generate random number sequences
        const sequences = [...numberSequences];
        const count = Math.ceil(time / 3); // More numbers for longer tests
        let text = '';
        for (let i = 0; i < count; i++) {
          const seq = sequences[Math.floor(Math.random() * sequences.length)];
          text += (i === 0 ? '' : ' ') + seq;
        }
        return text;
      }
      
      case 'programming': {
        if (lang !== 'english') {
          const sentences = sentenceTemplates[lang] || sentenceTemplates.english;
          const minSentences = 5;
          const count = Math.max(minSentences, Math.ceil(time / 10));
          const shuffled = [...sentences].sort(() => Math.random() - 0.5);
          const allSentences = [...shuffled, ...shuffled];
          return allSentences.slice(0, count).join(' ');
        }

        // Fallback to static snippets (API called in loadNewPrompt)
        const minSnippets = 4; // Minimum 4 snippets
        const count = Math.max(minSnippets, Math.ceil(time / 5));
        const shuffled = [...programmingSnippets].sort(() => Math.random() - 0.5);
        // Repeat if not enough
        const allSnippets = [...shuffled, ...shuffled];
        return allSnippets.slice(0, count).join(' ');
      }
      
      case 'sentences': {
        // Get sentence templates for the language
        const sentences = sentenceTemplates[lang] || sentenceTemplates.english;
        const minSentences = 5; // Minimum 5 sentences for 3 lines
        const count = Math.max(minSentences, Math.ceil(time / 10)); // One sentence per 10 seconds
        const shuffled = [...sentences].sort(() => Math.random() - 0.5);
        // Repeat if not enough sentences
        const allSentences = [...shuffled, ...shuffled];
        return allSentences.slice(0, count).join(' ');
      }
      
      case 'paragraph': {
        // Get paragraph templates for the language
        const paragraphs = paragraphTemplates[lang] || paragraphTemplates.english;
        const minParagraphs = 2; // Minimum 2 paragraphs
        const count = Math.max(minParagraphs, Math.ceil(time / 60)); // One paragraph per minute
        const shuffled = [...paragraphs].sort(() => Math.random() - 0.5);
        // Repeat if not enough paragraphs
        const allParagraphs = [...shuffled, ...shuffled];
        return allParagraphs.slice(0, count).join(' ');
      }
      
      case 'quotes': {
        if (lang !== 'english') {
          const sentences = sentenceTemplates[lang] || sentenceTemplates.english;
          const minSentences = 5;
          const count = Math.max(minSentences, Math.ceil(time / 10));
          const shuffled = [...sentences].sort(() => Math.random() - 0.5);
          const allSentences = [...shuffled, ...shuffled];
          return allSentences.slice(0, count).join(' ');
        }

        // Return fallback quotes for now (will be replaced by API call)
        const shuffled = [...FALLBACK_QUOTES].sort(() => Math.random() - 0.5);
        const minQuotes = 3; // Minimum 3 quotes
        const count = Math.max(minQuotes, Math.ceil(time / 15)); // One quote per 15 seconds
        const allQuotes = [...shuffled, ...shuffled];
        return allQuotes.slice(0, count).join(' ');
      }
      
      case 'words':
      default: {
        // Generate random words from word bank
        const words = getWordBank();
        // Ensure minimum words for at least 3 lines (minimum 80 words)
        const minWords = 80;
        const wordsNeeded = Math.max(minWords, Math.ceil((time / 60) * 50)); // 50 words per minute, min 80
        let text = '';
        
        for (let i = 0; i < wordsNeeded; i++) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          text += (i === 0 ? '' : ' ') + randomWord;
        }
        return text;
      }
    }
  }, []);

  const fetchModeText = useCallback(async (
    mode: TestMode,
    lang: Language,
    diff: Difficulty,
    time: number
  ): Promise<string> => {
    const ensureMinWords = async (text: string, minWords: number, loader: () => Promise<string>) => {
      const wordCount = text.split(' ').filter(w => w).length;
      if (wordCount >= minWords) return text;
      const extra = await loader();
      return `${text} ${extra}`.trim();
    };

    const isEnglish = lang === 'english';

    if (!isEnglish) {
      return generatePrompt(diff, time, customText, mode, lang);
    }

    switch (mode) {
      case 'words': {
        if (diff === 'hard') {
          const result = await fetchDatamuseWordsApi('hard', 200);
          return ensureMinWords(result.text, 80, async () => {
            const more = await fetchDatamuseWordsApi('hard', 200);
            return more.text;
          });
        }
        const result = await fetchRandomWordsApi(200);
        return ensureMinWords(result.text, 80, async () => {
          const more = await fetchRandomWordsApi(200);
          return more.text;
        });
      }
      case 'sentences': {
        const result = await fetchQuotableRandomApi(80, 200);
        return ensureMinWords(result.text, 60, async () => {
          const more = await fetchQuotableRandomApi(80, 200);
          return more.text;
        });
      }
      case 'paragraph': {
        const result = await fetchWikipediaSummaryApi();
        return ensureMinWords(result.text, 80, async () => {
          const more = await fetchWikipediaSummaryApi();
          return more.text;
        });
      }
      case 'numbers': {
        const result = await fetchNumbersApi(5);
        return ensureMinWords(result.text, 40, async () => {
          const more = await fetchNumbersApi(5);
          return more.text;
        });
      }
      case 'quotes': {
        const result = await fetchQuotableRandomApi(150, 350);
        return ensureMinWords(result.text, 60, async () => {
          const more = await fetchQuotableRandomApi(150, 350);
          return more.text;
        });
      }
      case 'programming': {
        const result = await fetchProgrammingReadmeApi();
        return ensureMinWords(result.text, 80, async () => {
          const more = await fetchProgrammingReadmeApi();
          return more.text;
        });
      }
      case 'infinite':
      default: {
        const result = await fetchInfiniteTextApi();
        return ensureMinWords(result.text, 80, async () => {
          const more = await fetchInfiniteTextApi();
          return more.text;
        });
      }
    }
  }, [customText, generatePrompt]);

  // Load more text (for infinite typing - enhanced per mode)
  const loadMoreText = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    
    try {
      const nextText = await fetchModeText(testMode, language, difficulty, totalTime);
      setPromptText(prev => prev + " " + nextText);
      lastLoadPositionRef.current = (promptTextRef.current + " " + nextText).length;
    } catch {
      const fallbackText = await fetchQuotesFromAPI();
      setPromptText(prev => prev + " " + fallbackText);
    } finally {
      isLoadingRef.current = false;
    }
  }, [fetchModeText, fetchQuotesFromAPI, testMode, language, difficulty, totalTime]);


  const loadNewPrompt = useCallback(async () => {
    if (difficulty === 'custom' && customText.trim()) {
      setPromptText(customText.trim());
      return;
    }
    
    try {
      const apiText = await fetchModeText(testMode, language, difficulty, totalTime);
      if (apiText && apiText.trim().length > 0) {
        setPromptText(apiText);
        lastLoadPositionRef.current = apiText.length;
      } else {
        const newPrompt = generatePrompt(difficulty, Math.max(totalTime, 60), customText, testMode, language);
        setPromptText(newPrompt);
      }
    } catch (error) {
      console.error('Error loading prompt:', error);
      // Fallback to generated text with minimum words
      const newPrompt = generatePrompt(difficulty, Math.max(totalTime, 60), customText, testMode, language);
      setPromptText(newPrompt);
    }
  }, [difficulty, totalTime, customText, testMode, language, generatePrompt, fetchModeText]);

  // Load prompt on mount and when dependencies change
  useEffect(() => {
    console.log('Loading prompt for mode:', testMode, 'difficulty:', difficulty);
    loadNewPrompt();
  }, [loadNewPrompt]);

  // CRITICAL: Ensure text is never empty - add validation
  useEffect(() => {
    if (!promptText || promptText.trim().length === 0) {
      console.warn('Empty prompt detected! Loading default text...');
      const defaultText = generatePrompt(difficulty, 60, '', 'words', language);
      if (defaultText && defaultText.length > 0) {
        setPromptText(defaultText);
        console.log('Default text loaded:', defaultText.substring(0, 50) + '...');
      }
    } else {
      console.log('Prompt text loaded successfully. Length:', promptText.length, 'Words:', promptText.split(' ').length);
    }
  }, [promptText, difficulty, language, generatePrompt]);

  const calculateStats = useCallback((input: string, prompt: string, timeElapsed: number) => {
    if (input.length === 0) {
      return { wpm: 0, accuracy: 0, errors: 0 };
    }
    
    let errors = 0;
    let correctChars = 0;
    
    for (let i = 0; i < input.length; i++) {
      if (input[i] === prompt[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }
    
    const totalChars = input.length;
    const rawAccuracy = Math.round((correctChars / totalChars) * 100);
    const accuracy = Math.min(100, Math.max(0, rawAccuracy));
    
    const minutes = Math.max(timeElapsed, 1) / 60;
    const words = input.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wpm = Math.round(words / minutes) || 0;
    
    return { wpm, accuracy, errors };
  }, []);

  // Live stats for display
  const getLiveStats = useCallback(() => {
    if (inputValue.length === 0 || !testStarted) {
      return { wpm: 0, accuracy: 0, errors: 0 };
    }
    
    // Calculate actual elapsed time from start
    const timeElapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    return calculateStats(inputValue, promptText, timeElapsed);
  }, [inputValue, promptText, testStarted, calculateStats]);

  const stats = getLiveStats();
  
  // Calculate elapsed time for display
  const elapsedTime = testStarted ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;

  // Auto-load more text when user has typed 70% of current text (ALL MODES)
  useEffect(() => {
    const shouldAutoLoad = 
      testStarted && 
      inputValue.length > promptText.length * 0.7 && 
      !isLoadingRef.current;
      
    if (shouldAutoLoad) {
      console.log('🔄 Auto-loading more text for current mode...');
      loadMoreText();
    }
  }, [inputValue.length, promptText.length, testStarted, loadMoreText]);

  const autoStartedRef = useRef<boolean>(false);
  const lastInputLengthRef = useRef<number>(0);

  // Set input value - timer starts on first keystroke after Start Test clicked
  const setInputValue = useCallback((value: string) => {
    // Start timer on first keystroke ONLY if test is ready (Start Test clicked)
    if (testReady && !testStarted && !testCompleted && value.length > 0 && inputValue.length === 0) {
      console.log('⏱️ Starting timer on first keystroke');
      setTestStarted(true);
      setTestReady(false);
      setCurrentTime(totalTime);
      setResult(null);
      setMotivation(null);
      startTimeRef.current = Date.now();
      
      // Play start sound (user gesture)
      try { playSound('start'); } catch (e) { /* ignore */ }
    }
    
    // Play sound when user types (only on character addition, not deletion)
    if (value.length > lastInputLengthRef.current) {
      const typedChar = value[value.length - 1];
      const expectedChar = promptText[value.length - 1];
      
      try {
        if (typedChar !== expectedChar) {
          console.log('❌ Error - Wrong character typed:', typedChar, 'expected:', expectedChar);
          playSound('error'); // Wrong character - ALWAYS PLAY
        }
      } catch (e) { 
        console.error('Sound error:', e);
      }
    }
    
    lastInputLengthRef.current = value.length;
    setInputValueState(value);
  }, [testReady, testStarted, testCompleted, inputValue, totalTime, promptText, playSound]);

  useEffect(() => {
    if (testStarted && currentTime > 0) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            // Trigger finish with actual elapsed time
            const actualTimeElapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
            finishTestWithTime(actualTimeElapsed);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testStarted]);

  const finishTestWithTime = useCallback((timeTaken: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Play end sound (if enabled)
    try { playSound('end'); } catch (e) { /* ignore if sound unavailable */ }

    setTestStarted(false);
    setTestCompleted(true);
    
    const currentInput = inputValueRef.current;
    const currentPrompt = promptTextRef.current;
    const { wpm, accuracy, errors } = calculateStats(currentInput, currentPrompt, timeTaken);
    
    const testDate = new Date().toISOString();
    
    setResult({
      wpm,
      accuracy,
      errors,
      timeTaken,
      date: testDate
    });

    // Save to localStorage and trigger achievements
    try {
      const weakKeys: string[] = [];
      for (let i = 0; i < Math.min(currentInput.length, currentPrompt.length); i++) {
        if (currentInput[i] !== currentPrompt[i]) {
          weakKeys.push(currentPrompt[i]);
        }
      }

      storageManager.addTestResult({
        wpm,
        accuracy,
        difficulty: difficulty,
        date: testDate,
        mode: testMode,
        timeElapsed: timeTaken,
        wordsTyped: currentInput.trim().split(/\s+/).length,
        errorsCount: errors,
        weakKeys: weakKeys.slice(0, 10) // Top 10 weak keys
      });

      storageManager.updatePersonalBests({
        wpm,
        accuracy,
        difficulty: difficulty,
        date: testDate,
        mode: testMode,
        timeElapsed: timeTaken,
        wordsTyped: currentInput.trim().split(/\s+/).length,
        errorsCount: errors
      });

      storageManager.updatePerformanceByType({
        wpm,
        accuracy,
        difficulty: difficulty,
        date: testDate,
        mode: testMode,
        timeElapsed: timeTaken,
        wordsTyped: currentInput.trim().split(/\s+/).length,
        errorsCount: errors
      });
    } catch (e) {
      console.log('Storage update failed:', e);
    }
    
    // Emit event to notify other components (e.g., Analytics) that test completed
    window.dispatchEvent(new Event('test-completed'));
    
    const randomMotivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setMotivation(randomMotivation);
  }, [calculateStats, difficulty, testMode]);

  const startTest = useCallback(async () => {
    setTestCompleted(false);
    setInputValueState('');
    setCurrentTime(totalTime);
    setResult(null);
    setMotivation(null);
    
    // Load fresh text when starting
    if (difficulty !== 'custom') {
      try {
        await loadNewPrompt();
      } catch {
        const newPrompt = generatePrompt(difficulty, totalTime, customText, testMode, language);
        setPromptText(newPrompt);
      }
    } else if (!promptText) {
      const newPrompt = generatePrompt(difficulty, totalTime, customText, testMode, language);
      setPromptText(newPrompt);
    }

    // Set test ready - timer will start on first keystroke
    console.log('🎯 Test ready - waiting for first keystroke to start timer');
    setTestReady(true);
    setTestStarted(false); // Timer not started yet
  }, [totalTime, difficulty, customText, testMode, language, generatePrompt, promptText, loadNewPrompt]);

  const resetTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTestReady(false);
    setTestStarted(false);
    setTestCompleted(false);
    setInputValueState('');
    setCurrentTime(totalTime);
    setResult(null);
    setMotivation(null);
    loadNewPrompt();
  }, [totalTime, loadNewPrompt]);

  const finishTest = useCallback(() => {
    const actualTimeElapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    finishTestWithTime(actualTimeElapsed);
  }, [finishTestWithTime]);

  const setTotalTime = useCallback((time: number) => {
    setTotalTimeState(time);
    setCurrentTime(time);
  }, []);

  const setDifficulty = useCallback((diff: Difficulty) => {
    setDifficultyState(diff);
  }, []);

  const getCharClasses = useCallback(() => {
    return promptText.split('').map((char, index) => {
      let className = 'char';
      
      if (index < inputValue.length) {
        if (inputValue[index] === char) {
          className += ' correct';
        } else {
          className += ' incorrect';
        }
      } else if (index === inputValue.length) {
        className += ' current';
      }
      
      return { char, className };
    });
  }, [promptText, inputValue]);

  const progress = testStarted ? ((totalTime - currentTime) / totalTime) * 100 : 0;

  return {
    promptText,
    inputValue,
    currentTime: elapsedTime, // Return elapsed time for display (counts up from 0)
    totalTime,
    wpm: stats.wpm,
    accuracy: stats.accuracy,
    errors: stats.errors,
    testStarted,
    testReady,
    testCompleted,
    difficulty,
    testMode,
    language,
    progress,
    result,
    motivation,
    customText,
    infiniteMode,
    setInputValue,
    setDifficulty,
    setTotalTime,
    setCustomText,
    setTestMode,
    setLanguage,
    setInfiniteMode,
    startTest,
    resetTest,
    finishTest,
    loadNewPrompt,
    getCharClasses
  };
}
