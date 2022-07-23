import React, { PropsWithChildren } from "react";
import Header from "../organisms/header/Header";

const MainLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      <Header />
      <div className="container px-28 m-auto py-2">{children}</div>
    </React.Fragment>
  );
};

export default MainLayout;
