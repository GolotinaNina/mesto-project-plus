import { AUTHORIZATED_ERROR } from '../../constants/constants';

export default class Unathorized extends Error {
  public statusCode: typeof AUTHORIZATED_ERROR;

  constructor(message: string) {
    super(message);
    this.statusCode = AUTHORIZATED_ERROR;
  }
}
