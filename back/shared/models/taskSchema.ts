import { Schema, model } from "mongoose";
import { ITask } from "./task.interface";
import baseSchema from "./baseSchema";
import { bool, boolean, number } from "joi";

const taskSchema: Schema<ITask> = new Schema<ITask>({
  title:          { type: String, required: true},
  description:    { type: String },
  status:         { type: String, default: "open" },
  creator:        { type: String, required: true  },
  patient:        { type: String },
  tip:            { type: String },
  patientDefault: { type: Boolean },
  ...baseSchema
});

const TaskModel = model("Task", taskSchema);



export = {TaskModel};



