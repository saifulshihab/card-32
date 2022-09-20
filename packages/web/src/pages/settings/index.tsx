import React, { useState } from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import Button from "../../components/atoms/button/Button";
import Modal from "../../components/atoms/modal/Modal";
import { ContentHeading } from "../../components/atoms/texts/ContentHeading";
import { ContentSubHeading } from "../../components/atoms/texts/ContentSubHeading";

const Settings: React.FC = () => {
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const onAccountDelete = async () => {
    // if (!user) return;
    // try {
    //   setLoading(true);
    //   await deleteUserAccountApi(user._id);
    //   logout();
    // } catch (err) {
    //   const { error, data } = handlePublicApiError(err as ICommonApiError);
    //   showToastMessage({
    //     message: error || data?.message || "Something went wrong",
    //     type: "error",
    //   });
    // } finally {
    //   setLoading(false);
    //   setDeleteAccountModal(false);
    // }

    return;
  };

  return (
    <>
      <ContentHeading>Settings</ContentHeading>
      <ContentSubHeading>Delete account permanently</ContentSubHeading>
      <p className="text-sm text-gray-400">This action can&apos;t be undone.</p>
      <Button
        className="mt-5 bg-red-600"
        onClick={() => setDeleteAccountModal(true)}
      >
        Delete account
      </Button>

      <Modal
        visible={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
      >
        <FlexContainer className="flex-col gap-4 items-start bg-zinc-800 p-5 text-white">
          <ContentSubHeading>Delete account?</ContentSubHeading>
          <p className="text-gray-300">
            Are you sure you want to delete your account permanently?
          </p>

          <FlexContainer className="w-full justify-end gap-2">
            <Button
              className="bg-zinc-700"
              onClick={() => setDeleteAccountModal(false)}
            >
              No
            </Button>
            <Button className="bg-red-600" onClick={onAccountDelete}>
              Yes, delete
            </Button>
          </FlexContainer>
        </FlexContainer>
      </Modal>
    </>
  );
};

export default Settings;
