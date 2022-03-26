import React from "react";
import styled from "styled-components";
import FlexContainer from "../../../components/atoms/box/FlexContainer";
import Button from "../../../components/atoms/button";
import { PlayerCard } from "../../../components/organisms/playerCard";
import { useThemeContext } from "../../../contexts/ThemeContext";

const SidebarContainer = styled.div`
  width: 320px;
`;

const Sidebar: React.FC = () => {
  const { sidebarOrder, setSidebarOrder } = useThemeContext();
  return (
    <SidebarContainer
      className={`w-2/12 h-full bg-gray-800 relative order-${sidebarOrder}`}
    >
      <FlexContainer className="justify-between bg-gray-700 px-2 shadow">
        <FlexContainer className="my-2 gap-2">
          <div className="w-10 h-10 rounded-full shadow">
            <img
              src="https://picsum.photos/200"
              alt="user"
              className="w-full h-full rounded-full border-2 border-blue-500"
            />
          </div>
          <div>
            <p className="text-lg leading-6">shihab</p>
            <p className="text-xs">don't freeze</p>
          </div>
        </FlexContainer>
        <FlexContainer className="gap-1">
          <Button
            onClick={() =>
              setSidebarOrder(
                sidebarOrder === 1 ? 2 : sidebarOrder === 2 ? 1 : 1
              )
            }
          >
            <i className="fa-solid fa-table-cells-large"></i>
          </Button>
          <Button>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </Button>
        </FlexContainer>
      </FlexContainer>

      <div className="mt-20">
        <FlexContainer className="flex-col justify-center">
          <p className="text-xl font-semibold text-ellipsis text-center">
            discord#970
          </p>
          <FlexContainer className="text-xs gap-1">
            <i className="fa-solid fa-users"></i>
            <p className="text-xs">4/4</p>
          </FlexContainer>
        </FlexContainer>

        {/* player cards */}
        <FlexContainer className="justify-center my-4 mt-8">
          <div className="inline-grid grid-cols-2 grid-rows-2 gap-4 items-center">
            <PlayerCard name="shihab" />
            <PlayerCard name="ovy" />
            <PlayerCard name="antor" />
            <PlayerCard name="zawad" />
          </div>
        </FlexContainer>
      </div>

      {/* sidebar bottom content */}
      <div className="w-full absolute bottom-0 p-2 flex flex-col gap-2">
        {/* bid select */}
        <FlexContainer>
          <div className="flex-1">
            <select className="w-full bg-gray-700 rounded-tl-sm rounded-bl-sm py-1.5 text-center outline-hidden">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
            </select>
          </div>
          <button className="bg-blue-600 text-xs rounded-tr-sm rounded-br-sm py-2 px-3">
            Bid
          </button>
        </FlexContainer>
        <FlexContainer className="gap-2 justify-center">
          <Button className="border border-blue-600 shadow-blue-600">
            Start Game
          </Button>
          <Button className="border border-purple-600 shadow-purple-600">
            Restart
          </Button>
        </FlexContainer>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
