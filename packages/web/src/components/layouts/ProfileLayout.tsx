import React, { PropsWithChildren } from "react";
import Header from "../organisms/header/Header";
import ProfileSidebar from "../organisms/profile/ProfileSidebar";

const ProfileLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      <Header />
      <div className="container px-28 m-auto py-8">
        <div className="w-full h-full grid grid-cols-5">
          <div className="col-span-1">
            <ProfileSidebar />
          </div>
          <div className="col-span-4 px-8">{children}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileLayout;
