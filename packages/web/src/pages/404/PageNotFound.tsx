import React from "react";
import { Link } from "react-router-dom";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import { HOME } from "../../routes/routes";

const PageNotFound: React.FC = () => {
  return (
    <FlexContainer className="w-full justify-center flex-col gap-1 py-3">
      <p className="text-2xl font-extrabold">404 &#124; Page not found</p>
      <Link to={HOME}>
        <span className="text-xs underline">Go home</span>
      </Link>
    </FlexContainer>
  );
};

export default PageNotFound;
