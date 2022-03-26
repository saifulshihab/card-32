import React, { useState } from "react";

interface IThemeContext {
  sidebarOrder: number;
  setSidebarOrder: (order: number) => void;
}

const ThemeContext = React.createContext<IThemeContext | null>(null);

export const ThemeProvider: React.FC = (props) => {
  const [sidebarOrder, setSidebarOrder] = useState(1);

  return (
    <ThemeContext.Provider
      value={{
        sidebarOrder,
        setSidebarOrder,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = React.useContext(ThemeContext);
  if (context === null) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};
