import { Schema, model } from "mongoose";
import baseSchema from "./baseSchema";
import { IUserTask } from "./usertask.interface";

const usertaskSchema: Schema<IUserTask> = new Schema<IUserTask>({
  userId: { type: String ,required: true},
  taskId: { type: String, required: true },
  status:{ type: Boolean, default: true },
  ...baseSchema,
},{ versionKey: false },);

const UserTask = model("UserTask", usertaskSchema);

export = {UserTask}