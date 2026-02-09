import { FileText } from 'lucide-react';
import { Difficulty, TestMode, Language } from '@/hooks/useTypingTest';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChallengeDropdown, { ChallengeSettings } from './ChallengeDropdown';

interface OptionsProps {
  totalTime: number;
  difficulty: Difficulty;
  customText: string;
  testMode: TestMode;
  language: Language;
  challengeSettings: ChallengeSettings;
  onTimeChange: (time: number) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onCustomTextChange: (text: string) => void;
  onTestModeChange: (mode: TestMode) => void;
  onLanguageChange: (lang: Language) => void;
  onChallengeChange: (settings: ChallengeSettings) => void;
  disabled?: boolean;
}

const timeOptions = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '1 Min' },
  { value: 120, label: '2 Min' },
  { value: 300, label: '5 Min' },
  { value: 600, label: '10 Min' },
  { value: 900, label: '15 Min' },
  { value: 1200, label: '20 Min' },
  { value: 1500, label: '25 Min' },
  { value: 1800, label: '30 Min' },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'custom', label: 'Custom' },
];

const testModeOptions: { value: TestMode; label: string }[] = [
  { value: 'words', label: 'Words' },
  { value: 'sentences', label: 'Sentences' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'quotes', label: 'Quotes' },
  { value: 'programming', label: 'Programming' },
];

const languageOptions: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'hinglish', label: 'Hinglish' },
];

