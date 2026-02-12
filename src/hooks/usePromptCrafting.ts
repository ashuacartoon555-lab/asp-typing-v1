import { useMemo, useCallback } from 'react';
import { storageManager } from '@/lib/storageManager';

// Prompt engineering templates with essential keywords
const PROMPT_TEMPLATES = [
  "Act as a senior software engineer. Explain the concept of recursion in detail. Format as a step-by-step guide with examples.",
  "Act as a data analyst. Explain how to clean messy data. Format as a checklist. In the style of a practical tutorial.",
  "Act as a writing coach. Explain the principles of persuasive writing. Format as a structured outline with detailed tips.",
  "Act as a cybersecurity expert. Explain common vulnerabilities in web applications. Format as a categorized list.",
  "Act as a machine learning engineer. Explain the difference between supervised and unsupervised learning. Format as a comparison table.",
  "Act as a product manager. Explain the process of conducting user research. Format as a workflow diagram description. In the style of a handbook.",
  "Act as a database administrator. Explain indexing strategies for SQL databases. Format as a detailed guide with SQL examples.",
  "Act as a UX designer. Explain the Nielsen heuristics. Format as a numbered list. In the style of a reference card.",
  "Act as a DevOps engineer. Explain continuous integration and deployment pipelines. Format as a process flow. Detailed explanation required.",
  "Act as a project leader. Explain agile methodology practices. Format as a comprehensive guide. In the style of a startup playbook.",
  "Act as a technical writer. Explain how to write effective API documentation. Format as a template with examples.",
  "Act as a cloud architect. Explain microservices architecture patterns. Format as a detailed comparison of approaches.",
];

// Essential keywords for prompt engineering scoring
const ESSENTIAL_KEYWORDS = [
  'act as',
  'explain',
  'format',
  'detailed',
  'in the style of',
  'example',
  'step',
  'guide',
  'list',
  'describe',
];

// Bonus keywords for advanced scoring
const BONUS_KEYWORDS = [
  'structured',
  'comparison',
  'workflow',
  'comprehensive',
  'practical',
  'specific',
  'template',
  'categorize',
  'analyze',
  'process',
];

export type PromptScore = 'ai-master' | 'prompt-engineer' | 'prompt-learner' | 'beginner';

interface PromptCraftingResult {
  score: PromptScore;
  label: string;
  emoji: string;
  color: string;
  essentialFound: string[];
  essentialMissed: string[];
  bonusFound: string[];
  wpm: number;
  accuracy: number;
  feedback: string;
}

export function usePromptCrafting() {
  // Get a random prompt template
  const getPromptTemplate = useCallback((): string => {
    return PROMPT_TEMPLATES[Math.floor(Math.random() * PROMPT_TEMPLATES.length)];
  }, []);

  // Evaluate the typed text for prompt crafting quality
  const evaluatePrompt = useCallback((typedText: string, wpm: number, accuracy: number): PromptCraftingResult => {
    const lowerText = typedText.toLowerCase();

    // Check essential keywords
    const essentialFound = ESSENTIAL_KEYWORDS.filter(kw => lowerText.includes(kw));
    const essentialMissed = ESSENTIAL_KEYWORDS.filter(kw => !lowerText.includes(kw));

    // Check bonus keywords
    const bonusFound = BONUS_KEYWORDS.filter(kw => lowerText.includes(kw));

    // Calculate score tier
    const essentialRatio = essentialFound.length / ESSENTIAL_KEYWORDS.length;
    const hasBonus = bonusFound.length >= 2;

    let score: PromptScore;
    let label: string;
    let emoji: string;
    let color: string;
    let feedback: string;

    if (wpm >= 60 && essentialRatio >= 0.6 && accuracy >= 90) {
      score = 'ai-master';
      label = 'AI Master';
      emoji = '🧠';
      color = 'text-purple-400';
      feedback = `Exceptional! You typed at ${wpm} WPM with ${essentialFound.length} essential keywords. You think and type like a pro prompt engineer!`;
    } else if (wpm >= 40 && essentialRatio >= 0.4 && accuracy >= 85) {
      score = 'prompt-engineer';
      label = 'Prompt Engineer';
      emoji = '⚡';
      color = 'text-cyan-400';
      feedback = `Great work! ${essentialFound.length} keywords captured at ${wpm} WPM. You're building strong prompt crafting skills!`;
    } else if (essentialRatio >= 0.3 || wpm >= 30) {
      score = 'prompt-learner';
      label = 'Prompt Learner';
      emoji = '📚';
      color = 'text-yellow-400';
      feedback = `Good progress! Focus on including keywords like: ${essentialMissed.slice(0, 3).join(', ')}. Speed will come with practice!`;
    } else {
      score = 'beginner';
      label = 'Beginner';
      emoji = '🌱';
      color = 'text-green-400';
      feedback = `Keep practicing! Try to include prompt keywords: "Act as", "Explain", "Format". These are the building blocks of AI prompts!`;
    }

    // Save score
    storageManager.savePromptCraftingScore({
      score,
      wpm,
      date: new Date().toISOString(),
    });

    return {
      score,
      label,
      emoji,
      color,
      essentialFound,
      essentialMissed,
      bonusFound,
      wpm,
      accuracy,
      feedback,
    };
  }, []);

  // Get all prompt crafting history
  const getHistory = useCallback(() => {
    return storageManager.getPromptCraftingScores();
  }, []);

  return {
    getPromptTemplate,
    evaluatePrompt,
    getHistory,
    ESSENTIAL_KEYWORDS,
    BONUS_KEYWORDS,
  };
}
