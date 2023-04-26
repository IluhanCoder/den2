import mongoose from "mongoose";
import UserError from "./user-errors.js";
import UserSchema from "./user-schema.js";
import md5 from "md5";

export default class UserService {
    UserModel;

    constructor(dbConnection: mongoose.Connection) {
        dbConnection.model("User", UserSchema);
        this.UserModel = dbConnection.models.User;
    }

    async login(login: string, password: string) {
        try {
            const user = await this.UserModel.findOne({login: md5(login)});
            if(user === null) return await this.UserModel.create({login: md5(login), password: md5(password)});
            if(user.password !== md5(password)) throw UserError.wrongPassword();
            else return user;
        } catch (error) {
            throw error;
        }
    }
}