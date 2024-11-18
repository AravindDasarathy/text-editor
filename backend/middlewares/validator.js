import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';

import logger from '../logger.js';
import { userSchema } from '../schema/user.js';
import { BadRequestError } from '../errors.js';

const ajv = new Ajv();

addAjvFormats(ajv);

const userValidator = (req, res, next) => {
  try {
    const validate = ajv.compile(userSchema);
    const isValid = validate(req.body);

    if (!isValid) {
      const errors = validate.errors.map((err) => `${err.instancePath} ${err.message}`);

      logger.info({ id: req.id, message: 'Validation errors', data: errors });

      throw new BadRequestError();
    }

    next();
  } catch (error) {
    next(error);
  }
}

export { userValidator };