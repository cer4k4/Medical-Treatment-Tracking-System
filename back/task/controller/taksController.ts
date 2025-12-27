import model from "../../shared/models/taskSchema";
import { SuccessResponse }  from "../../shared/interfaces/responseInterface";
import { systemErrors } from "../../shared/models/enum"
import { Request, Response } from "express";
import { RequestWithUser } from "../../shared/interfaces/request-with-payload.interface";
import { IUser } from "../../shared/models/user.interface";
import { ITask } from "../../shared/models/task.interface";
import { date } from "joi";


async function createTask(req:RequestWithUser, res:Response) {
  try {
    const user = (req.user) as IUser
    const body = req.body
    const oldTask = await model.TaskModel.findOne({ "patient" : body.patient })
    if (!oldTask) {
      throw new Error("Task not found");
    }
    const { _id, __v, createdAt, ...updateData } = oldTask.toObject();
    await model.TaskModel.updateOne(
      { _id: oldTask._id },
      { $set: updateData }
    );

    const newTask = await model.TaskModel.create({
      tip: body.tip,
      title: body.title,
      creator: user.userId,
      patient: body.patient,
      patientDefault: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      description: body.description,
    });
    const response = new SuccessResponse({"taskId":newTask.id,"title":newTask.title,"description":newTask.description,"patient":newTask.patient,"tip":newTask.tip},true,201,systemErrors.SUCCESSFUL)
    return res.status(201).json(response);
  } catch (error) {
    console.log("Server Error CreateTask",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}

async function editTask(req: Request,res: Response) {
  try {
    const updateData = req.body;
    const id = req.params["taskId"]
    const task = await model.TaskModel.findById(id) as ITask;
    if (updateData.title){
      task.title = updateData.title
    }
    if (updateData.description) {
      task.description = updateData.description
    }
    if (updateData.status && (updateData.status === "open" || updateData.status === "done")){
      task.status = updateData.status
    }
    if (updateData.patient) {
      task.patient = updateData.patient
    }
    task.updatedAt = Date.now()
    const result = await model.TaskModel.updateOne({ _id: id }, { $set: task});
    const response = new SuccessResponse(result,true,200,systemErrors.UPDATESUCCESSFUL)
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error EditTask",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}


async function getTask(req:Request, res:Response) {
  try {
    const id = req.params["taskId"]
    const task = await model.TaskModel.findById(id);
    const response = new SuccessResponse(task)
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error GetTask",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}


async function updateTaskStatus(req:Request, res:Response) {
  try {
    const id = req.params["taskId"]
    const task = await model.TaskModel.findById(id) as ITask;
    if (task.status === "open"){
      task.status = "done"
    }else{
      task.status = "open"  
    }
    const result = await model.TaskModel.updateOne({ _id: id }, { $set: task});
    const response = new SuccessResponse({task})
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error GetTask",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}


async function deleteTask(req:RequestWithUser, res:Response) {
  try {
    const id = req.params["userId"]
    const user = await model.TaskModel.findByIdAndDelete(id);
    if (!user) {
      const response = new SuccessResponse({},false,404,systemErrors.TASKNOTFOUNDED)
      return res.status(404).json(response);
    } else {
      const response = new SuccessResponse(user)
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log("Server Error HardDeleteTask",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).send(response);
  }
}


async function allMyTasks(req:RequestWithUser, res:Response) {
  try {
    const user = (req.user) as IUser
    const doctorId = req.params["doctorId"]
    const limit = Number(req.params["limit"])
    const page = Number(req.params["page"])
    const offset = (page - 1) * limit
    const allMyTasks = await model.TaskModel.find({creator:doctorId,patient:user.patient,deletedAt:{$exists:false}}).skip(offset).limit(limit);
    const response = new SuccessResponse(allMyTasks)
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error AllMyTasks",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).send(response);
  }
}


async function allTasks(req: RequestWithUser, res: Response) {
  try {
    const limit = Number(req.params["limit"]);
    const page = Number(req.params["page"]);
    const feild = req.query["feild"];
    const word = req.query["word"] || "";
    const offset = (page - 1) * limit;

    let query: any = { deletedAt: { $exists: false } };

    if (feild) {
      query[feild as string] = { $regex: word, $options: "i" };
    }

    const alltasks = await model.TaskModel.find(query)
      .skip(offset)
      .limit(limit);

    const response = new SuccessResponse(alltasks);
    return res.status(200).json(response);

  } catch (error) {
    console.log("Server Error AllTasks", error);
    const response = new SuccessResponse({}, false, 500, systemErrors.SERVERERROR);
    return res.status(500).send(response);
  }
}



async function softDeleteTask(req:RequestWithUser, res:Response) {
  try {
    const userId = req.params["userId"]
    const updateData = req.body;
    let task = await model.TaskModel.findById(userId) as ITask
    if (!task){
      const response = new SuccessResponse({},false,404,systemErrors.TASKNOTFOUNDED)
      return res.status(404).json(response);
    }
    task.deletedAt = Date.now()
    const result = await model.TaskModel.updateOne({ _id: userId }, { $set: task });
    const response = new SuccessResponse()
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error SoftDeleteTask",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}



export = {createTask,editTask,allTasks,allMyTasks,getTask,deleteTask,softDeleteTask,updateTaskStatus};
