import { useState, useEffect } from 'react';
import { storageManager } from '@/lib/storageManager';

// Extended word bank for smart drill generation
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

export const useWeaknessTracker = () => {
  const [weakKeys, setWeakKeys] = useState<{ [key: string]: number }>({});
  const [topWeakKeys, setTopWeakKeys] = useState<string[]>([]);
  const [slowKeys, setSlowKeys] = useState<{ key: string; avgLatency: number }[]>([]);

  useEffect(() => {
    const loadWeakKeys = () => {
      const keys = storageManager.getWeakKeys();
      setWeakKeys(keys);

      const top = storageManager.getTopWeakKeys(5);
      setTopWeakKeys(top);

      // Load latency-based slow keys
      const slow = storageManager.getSlowKeys(250);
      setSlowKeys(slow);
    };

    loadWeakKeys();

    window.addEventListener('storage', loadWeakKeys);
    window.addEventListener('test-completed', loadWeakKeys);
    return () => {
      window.removeEventListener('storage', loadWeakKeys);
      window.removeEventListener('test-completed', loadWeakKeys);
    };
  }, []);

  const getWeaknessPercentage = (key: string) => {
    const total = Object.values(weakKeys).reduce((a, b) => a + b, 0);
    return total ? Math.round(((weakKeys[key] || 0) / total) * 100) : 0;
  };

  const getWeaknessLevel = (key: string) => {
    const count = weakKeys[key] || 0;
    if (count === 0) return 'excellent';
    if (count <= 2) return 'good';
    if (count <= 5) return 'fair';
    if (count <= 10) return 'weak';
    return 'very-weak';
  };

  const startWeaknessTraining = () => {
    // Combine error-based weak keys + latency-based slow keys
    const combinedWeakKeys = [...new Set([
      ...topWeakKeys,
      ...slowKeys.map(k => k.key)
    ])];

    const trainingText = generateSmartTrainingText(combinedWeakKeys);
    return {
      weakKeys: combinedWeakKeys,
      trainingText,
      slowKeys,
      target: {
        accuracy: 95,
        message: combinedWeakKeys.length > 0
          ? `Focus on: ${combinedWeakKeys.join(', ').toUpperCase()}. Train until 95%+ accuracy & <200ms per key!`
          : 'No weak keys detected! Keep typing to identify them.'
      }
    };
  };

  // Smart drill generation: uses both error data + latency data
  const generateSmartTrainingText = (keys: string[]): string => {
    if (keys.length === 0) return 'No weak keys detected! Keep typing to identify them.';

    const selectedWords: string[] = [];

    // For each weak key, pull words from the drill bank
    keys.forEach(key => {
      const normalizedKey = key.toLowerCase();
      const bankWords = DRILL_WORD_BANK[normalizedKey] || [];
      if (bankWords.length > 0) {
        // Pick 4-6 random words per weak key
        const shuffled = [...bankWords].sort(() => Math.random() - 0.5);
        selectedWords.push(...shuffled.slice(0, Math.min(6, shuffled.length)));
      }
    });

    // If we found drill words, also create some bigram combinations
    if (keys.length >= 2) {
      // Create compound words hitting multiple weak keys
      const bigramWords: string[] = [];
      for (let i = 0; i < keys.length - 1; i++) {
        for (let j = i + 1; j < Math.min(keys.length, i + 3); j++) {
          const k1 = keys[i].toLowerCase();
          const k2 = keys[j].toLowerCase();
          // Find words containing both keys
          Object.values(DRILL_WORD_BANK).flat().forEach(word => {
            if (word.includes(k1) && word.includes(k2) && !selectedWords.includes(word)) {
              bigramWords.push(word);
            }
          });
        }
      }
      selectedWords.push(...bigramWords.slice(0, 5));
    }

    // Deduplicate and shuffle
    const unique = [...new Set(selectedWords)].sort(() => Math.random() - 0.5);
    
    // Generate 2-3 repetitions for muscle memory training
    const repeated = [...unique, ...unique.slice(0, Math.ceil(unique.length / 2))];
    return repeated.sort(() => Math.random() - 0.5).slice(0, 30).join(' ');
  };

  const getTrainingFocus = () => {
    // Merge error-based and latency-based data
    const errorBased = Object.entries(weakKeys)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count]) => ({
        key,
        errors: count,
        level: getWeaknessLevel(key),
        avgLatency: slowKeys.find(s => s.key === key)?.avgLatency || null
      }));

    // Add any slow keys not already in error list
    const additionalSlow = slowKeys
      .filter(s => !errorBased.find(e => e.key === s.key))
      .slice(0, 2)
      .map(s => ({
        key: s.key,
        errors: weakKeys[s.key] || 0,
        level: 'slow' as const,
        avgLatency: s.avgLatency
      }));

    return [...errorBased, ...additionalSlow];
  };

  return {
    weakKeys,
    topWeakKeys,
    slowKeys,
    getWeaknessPercentage,
    getWeaknessLevel,
    startWeaknessTraining,
    getTrainingFocus
  };
};
