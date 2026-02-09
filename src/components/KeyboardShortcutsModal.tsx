import { useState, useEffect } from 'react';
import { Keyboard, Command, RotateCcw, Play, Pause, HelpCircle, X, Zap, ArrowUp, ArrowDown, ArrowRightLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShortcutItem {
  keys: string[];
  description: string;
  icon: React.ElementType;
  category: 'navigation' | 'typing' | 'general';
}

const shortcuts: ShortcutItem[] = [
  // Typing Controls
  { keys: ['Ctrl', 'Enter'], description: 'Start typing test', icon: Play, category: 'typing' },
  { keys: ['Escape'], description: 'Reset current test', icon: RotateCcw, category: 'typing' },
  { keys: ['Ctrl', 'R'], description: 'Restart with new text', icon: RotateCcw, category: 'typing' },
  { keys: ['Ctrl', 'P'], description: 'Pause / Resume test', icon: Pause, category: 'typing' },
  
  // Navigation
  { keys: ['Tab'], description: 'Move to next option', icon: ArrowRightLeft, category: 'navigation' },
  { keys: ['Shift', 'Tab'], description: 'Move to previous option', icon: ArrowRightLeft, category: 'navigation' },
  { keys: ['↑', '↓'], description: 'Adjust time duration', icon: ArrowUp, category: 'navigation' },
  { keys: ['Ctrl', 'Home'], description: 'Go to top of page', icon: ArrowUp, category: 'navigation' },
  
  // General
  { keys: ['Ctrl', '/'], description: 'Open shortcuts modal', icon: Command, category: 'general' },
  { keys: ['Ctrl', 'S'], description: 'Download certificate (after test)', icon: Zap, category: 'general' },
  { keys: ['F11'], description: 'Toggle fullscreen mode', icon: Zap, category: 'general' },
  { keys: ['Ctrl', 'Shift', 'T'], description: 'Toggle theme', icon: Zap, category: 'general' },
];

const KeyboardShortcutsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for Ctrl+/ to open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderKey = (key: string) => (
    <span 
      key={key}
      className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-muted border border-border rounded-md text-xs font-mono font-semibold text-foreground shadow-sm"
    >
      {key}
    </span>
  );

  const getCategoryShortcuts = (category: string) => 
    shortcuts.filter(s => s.category === category);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label="Keyboard shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Shortcuts</span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
            Ctrl + /
          </kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Master these shortcuts to navigate and control typing tests like a pro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Typing Controls */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              <Play className="w-4 h-4" />
              Typing Controls
            </h3>
            <div className="grid gap-2">
              {getCategoryShortcuts('typing').map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <shortcut.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {renderKey(key)}
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground text-xs">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              <ArrowRightLeft className="w-4 h-4" />
              Navigation
            </h3>
            <div className="grid gap-2">
              {getCategoryShortcuts('navigation').map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <shortcut.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {renderKey(key)}
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground text-xs">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* General */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              <Command className="w-4 h-4" />
              General
            </h3>
            <div className="grid gap-2">
              {getCategoryShortcuts('general').map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <shortcut.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {renderKey(key)}
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground text-xs">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pro Tips */}
          <section className="border-t border-border pt-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              <Zap className="w-4 h-4" />
              Pro Tips
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl + Enter</kbd> to quickly start a new test without using the mouse
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Escape</kbd> anytime to reset and start fresh
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Focus on accuracy first – speed will naturally improve with practice
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Keep your fingers on the home row (ASDF JKL;) for optimal typing efficiency
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
