import { Zap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';

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
  movingTarget: boolean;
  
  // Challenge Modes
  turboEnd: boolean;
  pressureMode: boolean;
  staminaMode: boolean;
  
  // Advanced Challenges
  encryption: boolean;
  podcastMode: boolean;
  promptCrafting: boolean;
  aiHeatmap: boolean;
  ghostRacing: boolean;
  hardcoreMode: boolean;
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
  movingTarget: false,
  turboEnd: false,
  pressureMode: false,
  staminaMode: false,
  encryption: false,
  podcastMode: false,
  promptCrafting: false,
  aiHeatmap: false,
  ghostRacing: false,
  hardcoreMode: false,
};

const challengePresets = [
  { value: 'none', label: 'No Challenges', icon: '🎯' },
  { value: 'ai-features', label: 'AI Features', icon: '🤖' },
  { value: 'beginner', label: 'Beginner', icon: '🌱' },
  { value: 'focus', label: 'Focus Master', icon: '👁️' },
  { value: 'speed', label: 'Speed Demon', icon: '⚡' },
  { value: 'memory', label: 'Memory Test', icon: '🧠' },
  { value: 'hardcore', label: 'Hardcore', icon: '💀' },
  { value: 'custom', label: 'Custom...', icon: '⚙️' },
];

interface ChallengeDropdownProps {
  settings: ChallengeSettings;
  onChange: (settings: ChallengeSettings) => void;
  disabled?: boolean;
}

