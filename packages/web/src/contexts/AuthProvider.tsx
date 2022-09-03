import { ISignInOrUpInput } from "@card-32/common/types/user";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  handlePrivateApiError,
  handlePublicApiError,
  ICommonApiError,
  setAuthToken,
} from "../api/apiRequest";
import { userAuthCheckApi, userLoginApi } from "../api/userApi";
import { showToastMessage } from "../components/atoms/toast";
import {
  getUserAndTokenFromLocalStorage,
  IUserLocalStorage,
  removeDataOnLocalStorage,
  setUserAndTokenOnLocalStorage,
} from "../utils/localStorage";

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUserLocalStorage | null;
  setUser: React.Dispatch<React.SetStateAction<IUserLocalStorage | null>>;
  accessToken: string | undefined;
  userLoginApiAction: (input: ISignInOrUpInput) => Promise<void>;
  logout: () => void;
}

interface IAuthState {
  isAuthenticated: boolean;
  user: IUserLocalStorage | null;
  accessToken: string | undefined;
}

let authInitialState: IAuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: undefined,
};

const localStorageUserAndToken = getUserAndTokenFromLocalStorage();

if (localStorageUserAndToken) {
  const { user, accessToken } = localStorageUserAndToken;
  setAuthToken(accessToken);
  authInitialState = {
    user,
    isAuthenticated: true,
    accessToken,
  };
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    authInitialState.accessToken
  );
  const [user, setUser] = useState<IUserLocalStorage | null>(
    authInitialState.user
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    authInitialState.isAuthenticated
  );

  const userLoginApiAction = useCallback(async (input: ISignInOrUpInput) => {
    try {
      const { data } = await userLoginApi(input);
      setUser(data.user);
      setUserAndTokenOnLocalStorage(data);
      setAccessToken(data.accessToken);
      setAuthToken(data.accessToken);
      setIsAuthenticated(true);
    } catch (err) {
      const { error, data } = handlePublicApiError(err as ICommonApiError);
      showToastMessage({
        message: error || data?.message || "Something went wrong",
        position: "bottom-center",
        type: "error",
      });
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(undefined);
    removeDataOnLocalStorage();
  }, []);

  const userAuthCheckApiAction = useCallback(async () => {
    try {
      await userAuthCheckApi();
    } catch (err) {
      handlePrivateApiError(err as ICommonApiError, logout);
    }
  }, [logout]);

  useEffect(() => {
    // user auth check on page load
    userAuthCheckApiAction();
  }, [userAuthCheckApiAction]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        isAuthenticated,
        userLoginApiAction,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error("AuthContext must be used within AuthProvider");
  }
  return context;
};
