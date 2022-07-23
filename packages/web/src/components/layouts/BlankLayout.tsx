import React, { PropsWithChildren } from "react";

const BlankLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export { BlankLayout };
