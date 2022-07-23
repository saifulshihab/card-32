import React, { PropsWithChildren } from "react";

interface IProps {
  className?: string;
}

const FlexContainer: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { className, children } = props;
  return (
    <div className={`flexX ${className ? className : ""}`}>{children}</div>
  );
};

export default FlexContainer;
