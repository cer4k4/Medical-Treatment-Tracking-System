
export interface IUser {
  createdAt?:Date,
  updatedAt?:Date,
  doctor?: string,
  patient?: string,
  _id: string;
  username?: string;
  fullName: string;
  phoneNumber: string;
  role?: string;
  password?: string;
  specialty?: string;
  patientCount: number;
}