import { useState, useEffect } from 'react';
import { Calendar, Trophy, Clock, Target, Flame, Gift, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DailyChallengeModal from './DailyChallengeModal';

interface DailyChallengeProps {
  onStartChallenge: () => void;
}

const DailyChallenge = ({ onStartChallenge }: DailyChallengeProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('dailyStreak');
    return saved ? parseInt(saved) : 0;
  });
  
  const [lastCompleted, setLastCompleted] = useState(() => {
    return localStorage.getItem('lastDailyChallenge') || '';
  });
  
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const today = new Date().toDateString();
  
  useEffect(() => {
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

  const getDailyChallenge = () => {
    const challenges = [
      { type: 'speed', target: 40, unit: 'WPM', description: 'Reach 40 WPM in a 1-minute test' },
      { type: 'accuracy', target: 98, unit: '%', description: 'Complete a test with 98% accuracy' },
      { type: 'words', target: 50, unit: 'words', description: 'Type 50 words correctly without errors' },
      { type: 'time', target: 3, unit: 'min', description: 'Practice typing for 3 minutes straight' },
      { type: 'speed', target: 45, unit: 'WPM', description: 'Achieve 45 WPM in any test' },
      { type: 'combo', target: 30, unit: 'words', description: 'Type 30 words in a row without mistakes' },
      { type: 'accuracy', target: 95, unit: '%', description: 'Maintain 95% accuracy for 2 minutes' },
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

  const getStreakColor = () => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-yellow-500';
    if (streak >= 7) return 'text-orange-500';
    return 'text-primary';
  };

  return (
    <>
      <div 
        onClick={() => setModalOpen(true)}
        className="glass p-6 rounded-3xl cursor-pointer hover:shadow-xl transition-all group"
        style={{
          background: 'hsla(0, 0%, 100%, 0.12)',
          border: '1px solid hsla(0, 0%, 100%, 0.2)'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
            style={{ background: 'linear-gradient(135deg, hsl(178, 72%, 45%), hsl(42, 98%, 58%))' }}
          >
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Daily Challenge</h3>
            <p className="text-sm text-muted-foreground">Click for details!</p>
          </div>
          {streak > 0 && (
            <div className={`flex items-center gap-1 ${getStreakColor()}`}>
              <Flame className="w-5 h-5" />
              <span className="font-bold">{streak}</span>
            </div>
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" style={{ color: streak > 0 ? undefined : 'hsl(178, 72%, 55%)' }} />
        </div>

        <div 
          className="rounded-xl p-4 mb-4"
          style={{ background: 'hsla(0, 0%, 100%, 0.08)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            {dailyChallenge.type === 'speed' && <Target className="w-5 h-5" style={{ color: 'hsl(178, 72%, 55%)' }} />}
            {dailyChallenge.type === 'accuracy' && <Trophy className="w-5 h-5" style={{ color: 'hsl(178, 72%, 55%)' }} />}
            {dailyChallenge.type === 'time' && <Clock className="w-5 h-5" style={{ color: 'hsl(178, 72%, 55%)' }} />}
            {dailyChallenge.type === 'words' && <Gift className="w-5 h-5" style={{ color: 'hsl(178, 72%, 55%)' }} />}
            {dailyChallenge.type === 'combo' && <Flame className="w-5 h-5" style={{ color: 'hsl(178, 72%, 55%)' }} />}
            <span className="font-semibold text-foreground">Today's Goal</span>
          </div>
          <p className="text-muted-foreground text-sm">{dailyChallenge.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">{dailyChallenge.target}</span>
            <span className="text-muted-foreground">{dailyChallenge.unit}</span>
          </div>
        </div>

        {/* Story-Driven Lesson */}
        <div 
          className="rounded-xl p-4 mb-4"
          style={{ background: 'hsla(0, 0%, 100%, 0.08)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5" style={{ color: 'hsl(178, 72%, 55%)' }} />
            <span className="font-semibold text-foreground">Story-Driven Lesson</span>
          </div>
          <p className="text-foreground text-sm font-semibold mb-1">{storyLesson.title}</p>
          <p className="text-muted-foreground text-sm">{storyLesson.summary}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full px-2 py-0.5" style={{ background: 'hsla(178, 72%, 45%, 0.15)' }}>
              Daily Story
            </span>
            <span>2–3 min</span>
          </div>
        </div>

        {challengeCompleted ? (
          <div 
            className="text-center py-3 rounded-xl border"
            style={{ 
              background: 'hsla(158, 64%, 52%, 0.1)',
              borderColor: 'hsla(158, 64%, 52%, 0.3)'
            }}
          >
            <Trophy className="w-6 h-6 mx-auto mb-1" style={{ color: 'hsl(158, 64%, 52%)' }} />
            <p className="font-semibold text-sm" style={{ color: 'hsl(158, 64%, 52%)' }}>Completed!</p>
          </div>
        ) : (
          <Button 
            className="w-full text-black pointer-events-none rounded-full font-semibold"
            style={{ background: 'linear-gradient(135deg, hsl(178, 72%, 45%), hsl(42, 98%, 58%))' }}
          >
            Start Challenge
          </Button>
        )}

        {/* Streak milestones */}
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div className={`flex flex-col items-center ${streak >= 7 ? 'text-orange-500' : ''}`}>
            <span className="text-lg">{streak >= 7 ? '✅' : '🔒'}</span>
            <span>7 days</span>
          </div>
          <div className={`flex flex-col items-center ${streak >= 14 ? 'text-yellow-500' : ''}`}>
            <span className="text-lg">{streak >= 14 ? '✅' : '🔒'}</span>
            <span>14 days</span>
          </div>
          <div className={`flex flex-col items-center ${streak >= 30 ? 'text-purple-500' : ''}`}>
            <span className="text-lg">{streak >= 30 ? '✅' : '🔒'}</span>
            <span>30 days</span>
          </div>
        </div>
      </div>

      <DailyChallengeModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onStartChallenge={onStartChallenge} 
      />
    </>
  );
};

export default DailyChallenge;
