import { useState, useEffect } from 'react';
import { Trophy, Users, Share2, Copy, Check, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
  challengeCode?: string;
}

const LocalLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myName, setMyName] = useState('');
  const [challengeCode, setChallengeCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month' | 'all'>('today');

  useEffect(() => {
    loadLeaderboard();
    const savedName = localStorage.getItem('userName') || 'Anonymous';
    setMyName(savedName);
  }, [viewMode]);

  const loadLeaderboard = () => {
    const stored = localStorage.getItem('localLeaderboard');
    const all: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];

    // Filter by time period
    const now = Date.now();
    const filtered = all.filter(entry => {
      if (viewMode === 'today') {
        return now - entry.timestamp < 24 * 60 * 60 * 1000;
      } else if (viewMode === 'week') {
        return now - entry.timestamp < 7 * 24 * 60 * 60 * 1000;
      } else if (viewMode === 'month') {
        return now - entry.timestamp < 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });

    // Sort by WPM descending
    filtered.sort((a, b) => b.wpm - a.wpm);
    setEntries(filtered.slice(0, 10));
  };

  const addEntry = (wpm: number, accuracy: number) => {
    const stored = localStorage.getItem('localLeaderboard');
    const all: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: myName || 'Anonymous',
      wpm,
      accuracy,
      timestamp: Date.now()
    };

    all.push(newEntry);
    localStorage.setItem('localLeaderboard', JSON.stringify(all));
    loadLeaderboard();

    return newEntry.id;
  };

  const generateChallengeCode = (entryId: string) => {
    const code = `CHALLENGE-${entryId.substring(0, 8).toUpperCase()}`;
    setChallengeCode(code);
    
    // Save challenge
    const challenges = JSON.parse(localStorage.getItem('typingChallenges') || '{}');
    challenges[code] = {
      entryId,
      createdAt: Date.now()
    };
    localStorage.setItem('typingChallenges', JSON.stringify(challenges));
    
    return code;
  };

  const handleShare = (entry: LeaderboardEntry) => {
    const code = generateChallengeCode(entry.id);
    const message = `🏆 I just typed ${entry.wpm} WPM with ${entry.accuracy}% accuracy!\n\nThink you can beat me? Try: ${code}\n\nVisit OnlineTypingTest.in`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Typing Challenge',
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Challenge Link Copied!",
        description: "Share it with friends to compete"
      });
    }
  };

  const handleJoinChallenge = () => {
    if (!challengeCode) return;

    const challenges = JSON.parse(localStorage.getItem('typingChallenges') || '{}');
    const challenge = challenges[challengeCode.toUpperCase()];

    if (challenge) {
      toast({
        title: "Challenge Accepted!",
        description: "Complete a test to compare your result"
      });
      // Could navigate to test page or store challenge for comparison
    } else {
      toast({
        title: "Invalid Code",
        description: "Challenge not found. Check the code and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="card-gradient p-6 rounded-2xl border border-border space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Local Leaderboard
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Compete with friends • No account needed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{entries.length} players</span>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2">
        {(['today', 'week', 'month', 'all'] as const).map(mode => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode(mode)}
            className={viewMode === mode ? 'gradient-bg text-white' : ''}
          >
            {mode === 'today' ? 'Today' : mode === 'week' ? 'Week' : mode === 'month' ? 'Month' : 'All Time'}
          </Button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No entries yet. Complete a test to appear here!</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border-2 border-yellow-500/30'
                  : index === 1
                  ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-gray-400/30'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/10 border border-orange-600/30'
                  : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? 'bg-yellow-500 text-black'
                      : index === 1
                      ? 'bg-gray-400 text-black'
                      : index === 2
                      ? 'bg-orange-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{entry.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{entry.wpm}</div>
                  <div className="text-xs text-muted-foreground">WPM</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{entry.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(entry)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Challenge Section */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-500" />
          Challenge Friends
        </h4>
        <p className="text-xs text-muted-foreground">
          Enter a challenge code to compare your performance with friends
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter challenge code..."
            value={challengeCode}
            onChange={(e) => setChallengeCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleJoinChallenge} className="gradient-bg text-white">
            Join
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocalLeaderboard;
