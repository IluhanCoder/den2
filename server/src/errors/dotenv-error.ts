export default class DotenvError extends Error {
  status;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DotenvError";
    this.status = status;
  }

  static connectionStringError() {
    return new DotenvError(
      "problems with extracting database connection string from enviroment (may be .env file problem)",
      400
    );
  }
}
