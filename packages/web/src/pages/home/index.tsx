import React from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";

const HomePage: React.FC = () => {
  return (
    <div className="">
      <FlexContainer className="justify-between items-center my-2">
        <p className="text-lg font-bold">Active Rooms</p>
        <button className="btn-primary bg-purple-600">Create Room</button>
      </FlexContainer>

      <div></div>
    </div>
  );
};

export default HomePage;
