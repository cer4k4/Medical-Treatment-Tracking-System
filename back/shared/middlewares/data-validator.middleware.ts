import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { IResponseData } from "../interfaces/response-data.interface";
import httpStatus from "http-status";
export const DataValidator = (req: Request,res: Response,next: NextFunction) => {
  let responseObject: IResponseData;
  const result: Result<ValidationError> = validationResult(req);
  if (!result.isEmpty()) {
    let err
    let i: number = 1
    for (let r of result.array()) {
      err = r.msg
      i++
    }
    responseObject = {message: err,statusCode: httpStatus.BAD_REQUEST,error: true,};
    return res.status(responseObject.statusCode as number).json(responseObject);
  }
  return next();
};