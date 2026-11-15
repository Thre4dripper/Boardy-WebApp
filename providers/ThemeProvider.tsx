'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Theme } from '@/enums/Theme';

interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themeContext = createContext<ThemeContext>({
  theme: Theme.Light,
  setTheme: () => {},
});

interface IThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: IThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // localStorage is only available after hydration; reading it during render
      // would make the server and client markup disagree.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme as Theme);
    }
  }, []);
  // Overlays (popovers, tooltips) render in a portal outside the app root,
  // so the theme class must also live on <html> for HeroUI to theme them.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.Dark);
  }, [theme]);
  return <themeContext.Provider value={{ theme, setTheme }}>{children}</themeContext.Provider>;
};

const useTheme = () => {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export { ThemeProvider, useTheme };
