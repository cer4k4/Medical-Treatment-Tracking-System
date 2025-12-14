import { IBaseModel } from "./baseModel";

export interface ITask extends IBaseModel {
    title:              string
    description:        string
    status:             string
    creator:            string
    patient:            string
    tip?:               string
    patientDefault:     boolean
}