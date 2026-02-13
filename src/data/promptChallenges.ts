/**
 * Prompt Crafting Challenge Data
 * 
 * Each challenge has:
 * - id, title, difficulty level
 * - instruction (shown to user before typing)
 * - targetText (reference prompt — what a perfect answer looks like)
 * - requiredKeywords (must be found in user's typed prompt)
 * - structureChecks (advanced: role, instruction, format detection)
 */

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'pro';

export interface PromptChallenge {
  id: number;
  title: string;
  difficulty: ChallengeDifficulty;
  instruction: string;
  targetText: string;
  requiredKeywords: string[];
}

export const PROMPT_CHALLENGES: PromptChallenge[] = [
  // ===== EASY (2 keywords) =====
  {
    id: 1,
    title: "Summarize an Article",
    difficulty: 'easy',
    instruction: "Write a prompt asking an AI to summarize an article. Use keywords like 'summarize' and 'bullet points'.",
    targetText: "Summarize this article in bullet points highlighting the key takeaways.",
    requiredKeywords: ["summarize", "bullet points"],
  },
  {
    id: 2,
    title: "Translate Text",
    difficulty: 'easy',
    instruction: "Write a prompt asking an AI to translate text. Use keywords like 'translate' and 'language'.",
    targetText: "Translate the following paragraph into Spanish while keeping the original tone.",
    requiredKeywords: ["translate", "language"],
  },
  {
    id: 3,
    title: "Write an Email",
    difficulty: 'easy',
    instruction: "Write a prompt asking an AI to draft an email. Use keywords like 'write' and 'email'.",
    targetText: "Write a professional email to request a meeting with the client next week.",
    requiredKeywords: ["write", "email"],
  },
  {
    id: 4,
    title: "Generate Ideas",
    difficulty: 'easy',
    instruction: "Write a prompt asking an AI to brainstorm ideas. Use keywords like 'generate' and 'ideas'.",
    targetText: "Generate 10 creative marketing ideas for a new product launch.",
    requiredKeywords: ["generate", "ideas"],
  },

  // ===== MEDIUM (3 keywords) =====
  {
    id: 5,
    title: "Explain a Concept",
    difficulty: 'medium',
    instruction: "Write a prompt asking an AI to explain something simply. Use 'explain', 'simple language', and a role like 'act as'.",
    targetText: "Act as a teacher. Explain photosynthesis for a 10-year-old in simple language with real-world examples.",
    requiredKeywords: ["explain", "act as", "simple language"],
  },
  {
    id: 6,
    title: "Code Review",
    difficulty: 'medium',
    instruction: "Write a prompt asking an AI to review code. Use 'act as', 'review', and 'suggest improvements'.",
    targetText: "Act as a senior developer. Review this code and suggest improvements for readability and performance.",
    requiredKeywords: ["act as", "review", "suggest"],
  },
  {
    id: 7,
    title: "Create a Study Plan",
    difficulty: 'medium',
    instruction: "Write a prompt asking an AI to create a study plan. Use 'create', 'step by step', and 'plan'.",
    targetText: "Create a step by step study plan for learning Python in 30 days.",
    requiredKeywords: ["create", "step by step", "plan"],
  },
  {
    id: 8,
    title: "Data Analysis Guide",
    difficulty: 'medium',
    instruction: "Write a prompt asking an AI to guide data analysis. Use 'act as', 'analyze', and 'format as'.",
    targetText: "Act as a data analyst. Analyze the sales data and format as a summary report with key insights.",
    requiredKeywords: ["act as", "analyze", "format as"],
  },
  {
    id: 9,
    title: "Debug Help",
    difficulty: 'medium',
    instruction: "Write a prompt asking an AI to help debug. Use 'explain', 'fix', and 'error'.",
    targetText: "Explain why this error occurs and fix the bug. Show the corrected code with comments.",
    requiredKeywords: ["explain", "fix", "error"],
  },

  // ===== HARD (4-5 keywords) =====
  {
    id: 10,
    title: "Technical Documentation",
    difficulty: 'hard',
    instruction: "Write a prompt for API documentation. Use 'act as', 'format as', 'detailed', and 'example'.",
    targetText: "Act as a technical writer. Create detailed API documentation. Format as a reference guide with examples for each endpoint.",
    requiredKeywords: ["act as", "format as", "detailed", "example"],
  },
  {
    id: 11,
    title: "Cybersecurity Audit",
    difficulty: 'hard',
    instruction: "Write a prompt for a security audit. Use 'act as', 'explain', 'format as', and 'categorize'.",
    targetText: "Act as a cybersecurity expert. Explain common vulnerabilities in web applications. Format as a categorized list with severity levels.",
    requiredKeywords: ["act as", "explain", "format as", "categorize"],
  },
  {
    id: 12,
    title: "ML Model Comparison",
    difficulty: 'hard',
    instruction: "Write a prompt comparing ML models. Use 'act as', 'compare', 'format as', 'detailed', and 'example'.",
    targetText: "Act as a machine learning engineer. Compare supervised and unsupervised learning. Format as a detailed comparison table with examples.",
    requiredKeywords: ["act as", "compare", "format as", "detailed", "example"],
  },
  {
    id: 13,
    title: "Product Strategy",
    difficulty: 'hard',
    instruction: "Write a prompt for product strategy. Use 'act as', 'analyze', 'step by step', and 'format as'.",
    targetText: "Act as a product manager. Analyze the market and create a go-to-market strategy. Format as a step by step action plan.",
    requiredKeywords: ["act as", "analyze", "step by step", "format as"],
  },

  // ===== PRO (structure required: role + instruction + format) =====
  {
    id: 14,
    title: "Full Prompt Engineering",
    difficulty: 'pro',
    instruction: "Write a complete AI prompt with role, task, and output format. Use 'act as', 'explain', 'format as', 'step by step', and 'detailed'.",
    targetText: "Act as a senior software engineer. Explain the concept of recursion in detail. Format as a step by step guide with practical examples and common pitfalls.",
    requiredKeywords: ["act as", "explain", "format as", "step by step", "detailed"],
  },
  {
    id: 15,
    title: "AI Research Paper",
    difficulty: 'pro',
    instruction: "Write a prompt for generating a research outline. Include role, structure, format, detail level, and style.",
    targetText: "Act as a research scientist. Create a comprehensive outline for a paper on neural networks. Format as a structured document with sections, detailed explanations, and references. In the style of an academic publication.",
    requiredKeywords: ["act as", "format as", "detailed", "structured", "in the style of"],
  },
  {
    id: 16,
    title: "DevOps Pipeline Design",
    difficulty: 'pro',
    instruction: "Write a prompt for CI/CD design. Include role, task, format, process flow, and comprehensive coverage.",
    targetText: "Act as a DevOps engineer. Explain continuous integration and deployment pipelines. Format as a comprehensive process flow with detailed steps, tools comparison, and best practices.",
    requiredKeywords: ["act as", "explain", "format as", "comprehensive", "detailed"],
  },
];

/**
 * Get challenges filtered by difficulty
 */
export const getChallengesByDifficulty = (difficulty: ChallengeDifficulty): PromptChallenge[] => {
  return PROMPT_CHALLENGES.filter(c => c.difficulty === difficulty);
};

/**
 * Get a random challenge, optionally filtered by difficulty
 */
export const getRandomChallenge = (difficulty?: ChallengeDifficulty): PromptChallenge => {
  const pool = difficulty
    ? PROMPT_CHALLENGES.filter(c => c.difficulty === difficulty)
    : PROMPT_CHALLENGES;
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * AI Prompt structure detection patterns
 */
export const STRUCTURE_PATTERNS = {
  role: /(act as|you are|pretend to be|imagine you're|as a)/i,
  instruction: /(explain|describe|create|write|analyze|compare|summarize|list|generate|review|translate|fix|design)/i,
  format: /(format as|format it|in the format|output as|structure as|bullet points|numbered list|table|step by step|categorize)/i,
};
