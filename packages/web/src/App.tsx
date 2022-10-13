import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { CardsProvider } from "./contexts/CardsProvider";
import { RoomProvider } from "./contexts/RoomProvider";
import { SocketProvider } from "./contexts/SocketProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import Router from "./routes/Router";

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <SocketProvider>
        <RoomProvider>
          <CardsProvider>
            <DndProvider backend={HTML5Backend}>
              <Router />
              <Toaster
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: "6px",
                    background: "#333",
                    color: "#fff",
                  },
                }}
              />
            </DndProvider>
          </CardsProvider>
        </RoomProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
