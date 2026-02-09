import { useState } from 'react';
import { Volume2, Volume1, VolumeX, Music, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSound } from '@/contexts/SoundContext';

type SoundIntensity = 'relaxed' | 'focus' | 'silent';
type ErrorSoundProfile = 'classic' | 'sci-fi' | 'gentle' | 'gaming';

interface AdvancedSoundSettingsProps {
  onClose?: () => void;
}

const AdvancedSoundSettings = ({ onClose }: AdvancedSoundSettingsProps) => {
  const { settings, toggleSetting, toggleMaster, playSound } = useSound();
  
  const [intensity, setIntensity] = useState<SoundIntensity>(() => {
    return (localStorage.getItem('sound-intensity') as SoundIntensity) || 'focus';
  });
  
  const [errorProfile, setErrorProfile] = useState<ErrorSoundProfile>(() => {
    return (localStorage.getItem('error-sound-profile') as ErrorSoundProfile) || 'classic';
  });

  const [volume, setVolume] = useState(() => {
    return parseInt(localStorage.getItem('sound-volume') || '70');
  });

  const handleIntensityChange = (newIntensity: SoundIntensity) => {
    setIntensity(newIntensity);
    localStorage.setItem('sound-intensity', newIntensity);
    
    // Play preview sound based on intensity
    if (newIntensity === 'relaxed') playSound('start'); // Soft sound
    else if (newIntensity === 'focus') playSound('error'); // Error sound
    else playSound('keypress'); // Minimal sound
  };

  const handleProfileChange = (newProfile: ErrorSoundProfile) => {
    setErrorProfile(newProfile);
    localStorage.setItem('error-sound-profile', newProfile);
    playSound('error'); // Preview the error sound
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem('sound-volume', String(newVolume));
  };

  const previewSound = (type: 'error' | 'start' | 'end') => {
    playSound(type);
  };

  const getIntensityDescription = (mode: SoundIntensity) => {
    switch (mode) {
      case 'relaxed': return 'Soft sounds, delayed feedback - for casual practice';
      case 'focus': return 'Immediate, clear feedback - for exam/test mode';
      case 'silent': return 'Visual feedback only - for public/quiet places';
    }
  };

  const getProfileDescription = (profile: ErrorSoundProfile) => {
    switch (profile) {
      case 'classic': return 'Traditional beep sounds';
      case 'sci-fi': return 'Futuristic laser/electronic sounds';
      case 'gentle': return 'Soft, musical notification sounds';
      case 'gaming': return 'Video game style effects';
    }
  };

  return (
    <div className="w-full space-y-6 p-4 rounded-lg border border-border/30 bg-card">
      {/* Master Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold">Master Sound</div>
            <div className="text-xs text-muted-foreground">Enable/disable all sounds</div>
          </div>
        </div>
        <button
          onClick={toggleMaster}
          className={`w-12 h-7 rounded-full transition-colors ${
            settings.masterEnabled ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.masterEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Sound Intensity Levels */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          Sound Intensity
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['relaxed', 'focus', 'silent'] as SoundIntensity[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleIntensityChange(mode)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                intensity === mode
                  ? 'border-primary bg-primary/20 text-primary font-semibold'
                  : 'border-border/30 bg-muted/10 text-foreground hover:border-primary/50'
              }`}
            >
              <div className="text-sm capitalize mb-1">{mode}</div>
              <div className="text-xs text-muted-foreground">
                {mode === 'relaxed' && '🎵'}
                {mode === 'focus' && '🔔'}
                {mode === 'silent' && '✓'}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground px-2">
          {getIntensityDescription(intensity)}
        </p>
      </div>

      {/* Error Sound Profiles */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Music className="w-4 h-4 text-secondary" />
          Error Sound Profile
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(['classic', 'sci-fi', 'gentle', 'gaming'] as ErrorSoundProfile[]).map((profile) => (
            <button
              key={profile}
              onClick={() => handleProfileChange(profile)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                errorProfile === profile
                  ? 'border-secondary bg-secondary/20 text-secondary font-semibold'
                  : 'border-border/30 bg-muted/10 text-foreground hover:border-secondary/50'
              }`}
            >
              <div className="text-sm capitalize font-medium">{profile}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {getProfileDescription(profile)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Sound Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-info" />
          Sound Alerts
        </h3>
        <div className="space-y-2">
          {[
            { key: 'errorSound', label: 'Error Sound', description: 'When you make a typing mistake' },
            { key: 'startSound', label: 'Test Start Sound', description: 'When test begins' },
            { key: 'endSound', label: 'Test End Sound', description: 'When test completes' },
            { key: 'keypressSound', label: 'Keypress Sound', description: 'On every keystroke (subtle)' },
          ].map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
            >
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </div>
              <button
                onClick={() => toggleSetting(key as keyof typeof settings)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings[key as keyof typeof settings] ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings[key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Volume Control */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Volume1 className="w-4 h-4" />
          Volume Control
        </h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1 h-2 bg-muted rounded-lg cursor-pointer accent-primary"
          />
          <div className="text-sm font-semibold text-primary min-w-12 text-right">{volume}%</div>
        </div>
      </div>

      {/* Sound Preview Section */}
      <div className="space-y-3 pt-4 border-t border-border/30">
        <h3 className="text-sm font-semibold">Preview Sounds</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => previewSound('error')}
            className="text-xs"
          >
            🔊 Error
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => previewSound('start')}
            className="text-xs"
          >
            ▶️ Start
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => previewSound('end')}
            className="text-xs"
          >
            ✓ End
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 rounded-lg bg-info/10 border border-info/30">
        <div className="text-xs text-foreground">
          <div className="font-semibold mb-1">💡 Tip:</div>
          <ul className="space-y-1">
            <li>• <strong>Relaxed:</strong> Best for learning new words</li>
            <li>• <strong>Focus:</strong> Best for speed tests & exams</li>
            <li>• <strong>Silent:</strong> Practice without sound</li>
          </ul>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <Button
          onClick={onClose}
          className="w-full"
          variant="outline"
        >
          Done
        </Button>
      )}
    </div>
  );
};

export default AdvancedSoundSettings;