const ChallengeDropdown = ({ settings, onChange, disabled }: ChallengeDropdownProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<string>('none');

  const activeCount = Object.values(settings).filter(Boolean).length;

  const getSelectedLabel = () => {
    if (activeCount === 0) return 'No Challenges';
    if (currentPreset !== 'none' && currentPreset !== 'custom') {
      return challengePresets.find(p => p.value === currentPreset)?.label || 'Custom';
    }
    return `${activeCount} Active`;
  };

  const applyPreset = (preset: string) => {
    setCurrentPreset(preset);
    
    switch (preset) {
      case 'none':
        onChange(defaultChallengeSettings);
        setDialogOpen(false);
        break;
        
      case 'ai-features':
        onChange({
          ...defaultChallengeSettings,
          podcastMode: true,
          promptCrafting: true,
          aiHeatmap: true,
          ghostRacing: true,
        });
        setDialogOpen(false);
        break;
        
      case 'beginner':
        onChange({
          ...defaultChallengeSettings,
          calmMode: true,
          focusStrip: true,
        });
        setDialogOpen(false);
        break;
        
      case 'focus':
        onChange({
          ...defaultChallengeSettings,
          oneLineOnly: true,
          focusStrip: true,
          ghostText: true,
        });
        setDialogOpen(false);
        break;
        
      case 'speed':
        onChange({
          ...defaultChallengeSettings,
          speedLock: true,
          turboEnd: true,
          noBackspace: true,
        });
        setDialogOpen(false);
        break;
        
      case 'memory':
        onChange({
          ...defaultChallengeSettings,
          memoryMode: true,
          blindStart: true,
          vanishingWords: true,
        });
        setDialogOpen(false);
        break;
        
      case 'hardcore':
        onChange({
          ...defaultChallengeSettings,
          noBackspace: true,
          errorFreeze: true,
          lastChance: true,
          speedLock: true,
          turboEnd: true,
          pressureMode: true,
        });
        setDialogOpen(false);
        break;
        
      case 'custom':
        setDialogOpen(true);
        break;
    }
  };

  const handleToggle = (key: keyof ChallengeSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    onChange(newSettings);
    setCurrentPreset('custom');
  };

  return (
    <>
      <Select 
        value={currentPreset} 
        onValueChange={applyPreset} 
        disabled={disabled}
      >
        <SelectTrigger className="h-11 w-[165px] border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-500/15 via-orange-500/15 to-red-500/15 text-foreground text-sm font-medium px-4 py-2 shadow-[0_0_0_2px_rgba(234,179,8,0.25)] hover:shadow-[0_0_0_3px_rgba(234,179,8,0.4)] rounded-lg">
          <SelectValue>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {getSelectedLabel()}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {challengePresets.map(preset => (
            <SelectItem key={preset.value} value={preset.value}>
              <span className="flex items-center gap-2">
                <span>{preset.icon}</span>
                {preset.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Challenge Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Custom Challenge Configuration
            </DialogTitle>
            <DialogDescription>
              Select specific challenges to activate. Combine multiple for extreme difficulty!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* AI Features - NEW! */}
            <div className="space-y-3 border-2 border-cyan-500/30 rounded-lg p-4 bg-cyan-500/5">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-cyan-400">🤖</span>
                <span className="text-cyan-300">AI Features</span>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full font-bold">NEW</span>
              </h3>
              <div className="space-y-2 pl-6">
                <CheckboxItem 
                  label="Podcast Mode"
                  checked={settings.podcastMode}
                  onToggle={() => handleToggle('podcastMode')}
                  description="Listen & type blindly (TTS)"
                />
                <CheckboxItem 
                  label="Prompt Crafting"
                  checked={settings.promptCrafting}
                  onToggle={() => handleToggle('promptCrafting')}
                  description="Practice AI prompt engineering"
                />
                <CheckboxItem 
                  label="AI Heatmap"
                  checked={settings.aiHeatmap}
                  onToggle={() => handleToggle('aiHeatmap')}
                  description="Track keystroke latency per key"
                />
                <CheckboxItem 
                  label="Ghost Racing"
                  checked={settings.ghostRacing}
                  onToggle={() => handleToggle('ghostRacing')}
                  description="Race against your PB ghost"
                />
              </div>
            </div>

            {/* Focus Modes */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-blue-400">👁️</span>
                Focus Modes
              </h3>
              <div className="space-y-2 pl-6">
                <CheckboxItem 
                  label="One Line Only"
                  checked={settings.oneLineOnly}
                  onToggle={() => handleToggle('oneLineOnly')}
                  description="Show only current line"
                />
                <CheckboxItem 
                  label="Focus Strip"
                  checked={settings.focusStrip}
                  onToggle={() => handleToggle('focusStrip')}
                  description="Highlight current word only"
                />
                <CheckboxItem 
                  label="Calm Mode"
                  checked={settings.calmMode}
                  onToggle={() => handleToggle('calmMode')}
                  description="Hide timer pressure"
                />
                <CheckboxItem 
                  label="Ghost Text"
                  checked={settings.ghostText}
                  onToggle={() => handleToggle('ghostText')}
                  description="Text fades as you type"
                />
              </div>
            </div>

            {/* Control Rules */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-red-400">🚫</span>
                Control Rules
              </h3>
              <div className="space-y-2 pl-6">
                <CheckboxItem 
                  label="No Backspace"
                  checked={settings.noBackspace}
                  onToggle={() => handleToggle('noBackspace')}
                  description="Backspace disabled"
                />
                <CheckboxItem 
                  label="Error Freeze"
                  checked={settings.errorFreeze}
                  onToggle={() => handleToggle('errorFreeze')}
                  description="Fix errors before continuing"
                />
                <CheckboxItem 
                  label="Speed Lock"
                  checked={settings.speedLock}
                  onToggle={() => handleToggle('speedLock')}
                  description="Maintain 30+ WPM"
                />
                <CheckboxItem 
                  label="Last Chance"
                  checked={settings.lastChance}
                  onToggle={() => handleToggle('lastChance')}
                  description="Only 3 errors allowed"
                />
              </div>
            </div>

            {/* Word Behavior */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-purple-400">🔀</span>
                Word Behavior
              </h3>
              <div className="space-y-2 pl-6">
                <CheckboxItem 
                  label="Reverse Words"
                  checked={settings.reverseWords}
                  onToggle={() => handleToggle('reverseWords')}
                  description="Type in reverse order"
                />
                <CheckboxItem 
                  label="Word Shuffle"
                  checked={settings.wordShuffle}
                  onToggle={() => handleToggle('wordShuffle')}
                  description="Words change position"
                />
                <CheckboxItem 
                  label="Sudden Shift"
                  checked={settings.suddenShift}
                  onToggle={() => handleToggle('suddenShift')}
                  description="Random case changes"
                />
                <CheckboxItem 
                  label="Vanishing Words"
                  checked={settings.vanishingWords}
                  onToggle={() => handleToggle('vanishingWords')}
                  description="Words disappear after typing"
                />
              </div>
            </div>

            {/* Memory & Vision */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-green-400">🧠</span>
                Memory & Vision
              </h3>
              <div className="space-y-2 pl-6">
                <CheckboxItem 
                  label="Memory Mode"
                  checked={settings.memoryMode}
                  onToggle={() => handleToggle('memoryMode')}
                  description="Text hides after 5 seconds"
                />
                <CheckboxItem 
                  label="Blind Start"
                  checked={settings.blindStart}
                  onToggle={() => handleToggle('blindStart')}
                  description="First 10 seconds hidden"
                />
                <CheckboxItem 
                  label="Mirror Mode"
                  checked={settings.mirrorMode}
                  onToggle={() => handleToggle('mirrorMode')}
                  description="Horizontally flipped text"
                />
                <CheckboxItem 
                  label="Moving Target"
                  checked={settings.movingTarget}
                  onToggle={() => handleToggle('movingTarget')}
                  description="Text box floats around"
                />
              </div>
            </div>

            {/* Challenge Modes */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                Extreme Challenges
              </h3>
              <div className="space-y-2 pl-6">
                <CheckboxItem 
                  label="Turbo End"
                  checked={settings.turboEnd}
                  onToggle={() => handleToggle('turboEnd')}
                  description="Timer speeds up 2x at 20%"
                />
                <CheckboxItem 
                  label="Pressure Mode"
                  checked={settings.pressureMode}
                  onToggle={() => handleToggle('pressureMode')}
                  description="Screen shakes with errors"
                />
                <CheckboxItem 
                  label="Stamina Mode"
                  checked={settings.staminaMode}
                  onToggle={() => handleToggle('staminaMode')}
                  description="Minimum 5-minute test"
                />
                <CheckboxItem 
                  label="Encryption"
                  checked={settings.encryption}
                  onToggle={() => handleToggle('encryption')}
                  description="Text displayed as symbols"
                />
                <CheckboxItem 
                  label="Hardcore Mode"
                  checked={settings.hardcoreMode}
                  onToggle={() => handleToggle('hardcoreMode')}
                  description="One mistake = game over"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {Object.values(settings).filter(Boolean).length} challenges active
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onChange(defaultChallengeSettings)}>
                Clear All
              </Button>
              <Button onClick={() => setDialogOpen(false)} className="gradient-bg">
                Apply Challenges
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
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
  <label className="flex items-start gap-3 cursor-pointer hover:bg-accent/30 p-2 rounded transition-colors">
    <Checkbox
      checked={checked}
      onCheckedChange={onToggle}
      className="mt-0.5"
    />
    <div className="flex-1">
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  </label>
);

export default ChallengeDropdown;
