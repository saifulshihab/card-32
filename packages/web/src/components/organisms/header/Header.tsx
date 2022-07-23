import React, { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { HOME, PROFILE } from "../../../routes/routes";
import FlexContainer from "../../atoms/box/FlexContainer";

const Header: React.FC<PropsWithChildren> = () => {
  const { user } = useAuthContext();
  return (
    <div className="w-full h-14 bg-zinc-800 flex items-center shadow-md">
      <div className="container px-28 m-auto flex justify-between">
        <Link to={HOME}>
          <FlexContainer className="items-center gap-2">
            <i className="fa-solid fa-diamond" />
            <p className="text-2xl font-bold">Card-32</p>
          </FlexContainer>
        </Link>
        <FlexContainer className="items-center gap-2">
          <p className="text-sm font-semibold">{user?.username}</p>
          <Link to={PROFILE}>
            <div className="w-8 h-8 shadow-md rounded-full cursor-pointer border-2 border-zinc-600">
              <img
                className="w-full h-full rounded-full"
                src="https://picsum.photos/200"
                alt="dp"
              />
            </div>
          </Link>
        </FlexContainer>
      </div>
    </div>
  );
};

export default Header;
