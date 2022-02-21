export default class HttpException extends Error {
  statusCode?: number;
  status?: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super();

    this.statusCode = statusCode;
    this.message = message;
  }
}
