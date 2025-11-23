import { body } from "express-validator";

export interface ICreateTaskDto {
  title: string;
  description?: string;
}

export const CreateTaskDto = [
  body("title")
    .trim()
    .isString()
    .withMessage("عنوان باید رشته باشد")
    .isAlphanumeric("en-US")
    .isLength({ min: 4, max: 20 })
    .withMessage("حداقل طول عنوان ۴ و حداکثر ۲۰ کاراکتر می باشد")
    .toLowerCase(),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("توضیحات باید رشته باشد")
    .isLength({ min: 3, max: 260 })
    .withMessage("حداقل طول توضیحات ۳ و حداکثر ۲۶۰ کاراکتر می باشد"),
];