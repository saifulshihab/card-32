import React, { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { APPEARANCE, PROFILE, SETTINGS } from "../../../routes/routes";

interface IListItemProps {
  active?: boolean;
}

const ListItem: React.FC<PropsWithChildren<IListItemProps>> = ({
  children,
  active,
}) => (
  <li
    className={`py-2.5 px-3 hover:bg-zinc-700 cursor-pointer border-r-2 hover:border-r-primary ${
      active ? "border-primary" : "border-transparent"
    } border-b border-b-zinc-700 border-t border-t-zinc-900`}
  >
    {children}
  </li>
);

const ProfileSidebar: React.FC = () => {
  const { logout } = useAuthContext();
  const { pathname } = useLocation();
  return (
    <div className="w-full">
      <div className="bg-zinc-800">
        <ul className="flex flex-col text-sm">
          <Link to={APPEARANCE}>
            <ListItem active={pathname === APPEARANCE}>Appearance</ListItem>
          </Link>
          <Link to={PROFILE}>
            <ListItem active={pathname === PROFILE}>Profile</ListItem>
          </Link>
          <Link to={SETTINGS}>
            <ListItem active={pathname === SETTINGS}>Settings</ListItem>
          </Link>
        </ul>
      </div>
      <button onClick={logout} className="btn-primary w-full mt-3">
        <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
        Logout
      </button>
    </div>
  );
};

export default ProfileSidebar;
