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
  const isComposingRef = useRef(false);

  // Split text into lines - ALWAYS ensure 3 visible lines minimum
  const lines = useMemo(() => {
    if (!promptText || promptText.trim().length === 0) {
      return ['Start typing to begin the test...', 'Loading your practice text...', 'Please wait...'];
    }
    
    const words = promptText.split(' ').filter(w => w.trim());
    if (words.length === 0) {
      return ['No text available.', 'Click "New Prompt" button below.', 'Or select a different mode.'];
    }
    
    const result: string[] = [];
    let currentLine = '';
    const maxLineLength = 85; // Slightly less than 90 for safety
    
    words.forEach((word, index) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (testLine.length <= maxLineLength) {
        currentLine = testLine;
      } else {
        // Line is full, push it and start new line
        if (currentLine) {
          result.push(currentLine);
        }
        currentLine = word;
      }
      
      // Push last line
      if (index === words.length - 1 && currentLine) {
        result.push(currentLine);
      }
    });
    
    // Ensure minimum of 3 lines for proper display
    if (result.length < 3) {
      // Not enough lines - need to ensure 3 lines always
      if (result.length === 0) {
        return ['Start typing...', '', ''];
      } else if (result.length === 1) {
        // Split the single line into 3 parts
        const text = result[0];
        const splitWords = text.split(' ');
        if (splitWords.length >= 9) {
          const third = Math.ceil(splitWords.length / 3);
          return [
            splitWords.slice(0, third).join(' '),
            splitWords.slice(third, third * 2).join(' '),
            splitWords.slice(third * 2).join(' ')
          ];
        } else {
          return [text, '', ''];
        }
      } else if (result.length === 2) {
        // Have 2 lines, add empty third
        return [...result, ''];
      }
    }
    
    return result;
  }, [promptText]);

  // Debug logging
  useEffect(() => {
    console.log('UnifiedTypingBox - Lines generated:', lines.length, 'First 3:', lines.slice(0, 3).map(l => l.substring(0, 30)));
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
      inputRef.current.focus();
      // Remove readonly to allow immediate typing
      inputRef.current.removeAttribute('readonly');
    }
  }, [testReady, testStarted, testCompleted]);

  // Visible 3 lines - ALWAYS show exactly 3 lines
  const visibleLines = useMemo(() => {
    // Start from current line, but ensure we can show 3 lines
    let startIndex = currentLineIndex;
    
    // If near the end, shift back to show full 3 lines
    if (lines.length >= 3) {
      // Never go beyond the point where we can't show 3 lines
      const maxStartIndex = Math.max(0, lines.length - 3);
      if (startIndex > maxStartIndex) {
        startIndex = maxStartIndex;
      }
    } else {
      startIndex = 0; // Start from beginning if less than 3 lines
    }
    
    // Get 3 lines starting from adjusted index
    const threeLines = [];
    for (let i = 0; i < 3; i++) {
      const lineIndex = startIndex + i;
      if (lineIndex < lines.length) {
        threeLines.push(lines[lineIndex]);
      } else {
        threeLines.push(''); // Pad with empty if not enough lines
      }
    }
    
    return { lines: threeLines, startIndex };
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

  // Render line characters
  const renderLine = (line: string, lineStart: number) => {
    return line.split('').map((char, idx) => {
      const absIdx = lineStart + idx;
      const typed = inputValue[absIdx];
      
      let cls = 'text-gray-500'; // untyped
      if (absIdx < inputValue.length) {
        cls = typed === char ? 'text-white' : 'text-red-400 bg-red-900/50';
      }
      
      // Cursor indicator
      const isCursor = absIdx === inputValue.length;
      
      return (
        <span key={idx} className={`${cls} relative`}>
          {isCursor && <span className="absolute left-0 top-0 w-0.5 h-full bg-cyan-400 animate-pulse" />}
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
          background: 'hsla(200, 15%, 8%, 0.95)',
          border: '1px solid hsla(0, 0%, 100%, 0.1)',
          minHeight: '130px', // Exact fit for 3 lines: 30px * 3 + 2px * 2 (spacing) + 32px (padding)
          maxHeight: '130px',
          height: '130px',
          padding: '16px 20px',
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
            fontFamily: "Consolas, Monaco, 'Courier New', monospace",
            fontSize: '1.05rem',
            lineHeight: '1.75rem',
            letterSpacing: '0.02em',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          {visibleLines.lines.map((line, idx) => {
            const lineStart = visibleStartChar + 
              visibleLines.lines.slice(0, idx).reduce((a, l) => a + l.length + 1, 0);
            
            // Always render the line container, even if empty
            return (
              <div 
                key={currentLineIndex + idx} 
                className="whitespace-pre-wrap break-words" 
                style={{ 
                  minHeight: '30px',
                  height: '30px', 
                  lineHeight: '30px',
                  marginBottom: idx < 2 ? '2px' : '0' // Space between lines
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
            e.target.removeAttribute('readonly');
          }}
          onBlur={() => setIsFocused(false)}
          disabled={testCompleted}
          readOnly
          onKeyDown={(e) => {
            if (e.currentTarget.hasAttribute('readonly')) {
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
