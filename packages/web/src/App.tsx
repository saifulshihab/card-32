import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SocketProvider } from "./contexts/SocketProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import Router from "./routes/Router";

const App: React.FC = () => (
  <ThemeProvider>
    <SocketProvider>
      <DndProvider backend={HTML5Backend}>
        <Router />
      </DndProvider>
    </SocketProvider>
  </ThemeProvider>
);

export default App;
