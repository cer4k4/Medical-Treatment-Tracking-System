
import mongoose from 'mongoose';
import model from "../../shared/models/taskSchema";
import { SuccessResponse }  from "../../shared/interfaces/responseInterface";
import { systemErrors } from "../../shared/models/enum"
import { Request, response, Response } from "express";
import { RequestWithUser } from "../../shared/interfaces/request-with-payload.interface";
import { IUser } from "../../shared/models/user.interface";
import { ITask } from "../../shared/models/task.interface";
import { date } from "joi";
import { IUserTask } from '../../shared/models/usertask.interface';
import  model2  from '../../shared/models/usertaskSchema';
import  model3  from '../../shared/models/userSchema';

async function createTask(req:RequestWithUser, res:Response) {
  try {
    const user = (req.user) as IUser
    const body = req.body
    const oldTask = await model.TaskModel.findOne({ "patient" : body.patient })

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


async function updateTaskStatus(req:RequestWithUser, res:Response) {
  try {
    const user = (req.user) as IUser
    const id = req.params["taskId"]
    const task = await model2.UserTask.findById(id) as IUserTask;
    if (task.status === true){
      task.status = false
    }else{
      task.status = true  
    }
    const result = await model2.UserTask.updateOne({ _id: id }, { $set: task});
    console.log(result)
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



async function getPatientOfDoctor(req: Request, res: Response) {
  try {
    const doctorId = req.params["doctorId"];
    const diseases = await model.TaskModel.find({ creator: doctorId }).distinct('patient');
    const response = new SuccessResponse(diseases);
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error AllPatient", error);
    const response = new SuccessResponse({}, false, 500, systemErrors.SERVERERROR);
    return res.status(500).send(response);
  }
}

async function assignTasksToUser(creatorId: string,patient: string,userId: string) {
  // 1. گرفتن taskId ها
  const taskIds = await model.TaskModel.find(
    {
      creator: creatorId,
      patient: patient,
    },
    { _id: 1 }
  ).lean();

  if (!taskIds.length) {
    return {
      successfully: true,
      insertedCount: 0,
      message: 'No tasks found',
    };
  }
  let documents:IUserTask[] = []
  for (let t of taskIds  ){
    documents.push({taskId:String(t._id),userId:userId,status:false,createdAt:Date.now(),updatedAt:Date.now()})
  }

  // 3. insert bulk
  const result = await model2.UserTask.insertMany(documents);

  return {
    successfully: true,
    insertedCount: result.length,
  };
};

interface TaskOfUser {
  taskId: string;
  status?: boolean;
  title: string;
  description: string;
  patient: string;
  tip?: string;
  specialty?: string;
  creatorName: string;
  doctorPhoneNumber: string;
}

async function getTasksForUser(req: RequestWithUser , res:Response) {
  const user = (req.user) as IUser
  try {
    const result2: TaskOfUser[] = []
    if (user.role !== "user" ){
      // 1. گرفتن همه taskId های کاربر
      const userTasks = await model2.UserTask.find({ userId: req.body.userId }).lean();
      const responsenotfound = new SuccessResponse([],false,404,systemErrors.TASKNOTFOUNDED)
      if ( !userTasks || userTasks.length === 0 ) return res.status(404).json(responsenotfound) ;
      // 2. ساخت Map برای دسترسی سریع به status
      const userTasksMap = userTasks.reduce((acc, ut) => {
        acc[ut.taskId.toString()] = ut.status ?? false;
        return acc;
      }, {} as Record<string, boolean>);
      // 3. گرفتن task های مربوطه
      const taskIds = userTasks.map(t => t.taskId);
      const tasks = await model.TaskModel.find({ _id: { $in: taskIds } }).lean();
      if (!tasks || tasks.length === 0) return [];
      // 4. گرفتن creator ها و fullName
      const creatorIds = Array.from(new Set(tasks.map(t => t.creator)));
      const doctoruser = await model3.UserModel.findById(creatorIds)

      for (let ut of userTasks ){
      const taskFound = await model.TaskModel.findOne({ _id: ut.taskId });
      result2.push({
          taskId: ut._id.toString(),
          status: ut.status,
          creatorName: doctoruser?.fullName || "",
          doctorPhoneNumber: doctoruser?.phoneNumber || "",
          specialty: doctoruser?.specialty || "",
          title: taskFound?.title || "",
          description: taskFound?.description || "",
          patient: taskFound?.patient || "",
          tip: taskFound?.tip,
        })
      }
      const trueCount = result2.filter(t => t.status === true).length;
      const falseCount = result2.filter(t => t.status === false).length;
      const startDate = tasks[0].createdAt
      const response = new SuccessResponse({data:result2,taskDone:trueCount,todo:falseCount,startDate})
      return res.status(200).json(response);      
    }
    // 1. گرفتن همه taskId های کاربر
    const userTasks = await model2.UserTask.find({ userId: user.userId }).lean();
    if (!userTasks || userTasks.length === 0) return [];

    // 3. گرفتن task های مربوطه
    const taskIds = userTasks.map(t => t.taskId);
    const tasks = await model.TaskModel.find({ _id: { $in: taskIds } }).lean();
    if (!tasks || tasks.length === 0) return [];
    console.log("tasks",userTasks)
    console.log("taskIds",taskIds)
    // 4. گرفتن creator ها و fullName
    const creatorIds = Array.from(new Set(tasks.map(t => t.creator)));
    const doctoruser = await model3.UserModel.findById(creatorIds)
    const startDate = tasks[0].createdAt
    for (let ut of userTasks ){
      const taskFound = await model.TaskModel.findOne({ _id: ut.taskId });
      result2.push({
        taskId: ut._id.toString(),
        status: ut.status,
        creatorName: doctoruser?.fullName || "",
        doctorPhoneNumber: doctoruser?.phoneNumber || "",
        specialty: doctoruser?.specialty || "",
        title: taskFound?.title || "",
        description: taskFound?.description || "",
        patient: taskFound?.patient || "",
        tip: taskFound?.tip,
      })
    }
    const trueCount = result2.filter(t => t.status === true).length;
    const falseCount = result2.filter(t => t.status === false).length;
    const response = new SuccessResponse({data:result2,taskDone:trueCount,todo:falseCount,startDate})
    return res.status(200).json(response);
  } catch (err) {
    console.error('خطا در دریافت task های کاربر:', err);
    return [];
  }
}



export = { createTask,editTask,allTasks,allMyTasks,getTask,deleteTask,softDeleteTask,updateTaskStatus,getPatientOfDoctor,assignTasksToUser,getTasksForUser };
