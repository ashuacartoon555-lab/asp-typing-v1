import { useState, useEffect, useCallback } from 'react';
import { storageManager, KeyStatsData } from '@/lib/storageManager';

// Extended word bank for smart drill generation (A-Z)
const DRILL_WORD_BANK: Record<string, string[]> = {
  'a': ['amazing', 'abstract', 'arrange', 'banana', 'canvas', 'dance', 'grand', 'balance', 'catalyst', 'available'],
  'b': ['bubble', 'bamboo', 'absorb', 'ribbon', 'cobble', 'global', 'browser', 'abstract', 'object', 'observable'],
  'c': ['concept', 'circle', 'access', 'because', 'success', 'cascade', 'crystal', 'accident', 'accurate', 'critical'],
  'd': ['diamond', 'daddy', 'decide', 'divided', 'develop', 'disorder', 'desktop', 'demand', 'discover', 'dividend'],
  'e': ['element', 'engine', 'extend', 'emerge', 'evaluate', 'extreme', 'execute', 'example', 'everyone', 'exchange'],
  'f': ['flutter', 'fifteen', 'format', 'suffix', 'offend', 'fulfill', 'official', 'defect', 'function', 'different'],
  'g': ['google', 'toggle', 'giggle', 'garbage', 'gadget', 'gorge', 'grunge', 'gravity', 'glimpse', 'gorgeous'],
  'h': ['healthy', 'highway', 'hurrah', 'hashmap', 'thrash', 'rhythm', 'habitat', 'horizon', 'helpful', 'shadow'],
  'i': ['initial', 'infinite', 'insight', 'imagine', 'ignite', 'identity', 'implicit', 'indicate', 'interior', 'invisible'],
  'j': ['jungle', 'joyful', 'justice', 'journey', 'project', 'subject', 'majesty', 'jigsaw', 'adjective', 'jeopardize'],
  'k': ['kitchen', 'kayak', 'knuckle', 'blanket', 'sparkle', 'keyboard', 'kingdom', 'knockout', 'skeleton', 'knowledge'],
  'l': ['logical', 'llama', 'parallel', 'liberal', 'illegal', 'literally', 'colonial', 'allocation', 'annually', 'cultural'],
  'm': ['mammoth', 'moment', 'minimum', 'mammogram', 'maximum', 'movement', 'membrane', 'momentum', 'mechanism', 'murmur'],
  'n': ['nonstop', 'antenna', 'nonsense', 'innocent', 'announce', 'national', 'nominal', 'connect', 'banner', 'unknown'],
  'o': ['obvious', 'outdoor', 'monopoly', 'orthodox', 'overview', 'optional', 'opponent', 'original', 'protocol', 'consider'],
  'p': ['pipeline', 'pepper', 'popular', 'purpose', 'prepare', 'property', 'password', 'platform', 'popcorn', 'personal'],
  'q': ['question', 'quantum', 'quickly', 'quality', 'quarter', 'quintet', 'quizzed', 'qualify', 'quotient', 'sequence'],
  'r': ['regular', 'rhythm', 'barrier', 'mirror', 'trigger', 'corridor', 'irregular', 'transfer', 'reference', 'recorder'],
  's': ['session', 'scissors', 'success', 'sunrise', 'suspect', 'system', 'synthesis', 'standard', 'subscribe', 'possible'],
  't': ['twitter', 'tattoo', 'content', 'kitten', 'attract', 'pattern', 'texture', 'throttle', 'template', 'together'],
  'u': ['unusual', 'unique', 'universe', 'umbrella', 'ultimate', 'vacuum', 'pursue', 'product', 'culture', 'capture'],
  'v': ['vivid', 'voyage', 'vaccine', 'villain', 'volcano', 'involve', 'harvest', 'observe', 'private', 'discover'],
  'w': ['window', 'winter', 'shadow', 'hardware', 'anywhere', 'network', 'between', 'however', 'powerful', 'password'],
  'x': ['express', 'mixture', 'context', 'hexagon', 'complex', 'explore', 'textile', 'example', 'execute', 'expert'],
  'y': ['yearly', 'yield', 'system', 'mystery', 'history', 'factory', 'dynamic', 'highway', 'country', 'display'],
  'z': ['zigzag', 'puzzle', 'buzzer', 'frozen', 'horizon', 'realize', 'organize', 'magazine', 'utilized', 'optimize'],
};

