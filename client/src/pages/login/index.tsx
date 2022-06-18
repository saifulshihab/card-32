import React from "react";
import TextInput from "../../components/atoms/inputs/TextInput";

const LoginPage: React.FC = () => {
  return (
    <div>
      <div className="w-96 p-2 rounded-md border-2 border-orange-400">
        <div>
          <TextInput label="Username" placeholder="Enter username" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
