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

export type Difficulty = 'easy' | 'medium' | 'hard' | 'pro' | 'custom';
export type TestMode = 'words' | 'sentences' | 'paragraph' | 'numbers' | 'quotes' | 'programming' | 'infinite';
export type Language = 'english' | 'hinglish';

interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeTaken: number;
  date: string;
  cpm: number;
  grossWpm: number;
  netWpm: number;
}

interface UseTypingTestReturn {
  promptText: string;
  inputValue: string;
  currentTime: number;
  totalTime: number;
  wpm: number;
  accuracy: number;
  errors: number;
  cpm: number;
  grossWpm: number;
  netWpm: number;
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
  keystrokeRecords: { char: string; timestamp: number; index: number }[];
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
  setPromptText: (text: string) => void;
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

  // Keystroke latency tracking (performance.now())
  const lastKeyTimeRef = useRef<number>(0);
  const keystrokeRecordsRef = useRef<{ char: string; timestamp: number; index: number }[]>([]);
  const testStartPerfTimeRef = useRef<number>(0);

  // Batch key stats buffer — flushed every 5s or on test end (not per keypress)
  const keyStatsBatchRef = useRef<{ key: string; latency: number; correct: boolean }[]>([]);
  const batchFlushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    
    // Get word bank based on language and difficulty
    const getWordBank = () => {
      let diffKey: 'easy' | 'medium' | 'hard' = 'easy';
      
      if (diff === 'easy') diffKey = 'easy';
      else if (diff === 'medium') diffKey = 'medium';
      else if (diff === 'hard' || diff === 'pro' || diff === 'custom') diffKey = 'hard';
      
      switch (lang) {
        case 'hinglish': return hinglishWordBanks[diffKey] || hinglishWordBanks.easy;
        default: return wordBanks[diffKey] || wordBanks.easy;
      }
    };
    
