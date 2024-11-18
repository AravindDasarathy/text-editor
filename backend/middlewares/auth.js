import logger from '../logger.js';
import {
  isAuthorisedUser,
  authenticateUser,
  registerUser,
  sendVerificationEmail,
  saveUserVerificationToken,
  isValidToken,
  isTokenExpired,
  findUserById,
  updateUser,
  getTokenDetails
} from '../services/auth.js';
import { ForbiddenError, UnauthorizedError } from '../errors.js';
import { HTTP_STATUS_CODES } from '../constants.js';

const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { isAuthorised, user } = await isAuthorisedUser(req.id, email, password);

    if (!user.isVerified) {
      throw new ForbiddenError('User not verified');
    }

    if (!isAuthorised) {
      throw new UnauthorizedError('Incorrect Credentials');
    }

    const token = authenticateUser(user._id);

    logger.info({
      id: req.id,
      message: 'User logged in',
      data: user
    });

    return res.status(HTTP_STATUS_CODES.ACCEPTED).json(token);
  } catch (error) {
    next(error);
  }
};

const userRegisterationHandler = async (req, res, next) => {
  try {
    const savedUser = await registerUser(req.id, req.body);
    const verificationUrl = await saveUserVerificationToken(req.id, savedUser);
    await sendVerificationEmail(req.id, savedUser, verificationUrl);

    res.status(HTTP_STATUS_CODES.CREATED)
      .json({ message: 'User created successfully', data: savedUser });
  } catch (error) {
    next(error);
  }
};

const userVerificationHandler =  async (req, res, next) => {
  try {
    const token = req.params.token;

    if (!isValidToken(token)) {
      logger.info({ id: req.id, message: 'Invalid token', data: token });

      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid URL' });
    }

    const tokenDetails = await getTokenDetails(token);

    if (!tokenDetails) {
      logger.info({
        id: req.id,
        message: 'Verification token expired or invalid',
        data: token
      });

      return res.status(HTTP_STATUS_CODES.FORBIDDEN).send({ message: 'URL expired or invalid '});
    }

    if (isTokenExpired(tokenDetails)) {
      logger.info({
        id: req.id,
        message: 'Verification token expired',
        data: tokenDetails
      });

      return res.status(HTTP_STATUS_CODES.FORBIDDEN).send({ message: 'URL expired' });
    }

    const user = await findUserById(tokenDetails.userId);

    if (!user) {
      logger.info({
        id: req.id,
        message: 'User not found',
        data: tokenDetails
      });

      return res.status(HTTP_STATUS_CODES.NOT_FOUND).send({ message: 'User not found' });
    }

    if (user.isVerified) {
      logger.info({
        id: req.id,
        message: 'User already verified',
        data: {
          username: user.username
        }
      });

      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Email is already verified' });
    }

    await updateUser(user, { isVerified: true });

    logger.info({
      id: req.id,
      message: 'User verified',
      data: {
        username: user.username,
        token: token
      }
    });

    res.status(HTTP_STATUS_CODES.OK).send({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  loginHandler,
  userRegisterationHandler,
  userVerificationHandler
};