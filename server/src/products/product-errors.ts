export default class ProductError extends Error {
    status;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = "ProductError";
      this.status = status;
    }
  
    static argumentsDoesNotMatchIProduct() {
      return new ProductError(
        "provided arguments does not matches IProduct fields",
        400
      );
    }

    static noQuery() {
        return new ProductError(
          "request has to provide filtering query",
          400
        );
    }

    static noOffset() {
        return new ProductError(
          "request has to provide offset",
          400
        );
    }
  }