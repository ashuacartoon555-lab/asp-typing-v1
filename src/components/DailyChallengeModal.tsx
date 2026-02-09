import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Trophy, Clock, Target, Flame, Gift, Star, TrendingUp, Award, Zap, BookOpen, Shield, Focus, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWeaknessTracker } from '@/hooks/useWeaknessTracker';

interface DailyChallengeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChallenge: () => void;
}

const DailyChallengeModal = ({ open, onOpenChange, onStartChallenge }: DailyChallengeModalProps) => {
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('dailyStreak');
    return saved ? parseInt(saved) : 0;
  });
  
  const [lastCompleted, setLastCompleted] = useState(() => {
    return localStorage.getItem('lastDailyChallenge') || '';
  });
  
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [challengeHistory, setChallengeHistory] = useState<Array<{ date: string; completed: boolean; wpm?: number; accuracy?: number }>>([]);
  const [resetCountdown, setResetCountdown] = useState('');
  const { topWeakKeys } = useWeaknessTracker();

  const today = new Date().toDateString();
  
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('challengeHistory') || '[]');
    setChallengeHistory(history.slice(0, 7));
    
    if (lastCompleted === today) {
      setChallengeCompleted(true);
    } else {
      setChallengeCompleted(false);
      if (lastCompleted) {
        const lastDate = new Date(lastCompleted);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          setStreak(0);
          localStorage.setItem('dailyStreak', '0');
        }
      }
    }
  }, [lastCompleted, today]);

  useEffect(() => {
    const updateReset = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(24, 0, 0, 0);
      const diff = next.getTime() - now.getTime();
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setResetCountdown(`${hrs}h ${mins}m`);
    };

    updateReset();
    const timer = setInterval(updateReset, 60000);
    return () => clearInterval(timer);
  }, []);

  const getDailyChallenge = () => {
    const challenges = [
      { type: 'speed', target: 40, unit: 'WPM', description: 'Reach 40 WPM in a 1-minute test', icon: Target, color: 'text-blue-500' },
      { type: 'accuracy', target: 98, unit: '%', description: 'Complete a test with 98% accuracy', icon: Trophy, color: 'text-yellow-500' },
      { type: 'words', target: 50, unit: 'words', description: 'Type 50 words correctly without errors', icon: Gift, color: 'text-green-500' },
      { type: 'time', target: 3, unit: 'min', description: 'Practice typing for 3 minutes straight', icon: Clock, color: 'text-purple-500' },
      { type: 'speed', target: 45, unit: 'WPM', description: 'Achieve 45 WPM in any test', icon: Zap, color: 'text-orange-500' },
      { type: 'combo', target: 30, unit: 'words', description: 'Type 30 words in a row without mistakes', icon: Flame, color: 'text-red-500' },
      { type: 'accuracy', target: 95, unit: '%', description: 'Maintain 95% accuracy for 2 minutes', icon: Star, color: 'text-cyan-500' },
    ];
    
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return challenges[dayOfYear % challenges.length];
  };

  const getStoryLesson = () => {
    const stories = [
      { title: 'The Midnight Train', summary: 'Type a suspenseful journey across the city in 2 minutes.' },
      { title: 'Code Red Mission', summary: 'A fast-paced rescue report with precise terms and numbers.' },
      { title: 'The Lost Manuscript', summary: 'Recover a missing page by typing accurately under pressure.' },
      { title: 'Skyline Delivery', summary: 'A courier’s dash through neon streets—keep your rhythm steady.' },
      { title: 'River of Words', summary: 'A calm story that rewards smooth, mistake-free typing.' },
      { title: 'The Silent Archive', summary: 'Type a secret briefing with tricky punctuation.' },
    ];

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return stories[dayOfYear % stories.length];
  };

  const dailyChallenge = getDailyChallenge();
  const storyLesson = getStoryLesson();
  const ChallengeIcon = dailyChallenge.icon;

  const getStreakReward = () => {
    if (streak >= 30) return { badge: '🏆', title: 'Legendary Typist', bonus: '+50% XP' };
    if (streak >= 14) return { badge: '⭐', title: 'Master Typist', bonus: '+30% XP' };
    if (streak >= 7) return { badge: '🔥', title: 'Dedicated Typist', bonus: '+20% XP' };
    if (streak >= 3) return { badge: '✨', title: 'Rising Star', bonus: '+10% XP' };
    return { badge: '🌱', title: 'Beginner', bonus: 'Keep going!' };
  };

  const streakReward = getStreakReward();
  const nextMilestone = streak < 3 ? 3 : streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : 100;
  const milestoneProgress = streak < 3 ? (streak / 3) * 100 : 
    streak < 7 ? ((streak - 3) / 4) * 100 : 
    streak < 14 ? ((streak - 7) / 7) * 100 : 
    streak < 30 ? ((streak - 14) / 16) * 100 : 100;

  const handleStart = () => {
    onOpenChange(false);
    onStartChallenge();
  };

  const handleQuickMode = (mode: 'sprint' | 'accuracy' | 'weak-keys') => {
    localStorage.setItem('dailyChallengeMode', mode);
    onOpenChange(false);
    onStartChallenge();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Daily Challenge
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Streak Banner */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl p-5 border border-primary/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{streakReward.badge}</span>
                <div>
                  <p className="font-bold text-lg">{streakReward.title}</p>
                  <p className="text-sm text-muted-foreground">{streakReward.bonus}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-6 h-6" />
                  <span className="text-3xl font-bold">{streak}</span>
                </div>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Next milestone: {nextMilestone} days</span>
                <span>{Math.round(milestoneProgress)}%</span>
              </div>
              <Progress value={milestoneProgress} className="h-2" />
            </div>
          </div>

          {/* Today's Challenge */}
          <div className="bg-muted/50 rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center ${dailyChallenge.color}`}>
                <ChallengeIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Today's Goal</p>
                <p className="text-sm text-muted-foreground">{dailyChallenge.type.charAt(0).toUpperCase() + dailyChallenge.type.slice(1)} Challenge</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{dailyChallenge.description}</p>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold gradient-text">{dailyChallenge.target}</span>
              <span className="text-xl text-muted-foreground">{dailyChallenge.unit}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Timer className="w-3.5 h-3.5" />
              <span>Resets in {resetCountdown || '—'}</span>
            </div>
          </div>

          {/* Story-Driven Lesson */}
          <div className="bg-muted/50 rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Story-Driven Lesson</p>
                <p className="text-sm text-muted-foreground">Daily narrative typing challenge</p>
              </div>
            </div>
            <p className="text-foreground font-semibold mb-1">{storyLesson.title}</p>
            <p className="text-muted-foreground mb-4">{storyLesson.summary}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">2–3 min</span>
              <span>Focus: flow + accuracy</span>
            </div>
          </div>

          {/* Power Boosters */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Power Boosters
            </h4>
            <div className="grid gap-3">
              <button
                onClick={() => handleQuickMode('sprint')}
                className="w-full text-left bg-muted/50 rounded-2xl p-4 border border-border hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">1-Minute Sprint</p>
                    <p className="text-sm text-muted-foreground">Quick speed burst to push your peak WPM</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickMode('accuracy')}
                className="w-full text-left bg-muted/50 rounded-2xl p-4 border border-border hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Accuracy Lock (97%)</p>
                    <p className="text-sm text-muted-foreground">Speed counts only if accuracy stays 97%+</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickMode('weak-keys')}
                className="w-full text-left bg-muted/50 rounded-2xl p-4 border border-border hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                    <Focus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Weak Keys Focus</p>
                    <p className="text-sm text-muted-foreground">
                      {topWeakKeys.length > 0 ? `Focus keys: ${topWeakKeys.slice(0, 3).join(', ').toUpperCase()}` : 'No weak keys yet — complete one test to detect'}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Last 7 Days
            </h4>
            {challengeHistory.length === 0 && (
              <div className="mb-3 rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                No activity yet. Start your first Daily Challenge to build a streak.
              </div>
            )}
            <div className="flex gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toDateString();
                const dayData = challengeHistory.find(h => h.date === dateStr);
                const isToday = dateStr === today;
                
                return (
                  <div 
                    key={i}
                    className={`flex-1 aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      dayData?.completed 
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                        : isToday && !challengeCompleted
                          ? 'bg-primary/20 text-primary border border-primary/30 animate-pulse'
                          : 'bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    {dayData?.completed ? '✓' : date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Milestone Rewards */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Streak Milestones
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                { days: 3, emoji: '✨', name: 'Rising Star' },
                { days: 7, emoji: '🔥', name: 'Dedicated' },
                { days: 14, emoji: '⭐', name: 'Master' },
                { days: 30, emoji: '🏆', name: 'Legend' },
              ].map(milestone => (
                <div 
                  key={milestone.days}
                  className={`p-3 rounded-xl text-center transition-all ${
                    streak >= milestone.days 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'bg-muted/30 opacity-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{milestone.emoji}</span>
                  <span className="text-xs font-medium block">{milestone.days} days</span>
                  <span className="text-[10px] text-muted-foreground">{milestone.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {challengeCompleted ? (
            <div className="text-center py-4 bg-green-500/10 rounded-xl border border-green-500/30">
              <Trophy className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-600 dark:text-green-400">Challenge Completed!</p>
              <p className="text-sm text-muted-foreground">Come back tomorrow for a new challenge</p>
            </div>
          ) : (
            <Button onClick={handleStart} className="w-full h-12 gradient-bg text-white text-lg font-semibold">
              <Zap className="w-5 h-5 mr-2" />
              Start Challenge
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyChallengeModal;
