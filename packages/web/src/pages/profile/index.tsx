import React, { useState } from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import Button from "../../components/atoms/button/Button";
import TextInput from "../../components/atoms/inputs/TextInput";
import Modal from "../../components/atoms/modal/Modal";
import { ContentHeading } from "../../components/atoms/texts/ContentHeading";
import { useAuthContext } from "../../contexts/AuthProvider";

const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const [profileUpdateModal, setProfileUpdateModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <FlexContainer className="flex-col gap-3 items-start">
        <FlexContainer className="w-full items-start justify-between">
          <ContentHeading>Profile</ContentHeading>
          <Button onClick={() => setProfileUpdateModal(true)}>Edit</Button>
        </FlexContainer>

        <FlexContainer className="flex-col gap-1 items-start">
          <label className="text-sm font-semibold">Username </label>
          <p className="text-xs">{user?.username}</p>
        </FlexContainer>

        <FlexContainer className="flex-col gap-1 items-start">
          <label className="text-sm font-semibold">Email</label>
          <p className="text-xs">{"shihab@gmail.com"}</p>
        </FlexContainer>
      </FlexContainer>

      <FlexContainer className="flex-col gap-3 items-start">
        <FlexContainer className="w-full items-start justify-between">
          <ContentHeading>Change Password</ContentHeading>
          <Button onClick={() => setChangePasswordModal(true)}>Change</Button>
        </FlexContainer>
      </FlexContainer>

      {/* profile update modal */}
      <Modal
        visible={profileUpdateModal}
        onClose={() => setProfileUpdateModal(false)}
      >
        <FlexContainer className="flex-col gap-4 items-start bg-zinc-800 p-4 py-5 text-white">
          <ContentHeading>Update profile</ContentHeading>
          <TextInput
            label="Username"
            placeholder="Enter username"
            className="border-b border-primary"
          />
          <TextInput
            label="Email"
            placeholder="Enter your email (optional)"
            className="border-b border-primary"
          />

          <Button className="mt-2 bg-primary">Update</Button>
        </FlexContainer>
      </Modal>
      {/* password change modal */}
      <Modal
        visible={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
      >
        <FlexContainer className="flex-col gap-4 items-start bg-zinc-800 p-4 py-5 text-white">
          <ContentHeading>Change password</ContentHeading>
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

          <Button className="mt-2 bg-primary">Change</Button>
        </FlexContainer>
      </Modal>
    </div>
  );
};

export default Profile;
