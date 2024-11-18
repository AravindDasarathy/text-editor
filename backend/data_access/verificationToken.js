import { VerificationToken } from '../models/VerificationTokens.js';

const createUserVerificationToken = (verificationTokenModel) =>
  new VerificationToken(verificationTokenModel).save();

const getTokenFromDb = (token) => VerificationToken.findOne({ token });

export {
  createUserVerificationToken,
  getTokenFromDb
};