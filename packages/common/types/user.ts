export interface IUser {
  username: string;
  password: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignInOrUpInput {
  username: string;
  password: string;
}

export interface IProfileUpdateInput {
  username: string;
  email?: string;
}
