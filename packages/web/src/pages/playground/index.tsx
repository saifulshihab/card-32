import React, { useEffect } from "react";
import { useThemeContext } from "../../contexts/ThemeProvider";
import Board from "../../components/organisms/board";
import Sidebar from "../../components/organisms/sidebar";
import { useNavigate } from "react-router-dom";
import { getPlayerFromLocalStorage } from "../../utils/localStorage";

const Playground: React.FC = () => {
  const navigate = useNavigate();
  const { sidebarOrder } = useThemeContext();
  const playerFromLocalStorage = getPlayerFromLocalStorage();

  useEffect(() => {
    if (!playerFromLocalStorage?.player) {
      navigate("/");
    }
  }, []);

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
