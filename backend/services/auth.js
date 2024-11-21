import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import FormData from 'form-data';
import axios from 'axios';

import {
  getUserByEmailFromDb,
  createUserInDb,
  findUserByIdFromDb,
  updateUserDb,
  findUserByTokenFromDb
} from '../data_access/user.js';
import {
  jwtConfigs,
  mailgunConfigs,
  serverConfigs,
  verificationConfigs,
  verificationTokenConfigs
} from '../configs/app.js';
import { ConflictError, ServiceUnavailableError } from '../errors.js';
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

const generateTokens = (userId) => {
  const payload = { userId };

  const accessTokenOptions = { expiresIn: jwtConfigs.accessTokenExpiry };
  const accessToken = jwt.sign(payload, jwtConfigs.accessTokenSecret, accessTokenOptions);

  const refreshTokenOptions = { expiresIn: jwtConfigs.refreshTokenExpiry };
  const refreshToken = jwt.sign(payload, jwtConfigs.refreshTokenSecret, refreshTokenOptions);

  return { accessToken, refreshToken };
};

const authenticateUser = (userId) => generateTokens(userId);

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

const generateEmailContent = (username, url) =>
  `Hello ${username},\n\n${verificationConfigs.subject}: ${url}\n\nRegards,\nText Editor Team.`;

const sendVerificationEmail = async (reqId, user) => {
  const verificationUrl = `${serverConfigs.url}/verify/${user.verificationToken}`;
  const formData = new FormData();

  formData.append('from', verificationConfigs.fromEmail);
  formData.append('to', user.email);
  formData.append('subject', verificationConfigs.subject);
  formData.append('text', generateEmailContent(user.username, verificationUrl));

  const auth = 'Basic ' + Buffer.from(`api:${mailgunConfigs.apiKey}`).toString('base64');

  const requestDetails = {
    method: 'POST',
    url: mailgunConfigs.apiUrl,
    headers: {
      'Authorization': auth,
      ...formData.getHeaders()
    },
    data: formData,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(requestDetails);

    logger.info({ id: reqId, message: 'Email sent successfully', data: response.data });
  } catch (error) {
    logger.error({
      id: reqId,
      message: 'Mailgun API error',
      error
    });

    throw new ServiceUnavailableError('Failed to send email');
  }
};

const isValidToken = (token) => validator.isUUID(token);

const isTokenExpired = (tokenDetails) => new Date() > tokenDetails.expiresAt;

const findUserById = (userId) => findUserByIdFromDb(userId);

const updateUser = (user, updates) => updateUserDb(user, updates);

const findUserByToken = (token) => findUserByTokenFromDb(token);

export {
  isAuthorisedUser,
  authenticateUser,
  registerUser,
  sendVerificationEmail,
  isValidToken,
  isTokenExpired,
  findUserById,
  updateUser,
  findUserByToken,
  generateTokens
};