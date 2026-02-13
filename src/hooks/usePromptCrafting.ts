import { useState, useCallback } from 'react';
import { storageManager } from '@/lib/storageManager';
import {
  PromptChallenge,
  ChallengeDifficulty,
  PROMPT_CHALLENGES,
  getRandomChallenge,
  getChallengesByDifficulty,
  STRUCTURE_PATTERNS,
} from '@/data/promptChallenges';

// ─── Types ───────────────────────────────────────────────────

export type PromptScore = 'ai-master' | 'prompt-engineer' | 'prompt-learner' | 'beginner';

export interface PromptCraftingResult {
  score: PromptScore;
  label: string;
  emoji: string;
  color: string;
  wpm: number;
  accuracy: number;
  finalScore: number;         // (WPM × 0.7) + (KeywordBonus × 0.3)
  keywordBonus: number;       // (found / required) × 100
  keywordsFound: string[];
  keywordsMissed: string[];
  bonusKeywords: string[];
  structureDetected: { role: boolean; instruction: boolean; format: boolean };
  challengeId: number;
  challengeTitle: string;
  difficulty: ChallengeDifficulty;
  feedback: string;
  suggestions: string[];
  isValid: boolean;           // false if <30 chars or <5 sec
  invalidReason?: string;
  // Legacy compat
  essentialFound: string[];
  essentialMissed: string[];
  bonusFound: string[];
}

export interface PromptCraftingHistory {
  score: PromptScore;
  wpm: number;
  finalScore: number;
  keywordBonus: number;
  challengeId: number;
  difficulty: ChallengeDifficulty;
  date: string;
}

// ─── Bonus keywords (advanced prompt engineering terms) ──────

const BONUS_KEYWORDS = [
  'structured', 'comparison', 'workflow', 'comprehensive', 'practical',
  'specific', 'template', 'categorize', 'analyze', 'process',
  'context', 'constraints', 'output', 'tone', 'audience',
];

// ─── Hook ────────────────────────────────────────────────────

