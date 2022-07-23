import React, { PropsWithChildren } from "react";

const ContentSubHeading: React.FC<PropsWithChildren> = ({ children }) => {
  return <h3 className="text-lg font-semibold">{children}</h3>;
};

export { ContentSubHeading };
