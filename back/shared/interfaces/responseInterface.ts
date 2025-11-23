import { systemErrors } from "../models/enum";

export class SuccessResponse {
  successfully: boolean;
  data: any;
  statusCode: number;
  message: string;

  constructor(data?: any,successfully:boolean = true, statusCode: number = 200, messae: string = systemErrors.SUCCESSFUL) {
    this.successfully = successfully;
    this.data = data;
    this.statusCode = statusCode;
    this.message = messae;
  }
}
