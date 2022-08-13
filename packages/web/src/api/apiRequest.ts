import axios, { AxiosError } from "axios";
import { BASE_URL } from "../constants/config";

const publicInstance = axios.create({
  baseURL: BASE_URL,
});

const privateInstance = axios.create({
  baseURL: BASE_URL,
});

export function setAuthToken(token: string) {
  if (token) {
    privateInstance.defaults.headers.common["Authorization"] = token;
  }
}
export type ICommonApiError = AxiosError<{ message: string }>;

interface IErrorData<E> {
  status: number;
  error: string;
  data?: E;
}

export function handlePrivateApiError<E>(
  err: AxiosError<E>,
  logoutAction?: () => void
): IErrorData<E> {
  if (err.response && err.response.status) {
    switch (err.response.status) {
      case 400: {
        return { status: 400, error: "", data: err.response.data };
      }
      case 401: {
        logoutAction && logoutAction();
        return {
          status: 401,
          error: "Your session has expired",
          data: err.response.data,
        };
      }
      case 403: {
        return { status: 403, error: "", data: err.response.data };
      }
      case 404: {
        return { status: 404, error: "", data: err.response.data };
      }
      case 500:
        return { status: 500, error: "Server error", data: err.response.data };
      default:
        return { status: 520, error: "Something went wrong!" };
    }
  } else {
    return { status: 520, error: "Something went wrong!" };
  }
}

export function handlePublicApiError<E>(err: AxiosError<E>): IErrorData<E> {
  if (err.response && err.response.status) {
    switch (err.response.status) {
      case 400:
        return { status: 400, error: "", data: err.response.data };
      case 401:
        return { status: 401, error: "", data: err.response.data };
      case 403: {
        return { status: 403, error: "", data: err.response.data };
      }
      case 404: {
        return { status: 404, error: "", data: err.response.data };
      }
      case 500:
        return { status: 500, error: "Server error", data: err.response.data };
      default:
        return { status: 520, error: "Something went wrong!" };
    }
  } else {
    return { status: 520, error: "Something went wrong!" };
  }
}

export const publicApiRequest = publicInstance;
export const privateApiRequest = privateInstance;
