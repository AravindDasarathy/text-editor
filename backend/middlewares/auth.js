import jwt from 'jsonwebtoken';

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
  getTokenDetails,
  generateTokens
} from '../services/auth.js';
import { ForbiddenError, UnauthorizedError } from '../errors.js';
import { HTTP_STATUS_CODES } from '../constants.js';
import { jwtConfigs } from '../configs/app.js';

const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { isAuthorised, user } = await isAuthorisedUser(req.id, email, password);

    if (!isAuthorised) {
      throw new UnauthorizedError('Incorrect Credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenError('User not verified');
    }

    const { accessToken, refreshToken } = authenticateUser(user._id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // due to localhost (http)
      sameSite: 'Strict',
      maxAge: 2 * 60 * 1000,
    });

    logger.info({
      id: req.id,
      message: 'User logged in',
      data: user
    });

    return res.status(HTTP_STATUS_CODES.OK).json({ accessToken });
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

const refreshTokenHandler = async (req, res, next) => {
  const refreshToken = req.cookies['refresh_token'];

  if (!refreshToken) {
    return next(new UnauthorizedError('No refresh token provided'));
  }

  try {
    const payload = jwt.verify(refreshToken, jwtConfigs.refreshTokenSecret);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: false,
      // secure: true,
      sameSite: 'Strict',
      maxAge: 2 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(new ForbiddenError('Invalid refresh token'));
  }
};

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(new UnauthorizedError('No token provided'));

  jwt.verify(token, jwtConfigs.accessTokenSecret, (err, payload) => {
    console.log(err);
    if (err) return next(new ForbiddenError('Invalid access token'));

    req.user = payload;
    next();
  });
};

const logoutHandler = async (req, res, next) => {
  /**
   * Accepting risks of not invalidating both tokens because:
   * 1. Refresh token is stored as http-only cookie (prevents xss).
   * 2. Access token is made short lived.
   * This is done to make user session stateless, thereby, making it performant and simple.
   *
   * In production, I ideally will want to invalidate refresh tokens by persisting them in an
   * in-memory cache and follow blacklist/whitelist strategies. Now, omitting this for simplicity
   */
  try {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false, // due to localhost (http)
      sameSite: 'Strict',
    });

    res.status(HTTP_STATUS_CODES.OK).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  loginHandler,
  userRegisterationHandler,
  userVerificationHandler,
  refreshTokenHandler,
  verifyAccessToken,
  logoutHandler
};