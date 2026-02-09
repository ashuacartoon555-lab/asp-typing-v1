import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Eye, Brain, Lock, Shuffle } from 'lucide-react';

export interface ChallengeSettings {
  // Focus Modes
  oneLineOnly: boolean;
  focusStrip: boolean;
  calmMode: boolean;
  ghostText: boolean;
  
  // Control Rules
  noBackspace: boolean;
  errorFreeze: boolean;
  speedLock: boolean;
  lastChance: boolean;
  
  // Word Behavior
  reverseWords: boolean;
  wordShuffle: boolean;
  suddenShift: boolean;
  vanishingWords: boolean;
  
  // Memory & Vision
  memoryMode: boolean;
  blindStart: boolean;
  mirrorMode: boolean;
  rhythmMode: boolean;
  
  // Challenge Modes
  turboEnd: boolean;
  pressureMode: boolean;
  staminaMode: boolean;
}

export const defaultChallengeSettings: ChallengeSettings = {
  oneLineOnly: false,
  focusStrip: false,
  calmMode: false,
  ghostText: false,
  noBackspace: false,
  errorFreeze: false,
  speedLock: false,
  lastChance: false,
  reverseWords: false,
  wordShuffle: false,
  suddenShift: false,
  vanishingWords: false,
  memoryMode: false,
  blindStart: false,
  mirrorMode: false,
  rhythmMode: false,
  turboEnd: false,
  pressureMode: false,
  staminaMode: false,
};

interface ChallengeModesProps {
  settings: ChallengeSettings;
  onChange: (settings: ChallengeSettings) => void;
  disabled?: boolean;
}

interface CategoryProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
}

const Category = ({ title, icon, iconColor, children }: CategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/30 rounded-lg overflow-hidden bg-card/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={iconColor}>{icon}</div>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="px-4 py-3 space-y-2 border-t border-border/20 bg-background/30">
          {children}
        </div>
      )}
    </div>
  );
};

