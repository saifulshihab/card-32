import React from "react";
import { useThemeContext } from "../../contexts/ThemeProvider";
import Board from "../../components/organisms/board";
import Sidebar from "../../components/organisms/sidebar";

const Playground: React.FC = () => {
  const { sidebarOrder } = useThemeContext();
  return (
    <div className="w-full h-full flex flex-col sm:flex-row gap-1">
      {/* left sidebar */}
      <Sidebar />
      {/* board & chat */}
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
