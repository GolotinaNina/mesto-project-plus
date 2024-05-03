import { CONFLICT_ERROR } from '../../constants/constants';

export default class Conflict extends Error {
  public statusCode: typeof CONFLICT_ERROR;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}
