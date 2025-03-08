// Navbar.js
import React from 'react';
import { useTheme } from './ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav>
      <h2>Company Dashboard</h2>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    </nav>
  );
};

export default Navbar;
