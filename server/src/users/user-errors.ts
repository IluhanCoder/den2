export default class UserError extends Error {
    status;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = "UserError";
      this.status = status;
    }
  
    static wrongPassword() {
      return new UserError(
        "wrong password",
        400
      );
    }
}