import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/typing/Header';
import PageHeader from '@/components/typing/PageHeader';
import Options from '@/components/typing/Options';
import UnifiedTypingBox from '@/components/typing/UnifiedTypingBox';
import ProgressBar from '@/components/typing/ProgressBar';
import ActionButtons from '@/components/typing/ActionButtons';
import ResultDisplay from '@/components/typing/ResultDisplay';
import Footer from '@/components/typing/Footer';
import DailyChallenge from '@/components/DailyChallenge';
import DynamicBackground from '@/components/DynamicBackground';
import ChallengeToast from '@/components/ChallengeToast';
import PersonalBestCard from '@/components/PersonalBestCard';
import AchievementBadgesPreview from '@/components/AchievementBadgesPreview';
import { ChallengeSettings, defaultChallengeSettings } from '@/components/typing/ChallengeDropdown';
import { useTypingTest } from '@/hooks/useTypingTest';
import { useSound } from '@/contexts/SoundContext';
import { useChallengeMode } from '@/hooks/useChallengeMode';
import { useGhostRacing } from '@/hooks/useGhostRacing';
import { usePromptCrafting } from '@/hooks/usePromptCrafting';
import { usePodcastMode } from '@/hooks/usePodcastMode';

const Index = () => {
  const {
    promptText,
    inputValue,
    currentTime,
    totalTime,
    wpm,
    accuracy,
    errors,
    cpm,
    grossWpm,
    netWpm,
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
    setInputValue,
    setDifficulty,
    setTotalTime,
    setCustomText,
    setTestMode,
    setLanguage,
    startTest,
    resetTest,
    finishTest,
    loadNewPrompt,
    getCharClasses,
    keystrokeRecords,
    setPromptText
  } = useTypingTest();

  const { playSound } = useSound();

  // Display mode toggles
  const [highlightWord, setHighlightWord] = useState(false);

  // Challenge modes state
  const [challengeSettings, setChallengeSettings] = useState<ChallengeSettings>(defaultChallengeSettings);

  // Toast notification state
  const [toast, setToast] = useState<{message: string; type: 'error' | 'success' | 'warning'} | null>(null);

  // Simulated active users count for post-test remark banner
  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);

  // Live WPM sparkline history (last 15 data points)
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestWpmRef = useRef(0);

  // Keep latest WPM in ref so interval always reads current value
  useEffect(() => {
    latestWpmRef.current = wpm;
  }, [wpm]);

  // Track WPM every 2 seconds during test
  useEffect(() => {
    if (testStarted && !testCompleted) {
      setWpmHistory([]);
      wpmIntervalRef.current = setInterval(() => {
        setWpmHistory(prev => {
          const next = [...prev, latestWpmRef.current];
          return next.length > 15 ? next.slice(-15) : next;
        });
      }, 2000);
    } else {
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
      wpmIntervalRef.current = null;
    }
    return () => { 
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current);
        wpmIntervalRef.current = null;
      }
    };
  }, [testStarted, testCompleted]);

  // Calculate correct streak (consecutive correct chars)
  const correctStreak = useMemo(() => {
    if (!inputValue || !promptText) return 0;
    let streak = 0;
    for (let i = inputValue.length - 1; i >= 0; i--) {
      if (inputValue[i] === promptText[i]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [inputValue, promptText]);

  // Performance badge based on live WPM
  const performanceBadge = useMemo(() => {
    if (wpm >= 80) return { label: 'Master', emoji: '🏆', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' };
    if (wpm >= 60) return { label: 'Pro', emoji: '🚀', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' };
    if (wpm >= 40) return { label: 'Fast', emoji: '⚡', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' };
    if (wpm >= 20) return { label: 'Learning', emoji: '📈', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' };
    return { label: 'Beginner', emoji: '🌱', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' };
  }, [wpm]);

  // Real-time motivation message
  const liveMotivation = useMemo(() => {
    if (accuracy >= 98 && wpm >= 60) return { text: 'Perfect flow! 🔥', color: 'text-yellow-400' };
    if (accuracy >= 95 && wpm >= 40) return { text: 'Great accuracy! Keep it up!', color: 'text-green-400' };
    if (wpm >= 70) return { text: 'Blazing fast! Watch accuracy!', color: 'text-cyan-400' };
    if (wpm >= 50) return { text: 'Good speed! Stay focused!', color: 'text-blue-400' };
    if (accuracy < 80) return { text: 'Slow down, focus on accuracy!', color: 'text-red-400' };
    if (errors > 5) return { text: 'Too many errors! Be careful!', color: 'text-orange-400' };
    if (wpm >= 30) return { text: 'Steady pace, keep going!', color: 'text-emerald-400' };
    return { text: 'Warming up... you got this!', color: 'text-slate-400' };
  }, [wpm, accuracy, errors]);

  // Challenge mode hook integration
  const challengeMode = useChallengeMode({
    settings: challengeSettings,
    testStarted,
    inputValue,
    promptText,
    errors,
    wpm,
    currentTime,
    totalTime,
    playSound,
  });

  // Ghost Racing hook - race against your PB
  const ghostRacing = useGhostRacing({
    enabled: challengeSettings.ghostRacing,
    testStarted,
    testCompleted,
    inputValue,
    promptText,
    wpm,
    timeTaken: currentTime,
  });

  // Prompt Crafting hook
  const promptCrafting = usePromptCrafting();

  // Podcast Mode hook - TTS + blind transcription
  const podcastMode = usePodcastMode({
    enabled: challengeSettings.podcastMode,
    testStarted,
    testCompleted,
    promptText,
    inputValue,
    timeTaken: currentTime,
  });

  // Podcast result state
  const [podcastResult, setPodcastResult] = useState<ReturnType<typeof podcastMode.getResult>>(null);

  // Load podcast challenge when Podcast Mode is enabled
  // setTimeout(0) ensures this runs AFTER useTypingTest's loadNewPrompt so podcast text wins
  useEffect(() => {
    if (challengeSettings.podcastMode && !testStarted && !testCompleted) {
      setTimeout(() => {
        const challenge = podcastMode.loadChallenge();
        if (challenge) {
          setPromptText(challenge.text);
        }
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeSettings.podcastMode, testStarted, testCompleted]);

  // Evaluate podcast result when test completes
  useEffect(() => {
    if (testCompleted && challengeSettings.podcastMode) {
      setPodcastResult(podcastMode.getResult());
    } else if (!testCompleted) {
      setPodcastResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCompleted, challengeSettings.podcastMode, podcastMode.getResult]);

  // Prompt crafting result (evaluated post-test)
  const [promptCraftingResult, setPromptCraftingResult] = useState<ReturnType<typeof promptCrafting.evaluatePrompt> | null>(null);

  // Load prompt template when Prompt Crafting is enabled (new challenge on each restart)
  useEffect(() => {
    if (challengeSettings.promptCrafting && !testStarted && !testCompleted) {
      const template = promptCrafting.getPromptTemplate();
      setPromptText(template);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeSettings.promptCrafting, testStarted, testCompleted]);

  // Evaluate prompt crafting when test completes
  useEffect(() => {
    if (testCompleted && result && challengeSettings.promptCrafting) {
      const evaluation = promptCrafting.evaluatePrompt(inputValue, result.wpm, result.accuracy, result.timeTaken);
      setPromptCraftingResult(evaluation);
    } else if (!testCompleted) {
      setPromptCraftingResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCompleted, result, challengeSettings.promptCrafting]);

  // Apply text transformations for challenges (e.g., Reverse Words)
  const displayPromptText = useMemo(() => {
    return challengeMode.transformPromptText(promptText);
  }, [promptText, challengeMode.transformPromptText]);

  // Show toast with sound
  const showChallengeToast = useCallback((message: string, type: 'error' | 'success' | 'warning') => {
    setToast({ message, type });
    if (type === 'error') {
      playSound('challenge-fail');
    } else if (type === 'warning') {
      playSound('challenge-warning');
    } else {
      playSound('challenge-success');
    }
  }, [playSound]);

  // Auto-fail on challenge mode violations
  useEffect(() => {
    if (testStarted) {
      if (challengeMode.hasExceededErrorLimit) {
        finishTest();
        showChallengeToast('❌ Challenge Failed: Too many errors (Last Chance mode)', 'error');
      }
      if (challengeMode.hasHardcoreFailed) {
        finishTest();
        showChallengeToast('💀 HARDCORE FAILED: One mistake = Game Over!', 'error');
      }
      if (challengeMode.isSpeedLockFailed) {
        finishTest();
        showChallengeToast('❌ Challenge Failed: Speed too low - maintain 30+ WPM (Speed Lock mode)', 'error');
      }
    }
  }, [challengeMode.hasExceededErrorLimit, challengeMode.hasHardcoreFailed, challengeMode.isSpeedLockFailed, testStarted, finishTest, showChallengeToast]);

  // Warning sounds for approaching limits
  useEffect(() => {
    if (testStarted && challengeSettings.lastChance && errors === 2) {
      // Warning when at 2 errors (1 error away from failing)
      showChallengeToast('⚠️ Warning: Last error remaining! (Last Chance mode)', 'warning');
    }
  }, [errors, testStarted, challengeSettings.lastChance, showChallengeToast]);

  useEffect(() => {
    if (testStarted && challengeSettings.speedLock && wpm > 0 && wpm < 35 && inputValue.length > 20) {
      // Warning when speed is getting low
      playSound('challenge-warning');
    }
  }, [wpm, testStarted, challengeSettings.speedLock, inputValue.length, playSound]);

  // Success sound when test completes with challenges active
  useEffect(() => {
    if (testCompleted && result) {
      const activeChallenges = Object.values(challengeSettings).filter(Boolean).length;
      if (activeChallenges > 0) {
        playSound('challenge-success');
        showChallengeToast(`🎉 Challenge Completed! ${activeChallenges} active challenge${activeChallenges > 1 ? 's' : ''}`, 'success');
      }
    }
  }, [testCompleted, result, challengeSettings, playSound, showChallengeToast]);

  useEffect(() => {
    if (testCompleted) {
      const base = 120;
      const range = 60;
      setActiveUsersCount(base + Math.floor(Math.random() * (range + 1)));
    } else {
      setActiveUsersCount(null);
    }
  }, [testCompleted]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      if (!testStarted) {
        startTest();
      } else {
        finishTest();
      }
    }
    
    if (e.key === 'Escape' && testStarted) {
      resetTest();
    }
  }, [testStarted, startTest, finishTest, resetTest]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Generate CSS classes for active challenges
  const activeChallengeClasses = Object.entries(challengeSettings)
    .filter(([_, isActive]) => isActive)
    .map(([key]) => `challenge-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`)
    .join(' ');

  return (
    <div className={`min-h-screen min-h-[100dvh] flex flex-col relative overflow-x-hidden ${activeChallengeClasses}`}>
      <DynamicBackground />

      <Header />
      
      <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6 relative z-10">
        
        {/* Hero Section - Only show before test starts */}
        {!testStarted && !testCompleted && (
          <div className="card-gradient p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl mb-2 sm:mb-3 text-center border border-border shadow-lg">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-2">
              Typing Challenge Laboratory 🔬
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3">
              Master speed & accuracy with 20+ challenge modes. Practice daily, track progress & unlock achievements.
            </p>
          </div>
        )}

        {/* Personal Best Stats - Only show before test starts */}
        {!testStarted && !testReady && !testCompleted && (
          <div className="mb-2 sm:mb-3">
            <PersonalBestCard />
          </div>
        )}

        {/* Achievement Badges Preview - Only show before test starts */}
        {!testStarted && !testReady && !testCompleted && (
          <div className="glass p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3">
            <AchievementBadgesPreview />
          </div>
        )}

        {/* Pre-Test Configuration - Only show before test starts */}
        {!testStarted && !testReady && !testCompleted && (
          <div className="glass p-3 sm:p-5 rounded-xl sm:rounded-2xl mb-3 space-y-3">
            <div className="text-center mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 flex items-center justify-center gap-2">
                <span>⚙️</span> Configure Your Test
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Select your settings, then click <span className="text-primary font-semibold">Start Test</span> button below
              </p>
            </div>
            <Options
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              totalTime={totalTime}
              onTimeChange={setTotalTime}
              customText={customText}
              onCustomTextChange={setCustomText}
              testMode={testMode}
              onTestModeChange={setTestMode}
              language={language}
              onLanguageChange={setLanguage}
              challengeSettings={challengeSettings}
              onChallengeChange={setChallengeSettings}
            />
            
            {/* Start Test & Reset Test Buttons - Inside config panel */}
            <ActionButtons 
              testStarted={testStarted}
              testReady={testReady}
              testCompleted={testCompleted}
              onStart={startTest}
              onReset={resetTest}
              onFinish={finishTest}
            />
          </div>
        )}

        {/* Active Test Controls - Show when test is ready or started */}
        {(testStarted || testReady) && (
          <div className="mb-6">
            <ActionButtons 
              testStarted={testStarted}
              testReady={testReady}
              testCompleted={testCompleted}
              onStart={startTest}
              onReset={resetTest}
              onFinish={finishTest}
            />
          </div>
        )}

        {/* Active Challenge Rules - Show when ready or started IF challenges are active */}
        {(testStarted || testReady) && Object.entries(challengeSettings).some(([key, value]) => key !== 'none' && value === true) && (
          <div className="glass p-4 rounded-xl mb-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Active Challenge Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {/* Focus Challenges */}
                  {challengeSettings.noBackspace && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">🚫</span>
                      <span>No Backspace - Cannot delete mistakes</span>
                    </div>
                  )}
                  {challengeSettings.errorFreeze && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500">❄️</span>
                      <span>Error Freeze - Must fix mistakes to continue</span>
                    </div>
                  )}
                  {challengeSettings.lastChance && (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">⚠️</span>
                      <span>Last Chance - Max 3 errors allowed</span>
                    </div>
                  )}
                  {challengeSettings.speedLock && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-500">⚡</span>
                      <span>Speed Lock - Maintain 30+ WPM</span>
                    </div>
                  )}
                  {challengeSettings.pressureMode && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">💥</span>
                      <span>Pressure Mode - Screen shakes on errors</span>
                    </div>
                  )}
                  {challengeSettings.turboEnd && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">🚀</span>
                      <span>Turbo End - 2x speed in final 20%</span>
                    </div>
                  )}
                  {challengeSettings.blindStart && (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500">👁️</span>
                      <span>Blind Start - Text is blurred! Each character reveals as you type it correctly</span>
                    </div>
                  )}
                  {challengeSettings.vanishingWords && (
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-500">✨</span>
                      <span>Vanishing Words - Correctly typed characters slowly fade away (ghost trail remains visible)</span>
                    </div>
                  )}
                  {challengeSettings.memoryMode && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500">🧠</span>
                      <span>Memory Mode - Text disappears after 5 seconds! Memorize and type from memory</span>
                    </div>
                  )}
                  {challengeSettings.focusStrip && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">🎨</span>
                      <span>Focus Strip - Single line focus view</span>
                    </div>
                  )}
                  {challengeSettings.reverseWords && (
                    <div className="flex items-center gap-2">
                      <span className="text-pink-500">🔄</span>
                      <span>Reverse Words - Each word's letters are spelled backwards (e.g., "hello" → "olleh"). Type the reversed spelling!</span>
                    </div>
                  )}
                  {challengeSettings.wordShuffle && (
                    <div className="flex items-center gap-2">
                      <span className="text-teal-500">🎲</span>
                      <span>Word Shuffle - Random word order</span>
                    </div>
                  )}
                  {challengeSettings.mirrorMode && (
                    <div className="flex items-center gap-2">
                      <span className="text-violet-500">🪞</span>
                      <span>Mirror Mode - Mirrored text display</span>
                    </div>
                  )}
                  {challengeSettings.hardcoreMode && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">💀</span>
                      <span>Hardcore Mode - One mistake = Game Over</span>
                    </div>
                  )}
                  {challengeSettings.encryption && (
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-500">🔐</span>
                      <span>Encryption - Text displayed as symbols</span>
                    </div>
                  )}
                  {challengeSettings.movingTarget && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">🎯</span>
                      <span>Moving Target - Text box floats around</span>
                    </div>
                  )}
                  {challengeSettings.staminaMode && (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">💪</span>
                      <span>Stamina Mode - Longer test duration</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompt Crafting Challenge Instruction */}
        {challengeSettings.promptCrafting && promptCrafting.currentChallenge && !testCompleted && (
          <div className="glass p-4 rounded-xl mb-3 border-2 border-teal-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">✍️</span>
                <h3 className="text-sm font-bold text-teal-300">{promptCrafting.currentChallenge.title}</h3>
                <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-[9px] font-semibold text-teal-300 capitalize">
                  {promptCrafting.currentChallenge.difficulty}
                </span>
              </div>
              <div className="flex gap-1">
                {promptCrafting.currentChallenge.requiredKeywords.map((kw, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-muted-foreground">{kw}</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{promptCrafting.currentChallenge.instruction}</p>
          </div>
        )}

        {/* Unified Typing Box - Always show (auto-starts on first keypress) */}
        <div className="glass p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl mb-4">
          <UnifiedTypingBox
              promptText={displayPromptText}
              inputValue={inputValue}
              onInputChange={setInputValue}
              testStarted={testStarted}
              testReady={testReady}
              testCompleted={testCompleted}
              highlightWord={highlightWord}
              onNewPrompt={loadNewPrompt}
              language={language}
              memoryModeHidden={challengeMode.memoryModeHidden}
              getCharOpacity={challengeSettings.podcastMode ? podcastMode.getCharOpacity : undefined}
              testConfig={{
                duration: totalTime,
                mode: testMode,
                difficulty: difficulty,
                language: language,
                activeChallenge: (() => {
                  const challengeNames: Record<string, string> = {
                    oneLineOnly: 'One Line Only', focusStrip: 'Focus Strip', calmMode: 'Calm Mode',
                    ghostText: 'Ghost Text', noBackspace: 'No Backspace', errorFreeze: 'Error Freeze',
                    speedLock: 'Speed Lock', lastChance: 'Last Chance', reverseWords: 'Reverse Words',
                    wordShuffle: 'Word Shuffle', suddenShift: 'Sudden Shift', vanishingWords: 'Vanishing Words',
                    memoryMode: 'Memory Mode', blindStart: 'Blind Start', mirrorMode: 'Mirror Mode',
                    movingTarget: 'Moving Target', turboEnd: 'Turbo End', pressureMode: 'Pressure Mode',
                    staminaMode: 'Stamina Mode', encryption: 'Encryption', podcastMode: 'Podcast Mode',
                    promptCrafting: 'Prompt Crafting', aiHeatmap: 'AI Heatmap', ghostRacing: 'Ghost Racing',
                    hardcoreMode: 'Hardcore Mode'
                  };
                  const active = Object.entries(challengeSettings).find(([_, v]) => v === true);
                  return active ? challengeNames[active[0]] || active[0] : null;
                })()
              }}
            />
        </div>

        {/* 🎧 Podcast Mode Controls - Show during test when podcast mode active */}
        {challengeSettings.podcastMode && (testStarted || testReady) && (
          <div className="glass p-3 sm:p-4 rounded-xl mb-4 border border-blue-500/30">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎧</span>
                <h3 className="text-sm font-bold text-blue-300">Podcast Mode - Listen & Type</h3>
                {podcastMode.currentChallenge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    podcastMode.DIFFICULTY_CONFIG[podcastMode.currentChallenge.difficulty].bgColor
                  } ${
                    podcastMode.DIFFICULTY_CONFIG[podcastMode.currentChallenge.difficulty].color
                  }`}>
                    {podcastMode.DIFFICULTY_CONFIG[podcastMode.currentChallenge.difficulty].label}
                  </span>
                )}
              </div>
              {!podcastMode.ttsAvailable && (
                <span className="text-[10px] text-red-400">TTS not available in this browser</span>
              )}
            </div>

            {/* Challenge title */}
            {podcastMode.currentChallenge && (
              <div className="mb-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs text-blue-300 font-medium">
                  📝 {podcastMode.currentChallenge.title}
                </span>
                <span className="text-[10px] text-muted-foreground ml-2">
                  ({podcastMode.DIFFICULTY_CONFIG[podcastMode.currentChallenge.difficulty].speed})
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Play/Pause */}
              <button
                onClick={podcastMode.togglePause}
                disabled={!podcastMode.podcastState.isPlaying}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  podcastMode.podcastState.isPlaying
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 cursor-pointer'
                    : 'bg-white/5 text-slate-500 border-slate-600/30 cursor-not-allowed'
                }`}
              >
                {podcastMode.podcastState.isPaused ? '▶️ Resume' : '⏸ Pause'}
              </button>

              {/* Speed Control */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">Speed:</span>
                {podcastMode.SPEEDS.map(speed => (
                  <button
                    key={speed}
                    onClick={() => podcastMode.setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      podcastMode.podcastState.playbackSpeed === speed
                        ? 'bg-blue-500/40 text-blue-200 border border-blue-500/50'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {speed.toFixed(2)}x
                  </button>
                ))}
              </div>

              {/* Status */}
              <span className={`text-[10px] font-medium ${
                podcastMode.podcastState.isSpeaking ? 'text-green-400' : 'text-slate-500'
              }`}>
                {podcastMode.podcastState.isPaused ? '⏸ Paused' : podcastMode.podcastState.isSpeaking ? '🔊 Speaking' : '🔇 Ready'}
              </span>
            </div>

            {/* Waveform + Progress */}
            <div className="mt-3 space-y-2">
              {/* Waveform animation */}
              {podcastMode.podcastState.isSpeaking && !podcastMode.podcastState.isPaused && (
                <div className="flex items-center justify-center gap-[3px] h-6">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-full bg-blue-400"
                      style={{
                        animation: `podcastWave 0.8s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.05}s`,
                        height: '4px',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Progress bar + percentage */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${podcastMode.podcastState.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-blue-300 font-mono w-10 text-right">
                  {podcastMode.podcastState.progress}%
                </span>
              </div>

              {/* Step 11: Live Listening Lag Indicator */}
              {testStarted && podcastMode.podcastState.isSpeaking && (
                <div className={`text-[10px] font-medium text-center py-1 rounded-md bg-white/5 ${podcastMode.getLagColor()}`}>
                  {podcastMode.getLagLabel()}
                </div>
              )}
            </div>

            {/* Typing progress */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">
                💡 Text is hidden! Listen and type what you hear.
              </p>
              {testStarted && (
                <span className="text-[10px] text-blue-300 font-mono">
                  {inputValue.length}/{promptText.length} chars
                </span>
              )}
            </div>
          </div>
        )}

        {/* 👤 Ghost Racing Dashboard - Show during test when ghost racing active */}
        {challengeSettings.ghostRacing && testStarted && !testCompleted && (
          <div className={`glass p-3 sm:p-4 rounded-xl mb-4 border ${ghostRacing.getBorderColor()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏁</span>
                <h3 className="text-sm font-bold">Ghost Race vs PB</h3>
              </div>
              {ghostRacing.ghostState.hasPB && (
                <span className="text-[10px] text-muted-foreground">
                  PB: {ghostRacing.ghostState.ghostWpm} WPM
                </span>
              )}
            </div>

            {ghostRacing.ghostState.hasPB ? (
              <div className="mt-2 space-y-2">
                {/* Race Track */}
                <div className="relative h-8 rounded-full bg-white/5 overflow-hidden">
                  {/* Ghost cursor (Step 18: opacity 0.4, blue tint) */}
                  <div
                    className="absolute top-0 h-full bg-blue-500/25 rounded-full transition-all duration-150 flex items-center justify-end pr-1"
                    style={{
                      width: `${Math.min(100, (ghostRacing.ghostState.ghostIndex / Math.max(promptText.length, 1)) * 100)}%`,
                      opacity: 0.4,
                    }}
                  >
                    <span className="text-[10px]" style={{ opacity: 1 }}>👻</span>
                  </div>
                  {/* User cursor (prominent, colored by position) */}
                  <div
                    className={`absolute top-0 h-full rounded-full transition-all duration-150 flex items-center justify-end pr-1 ${
                      ghostRacing.ghostState.position === 'ahead' ? 'bg-green-500/40' :
                      ghostRacing.ghostState.position === 'behind' ? 'bg-red-500/40' :
                      'bg-yellow-500/40'
                    }`}
                    style={{ width: `${Math.min(100, (inputValue.length / Math.max(promptText.length, 1)) * 100)}%` }}
                  >
                    <span className="text-[10px]">🏃</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${
                    ghostRacing.ghostState.position === 'ahead' ? 'text-green-400' :
                    ghostRacing.ghostState.position === 'behind' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {ghostRacing.getRaceStatus()}
                  </span>
                  <span className="text-muted-foreground">
                    You: {wpm} WPM | Ghost: {ghostRacing.ghostState.ghostWpm} WPM
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                🏁 No PB recorded yet. Complete a test to create your ghost! Minimum 20 characters & 20 seconds needed.
              </p>
            )}
          </div>
        )}

        {/* Progress Bar - Only show during test (not after completion) */}
        {testStarted && !testCompleted && (
          <div className="glass p-4 sm:p-5 rounded-2xl mb-5">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Stats Row - Color-coded Glass Cards */}
        {testStarted && !testCompleted && !challengeMode.shouldHideTimer && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Speed - color based on WPM */}
            <div className={`glass p-4 sm:p-5 rounded-xl text-center border ${wpm >= 60 ? 'border-green-500/30' : wpm >= 40 ? 'border-cyan-500/30' : wpm >= 20 ? 'border-blue-500/30' : 'border-slate-500/30'} transition-colors`}>
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 uppercase tracking-wider">Speed</div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${wpm >= 60 ? 'text-green-400' : wpm >= 40 ? 'text-cyan-400' : wpm >= 20 ? 'text-blue-400' : 'text-slate-400'}`}>
                {wpm} <span className="text-sm font-medium opacity-70">WPM</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${wpm >= 60 ? 'bg-green-500' : wpm >= 40 ? 'bg-cyan-500' : wpm >= 20 ? 'bg-blue-500' : 'bg-slate-500'}`} style={{ width: `${Math.min(100, (wpm / 100) * 100)}%` }}></div>
              </div>
            </div>

            {/* Accuracy - color based on accuracy */}
            <div className={`glass p-4 sm:p-5 rounded-xl text-center border ${accuracy >= 95 ? 'border-green-500/30' : accuracy >= 85 ? 'border-yellow-500/30' : accuracy >= 70 ? 'border-orange-500/30' : 'border-red-500/30'} transition-colors`}>
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 uppercase tracking-wider">Accuracy</div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${accuracy >= 95 ? 'text-green-400' : accuracy >= 85 ? 'text-yellow-400' : accuracy >= 70 ? 'text-orange-400' : 'text-red-400'}`}>
                {accuracy}<span className="text-sm font-medium opacity-70">%</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${accuracy >= 95 ? 'bg-green-500' : accuracy >= 85 ? 'bg-yellow-500' : accuracy >= 70 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${accuracy}%` }}></div>
              </div>
            </div>

            {/* Time - urgency when low */}
            <div className={`glass p-4 sm:p-5 rounded-xl text-center border ${currentTime <= 10 ? 'border-red-500/40' : currentTime <= 30 ? 'border-amber-500/30' : 'border-slate-500/20'} transition-colors`}>
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 uppercase tracking-wider">Time</div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold transition-colors ${currentTime <= 10 ? 'text-red-400 animate-pulse' : currentTime <= 30 ? 'text-amber-400' : challengeMode.getTurboMultiplier() > 1 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
                {currentTime}<span className="text-sm font-medium opacity-70">s</span> {challengeMode.getTurboMultiplier() > 1 && '⚡'}
              </div>
              <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${currentTime <= 10 ? 'bg-red-500' : currentTime <= 30 ? 'bg-amber-500' : 'bg-cyan-500'}`} style={{ width: `${(currentTime / totalTime) * 100}%` }}></div>
              </div>
            </div>

            {/* Errors - turns red when high */}
            <div className={`glass p-4 sm:p-5 rounded-xl text-center border ${errors === 0 ? 'border-green-500/30' : errors <= 3 ? 'border-yellow-500/30' : errors <= 8 ? 'border-orange-500/30' : 'border-red-500/30'} transition-colors`}>
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 uppercase tracking-wider">Errors</div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${errors === 0 ? 'text-green-400' : errors <= 3 ? 'text-yellow-400' : errors <= 8 ? 'text-orange-400' : 'text-red-400'}`}>
                {errors} {challengeSettings.lastChance && <span className="text-sm font-medium opacity-70">/ 3</span>}
              </div>
              <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${errors === 0 ? 'bg-green-500' : errors <= 3 ? 'bg-yellow-500' : errors <= 8 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (errors / 15) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {/* CPM / Gross WPM / Net WPM Strip */}
        {testStarted && !testCompleted && !challengeMode.shouldHideTimer && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            {/* CPM */}
            <div className="glass p-2 sm:p-3 md:p-4 rounded-xl text-center border border-indigo-500/20 transition-colors">
              <div className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">Characters/Min</div>
              <div className="text-base sm:text-lg md:text-2xl font-bold text-indigo-400">
                {cpm} <span className="text-[10px] font-medium opacity-60">CPM</span>
              </div>
            </div>
            {/* Gross WPM */}
            <div className="glass p-2 sm:p-3 md:p-4 rounded-xl text-center border border-teal-500/20 transition-colors">
              <div className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">Gross Speed</div>
              <div className="text-base sm:text-lg md:text-2xl font-bold text-teal-400">
                {grossWpm} <span className="text-[10px] font-medium opacity-60">WPM</span>
              </div>
            </div>
            {/* Net WPM */}
            <div className="glass p-2 sm:p-3 md:p-4 rounded-xl text-center border border-rose-500/20 transition-colors">
              <div className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">Net Speed</div>
              <div className={`text-base sm:text-lg md:text-2xl font-bold ${netWpm >= 40 ? 'text-green-400' : netWpm >= 20 ? 'text-amber-400' : 'text-rose-400'}`}>
                {netWpm} <span className="text-[10px] font-medium opacity-60">WPM</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Engagement Dashboard */}
        {testStarted && !testCompleted && (
          <div className="glass p-2 sm:p-3 md:p-4 rounded-xl mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
              {/* Left: Performance Badge + Motivation */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {/* Performance Badge */}
                <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${performanceBadge.bg} flex-shrink-0`}>
                  <span className="text-xs sm:text-sm">{performanceBadge.emoji}</span>
                  <span className={`text-[10px] sm:text-xs font-bold ${performanceBadge.color}`}>{performanceBadge.label}</span>
                </div>

                {/* Streak Counter */}
                {correctStreak >= 5 && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/15 border border-orange-500/25 rounded-full flex-shrink-0">
                    <span className="text-xs">🔥</span>
                    <span className="text-orange-400 text-[11px] font-bold">{correctStreak} streak</span>
                  </div>
                )}

                {/* Motivation Text */}
                <span className={`text-[10px] sm:text-xs font-medium truncate ${liveMotivation.color}`}>
                  {liveMotivation.text}
                </span>
              </div>

              {/* Right: Mini WPM Sparkline */}
              {wpmHistory.length >= 2 && (
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-500">WPM</span>
                  <svg width="80" height="24" viewBox="0 0 80 24" className="overflow-visible">
                    {/* Grid line */}
                    <line x1="0" y1="12" x2="80" y2="12" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    {/* Sparkline */}
                    <polyline
                      fill="none"
                      stroke={wpm >= 60 ? '#34d399' : wpm >= 40 ? '#22d3ee' : '#60a5fa'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={wpmHistory.map((w, i) => {
                        const x = (i / (wpmHistory.length - 1)) * 80;
                        const maxWpm = Math.max(...wpmHistory, 1);
                        const minWpm = Math.min(...wpmHistory);
                        const range = Math.max(maxWpm - minWpm, 10);
                        const y = 22 - ((w - minWpm) / range) * 20;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {/* Current point */}
                    {wpmHistory.length > 0 && (() => {
                      const maxWpm = Math.max(...wpmHistory, 1);
                      const minWpm = Math.min(...wpmHistory);
                      const range = Math.max(maxWpm - minWpm, 10);
                      const lastY = 22 - ((wpmHistory[wpmHistory.length - 1] - minWpm) / range) * 20;
                      return (
                        <circle
                          cx="80"
                          cy={lastY}
                          r="2.5"
                          fill={wpm >= 60 ? '#34d399' : wpm >= 40 ? '#22d3ee' : '#60a5fa'}
                          className="animate-pulse"
                        />
                      );
                    })()}
                  </svg>
                  <span className="text-[10px] text-slate-400 font-mono w-6 text-right">{wpm}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🤖 AI Heatmap Live Indicator - Show during test when AI heatmap active */}
        {challengeSettings.aiHeatmap && testStarted && !testCompleted && (
          <div className="glass p-2 sm:p-3 rounded-xl mb-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm animate-pulse">🧠</span>
                <span className="text-[10px] sm:text-xs font-medium text-blue-300">AI Tracking Active</span>
              </div>
              <span className="text-[9px] text-muted-foreground">
                Recording per-key latency via <code className="bg-white/5 px-1 rounded">performance.now()</code>
              </span>
            </div>
            <div className="mt-1 h-0.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-blue-500/50 animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {/* Live Test Info Strip - Always visible during test */}
        {testStarted && !testCompleted && (
          <div className="mb-4">
            <div className="glass p-2 sm:p-3 rounded-xl">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* Current config chips */}
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-500/15 border border-blue-500/25 text-blue-300 rounded-full text-[10px] sm:text-[11px] font-medium flex items-center gap-1">
                  ⏱ {totalTime}s
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-purple-500/15 border border-purple-500/25 text-purple-300 rounded-full text-[10px] sm:text-[11px] font-medium flex items-center gap-1 capitalize">
                  📊 {difficulty}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 rounded-full text-[10px] sm:text-[11px] font-medium flex items-center gap-1 capitalize">
                  🌐 {language}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-500/15 border border-amber-500/25 text-amber-300 rounded-full text-[10px] sm:text-[11px] font-medium flex items-center gap-1 capitalize">
                  ⚡ {testMode}
                </span>

                {/* Separator if challenge active */}
                {Object.entries(challengeSettings).some(([_, v]) => v === true) && (
                  <span className="text-gray-600 text-xs">|</span>
                )}

                {/* Active challenge badges */}
                {challengeSettings.oneLineOnly && (
                  <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded-full text-[11px] font-medium animate-pulse">📝 One Line Only</span>
                )}
                {challengeSettings.focusStrip && (
                  <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[11px] font-medium">🔦 Focus Strip</span>
                )}
                {challengeSettings.calmMode && (
                  <span className="px-2.5 py-1 bg-green-500/20 text-green-300 rounded-full text-[11px] font-medium">🧘 Calm Mode</span>
                )}
                {challengeSettings.ghostText && (
                  <span className="px-2.5 py-1 bg-gray-500/20 text-gray-300 rounded-full text-[11px] font-medium">👻 Ghost Text</span>
                )}
                {challengeSettings.noBackspace && (
                  <span className="px-2.5 py-1 bg-red-500/20 text-red-300 rounded-full text-[11px] font-medium">🚫 No Backspace</span>
                )}
                {challengeSettings.errorFreeze && (
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${challengeMode.isErrorFreeze ? 'bg-red-500/30 text-red-300 animate-pulse' : 'bg-sky-500/20 text-sky-300'}`}>
                    🧊 {challengeMode.isErrorFreeze ? 'FROZEN!' : 'Error Freeze'}
                  </span>
                )}
                {challengeSettings.speedLock && (
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${wpm < 30 && currentTime > 5 ? 'bg-red-500/30 text-red-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    🔒 Speed Lock {wpm < 30 && currentTime > 5 ? '⚠️' : `(${wpm} WPM)`}
                  </span>
                )}
                {challengeSettings.lastChance && (
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${errors >= 2 ? 'bg-red-500/30 text-red-300 animate-pulse' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    💀 Last Chance ({3 - errors} left)
                  </span>
                )}
                {challengeSettings.reverseWords && (
                  <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded-full text-[11px] font-medium">🔄 Reverse</span>
                )}
                {challengeSettings.wordShuffle && (
                  <span className="px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-full text-[11px] font-medium">🔀 Word Shuffle</span>
                )}
                {challengeSettings.suddenShift && (
                  <span className="px-2.5 py-1 bg-orange-500/20 text-orange-300 rounded-full text-[11px] font-medium">💫 Sudden Shift</span>
                )}
                {challengeSettings.vanishingWords && (
                  <span className="px-2.5 py-1 bg-slate-500/20 text-slate-300 rounded-full text-[11px] font-medium">✨ Vanishing</span>
                )}
                {challengeSettings.memoryMode && (
                  <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[11px] font-medium">🧠 Memory Mode</span>
                )}
                {challengeSettings.blindStart && (
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full text-[11px] font-medium">🙈 Blind Start</span>
                )}
                {challengeSettings.mirrorMode && (
                  <span className="px-2.5 py-1 bg-fuchsia-500/20 text-fuchsia-300 rounded-full text-[11px] font-medium">🪞 Mirror</span>
                )}
                {challengeSettings.movingTarget && (
                  <span className="px-2.5 py-1 bg-orange-500/20 text-orange-300 rounded-full text-[11px] font-medium">🎯 Moving Target</span>
                )}
                {challengeSettings.turboEnd && (
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${challengeMode.getTurboMultiplier() > 1 ? 'bg-red-500/30 text-red-300 animate-pulse' : 'bg-orange-500/20 text-orange-300'}`}>
                    🔥 {challengeMode.getTurboMultiplier() > 1 ? 'TURBO ACTIVE!' : 'Turbo End'}
                  </span>
                )}
                {challengeSettings.pressureMode && (
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full text-[11px] font-medium">⏳ Pressure</span>
                )}
                {challengeSettings.staminaMode && (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[11px] font-medium">💪 Stamina</span>
                )}
                {challengeSettings.encryption && (
                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full text-[11px] font-medium">🔐 Encryption</span>
                )}
                {challengeSettings.podcastMode && (
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[11px] font-medium">🎧 Podcast</span>
                )}
                {challengeSettings.promptCrafting && (
                  <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 rounded-full text-[11px] font-medium">✍️ Prompt Craft</span>
                )}
                {challengeSettings.aiHeatmap && (
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[11px] font-medium">🤖 AI Heatmap</span>
                )}
                {challengeSettings.ghostRacing && (
                  <span className="px-2.5 py-1 bg-slate-500/20 text-slate-300 rounded-full text-[11px] font-medium">👤 Ghost Race</span>
                )}
                {challengeSettings.hardcoreMode && (
                  <span className="px-2.5 py-1 bg-red-600/20 text-red-400 rounded-full text-[11px] font-medium animate-pulse">☠️ Hardcore</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {testCompleted && result && (
          <>
            <div className="glass p-6 rounded-2xl mb-6">
              <ResultDisplay 
                result={result}
                motivation={motivation}
                onNewTest={resetTest}
                onStartDrill={(drillText) => {
                  setCustomText(drillText);
                  setDifficulty('custom' as any);
                  setTimeout(() => resetTest(), 50);
                }}
                promptText={promptText}
                inputValue={inputValue}
              />
            </div>

            {/* ✍️ Prompt Crafting Results - Show after test if prompt crafting was active */}
            {promptCraftingResult && (
              <div className="glass p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border-2 border-teal-500/30">
                {/* Header: Score badge + challenge info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{promptCraftingResult.emoji}</span>
                    <div>
                      <h3 className="text-lg font-bold">
                        <span className={promptCraftingResult.color}>{promptCraftingResult.label}</span>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {promptCraftingResult.challengeTitle} · 
                        <span className="capitalize ml-1 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-semibold">
                          {promptCraftingResult.difficulty}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <p className="text-sm text-muted-foreground mb-3">{promptCraftingResult.feedback}</p>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="p-2.5 rounded-lg bg-white/5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-0.5">Typing Speed</div>
                    <div className="text-lg font-bold text-white">{promptCraftingResult.wpm}</div>
                    <div className="text-[9px] text-muted-foreground">WPM</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-0.5">Keywords</div>
                    <div className="text-lg font-bold text-white">
                      {promptCraftingResult.keywordsFound.length}/{promptCraftingResult.keywordsFound.length + promptCraftingResult.keywordsMissed.length}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Found</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-0.5">AI Prompt</div>
                    <div className="text-lg font-bold text-white">{promptCraftingResult.keywordBonus}</div>
                    <div className="text-[9px] text-muted-foreground">Score</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-500/20 border border-teal-500/30 text-center">
                    <div className="text-[10px] text-teal-300 mb-0.5">Final Score</div>
                    <div className="text-lg font-bold text-teal-300">{promptCraftingResult.finalScore}</div>
                    <div className="text-[9px] text-teal-400/70">(WPM×0.7 + KW×0.3)</div>
                  </div>
                </div>

                {/* Keywords Found / Missed */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-[10px] text-green-400 font-semibold mb-1">✅ Keywords Found ({promptCraftingResult.keywordsFound.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {promptCraftingResult.keywordsFound.map((kw, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-green-500/20 text-green-300">{kw}</span>
                      ))}
                      {promptCraftingResult.keywordsFound.length === 0 && (
                        <span className="text-[10px] text-muted-foreground">None found</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="text-[10px] text-red-400 font-semibold mb-1">❌ Missing ({promptCraftingResult.keywordsMissed.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {promptCraftingResult.keywordsMissed.map((kw, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-300">{kw}</span>
                      ))}
                      {promptCraftingResult.keywordsMissed.length === 0 && (
                        <span className="text-[10px] text-green-400">All found! 🎉</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Structure Detection */}
                {promptCraftingResult.structureDetected && (
                  <div className="flex gap-2 mb-3">
                    <div className={`px-2 py-1 rounded text-[9px] font-semibold border ${
                      promptCraftingResult.structureDetected.role 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-white/5 text-muted-foreground border-white/10'
                    }`}>
                      {promptCraftingResult.structureDetected.role ? '✅' : '❌'} Role
                    </div>
                    <div className={`px-2 py-1 rounded text-[9px] font-semibold border ${
                      promptCraftingResult.structureDetected.instruction 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-white/5 text-muted-foreground border-white/10'
                    }`}>
                      {promptCraftingResult.structureDetected.instruction ? '✅' : '❌'} Instruction
                    </div>
                    <div className={`px-2 py-1 rounded text-[9px] font-semibold border ${
                      promptCraftingResult.structureDetected.format 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-white/5 text-muted-foreground border-white/10'
                    }`}>
                      {promptCraftingResult.structureDetected.format ? '✅' : '❌'} Format
                    </div>
                  </div>
                )}

                {/* Bonus Keywords */}
                {promptCraftingResult.bonusKeywords && promptCraftingResult.bonusKeywords.length > 0 && (
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-3">
                    <span className="text-[10px] text-purple-400 font-semibold">⭐ Bonus Keywords: </span>
                    {promptCraftingResult.bonusKeywords.map((kw, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 ml-1">{kw}</span>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {promptCraftingResult.suggestions && promptCraftingResult.suggestions.length > 0 && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="text-[10px] text-blue-400 font-semibold mb-1.5">💡 Suggestions to improve:</div>
                    <ul className="space-y-1">
                      {promptCraftingResult.suggestions.map((s, i) => (
                        <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                          <span className="text-blue-400 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 👤 Ghost Race Result - Show after test if ghost racing was active */}
            {challengeSettings.ghostRacing && ghostRacing.ghostState.hasPB && (
              <div className="glass p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border-2 border-slate-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏁</span>
                    <h3 className="text-lg font-bold">Ghost Race Result</h3>
                  </div>
                </div>

                {/* Step 15: Time difference message */}
                {ghostRacing.getResultMessage() && (
                  <div className={`p-3 rounded-lg mb-3 text-center text-sm font-medium ${
                    ghostRacing.ghostState.userBeatGhost
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {ghostRacing.getResultMessage()}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-[10px] text-muted-foreground mb-1">Your WPM</div>
                    <div className="text-xl font-bold text-cyan-400">{result.wpm}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-[10px] text-muted-foreground mb-1">Ghost PB</div>
                    <div className="text-xl font-bold text-slate-400">{ghostRacing.ghostState.ghostWpm}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${result.wpm > ghostRacing.ghostState.ghostWpm ? 'bg-green-500/10 border border-green-500/20' : result.wpm === ghostRacing.ghostState.ghostWpm ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="text-[10px] text-muted-foreground mb-1">Result</div>
                    <div className={`text-xl font-bold ${result.wpm > ghostRacing.ghostState.ghostWpm ? 'text-green-400' : result.wpm === ghostRacing.ghostState.ghostWpm ? 'text-yellow-400' : 'text-red-400'}`}>
                      {result.wpm > ghostRacing.ghostState.ghostWpm ? '🏆 NEW PB!' : result.wpm === ghostRacing.ghostState.ghostWpm ? '⚔️ TIE' : '👻 Ghost Wins'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🎧 Podcast Mode Result - Show after test if podcast mode was active */}
            {podcastResult && (
              <div className="glass p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border-2 border-blue-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎧</span>
                    <h3 className="text-lg font-bold">Podcast Mode Result</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    podcastMode.DIFFICULTY_CONFIG[podcastResult.difficulty].bgColor
                  } ${
                    podcastMode.DIFFICULTY_CONFIG[podcastResult.difficulty].color
                  }`}>
                    {podcastMode.DIFFICULTY_CONFIG[podcastResult.difficulty].label}
                  </span>
                </div>

                {/* Challenge title */}
                <div className="mb-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                  <span className="text-sm text-blue-300 font-medium">📝 {podcastResult.challengeTitle}</span>
                </div>

                {/* Step 10: Result metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-1">Typing Speed</div>
                    <div className="text-xl font-bold text-cyan-400">{podcastResult.wpm}</div>
                    <div className="text-[9px] text-muted-foreground">WPM</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-1">Accuracy</div>
                    <div className={`text-xl font-bold ${
                      podcastResult.accuracy >= 90 ? 'text-green-400' : podcastResult.accuracy >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{podcastResult.accuracy}%</div>
                    <div className="text-[9px] text-muted-foreground">Correct</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-1">Listening Lag</div>
                    <div className={`text-xl font-bold ${
                      podcastResult.lagStatus === 'ahead' ? 'text-green-400' : podcastResult.lagStatus === 'behind' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {podcastResult.listeningLag > 0 ? '+' : ''}{podcastResult.listeningLag}
                    </div>
                    <div className="text-[9px] text-muted-foreground">{podcastResult.lagPercent}% offset</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-1">Completion</div>
                    <div className={`text-xl font-bold ${
                      podcastResult.completionPercent >= 90 ? 'text-green-400' : podcastResult.completionPercent >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{podcastResult.completionPercent}%</div>
                    <div className="text-[9px] text-muted-foreground">{podcastResult.revealedCount}/{podcastResult.totalChars}</div>
                  </div>
                </div>

                {/* Listening lag status banner */}
                <div className={`p-3 rounded-lg text-center text-sm font-medium ${
                  podcastResult.lagStatus === 'ahead'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : podcastResult.lagStatus === 'behind'
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                }`}>
                  {podcastResult.lagStatus === 'ahead' && `⚡ You typed ${Math.abs(podcastResult.listeningLag)} chars ahead of the audio! Great listening skills!`}
                  {podcastResult.lagStatus === 'behind' && `🐢 You were ${Math.abs(podcastResult.listeningLag)} chars behind the audio. Try a slower speed next time.`}
                  {podcastResult.lagStatus === 'in-sync' && `✅ You stayed perfectly in sync with the audio! Excellent ear-to-hand coordination.`}
                </div>
              </div>
            )}

            {/* Smart Suggestions - Performance Based */}
            <div className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border-2 border-cyan-500/30 animate-pulse-slow">
              {/* Header with urgency */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🚀</span>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {result.wpm >= 80 ? "You're on Fire!" : result.wpm >= 50 ? "Keep Going!" : "Let's Improve!"}
                  </h3>
                </div>
                <div className="text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-2 sm:px-3 py-1 rounded-full border border-cyan-500/30">
                  ⚡ Hot Now
                </div>
              </div>

              {/* Performance-Based Smart Message */}
              <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <p className="text-xs sm:text-sm leading-relaxed">
                  {result.wpm >= 80 && result.accuracy >= 95 ? (
                    <>🏆 <strong className="text-cyan-400">Excellent control and speed.</strong> Ready for an <strong className="text-purple-400">advanced challenge?</strong> Try Hardcore mode!</>
                  ) : result.wpm >= 80 && result.accuracy >= 85 ? (
                    <>⚡ <strong className="text-yellow-400">Great speed.</strong> A short <strong className="text-blue-400">accuracy drill</strong> will make it perfect. Try Error Freeze mode!</>
                  ) : result.wpm >= 80 ? (
                    <>💨 <strong className="text-orange-400">Blazing fast at {result.wpm} WPM!</strong> But accuracy needs work. Let's balance both with <strong className="text-cyan-400">focus challenges</strong>.</>
                  ) : result.wpm >= 60 && result.accuracy >= 90 ? (
                    <>🎯 <strong className="text-green-400">Nice progress.</strong> A quick <strong className="text-purple-400">challenge</strong> can boost this further. Try Speed Lock!</>
                  ) : result.wpm >= 60 ? (
                    <>💪 <strong className="text-blue-400">Solid typing!</strong> <strong className="text-green-400">Small practice sessions</strong> make a big difference. Keep going!</>
                  ) : result.wpm >= 40 && result.accuracy >= 85 ? (
                    <>🌟 <strong className="text-cyan-400">You're improving with every test.</strong> <strong className="text-yellow-400">Consistency is the key</strong> to higher speed!</>
                  ) : result.wpm >= 40 ? (
                    <>🎮 <strong className="text-purple-400">Let's build your speed</strong> with a <strong className="text-blue-400">fun practice mode.</strong> Games make learning easier!</>
                  ) : result.accuracy >= 90 ? (
                    <>🐢 <strong className="text-green-400">Excellent accuracy!</strong> Now let's work on speed. <strong className="text-orange-400">Play Speed Racer</strong> to build momentum!</>
                  ) : (
                    <>💡 <strong className="text-yellow-400">Every expert was once a beginner!</strong> <strong className="text-cyan-400">Based on your result</strong>, consistent practice will help you most.</>
                  )}
                </p>
              </div>

              {/* Sub-message - Additional motivation */}
              <div className="mb-4 sm:mb-5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-l-4 border-purple-500/50">
                <p className="text-xs text-muted-foreground italic">
                  {result.wpm >= 80 ? (
                    "💎 You're in the elite zone. Challenge modes will keep you sharp and engaged!"
                  ) : result.wpm >= 60 ? (
                    "🔥 Based on your result, this will help you most: Focus on consistency over raw speed."
                  ) : result.wpm >= 40 ? (
                    "🎯 Small practice sessions make a big difference. Try 5-minute daily practice!"
                  ) : (
                    `⚡ Try again and aim for ${Math.ceil((result.wpm + 10) / 10) * 10}+ WPM. You can do it!`
                  )}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* SMART SUGGESTION 1 - Based on Performance */}
                {result.wpm >= 80 && result.accuracy >= 95 ? (
                  <a 
                    href="#challenges" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-pink-500/10 hover:border-purple-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold animate-bounce">
                      TRY NOW
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🔥</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-purple-300">Hardcore Challenge</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      You're ready! No Backspace + Speed Lock + Last Chance. Prove you're elite!
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Accept Challenge <span>⚡</span>
                    </div>
                  </a>
                ) : result.wpm >= 60 ? (
                  <a 
                    href="#challenges" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/20 to-yellow-500/10 hover:border-orange-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold">
                      PERFECT FOR YOU
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">⚡</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-orange-300">Speed Lock Challenge</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Maintain 30+ WPM throughout. Push your limits and achieve consistency!
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-orange-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Start Challenge <span>→</span>
                    </div>
                  </a>
                ) : (
                  <a 
                    href="#challenges" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-green-500/50 bg-gradient-to-br from-green-500/20 to-emerald-500/10 hover:border-green-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold">
                      RECOMMENDED
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🎯</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-green-300">Beginner Challenges</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Start easy! Calm Mode + Focus Strip. Build confidence step by step.
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-green-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Start Easy <span>→</span>
                    </div>
                  </a>
                )}

                {/* SMART SUGGESTION 2 - Games (Always appealing) */}
                {result.wpm < 50 ? (
                  <Link 
                    to="/games"
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 hover:border-blue-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-blue-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold animate-pulse">
                      FUN WAY
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🎮</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-blue-300">Speed Racer Game</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Improve speed while playing. Race against time and have fun learning!
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-blue-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Play & Learn <span>🏎️</span>
                    </div>
                  </Link>
                ) : result.wpm < 70 ? (
                  <Link 
                    to="/games"
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 hover:border-cyan-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-cyan-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold">
                      BREAK TIME
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🌧️</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-cyan-300">Word Rain Game</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Let's build your speed with a fun practice mode. Catch falling words!
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Play Now <span>→</span>
                    </div>
                  </Link>
                ) : (
                  <Link 
                    to="/games"
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-pink-500/10 hover:border-purple-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-purple-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold">
                      MASTER LEVEL
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">⌨️</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-purple-300">Code Typer Game</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Based on your result, this will help you most. Advanced typing challenges!
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Try Advanced <span>💻</span>
                    </div>
                  </Link>
                )}

                {/* SMART SUGGESTION 3 - Exam or Retry */}
                {result.wpm >= 70 && result.accuracy >= 90 ? (
                  <Link 
                    to="/exam-mode"
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 hover:border-yellow-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-yellow-500 text-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold">
                      EXAM PRACTICE
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🏆</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-yellow-300">Exam Mode</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Simulate real exam conditions with timed tests and performance tracking.
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-yellow-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Start Exam <span>📝</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={resetTest}
                    className="group glass-hover p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-red-500/50 bg-gradient-to-br from-red-500/20 to-pink-500/10 hover:border-red-400 transition-all duration-300 cursor-pointer relative overflow-hidden text-left w-full"
                  >
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold animate-pulse">
                      ONE MORE!
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🔄</div>
                    <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-red-300">Beat Your Score</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Try again and aim for {Math.ceil((result.wpm + 10) / 10) * 10}+ WPM. You're improving with every test!
                    </p>
                    <div className="text-[10px] sm:text-xs font-bold text-red-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Retry Now <span>⚡</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Progress Teaser - Creates FOMO */}
              <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs">
                  <div className="flex items-start sm:items-center gap-2 text-muted-foreground">
                    <span className="text-sm sm:text-base mt-0.5 sm:mt-0">🔥</span>
                    <span className="text-xs leading-relaxed">
                      {result.wpm >= 80 ? "You're in top 10% of users! Elite club!" : 
                       result.wpm >= 60 ? `Only ${80 - result.wpm} WPM away from top 10%! Consistency is the key to higher speed.` :
                       result.wpm >= 40 ? `${60 - result.wpm} WPM to reach intermediate level. Small practice sessions make a big difference!` :
                       "You're improving with every test. Keep practicing!"}
                    </span>
                  </div>
                  {activeUsersCount !== null && (
                    <div className="text-cyan-400 font-semibold">
                      {activeUsersCount} users typing now
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Secondary Content - Below Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <PageHeader />
          </div>
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 px-1">
                🔥 Daily Challenge
              </h3>
              <DailyChallenge onStartChallenge={startTest} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Challenge Toast Notifications */}
      {toast && (
        <ChallengeToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Index;