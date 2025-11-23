import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import model from "../shared/models/userSchema"
import { systemErrors, UserRoles } from "../shared/models/enum";
import { RequestWithPayload, RequestWithUser } from "../shared/interfaces/request-with-payload.interface";
import { IPayload } from "../shared/interfaces/jwt-payload.interface";
import { IUser } from "../shared/models/user.interface";
import { SuccessResponse } from "../shared/interfaces/responseInterface";
var secretKey = "@dsf$sdsaxcxzxc213";

const Authorization = (roles:UserRoles[]) => {
  return async (req:RequestWithUser, res:Response, next:NextFunction) => {
    
    try {      
      const role = req.user?.role;
      for (let r of roles) {
        if (role === r) {
          return next();
        }
      }
      const response = new SuccessResponse({},false,403,systemErrors.PERMISSIONDENIED)
      return res.status(403).json(response);
    } catch (err) {
      console.log("Server Error Authorization",err)
      next(err);
    }
  };
}

async function Authentication(req: RequestWithPayload, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization || "";
    if (!token) {
      const response = new SuccessResponse({},false,401,systemErrors.TOKENNOTFOUNDED)
      return res.status(401).json(response);
    }
    
    const payload:IPayload = jwt.verify(token, secretKey) as IPayload;
    const userFound = await model.UserModel.findById(payload.userId);
    
    if (!userFound) {
      const response = new SuccessResponse({},false,404,systemErrors.USERNOTFOUNDED)
      return res.status(404).json(response);
    }

    (req as RequestWithUser).user = userFound;
    const requestWithUser = req as RequestWithUser;
    if (requestWithUser.user){
      requestWithUser.user.userId = String(userFound._id)
    }
    return next();
  } catch (err) {
    console.log("Server Error Authentication",err)
    if (String(err) === "TokenExpiredError: jwt expired") {
      const response = new SuccessResponse({},false,400,systemErrors.TOKENISEXPIRED)
      return res.status(400).json(response);
    }
    if (String(err) === "JsonWebTokenError: invalid token")  {
      const response = new SuccessResponse({},false,400,systemErrors.TOKENNOTVALEID)
      return res.status(400).json(response);
    }
    const response = new SuccessResponse(String(err),false,500,systemErrors.SERVERERROR)
    return res.status(500).json(response);
  }
}

function generateToken(user: IUser): string {
  const payload:IPayload = {
    userId:user.userId,
    role:user.role
  };

  return jwt.sign(payload, secretKey, {expiresIn: '1h'})
}

export = { Authentication, generateToken , Authorization };
