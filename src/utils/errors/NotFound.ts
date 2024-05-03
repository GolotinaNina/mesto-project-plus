import { NOT_FOUND_ERROR } from '../../constants/constants';

export default class NotFound extends Error {
  public statusCode: typeof NOT_FOUND_ERROR;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR;
  }
}
