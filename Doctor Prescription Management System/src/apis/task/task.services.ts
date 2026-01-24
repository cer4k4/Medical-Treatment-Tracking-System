import { IResponse } from "../../lib/types/base";
import { ApiResponse, apiService } from "../instance";
import { Doctor } from "../user/user.services";
import { GetUserITask, GetUserTaskResponse, ITask, UpdateStatus } from "./task.types";

class TaskService {
  // doctor role
  async createTask(data: ITask): Promise<ApiResponse<ITask>> {
    return apiService.post<ITask>(`/task/create`,data);
  }

  async getPatientOfDoctor(doctorId:string) {
    return apiService.get<IResponse<string[]>>(`/task/patient/${doctorId}`);
  }

  // user role
  async getTaskOfUser(data: string) {
    return apiService.post<IResponse<GetUserTaskResponse>>(`/task/mytask`,{"userId":data});
  }

  async updateStatusTask(taskId: string) {
    return apiService.get<IResponse<UpdateStatus>>(`/task/status/${taskId}`);
  }
}
  
export const taskService = new TaskService();
