import { HTTP_STATUS_CODES } from './constants.js';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, HTTP_STATUS_CODES.BAD_REQUEST);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access Forbidden') {
    super(message, HTTP_STATUS_CODES.FORBIDDEN);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, HTTP_STATUS_CODES.UNAUTHORIZED);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, HTTP_STATUS_CODES.NOT_FOUND);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, HTTP_STATUS_CODES.SERVICE_UNAVAILABLE)
  }
}

export {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  InternalServerError,
  ServiceUnavailableError,
  NotFoundError
};