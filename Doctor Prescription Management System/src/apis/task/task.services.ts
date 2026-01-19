import { IResponse } from "../../lib/types/base";
import { ApiResponse, apiService } from "../instance";
import { Doctor } from "../user/user.services";
import { GetUserITask, GetUserTaskResponse, ITask, UpdateStatus } from "./task.types";

class TaskService {
  // doctor role
  async createTask(data: ITask): Promise<ApiResponse<ITask>> {
  //apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNkNTY1ODE4ZjU5YzJjNzQ4MGFhMWEiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY4MTI2OTU3LCJleHAiOjE3NjgxMzA1NTd9.aXB_fK54I-xlPYFOUNzoPstDhbSHxMMvDaTdrzLZ-RQ")
    return apiService.post<ITask>(`/task/create`,data);
  }

  async getPatientOfDoctor(doctorId:string) {
    return apiService.get<IResponse<string[]>>(`/task/patient/${doctorId}`);
  }

  // user role
  async getTaskOfUser(data: string) {
    //apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2ODE5MTk1MSwiZXhwIjoxNzY4MTk1NTUxfQ.NVsGg_lr_mT2hXxcHUDauh1RZemwY7R0RHc53Nl3wPk")
    return apiService.post<IResponse<GetUserTaskResponse>>(`/task/mytask`,{"userId":data});
  }

  async updateStatusTask(taskId: string) {
    //apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2ODE5MTk1MSwiZXhwIjoxNzY4MTk1NTUxfQ.NVsGg_lr_mT2hXxcHUDauh1RZemwY7R0RHc53Nl3wPk")
    return apiService.get<IResponse<UpdateStatus>>(`/task/status/${taskId}`);
  }
}
  
export const taskService = new TaskService();