    // Generate based on test mode
    switch (mode) {
      case 'numbers': {
        // DIFFICULTY-BASED NUMBER GENERATION
        const count = Math.ceil(time / 3);
        let text = '';
        
        if (diff === 'easy') {
          // Easy: Simple single-digit and double-digit numbers
          const simpleNumbers = ['0123456789', '1234567890', '10 20 30 40 50', '11 22 33 44 55'];
          for (let i = 0; i < count; i++) {
            const seq = simpleNumbers[Math.floor(Math.random() * simpleNumbers.length)];
            text += (i === 0 ? '' : ' ') + seq;
          }
        } else if (diff === 'medium') {
          // Medium: Multi-digit numbers and basic decimals
          const mediumNumbers = ['100 200 300 400 500', '1.5 2.5 3.5 4.5 5.5', '12345 67890', '101 202 303 404'];
          for (let i = 0; i < count; i++) {
            const seq = mediumNumbers[Math.floor(Math.random() * mediumNumbers.length)];
            text += (i === 0 ? '' : ' ') + seq;
          }
        } else if (diff === 'hard') {
          // Hard: Complex numbers with decimals and patterns
          const hardNumbers = [
            '1.41421 2.71828 3.14159',
            '11223344556677889900',
            '1000 2000 3000 4000 5000',
            '98765 43210 55555 99999'
          ];
          for (let i = 0; i < count; i++) {
            const seq = hardNumbers[Math.floor(Math.random() * hardNumbers.length)];
            text += (i === 0 ? '' : ' ') + seq;
          }
        } else if (diff === 'pro') {
          // Pro: Numbers with special characters, operators, symbols
          const proNumbers = [
            '$1,234.56 €987.65 ¥543.21',
            '192.168.1.1 255.255.0.0',
            '#FF5733 #C70039 #900C3F',
            '50% 75% 100% 33.33%',
            'π ≈ 3.14159 | e ≈ 2.71828',
            '1024 + 2048 = 3072',
            'v3.1.4 @2026 &copy;',
            '1 << 10 === 1024'
          ];
          for (let i = 0; i < count; i++) {
            const seq = proNumbers[Math.floor(Math.random() * proNumbers.length)];
            text += (i === 0 ? '' : ' ') + seq;
          }
        }
        
        return text || numberSequences.join(' ');
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

        // DIFFICULTY-BASED PROGRAMMING CODE
        const minSnippets = 4;
        const count = Math.max(minSnippets, Math.ceil(time / 5));
        
        let codeSnippets: string[] = [];
        
        if (diff === 'easy') {
          // Easy: Simple functions and basic syntax
          codeSnippets = [
            "function add(a, b) { return a + b; }",
            "const name = 'John';",
            "console.log('Hello World');",
            "let count = 0;",
            "if (x > 0) { return true; }",
            "for (let i = 0; i < 5; i++) { }",
            "const arr = [1, 2, 3];",
            "return sum;"
          ];
        } else if (diff === 'medium') {
          // Medium: Moderate complexity with arrays, objects
          codeSnippets = [
            "const array = [1, 2, 3, 4, 5]; array.map(x => x * 2);",
            "const obj = { key: 'value', method() { return this.key; } }",
            "function fetchData() { return fetch(url).then(res => res.json()); }",
            "const [state, setState] = useState(initialValue);",
            "if (condition) { doSomething(); } else { doSomethingElse(); }",
            "class User { constructor(name) { this.name = name; } }",
            "const result = data.filter(item => item.active);",
            "localStorage.setItem('key', JSON.stringify(value));"
          ];
        } else if (diff === 'hard') {
          // Hard: Complex code with async, types, advanced patterns
          codeSnippets = [
            "async function fetchData() { const res = await fetch(url); return res.json(); }",
            "interface Props { title: string; onClick: () => void; optional?: boolean; }",
            "const result = await Promise.all([promise1, promise2, promise3]);",
            "useEffect(() => { const cleanup = subscribe(); return () => cleanup(); }, [dependency]);",
            "export default class Component extends React.PureComponent<Props, State> {}",
            "type Status = 'pending' | 'success' | 'error' | 'idle';",
            "const debounce = (fn, delay) => { let timer; return (...args) => { clearTimeout(timer); }; };",
            "try { await riskyOperation(); } catch (error) { handleError(error); } finally { cleanup(); }"
          ];
        } else if (diff === 'pro') {
          // Pro: Advanced code with special chars, complex syntax
          codeSnippets = [
            "const user_id = 1024;",
            "async function fetchData() {}",
            'async function getData() { return await api.get("/users"); }',
            'const handleClick = (e: Event) => { e.preventDefault(); };',
            'interface User { id: number; name: string; email?: string; }',
            'export default class Component extends React.PureComponent<Props> {}',
            'useEffect(() => { fetchData().then(res => setData(res)); }, []);',
            'let result = arr.filter(x => x > 0).map(x => x * 2);',
            'const [state, setState] = useState<number>(0);',
            'try { await db.query("SELECT * FROM users WHERE id = $1", [userId]); } catch (err) { log(err); }',
            '$%#@! version 3.1',
            'TypeScript (v5.0+) offers type-safety & flexibility.'
          ];
        }
        
        const shuffled = [...codeSnippets].sort(() => Math.random() - 0.5);
        const allSnippets = [...shuffled, ...shuffled];
        return allSnippets.slice(0, count).join(' ');
      }
      
      case 'sentences': {
        // DIFFICULTY-BASED SENTENCE GENERATION
        const sentences = sentenceTemplates[lang] || sentenceTemplates.english;
        const minSentences = 5;
        const baseCount = Math.max(minSentences, Math.ceil(time / 10));
        
        let selectedSentences: string[] = [];
        
        if (diff === 'easy') {
          // Easy: Simple, short sentences
          const simpleSentences = sentences.filter(s => s.split(' ').length <= 8);
          selectedSentences = simpleSentences.length > 0 ? simpleSentences : sentences.slice(0, 5);
        } else if (diff === 'medium') {
          // Medium: All available sentences
          selectedSentences = [...sentences];
        } else if (diff === 'hard') {
          // Hard: Complex sentences + Numbers mixed in
          const complexSentences = sentences.filter(s => s.split(' ').length > 8);
          selectedSentences = complexSentences.length > 0 ? complexSentences : sentences;
          // Add numbers (20% of content)
          const numberSentences = [
            '12345 67890 98765 43210',
            '100 200 300 400 500',
            '1.41421 2.71828 3.14159'
          ];
          selectedSentences.push(...numberSentences);
        } else if (diff === 'pro') {
          // Pro: Mix sentences with code, special chars, numbers
          selectedSentences = [...sentences];
          selectedSentences.push(
            'const user_id = 1024;',
            '$%#@! 2026 version 3.1',
            '$1,234.56 €987.65 ¥543.21',
            '"Success isn\'t final; failure isn\'t fatal!"',
            'TypeScript (v5.0+) offers type-safety & flexibility.',
            '192.168.1.1 255.255.0.0',
            'async function fetchData() {}'
          );
        }
        
        const shuffled = [...selectedSentences].sort(() => Math.random() - 0.5);
        const allSentences = [...shuffled, ...shuffled];
        return allSentences.slice(0, baseCount).join(' ');
      }
      
      case 'paragraph': {
        // DIFFICULTY-BASED PARAGRAPH GENERATION
        const paragraphs = paragraphTemplates[lang] || paragraphTemplates.english;
        const minParagraphs = 2;
        const baseCount = Math.max(minParagraphs, Math.ceil(time / 60));
        
        let content: string[] = [];
        
        if (diff === 'easy') {
          // Easy: First 1-2 sentences from each paragraph
          content = paragraphs.map(p => {
            const sentences = p.split('. ');
            return sentences.slice(0, 2).join('. ') + '.';
          });
        } else if (diff === 'medium') {
          // Medium: Full paragraphs
          content = [...paragraphs];
        } else if (diff === 'hard') {
          // Hard: Full paragraphs + complex sentences + Numbers
          content = paragraphs.map(p => {
            if (lang === 'english') {
              return p + ' Furthermore, mastering this skill requires dedication, consistent practice, and attention to proper technique. Studies show that practicing 15-30 minutes daily can improve WPM by 10-20 points within 30-60 days.';
            }
            return p;
          });
        } else if (diff === 'pro') {
          // Pro: Paragraphs with code, special chars, numbers mixed in
          content = paragraphs.map(p => {
            if (lang === 'english') {
              return p + ' const user_id = 1024; async function fetchData() {} $%#@! TypeScript (v5.0+) offers type-safety & flexibility. Studies show 15-30 minutes daily improves WPM by 10-20 points.';
            }
            return p;
          });
        }
        
        const shuffled = [...content].sort(() => Math.random() - 0.5);
        const allParagraphs = [...shuffled, ...shuffled];
        return allParagraphs.slice(0, baseCount).join(' ');
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

        // DIFFICULTY-BASED QUOTE GENERATION (English only)
        const minQuotes = 3;
        const baseCount = Math.max(minQuotes, Math.ceil(time / 15));
        
        let selectedQuotes: string[] = [];
        
        if (diff === 'easy') {
          // Easy: Shorter, simpler quotes
          selectedQuotes = FALLBACK_QUOTES.filter(q => q.split(' ').length <= 12);
          if (selectedQuotes.length === 0) selectedQuotes = FALLBACK_QUOTES.slice(0, 5);
        } else if (diff === 'medium') {
          // Medium: All quotes
          selectedQuotes = [...FALLBACK_QUOTES];
        } else if (diff === 'hard') {
          // Hard: Longer complex quotes + Numbers
          selectedQuotes = FALLBACK_QUOTES.filter(q => q.split(' ').length > 12);
          if (selectedQuotes.length === 0) selectedQuotes = [...FALLBACK_QUOTES];
          // Add number sequences
          selectedQuotes.push(
            '1234567890 0987654321',
            '100 200 300 400 500 600',
            '3.14159 2.71828 1.41421'
          );
        } else if (diff === 'pro') {
          // Pro: Quotes with code, special chars, numbers
          selectedQuotes = [...FALLBACK_QUOTES];
          selectedQuotes.push(
            'const user_id = 1024;',
            'async function fetchData() {}',
            '$%#@! 2026 version 3.1',
            '$1,234.56 €987.65',
            '192.168.1.1 255.255.0.0',
            '"Success isn\'t final!"',
            'TypeScript (v5.0+) & JavaScript'
          );
        }
        
        const shuffled = [...selectedQuotes].sort(() => Math.random() - 0.5);
        const allQuotes = [...shuffled, ...shuffled];
        return allQuotes.slice(0, baseCount).join(' ');
      }
      
      case 'words':
      default: {
        // DIFFICULTY-BASED WORD GENERATION
        // Easy: Common daily words (the, be, to, of, and)
        // Medium: Technical/moderate words (technology, asynchronous, implementation)
        // Hard: Long complex words + Numbers mixed in
        // Pro: Advanced mixed content (handled above)
        const words = getWordBank();
        const minWords = 80;
        const wordsNeeded = Math.max(minWords, Math.ceil((time / 60) * 50));
        let text = '';
        
        if (diff === 'hard') {
          // Hard: Mix long words with numbers (70% words, 30% numbers)
          for (let i = 0; i < wordsNeeded; i++) {
            if (Math.random() < 0.3) {
              // Add numbers
              const numberSeqs = [
                '1234567890', '100 200 300', '1.41421 3.14159', 
                '12345 67890', '98765 43210'
              ];
              const randomNum = numberSeqs[Math.floor(Math.random() * numberSeqs.length)];
              text += (i === 0 ? '' : ' ') + randomNum;
            } else {
              // Add long complex words
              const randomWord = words[Math.floor(Math.random() * words.length)];
              text += (i === 0 ? '' : ' ') + randomWord;
            }
          }
        } else if (diff === 'pro') {
          // Pro: Mix code, special chars, numbers, complex words
          const proContent = [
            'const user_id = 1024;',
            'async function fetchData() {}',
            '$%#@! 2026 version 3.1',
            '$1,234.56 €987.65',
            '192.168.1.1',
            '#FF5733',
            '50% 75% 100%',
            '"Success isn\'t final!"',
            'TypeScript (v5.0+)',
            'const handleClick = (e: Event) => {}',
            'π ≈ 3.14159'
          ];
          for (let i = 0; i < wordsNeeded; i++) {
            if (Math.random() < 0.4) {
              // 40% pro content
              const randomPro = proContent[Math.floor(Math.random() * proContent.length)];
              text += (i === 0 ? '' : ' ') + randomPro;
            } else {
              // 60% hard words
              const randomWord = words[Math.floor(Math.random() * words.length)];
              text += (i === 0 ? '' : ' ') + randomWord;
            }
          }
        } else {
          // Easy & Medium: Words only
          for (let i = 0; i < wordsNeeded; i++) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            text += (i === 0 ? '' : ' ') + randomWord;
          }
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
    // ALWAYS use generatePrompt to respect difficulty levels
    // APIs don't filter by difficulty, so they return random/complex words
    return generatePrompt(diff, time, customText, mode, lang);
  }, [customText, generatePrompt]);

