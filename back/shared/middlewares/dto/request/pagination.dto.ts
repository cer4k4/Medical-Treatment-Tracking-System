import { param } from "express-validator";


export const PaginationParam = [
  param("page")
  .isInt({gt:0})
  .withMessage("page  => (پارامتر باید دامنه اعداد طبیعی باشد) فرمت پارامتر وارد شده صحیح نمیباشد"),

  param("limit")
  .isInt({gt:0,max:100})
  .withMessage(`همچنین کمتر از ۱۰۰باشد <= limit | limit =>  (پارامتر باید دامنه اعداد طبیعی باشد) فرمت پارامتر وارد شده صحیح نمیباشد`),
];

