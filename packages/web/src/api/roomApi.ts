import { IRoom, IRoomCreateInput } from "@card-32/common/types/room";
import { AxiosResponse } from "axios";
import { privateApiRequest } from "./apiRequest";

export function roomCreateApi(data: IRoomCreateInput) {
  return new Promise<AxiosResponse<IRoom>>((resolve, reject) => {
    privateApiRequest
      .post("/api/v1/room", data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function roomDeleteApi(roomId: string) {
  return new Promise<AxiosResponse<IRoom>>((resolve, reject) => {
    privateApiRequest
      .delete(`/api/v1/room/${roomId}`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function joinRoomApi(data: IRoomCreateInput) {
  return new Promise<AxiosResponse<IRoom>>((resolve, reject) => {
    privateApiRequest
      .put(`/api/v1/room/${data.roomId}`, data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}
