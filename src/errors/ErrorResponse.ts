class ErrorResponse extends Error {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }
}

export default ErrorResponse;
