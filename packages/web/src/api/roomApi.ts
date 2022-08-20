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
