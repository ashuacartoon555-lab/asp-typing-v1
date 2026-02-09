import { useState, useRef, useEffect } from 'react';
import { Volume2, X, Zap, Music, ChevronDown } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

type SoundIntensity = 'relaxed' | 'focus' | 'silent';
type ErrorSoundProfile = 'classic' | 'sci-fi' | 'gentle' | 'gaming';

const FloatingSoundControl = () => {
  const { settings, toggleSetting, toggleMaster, playSound } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const [intensity, setIntensity] = useState<SoundIntensity>(() => {
    return (localStorage.getItem('sound-intensity') as SoundIntensity) || 'focus';
  });
  const [errorProfile, setErrorProfile] = useState<ErrorSoundProfile>(() => {
    return (localStorage.getItem('error-sound-profile') as ErrorSoundProfile) || 'classic';
  });
  const [volume, setVolume] = useState(() => {
    return parseInt(localStorage.getItem('sound-volume') || '70');
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleIntensityChange = (newIntensity: SoundIntensity) => {
    setIntensity(newIntensity);
    localStorage.setItem('sound-intensity', newIntensity);
    playSound('start');
  };

  const handleProfileChange = (newProfile: ErrorSoundProfile) => {
    setErrorProfile(newProfile);
    localStorage.setItem('error-sound-profile', newProfile);
    playSound('error');
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem('sound-volume', String(newVolume));
  };

  const getIntensityEmoji = (mode: SoundIntensity) => {
    switch (mode) {
      case 'relaxed': return '🎵';
      case 'focus': return '🔔';
      case 'silent': return '✓';
    }
  };

  const getProfileColor = (profile: ErrorSoundProfile) => {
    switch (profile) {
      case 'classic': return 'bg-blue-500';
      case 'sci-fi': return 'bg-purple-500';
      case 'gentle': return 'bg-green-500';
      case 'gaming': return 'bg-red-500';
    }
  };

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${
          settings.masterEnabled
            ? 'bg-primary hover:bg-primary/90 text-white scale-100'
            : 'bg-muted text-muted-foreground scale-95'
        }`}
      >
        <Volume2 className="w-6 h-6" />
        {settings.masterEnabled && (
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse"></div>
        )}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-card border border-border/30 rounded-xl shadow-2xl p-4 space-y-4 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              Sound Control
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Master Toggle */}
          <div
            onClick={toggleMaster}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              settings.masterEnabled ? 'bg-primary/20 border border-primary/50' : 'bg-muted/20 border border-muted/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${settings.masterEnabled ? 'bg-primary' : 'bg-muted'}`}>
              <Volume2 className={`w-4 h-4 ${settings.masterEnabled ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold">Master</div>
              <div className="text-xs text-muted-foreground">{settings.masterEnabled ? 'ON' : 'OFF'}</div>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${settings.masterEnabled ? 'bg-primary' : 'bg-muted'}`}>
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform m-1 ${
                  settings.masterEnabled ? 'translate-x-4' : ''
                }`}
              />
            </div>
          </div>

          {/* Intensity Selector */}
          <div className="space-y-2">
            <div className="text-xs font-bold flex items-center gap-2">
              <Zap className="w-3 h-3 text-warning" />
              Intensity
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['relaxed', 'focus', 'silent'] as SoundIntensity[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleIntensityChange(mode)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold text-center transition-all transform ${
                    intensity === mode
                      ? 'bg-primary/30 border border-primary ring-2 ring-primary/40 scale-105'
                      : 'bg-muted/20 border border-border/30 hover:bg-muted/30'
                  }`}
                >
                  <div className="text-lg mb-1">{getIntensityEmoji(mode)}</div>
                  <div className="capitalize">{mode}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sound Profile */}
          <div className="space-y-2">
            <div className="text-xs font-bold flex items-center gap-2">
              <Music className="w-3 h-3 text-secondary" />
              Error Sound
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['classic', 'sci-fi', 'gentle', 'gaming'] as ErrorSoundProfile[]).map((profile) => (
                <button
                  key={profile}
                  onClick={() => handleProfileChange(profile)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all transform ${
                    errorProfile === profile
                      ? `${getProfileColor(profile)} text-white scale-105 ring-2 ring-offset-1 ring-offset-card`
                      : 'bg-muted/20 border border-border/30 hover:bg-muted/30'
                  }`}
                >
                  {profile.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold">Volume</div>
              <div className="text-xs font-bold text-primary">{volume}%</div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg cursor-pointer accent-primary"
            />
          </div>

          {/* Individual Toggles - Compact */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <div className="text-xs font-bold">Alerts</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'errorSound', label: 'Error', icon: '❌' },
                { key: 'startSound', label: 'Start', icon: '▶️' },
                { key: 'endSound', label: 'End', icon: '✓' },
                { key: 'keypressSound', label: 'Key', icon: '⌨️' },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => toggleSetting(key as keyof typeof settings)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    settings[key as keyof typeof settings]
                      ? 'bg-success/30 border border-success/50 text-success'
                      : 'bg-muted/20 border border-border/30 text-muted-foreground'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preview */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30">
            <button
              onClick={() => playSound('error')}
              className="py-2 px-2 bg-danger/20 hover:bg-danger/30 rounded-lg text-xs font-bold text-danger transition-colors"
            >
              Test Error
            </button>
            <button
              onClick={() => playSound('start')}
              className="py-2 px-2 bg-info/20 hover:bg-info/30 rounded-lg text-xs font-bold text-info transition-colors"
            >
              Test Start
            </button>
            <button
              onClick={() => playSound('end')}
              className="py-2 px-2 bg-success/20 hover:bg-success/30 rounded-lg text-xs font-bold text-success transition-colors"
            >
              Test End
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingSoundControl;
