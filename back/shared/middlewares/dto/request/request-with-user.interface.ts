import { Request } from "express";
import { IUser } from "../../../models/user.interface";

export interface RequestWithUser extends Request {
  user: IUser;
}


