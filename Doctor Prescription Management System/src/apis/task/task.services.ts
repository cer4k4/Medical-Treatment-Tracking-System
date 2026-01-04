import { IResponse } from "../../lib/types/base";
import { ApiResponse, apiService } from "../instance";
import { Doctor } from "../user/user.services";
import { GetUserITask, GetUserTaskResponse, ITask, UpdateStatus } from "./task.types";

class TaskService {
    // ساخت تسک جدید به وسیله دکتر
  async createTask(data: ITask): Promise<ApiResponse<ITask>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ1ZGRjOGM1MDczYzRkODJlNmUzZjQiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NTYwNzUwLCJleHAiOjE3Njc1NjQzNTB9.OBBjbr6uW0YRVQ-wDbSKbAifalZux8i1x-47Kweq4m0")
    return apiService.post<ITask>(`/task/create`,data);
  }

  async getPatientOfDoctor(doctorId:string) {
    return apiService.get<IResponse<string[]>>(`/task/patient/${doctorId}`);
  }

  async getTaskOfUser() {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRmMjM2YzM5ZTUwMDE0ZDJjNzYzMDAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzU2MDM5NCwiZXhwIjoxNzY3NTYzOTk0fQ.ZsyHV0GqqfAOTEKLsU1HSKbhhfuqpC7kBiJHfRa4re8")
    return apiService.get<IResponse<GetUserTaskResponse>>(`/task/mytask`);
  }

  async updateStatusTask(taskId: string) {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRmMjM2YzM5ZTUwMDE0ZDJjNzYzMDAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzU2MDM5NCwiZXhwIjoxNzY3NTYzOTk0fQ.ZsyHV0GqqfAOTEKLsU1HSKbhhfuqpC7kBiJHfRa4re8")
    return apiService.get<IResponse<UpdateStatus>>(`/task/status/${taskId}`);
  }
}
  
export const taskService = new TaskService();
