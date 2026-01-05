import { IResponse } from "../../lib/types/base";
import { ApiResponse, apiService } from "../instance";
import { Doctor } from "../user/user.services";
import { GetUserITask, GetUserTaskResponse, ITask, UpdateStatus } from "./task.types";

class TaskService {
  // doctor role
  async createTask(data: ITask): Promise<ApiResponse<ITask>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNlNzEyZTAyNDEzNDZhNzQzOTRiY2MiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NTg1NDAwLCJleHAiOjE3Njc1ODkwMDB9.lZOngSCb5Kc5NEnnpuT8w65NCwOmumdYKqDm3sPo3HI")
    return apiService.post<ITask>(`/task/create`,data);
  }

  async getPatientOfDoctor(doctorId:string) {
    return apiService.get<IResponse<string[]>>(`/task/patient/${doctorId}`);
  }

  // user role
  async getTaskOfUser(data: string) {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRmMjM2YzM5ZTUwMDE0ZDJjNzYzMDAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzU2MDM5NCwiZXhwIjoxNzY3NTYzOTk0fQ.ZsyHV0GqqfAOTEKLsU1HSKbhhfuqpC7kBiJHfRa4re8")
    return apiService.post<IResponse<GetUserTaskResponse>>(`/task/mytask`,data);
  }

  async updateStatusTask(taskId: string) {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRmMjM2YzM5ZTUwMDE0ZDJjNzYzMDAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzU2MDM5NCwiZXhwIjoxNzY3NTYzOTk0fQ.ZsyHV0GqqfAOTEKLsU1HSKbhhfuqpC7kBiJHfRa4re8")
    return apiService.get<IResponse<UpdateStatus>>(`/task/status/${taskId}`);
  }
}
  
export const taskService = new TaskService();
