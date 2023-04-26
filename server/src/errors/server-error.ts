class ServerError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }

  static unknownError() {
    return new ServerError("unknown server error", 500);
  }
}

export default ServerError;
