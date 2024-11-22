import jwt from 'jsonwebtoken';

import logger from '../logger.js';
import {
  isAuthorisedUser,
  authenticateUser,
  registerUser,
  isValidToken,
  isTokenExpired,
  updateUser,
  findUserByToken,
  generateTokens
} from '../services/auth.js';
import { sendVerificationEmail } from '../services/email.js';
import { ForbiddenError, UnauthorizedError } from '../errors.js';
import { HTTP_STATUS_CODES } from '../constants.js';
import { clientConfigs, cookieConfigs, jwtConfigs } from '../configs/app.js';

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

    const { accessToken, refreshToken } = authenticateUser(user._id, user.email);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // due to localhost (http)
      sameSite: 'Strict',
      maxAge: cookieConfigs.refreshTokenExpiry,
    });

    logger.info({
      id: req.id,
      message: 'User logged in',
      data: user
    });

    return res.status(HTTP_STATUS_CODES.OK).json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};

const userRegisterationHandler = async (req, res, next) => {
  try {
    const savedUser = await registerUser(req.id, req.body);

    /**
     * Ideally, we should rollback user creation if sendVerificationEmail() fails
     * as user creation and sending email are to be treated as an atomic operation.
     *
     * TODO:
     * Rather than rollbacks, we can gracefully handle email failures and
     * provide users with a way to verify again.
     */
    await sendVerificationEmail(req.id, savedUser);

    res.status(HTTP_STATUS_CODES.CREATED)
      .json({ message: 'User created successfully', data: savedUser });
  } catch (error) {
    next(error);
  }
};

const userVerificationHandler =  async (req, res, next) => {
  try {
    const token = req.params.token;
    const clientRedirectUrl = `${clientConfigs.url}/login`;

    if (!isValidToken(token)) {
      logger.info({ id: req.id, message: 'Invalid token', data: token });

      return res.redirect(`${clientRedirectUrl}?message=verification_failed`);
    }

    const userTokenDetails = await findUserByToken(token);

    if (!userTokenDetails) {
      logger.info({
        id: req.id,
        message: 'Verification token expired or invalid',
        data: token
      });

      return res.redirect(`${clientRedirectUrl}?message=verification_failed`);
    }

    if (isTokenExpired(userTokenDetails)) {
      logger.info({
        id: req.id,
        message: 'Verification token expired',
        data: userTokenDetails
      });

      return res.redirect(`${clientRedirectUrl}?message=verification_expired`);
    }

    if (userTokenDetails.isVerified) {
      logger.info({
        id: req.id,
        message: 'User already verified',
        data: userTokenDetails
      });

      return res.redirect(`${clientRedirectUrl}?message=already_verified`);
    }

    const updates = {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpiresAt: undefined
    };

    await updateUser(userTokenDetails, updates);

    logger.info({
      id: req.id,
      message: 'User verified',
      data: userTokenDetails
    });

    res.redirect(`${clientRedirectUrl}?message=verification_success`);
  } catch (error) {
    // next(error);
    logger.error({ message: 'User verification failed', error });

    return res.redirect(`${clientRedirectUrl}?message=verification_failed`);
  }
};

const refreshTokenHandler = async (req, res, next) => {
  const refreshToken = req.cookies['refresh_token'];

  if (!refreshToken) {
    return next(new UnauthorizedError('No refresh token provided'));
  }

  try {
    const payload = jwt.verify(refreshToken, jwtConfigs.refreshTokenSecret);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId, payload.email);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: false, // due to localhost (http)
      sameSite: 'Strict',
      maxAge: cookieConfigs.refreshTokenExpiry,
    });

    res.json({ accessToken, user: { email } });
  } catch (error) {
    next(new UnauthorizedError('Invalid refresh token'));
  }
};

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(new UnauthorizedError('No token provided'));

  jwt.verify(token, jwtConfigs.accessTokenSecret, (err, payload) => {
    if (err) return next(new UnauthorizedError('Invalid access token'));

    req.user = payload;
    next();
  });
};

const logoutHandler = async (req, res, next) => {
  /**
   * Accepting risks of not invalidating both tokens because:
   * 1. Refresh token is stored as http-only cookie (prevents xss).
   * 2. Access token is made short lived.
   * This is done to make user session stateless, thereby, making it performant (avoiding db calls) and simple.
   *
   * In production, I ideally will want to invalidate refresh tokens by persisting them in an
   * in-memory cache and follow blacklist/whitelist strategies. Now, omitting this for simplicity.
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