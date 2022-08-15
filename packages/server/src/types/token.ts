export interface ISignInTokenPayload {
  _id: string;
  username: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}
