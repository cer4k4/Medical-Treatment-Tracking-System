import { param } from "express-validator";
import { Types } from "mongoose";

export interface ITaskIdDto {
  _id: Types.ObjectId;
}

export const ParamTaskIdDto = [
  param("taskId")
  .isMongoId()
  .withMessage("فرمت آیدی تسک وارد شده صحیح نمیباشد"),
];
