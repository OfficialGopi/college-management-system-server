class ApiError extends Error {
  public success: boolean;
  constructor(
    public status: number = 500,
    public message: string = "Internal Server Error" // public errors: Array<any> = [], // public stack: string = ""
  ) {
    super(message);
    this.status = status;
    this.success = false;
    // this.errors = errors;
    // if (stack) {
    //   this.stack = stack;
    // } else {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}

export { ApiError };
