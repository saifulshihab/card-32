import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import TextInput from "../../components/atoms/inputs/TextInput";
import { useSocketContext } from "../../contexts/SocketProvider";
import { ILoginInput } from "../../types";

const initialLoginInput: ILoginInput = {
  username: "",
  roomId: "",
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  const [loginInput, setLoginInput] = useState<ILoginInput>(initialLoginInput);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const onFormSubmit = () => {
    // form validation
    if (!loginInput.username) {
      return setFormError("Username required");
    } else if (!loginInput.roomId) {
      return setFormError("Room id required");
    }
    socket.emit(
      "login",
      loginInput,
      (error: string | null, result: { userId: string } | null) => {
        if (error) {
          return setFormError(error);
        }
        if (!result) return;
        navigate("/playground");
      }
    );
    setFormError(undefined);
  };

  const onLoginInputChange = (name: keyof ILoginInput, value: string) => {
    setLoginInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center">
      <div className="mt-5 w-96 p-4 rounded-md border border-yellow-500 bg-zinc-800 shadow shadow-yellow-400">
        <p className="text-2xl mb-3 font-bold">Login</p>
        <FlexContainer className="w-full flex-col gap-3">
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={loginInput.username}
            onChange={(e) => onLoginInputChange("username", e.target.value)}
          />
          <TextInput
            label="Room ID"
            placeholder="Enter room id eg. discord89"
            value={loginInput.roomId}
            onChange={(e) => onLoginInputChange("roomId", e.target.value)}
          />
          {formError ? (
            <p className="text-xs font-semibold text-red-500">{formError}</p>
          ) : null}
          <button
            className="mt-2 inline-block btn-primary bg-yellow-500"
            onClick={onFormSubmit}
          >
            Enter
          </button>
        </FlexContainer>
      </div>
    </div>
  );
};

export default LoginPage;
