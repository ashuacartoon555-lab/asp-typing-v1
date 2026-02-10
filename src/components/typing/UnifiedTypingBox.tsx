import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [maxLineLength, setMaxLineLength] = useState(85);
  const isComposingRef = useRef(false);
  const minVisibleLines = 6;
  const lineHeightPx = 36.75;
  const lineGapPx = 10;
  const verticalPaddingPx = 48;
  const boxHeightPx = Math.round(lineHeightPx * minVisibleLines + lineGapPx * (minVisibleLines - 1) + verticalPaddingPx);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateMaxLineLength = () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      const usableWidth = Math.max(0, width - 90); // More conservative padding allowance
      const estimatedCharWidth = 13.2; // Slightly larger to be safe
      const nextMax = Math.max(20, Math.floor(usableWidth / estimatedCharWidth));
      setMaxLineLength(nextMax);
    };

    updateMaxLineLength();
    const observer = new ResizeObserver(updateMaxLineLength);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Split text into lines - ALWAYS ensure 6 visible lines minimum
  const lines = useMemo(() => {
    if (!promptText || promptText.trim().length === 0) {
      return [
        'Start typing to begin the test...',
        'Loading your practice text...',
        'Please wait...',
        '',
        '',
        ''
      ];
    }

    const normalizedText = promptText.replace(/\s+/g, ' ').trim();
    if (normalizedText.length === 0) {
      return [
        'Start typing to begin the test...',
        'Loading your practice text...',
        'Please wait...',
        '',
        '',
        ''
      ];
    }

    const words = normalizedText.split(' ').filter(w => w.trim());
    if (words.length === 0) {
      return ['No text available.', 'Click "New Prompt" button below.', 'Or select a different mode.', '', '', ''];
    }
    
    const result: string[] = [];
    let currentLine = '';
    const maxLineLengthLocal = maxLineLength;
    
    words.forEach((word, index) => {
      // If word itself is longer than maxLineLength, break it into chunks
      if (word.length > maxLineLengthLocal) {
        // First, push current line if exists
        if (currentLine) {
          result.push(currentLine);
          currentLine = '';
        }
        
        // Break long word into chunks (use slightly smaller chunks for safety)
        let remainingWord = word;
        const safeChunkSize = Math.max(20, maxLineLengthLocal - 2); // 2 char safety margin
        while (remainingWord.length > safeChunkSize) {
          result.push(remainingWord.substring(0, safeChunkSize));
          remainingWord = remainingWord.substring(safeChunkSize);
        }
        
        // Set remaining part as current line
        if (remainingWord) {
          currentLine = remainingWord;
        }
      } else {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        
        if (testLine.length <= maxLineLengthLocal) {
          currentLine = testLine;
        } else {
          // Line would overflow, push current line first
          if (currentLine) {
            result.push(currentLine);
            currentLine = word; // Start new line with current word
          } else {
            // Edge case: single word too long to fit on line
            // This shouldn't happen now due to chunk breaking above
            result.push(word);
            currentLine = '';
          }
        }
      }
      
      // Push last line
      if (index === words.length - 1 && currentLine) {
        result.push(currentLine);
      }
    });
    
    // Ensure minimum of 6 lines for proper display
    if (result.length < minVisibleLines) {
      // Not enough lines - need to ensure 6 lines always
      if (result.length === 0) {
        return ['Start typing...', '', '', '', '', ''];
      } else if (result.length === 1) {
        // Split the single line into 6 parts when possible
        const text = result[0];
        const splitWords = text.split(' ');
        if (splitWords.length >= 18) {
          const sixth = Math.ceil(splitWords.length / 6);
          return [
            splitWords.slice(0, sixth).join(' '),
            splitWords.slice(sixth, sixth * 2).join(' '),
            splitWords.slice(sixth * 2, sixth * 3).join(' '),
            splitWords.slice(sixth * 3, sixth * 4).join(' '),
            splitWords.slice(sixth * 4, sixth * 5).join(' '),
            splitWords.slice(sixth * 5).join(' ')
          ];
        } else {
          return [text, '', '', '', '', '', ''];
        }
      } else {
        // Pad remaining lines up to 6
        return [...result, ...Array.from({ length: minVisibleLines - result.length }, () => '')];
      }
    }
    
    return result;
  }, [promptText, maxLineLength]);

  // Debug logging
  useEffect(() => {
    console.log('UnifiedTypingBox - Lines generated:', lines.length, 'MaxLineLength:', maxLineLength);
    console.log('First 6 lines (char counts):', lines.slice(0, 6).map((l, i) => `${i}: ${l.length}ch`));
  }, [lines, maxLineLength]);

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

  // Find current line based on input
  const getCurrentLine = useCallback(() => {
    for (let i = 0; i < lineCharPositions.length - 1; i++) {
      if (inputValue.length < lineCharPositions[i + 1]) {
        return i;
      }
    }
    return Math.max(0, lines.length - 1);
  }, [inputValue.length, lineCharPositions, lines.length]);

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

  // Visible 6 lines - ALWAYS show exactly 6 lines
  const visibleLines = useMemo(() => {
    // Start from current line, but ensure we can show 6 lines
    let startIndex = currentLineIndex;
    
    // If near the end, shift back to show full 6 lines
    if (lines.length >= minVisibleLines) {
      // Never go beyond the point where we can't show 6 lines
      const maxStartIndex = Math.max(0, lines.length - minVisibleLines);
      if (startIndex > maxStartIndex) {
        startIndex = maxStartIndex;
      }
    } else {
      startIndex = 0; // Start from beginning if less than 6 lines
    }
    
    // Get 6 lines starting from adjusted index
    const sixLines = [];
    for (let i = 0; i < minVisibleLines; i++) {
      const lineIndex = startIndex + i;
      if (lineIndex < lines.length) {
        sixLines.push(lines[lineIndex]);
      } else {
        sixLines.push(''); // Pad with empty if not enough lines
      }
    }
    
    return { lines: sixLines, startIndex };
  }, [lines, currentLineIndex, minVisibleLines]);

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

  // Render line characters with unique styling
  const renderLine = (line: string, lineStart: number) => {
    return line.split('').map((char, idx) => {
      const absIdx = lineStart + idx;
      const typed = inputValue[absIdx];
      
      let cls = 'text-gray-400'; // untyped - soft gray
      let style = {};
      
      if (absIdx < inputValue.length) {
        if (typed === char) {
          cls = 'text-cyan-300'; // Correct - light cyan
        } else {
          cls = 'text-red-300'; // Wrong - muted red
          // Rounded underline for error (instead of background)
          style = {
            textDecoration: 'underline wavy',
            textUnderlineOffset: '3px',
            textDecorationColor: 'rgba(252, 165, 165, 0.6)',
            textDecorationThickness: '2px'
          };
        }
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
      {/* Fixed 3-line typing box */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className={`relative cursor-text rounded-xl ${
          isFocused ? 'ring-2 ring-cyan-500/40' : ''
        }`}
        style={{
          background: 'linear-gradient(180deg, hsl(210, 25%, 12%), hsl(210, 22%, 10%))',
          border: '1px solid hsl(210, 30%, 20%)',
          minHeight: `${boxHeightPx}px`,
          maxHeight: `${boxHeightPx}px`,
          height: `${boxHeightPx}px`,
          padding: '24px 40px',
          margin: '0 auto',
          maxWidth: '1200px',
          boxShadow: '0 8px 24px hsla(0, 0%, 0%, 0.4), inset 0 1px 0 hsla(0, 0%, 100%, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          className="select-none"
          style={{
            fontFamily: "'JetBrains Mono', 'ui-monospace', monospace",
            fontSize: '21px',
            fontWeight: 500,
            lineHeight: '1.75',
            letterSpacing: '0.4px',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
            overflow: 'hidden'
          }}
        >
          {visibleLines.lines.map((line, idx) => {
            const lineStart = visibleStartChar + 
              visibleLines.lines.slice(0, idx).reduce((a, l) => a + l.length + 1, 0);
            
            // Always render the line container, even if empty
            return (
              <div 
                key={currentLineIndex + idx} 
                className="whitespace-pre" 
                style={{ 
                  minHeight: `${lineHeightPx}px`,
                  height: `${lineHeightPx}px`,
                  lineHeight: '1.75',
                  marginBottom: idx < minVisibleLines - 1 ? `${lineGapPx}px` : '0',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                  width: '100%',
                  maxWidth: '100%'
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
