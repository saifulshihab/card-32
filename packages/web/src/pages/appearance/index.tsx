import React, { PropsWithChildren } from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import { ContentHeading } from "../../components/atoms/texts/ContentHeading";
import { ContentSubHeading } from "../../components/atoms/texts/ContentSubHeading";

interface IColorButtonProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

const ColorButton: React.FC<PropsWithChildren<IColorButtonProps>> = (props) => {
  const { children, className, onClick, active } = props;
  return (
    <button
      className={`w-6 h-6 rounded-full ${className} ${
        active ? "border-2 border-white" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Appearance: React.FC = () => {
  return (
    <div>
      <ContentHeading>Appearance</ContentHeading>
      <ContentSubHeading>Theme color</ContentSubHeading>
      <FlexContainer className="mt-3 gap-2">
        <ColorButton className="bg-blue-600" />
        <ColorButton className="bg-orange-600" />
        <ColorButton className="bg-purple-600" active />
        <ColorButton className="bg-green-600" />
        <ColorButton className="bg-yellow-500" />
      </FlexContainer>
    </div>
  );
};

export default Appearance;
