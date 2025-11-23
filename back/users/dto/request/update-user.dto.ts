import { body } from "express-validator";

export interface IUpdateUserDto {
  username?: string;
  fullName?: string;
  password?: string;
  newPassword?: string;
  role?: string;
}

export const UpdateUserDto = [
  body("username")
    .optional()
    .trim()
    .isString()
    .withMessage("نام کاربری باید رشته باشد")
    .isAlphanumeric("en-US")
    .withMessage("نام کاربری شامل حروف انگلیسی و اعداد می باشد")
    .isLength({ min: 4, max: 20 })
    .withMessage("حداقل طول نام کاربری ۴ و حداکثر ۲۰ کاراکتر می باشد")
    .toLowerCase(),

  body("newPassword")
    .optional()
    .isString()
    .withMessage("رمز عبور جدید باید رشته باشد")
    .isLength({ min: 8, max: 32 })
    .withMessage("حداقل طول رمز عبور جدید باید ۸ کاراکتر باشد")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage("رمز عبور جدید باید شامل حروف بزرگ و کوچک انگلیسی و نماد ها باشد"),

  body("fullName")
    .optional()
    .trim()
    .isString()
    .withMessage("نام باید رشته باشد")
    .isLength({ min: 3, max: 32 })
    .withMessage("حداقل طول نام ۳ و حداکثر ۳۲ کاراکتر می باشد"),

  body("role")
    .optional()
    .trim()
    .isString()
    .withMessage("نقش باید رشته باشد")
    .isLength({ min: 4, max: 15 })
    .withMessage("حداقل طول نقش ۴ و حداکثر ۱۵ کاراکتر می باشد"),

];