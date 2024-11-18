import logger from '../logger.js';
import { v4 as uuid } from 'uuid';

const requestIdGenerator = (req, res, next) => {
  req.id = uuid();
  next();
};

const requestLogger = (req, res, next) => {
  logger.info({
    id: req.id,
    message: 'Incoming request',
    method: req.method,
    path: req.path,
    body: req?.body?.password ? { ...req.body, password: '***' } : req.body
  });

  next();
};

export {
  requestIdGenerator,
  requestLogger
};