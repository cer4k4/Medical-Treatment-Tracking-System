import { IResponse } from "../../lib/types/base";
import { ApiResponse, apiService } from "../instance";
import { GetUserITask, ITask, UpdateStatus } from "./task.types";

class TaskService {
    // ساخت تسک جدید به وسیله دکتر
  async createTask(data: ITask): Promise<ApiResponse<ITask>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNlNzEyZTAyNDEzNDZhNzQzOTRiY2MiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NTE3OTU5LCJleHAiOjE3Njc1MjE1NTl9.U0XmtWd9VLDqI95Up9UKB-f-axIVQLCS3BfWiAQcKQA")
    return apiService.post<ITask>(`/task/create`,data);
  }

  async getPatientOfDoctor(doctorId:string) {
    return apiService.get<IResponse<string[]>>(`/task/patient/${doctorId}`);
  }

  async getTaskOfUser() {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzUzNTkyMSwiZXhwIjoxNzY3NTM5NTIxfQ.1bzwABmGbw9_SgstL_-OJpu-b_-m9f1PSST1VtQNGrw")
    return apiService.get<IResponse<GetUserITask[]>>(`/task/mytask`);
  }

  async updateStatusTask(taskId: string) {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzUzNTkyMSwiZXhwIjoxNzY3NTM5NTIxfQ.1bzwABmGbw9_SgstL_-OJpu-b_-m9f1PSST1VtQNGrw")
    return apiService.get<IResponse<UpdateStatus>>(`/task/status/${taskId}`);
  }
}
  
export const taskService = new TaskService();
