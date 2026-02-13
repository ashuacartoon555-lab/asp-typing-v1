/**
 * Storage Manager - Centralized localStorage management for all features
 * All data persists without login using localStorage
 */

export interface TestResult {
  wpm: number;
  accuracy: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'custom';
  date: string; // Full ISO timestamp with time
  mode: string;
  timeElapsed: number;
  wordsTyped: number;
  errorsCount: number;
  weakKeys?: string[];
}

export interface StreakData {
  current: number;
  best: number;
  dates: string[];
  lastTestDate?: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface MilestoneData {
  current: number;
  reached: number[];
  nextTarget: number;
}

export interface WeaknessData {
  [key: string]: number;
}

export interface KeyLatencyData {
  [key: string]: number[]; // character -> array of latencies in ms (legacy)
}

// New keyStats structure per Gemini roadmap
export interface KeyStatEntry {
  totalLatency: number;
  count: number;
  errors: number;
}

export interface KeyStatsData {
  [key: string]: KeyStatEntry;
}

export interface KeystrokeRecord {
  char: string;
  timestamp: number; // performance.now() value
  index: number;
}

export interface GhostReplay {
  keystrokes: KeystrokeRecord[];
  wpm: number;
  accuracy: number;
  date: string;
  totalTime: number;
}

export interface BootcampData {
  day: number;
  completed: number[];
  status: 'not-started' | 'active' | 'completed';
  startDate?: string;
}

export interface LeaderboardEntry {
  wpm: number;
  accuracy: number;
  date: string;
  difficulty: string;
}

/**
 * Storage Manager - Handles all localStorage operations safely
 */
class StorageManager {
  private PREFIX = 'cts_';

  /**
   * === TYPING HISTORY ===
   */
  getTypingHistory(): TestResult[] {
    const data = localStorage.getItem(`${this.PREFIX}typingHistory`);
    return data ? JSON.parse(data) : [];
  }

  addTestResult(result: TestResult): void {
    const history = this.getTypingHistory();
    history.push(result);
    localStorage.setItem(`${this.PREFIX}typingHistory`, JSON.stringify(history));
    this.updateStreaks(result);
    this.updateWeakKeys(result);
    this.checkAchievements(result);
    this.updateMilestones(result);
    this.updateLeaderboard(result);
  }

  clearTypingHistory(): void {
    localStorage.removeItem(`${this.PREFIX}typingHistory`);
  }

  /**
   * === STREAK TRACKING ===
   */
  getStreakData(): StreakData {
    const data = localStorage.getItem(`${this.PREFIX}streakData`);
    return data ? JSON.parse(data) : { current: 0, best: 0, dates: [], lastTestDate: null };
  }

  private updateStreaks(result: TestResult): void {
    const streak = this.getStreakData();
    const today = result.date.split('T')[0]; // Extract date from ISO timestamp
    const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().split('T')[0];

    if (!streak.dates.includes(today)) {
      streak.dates.push(today);

      // Check if streak continues
      if (streak.dates.includes(yesterday)) {
        streak.current += 1;
      } else {
        streak.current = 1;
      }

      // Update best streak
      if (streak.current > streak.best) {
        streak.best = streak.current;
      }

      streak.lastTestDate = today;
      localStorage.setItem(`${this.PREFIX}streakData`, JSON.stringify(streak));
    }
  }

  resetStreakIfNeeded(): void {
    const streak = this.getStreakData();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(new Date().getTime() - 86400000).toISOString().split('T')[0];

    // If last test was before yesterday, reset streak
    if (streak.lastTestDate && !streak.dates.includes(today) && !streak.dates.includes(yesterday)) {
      streak.current = 0;
      localStorage.setItem(`${this.PREFIX}streakData`, JSON.stringify(streak));
    }
  }

  getStreak(): number {
    this.resetStreakIfNeeded();
    return this.getStreakData().current;
  }

  getBestStreak(): number {
    return this.getStreakData().best;
  }

  /**
   * === ACHIEVEMENTS & BADGES ===
   */
  getAchievements(): AchievementBadge[] {
    const data = localStorage.getItem(`${this.PREFIX}badges`);
    return data ? JSON.parse(data) : [];
  }

