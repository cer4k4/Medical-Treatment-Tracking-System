import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamIdDto {
  _id: Types.ObjectId;
}

export const ParamUserIdDto = [
  param("userId")
  .isMongoId()
  .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),
];
