import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 
  | 'smart'
  | 'exam-light'
  | 'eye-care'
  | 'focus-practice'
  | 'auto'
  | 'classic-light'
  | 'deep-dark'
  | 'yellow-comfort'
  | 'paper-view'
  | 'night-reading';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themeLabel: string;
}

const themeLabels: Record<ThemeMode, string> = {
  'smart': 'Smart Theme Mode',
  'exam-light': 'Exam Light Mode',
  'eye-care': 'Eye-Care Dark Mode',
  'focus-practice': 'Focus Practice Mode',
  'auto': 'Auto Theme Switch',
  'classic-light': 'Classic Light Mode',
  'deep-dark': 'Deep Dark Mode',
  'yellow-comfort': 'Yellow Comfort Mode',
  'paper-view': 'Paper View Mode',
  'night-reading': 'Night Reading Mode',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('typing-theme');
    return (saved as ThemeMode) || 'smart';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('typing-theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove(
      'theme-smart', 'theme-exam-light', 'theme-eye-care', 
      'theme-focus-practice', 'theme-auto', 'theme-classic-light',
      'theme-deep-dark', 'theme-yellow-comfort', 'theme-paper-view',
      'theme-night-reading', 'dark'
    );

    // Handle auto theme
    if (theme === 'auto') {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 18) {
        root.classList.add('theme-classic-light');
      } else {
        root.classList.add('theme-deep-dark', 'dark');
      }
    } else {
      root.classList.add(`theme-${theme}`);
      
      // Add dark class for dark themes
      const darkThemes: ThemeMode[] = ['eye-care', 'deep-dark', 'night-reading', 'focus-practice'];
      if (darkThemes.includes(theme)) {
        root.classList.add('dark');
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeLabel: themeLabels[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
