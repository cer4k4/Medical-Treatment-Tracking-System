import { Schema, model } from "mongoose";
import { UserRoles } from "./enum";
import { IUser } from "./user.interface";
import baseSchema from "./baseSchema";

const userSchema: Schema<IUser> = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  fullName: { type: String },
  role:     { type: String, default: UserRoles.USER, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  patient:  { type: String },
  doctor:   { type:String },
  ...baseSchema,
},{ versionKey: false },);

const UserModel = model("User", userSchema);



export = { UserModel };