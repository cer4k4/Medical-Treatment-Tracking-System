import { Request } from "express";
import { IPayload } from "./jwt-payload.interface";
import { IUser } from "../models/user.interface";

export interface RequestWithUser extends Request {
  user?: IUser
}

export interface RequestWithPayload extends Request {
  payload?: IPayload;
}