export function usePromptCrafting() {
  const [currentChallenge, setCurrentChallenge] = useState<PromptChallenge | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | null>(null);

  /**
   * Pick a challenge — random or by difficulty
   */
  const selectChallenge = useCallback((difficulty?: ChallengeDifficulty): PromptChallenge => {
    const challenge = getRandomChallenge(difficulty);
    setCurrentChallenge(challenge);
    if (difficulty) setSelectedDifficulty(difficulty);
    return challenge;
  }, []);

  /**
   * Get prompt template text for the typing area.
   * Always picks a NEW random challenge so tests rotate.
   */
  const getPromptTemplate = useCallback((): string => {
    const challenge = getRandomChallenge(selectedDifficulty || undefined);
    setCurrentChallenge(challenge);
    return challenge.targetText;
  }, [selectedDifficulty]);

  /**
   * Get current challenge info for UI display
   */
  const getChallengeInfo = useCallback(() => {
    return currentChallenge;
  }, [currentChallenge]);

  // ─── Evaluation (runs on Submit / test complete) ────────

  const evaluatePrompt = useCallback((
    typedText: string,
    wpm: number,
    accuracy: number,
    timeTakenSeconds?: number,
  ): PromptCraftingResult => {
    const challenge = currentChallenge || getRandomChallenge();
    const lowerText = typedText.toLowerCase();

    // Step 8: Validity check — min 30 chars, min 5 seconds
    const charCount = typedText.trim().length;
    const timeOk = timeTakenSeconds === undefined || timeTakenSeconds >= 5;
    const isValid = charCount >= 30 && timeOk;
    const invalidReason = !isValid
      ? charCount < 30
        ? `Too short — typed only ${charCount} characters (minimum 30 required).`
        : 'Test completed too quickly (minimum 5 seconds required).'
      : undefined;

    // Step 4 & 5: Keyword detection (case insensitive)
    const keywordsFound = challenge.requiredKeywords.filter(kw =>
      lowerText.includes(kw.toLowerCase())
    );
    const keywordsMissed = challenge.requiredKeywords.filter(kw =>
      !lowerText.includes(kw.toLowerCase())
    );

    // Bonus keywords
    const bonusKeywords = BONUS_KEYWORDS.filter(kw => lowerText.includes(kw));

    // Step 12: Structure detection (role / instruction / format)
    const structureDetected = {
      role: STRUCTURE_PATTERNS.role.test(typedText),
      instruction: STRUCTURE_PATTERNS.instruction.test(typedText),
      format: STRUCTURE_PATTERNS.format.test(typedText),
    };

    // Step 6: KeywordBonus = (found / required) × 100
    const keywordBonus = challenge.requiredKeywords.length > 0
      ? Math.round((keywordsFound.length / challenge.requiredKeywords.length) * 100)
      : 0;

    // Step 7: FinalScore = (WPM × 0.7) + (KeywordBonus × 0.3)
    const finalScore = isValid
      ? Math.round((wpm * 0.7) + (keywordBonus * 0.3))
      : 0;

    // Score tier
    let score: PromptScore;
    let label: string;
    let emoji: string;
    let color: string;

    if (!isValid) {
      score = 'beginner';
      label = 'Invalid';
      emoji = '⚠️';
      color = 'text-red-400';
    } else if (wpm >= 60 && keywordBonus >= 60 && accuracy >= 90) {
      score = 'ai-master';
      label = 'AI Master';
      emoji = '🧠';
      color = 'text-purple-400';
    } else if (wpm >= 40 && keywordBonus >= 40 && accuracy >= 85) {
      score = 'prompt-engineer';
      label = 'Prompt Engineer';
      emoji = '⚡';
      color = 'text-cyan-400';
    } else if (keywordBonus >= 30 || wpm >= 30) {
      score = 'prompt-learner';
      label = 'Prompt Learner';
      emoji = '📚';
      color = 'text-yellow-400';
    } else {
      score = 'beginner';
      label = 'Beginner';
      emoji = '🌱';
      color = 'text-green-400';
    }

    // Step 10: Feedback + Suggestions
    const feedback = buildFeedback(score, wpm, keywordsFound.length, challenge.requiredKeywords.length, finalScore, isValid, invalidReason);
    const suggestions = buildSuggestions(keywordsMissed, structureDetected, bonusKeywords.length);

    // Step 13: Save history
    if (isValid) {
      const entry: PromptCraftingHistory = {
        score,
        wpm,
        finalScore,
        keywordBonus,
        challengeId: challenge.id,
        difficulty: challenge.difficulty,
        date: new Date().toISOString(),
      };
      storageManager.savePromptCraftingScore(entry);
    }

    return {
      score,
      label,
      emoji,
      color,
      wpm,
      accuracy,
      finalScore,
      keywordBonus,
      keywordsFound,
      keywordsMissed,
      bonusKeywords,
      structureDetected,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      difficulty: challenge.difficulty,
      feedback,
      suggestions,
      isValid,
      invalidReason,
      // Legacy compat (Index.tsx uses these names)
      essentialFound: keywordsFound,
      essentialMissed: keywordsMissed,
      bonusFound: bonusKeywords,
    };
  }, [currentChallenge]);

  // ─── History ────────────────────────────────────────────

  const getHistory = useCallback((): PromptCraftingHistory[] => {
    return storageManager.getPromptCraftingScores() as PromptCraftingHistory[];
  }, []);

  // ─── Available challenges ──────────────────────────────

  const getAllChallenges = useCallback(() => PROMPT_CHALLENGES, []);
  const getChallengesForDifficulty = useCallback((d: ChallengeDifficulty) => getChallengesByDifficulty(d), []);

  return {
    // Challenge selection
    currentChallenge,
    selectedDifficulty,
    selectChallenge,
    getChallengeInfo,
    getAllChallenges,
    getChallengesForDifficulty,

    // Typing test integration
    getPromptTemplate,

    // Evaluation
    evaluatePrompt,

    // History
    getHistory,

    // Constants for UI
    BONUS_KEYWORDS,
  };
}

// ─── Helper: Build feedback message ──────────────────────────

function buildFeedback(
  score: PromptScore,
  wpm: number,
  found: number,
  total: number,
  finalScore: number,
  isValid: boolean,
  invalidReason?: string,
): string {
  if (!isValid) {
    return `❌ Score invalid: ${invalidReason}`;
  }

  switch (score) {
    case 'ai-master':
      return `Exceptional! ${wpm} WPM with ${found}/${total} keywords. Final Score: ${finalScore}. You think and type like a pro prompt engineer!`;
    case 'prompt-engineer':
      return `Great work! ${found}/${total} keywords captured at ${wpm} WPM. Final Score: ${finalScore}. Strong prompt crafting skills!`;
    case 'prompt-learner':
      return `Good progress! Final Score: ${finalScore}. You found ${found}/${total} keywords. Keep practicing to improve speed and coverage!`;
    default:
      return `Keep practicing! Final Score: ${finalScore}. Try using AI prompt phrases like "Act as", "Explain", "Format as" — building blocks of prompts!`;
  }
}

// ─── Helper: Build suggestions list ─────────────────────────

function buildSuggestions(
  missed: string[],
  structure: { role: boolean; instruction: boolean; format: boolean },
  bonusCount: number,
): string[] {
  const suggestions: string[] = [];

  if (!structure.role) {
    suggestions.push('Start with a role: "Act as a [role]"');
  }
  if (!structure.instruction) {
    suggestions.push('Add a clear task: "Explain...", "Create...", "Analyze..."');
  }
  if (!structure.format) {
    suggestions.push('Specify output format: "Format as...", "In bullet points"');
  }
  if (missed.length > 0) {
    suggestions.push(`Try using: ${missed.map(k => `"${k}"`).join(', ')}`);
  }
  if (bonusCount === 0) {
    suggestions.push('Add advanced terms like "structured", "comprehensive", "workflow"');
  }

  return suggestions.slice(0, 4);
}
