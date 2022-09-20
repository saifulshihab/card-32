import { privateApiRequest, publicApiRequest } from "./apiRequest";
import { AxiosResponse } from "axios";

export interface IUserLoginResponse {
  user: any;
  accessToken: string;
}

export function userSignUpApi(data: any) {
  return new Promise<AxiosResponse<any>>((resolve, reject) => {
    publicApiRequest
      .post("/api/v1/user/signup", data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function userLoginApi(data: any) {
  return new Promise<AxiosResponse<IUserLoginResponse>>((resolve, reject) => {
    publicApiRequest
      .post("/api/v1/user/login", data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function userAuthCheckApi() {
  return new Promise((resolve, reject) => {
    privateApiRequest
      .get("/api/v1/user/auth")
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function getUserProfileApi(userId: string) {
  return new Promise<AxiosResponse<any>>((resolve, reject) => {
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

export function userProfileUpdateApi(userId: string, data: any) {
  return new Promise<AxiosResponse<any>>((resolve, reject) => {
    privateApiRequest
      .put(`/api/v1/user/${userId}`, data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function userPasswordChangeApi(userId: string, data: any) {
  return new Promise((resolve, reject) => {
    privateApiRequest
      .put(`/api/v1/user/${userId}/change/password`, data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function deleteUserAccountApi(userId: string) {
  return new Promise((resolve, reject) => {
    privateApiRequest
      .delete(`/api/v1/user/${userId}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}
