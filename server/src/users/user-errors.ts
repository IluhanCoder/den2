export default class UserError extends Error {
  status;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UserError";
    this.status = status;
  }

  static wrongPassword() {
    return new UserError("wrong password", 400);
  }

  static unConfirmed() {
    return new UserError("user is not confirmed", 400);
  }
}
