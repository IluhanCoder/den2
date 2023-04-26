import { NextFunction, Request, Response } from "express";
import userService from "./user-service.js";
import IUser from "./IUser.js";
import UserService from "./user-service.js";

export default new class UserController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {login, password, connection} = req.body;
            const service = new UserService(connection);
            const user:IUser = await service.login(login, password);
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
}