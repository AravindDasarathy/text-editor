import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import {
  getUserByEmailFromDb,
  createUserInDb,
  findUserByIdFromDb,
  updateUserDb,
  findUserByTokenFromDb
} from '../data_access/user.js';
import {
  jwtConfigs,
  verificationTokenConfigs
} from '../configs/app.js';
import { ConflictError } from '../errors.js';
import logger from '../logger.js';
import validator from 'validator';

const isAuthorisedUser = async (reqId, email, password) => {
  const user = await getUserByEmailFromDb(email);

  if (!user) {
    logger.info({
      id: reqId,
      message: 'User not found',
      data: email
    });

    return {
      isAuthorised: false,
      user: null
    };
  }

  const isCorrectPassword =  await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    logger.info({ id: reqId, message: 'Incorrect password', data: email });

    return {
      isAuthorised: false,
      user: null
    };
  }

  return {
    isAuthorised: true,
    user: user
  };
};

const generateTokens = (userId, userEmail) => {
  const refreshTokenpayload = { userId };
  const accessTokenPayload = { userId, userEmail };

  const accessTokenOptions = { expiresIn: jwtConfigs.accessTokenExpiry };
  const accessToken = jwt.sign(accessTokenPayload, jwtConfigs.accessTokenSecret, accessTokenOptions);

  const refreshTokenOptions = { expiresIn: jwtConfigs.refreshTokenExpiry };
  const refreshToken = jwt.sign(refreshTokenpayload, jwtConfigs.refreshTokenSecret, refreshTokenOptions);

  return { accessToken, refreshToken };
};

const authenticateUser = (userId, userEmail) => generateTokens(userId, userEmail);

const registerUser = async (reqId, user) => {
  const existingUser = await getUserByEmailFromDb(user.email);

  if (existingUser) {
    logger.info({ id: reqId, message: 'User already exists', data: existingUser });

    throw new ConflictError('A user with this email already exists.');
  }

  user.password = await bcrypt.hash(user.password, 10);
  user.verificationToken = uuid();
  user.verificationTokenExpiresAt = new Date(new Date().getTime() + verificationTokenConfigs.expiry)

  return createUserInDb(user);
}

const isValidToken = (token) => validator.isUUID(token);

const isTokenExpired = (tokenDetails) => new Date() > tokenDetails.expiresAt;

const findUserById = (userId) => findUserByIdFromDb(userId);

const updateUser = (user, updates) => updateUserDb(user, updates);

const findUserByToken = (token) => findUserByTokenFromDb(token);

export {
  isAuthorisedUser,
  authenticateUser,
  registerUser,
  isValidToken,
  isTokenExpired,
  findUserById,
  updateUser,
  findUserByToken,
  generateTokens
};