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
      setTheme(savedTheme as Theme);
    }
  }, []);
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
