import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type Challenge =
  | 'none'
  | 'one-line-only'
  | 'focus-strip'
  | 'ghost-text'
  | 'mirror-mode'
  | 'moving-target'
  | 'no-backspace'
  | 'error-freeze'
  | 'last-chance'
  | 'calm-mode'
  | 'encryption'
  | 'memory-mode'
  | 'blind-start'
  | 'reverse-words'
  | 'word-shuffle'
  | 'podcast-mode'
  | 'speed-lock'
  | 'turbo-end'
  | 'sudden-shift'
  | 'vanishing-words'
  | 'prompt-crafting'
  | 'stamina-mode'
  | 'pressure-mode'
  | 'ai-heatmap'
  | 'ghost-racing'
  | 'hardcore-mode'
  | 'custom';

interface ChallengeInfo {
  id: Challenge;
  name: string;
  description: string;
}

export const challenges: ChallengeInfo[] = [
  { id: 'none', name: 'No Challenge', description: 'Just plain typing.' },
  { id: 'one-line-only', name: 'One Line Only', description: 'The text appears in a narrow slit.' },
  { id: 'focus-strip', name: 'Focus Strip', description: 'Only the current word is in a spotlight.' },
  { id: 'ghost-text', name: 'Ghost Text', description: 'Characters fade shortly after you type them.' },
  { id: 'mirror-mode', name: 'Mirror Mode', description: 'The entire UI is flipped horizontally.' },
  { id: 'moving-target', name: 'Moving Target', description: 'The text box floats around the screen.' },
  { id: 'no-backspace', name: 'No Backspace', description: 'The backspace key is disabled.' },
  { id: 'error-freeze', name: 'Error Freeze', description: 'You must fix errors to continue.' },
  { id: 'last-chance', name: 'Last Chance', description: 'The test fails after 3 errors.' },
  { id: 'calm-mode', name: 'Calm Mode', description: 'A minimalist UI with no stats.' },
  { id: 'encryption', name: 'Encryption', description: 'The text is displayed as random symbols.' },
  { id: 'memory-mode', name: 'Memory Mode', description: 'Text disappears after a few seconds.' },
  { id: 'blind-start', name: 'Blind Start', description: 'The first few lines are blurred.' },
  { id: 'reverse-words', name: 'Reverse Words', description: 'Each word is spelled backwards.' },
  { id: 'word-shuffle', name: 'Word Shuffle', description: 'The text re-arranges itself periodically.' },
  { id: 'podcast-mode', name: 'Podcast Mode', description: 'Type what you hear from an audio clip.' },
  { id: 'speed-lock', name: 'Speed Lock', description: 'You must maintain a minimum speed.' },
  { id: 'turbo-end', name: 'Turbo End', description: 'The timer speeds up near the end.' },
  { id: 'sudden-shift', name: 'Sudden Shift', description: 'Font size and case change randomly.' },
  { id: 'vanishing-words', name: 'Vanishing Words', description: 'Words disappear after you type them.' },
  { id: 'prompt-crafting', name: 'Prompt Crafting', description: 'Type text that looks like code.' },
  { id: 'stamina-mode', name: 'Stamina Mode', description: 'A long-duration test to build endurance.' },
  { id: 'pressure-mode', name: 'Pressure Mode', description: 'The screen shakes when you make an error.' },
  { id: 'ai-heatmap', name: 'AI Heatmap', description: 'Practice the keys you miss most.' },
  { id: 'ghost-racing', name: 'Ghost Racing', description: 'Race against your personal best.' },
  { id: 'hardcore-mode', name: 'Hardcore Mode', description: 'One mistake and the test is over.' },
  { id: 'custom', name: 'Custom...', description: 'Create your own challenge.' },
];

interface ChallengeDropdownProps {
  onChallengeChange: (challenge: Challenge) => void;
}

export function ChallengeDropdown({ onChallengeChange }: ChallengeDropdownProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>('none');

  const handleValueChange = (value: string) => {
    const challengeId = value as Challenge;
    setSelectedChallenge(challengeId);
    onChallengeChange(challengeId);
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={selectedChallenge}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a challenge" />
      </SelectTrigger>
      <SelectContent>
        {challenges.map((challenge) => (
          <SelectItem key={challenge.id} value={challenge.id}>
            {challenge.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
