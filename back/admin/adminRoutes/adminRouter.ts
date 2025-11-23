import express from "express"
import middleware from "../../middleware/authentication.middleware"
import { UpdateUserDto } from "../../users/dto/request/update-user.dto";
import { DataValidator } from "../../shared/middlewares/data-validator.middleware";
import { ParamUserIdDto } from "../../users/dto/request/user-param.dto";
import { PaginationParam } from "../../shared/middlewares/dto/request/pagination.dto";
import { UserRoles } from "../../shared/models/enum";
import adminController from "../controller/adminController";


const adminRouter= express.Router()

adminRouter.get("/byId/:userId",middleware.Authentication,middleware.Authorization([UserRoles.ADMIN]),ParamUserIdDto,DataValidator,adminController.getUserByAdmin)

adminRouter.put("/update/:userId",middleware.Authentication,middleware.Authorization([UserRoles.ADMIN]),ParamUserIdDto,UpdateUserDto,DataValidator,adminController.updateUserByAdmin)

adminRouter.delete("/delete/:userId",middleware.Authentication,middleware.Authorization([UserRoles.ADMIN]),ParamUserIdDto,DataValidator,adminController.deleteUser)

adminRouter.delete("/soft/delete/:userId",middleware.Authentication,middleware.Authorization([UserRoles.ADMIN]),ParamUserIdDto,DataValidator,adminController.softDeleteUser)

adminRouter.get("/list/:page/:limit",middleware.Authentication,middleware.Authorization([UserRoles.ADMIN]),PaginationParam,DataValidator,adminController.allUser)

export = adminRouter;