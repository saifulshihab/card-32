import React from "react";
import { SocketProvider } from "./contexts/SocketProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import Playground from "./pages/playground";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SocketProvider>
        <div className="min-w-full min-h-screen bg-gray-900 text-gray-100">
          <Playground />
        </div>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
