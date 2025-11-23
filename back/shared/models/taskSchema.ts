import { Schema, model } from "mongoose";
import { ITask } from "./task.interface";
import baseSchema from "./baseSchema";

const taskSchema: Schema<ITask> = new Schema<ITask>({
  title:        { type: String, required: true},
  description:  { type: String },
  status:       { type: String, default: "open" },
  creator:      { type: String, required: true  },
  ...baseSchema
});

const TaskModel = model("Task", taskSchema);



export = {TaskModel};



