import { HttpStatusCode } from '../types/code.types';

class RequestError extends Error {
  code: HttpStatusCode;

  constructor(code: HttpStatusCode, message: string) {
    super(message);
    this.code = code;
  }

  internalServerError(message: string) {
    return new RequestError(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
  }

  notFoundError(message: string) {
    return new RequestError(HttpStatusCode.NOT_FOUND, message);
  }
}

export default RequestError;
