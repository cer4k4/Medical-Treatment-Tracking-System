import express from "express"
import userRouter from "../users/userRoutes/userRouter"
import adminRouter from "../admin/adminRoutes/adminRouter"
import taskRouter from "../task/taskRoutes/taskRouter"

const baseRouter = express.Router()
baseRouter.use("/users", userRouter)
baseRouter.use("/admin", adminRouter)
baseRouter.use("/task", taskRouter)

export = baseRouter;