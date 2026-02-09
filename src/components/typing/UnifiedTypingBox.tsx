import { useRef, useEffect, useState, useMemo, useCallback, type CSSProperties } from 'react';
import { RefreshCw, Copy, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import Sanscript from '@indic-transliteration/sanscript';
import { Language } from '@/hooks/useTypingTest';

interface UnifiedTypingBoxProps {
  promptText: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  testStarted: boolean;
  testReady?: boolean;
  testCompleted: boolean;
  highlightWord?: boolean;
  onNewPrompt: () => void;
  language?: Language;
}

const UnifiedTypingBox = ({
  promptText,
  inputValue,
  onInputChange,
  testStarted,
  testReady,
  testCompleted,
  highlightWord = false,
  onNewPrompt,
  language = 'english'
}: UnifiedTypingBoxProps) => {
  const VISIBLE_LINE_COUNT = 5;
  const ACTIVE_LINE_INDEX = 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!textContainerRef.current) return;

    const updateWidth = () => {
      const width = textContainerRef.current?.clientWidth || 0;
      setContainerWidth(width);
      console.log('📏 Container width measured:', width, 'px (usable:', width - 40, 'px with safety margin)');
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const ro = new ResizeObserver(() => updateWidth());
    ro.observe(textContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Split text into lines - ALWAYS ensure 5 visible lines minimum
  const lines = useMemo(() => {
    if (!promptText || promptText.trim().length === 0) {
      return [
        'Start typing to begin the test...',
        'Loading your practice text...',
        'Please wait...',
        '',
        ''
      ];
    }
    
    const words = promptText.split(' ').filter(w => w.trim());
    if (words.length === 0) {
      return ['No text available.', 'Click "New Prompt" button below.', 'Or select a different mode.', '', ''];
    }
    
    const result: string[] = [];
    let currentLine = '';
    const fallbackCharLimit = 62;
    const canMeasure = typeof document !== 'undefined' && containerWidth > 0;
    const canvas = canMeasure ? document.createElement('canvas') : null;
    const ctx = canvas ? canvas.getContext('2d') : null;

    if (ctx) {
      ctx.font = "500 21px 'JetBrains Mono', ui-monospace, monospace";
    }

    // Safety margin to account for letter-spacing (0.4px per char accumulates!)
    // and browser rendering differences - prevents text cutoff
    const safetyMargin = 40;
    const maxLineWidth = Math.max(100, containerWidth - safetyMargin);

    const fitsLine = (text: string) => {
      if (!ctx || !canMeasure) return text.length <= fallbackCharLimit;
      // Add extra buffer for letter-spacing: 0.4px * text.length
      const textWidth = ctx.measureText(text).width;
      const letterSpacingExtra = text.length * 0.4;
      return (textWidth + letterSpacingExtra) <= maxLineWidth;
    };
    
    words.forEach((word, index) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (fitsLine(testLine)) {
        currentLine = testLine;
      } else {
        // Line would overflow, push current line first
        if (currentLine) {
          result.push(currentLine);
          currentLine = word; // Start new line with current word
        } else {
          // Edge case: single word too long to fit on line
          // Still add it (will be clipped but prevents infinite loop)
          result.push(word);
          currentLine = '';
        }
      }
      
      // Push last line
      if (index === words.length - 1 && currentLine) {
        result.push(currentLine);
      }
    });
    
    // Ensure minimum of 5 lines for proper display
    if (result.length < VISIBLE_LINE_COUNT) {
      // Not enough lines - need to ensure 5 lines always
      if (result.length === 0) {
        return ['Start typing...', '', '', '', ''];
      } else if (result.length === 1) {
        // Split the single line into 5 parts when possible
        const text = result[0];
        const splitWords = text.split(' ');
        if (splitWords.length >= 15) {
          const fifth = Math.ceil(splitWords.length / 5);
          return [
            splitWords.slice(0, fifth).join(' '),
            splitWords.slice(fifth, fifth * 2).join(' '),
            splitWords.slice(fifth * 2, fifth * 3).join(' '),
            splitWords.slice(fifth * 3, fifth * 4).join(' '),
            splitWords.slice(fifth * 4).join(' ')
          ];
        } else {
          return [text, '', '', '', ''];
        }
      }
      return [...result, ...Array(VISIBLE_LINE_COUNT - result.length).fill('')];
    }
    
    return result;
  }, [promptText]);

  // Debug logging
  useEffect(() => {
    console.log('UnifiedTypingBox - Lines generated:', lines.length, 'First 5:', lines.slice(0, 5).map(l => l.substring(0, 30)));
  }, [lines]);

  // Character positions for each line start
  const lineCharPositions = useMemo(() => {
    const positions: number[] = [0];
    let total = 0;
    lines.forEach((line, i) => {
      total += line.length + (i < lines.length - 1 ? 1 : 0);
      positions.push(total);
    });
    return positions;
  }, [lines]);

  const lineEndPositions = useMemo(() => {
    return lines.map((line, i) => {
      const start = lineCharPositions[i] ?? 0;
      return start + Math.max(0, line.length - 1);
    });
  }, [lines, lineCharPositions]);

  // Find current line based on input
  const getCurrentLine = useCallback(() => {
    if (inputValue.length === 0) return 0;

    for (let i = 0; i < lineEndPositions.length; i++) {
      if (inputValue.length <= lineEndPositions[i]) {
        return i;
      }
    }
    return Math.max(0, lines.length - 1);
  }, [inputValue.length, lineEndPositions, lines.length]);

  // Update line when typing
  useEffect(() => {
    const newLine = getCurrentLine();
    if (newLine !== currentLineIndex) {
      setCurrentLineIndex(newLine);
    }
  }, [getCurrentLine, currentLineIndex]);

  // Reset on new test
  useEffect(() => {
    if (inputValue.length === 0) setCurrentLineIndex(0);
  }, [inputValue.length]);

  // Auto-focus
  useEffect(() => {
    if (!testCompleted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [testStarted, testCompleted]);

  // Auto-focus and enable when test becomes ready
  useEffect(() => {
    if (testReady && !testStarted && !testCompleted && inputRef.current) {
      // Wait a tiny bit for React to update the DOM
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.removeAttribute('readonly');
          inputRef.current.focus();
          console.log('✅ Textarea focused and ready for input');
        }
      }, 50);
    }
  }, [testReady, testStarted, testCompleted]);

  // Visible 5 lines - slice around the active line
  const visibleLines = useMemo(() => {
    const desiredStart = currentLineIndex - ACTIVE_LINE_INDEX;
    let startIndex = Math.max(0, desiredStart);
    let endIndex = startIndex + VISIBLE_LINE_COUNT;

    if (endIndex > lines.length) {
      endIndex = lines.length;
      startIndex = Math.max(0, endIndex - VISIBLE_LINE_COUNT);
    }

    const slice = lines.slice(startIndex, endIndex);
    while (slice.length < VISIBLE_LINE_COUNT) slice.push('');

    return { lines: slice, startIndex };
  }, [lines, currentLineIndex]);

  const visibleStartChar = lineCharPositions[visibleLines.startIndex] || 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    toast.success('Copied!');
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(promptText));
    }
  };

  const inputLang = language === 'hindi'
    ? 'hi'
    : language === 'marathi'
    ? 'mr'
    : language === 'nepali'
    ? 'ne'
    : language === 'sanskrit'
    ? 'sa'
    : language === 'bhojpuri'
    ? 'hi'
    : language === 'hinglish'
    ? 'hi-Latn'
    : 'en';

  const shouldTransliterate = false; // Disabled - use OS IME instead
  const transliterateValue = useCallback((value: string) => {
    // Transliteration disabled - user should use OS IME (Google Input Tools, Windows Hindi Keyboard)
    return value;
  }, []);

  const currentWordStart = useMemo(() => {
    return Math.max(0, inputValue.lastIndexOf(' ') + 1);
  }, [inputValue]);

  const currentWordEnd = useMemo(() => {
    const nextSpace = promptText.indexOf(' ', currentWordStart);
    return nextSpace === -1 ? promptText.length : nextSpace;
  }, [promptText, currentWordStart]);

  // Render line characters with unique styling
  const renderLine = (line: string, lineStart: number) => {
    const renderText = line.length > 0 && lineStart + line.length < promptText.length
      ? `${line} `
      : line;

    return renderText.split('').map((char, idx) => {
      const absIdx = lineStart + idx;
      const typed = inputValue[absIdx];
      
      let cls = 'text-gray-400'; // untyped - soft gray
      let style: CSSProperties = {};
      
      if (absIdx < inputValue.length) {
        if (typed === char) {
          cls = 'text-cyan-300'; // Correct - light cyan
        } else {
          cls = 'text-red-300'; // Wrong - muted red
          // Rounded underline with subtle glow
          style = {
            textDecoration: 'underline wavy',
            textUnderlineOffset: '3px',
            textDecorationColor: 'rgba(252, 165, 165, 0.6)',
            textDecorationThickness: '2px',
            textShadow: '0 0 6px rgba(252, 165, 165, 0.35)'
          };
        }
      } else if (highlightWord && absIdx >= currentWordStart && absIdx < currentWordEnd) {
        cls = 'text-slate-200';
        style = {
          textShadow: '0 0 6px rgba(148, 163, 184, 0.35)'
        };
      }
      
      // Cursor indicator - soft glowing bar
      const isCursor = absIdx === inputValue.length;
      
      return (
        <span key={idx} className={`${cls} relative`} style={style}>
          {isCursor && (
            <span 
              className="absolute left-0 top-0 w-[2px] h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, #06b6d4 0%, #06b6d4 40%, transparent 70%)',
                boxShadow: '0 0 8px rgba(6, 182, 212, 0.8)',
                animation: 'softGlow 1.5s ease-in-out infinite'
              }}
            />
          )}
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-3">
      {/* Fixed 5-line typing box */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className={`relative cursor-text rounded-xl ${
          isFocused ? 'ring-2 ring-cyan-500/40' : ''
        }`}
        style={{
          background: 'linear-gradient(180deg, hsl(210, 25%, 12%), hsl(210, 22%, 10%))',
          border: '1px solid hsl(210, 30%, 20%)',
          minHeight: '320px',
          maxHeight: '320px',
          height: '320px',
          padding: '28px 40px',
          margin: '0 auto',
          maxWidth: '1080px',
          boxShadow: '0 8px 24px hsla(0, 0%, 0%, 0.4), inset 0 1px 0 hsla(0, 0%, 100%, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          ref={textContainerRef}
          className="select-none"
          style={{
            fontFamily: "'JetBrains Mono', 'ui-monospace', monospace",
            fontSize: '21px',
            fontWeight: 500,
            lineHeight: '1.9',
            letterSpacing: '0.4px',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            justifyContent: 'flex-start',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility'
          }}
        >
          {visibleLines.lines.map((line, idx) => {
            const lineIndex = visibleLines.startIndex + idx;
            const lineStart = lineCharPositions[lineIndex] ?? visibleStartChar;
            const lineOpacity = idx === ACTIVE_LINE_INDEX ? 1 : idx < ACTIVE_LINE_INDEX ? 0.6 : 0.7;
            
            // Always render the line container, even if empty
            return (
              <div 
                key={currentLineIndex + idx} 
                className="whitespace-pre"
                style={{ 
                  minHeight: '42px',
                  height: '42px',
                  lineHeight: '42px',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                  width: '100%',
                  maxWidth: '100%',
                  opacity: lineOpacity,
                  transition: 'opacity 320ms ease-out, transform 320ms ease-out',
                  transform: 'translateY(0)',
                  willChange: 'opacity, transform',
                  wordBreak: 'keep-all',
                  whiteSpace: 'pre'
                }}
              >
                {line ? renderLine(line, lineStart) : <span className="text-gray-700">&nbsp;</span>}
              </div>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={(e) => {
            setIsFocused(true);
            if (testReady || testStarted) {
              e.target.removeAttribute('readonly');
            }
          }}
          onBlur={() => setIsFocused(false)}
          disabled={testCompleted}
          readOnly={!testReady && !testStarted}
          onKeyDown={(e) => {
            if (e.currentTarget.hasAttribute('readonly') && (testReady || testStarted)) {
              e.currentTarget.removeAttribute('readonly');
            }
            // Prevent newlines
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className="absolute inset-0 opacity-0 w-full h-full pointer-events-auto resize-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang={inputLang}
          aria-label="Typing input"
          aria-autocomplete="none"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          name="prevent-autofill"
          id="prevent-autofill"
          role="textbox"
          rows={1}
        />

        {!testStarted && inputValue.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl backdrop-blur-sm pointer-events-none">
            <div className="text-center">
              {testReady ? (
                <>
                  <p className="text-green-400 text-lg font-semibold mb-1 animate-pulse">⌨️ Start Typing Now!</p>
                  <p className="text-gray-400 text-xs">Timer starts on your first keystroke</p>
                </>
              ) : (
                <>
                  <p className="text-cyan-400 text-lg font-semibold mb-1">⌨️ Start Typing to Begin</p>
                  <p className="text-gray-400 text-xs">Click "Start Test" button first</p>
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Info bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 px-1">
        <span>{promptText.split(' ').length} words • Line {currentLineIndex + 1}/{lines.length}</span>
        <div className="flex gap-1">
          <button 
            onClick={onNewPrompt} 
            className="p-1.5 rounded hover:bg-white/10"
            title="Get new text"
            aria-label="Get new text"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleCopy} 
            className="p-1.5 rounded hover:bg-white/10"
            title="Copy text"
            aria-label="Copy text"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleSpeak} 
            className="p-1.5 rounded hover:bg-white/10"
            title="Read aloud"
            aria-label="Read aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedTypingBox;
