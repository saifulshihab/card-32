import React, { useState } from "react";
import FlexContainer from "../../components/atoms/box/FlexContainer";
import Button from "../../components/atoms/button/Button";
import TextInput from "../../components/atoms/inputs/TextInput";

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const onFormSubmit = async () => {
    // const { isValid, errors } = await userSignupValidator(loginInput);
    // if (isValid) {
    //   try {
    //     setLoading(true);
    //     setFormErrors(null);
    //     if (mode === "login") {
    //       await userLoginApiAction(loginInput);
    //     } else {
    //       await userSignUpApi(loginInput);
    //       showToastMessage({
    //         type: "success",
    //         message: "Successfully registered.",
    //         position: "bottom-center",
    //       });
    //       setMode("login");
    //       setLoginInput(initialLoginInput);
    //     }
    //   } catch (err) {
    //     const { error, data } = handlePublicApiError(err as ICommonApiError);
    //     showToastMessage({
    //       message: error || data?.message || "Something went wrong",
    //       position: "bottom-center",
    //       type: "error",
    //     });
    //   }
    //   setLoading(false);
    // } else {
    //   setFormErrors(errors as any);
    // }

    return;
  };

  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-96 mt-5 m-3 p-4 rounded-md border border-primary bg-zinc-800 shadow shadow-primary-400">
        <p className="text-2xl mb-5 font-bold">
          {mode === "login" ? "Login" : "Sign Up"}
        </p>
        <FlexContainer className="w-full flex-col gap-4">
          <TextInput
            label="Username"
            placeholder="Enter username"
            // value={loginInput.username}
            className="border-b border-primary"
            // onChange={(e) => onLoginInputChange("username", e.target.value)}
            // errorMessage={formErrors?.username}
          />

          <TextInput
            type="password"
            label="Password"
            placeholder="Enter password"
            // value={loginInput.password}
            className="border-b border-primary"
            // onChange={(e) => onLoginInputChange("password", e.target.value)}
            // errorMessage={formErrors?.password}
          />

          <FlexContainer>
            <Button
              className="mt-2 inline-block bg-primary"
              onClick={onFormSubmit}
            >
              {mode === "login" ? "Login" : "Sign up"}
              {/* {loading ? "..." : null} */}
            </Button>
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
        </FlexContainer>
      </div>
    </div>
  );
};

export default LoginPage;
