import express from "express"
import taskController from "../controller/taksController"
import middleware from "../../middleware/authentication.middleware"
import { DataValidator } from "../../shared/middlewares/data-validator.middleware";
import { ParamTaskIdDto } from "../dto/request/task-param.dto";
import { PaginationParam } from "../../shared/middlewares/dto/request/pagination.dto";
import { CreateTaskDto } from "../dto/request/create-task.dto";
import { UpdateTaskDto } from "../dto/request/update-task.dto";


const taskRouter= express.Router()

taskRouter.post("/create",middleware.Authentication,CreateTaskDto,DataValidator,taskController.createTask)

taskRouter.put("/edit/:taskId",middleware.Authentication,ParamTaskIdDto,UpdateTaskDto,DataValidator,taskController.editTask)

taskRouter.get("/byId/:taskId",middleware.Authentication,ParamTaskIdDto,DataValidator,taskController.getTask)

taskRouter.get("/my/:page/:limit",middleware.Authentication,PaginationParam,DataValidator,taskController.allMyTasks)

taskRouter.get("/all/:page/:limit",middleware.Authentication,PaginationParam,DataValidator,taskController.allTasks)

taskRouter.delete("/delete/:taskId",middleware.Authentication,ParamTaskIdDto,DataValidator,taskController.deleteTask)

taskRouter.delete("/soft/delete/:taskId",middleware.Authentication,ParamTaskIdDto,DataValidator,taskController.softDeleteTask)

taskRouter.patch("/status/:taskId",middleware.Authentication,ParamTaskIdDto,DataValidator,taskController.updateTaskStatus)


export = taskRouter;