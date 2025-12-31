import { IBaseModel } from "./baseModel";

export interface IUserTask extends IBaseModel {
    taskId: string;
    userId: string;
    status: boolean;
}