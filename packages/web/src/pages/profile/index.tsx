import React from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import TextInput from "../../components/atoms/inputs/TextInput";
import { ContentHeading } from "../../components/atoms/texts/ContentHeading";
import { useAuthContext } from "../../contexts/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuthContext();
  return (
    <>
      <ContentHeading>Profile</ContentHeading>
      <div className="flex flex-col items-start gap-4">
        <FlexContainer className="flex-col gap-1 items-start">
          <label className="text-sm font-semibold">Username </label>
          <p className="text-xs">{user?.username}</p>
        </FlexContainer>
        <FlexContainer className="flex-col gap-1 items-start">
          <label className="text-sm font-semibold">Email</label>
          <p className="text-xs">{"shihab@gmail.com"}</p>
        </FlexContainer>
        <button className="btn-primary">Edit</button>
        <div className="mt-3">
          <ContentHeading>Change password</ContentHeading>
          <FlexContainer className="flex-col gap-4 items-start">
            <TextInput
              label="Old password"
              placeholder="Enter old password"
              className="border-b border-primary"
            />
            <TextInput
              label="New password"
              placeholder="Enter new password"
              className="border-b border-primary"
            />

            <button className="btn-primary">Change</button>
          </FlexContainer>
        </div>
      </div>
    </>
  );
};

export default Profile;
