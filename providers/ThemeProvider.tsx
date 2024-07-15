'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
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
  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState<Theme>(savedTheme ? (savedTheme as Theme) : Theme.Light);

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
