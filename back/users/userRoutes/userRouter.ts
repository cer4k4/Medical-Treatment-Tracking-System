import express from "express"
import userController from "../controller/userController"
import middleware from "../../middleware/authentication.middleware"
import { RegisterUserDto } from "../dto/request/create-user.dto";
import { UpdateUserDto } from "../dto/request/update-user.dto";
import { LoginUserDto } from "../dto/request/login-user.dto";
import { DataValidator } from "../../shared/middlewares/data-validator.middleware";
import { UserRoles } from "../../shared/models/enum";





const userRouter= express.Router()

userRouter.post("/create",RegisterUserDto,DataValidator,userController.registerUser)

userRouter.get("/byId",middleware.Authentication,middleware.Authorization([UserRoles.ADMIN,UserRoles.USER]),userController.getUser)

userRouter.patch("/update",middleware.Authentication,middleware.Authorization([UserRoles.ADMIN,UserRoles.USER]),UpdateUserDto,DataValidator,userController.updateUser)

userRouter.post("/login",LoginUserDto,DataValidator,userController.loginUser)


export = userRouter;