import { NextFunction, Request, Response } from "express";
import RequestError from "../errors/request-error.js";

/**
 * provides all of necessary functionality to valid requests
 */
class RequestChecker {
  /**
   * checks if body exists in request
   * @param req - request
   * @param res - response
   * @param next - next funciton to commit
   * @returns if request body is not empty, calls next funcion. Otherwise returns response with corresponding error
   */
  checkBody(req: Request, res: Response, next: NextFunction) {
    if (req.body !== undefined && Object.keys(req.body).length > 0)
      return next();
    const error = RequestError.noBody();
    return res.status(error.status).json(error.message);
  }
}

export default new RequestChecker();