  getBadges(): AchievementBadge[] {
    const data = localStorage.getItem(`${this.PREFIX}badges`);
    return data ? JSON.parse(data) : [];
  }

  hasBadge(badgeId: string): boolean {
    return this.getBadges().some(b => b.id === badgeId);
  }

  unlockBadge(badge: AchievementBadge): void {
    if (!this.hasBadge(badge.id)) {
      const badges = this.getBadges();
      badges.push(badge);
      localStorage.setItem(`${this.PREFIX}badges`, JSON.stringify(badges));
    }
  }

  private checkAchievements(result: TestResult): void {
    const today = new Date().toISOString().split('T')[0];

    // Speed Racer Badge (50+ WPM)
    if (result.wpm >= 50) {
      this.unlockBadge({
        id: 'speed-racer',
        name: 'Speed Racer',
        icon: '🚀',
        description: 'Reach 50 WPM',
        unlockedAt: today
      });
    }

    // Lightning Badge (75+ WPM)
    if (result.wpm >= 75) {
      this.unlockBadge({
        id: 'lightning',
        name: 'Lightning',
        icon: '⚡',
        description: 'Reach 75 WPM',
        unlockedAt: today
      });
    }

    // Champion Badge (100+ WPM)
    if (result.wpm >= 100) {
      this.unlockBadge({
        id: 'champion',
        name: 'Champion',
        icon: '🏆',
        description: 'Reach 100 WPM',
        unlockedAt: today
      });
    }

    // Perfect Badge (100% accuracy)
    if (result.accuracy === 100) {
      this.unlockBadge({
        id: 'perfect',
        name: 'Perfect',
        icon: '💯',
        description: '100% Accuracy',
        unlockedAt: today
      });
    }

    // On Fire Badge (7-day streak)
    if (this.getStreak() >= 7) {
      this.unlockBadge({
        id: 'on-fire',
        name: 'On Fire',
        icon: '🔥',
        description: '7-Day Streak',
        unlockedAt: today
      });
    }

    // Legend Badge (30-day streak)
    if (this.getStreak() >= 30) {
      this.unlockBadge({
        id: 'legend',
        name: 'Legend',
        icon: '👑',
        description: '30-Day Streak',
        unlockedAt: today
      });
    }

    // Sharpshooter Badge (5 consecutive tests at 99%+)
    const history = this.getTypingHistory();
    const recentTests = history.slice(-5);
    if (recentTests.length === 5 && recentTests.every(t => t.accuracy >= 99)) {
      this.unlockBadge({
        id: 'sharpshooter',
        name: 'Sharpshooter',
        icon: '🎯',
        description: '5 Consecutive 99%+ Accuracy',
        unlockedAt: today
      });
    }

    // Master Badge (100 tests)
    if (history.length >= 100) {
      this.unlockBadge({
        id: 'master',
        name: 'Master',
        icon: '🧠',
        description: 'Complete 100 Tests',
        unlockedAt: today
      });
    }

    // Iron Hands Badge (1000+ words typed)
    const totalWords = history.reduce((sum, t) => sum + (t.wordsTyped || 0), 0);
    if (totalWords >= 1000) {
      this.unlockBadge({
        id: 'iron-hands',
        name: 'Iron Hands',
        icon: '💪',
        description: '1000+ Words Typed',
        unlockedAt: today
      });
    }
  }

  /**
   * === MILESTONES ===
   */
  getMilestoneData(): MilestoneData {
    const data = localStorage.getItem(`${this.PREFIX}milestones`);
    return data ? JSON.parse(data) : { current: 0, reached: [], nextTarget: 25 };
  }

  private updateMilestones(result: TestResult): void {
    const milestone = this.getMilestoneData();
    const milestones = [25, 50, 75, 100, 125];

    if (result.wpm >= milestone.nextTarget && !milestone.reached.includes(milestone.nextTarget)) {
      milestone.reached.push(milestone.nextTarget);
      const nextIdx = milestones.indexOf(milestone.nextTarget) + 1;
      milestone.nextTarget = milestones[nextIdx] || 150;
    }

    milestone.current = result.wpm;
    localStorage.setItem(`${this.PREFIX}milestones`, JSON.stringify(milestone));
  }