  // Load more text (for infinite typing - enhanced per mode)
  const loadMoreText = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    
    try {
      // For custom mode, repeat the user's custom text
      if (difficulty === 'custom' && customText.trim()) {
        setPromptText(prev => prev + ' ' + customText.trim());
        isLoadingRef.current = false;
        return;
      }

      const nextText = await fetchModeText(testMode, language, difficulty, totalTime);
      setPromptText(prev => prev + " " + nextText);
      lastLoadPositionRef.current = (promptTextRef.current + " " + nextText).length;
    } catch {
      // For custom mode fallback, repeat custom text
      if (difficulty === 'custom' && customText.trim()) {
        setPromptText(prev => prev + ' ' + customText.trim());
      } else {
        const fallbackText = await fetchQuotesFromAPI();
        setPromptText(prev => prev + " " + fallbackText);
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [fetchModeText, fetchQuotesFromAPI, testMode, language, difficulty, totalTime, customText]);


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
      return { wpm: 0, accuracy: 0, errors: 0, cpm: 0, grossWpm: 0, netWpm: 0 };
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
    
    // CPM: Characters Per Minute (all keystrokes)
    const cpm = Math.round(totalChars / minutes) || 0;
    // Gross WPM: Standard formula (total chars / 5) / minutes
    const grossWpm = Math.round((totalChars / 5) / minutes) || 0;
    // Net WPM: Only correct characters count (correct chars / 5) / minutes
    const netWpm = Math.round((correctChars / 5) / minutes) || 0;
    
    return { wpm, accuracy, errors, cpm, grossWpm, netWpm };
  }, []);

  // Live stats for display
  const getLiveStats = useCallback(() => {
    if (inputValue.length === 0 || !testStarted) {
      return { wpm: 0, accuracy: 0, errors: 0, cpm: 0, grossWpm: 0, netWpm: 0 };
    }
    
    // Calculate actual elapsed time from start
    const timeElapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    return calculateStats(inputValue, promptText, timeElapsed);
  }, [inputValue, promptText, testStarted, calculateStats]);

  const stats = getLiveStats();
  
  // Calculate elapsed time for display
  const elapsedTime = testStarted ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;

  // Auto-load more text when user has typed 50% of current text (ALL MODES)
  // More aggressive loading to prevent running out of text in challenge modes like Focus Master
  useEffect(() => {
    const shouldAutoLoad = 
      testStarted && 
      inputValue.length > promptText.length * 0.5 && 
      !isLoadingRef.current;
      
    if (shouldAutoLoad) {
      console.log('🔄 Auto-loading more text for current mode...');
      loadMoreText();
    }

    // Emergency: if user has typed 90%+ and still no new text, force load
    const isAlmostDone = testStarted && inputValue.length > promptText.length * 0.9;
    if (isAlmostDone && !isLoadingRef.current) {
      console.log('⚠️ Emergency text load - almost out of text!');
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

      // Track keystroke latency using performance.now()
      const now = performance.now();
      if (lastKeyTimeRef.current > 0) {
        const latency = now - lastKeyTimeRef.current;
        // Buffer per-key stats (latency cap 2000ms, ignore pauses)
        if (latency < 2000 && expectedChar) {
          const isCorrect = typedChar === expectedChar;
          keyStatsBatchRef.current.push({
            key: expectedChar.toLowerCase(),
            latency: Math.round(latency),
            correct: isCorrect
          });
        }
      }
      lastKeyTimeRef.current = now;

      // Record keystroke for ghost replay (only correct characters — Step 11)
      if (typedChar === expectedChar) {
        keystrokeRecordsRef.current.push({
          char: typedChar,
          timestamp: now - testStartPerfTimeRef.current,
          index: value.length - 1
        });
      }
      
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

  const finishTestWithTime = useCallback((timeTaken: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Clamp time to totalTime to prevent display issues
    const displayTime = Math.min(timeTaken, totalTime);
    
    // Play end sound (if enabled)
    try { playSound('end'); } catch (e) { /* ignore if sound unavailable */ }

    setTestStarted(false);
    setTestCompleted(true);
    
    const currentInput = inputValueRef.current;
    const currentPrompt = promptTextRef.current;
    const { wpm, accuracy, errors, cpm, grossWpm, netWpm } = calculateStats(currentInput, currentPrompt, displayTime);
    
    const testDate = new Date().toISOString();
    
    setResult({
      wpm,
      accuracy,
      errors,
      timeTaken: displayTime,
      date: testDate,
      cpm,
      grossWpm,
      netWpm
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
        timeElapsed: displayTime,
        wordsTyped: currentInput.trim().split(/\s+/).length,
        errorsCount: errors,
        weakKeys: weakKeys.slice(0, 10) // Top 10 weak keys
      });

      // Save ghost replay for PB racing (Step 12: minimum 20 chars, 20 seconds)
      if (keystrokeRecordsRef.current.length >= 20 && displayTime >= 20) {
        storageManager.saveGhostReplay({
          keystrokes: keystrokeRecordsRef.current,
          wpm,
          accuracy,
          date: testDate,
          totalTime: displayTime
        });
      }

      storageManager.updatePersonalBests({
        wpm,
        accuracy,
        difficulty: difficulty,
        date: testDate,
        mode: testMode,
        timeElapsed: displayTime,
        wordsTyped: currentInput.trim().split(/\s+/).length,
        errorsCount: errors
      });

      storageManager.updatePerformanceByType({
        mode: testMode,
        wpm,
        accuracy,
        timeElapsed: displayTime
      });
      
    } catch (error) {
      console.error('Error saving test results:', error);
    }

    // Achievement notifications
    const achievements = storageManager.getAchievements();

    // Flush key stats batch to localStorage on test end
    if (keyStatsBatchRef.current.length > 0) {
      storageManager.batchUpdateKeyStats(keyStatsBatchRef.current);
      keyStatsBatchRef.current = [];
    }
    // Clear the 5s flush timer
    if (batchFlushTimerRef.current) {
      clearInterval(batchFlushTimerRef.current);
      batchFlushTimerRef.current = null;
    }
    const newlyUnlocked = achievements.filter((a: any) => 
      a.unlockedAt && new Date(a.unlockedAt).getTime() > Date.now() - 5000
    );
    if (newlyUnlocked.length > 0) {
      console.log('🏆 New achievements unlocked:', newlyUnlocked.map((a: any) => a.name).join(', '));
    }

    const randomMotivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setMotivation(randomMotivation);
  }, [difficulty, testMode, playSound, totalTime]);

  useEffect(() => {
    if (testStarted && currentTime > 0) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            // Finish test with the exact duration selected (totalTime)
            finishTestWithTime(totalTime);
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
  }, [testStarted, totalTime, finishTestWithTime]);

  const startTest = useCallback(() => {
    setTestCompleted(false);
    setInputValueState('');
    setCurrentTime(totalTime);
    setResult(null);
    setMotivation(null);
    
    // Immediately set test ready for instant UI response
    console.log('🎯 Test ready - waiting for first keystroke to start timer');
    setTestReady(true);
    setTestStarted(false); // Timer not started yet
    
    // Reset keystroke tracking for new test
    lastKeyTimeRef.current = 0;
    keystrokeRecordsRef.current = [];
    keyStatsBatchRef.current = [];
    testStartPerfTimeRef.current = performance.now();

    // Start 5-second batch flush interval
    if (batchFlushTimerRef.current) clearInterval(batchFlushTimerRef.current);
    batchFlushTimerRef.current = setInterval(() => {
      if (keyStatsBatchRef.current.length > 0) {
        storageManager.batchUpdateKeyStats(keyStatsBatchRef.current);
        keyStatsBatchRef.current = [];
      }
    }, 5000);
    
    // Load fresh text in background (non-blocking)
    if (difficulty !== 'custom') {
      loadNewPrompt().catch(() => {
        const newPrompt = generatePrompt(difficulty, totalTime, customText, testMode, language);
        setPromptText(newPrompt);
      });
    } else if (!promptText) {
      const newPrompt = generatePrompt(difficulty, totalTime, customText, testMode, language);
      setPromptText(newPrompt);
    }
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
    cpm: stats.cpm,
    grossWpm: stats.grossWpm,
    netWpm: stats.netWpm,
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
    keystrokeRecords: keystrokeRecordsRef.current,
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
    getCharClasses,
    setPromptText
  };
}
