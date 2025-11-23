import { body } from "express-validator";

export interface ICreateUserDto {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export const RegisterUserDto = [
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
    .isLength({ min: 8, max: 32 })
    .withMessage("حداقل طول رمز عبور باید ۸ کاراکتر باشد")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage("رمز عبور باید شامل حروف بزرگ و کوچک انگلیسی و نماد ها باشد"),

  body("fullName")
    .optional()
    .trim()
    .isString()
    .withMessage("نام باید رشته باشد")
    .isLength({ min: 3, max: 32 })
    .withMessage("حداقل طول نام ۳ و حداکثر ۳۲ کاراکتر می باشد"),

  body("phoneNumber")
    .isString()
    .withMessage("شماره موبایل باید رشته باشد")
    .isLength({ min: 11, max: 11 })
    .withMessage(" طول شماره موبایل باید ۱۱ کاراکتر باشد")
];