// Random filler words for the 10% random portion of drills
const RANDOM_WORDS = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'boy',
  'did', 'let', 'put', 'say', 'she', 'too', 'use', 'just', 'because', 'good',
  'each', 'make', 'like', 'long', 'look', 'many', 'come', 'could', 'people', 'write',
];

export interface WeakKeyInfo {
  key: string;
  avgLatency: number;
  errorRate: number;
  count: number;
  errors: number;
  level: 'fast' | 'medium' | 'weak';
}

export const useWeaknessTracker = () => {
  const [keyStats, setKeyStats] = useState<KeyStatsData>({});
  const [weakKeysList, setWeakKeysList] = useState<WeakKeyInfo[]>([]);
  const [allKeyData, setAllKeyData] = useState<WeakKeyInfo[]>([]);

  // Load/reload key stats from localStorage
  const reload = useCallback(() => {
    const stats = storageManager.getKeyStats();
    setKeyStats(stats);

    // Build all-key data for heatmap
    const allKeys: WeakKeyInfo[] = Object.entries(stats)
      .filter(([_, s]) => s.count >= 2)
      .map(([key, s]) => {
        const avg = s.totalLatency / s.count;
        const errRate = (s.errors / s.count) * 100;
        return {
          key,
          avgLatency: Math.round(avg),
          errorRate: Math.round(errRate),
          count: s.count,
          errors: s.errors,
          level: avg < 180 ? 'fast' as const : avg < 250 ? 'medium' as const : 'weak' as const,
        };
      })
      .sort((a, b) => b.avgLatency - a.avgLatency);
    setAllKeyData(allKeys);

    // Weak keys: avg > 250ms OR errorRate > 15%, minimum 10 samples
    const weak = allKeys.filter(k => k.count >= 10 && (k.avgLatency > 250 || k.errorRate > 15));
    setWeakKeysList(weak);
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener('test-completed', reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('test-completed', reload);
    };
  }, [reload]);

  /**
   * Heatmap color for a key based on avg latency
   * Green: <180ms | Yellow: 180-250ms | Red: >250ms
   */
  const getKeyColor = useCallback((key: string): 'green' | 'yellow' | 'red' | 'none' => {
    const stat = keyStats[key.toLowerCase()];
    if (!stat || stat.count < 2) return 'none';
    const avg = stat.totalLatency / stat.count;
    if (avg < 180) return 'green';
    if (avg < 250) return 'yellow';
    return 'red';
  }, [keyStats]);

  /**
   * Get per-key stats for heatmap tooltip
   */
  const getKeyStat = useCallback((key: string) => {
    const stat = keyStats[key.toLowerCase()];
    if (!stat || stat.count < 2) return null;
    return {
      avgLatency: Math.round(stat.totalLatency / stat.count),
      count: stat.count,
      errors: stat.errors,
      errorRate: Math.round((stat.errors / stat.count) * 100),
    };
  }, [keyStats]);

  /**
   * Start personalized drill with Smart Practice Ratio:
   * 60% weak key words | 30% normal key words | 10% random words
   */
  const startWeaknessTraining = useCallback(() => {
    const weakKeys = weakKeysList.map(w => w.key);
    const trainingText = generateSmartDrill(weakKeys);
    return {
      weakKeys,
      trainingText,
      weakKeysList,
      target: {
        accuracy: 95,
        message: weakKeys.length > 0
          ? `Focus on: ${weakKeys.join(', ').toUpperCase()}. Train until 95%+ accuracy & <200ms per key!`
          : 'No weak keys detected yet! Complete more tests (10+ keystrokes per key needed).'
      }
    };
  }, [weakKeysList]);

  /**
   * Smart Drill Generator with 60/30/10 ratio
   */
  const generateSmartDrill = (weakKeys: string[]): string => {
    if (weakKeys.length === 0) return 'No weak keys detected yet! Complete more tests to identify them.';

    const TARGET_WORDS = 40;
    const weakCount = Math.round(TARGET_WORDS * 0.6);   // 60% weak
    const normalCount = Math.round(TARGET_WORDS * 0.3);  // 30% normal
    const randomCount = TARGET_WORDS - weakCount - normalCount; // 10% random

    // 1) 60% — Words containing weak keys
    const weakWords: string[] = [];
    weakKeys.forEach(key => {
      const bank = DRILL_WORD_BANK[key.toLowerCase()] || [];
      if (bank.length > 0) {
        const shuffled = [...bank].sort(() => Math.random() - 0.5);
        weakWords.push(...shuffled.slice(0, Math.ceil(weakCount / weakKeys.length) + 1));
      }
    });
    // Bigram words (contain 2+ weak keys)
    if (weakKeys.length >= 2) {
      const allWords = Object.values(DRILL_WORD_BANK).flat();
      for (let i = 0; i < weakKeys.length - 1; i++) {
        for (let j = i + 1; j < Math.min(weakKeys.length, i + 3); j++) {
          const k1 = weakKeys[i].toLowerCase();
          const k2 = weakKeys[j].toLowerCase();
          allWords.forEach(word => {
            if (word.includes(k1) && word.includes(k2) && !weakWords.includes(word)) {
              weakWords.push(word);
            }
          });
        }
      }
    }
    const finalWeak = [...new Set(weakWords)].sort(() => Math.random() - 0.5).slice(0, weakCount);

    // 2) 30% — Normal words (non-weak keys with data)
    const normalKeys = Object.keys(keyStats).filter(k => !weakKeys.includes(k));
    const normalWords: string[] = [];
    normalKeys.forEach(key => {
      const bank = DRILL_WORD_BANK[key.toLowerCase()] || [];
      if (bank.length > 0) {
        normalWords.push(bank[Math.floor(Math.random() * bank.length)]);
      }
    });
    const finalNormal = [...new Set(normalWords)].sort(() => Math.random() - 0.5).slice(0, normalCount);

    // 3) 10% — Random filler words
    const finalRandom = [...RANDOM_WORDS].sort(() => Math.random() - 0.5).slice(0, randomCount);

    // Combine, shuffle, and join
    const combined = [...finalWeak, ...finalNormal, ...finalRandom].sort(() => Math.random() - 0.5);
    return combined.join(' ');
  };

  /**
   * Get training focus summary
   */
  const getTrainingFocus = useCallback(() => {
    return weakKeysList.slice(0, 5).map(w => ({
      key: w.key,
      errors: w.errors,
      level: w.level,
      avgLatency: w.avgLatency,
      errorRate: w.errorRate,
    }));
  }, [weakKeysList]);

  // Legacy compat exports
  const topWeakKeys = weakKeysList.map(w => w.key);
  const slowKeys = weakKeysList.map(w => ({ key: w.key, avgLatency: w.avgLatency }));
  const weakKeys = Object.fromEntries(
    Object.entries(keyStats).map(([k, v]) => [k, v.errors])
  );

  const getWeaknessPercentage = (key: string) => {
    const total = Object.values(keyStats).reduce((sum, s) => sum + s.errors, 0);
    const keyErrors = keyStats[key.toLowerCase()]?.errors || 0;
    return total ? Math.round((keyErrors / total) * 100) : 0;
  };

  const getWeaknessLevel = (key: string) => {
    const stat = keyStats[key.toLowerCase()];
    if (!stat || stat.count < 2) return 'excellent';
    const avg = stat.totalLatency / stat.count;
    if (avg < 180) return 'excellent';
    if (avg < 250) return 'good';
    if (avg < 350) return 'weak';
    return 'very-weak';
  };

  return {
    // New API
    keyStats,
    weakKeysList,
    allKeyData,
    getKeyColor,
    getKeyStat,
    reload,
    // Legacy compat
    weakKeys,
    topWeakKeys,
    slowKeys,
    getWeaknessPercentage,
    getWeaknessLevel,
    startWeaknessTraining,
    getTrainingFocus,
  };
};
