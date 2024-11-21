import { User } from '../models/User.js';

const getUserByEmailFromDb = (email, options = {}) => User.findOne({ email }).session(options.session);

const createUserInDb = (user) => User.create(user);

const findUserByIdFromDb = (userId, options = {}) => User.findById(userId).session(options.session);

const updateUserDb = (user, update, options = {}) => User.updateOne(
  { _id: user._id },
  { $set: update },
  options
);

const findUserByTokenFromDb = (verificationToken, options = {}) =>
  User.findOne({ verificationToken }).session(options.session)

export {
  getUserByEmailFromDb,
  createUserInDb,
  findUserByIdFromDb,
  updateUserDb,
  findUserByTokenFromDb
};