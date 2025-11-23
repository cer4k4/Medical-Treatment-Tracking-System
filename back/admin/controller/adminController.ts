import model from "../../shared/models/userSchema";
import { SuccessResponse } from "../../shared/interfaces/responseInterface";
import { systemErrors, UserRoles } from "../../shared/models/enum"
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { RequestWithUser } from "../../shared/interfaces/request-with-payload.interface";
import { IUser } from "../../shared/models/user.interface";


async function updateUserByAdmin(req: RequestWithUser,res: Response) {
  try {
    const userId = req.params["userId"]
    const updateData = req.body;
    let user = await model.UserModel.findById(userId) as IUser
    if (!user){
      const response = new SuccessResponse({},false,404,systemErrors.USERNOTFOUNDED)
      return res.status(404).json(response);
    }
    if (updateData.newPassword) {
      const hashedPassword = await hash(updateData.newPassword, 10);
      user.password = hashedPassword
    }
    if (updateData.username){
      if (await model.UserModel.findOne({username:updateData.username})) {
        const response = new SuccessResponse({},false,409,systemErrors.USERNAMEEXISTED)
        return res.status(409).json(response);
      }
      user.username = updateData.username
    }
    
    if (updateData.role) {
      if (! await checkRoles(updateData.role)){
        const response = new SuccessResponse({},false,404,systemErrors.ROLENOTEXIST)
        return res.status(404).json(response);
      }
      user.role = updateData.role
    }
    if (updateData.fullName) {
      user.fullName = updateData.fullName
    }
    user.updatedAt = Date.now()
    const result = await model.UserModel.updateOne({ _id: userId }, { $set: user });
    const response = new SuccessResponse(result)
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error UpdateUserByAdmin",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}



async function getUserByAdmin(req:RequestWithUser, res:Response) {
  try {
    const id = req.params["userId"]
    const user = await model.UserModel.findById(id);
    if (!user) {
      const response = new SuccessResponse({},false,404,systemErrors.USERNOTFOUNDED)
      return res.status(404).json(response);
    } else {
      const response = new SuccessResponse(user)
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log("Server Error GetUserByAdmin",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).send(response);
  }
}


async function deleteUser(req:RequestWithUser, res:Response) {
  try {
    const id = req.params["userId"]
    const user = await model.UserModel.findByIdAndDelete(id);
    if (!user) {
      const response = new SuccessResponse({},false,404,systemErrors.USERNOTFOUNDED)
      return res.status(404).json(response);
    } else {
      const response = new SuccessResponse(user)
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log("Server Error DeleteUser",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).send(response);
  }
}



async function allUser(req:RequestWithUser, res:Response) {
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
    const allusers = await model.UserModel.find(query)
      .skip(offset)
      .limit(limit);

    const response = new SuccessResponse(allusers);
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error AllUser", error);
    const response = new SuccessResponse({}, false, 500, systemErrors.SERVERERROR);
    return res.status(500).send(response);
  }
}




async function softDeleteUser(req: RequestWithUser,res: Response) {
  try {
    const userId = req.params["userId"]
    const updateData = req.body;
    let user = await model.UserModel.findById(userId) as IUser
    if (!user){
      const response = new SuccessResponse({},false,404,systemErrors.USERNOTFOUNDED)
      return res.status(404).json(response);
    }
    user.deletedAt = Date.now()
    const result = await model.UserModel.updateOne({ _id: userId }, { $set: user });
    const response = new SuccessResponse()
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error UpdateUserByAdmin",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}

async function checkRoles(role:string) {
  for (let r of Object(UserRoles).values){
    if (role === r) {
      return true
    }
  }
  return false
}


export = { getUserByAdmin , updateUserByAdmin , deleteUser , allUser , softDeleteUser };
