export interface IUser {
  _id: string;
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

export interface IPasswordChangeInput {
  newPassword: string;
  oldPassword: string;
}
