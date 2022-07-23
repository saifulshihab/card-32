import React from "react";
import { ContentHeading } from "../../components/atoms/texts/ContentHeading";
import { ContentSubHeading } from "../../components/atoms/texts/ContentSubHeading";

const Settings: React.FC = () => {
  return (
    <>
      <ContentHeading>Settings</ContentHeading>
      <ContentSubHeading>Delete account permanently</ContentSubHeading>
      <p className="text-sm text-gray-400">This action can&apos;t be undone.</p>
      <button className="mt-5 btn-primary bg-red-600">Delete account</button>
    </>
  );
};

export default Settings;
