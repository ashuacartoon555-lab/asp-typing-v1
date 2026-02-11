import { useEffect, useCallback, useState } from 'react';
import React from 'react';
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

const Index = () => {
  const {
    promptText,
    inputValue,
    currentTime,
    totalTime,
    wpm,
    accuracy,
    errors,
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
    getCharClasses
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
                      <span className="text-gray-500">👁️</span>
                      <span>Blind Start - Text hidden at beginning</span>
                    </div>
                  )}
                  {challengeSettings.vanishingWords && (
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-500">✨</span>
                      <span>Vanishing Words - Completed words fade away</span>
                    </div>
                  )}
                  {challengeSettings.memoryMode && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500">🧠</span>
                      <span>Memory Mode - Remember the text pattern</span>
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
                      <span>Reverse Words - Words appear backwards</span>
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

        {/* Unified Typing Box - Always show (auto-starts on first keypress) */}
        <div className="glass p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl mb-4">
          <UnifiedTypingBox
              promptText={promptText}
              inputValue={inputValue}
              onInputChange={setInputValue}
              testStarted={testStarted}
              testReady={testReady}
              testCompleted={testCompleted}
              highlightWord={highlightWord}
              onNewPrompt={loadNewPrompt}
              language={language}
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

        {/* Progress Bar - Only show during test (not after completion) */}
        {testStarted && !testCompleted && (
          <div className="glass p-4 sm:p-5 rounded-2xl mb-5">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Stats Row - 4 Glass Cards - Only show during test (not after completion) */}
        {testStarted && !testCompleted && !challengeMode.shouldHideTimer && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass p-4 sm:p-5 rounded-xl text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Speed</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{wpm} WPM</div>
            </div>
            <div className="glass p-4 sm:p-5 rounded-xl text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Accuracy</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{accuracy}%</div>
            </div>
            <div className="glass p-4 sm:p-5 rounded-xl text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Time</div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${challengeMode.getTurboMultiplier() > 1 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
                {currentTime}s {challengeMode.getTurboMultiplier() > 1 && '⚡'}
              </div>
            </div>
            <div className="glass p-4 sm:p-5 rounded-xl text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Errors</div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${challengeSettings.lastChance && errors >= 2 ? 'text-red-500' : 'text-foreground'}`}>
                {errors} {challengeSettings.lastChance && `/ 3`}
              </div>
            </div>
          </div>
        )}

        {/* Live Test Info Strip - Always visible during test */}
        {testStarted && !testCompleted && (
          <div className="mb-4">
            <div className="glass p-3 rounded-xl">
              <div className="flex flex-wrap items-center gap-2">
                {/* Current config chips */}
                <span className="px-2.5 py-1 bg-blue-500/15 border border-blue-500/25 text-blue-300 rounded-full text-[11px] font-medium flex items-center gap-1">
                  ⏱ {totalTime}s
                </span>
                <span className="px-2.5 py-1 bg-purple-500/15 border border-purple-500/25 text-purple-300 rounded-full text-[11px] font-medium flex items-center gap-1 capitalize">
                  📊 {difficulty}
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 rounded-full text-[11px] font-medium flex items-center gap-1 capitalize">
                  🌐 {language}
                </span>
                <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/25 text-amber-300 rounded-full text-[11px] font-medium flex items-center gap-1 capitalize">
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
                promptText={promptText}
                inputValue={inputValue}
              />
            </div>

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
                  <a 
                    href="/games"
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
                  </a>
                ) : result.wpm < 70 ? (
                  <a 
                    href="/games"
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
                  </a>
                ) : (
                  <a 
                    href="/games"
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
                  </a>
                )}

                {/* SMART SUGGESTION 3 - Exam or Retry */}
                {result.wpm >= 70 && result.accuracy >= 90 ? (
                  <a 
                    href="/exam-mode"
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
                  </a>
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