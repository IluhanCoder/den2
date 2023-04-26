import mongoose, { Schema } from "mongoose";
import IUser from "./IUser.js";

const UserSchema = new Schema<IUser>({
    login: { type: String, unique: true },
    password: String,
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false }
  });
  
  export default UserSchema;