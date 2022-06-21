import React from "react";
import { SocketProvider } from "./contexts/SocketProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import Router from "./routes/Router";

const App: React.FC = () => (
  <ThemeProvider>
    <SocketProvider>
      <Router />
    </SocketProvider>
  </ThemeProvider>
);

export default App;
