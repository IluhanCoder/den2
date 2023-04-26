class RequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RequestError";
    this.status = status;
  }

  static noBody() {
    return new RequestError("request has no body", 400);
  }

  static notCorresponds() {
    return new RequestError(
      "enter data not corresponds required template",
      400
    );
  }
}

export default RequestError;
