import {
  IPasswordChangeInput,
  IProfileUpdateInput,
  ISignInOrUpInput,
  IUser,
} from "@card-32/common/types/user";
import { privateApiRequest, publicApiRequest } from "./apiRequest";
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

export function getUserProfileApi(userId: string) {
  return new Promise<AxiosResponse<IUser>>((resolve, reject) => {
    privateApiRequest
      .get(`/api/v1/user/${userId}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function usernameCheckApi(username: string) {
  return new Promise<AxiosResponse<{ message: string }>>((resolve, reject) => {
    privateApiRequest
      .get("/api/v1/user/profile/check/username", { params: { username } })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function emailCheckApi(email: string) {
  return new Promise<AxiosResponse<{ message: string }>>((resolve, reject) => {
    privateApiRequest
      .get("/api/v1/user/profile/check/email", { params: { email } })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function userProfileUpdateApi(
  userId: string,
  data: IProfileUpdateInput
) {
  return new Promise<AxiosResponse<IUser>>((resolve, reject) => {
    privateApiRequest
      .put(`/api/v1/user/${userId}`, data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function userPasswordChangeApi(
  userId: string,
  data: IPasswordChangeInput
) {
  return new Promise((resolve, reject) => {
    privateApiRequest
      .put(`/api/v1/user/${userId}/change/password`, data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}
