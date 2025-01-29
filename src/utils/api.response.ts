class ApiResponse {
  public success: boolean;
  constructor(
    public status: number,
    public data: any,
    public message: string = "Success"
  ) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.success = status < 400;
  }
}

export { ApiResponse };
