import { RefreshCw, Copy, Volume2, Type, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

interface PromptDisplayProps {
  promptText: string;
  charClasses: {
    char: string;
    className: string;
  }[];
  onNewPrompt: () => void;
}
const PromptDisplay = ({
  promptText,
  charClasses,
  onNewPrompt
}: PromptDisplayProps) => {
  const promptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep current typing position visible
  useEffect(() => {
    if (!promptRef.current || charClasses.length === 0) return;
    
    const container = promptRef.current;
    
    // Count correct characters (green ones)
    const correctChars = charClasses.filter(item => 
      item.className.includes('text-green-500')
    ).length;
    
    // Find all character spans
    const chars = container.querySelectorAll('span');
    if (chars.length === 0) return;
    
    // Get the current character being typed (next after correct ones)
    const currentChar = chars[correctChars];
    
    if (currentChar) {
      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(() => {
        const containerRect = container.getBoundingClientRect();
        const charRect = currentChar.getBoundingClientRect();
        
        // Calculate if character is out of visible area
        const charBottomRelative = charRect.bottom - containerRect.top;
        const containerHeight = containerRect.height;
        
        // If character is beyond 70% of container height, scroll
        if (charBottomRelative > containerHeight * 0.7) {
          const scrollTarget = currentChar.offsetTop - 20;
          container.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [charClasses]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    toast.success('Text copied to clipboard!');
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(promptText);
      speechSynthesis.speak(utterance);
      toast.info('Reading text aloud...');
    } else {
      toast.error('Speech synthesis not supported');
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div 
        ref={promptRef}
        className="prompt-display relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl leading-relaxed tracking-wide overflow-y-auto scrollbar-hide"
        style={{
          height: '140px',
          minHeight: '140px',
          maxHeight: '140px',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          overflowX: 'hidden'
        }}
      >
        {charClasses.map((item, index) => (
          <span 
            key={index}
            className={item.className}
            data-index={index}
          >
            {item.char}
          </span>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs sm:text-sm" style={{ color: 'hsla(0, 0%, 70%, 0.9)' }}>
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Type className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" /> 
            T Chors: {promptText.length}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" /> 
            Words: {promptText.split(' ').filter(w => w).length}
          </span>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={onNewPrompt} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm" style={{
          background: 'hsla(0, 0%, 100%, 0.1)',
          border: '1px solid hsla(0, 0%, 100%, 0.2)'
        }} onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(178, 72%, 45%)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'hsla(0, 0%, 100%, 0.2)'} aria-label="Load new prompt">
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
            <span className="hidden xs:inline">New</span> Prompt
          </button>
          
          <button onClick={handleCopy} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm" style={{
          background: 'hsla(0, 0%, 100%, 0.1)',
          border: '1px solid hsla(0, 0%, 100%, 0.2)'
        }} onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(178, 72%, 45%)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'hsla(0, 0%, 100%, 0.2)'} aria-label="Copy text to clipboard">
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          
          <button onClick={handleSpeak} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm" style={{
          background: 'hsla(0, 0%, 100%, 0.1)',
          border: '1px solid hsla(0, 0%, 100%, 0.2)'
        }} onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(178, 72%, 45%)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'hsla(0, 0%, 100%, 0.2)'} aria-label="Read text aloud">
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Speak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default PromptDisplay;