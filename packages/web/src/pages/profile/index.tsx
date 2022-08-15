import {
  IPasswordChangeInput,
  IProfileUpdateInput,
} from "@card-32/common/types/user";

import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { handlePublicApiError, ICommonApiError } from "../../api/apiRequest";
import {
  emailCheckApi,
  usernameCheckApi,
  userPasswordChangeApi,
  userProfileUpdateApi,
} from "../../api/userApi";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import Button from "../../components/atoms/button/Button";
import TextInput from "../../components/atoms/inputs/TextInput";
import Modal from "../../components/atoms/modal/Modal";
import { ContentHeading } from "../../components/atoms/texts/ContentHeading";
import { showToastMessage } from "../../components/atoms/toast";
import { useAuthContext } from "../../contexts/AuthProvider";
import { setUserAndTokenOnLocalStorage } from "../../utils/localStorage";
import { getValueOrUndefined } from "../../utils/string";
import {
  userChangePasswordValidator,
  userEmailUpdateValidator,
  userProfileUpdateValidator,
  userUsernameUpdateValidator,
} from "../../validators/userValidator";

const initialFormErrors: {
  username?: string;
  email?: string;
  newPassword?: string;
  oldPassword?: string;
} = {
  username: undefined,
  email: undefined,
  oldPassword: undefined,
  newPassword: undefined,
};

const Profile: React.FC = () => {
  const { user, accessToken, setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [profileUpdateModal, setProfileUpdateModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [usernameEmailAvailable, setAvailability] = useState<{
    username?: boolean;
    email?: boolean;
  }>({
    username: false,
    email: false,
  });

  const [profileUpdateInput, setProfileUpdateInput] =
    useState<IProfileUpdateInput>({
      username: user?.username || "",
      email: user?.email,
    });
  const [changePasswordInput, setChangePasswordInput] =
    useState<IPasswordChangeInput>({
      newPassword: "",
      oldPassword: "",
    });

  const [formErrors, setFormErrors] = useState<typeof initialFormErrors | null>(
    null
  );

  const onProfileUpdateInputChange = (
    key: keyof IProfileUpdateInput,
    value: string
  ) => {
    setProfileUpdateInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const checkUsername = useDebouncedCallback(async (username: string) => {
    setFormErrors(null);
    if (username === user?.username) {
      return setAvailability({ username: undefined, email: undefined });
    }
    const { isValid, errors } = await userUsernameUpdateValidator(
      profileUpdateInput
    );
    if (isValid) {
      try {
        setLoading(true);
        await usernameCheckApi(username);
        setAvailability({ username: true });
      } catch {
        setAvailability({ username: false });
        setFormErrors({ username: "Username taken" });
      }
    } else {
      setFormErrors(errors);
    }
    setLoading(false);
  }, 500);

  const checkEmail = useDebouncedCallback(async (email: string) => {
    setFormErrors(null);
    if (!email) {
      return setAvailability({ email: undefined });
    }
    if (email === user?.email) {
      return setAvailability({ username: undefined, email: undefined });
    }
    const { isValid, errors } = await userEmailUpdateValidator({
      ...profileUpdateInput,
      email: getValueOrUndefined(profileUpdateInput.email),
    });
    if (isValid) {
      try {
        setLoading(true);
        await emailCheckApi(email);
        setAvailability({ email: true });
      } catch {
        setAvailability({ email: false });
        setFormErrors({ email: "Email is registered already" });
      }
    } else {
      setFormErrors(errors);
    }
    setLoading(false);
  }, 500);

  const handleUsernameChange = async (value: string) => {
    onProfileUpdateInputChange("username", value);
    await checkUsername(value);
  };

  const handleEmailChange = async (value: string) => {
    onProfileUpdateInputChange("email", value);
    await checkEmail(value);
  };

  const handlePasswordInputChange = (
    key: keyof IPasswordChangeInput,
    value: string
  ) => {
    setChangePasswordInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onProfileUpdateSubmit = async () => {
    if (!user) return;
    const { isValid } = await userProfileUpdateValidator({
      ...profileUpdateInput,
      email: getValueOrUndefined(profileUpdateInput.email),
    });
    if (isValid)
      try {
        const { data } = await userProfileUpdateApi(user._id, {
          ...profileUpdateInput,
          email: profileUpdateInput.email || undefined,
        });
        setUser(data);
        if (accessToken) {
          setUserAndTokenOnLocalStorage({
            user: data,
            accessToken,
          });
        }
        setAvailability({
          username: false,
          email: false,
        });
        setProfileUpdateModal(false);
      } catch (err) {
        const { error, data } = handlePublicApiError(err as ICommonApiError);
        showToastMessage({
          message: error || data?.message || "Something went wrong",
          type: "error",
        });
      }
  };

  const onPasswordChangeSubmit = async () => {
    if (!user) return;
    setFormErrors(null);
    const { isValid, errors } = await userChangePasswordValidator(
      changePasswordInput
    );
    if (isValid) {
      try {
        setLoading(true);
        await userPasswordChangeApi(user._id, changePasswordInput);
        setChangePasswordInput({
          newPassword: "",
          oldPassword: "",
        });
        setChangePasswordModal(false);
      } catch (err) {
        const { error, data } = handlePublicApiError(err as ICommonApiError);
        showToastMessage({
          message: error || data?.message || "Something went wrong",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

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
          <p className="text-xs">{user?.email || "No email"}</p>
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
            value={profileUpdateInput.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            errorMessage={formErrors?.username}
            infoMessage={
              usernameEmailAvailable.username ? "Username available" : undefined
            }
          />
          <TextInput
            label="Email"
            placeholder="Enter your email (optional)"
            className="border-b border-primary"
            value={profileUpdateInput.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            errorMessage={formErrors?.email}
            infoMessage={
              usernameEmailAvailable.email ? "Email available" : undefined
            }
          />

          <Button
            className="mt-2 bg-primary"
            onClick={onProfileUpdateSubmit}
            loading={loading}
          >
            Update
          </Button>
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
            type="password"
            label="Old password"
            placeholder="Enter old password"
            className="border-b border-primary"
            value={changePasswordInput.oldPassword}
            onChange={(e) =>
              handlePasswordInputChange("oldPassword", e.target.value)
            }
            errorMessage={formErrors?.oldPassword}
          />
          <TextInput
            type="password"
            label="New password"
            placeholder="Enter new password"
            className="border-b border-primary"
            value={changePasswordInput.newPassword}
            onChange={(e) =>
              handlePasswordInputChange("newPassword", e.target.value)
            }
            errorMessage={formErrors?.newPassword}
          />

          <Button
            className="mt-2 bg-primary"
            onClick={onPasswordChangeSubmit}
            loading={loading}
          >
            Change
          </Button>
        </FlexContainer>
      </Modal>
    </div>
  );
};

export default Profile;
