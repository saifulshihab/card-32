import { ISignInOrUpInput } from "@card-32/common/types/user";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { handlePublicApiError, ICommonApiError } from "../../api/apiRequest";
import { userSignUpApi } from "../../api/userApi";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import TextInput from "../../components/atoms/inputs/TextInput";
import { showToastMessage } from "../../components/atoms/toast";
import { useAuthContext } from "../../contexts/AuthProvider";
import { HOME } from "../../routes/routes";
import { userSignupValidator } from "../../validators/userValidator";

const initialLoginInput: ISignInOrUpInput = {
  username: "",
  password: "",
};

const LoginForm = styled.form`
  display: flex;
  flex-flow: column;
  gap: 4;
`;

const LoginPage: React.FC = () => {
  const { isAuthenticated, userLoginApiAction } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [loginInput, setLoginInput] =
    useState<ISignInOrUpInput>(initialLoginInput);
  const [formErrors, setFormErrors] = useState<ISignInOrUpInput | null>(null);

  const onFormSubmit = async () => {
    const { isValid, errors } = await userSignupValidator(loginInput);
    if (isValid) {
      try {
        setLoading(true);
        setFormErrors(null);
        if (mode === "login") {
          await userLoginApiAction(loginInput);
        } else {
          await userSignUpApi(loginInput);
          showToastMessage({
            type: "success",
            message: "Successfully registered.",
            position: "bottom-center",
          });
          setMode("login");
          setLoginInput(initialLoginInput);
        }
      } catch (err) {
        const { error, data } = handlePublicApiError(err as ICommonApiError);
        showToastMessage({
          message: error || data?.message || "Something went wrong",
          position: "bottom-center",
          type: "error",
        });
      }
      setLoading(false);
    } else {
      setFormErrors(errors as any);
    }
  };

  const onLoginInputChange = (name: keyof ISignInOrUpInput, value: string) => {
    setLoginInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isAuthenticated)
    return (
      <Navigate
        to={{
          pathname: HOME,
        }}
      />
    );

  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-96 mt-5 m-3 p-4 rounded-md border border-primary bg-zinc-800 shadow shadow-primary-400">
        <p className="text-2xl mb-5 font-bold">
          {mode === "login" ? "Login" : "Sign Up"}
        </p>
        <LoginForm onSubmit={onFormSubmit}>
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={loginInput.username}
            className="border-b border-primary"
            onChange={(e) => onLoginInputChange("username", e.target.value)}
            error={formErrors?.username}
          />

          <TextInput
            label="Password"
            placeholder="Enter password"
            value={loginInput.password}
            className="border-b border-primary"
            onChange={(e) => onLoginInputChange("password", e.target.value)}
            error={formErrors?.password}
          />

          <FlexContainer>
            <button
              type="submit"
              className="mt-2 inline-block btn-primary bg-primary"
            >
              {mode === "login" ? "Login" : "Sign up"}
              {loading ? "..." : null}
            </button>
          </FlexContainer>

          <FlexContainer>
            {mode === "login" ? (
              <button onClick={() => setMode("signup")}>
                <p className="text-xs text-primary-300">
                  Not registered? Sign up
                </p>
              </button>
            ) : (
              <button onClick={() => setMode("login")}>
                <p className="text-xs text-primary-300">Login</p>
              </button>
            )}
          </FlexContainer>
        </LoginForm>
      </div>
    </div>
  );
};

export default LoginPage;
