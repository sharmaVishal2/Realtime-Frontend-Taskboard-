import React, { useState, useEffect, createContext, useContext } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/theme.js';
import { GlobalStyles } from '../styles/GlobalStyles.js';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const isDarkMode = theme === 'dark';

    const toggleTheme = () => {
        const updatedTheme = isDarkMode ? 'light' : 'dark';
        setTheme(updatedTheme);
        localStorage.setItem('theme', updatedTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                <GlobalStyles />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};