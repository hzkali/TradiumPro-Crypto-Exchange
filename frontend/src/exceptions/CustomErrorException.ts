class CustomException extends Error {
  public data: any = {};
  constructor(name: string, message: string, data: any) {
    super(message);
    this.name = name;
    this.message = message;
    this.data = data;
  }
}

export default CustomException;
