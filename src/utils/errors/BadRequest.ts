import { BAD_REQUEST_ERROR } from '../../constants/constants';

export default class BadRequest extends Error {
  public statusCode: typeof BAD_REQUEST_ERROR;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR;
  }
}
