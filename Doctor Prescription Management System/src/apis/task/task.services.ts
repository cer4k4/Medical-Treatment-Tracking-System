import { IResponse } from "../../lib/types/base";
import { ApiResponse, apiService } from "../instance";
import { GetUserITask, ITask, UpdateStatus } from "./task.types";

class TaskService {
    // ساخت تسک جدید
  async createTask(data: ITask): Promise<ApiResponse<ITask>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNlNzEyZTAyNDEzNDZhNzQzOTRiY2MiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NDk5NDM3LCJleHAiOjE3Njc1MDMwMzd9.-48Z7oMCYhWAAEEqyPFYm4bk-cFPiFzwUtCcF6mlFwE")
    return apiService.post<ITask>(`/task/create`,data);
  }

  async getPatientOfDoctor(doctorId:string) {
    return apiService.get<IResponse<string[]>>(`/task/patient/${doctorId}`);
  }

  async getTaskOfUser() {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzQ5OTk1MywiZXhwIjoxNzY3NTAzNTUzfQ.0O8dTvCnEKX6Lv2lkLhGN-CiyGwNjktKU-KDufuRXYg")
    return apiService.get<IResponse<GetUserITask[]>>(`/task/mytask`);
  }

  async updateStatusTask(taskId: string) {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzQ5OTk1MywiZXhwIjoxNzY3NTAzNTUzfQ.0O8dTvCnEKX6Lv2lkLhGN-CiyGwNjktKU-KDufuRXYg")
    return apiService.get<IResponse<UpdateStatus>>(`/task/status/${taskId}`);
  }
}
  
export const taskService = new TaskService();
