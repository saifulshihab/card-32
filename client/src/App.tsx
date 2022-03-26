import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Playground from "./pages/playground";

const App: React.FC = () => {
  return (
    <div className="min-w-full min-h-screen bg-gray-900 text-gray-100">
      <ThemeProvider>
        <Playground />
      </ThemeProvider>
    </div>
  );
};

export default App;
