import { ISignInOrUpInput, IUser } from "@card-32/common/types/user";
import { publicApiRequest } from "./apiRequest";
import { AxiosResponse } from "axios";
import { IUserLocalStorage } from "../utils/localStorage";

export interface IUserLoginResponse {
  user: IUserLocalStorage;
  accessToken: string;
}

export function userSignUpApi(data: ISignInOrUpInput) {
  return new Promise<AxiosResponse<IUser>>((resolve, reject) => {
    publicApiRequest
      .post("/api/v1/user/signup", data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function userLoginApi(data: ISignInOrUpInput) {
  return new Promise<AxiosResponse<IUserLoginResponse>>((resolve, reject) => {
    publicApiRequest
      .post("/api/v1/user/login", data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}
