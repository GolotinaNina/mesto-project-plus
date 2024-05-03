import { FORBIDDEN_ERROR } from '../../constants/constants';

export default class Forbidden extends Error {
  public statusCode: typeof FORBIDDEN_ERROR;

  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}