const Options = ({ 
  totalTime, 
  difficulty, 
  customText, 
  testMode, 
  language,
  challengeSettings,
  onTimeChange, 
  onDifficultyChange, 
  onCustomTextChange, 
  onTestModeChange, 
  onLanguageChange,
  onChallengeChange,
  disabled 
}: OptionsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempCustomText, setTempCustomText] = useState(customText);

  const handleDifficultySelect = (value: string) => {
    if (value === 'custom') {
      setTempCustomText(customText);
      setDialogOpen(true);
    } else {
      onDifficultyChange(value as Difficulty);
    }
  };

  const handleSaveCustomText = () => {
    onCustomTextChange(tempCustomText);
    onDifficultyChange('custom');
    setDialogOpen(false);
  };

  const selectedDurationLabel = timeOptions.find(option => option.value === totalTime)?.label ?? `${totalTime}s`;
  const selectedModeLabel = testModeOptions.find(option => option.value === testMode)?.label ?? testMode;
  const selectedDifficultyLabel = difficultyOptions.find(option => option.value === difficulty)?.label ?? difficulty;
  const selectedLanguageLabel = languageOptions.find(option => option.value === language)?.label ?? language;

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      {/* Labels - Only show on desktop */}
      <div className="hidden lg:grid grid-cols-5 gap-2 px-1 text-xs uppercase tracking-wide font-semibold text-muted-foreground">
        <span>Duration</span>
        <span>Mode</span>
        <span>Difficulty</span>
        <span>Language</span>
        <span>Challenges</span>
      </div>

      {/* Mobile: 2x3 Grid Layout */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:hidden">
        {/* Duration */}
        <Select value={totalTime.toString()} onValueChange={(value) => onTimeChange(Number(value))} disabled={disabled}>
          <SelectTrigger className="h-10 text-xs sm:text-sm border-2 border-emerald-400/50 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 text-foreground font-medium px-2 sm:px-3 py-1 shadow-[0_0_0_2px_rgba(16,185,129,0.25)] hover:shadow-[0_0_0_3px_rgba(16,185,129,0.4)] rounded-lg">
            <SelectValue>{selectedDurationLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map(option => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mode */}
        <Select value={testMode} onValueChange={(value) => onTestModeChange(value as TestMode)} disabled={disabled}>
          <SelectTrigger className="h-10 text-xs sm:text-sm border-2 border-sky-400/50 bg-gradient-to-r from-sky-500/15 via-blue-500/15 to-indigo-500/15 text-foreground font-medium px-2 sm:px-3 py-1 shadow-[0_0_0_2px_rgba(59,130,246,0.25)] hover:shadow-[0_0_0_3px_rgba(59,130,246,0.4)] rounded-lg">
            <SelectValue>{selectedModeLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {testModeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select value={difficulty} onValueChange={handleDifficultySelect} disabled={disabled}>
          <SelectTrigger className="h-10 text-xs sm:text-sm border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 text-foreground font-medium px-2 sm:px-3 py-1 shadow-[0_0_0_2px_rgba(245,158,11,0.25)] hover:shadow-[0_0_0_3px_rgba(245,158,11,0.4)] rounded-lg">
            <SelectValue>{selectedDifficultyLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.value === 'custom' && <FileText className="w-3 h-3 inline mr-1" />}
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Language */}
        <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)} disabled={disabled}>
          <SelectTrigger className="h-10 text-xs sm:text-sm border-2 border-fuchsia-400/50 bg-gradient-to-r from-fuchsia-500/15 via-purple-500/15 to-violet-500/15 text-foreground font-medium px-2 sm:px-3 py-1 shadow-[0_0_0_2px_rgba(217,70,239,0.25)] hover:shadow-[0_0_0_3px_rgba(217,70,239,0.4)] rounded-lg">
            <SelectValue>{selectedLanguageLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Challenge - Full Width */}
        <div className="col-span-2">
          <ChallengeDropdown 
            settings={challengeSettings}
            onChange={onChallengeChange}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Tablet & Desktop: Flex Row Layout */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-3">
        {/* Duration */}
        <Select value={totalTime.toString()} onValueChange={(value) => onTimeChange(Number(value))} disabled={disabled}>
          <SelectTrigger className="h-11 w-[140px] border-2 border-emerald-400/50 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 text-foreground text-sm font-medium px-4 py-2 shadow-[0_0_0_2px_rgba(16,185,129,0.25)] hover:shadow-[0_0_0_3px_rgba(16,185,129,0.4)] rounded-lg">
            <SelectValue>{selectedDurationLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map(option => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Separator */}
        <div className="w-px h-8 bg-border" />

        {/* Mode */}
        <Select value={testMode} onValueChange={(value) => onTestModeChange(value as TestMode)} disabled={disabled}>
          <SelectTrigger className="h-11 w-[140px] border-2 border-sky-400/50 bg-gradient-to-r from-sky-500/15 via-blue-500/15 to-indigo-500/15 text-foreground text-sm font-medium px-4 py-2 shadow-[0_0_0_2px_rgba(59,130,246,0.25)] hover:shadow-[0_0_0_3px_rgba(59,130,246,0.4)] rounded-lg">
            <SelectValue>{selectedModeLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {testModeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Separator */}
        <div className="w-px h-8 bg-border" />

        {/* Difficulty */}
        <Select value={difficulty} onValueChange={handleDifficultySelect} disabled={disabled}>
          <SelectTrigger className="h-11 w-[140px] border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 text-foreground text-sm font-medium px-4 py-2 shadow-[0_0_0_2px_rgba(245,158,11,0.25)] hover:shadow-[0_0_0_3px_rgba(245,158,11,0.4)] rounded-lg">
            <SelectValue>{selectedDifficultyLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.value === 'custom' && <FileText className="w-3 h-3 inline mr-1" />}
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Separator */}
        <div className="w-px h-8 bg-border" />

        {/* Language */}
        <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)} disabled={disabled}>
          <SelectTrigger className="h-11 w-[140px] border-2 border-fuchsia-400/50 bg-gradient-to-r from-fuchsia-500/15 via-purple-500/15 to-violet-500/15 text-foreground text-sm font-medium px-4 py-2 shadow-[0_0_0_2px_rgba(217,70,239,0.25)] hover:shadow-[0_0_0_3px_rgba(217,70,239,0.4)] rounded-lg">
            <SelectValue>{selectedLanguageLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Separator */}
        <div className="w-px h-8 bg-border" />

        {/* Challenge */}
        <ChallengeDropdown 
          settings={challengeSettings}
          onChange={onChallengeChange}
          disabled={disabled}
        />
      </div>

      {/* Custom Text Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Enter Custom Text
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste or type your custom text here... (minimum 20 characters)"
              value={tempCustomText}
              onChange={(e) => setTempCustomText(e.target.value)}
              className="min-h-[150px] sm:min-h-[200px] resize-none text-sm"
            />
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {tempCustomText.length} characters
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveCustomText}
                  disabled={tempCustomText.trim().length < 20}
                  className="flex-1 sm:flex-none gradient-bg"
                >
                  Use This Text
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Options;
