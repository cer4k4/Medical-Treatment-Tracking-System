import { body } from "express-validator";

export interface IUpdateTaskDto {
  title: string;
  description?: string;
  status?: string;
}

export const UpdateTaskDto = [
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

  body("status")
    .optional()
    .trim()
    .isString()
    .withMessage("وضعیت باید رشته باشد (done ، open)")
    .isLength({ min: 3, max: 6 })
    .withMessage("حداقل طول وضعیت ۴ و حداکثر ۴ کاراکتر می باشد"),
];