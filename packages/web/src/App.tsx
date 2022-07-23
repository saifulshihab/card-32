import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CardsProvider } from "./contexts/CardsProvider";
import { RoomProvider } from "./contexts/RoomProvider";
import { SocketProvider } from "./contexts/SocketProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import Router from "./routes/Router";

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <SocketProvider>
        <DndProvider backend={HTML5Backend}>
          <RoomProvider>
            <CardsProvider>
              <Router />
              <ToastContainer />
            </CardsProvider>
          </RoomProvider>
        </DndProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
