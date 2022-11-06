import React, { PropsWithChildren } from "react";

interface IProps {
  id?: string;
}

const SectionContainer: React.FC<PropsWithChildren<IProps>> = ({
  id,
  children,
}) => {
  return (
    <div
      id={id}
      className="container mx-auto w-full flex flex-col gap-12 lg:gap-0 lg:flex-row px-2 sm:px-0 py-12 md:py-24"
    >
      {children}
    </div>
  );
};

export default SectionContainer;
