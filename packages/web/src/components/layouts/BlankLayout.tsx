import React, { PropsWithChildren } from "react";

const BlankLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-zinc-900 text-zinc-100">
      {children}
    </div>
  );
};

export { BlankLayout };
