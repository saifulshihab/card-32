import React from "react";
import { useThemeContext } from "../../contexts/ThemeContext";
import Board from "./board";
import Sidebar from "./sidebar";

const Playground: React.FC = () => {
  const { sidebarOrder } = useThemeContext();
  return (
    <div className="w-full h-screen flex gap-1">
      <Sidebar />
      <div
        className={`flex-1 h-full flex flex-col gap-1 ${
          sidebarOrder === 1 ? "order-2" : "order-1"
        }`}
      >
        <Board />
      </div>
    </div>
  );
};

export default Playground;
