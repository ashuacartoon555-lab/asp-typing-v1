import {
  Keyboard,
  Book,
  Gamepad2,
  GraduationCap,
  Menu,
  X,
  FileText,
  Palette,
  Volume2,
  VolumeX,
  Check,
  Sun,
  Moon,
  Eye,
  Focus,
  Sparkles,
  FileCheck,
  Lightbulb,
  Newspaper,
  Coffee,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import { useState, useEffect, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const Header = forwardRef<HTMLElement>((_, ref) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { theme, setTheme } = useTheme();
  const { settings, toggleSetting, toggleMaster } = useSound();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { path: '/', label: 'Typing Test', icon: Keyboard },
    { path: '/games', label: 'Typing Games', icon: Gamepad2 },
    { path: '/exam-mode', label: 'Exam Mode', icon: GraduationCap },
    { path: '/tutorial', label: 'Tutorial', icon: Book },
    { path: '/analytics', label: 'Your Typing Analytics', icon: BarChart3 }
  ];

  const themeOptions = [
    { value: 'smart', label: 'Smart Theme', icon: Sparkles, description: 'AI-optimized colors' },
    { value: 'exam-light', label: 'Exam Light', icon: FileCheck, description: 'Bright for exams' },
    { value: 'eye-care', label: 'Eye-Care Dark', icon: Eye, description: 'Reduce eye strain' },
    { value: 'focus-practice', label: 'Focus Practice', icon: Focus, description: 'Minimal distractions' },
    { value: 'auto', label: 'Auto Switch', icon: Sparkles, description: 'Time-based auto' },
    { value: 'classic-light', label: 'Classic Light', icon: Sun, description: 'Clean white theme' },
    { value: 'deep-dark', label: 'Deep Dark', icon: Moon, description: 'Pure dark mode' },
    { value: 'yellow-comfort', label: 'Yellow Comfort', icon: Lightbulb, description: 'Warm sepia tones' },
    { value: 'paper-view', label: 'Paper View', icon: Newspaper, description: 'Book-like reading' },
    { value: 'night-reading', label: 'Night Reading', icon: Coffee, description: 'Low-light friendly' }
  ] as {
    value: ThemeMode;
    label: string;
    icon: React.ElementType;
    description: string;
  }[];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'hsla(200, 50%, 10%, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'hsla(0, 0%, 100%, 0.2)'
      }}
    >
      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(178, 72%, 45%), hsl(42, 98%, 58%), transparent)',
            backgroundSize: '200% 100%'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              Tt
            </div>
            <span className="hidden sm:inline">OnlineTypingTest.in</span>
            <span className="sm:hidden text-sm">OTT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex">
            <ul className="flex gap-1 bg-muted/40 p-1 rounded-2xl">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Controls & CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                {theme === 'smart' && <Sparkles className="w-5 h-5 text-amber-400" />}
                {theme === 'deep-dark' && <Moon className="w-5 h-5 text-blue-400" />}
                {theme === 'exam-light' && <Sun className="w-5 h-5 text-yellow-400" />}
                {theme === 'eye-care' && <Eye className="w-5 h-5 text-green-400" />}
                {!['smart', 'deep-dark', 'exam-light', 'eye-care'].includes(theme) && <Palette className="w-5 h-5 text-purple-400" />}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {themeOptions.map(opt => (
                  <DropdownMenuItem key={opt.value} onClick={() => setTheme(opt.value as ThemeMode)}>
                    <opt.icon className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sound Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                {settings.masterEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-red-400" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sound Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Master Volume</span>
                    <Switch checked={settings.masterEnabled} onCheckedChange={toggleMaster} />
                  </div>
                  {settings.masterEnabled && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span>Error Sound</span>
                        <Switch 
                          checked={settings.errorEnabled}
                          onCheckedChange={() => toggleSetting('errorEnabled')}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Start Sound</span>
                        <Switch 
                          checked={settings.startEnabled}
                          onCheckedChange={() => toggleSetting('startEnabled')}
                        />
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Start Test CTA Button */}
            <Link
              to="/"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              <Keyboard className="w-4 h-4 inline mr-2" />
              Start Test
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-muted/50 backdrop-blur-sm p-4 space-y-3">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Controls */}
            <div className="border-t border-border/50 pt-3 space-y-3">
              {/* Theme Control */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Theme</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full px-3 py-2 bg-muted rounded-lg text-sm font-medium text-left flex items-center justify-between hover:bg-muted/80">
                    <span>Current: {themeOptions.find(t => t.value === theme)?.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {themeOptions.map(opt => (
                      <DropdownMenuItem key={opt.value} onClick={() => setTheme(opt.value as ThemeMode)}>
                        <opt.icon className="w-4 h-4 mr-2" />
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Sound Control */}
              <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg">
                <span className="text-sm font-medium">Sound</span>
                <Switch checked={settings.masterEnabled} onCheckedChange={toggleMaster} />
              </div>

              {/* Start Test Button */}
              <Link
                to="/"
                className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-center flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Keyboard className="w-4 h-4" />
                Start Test
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;