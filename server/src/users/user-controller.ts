import { NextFunction, Request, Response } from "express";
import userService from "./user-service.js";
import IUser from "./IUser.js";
import UserService from "./user-service.js";
import UserError from "./user-errors.js";

export default new (class UserController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password, email, connection } = req.body;
      const service = new UserService(connection);
      const user: IUser = await service.login(login, password, email);
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof UserError) {
        return res.status(error.status).send(error.name);
      }
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.params;
      const { connection } = req.body;
      const service = new UserService(connection);
      service.submitEmail(data);
      await service.submitEmail(data);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
})();
