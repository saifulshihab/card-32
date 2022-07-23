import React, { PropsWithChildren } from "react";

const ContentHeading: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col gap-1 mb-5">
      <h2 className="text-xl font-bold">{children}</h2>
      <div className="w-8 h-1 bg-purple-500" />
    </div>
  );
};

export { ContentHeading };
