import React, { PropsWithChildren } from "react";

interface IProps {
  className?: string;
}

const FlexContainer: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { className, children } = props;
  return (
    <div className={`flex items-center ${className ? className : ""}`}>
      {children}
    </div>
  );
};

export default FlexContainer;
