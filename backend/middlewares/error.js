import { HTTP_STATUS_CODES } from '../constants.js';
import logger from '../logger.js';

const undefinedRoutesHandler = (req, res, next) => {
  res.status(HTTP_STATUS_CODES.METHOD_NOT_ALLOWED);
  res.end();

  logger.info({
    id: req.id,
    message: 'Invalid route',
    method: req.method,
    path: req.path
  });
};

const globalErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode || HTTP_STATUS_CODES.SERVICE_UNAVAILABLE)
    .json({ message: err.message || 'Something went wrong' });

  const errorObj = {
    id: req.id,
    message: err.message,
    statusCode: err.statusCode,
    ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
  }

  if (err.isOperational) {
    logger.warn(errorObj);
  } else {
    logger.error(errorObj);
  }
};

export {
  undefinedRoutesHandler,
  globalErrorHandler
};