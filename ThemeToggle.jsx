import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ToggleButton = styled.button`
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.toggleBorder};
  color: ${({ theme }) => theme.text};
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <ToggleButton onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </ToggleButton>
    );
};

export default ThemeToggle;