const ChallengeModes = ({ settings, onChange, disabled }: ChallengeModesProps) => {
  const handleToggle = (key: keyof ChallengeSettings) => {
    onChange({ ...settings, [key]: !settings[key] });
  };

  const CheckboxItem = ({ 
    label, 
    checked, 
    onToggle, 
    description 
  }: { 
    label: string; 
    checked: boolean; 
    onToggle: () => void; 
    description: string;
  }) => (
    <label className="flex items-start gap-3 cursor-pointer hover:bg-accent/30 p-2 rounded transition-colors group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        disabled={disabled}
        className="mt-0.5 w-4 h-4 rounded border-border bg-background cursor-pointer disabled:opacity-50"
      />
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      </div>
    </label>
  );

  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Challenge Lab
        </h3>
        {activeCount > 0 && (
          <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full font-medium">
            {activeCount} Active
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Focus Modes */}
        <Category 
          title="🎯 Focus Modes" 
          icon={<Eye className="w-4 h-4" />} 
          iconColor="text-blue-400"
        >
          <CheckboxItem
            label="One Line Only"
            checked={settings.oneLineOnly}
            onToggle={() => handleToggle('oneLineOnly')}
            description="Display only one line at a time, keeping you ultra-focused"
          />
          <CheckboxItem
            label="Focus Strip"
            checked={settings.focusStrip}
            onToggle={() => handleToggle('focusStrip')}
            description="Highlight only the current word, blur the rest"
          />
          <CheckboxItem
            label="Calm Mode"
            checked={settings.calmMode}
            onToggle={() => handleToggle('calmMode')}
            description="Minimal distractions, no timer pressure, just flow"
          />
          <CheckboxItem
            label="Ghost Text"
            checked={settings.ghostText}
            onToggle={() => handleToggle('ghostText')}
            description="Text fades as you type it, train your memory"
          />
        </Category>

        {/* Control Rules */}
        <Category 
          title="🚫 Control Rules" 
          icon={<Lock className="w-4 h-4" />} 
          iconColor="text-red-400"
        >
          <CheckboxItem
            label="No Backspace"
            checked={settings.noBackspace}
            onToggle={() => handleToggle('noBackspace')}
            description="Backspace disabled - type carefully, no second chances"
          />
          <CheckboxItem
            label="Error Freeze"
            checked={settings.errorFreeze}
            onToggle={() => handleToggle('errorFreeze')}
            description="Can't continue typing until you fix the error"
          />
          <CheckboxItem
            label="Speed Lock"
            checked={settings.speedLock}
            onToggle={() => handleToggle('speedLock')}
            description="Must maintain minimum WPM or test auto-fails"
          />
          <CheckboxItem
            label="Last Chance"
            checked={settings.lastChance}
            onToggle={() => handleToggle('lastChance')}
            description="Only 3 errors allowed - 4th error ends the test"
          />
        </Category>

        {/* Word Behavior */}
        <Category 
          title="🔀 Word Behavior" 
          icon={<Shuffle className="w-4 h-4" />} 
          iconColor="text-purple-400"
        >
          <CheckboxItem
            label="Reverse Words"
            checked={settings.reverseWords}
            onToggle={() => handleToggle('reverseWords')}
            description="Type words in reverse order (right to left)"
          />
          <CheckboxItem
            label="Word Shuffle"
            checked={settings.wordShuffle}
            onToggle={() => handleToggle('wordShuffle')}
            description="Words randomly change position every few seconds"
          />
          <CheckboxItem
            label="Sudden Shift"
            checked={settings.suddenShift}
            onToggle={() => handleToggle('suddenShift')}
            description="Case randomly switches: LoWeR to UPPER mid-test"
          />
          <CheckboxItem
            label="Vanishing Words"
            checked={settings.vanishingWords}
            onToggle={() => handleToggle('vanishingWords')}
            description="Completed words disappear after 2 seconds"
          />
        </Category>

        {/* Memory & Vision */}
        <Category 
          title="🧠 Memory & Vision" 
          icon={<Brain className="w-4 h-4" />} 
          iconColor="text-green-400"
        >
          <CheckboxItem
            label="Memory Mode"
            checked={settings.memoryMode}
            onToggle={() => handleToggle('memoryMode')}
            description="Text shows for 5 seconds, then hides - type from memory"
          />
          <CheckboxItem
            label="Blind Start"
            checked={settings.blindStart}
            onToggle={() => handleToggle('blindStart')}
            description="First 10 seconds typing without seeing the text"
          />
          <CheckboxItem
            label="Mirror Mode"
            checked={settings.mirrorMode}
            onToggle={() => handleToggle('mirrorMode')}
            description="Text is horizontally flipped - decode while typing"
          />
          <CheckboxItem
            label="Rhythm Mode"
            checked={settings.rhythmMode}
            onToggle={() => handleToggle('rhythmMode')}
            description="Type to the beat - metronome enforces rhythm"
          />
        </Category>

        {/* Challenge Modes */}
        <Category 
          title="⚡ Challenge Modes" 
          icon={<Zap className="w-4 h-4" />} 
          iconColor="text-yellow-400"
        >
          <CheckboxItem
            label="Turbo End"
            checked={settings.turboEnd}
            onToggle={() => handleToggle('turboEnd')}
            description="Timer speeds up 2x in final 20% of test time"
          />
          <CheckboxItem
            label="Pressure Mode"
            checked={settings.pressureMode}
            onToggle={() => handleToggle('pressureMode')}
            description="Screen shake increases with each error"
          />
          <CheckboxItem
            label="Stamina Mode"
            checked={settings.staminaMode}
            onToggle={() => handleToggle('staminaMode')}
            description="Minimum 5-minute marathon test - no shortcuts"
          />
        </Category>
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => onChange(defaultChallengeSettings)}
          className="w-full text-xs py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear All Challenges
        </button>
      )}
    </div>
  );
};

export default ChallengeModes;
