export interface ITask {
    _id?: string,
    title: string,
    description: string,
    patient: string,
    tip: string,
    status?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface GetUserITask {
    taskId?: string,
    title: string,
    description: string,
    patient: string,
    tip: string,
    creatorName: string,
    specialty: string,
    status?: boolean,
    doctorPhoneNumber: string,
}

export interface GetUserTaskResponse {
  data: GetUserITask[];
  taskDone: number;
  todo: number;
  startDate: number;
}

export interface UpdateStatus {
    _id: string,
    userId: string,
    taskId: string,
    status: boolean,
    createdAt: number,
    updatedAt: number
}