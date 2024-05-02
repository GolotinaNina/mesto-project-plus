import { transports, format } from 'winston';
import expressWinston from 'express-winston';

export const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({ filename: 'request.log' }),
  ],
  format: format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({ filename: 'error.log' }),
  ],
  format: format.json(),
});