  /**
   * === WEAKNESS TRACKING ===
   */
  getWeakKeys(): WeaknessData {
    const data = localStorage.getItem(`${this.PREFIX}weakKeys`);
    return data ? JSON.parse(data) : {};
  }

  private updateWeakKeys(result: TestResult): void {
    if (!result.weakKeys) return;

    const weakKeys = this.getWeakKeys();
    result.weakKeys.forEach(key => {
      weakKeys[key] = (weakKeys[key] || 0) + 1;
    });

    localStorage.setItem(`${this.PREFIX}weakKeys`, JSON.stringify(weakKeys));
  }

  getTopWeakKeys(count: number = 5): string[] {
    const weakKeys = this.getWeakKeys();
    return Object.entries(weakKeys)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([key]) => key);
  }

  /**
   * === LEADERBOARD ===
   */
  getLeaderboard(): LeaderboardEntry[] {
    const data = localStorage.getItem(`${this.PREFIX}leaderboard`);
    return data ? JSON.parse(data) : [];
  }

  getWeeklyLeaderboard(): LeaderboardEntry[] {
    const leaderboard = this.getLeaderboard();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return leaderboard
      .filter(entry => new Date(entry.date) >= oneWeekAgo)
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);
  }

  getAllTimeLeaderboard(): LeaderboardEntry[] {
    return this.getLeaderboard()
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);
  }

  private updateLeaderboard(result: TestResult): void {
    const leaderboard = this.getLeaderboard();
    leaderboard.push({
      wpm: result.wpm,
      accuracy: result.accuracy,
      date: result.date,
      difficulty: result.difficulty
    });
    localStorage.setItem(`${this.PREFIX}leaderboard`, JSON.stringify(leaderboard));
  }

  /**
   * === PERSONAL BEST ===
   */
  getPersonalBests() {
    const data = localStorage.getItem(`${this.PREFIX}personalBests`);
    return data ? JSON.parse(data) : { currentSession: 0, allTime: 0, allTimeDate: null, lastTest: null };
  }

  updatePersonalBests(result: TestResult): void {
    const bests = this.getPersonalBests();

    if (result.wpm > bests.allTime) {
      bests.allTime = result.wpm;
      bests.allTimeDate = result.date;
    }

    if (result.wpm > bests.currentSession) {
      bests.currentSession = result.wpm;
    }

    bests.lastTest = result;
    localStorage.setItem(`${this.PREFIX}personalBests`, JSON.stringify(bests));
  }

  resetSessionBest(): void {
    const bests = this.getPersonalBests();
    bests.currentSession = 0;
    localStorage.setItem(`${this.PREFIX}personalBests`, JSON.stringify(bests));
  }

  /**
   * === BOOTCAMP ===
   */
  getBootcampData(): BootcampData {
    const data = localStorage.getItem(`${this.PREFIX}bootcamp`);
    return data ? JSON.parse(data) : { day: 1, completed: [], status: 'not-started' };
  }

  startBootcamp(): void {
    const today = new Date().toISOString().split('T')[0];
    const bootcamp: BootcampData = {
      day: 1,
      completed: [],
      status: 'active',
      startDate: today
    };
    localStorage.setItem(`${this.PREFIX}bootcamp`, JSON.stringify(bootcamp));
  }

  completeBootcampDay(day: number): void {
    const bootcamp = this.getBootcampData();
    if (!bootcamp.completed.includes(day)) {
      bootcamp.completed.push(day);
    }

    if (bootcamp.completed.length === 30) {
      bootcamp.status = 'completed';
    }

    bootcamp.day = Math.max(bootcamp.day, day + 1);
    localStorage.setItem(`${this.PREFIX}bootcamp`, JSON.stringify(bootcamp));
  }

  /**
   * === PERFORMANCE BY TYPE ===
   */
  getPerformanceByType() {
    const data = localStorage.getItem(`${this.PREFIX}performanceByType`);
    return data ? JSON.parse(data) : {
      easy: [], medium: [], hard: [],
      numbers: [], programming: [], sentences: []
    };
  }

  updatePerformanceByType(result: TestResult): void {
    const performance = this.getPerformanceByType();
    const entry = {
      wpm: result.wpm,
      accuracy: result.accuracy,
      date: result.date
    };

    if (performance[result.difficulty]) {
      performance[result.difficulty].push(entry);
    }

    localStorage.setItem(`${this.PREFIX}performanceByType`, JSON.stringify(performance));
  }

  /**
   * === CHALLENGE LINKS ===
   */
  generateChallengeLink(text: string, difficulty: string, targetWPM: number): string {
    void text;
    void difficulty;
    void targetWPM;
    return 'http://onlinetypingtest.in/';
  }

  decodeChallengeLink(encoded: string): { text: string; difficulty: string; targetWPM: number } | null {
    try {
      const decoded = JSON.parse(atob(encoded));
      return {
        text: decodeURIComponent(decoded.text),
        difficulty: decoded.difficulty,
        targetWPM: decoded.targetWPM
      };
    } catch {
      return null;
    }
  }

  /**
   * === KEY STATS TRACKING (AI Weakness Heatmap) ===
   * Structure: { "a": { totalLatency, count, errors }, ... }
   * Weak condition: avg > 250ms OR errorRate > 15% (ignore count < 10)
   * Latency cap: ignore > 2000ms (user paused)
   */
  getKeyStats(): KeyStatsData {
    const data = localStorage.getItem(`${this.PREFIX}keyStats`);
    if (data) {
      const raw: KeyStatsData = JSON.parse(data);
      // Normalize: merge duplicate case variants (e.g. 'S' + 's' → 's')
      const normalized: KeyStatsData = {};
      let needsSave = false;
      for (const [key, stat] of Object.entries(raw)) {
        const k = key.toLowerCase();
        if (k !== key) needsSave = true; // found uppercase key
        if (!normalized[k]) {
          normalized[k] = { ...stat };
        } else {
          // Merge: combine counts, latencies, errors
          normalized[k].totalLatency += stat.totalLatency;
          normalized[k].count += stat.count;
          normalized[k].errors += stat.errors;
          needsSave = true;
        }
      }
      // Re-save normalized data to fix storage permanently
      if (needsSave) {
        localStorage.setItem(`${this.PREFIX}keyStats`, JSON.stringify(normalized));
      }
      return normalized;
    }
    // Migrate from legacy keyLatency if exists
    const legacy = localStorage.getItem(`${this.PREFIX}keyLatency`);
    if (legacy) {
      const legacyData: KeyLatencyData = JSON.parse(legacy);
      const migrated: KeyStatsData = {};
      for (const [key, latencies] of Object.entries(legacyData)) {
        const k = key.toLowerCase();
        if (!migrated[k]) {
          migrated[k] = {
            totalLatency: latencies.reduce((a, b) => a + b, 0),
            count: latencies.length,
            errors: 0
          };
        } else {
          migrated[k].totalLatency += latencies.reduce((a, b) => a + b, 0);
          migrated[k].count += latencies.length;
        }
      }
      localStorage.setItem(`${this.PREFIX}keyStats`, JSON.stringify(migrated));
      return migrated;
    }
    return {};
  }

  saveKeyStats(data: KeyStatsData): void {
    localStorage.setItem(`${this.PREFIX}keyStats`, JSON.stringify(data));
  }

  // Batch update: called once at test end or every 5s (not per keypress)
  batchUpdateKeyStats(entries: { key: string; latency: number; correct: boolean }[]): void {
    const stats = this.getKeyStats();
    for (const entry of entries) {
      // Latency cap: ignore > 2000ms (user pause)
      if (entry.latency > 2000) continue;
      const k = entry.key.toLowerCase();
      if (!stats[k]) stats[k] = { totalLatency: 0, count: 0, errors: 0 };
      stats[k].totalLatency += entry.latency;
      stats[k].count += 1;
      if (!entry.correct) stats[k].errors += 1;
    }
    this.saveKeyStats(stats);
  }

  // Legacy compat: still works for components using old API
  updateKeyLatency(key: string, latency: number): void {
    if (latency > 2000) return; // Cap
    const stats = this.getKeyStats();
    const k = key.toLowerCase();
    if (!stats[k]) stats[k] = { totalLatency: 0, count: 0, errors: 0 };
    stats[k].totalLatency += latency;
    stats[k].count += 1;
    this.saveKeyStats(stats);
  }

  /**
   * Get weak keys: avg > 250ms OR errorRate > 15%, minimum 10 samples
   */
  getSlowKeys(thresholdMs: number = 250): { key: string; avgLatency: number; errorRate: number }[] {
    const stats = this.getKeyStats();
    const slowKeys: { key: string; avgLatency: number; errorRate: number }[] = [];
    for (const [key, stat] of Object.entries(stats)) {
      if (stat.count < 10) continue; // Ignore low sample
      const avg = stat.totalLatency / stat.count;
      const errorRate = (stat.errors / stat.count) * 100;
      if (avg > thresholdMs || errorRate > 15) {
        slowKeys.push({ key, avgLatency: Math.round(avg), errorRate: Math.round(errorRate) });
      }
    }
    return slowKeys.sort((a, b) => b.avgLatency - a.avgLatency);
  }

  /**
   * Get ALL key latencies for heatmap rendering
   * Returns: Green (<180ms), Yellow (180-250ms), Red (>250ms)
   */
  getAllKeyLatencies(): { key: string; avgLatency: number; count: number; errors: number; errorRate: number }[] {
    const stats = this.getKeyStats();
    return Object.entries(stats)
      .filter(([_, stat]) => stat.count >= 2)
      .map(([key, stat]) => ({
        key,
        avgLatency: Math.round(stat.totalLatency / stat.count),
        count: stat.count,
        errors: stat.errors,
        errorRate: stat.count > 0 ? Math.round((stat.errors / stat.count) * 100) : 0
      }))
      .sort((a, b) => b.avgLatency - a.avgLatency);
  }

  // Legacy compat
  getKeyLatencyData(): KeyLatencyData {
    return {};
  }

  /**
   * === GHOST REPLAY ===
   */
  getBestGhostReplay(): GhostReplay | null {
    const data = localStorage.getItem(`${this.PREFIX}ghostReplay`);
    return data ? JSON.parse(data) : null;
  }

  saveGhostReplay(replay: GhostReplay): void {
    const existing = this.getBestGhostReplay();
    // Only save if it's a new PB or no previous replay exists
    if (!existing || replay.wpm > existing.wpm) {
      localStorage.setItem(`${this.PREFIX}ghostReplay`, JSON.stringify(replay));
    }
  }

  /**
   * === PROMPT CRAFTING SCORES ===
   */
  getPromptCraftingScores(): any[] {
    const data = localStorage.getItem(`${this.PREFIX}promptCraftingScores`);
    return data ? JSON.parse(data) : [];
  }

  savePromptCraftingScore(entry: Record<string, any>): void {
    const scores = this.getPromptCraftingScores();
    scores.push(entry);
    if (scores.length > 50) scores.shift();
    localStorage.setItem(`${this.PREFIX}promptCraftingScores`, JSON.stringify(scores));
  }

  /**
   * === UTILITY ===
   */
  getStats() {
    const history = this.getTypingHistory();
    if (history.length === 0) {
      return {
        totalTests: 0,
        averageWPM: 0,
        bestWPM: 0,
        averageAccuracy: 0,
        totalWordsTyped: 0,
        totalTimeSpent: 0
      };
    }

    return {
      totalTests: history.length,
      averageWPM: Math.round(history.reduce((sum, t) => sum + t.wpm, 0) / history.length),
      bestWPM: Math.max(...history.map(t => t.wpm)),
      averageAccuracy: Math.round(history.reduce((sum, t) => sum + t.accuracy, 0) / history.length),
      totalWordsTyped: history.reduce((sum, t) => sum + (t.wordsTyped || 0), 0),
      totalTimeSpent: history.reduce((sum, t) => sum + (t.timeElapsed || 0), 0)
    };
  }

  clearAllData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export singleton instance
export const storageManager = new StorageManager();
