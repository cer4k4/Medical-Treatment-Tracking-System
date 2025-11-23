import model from "../../shared/models/userSchema";
import { SuccessResponse }  from "../../shared/interfaces/responseInterface";
import auth from "../../middleware/authentication.middleware";
import { systemErrors, UserRoles } from "../../shared/models/enum"
import { hash, compare } from "bcrypt";
import { Request, Response } from "express";
import { RequestWithUser } from "../../shared/interfaces/request-with-payload.interface";
import { IUser } from "../../shared/models/user.interface";


async function registerUser(req:Request, res:Response) {
  try {
    const body = req.body
    const username = body.username;
    const userFoundByUsername = await model.UserModel.findOne({username});
    if (userFoundByUsername) {
      const response = new SuccessResponse({},false,409,systemErrors.USERNAMEEXISTED)
      return res.status(409).json(response);
    }
    const phoneNumber = body.phoneNumber;
    const userFoundByphoneNumber = await model.UserModel.findOne({phoneNumber});
    if (userFoundByphoneNumber) {
      const response = new SuccessResponse({},false,409,systemErrors.USERNAMEEXISTED)
      return res.status(409).json(response);
    }
    const fullName = body.fullName;
    const password = body.password;
    const hashedPassword = await hash(String(password), 10);
    const newUser = await model.UserModel.create({
      username,
      fullName,
      phoneNumber,
      password: hashedPassword,
    });
    const response = new SuccessResponse({username: newUser.username, fullName: newUser.fullName, role: newUser.role},true,201,systemErrors.SUCCESSFUL)
    return res.status(201).json(response);
  } catch (error) {
    console.log("Server Error RegisterUser",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}

async function updateUser(req: RequestWithUser,res: Response) {
  try {
    const updateData = req.body;
    const user = (req.user) as IUser
    console.log(user)
    if (updateData.username){
      if (await model.UserModel.findOne({username:updateData.username})) {
        const response = new SuccessResponse({},false,409,systemErrors.USERNAMEEXISTED)
        return res.status(409).json(response);
      }
      user.username = updateData.username
    }
    const password = req.body.password || '';
    if (updateData.newPassword) {
      if (! await compare(password,String(user.password))) {
        const response = new SuccessResponse({},false,400,systemErrors.PASSWORDWRONG)
        return res.status(400).json(response);
      }
      const hashedPassword = await hash(updateData.newPassword, 10);
      user.password = hashedPassword
    }
    user.fullName = updateData.fullName
    user.updatedAt = Date.now()
    const result = await model.UserModel.updateOne({ _id: user.userId }, { $set: user});
    const response = new SuccessResponse(result,true,200,systemErrors.UPDATESUCCESSFUL)
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error UpdateUser",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}

async function getUser(req:RequestWithUser, res:Response) {
  try {
    const user = req.user as IUser
    const response = new SuccessResponse({"username":user.username,"fullName":user.fullName})
    return res.status(200).json(response);
  } catch (error) {
    console.log("Server Error GetUser",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}

async function loginUser(req:Request, res:Response) {
  try {
    const username = req.body.username || '';
    const password = req.body.password || '';
    const phoneNumber = req.body.password || '';
    const userFound = await model.UserModel.findOne({username,deletedAt: { $exists: false } });
    if (!userFound) {
      const response = new SuccessResponse({},false,404,systemErrors.USERNOTFOUNDED)
      return res.status(404).json(response);
    }
    if ( ! await compare(password,String(userFound.password))) {
      const response = new SuccessResponse({},false,400,systemErrors.PASSWORDWRONG)
      return res.status(400).json(response);
    }
    const user:IUser = {
      userId: userFound.id,
      username: username,
      password: password,
      phoneNumber: phoneNumber,
      role: UserRoles.USER,
      fullName: String(userFound.fullName),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const response = new SuccessResponse(auth.generateToken(user))
    return res.json(response);
  } catch (error) {
    console.log("Server Error LoginUser",error)
    const response = new SuccessResponse({},false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}










export = {getUser,registerUser,updateUser,loginUser};
