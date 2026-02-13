// Podcast Mode Challenges — Blind Transcription
// Each challenge has text content + TTS speed based on difficulty

export interface PodcastChallenge {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'pro';
  text: string;
  ttsRate: number; // SpeechSynthesis rate
}

const podcastChallenges: PodcastChallenge[] = [
  // ── Easy (slow TTS 0.7, short sentences) ─────────────────
  {
    id: 1,
    title: 'Morning Routine',
    difficulty: 'easy',
    text: 'Every morning I wake up early and drink a cup of coffee before starting my day.',
    ttsRate: 0.7,
  },
  {
    id: 2,
    title: 'Park Walk',
    difficulty: 'easy',
    text: 'The park was full of children playing and dogs running around the green grass.',
    ttsRate: 0.7,
  },
  {
    id: 3,
    title: 'Simple Recipe',
    difficulty: 'easy',
    text: 'To make tea you need hot water, a tea bag, and a little bit of sugar.',
    ttsRate: 0.7,
  },
  {
    id: 4,
    title: 'Weather Talk',
    difficulty: 'easy',
    text: 'Today the sky is clear and the sun is shining brightly over the city.',
    ttsRate: 0.7,
  },

  // ── Medium (normal TTS 1.0, medium sentences) ────────────
  {
    id: 5,
    title: 'Technology Growth',
    difficulty: 'medium',
    text: 'Artificial intelligence is transforming the world rapidly and changing how businesses operate across every industry on the planet.',
    ttsRate: 1.0,
  },
  {
    id: 6,
    title: 'Climate Change',
    difficulty: 'medium',
    text: 'Scientists have warned that rising sea levels could displace millions of people living in coastal areas around the globe within the next few decades.',
    ttsRate: 1.0,
  },
  {
    id: 7,
    title: 'Space Exploration',
    difficulty: 'medium',
    text: 'The recent Mars missions have revealed fascinating geological features that suggest water once flowed freely on the surface of the red planet.',
    ttsRate: 1.0,
  },
  {
    id: 8,
    title: 'Digital Economy',
    difficulty: 'medium',
    text: 'Remote work has become the new normal for many companies as digital tools enable teams to collaborate effectively from anywhere in the world.',
    ttsRate: 1.0,
  },

  // ── Hard (fast TTS 1.3, long sentences) ───────────────────
  {
    id: 9,
    title: 'Quantum Computing',
    difficulty: 'hard',
    text: 'Quantum computing represents a fundamental shift in computational capability that could revolutionize cryptography, drug discovery, and financial modeling by solving problems that classical computers would take thousands of years to process.',
    ttsRate: 1.3,
  },
  {
    id: 10,
    title: 'Neuroscience Insights',
    difficulty: 'hard',
    text: 'Recent advances in neuroscience have demonstrated that the human brain continues to form new neural connections throughout life, challenging the long-held belief that brain development stops after childhood and opening new avenues for treating neurological disorders.',
    ttsRate: 1.3,
  },
  {
    id: 11,
    title: 'Global Economics',
    difficulty: 'hard',
    text: 'The interconnected nature of modern global economics means that a financial crisis in one region can rapidly cascade through international markets, affecting trade balances, currency valuations, and employment rates across multiple continents simultaneously.',
    ttsRate: 1.3,
  },
  {
    id: 12,
    title: 'Renewable Energy',
    difficulty: 'hard',
    text: 'The transition to renewable energy sources requires massive infrastructure investments including solar farms, wind turbines, battery storage facilities, and upgraded power grid networks that can handle the variable output of clean energy generation technologies.',
    ttsRate: 1.3,
  },

  // ── Pro (very fast TTS 1.5, complex text) ─────────────────
  {
    id: 13,
    title: 'Philosophy of Mind',
    difficulty: 'pro',
    text: 'The philosophical question of whether machines can truly think or merely simulate thought processes raises profound implications for our understanding of consciousness, free will, and the nature of intelligence itself, particularly as large language models demonstrate increasingly sophisticated reasoning capabilities that blur the traditional boundaries between human cognition and artificial computation.',
    ttsRate: 1.5,
  },
  {
    id: 14,
    title: 'Bioethics Debate',
    difficulty: 'pro',
    text: 'Gene editing technologies like CRISPR present humanity with unprecedented ethical dilemmas regarding the modification of human embryos, the potential elimination of genetic diseases, and the controversial possibility of enhancing human capabilities beyond their natural limits, forcing society to establish regulatory frameworks that balance scientific progress with moral responsibility and equitable access to transformative medical interventions.',
    ttsRate: 1.5,
  },
  {
    id: 15,
    title: 'Civilization Theory',
    difficulty: 'pro',
    text: 'Throughout the history of human civilization, the development of writing systems, mathematical frameworks, and scientific methodologies has served as the foundation for technological progress, enabling each successive generation to build upon the accumulated knowledge of their predecessors and thereby accelerating the pace of innovation in ways that the original inventors of these fundamental tools could never have anticipated or imagined.',
    ttsRate: 1.5,
  },
  {
    id: 16,
    title: 'Artificial General Intelligence',
    difficulty: 'pro',
    text: 'The pursuit of artificial general intelligence represents perhaps the most ambitious technological endeavor in human history, requiring breakthroughs in machine learning, natural language understanding, reasoning under uncertainty, and transfer learning across domains, while simultaneously demanding careful consideration of alignment problems, existential risk mitigation strategies, and the development of robust governance structures to ensure that such powerful systems remain beneficial and controllable.',
    ttsRate: 1.5,
  },
];

/** Get a random challenge, optionally filtered by difficulty */
export function getRandomPodcastChallenge(difficulty?: PodcastChallenge['difficulty']): PodcastChallenge {
  const pool = difficulty
    ? podcastChallenges.filter(c => c.difficulty === difficulty)
    : podcastChallenges;
  if (pool.length === 0) return podcastChallenges[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Get all challenges for a difficulty */
export function getPodcastChallengesByDifficulty(difficulty: PodcastChallenge['difficulty']): PodcastChallenge[] {
  return podcastChallenges.filter(c => c.difficulty === difficulty);
}

/** Difficulty label + color config */
export const DIFFICULTY_CONFIG: Record<PodcastChallenge['difficulty'], { label: string; color: string; bgColor: string; speed: string }> = {
  easy:   { label: 'Easy',   color: 'text-green-400',  bgColor: 'bg-green-500/20', speed: 'Slow speech' },
  medium: { label: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', speed: 'Normal speech' },
  hard:   { label: 'Hard',   color: 'text-orange-400', bgColor: 'bg-orange-500/20', speed: 'Fast speech' },
  pro:    { label: 'Pro',    color: 'text-red-400',    bgColor: 'bg-red-500/20', speed: 'Very fast speech' },
};

export default podcastChallenges;
