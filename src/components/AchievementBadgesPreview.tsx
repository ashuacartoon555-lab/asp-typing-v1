import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { Link } from 'react-router-dom';

const AchievementBadgesPreview: React.FC = () => {
  const { badges, getAllBadgesAvailable } = useAchievements();
  
  const allBadges = getAllBadgesAvailable();
  const unlockedIds = new Set(badges.map(b => b.id));
  
  // Get first 6 badges for preview
  const previewBadges = allBadges.slice(0, 6);

  return (
    <div className="w-full">
      {/* Compact Badge Preview Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            Your Achievements 🏅
          </h3>
          <Link 
            to="/analytics" 
            className="text-[10px] sm:text-xs text-primary hover:underline font-semibold"
          >
            View All ({badges.length}/{allBadges.length})
          </Link>
        </div>
        
        {/* Badge Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-2">
          {previewBadges.map((badge) => {
            const isUnlocked = unlockedIds.has(badge.id);
            const unlockedBadge = badges.find(b => b.id === badge.id);
            
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 hover:border-yellow-400'
                    : 'bg-muted/30 border-muted-foreground/20 opacity-50'
                }`}
                title={badge.description}
              >
                <div className="text-lg sm:text-2xl mb-0.5">{badge.icon}</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-center text-foreground line-clamp-1">
                  {badge.name}
                </div>
                {isUnlocked && unlockedBadge && (
                  <div className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5">
                    {new Date(unlockedBadge.unlockedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Line */}
        <div className="text-[10px] sm:text-xs text-muted-foreground text-center pt-1 border-t border-border/30">
          🎯 {badges.length} badges unlocked
        </div>
      </div>
    </div>
  );
};

export default AchievementBadgesPreview;
