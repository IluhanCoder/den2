import { Response } from "express";

class ErrorSenderError extends Error {
    status;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = "ErrorSenderError";
      this.status = status;
    }
  
    static noMessage() {
      return new ErrorSenderError(
        "provided error has no message",
        500
      );
    }

    static noStatus() {
        return new ErrorSenderError(
          "provided error has no status",
          500
        );
      }
}

/**
 * helps to send error's info to client, separating message, status etc into corresponding response "functions"
 * @param res - route's response that needed to be sended to client
 * @param error - error entity that needed to be "packed" into response
 * @returns response with error
 */
export default function errorSender(res: Response, error: any) {
    if(error.status === undefined) throw ErrorSenderError.noStatus();
    if(error.message === undefined) throw ErrorSenderError.noMessage();

    return res.status(error.status).send(error.message);
}