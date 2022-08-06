import React from "react";
import Button from "../../components/atoms/button/Button";
import { ContentHeading } from "../../components/atoms/texts/ContentHeading";
import { ContentSubHeading } from "../../components/atoms/texts/ContentSubHeading";

const Settings: React.FC = () => {
  return (
    <>
      <ContentHeading>Settings</ContentHeading>
      <ContentSubHeading>Delete account permanently</ContentSubHeading>
      <p className="text-sm text-gray-400">This action can&apos;t be undone.</p>
      <Button className="mt-5 bg-red-600">Delete account</Button>
    </>
  );
};

export default Settings;
