import { body } from "express-validator";

export const LoginUserDto = [
  body("username")
    .trim()
    .isString()
    .withMessage("نام کاربری باید رشته باشد")
    .isAlphanumeric("en-US")
    .withMessage("نام کاربری شامل حروف انگلیسی و اعداد می باشد")
    .isLength({ min: 4, max: 20 })
    .withMessage("حداقل طول نام کاربری ۴ و حداکثر ۲۰ کاراکتر می باشد")
    .toLowerCase(),

  body("password")
    .isString()
    .withMessage("رمز عبور باید رشته باشد")
    .isLength({ min: 4, max: 32 })
];