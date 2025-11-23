import { error } from "console";

export enum UserRoles{
    ADMIN = "admin",
    USER = "user"
}

export enum systemErrors {
    PASSWORDWRONG = "رمز عبور یا شناسه کاربری صحیح نمیباشد",
    USERNAMEEXISTED = "این نام کاربری قبلا توسط شخص دیگری گرفته شده است",
    UPDATESUCCESSFUL = "باموفقیت به روزرسانی شد",
    SERVERERROR = "عملیات با شکست مواجه شد",
    SUCCESSFUL = "عملیات با موفقیت انجام شد",
    USERNOTFOUNDED = "چنین کاربری وجود ندارد",
    TASKNOTFOUNDED = "چنین تسکی وجود ندارد",
    TOKENNOTFOUNDED = "برای دسترسی به این بخش میبایست لاگین کنید",
    PERMISSIONDENIED = "کاربر گرامی شما به این بخش دسترسی ندارید",
    TOKENISEXPIRED = "توکن شما منقضی شده یکبار دیگه لاگین کنید",
    ROLENOTEXIST = "این نقش در سیستم تعریف نشده است",
    TOKENNOTVALEID = "فرم توکن درست نیست یکبار دیگه وارد شوید",
}