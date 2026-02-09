import { Keyboard } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface TypingAreaProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  testStarted: boolean;
  testCompleted: boolean;
  disabled?: boolean;
}

const TypingArea = ({ inputValue, onInputChange, testStarted, testCompleted, disabled }: TypingAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on page load and when test starts
  useEffect(() => {
    if (textareaRef.current && !testStarted && !testCompleted) {
      textareaRef.current.focus();
    }
  }, [testStarted, testCompleted]);

  // Auto-focus when test starts
  useEffect(() => {
    if (testStarted && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [testStarted]);

  // Smooth auto-scroll as user types
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      // Scroll smoothly to keep cursor visible
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [inputValue]);

  return (
    <div className="relative max-w-full mx-auto">
      <div 
        className={`relative rounded-2xl overflow-hidden transition-all ${
          testStarted ? 'ring-4' : ''
        }`}
        style={{
          background: 'hsla(0, 0%, 100%, 0.12)',
          border: '1px solid hsla(0, 0%, 100%, 0.2)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 10px 35px hsla(0, 0%, 0%, 0.35)',
          ...(testStarted && { 
            borderColor: 'hsl(178, 72%, 45%)',
            boxShadow: '0 0 0 4px hsla(178, 72%, 45%, 0.15), 0 10px 35px hsla(0, 0%, 0%, 0.35)'
          })
        }}
      >
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={disabled}
          placeholder={testStarted ? "Keep typing..." : "Click 'Start Test' button below, then start typing here..."}
          className="typing-input w-full h-24 sm:h-32 md:h-40 lg:h-48 text-sm sm:text-base md:text-lg p-4 sm:p-6 md:p-8 border-none rounded-2xl resize-none font-sans leading-relaxed focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground text-foreground overflow-y-auto"
          style={{ 
            caretColor: 'hsl(178, 72%, 45%)',
            scrollBehavior: 'smooth'
          }}
          autoFocus
        />
        
        {testStarted && (
          <div 
            className="absolute right-3 sm:right-5 bottom-3 sm:bottom-5 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg font-medium text-xs sm:text-sm"
            style={{
              background: 'hsla(0, 0%, 100%, 0.15)',
              backdropFilter: 'blur(8px)',
              color: 'hsl(178, 72%, 55%)'
            }}
          >
            <Keyboard className="w-3 h-3 sm:w-4 sm:h-4" /> 
            <span className="hidden xs:inline">Typing in progress...</span>
            <span className="xs:hidden">Typing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingArea;
