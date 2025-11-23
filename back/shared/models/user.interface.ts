import { IBaseModel } from "./baseModel";

export interface IUser extends IBaseModel{
  userId:    string;
  username:  string;
  fullName?: string;
  phoneNumber: string;
  role:      string;
  password:  string;
}
