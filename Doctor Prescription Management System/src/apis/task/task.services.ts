import { IResponse } from "../../lib/types/base";
import { ApiResponse, apiService } from "../instance";
import { GetUserITask, ITask, UpdateStatus } from "./task.types";

class TaskService {
    // ساخت تسک جدید
  async createTask(data: ITask): Promise<ApiResponse<ITask>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ1ZGRjOGM1MDczYzRkODJlNmUzZjQiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY2Nzg2MzA3LCJleHAiOjE3NjY3ODk5MDd9.6qtGnqXCtSMA9fD3OBN-GGmNQimmqr9mDFXem9r4lhI")
    return apiService.post<ITask>(`/task/create`,data);
  }

  async getPatientOfDoctor(doctorId:string) {
    return apiService.get<IResponse<string[]>>(`/task/patient/${doctorId}`);
  }

  async getTaskOfUser() {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRmMjM2YzM5ZTUwMDE0ZDJjNzYzMDAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2Njk2NDM3MiwiZXhwIjoxNzY2OTY3OTcyfQ.K_UjglcDk2C6FjELCF3gRByZ0aWMattAMqE0hzuYjnQ")
    return apiService.get<IResponse<GetUserITask[]>>(`/task/mytask`);
  }

  async updateStatusTask(taskId: string) {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRmMjM2YzM5ZTUwMDE0ZDJjNzYzMDAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2Njk2NDM3MiwiZXhwIjoxNzY2OTY3OTcyfQ.K_UjglcDk2C6FjELCF3gRByZ0aWMattAMqE0hzuYjnQ")
    return apiService.get<IResponse<UpdateStatus>>(`/task/status/${taskId}`);
  }
}
  
export const taskService = new TaskService();
