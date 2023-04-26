import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const connectionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connstring: string = req.headers.connstring.toString();
        const connection = await mongoose.createConnection(connstring);
        req.body.connection = connection;
        next();
    } catch (error) {
        next(error);
    }
}

export default connectionMiddleware;