import React from 'react';

const ThemeContext = React.createContext({
  theme: "default",
  setTheme: () => { }
});
export default ThemeContext;