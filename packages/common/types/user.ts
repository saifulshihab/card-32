export interface IUser {
  username: string;
  password: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignUpInput {
  username: string;
  password: string;
}
